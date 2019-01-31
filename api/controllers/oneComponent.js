
//Класс для хранения данных о компоненте
//Необходимые для кодогенерации
class OneComponent {
    constructor({
        id, //id компонента
        code, // код компонента
        defaultResComponents // стандартные результирующие компоненты
    } = {})
    {
       this.id = id, 
       this.code = code,
       this.defaultResComponents = defaultResComponents,
       // Сеукции копонента
       // Хранят обьекты с кодом секции
       // И с массивом результирующих компонентов для этой секции
       this.sections =
       {
        "include section": {},
        "define section": {},
        "global vars section": {},
        "funct section": {},
        "setup section": {},
        "loop section": {},
        "characteristics table section": {}
        };
    }

    //Метод чтобы положить в секцию данные
    //section - название секции
    //codeInOneSection - код в этой секции
    //resFiles - результирующие компоненты
    putInSection(section, codeInOneSection, resFiles)
    {
        this.sections[section] = {codeInOneSection, resFiles}
    }

    //Метод чтобы получить данные с секции
    //section - название секции
    getFromSection(section)
    {
        return this.sections[section];
    }
    
}

module.exports = { OneComponent };