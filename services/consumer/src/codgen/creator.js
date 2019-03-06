const {
    Codegen
} = require('./codgen');
const {
    RegExpGenerator
} = require("./regExpGenerator");
const {
    readJSON
} = require("../helpers/utils");
const {
    startBuild
} = require('../helpers/build-produser');

startPlease = async (shema) => {
    const codgenStandartConfigs = await readJSON("./codgen_config.json");
    const platformsConfigs = await readJSON("./platforms_config.json");
    var currentPlatformComfig = [];
    var build = false;
    switch (shema.Make) {
        case "web":
            currentPlatformComfig = platformsConfigs.web;
            break;
        case "uno":
            currentPlatformComfig = platformsConfigs.uno;
            build = true;
            break;
        default:
            throw new Error("No such platform");
    }

    var languagesSpecials = [];
    for (var oneConf of currentPlatformComfig) {

        languagesSpecials.push({
            extension: oneConf.extension,
            regExpGenerator: new RegExpGenerator(oneConf.regExpGenerator)
        });
    }

    var componentsPath = codgenStandartConfigs.componentsPath + shema.Make;
    //TO-DO ADD USER ID
    var outPath = codgenStandartConfigs.outPath + shema.Make;
    var codgen = new Codegen({
        languagesSpecials,
        componentsPath,
        soursesFoulder: codgenStandartConfigs.soursesFoulder,
        outPath
    });
   await codgen.generateFrom(shema);

    if (build) {
    
        var shema = {
            platform: shema.Make,
            path: outPath
        };
        startBuild(shema);
    }
    

}

module.exports = {
    startPlease
};