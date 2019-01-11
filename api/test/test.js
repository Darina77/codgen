const {getAllFilesIn, readJSON} = require("../helpers/utils");
const fs = require("fs");
//const {Codegen} = require('../controllers/codgen');

class Test {

    constructor({componentsPath, componentsTemplatePath, out} = {}) {
        this.componentsPath = componentsPath || "./api/components/";
        this.componentsTemplatePath = componentsTemplatePath || "./api/test/shemaTemplate.json"
        this.out = out || "./out/main_test";   
        this.avoidedElements = ["main"];
        this.shemaTemplate;
    }

   async testAll() {
        var foulders = await getAllFilesIn(this.componentsPath);
        this.shemaTemplate = await readJSON(this.componentsTemplatePath);
        for(var i = 0; i < foulders.length; i++){
            var name = this.componentsPath + foulders[i];
            var stat = fs.lstatSync(name);
            if (stat.isDirectory()){
                this.getFileFromDir(name);
            }
        }
        //console.log(JSON.stringify(this.shemaTemplate));
    }

    async getFileFromDir(dirPath)
    {
        var files = await getAllFilesIn(dirPath);
        for(var i = 0; i < files.length; i++){
            var filePath = dirPath + "/"+ files[i];
            var stat = fs.lstatSync(filePath);
            if (stat.isFile()){
                var val = "." + files[i].split('.')[1];
                var name = files[i].split('.')[0].toLowerCase();
                if (this.avoidedElements.includes(name)) return;
                if (val == ".json")
                {
                    var componentJSON = await readJSON(filePath);
                    componentJSON.id = i;
                    console.log(JSON.stringify(componentJSON));
                    this.shemaTemplate.components.push(componentJSON);
                    console.log(JSON.stringify(this.shemaTemplate));
                }
            }
        }
    }

    codgenGen(shemaTemplate)
    {
        //TODO
    }
   
}

module.exports = { Test };