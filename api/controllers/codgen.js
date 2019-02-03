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
        //особенности языков платформы для которой генерируется
        //хранит массив с обьектами
        //в обьектах хранится разширение файлов исходного кода
        //и вид коментария в языке который используется для этой платформы
        languagesSpecials,
        //путь к компонентам
        componentsPath,
        //название папки исходного кода в папке компонета
        soursesFoulder,
        //путь к результату генерации
        outPath
    } = {}) {
        this.languagesSpecials = languagesSpecials || [{
            extension: ".cpp",
            regExpGenerator: new RegExpGenerator({
                oneLineComment: "//",
                manyLineCommentStart: "/*",
                manyLineCommentEnd: "*/"
            })
        }];
        this.componentsPath = componentsPath || "api/components/arduino";
        this.soursesFoulder = soursesFoulder || "src";
        this.outPath = outPath || "api/out";

        this.components = [];
        this.resultComponents = [];
        this.resultCompSection = "result component";
    }

    //Для начала генерации нужно вызвать этот метод
    //shema - это json который получили от клиента 
    async generateFrom(schema) {
        //Для каждого набора особеностей
        for (var specials of this.languagesSpecials) {
            this.components = [];
            this.resultComponents = [];
            //Для каждого компонента в схеме
            for (var component of schema.components) {
                //Берем имя компонента
                var oneComponentName = component.name.toLowerCase();
                try {
                    //Находим код компонента
                    var componentCode = await readComponentFile(this.componentsPath + '/' + oneComponentName +
                        '/' + this.soursesFoulder + '/' + oneComponentName + specials.extension);
                    //Берем id компонента
                    var id = component.id;
                    //Берем характеристики компонента
                    var params = component.params;
                    //С заголовка берем результирующий компонент по умолчанию
                    var defaultResComponents = this.findResComponents(componentCode, specials.regExpGenerator);

                    //Заменяем id в исходном коде компонента
                    componentCode = this.replaceId(id, componentCode, specials.regExpGenerator);
                    //Заменяем характерстика в исходном коде компонента
                    componentCode = this.replaceParams(params, componentCode, specials.regExpGenerator);

                    //Создаем обьект для одного компонента
                    var oneComponent = new OneComponent({
                        id,
                        code: componentCode,
                        defaultResComponents
                    });
                    //Разбиваем код компонента по секциям
                    for (var section in oneComponent.sections) {
                        //Ищем код этой секции
                        var sectionCode = this.getSpecificSection(section, oneComponent.code, specials.regExpGenerator);
                        //Ищем особые результирующие компонеты для этой секции
                        var resComponents = this.findResComponents(sectionCode, specials.regExpGenerator);
                        //Сохраняем в компоненте код и набор компонентов результата для соотвецтвующей секции
                        oneComponent.putInSection(section, sectionCode, resComponents);
                    }
                    //Сохраняем компонент в кодгене
                    this.components.push(oneComponent);

                } catch (e) {
                    console.log("No such component source code");
                    throw(e);
                }
            }

            //После обработки компонентов генерируем файлы с результатом
            //Для каждого результирующего компонента    
            for (var oneResultComponent of this.resultComponents) {
                //Ищем его исхоный код
                var mainCode = await readComponentFile(this.componentsPath + '/' + oneResultComponent + '/' + this.soursesFoulder + '/' + oneResultComponent + specials.extension);
                //Дополняем исходный код код компонентов которые должны дописыватся в это файл
                const resultCode = this.writeComponentsTo(oneResultComponent, mainCode, specials.regExpGenerator);
                //Записываем полученый код конечного компонента в файл
                const resultCodeWay = `${this.outPath}/${oneResultComponent}${specials.extension}`;
                await writeFile(resultCodeWay, resultCode);
                console.log("Codegeneration completed! See your result  - " + resultCodeWay);
            }
        }
    }

    //Записывает код всех секций в один общий компонент
    //resultComponentName - имя результирующего компонента
    //mainCode - код результирующего компонента
    //regExpGenerator - генератор регулярных выражений в этой платформе
    //Возвращает дополненый код результирующего компонента
    writeComponentsTo(resultComponentName, mainCode, regExpGenerator) {
        for (var oneComponent of this.components) {
            for (var section in oneComponent.sections) {
                var sectionData = oneComponent.sections[section];
                if (sectionData.resFiles.length > 0) {
                    if (sectionData.resFiles.includes(resultComponentName)) {
                        mainCode = this.writeSpecificSection(section, sectionData.codeInOneSection, mainCode, regExpGenerator);
                    }
                } else {
                    if (oneComponent.defaultResComponents.includes(resultComponentName)) {
                        mainCode = this.writeSpecificSection(section, sectionData.codeInOneSection, mainCode, regExpGenerator);
                    }
                }
            }
        }
        return mainCode;
    }

    //Записывает код определенной секции в соответсвующую секцию компонента
    //sectionName - название секции
    //newSectionCode - дополнительный код секции
    //mainCode - код результирующего 
    //regExpGenerator - генератор регулярных выражений в этой платформе
    //Возвращает дополненый код результирующего компонента
    writeSpecificSection(sectionName, newSectionCode, mainCode, regExpGenerator) {
        if (newSectionCode) {
            var regEx = regExpGenerator.getSectionRexExp(sectionName);
            mainCode = mainCode.replace(regEx, '$1' + '$2' + newSectionCode + '$3'); // Заменяет отмеченую секцию кодом 
        }
        return mainCode;
    }

    findResComponents(code, regExpGenerator) {
        var resComponents = regExpGenerator.clearLinesFromSpaces( //Очищаем от лишних пробелов
            regExpGenerator.getLinesWithoutComment( //Результирующие компненты очищаем от строк коментария
                this.getSpecificSection(this.resultCompSection, code, regExpGenerator) //Ищем секцию с указаными результирующими компонентами
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
    //regExpGenerator - генератор регулярных выражений в этой платформе
    //Находит и заменяет все коментарии по типу /*--ID--*/ и заменяет их 
    replaceId(id, componentCode, regExpGenerator) {
        var idRegEx = regExpGenerator.getAllValueRegExp();
        componentCode = componentCode.replace(idRegEx, id);
        return componentCode;
    }

    //Находит и заменяет все значения характеристик с соответвующим названияем в коментарии к коду
    //params - характеристики
    //componentCode - код компонента
    //regExpGenerator - генератор регулярных выражений в этой платформе
    //Возвращает дополненый код
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
    getSpecificSection(sectionName, componentCode, regExpGenerator) {
        if (componentCode != undefined) {
            var regEx = regExpGenerator.getSectionRexExp(sectionName)
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