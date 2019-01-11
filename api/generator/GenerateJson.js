const { writeFile, getAllIn, readComponentFile} = require("./utils");
const fs = require("fs");

class GenerateJson {
    constructor({componentsPath, extension, scpecificPath} = {}) {
        this.componentsPath = componentsPath || "src/components/";
        this.componentsExtension = extension || ".cpp";
        this.avoidedElements = ["main"];
        this.specificPath = scpecificPath || null;
        this.specialChars = ['=', '(']
    }

    async getFileFromDir(dirPath)
    {
        var files = await getAllIn(dirPath);
        for(var i = 0; i < files.length; i++){
            var filePath = dirPath + "/" + files[i];
            var stat = fs.lstatSync(filePath);
            if (stat.isFile()){
                var val = "." + files[i].split('.')[1];
                var name = files[i].split('.')[0];
                if (this.avoidedElements.includes(name.toLowerCase())) return;
                if(val == this.componentsExtension)
                {
                    var componentCode = await readComponentFile(filePath);
                    if (componentCode) 
                    {
                        const resFilePath = dirPath + "/" + name + ".json";
                        const resJson = this.generateComponentJSON(componentCode, name);
                        await writeFile(resFilePath, resJson);
                    }
                    return;
                }
            }
        };
    }

    async generate() {

        var foulders = await getAllIn(this.componentsPath);

        if (this.specificPath != null)
        {
            this.getFileFromDir(this.componentsPath+this.specificPath);
            
        } 
        //if one specific path for one component did't declare
        // creates jsons for all components
        else 
        {
            for(var i = 0; i < foulders.length; i++){
                var filename = this.componentsPath + foulders[i];
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()){
                    this.getFileFromDir(filename);
                }
            }
        }
    }


    generateComponentJSON(componentCode, name)
    {
        var sections = {
            "characteristics table section" : [],
            "global vars section" : [],
            "funct section" : []
        };
        for(var section in sections)
        {
            this.getElementInfo(section, sections[section], componentCode);
        }
        return this.makeJson(name, sections);
    }
    
    makeJson(name, sections)
    {
        var text = `{ "name" : "${name}"`;
     
        for(var sectionName in sections)
        {

            text += `, "${sectionName}":[`;
            var oneSection = sections[sectionName];
            for (var i = 0; i < oneSection.length; i++)
            {
                if(i == (oneSection.length-1))
                {
                    text += `"${oneSection[i]}"`;
                }
                else 
                {
                    text += `"${oneSection[i]}", `;
                }
            }
            text += "]"
        }
        text += "}";
        return text;
    }

    getElementInfo(section, varsArray, componentCode)
    {
        var characteristicsCode = [];
        this.getSpecificSection(section, characteristicsCode, componentCode);
        while(characteristicsCode[0] != null)
        {
            //get viarable or function name as a value which is between ID comment and a specific symbol
            //as a = for variables and constant values or ( for a function
            var regEx = new RegExp(`(.{2}-*ID-*.{2})([\\S]*?)(\\s{1}[${this.specialChars.join()}]{1})`);
            var res = characteristicsCode[0].match(regEx,'g');
            if(res)
            {
                varsArray.push(res[2]);
                characteristicsCode[0] = characteristicsCode[0].replace(regEx, "done");
            }
            else 
            {
                break;
            }
        }
    }

    getSpecificSection(sectionName, sectionArray, componentCode)
    {
        var regEx = new RegExp(`(.*-*${sectionName}-*\\s)([\\s\\S]*?)(.*-*${sectionName} end-*)`);
        var res = componentCode.match(regEx);
        if(res)
        {
            sectionArray.push(res[2]);
        }
    }
}

module.exports = { GenerateJson };