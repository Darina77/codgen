
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
       this.sections = [];
    }

    //Метод чтобы положить в секцию данные
    //section - название секции
    //codeInOneSection - код в этой секции
    //resFiles - результирующие компоненты
    addSection(name, code, resFiles)
    {
        this.sections.push({name, code, resFiles});
    }

    
}

module.exports = { OneComponent };