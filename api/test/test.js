const {
    getWaysToFilesWithExtension,
    readJSON
} = require("../helpers/utils");

const {
    Codegen
} = require('../controllers/codgen');

const codgen = new Codegen({
    extension: '_test.cpp',
    mainComponent: 'main/main'
});

class Test {
    constructor({
        componentsPath,
        configExtension,
        shemaTemplatePath,
        mainTestComponentName,
        testSourceCodeExtension,
        avoidedComponents
    } = {}) {
        this.componentsPath = componentsPath || "./api/components";
        this.configExtension = configExtension || ".json";
        this.shemaTemplatePath = shemaTemplatePath || "./api/test/shemaTemplate";
        this.mainTestComponentName = mainTestComponentName || "main";
        this.testSourceCodeExtension = testSourceCodeExtension || "_test.cpp";
        this.avoidedComponents = avoidedComponents || ["main"];
    }

    async testAll() 
    {
        var shemaTemplate = await readJSON(this.shemaTemplatePath + this.configExtension);
        getWaysToFilesWithExtension(this.configExtension, this.componentsPath, 
            function(err, paths)
            {
                if (err) console.log("Ways search error " + err);
                (async function(){
                    for(var i = 0; i < paths.length; ++i)
                    {
                        var componentJSON = await readJSON(paths[i]);
                        componentJSON.id = i;
                        shemaTemplate.components.push(componentJSON);
                    }
                    return shemaTemplate;
                })().then(function(newShemaTemplate)
                        {
                            codgen.generateFrom(newShemaTemplate);
                        });
                
            });
    }
}

module.exports = {
    Test
};