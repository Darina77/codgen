const { writeFile, readComponentFile} = require("../helpers/utils");

class Codegen {
    constructor({extension, componentsPath, out, codgenCommStart, codgenCommEnd, mainComponent} = {}) {
        this.componentsPath = componentsPath || "src/components/";
        this.componentsExtension = extension || ".cpp";
        this.sections = {
            "include section" : [],
            "define section" : [],
            "global vars section" : [],
            "funct section" : [],
            "setup section" : [],
            "loop section" : []
        };
        this.out = out || "out/main";
        this.codgenCommStart = codgenCommStart || "//this code add by codgen";
        this.codgenCommEnd = codgenCommEnd || "//end";
        this.mainComponent = mainComponent || "main/main";
    }

    async generateFrom(schema) {
        var mainCode = await readComponentFile(`${this.componentsPath}${this.mainComponent}${this.componentsExtension}`);  
        for (var i = 0; i < schema.elements.length; i++)
        {
            var el = schema.elements[i];
            var componentCode = await readComponentFile(`${this.componentsPath}${el.name.toLowerCase()}/${el.name.toLowerCase()}${this.componentsExtension}`);
            this.generateComponent(el, componentCode);   
        }
        const resultCode = this.writeAll(mainCode);
        await writeFile(`${this.out}${this.componentsExtension}`, resultCode);
        return resultCode;
    }

    writeAll(mainCode)
    {
        for(var section in this.sections)
        {
            mainCode = this.writeSpecificSection(section, this.sections[section], mainCode);
        }
        return mainCode;
    }

    generateComponent({id, params}, componentCode)
    {
        //replace all id-comment
        var idRegEx = new RegExp(`(.{2}-*ID-*.{2})`, 'g');
        componentCode = componentCode.replace(idRegEx, id);
        //replace all characteristics
        for (let characteristicName in params) {
            var charactRegEx = new RegExp(`(.{2}-*{characteristicName}-*.{2})`);
            componentCode = componentCode.replace(charactRegEx, 
                                                `${params[characteristicName].value}`);
        }
        //get all sections of element
        for(var section in this.sections)
        {
            this.getSpecificSection(section, this.sections[section], componentCode);
        }
    }

    writeSpecificSection(sectionStartComment, newSectionCode, mainCode)
    {
        if(newSectionCode)
        {
            var newCode = this.codgenCommStart + newSectionCode.join() + this.codgenCommEnd;
            var regEx = new RegExp(`(.*-*${sectionStartComment}-*\\s)([\\s\\S]*?)(.*-*${sectionStartComment} end-*)`);
            mainCode = mainCode.replace(regEx, newCode);
        }
        return mainCode;
    }

    getSpecificSection(sectionName, sectionArray, componentCode)
    {
        var regEx = new RegExp(`(.{2}-*${sectionName}-*\\s)([\\s\\S]*?)(.{2}-*${sectionName} end-*)`);
        var res = componentCode.match(regEx);
        if(res)
        {
            sectionArray.push(res[2]);
        }
    }
}

function startGeneration(req, res) {   
    const codegen = new Codegen({
        extension: ".cpp", 
        componentsPath: "api/components/",
        out: "api/out/main"
    });  
    const code = codegen.generateFrom(req.body);
    code.then(function(result){
        console.log(result);
        res.json(result);
    });
}

module.exports = { startGeneration };
