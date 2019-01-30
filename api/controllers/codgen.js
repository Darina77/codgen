const {
    writeFile,
    readComponentFile
} = require("../helpers/utils");

const {
    RegExpGenerator
} = require("../controllers/regExpGenerator");

const {
    OneComponent
} = require("../controllers/oneComponent");

class Codegen {
    constructor({
        extensions,
        oneLineComment,
        manyLineCommentStart,
        manyLineCommentEnd,
        componentsPath,
        outPath
    } = {}) {
        this.componentsPath = componentsPath || "api/components"; //Путь к библиотеке компонетов
        //this.componentsExtensions = extensions || [".cpp"]; //Разширения исходного кода компонента
        this.regExpGenerator = new RegExpGenerator({ //Создает регулярные выражения
            oneLineComment, //обозначения начала однострочного коментария                        
            manyLineCommentStart, //обозначение начала многострочного коментария
            manyLineCommentEnd //обозначение конца многострочного коментария
        });
        this.components = [];
        this.resultComponents = [];
        this.resultCompSection = "result component";
        this.outPath = outPath || "api/out"; //Путь к результатy кодогенерaци
    }

    //Для начала генерации нужно вызвать этот метод
    //shema - это json который получили от клиента 
    async generateFrom(schema) {
        for (var extension of this.componentsExtensions) {
            //Для каждого компонента в схеме
            for (var component of schema.components) {

                var oneComponentName = component.name.toLowerCase();
                try {
                    //Находим код компонента
                    var componentCode = await readComponentFile(this.componentsPath + '/' + oneComponentName +
                        '/' + oneComponentName + extension);

                    var id = component.id;
                    var params = component.params;
                    var defaultResComponents = this.findResComponents(componentCode);

                    componentCode = this.replaceId(id, componentCode);
                    componentCode = this.replaceParams(params, componentCode);

                    var oneComponent = new OneComponent({
                        id,
                        code: componentCode,
                        defaultResComponents
                    });
                    for (var section in oneComponent.sections) {
                        var sectionCode = this.getSpecificSection(section, oneComponent.code, false);
                        var resComponents = this.findResComponents(sectionCode);
                        oneComponent.putInSection(section, sectionCode, resComponents);
                    }
                    this.components.push(oneComponent);

                } catch (e) {
                    //console.log("No such component source code");
                    //console.log(e);
                    throw e;
                }
            }

            for (var oneResultComponent of this.resultComponents) {

                var mainCode = await readComponentFile(this.componentsPath + '/' + oneResultComponent + '/' +
                    oneResultComponent + extension);

                const resultCode = this.writeComponentsTo(oneResultComponent, mainCode);
                //Записываем полученый код конечного компонента в файл
                const resultCodeWay = `${this.outPath}/${oneResultComponent}${extension}`;
                await writeFile(resultCodeWay, resultCode);
                console.log("Codegeneration completed! See your result  - " + resultCodeWay);
            }
        }
    }

    //Записывает код всех секций в один общий компонент
    writeComponentsTo(resultComponentName, mainCode) {
        for (var oneComponent of this.components) {
            for (var section in oneComponent.sections) {
                var sectionData = oneComponent.sections[section];
                if (sectionData.resFiles.length > 0) {
                    if (sectionData.resFiles.includes(resultComponentName)) {
                        mainCode = this.writeSpecificSection(section, sectionData.codeInOneSection, mainCode);
                    }
                } else {
                    if(oneComponent.defaultResComponents.includes(resultComponentName))
                    {
                        mainCode = this.writeSpecificSection(section, sectionData.codeInOneSection, mainCode);
                    }
                }
            }
        }
        return mainCode;
    }

    //Записывает код определенной секции в соответсвующую секцию компонента
    writeSpecificSection(sectionStartComment, newSectionCode, mainCode) {
        if (newSectionCode) {
            var regEx = this.regExpGenerator.getSectionRexExp(sectionStartComment, false);
            mainCode = mainCode.replace(regEx, '$1' + '$2' + newSectionCode + '$3'); // Заменяет отмеченую секцию кодом 
        }
        return mainCode;
    }

    findResComponents(code) {
        var resComponents = this.regExpGenerator.clearLinesFromSpaces( //Очищаем от лишних пробелов
            this.regExpGenerator.getLinesWithoutComment( //Результирующие компненты очищаем от строк коментария
                this.getSpecificSection(this.resultCompSection, code, false) //Ищем секцию с указаными результирующими компонентами
            )
        );
        //Найдя что-то добавляем в общий масив результирующих компонентов
        for (var oneComponent of resComponents) {
            if (!this.resultComponents.includes(oneComponent)) {
                this.resultComponents.push(oneComponent);
            }
        }
        return resComponents;
    }

    //id - уникальный индификтор компонента
    //componentCode - исходный код компонента
    //Находит и заменяет все коментарии по типу /*--ID--*/ и заменяет их 
    replaceId(id, componentCode) {
        var idRegEx = this.regExpGenerator.getAllValueRegExp();
        componentCode = componentCode.replace(idRegEx, id);
        return componentCode;
    }

    //Находит и заменяет все значения характеристик с соответвующим названияем в коментарии к коду
    replaceParams(params, componentCode) {
        for (let paramName in params) {
            var charactRegEx = this.regExpGenerator.getParamRegExp(paramName);
            componentCode = componentCode.replace(charactRegEx,
                `${params[paramName]}`);
        }
        return componentCode;
    }

    //Находит код указанной секции 
    //sectionName - название секции
    //componentCode - код компонента в котором нужно искать
    getSpecificSection(sectionName, componentCode, manyLineMode) {
        if (componentCode) {
            var regEx = this.regExpGenerator.getSectionRexExp(sectionName, manyLineMode)
            var res = componentCode.match(regEx); //Ищет код секции по регулярному выражению
            if (res) {
                return res[2];
            } else return "";
        } else throw new Error("No component code");
    }


}

module.exports = {
    Codegen
};