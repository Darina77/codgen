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
        languagesSpecials,
        componentsPath,
        soursesFoulder,
        outPath
    } = {}) {
        this.languagesSpecials = languagesSpecials || 
            [{extension:  ".cpp", 
            regExpGenerator: 
                new RegExpGenerator({oneLineComment:"//", manyLineCommentStart:"/*", manyLineCommentEnd:"*/"})
            }];
        this.componentsPath = componentsPath || "api/components/arduino"; //Путь к библиотеке компонетов платформы
        this.soursesFoulder = soursesFoulder || "src"; // Путь к исходному коду компонента
        this.outPath = outPath || "api/out"; //Путь к результатy кодогенерaци

        this.components = [];
        this.resultComponents = [];
        this.resultCompSection = "result component"; 
    }

    //Для начала генерации нужно вызвать этот метод
    //shema - это json который получили от клиента 
    async generateFrom(schema) {
        for (var specials of this.languagesSpecials) {
            //Для каждого компонента в схеме
            for (var component of schema.components) {

                var oneComponentName = component.name.toLowerCase();
                try {
                    //Находим код компонента
                    var componentCode = await readComponentFile(this.componentsPath + '/' + oneComponentName +
                        '/'+ this.soursesFoulder + '/'+ oneComponentName + specials.extension);

                    var id = component.id;
                    var params = component.params;
                    var defaultResComponents = this.findResComponents(componentCode, specials.regExpGenerator);

                    componentCode = this.replaceId(id, componentCode, specials.regExpGenerator);
                    componentCode = this.replaceParams(params, componentCode, specials.regExpGenerator);

                    var oneComponent = new OneComponent({
                        id,
                        code: componentCode,
                        defaultResComponents
                    });
                    for (var section in oneComponent.sections) {
                        var sectionCode = this.getSpecificSection(section, oneComponent.code, specials.regExpGenerator, false);
                        var resComponents = this.findResComponents(sectionCode, specials.regExpGenerator);
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

                var mainCode = await readComponentFile(this.componentsPath + '/' + oneResultComponent + '/' + this.soursesFoulder + '/'+ oneResultComponent + specials.extension);

                const resultCode = this.writeComponentsTo(oneResultComponent, mainCode, specials.regExpGenerator);
                //Записываем полученый код конечного компонента в файл
                const resultCodeWay = `${this.outPath}/${oneResultComponent}${specials.extension}`;
                await writeFile(resultCodeWay, resultCode);
                console.log("Codegeneration completed! See your result  - " + resultCodeWay);
            }
        }
    }

    //Записывает код всех секций в один общий компонент
    writeComponentsTo(resultComponentName, mainCode, regExpGenerator) {
        for (var oneComponent of this.components) {
            for (var section in oneComponent.sections) {
                var sectionData = oneComponent.sections[section];
                if (sectionData.resFiles.length > 0) {
                    if (sectionData.resFiles.includes(resultComponentName)) {
                        mainCode = this.writeSpecificSection(section, sectionData.codeInOneSection, mainCode, regExpGenerator);
                    }
                } else {
                    if(oneComponent.defaultResComponents.includes(resultComponentName))
                    {
                        mainCode = this.writeSpecificSection(section, sectionData.codeInOneSection, mainCode, regExpGenerator);
                    }
                }
            }
        }
        return mainCode;
    }

    //Записывает код определенной секции в соответсвующую секцию компонента
    writeSpecificSection(sectionStartComment, newSectionCode, mainCode, regExpGenerator) {
        if (newSectionCode) {
            var regEx = regExpGenerator.getSectionRexExp(sectionStartComment, false);
            mainCode = mainCode.replace(regEx, '$1' + '$2' + newSectionCode + '$3'); // Заменяет отмеченую секцию кодом 
        }
        return mainCode;
    }

    findResComponents(code, regExpGenerator) {
        var resComponents = regExpGenerator.clearLinesFromSpaces( //Очищаем от лишних пробелов
            regExpGenerator.getLinesWithoutComment( //Результирующие компненты очищаем от строк коментария
                this.getSpecificSection(this.resultCompSection, code, regExpGenerator, false) //Ищем секцию с указаными результирующими компонентами
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
    replaceId(id, componentCode, regExpGenerator) {
        var idRegEx = regExpGenerator.getAllValueRegExp();
        componentCode = componentCode.replace(idRegEx, id);
        return componentCode;
    }

    //Находит и заменяет все значения характеристик с соответвующим названияем в коментарии к коду
    replaceParams(params, componentCode, regExpGenerator) {
        for (let paramName in params) {
            var charactRegEx = regExpGenerator.getParamRegExp(paramName);
            componentCode = componentCode.replace(charactRegEx,
                `${params[paramName]}`);
        }
        return componentCode;
    }

    //Находит код указанной секции 
    //sectionName - название секции
    //componentCode - код компонента в котором нужно искать
    getSpecificSection(sectionName, componentCode, regExpGenerator, manyLineMode) {
        if (componentCode) {
            var regEx = regExpGenerator.getSectionRexExp(sectionName, manyLineMode)
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