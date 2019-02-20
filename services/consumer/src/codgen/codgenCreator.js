const {
    Codegen
} = require('../codgen/codgen');

const {
    RegExpGenerator
} = require("../codgen/regExpGenerator");
const {
    readJSON
} = require("../helpers/utils");


startCodgenPlease = async (shema) => {
    const codgenStandartConfigs = await readJSON("./codgen_config.json");
    const platformsConfigs = await readJSON("./platforms_config.json");
    var currentPlatformComfig = [];
    switch (shema.Make) {
        case "web":
            currentPlatformComfig = platformsConfigs.web;
            break;
        case "arduino":
            currentPlatformComfig = platformsConfigs.arduino;
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
    var outPath = codgenStandartConfigs.outPath + shema.Make;
    var codgen = new Codegen({
        languagesSpecials,
        componentsPath,
        soursesFoulder: codgenStandartConfigs.soursesFoulder,
        outPath
    });
    codgen.generateFrom(shema);
}

module.exports = {
    startCodgenPlease
};