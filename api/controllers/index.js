const {
    startCodgenPlease
} = require('../controllers/codgenCreator');
const {
    readJSON
} = require("../helpers/utils");


var shemaTemplate =  readJSON("./schemaFromFractal.json");
shemaTemplate.then(function(shema)
{
    codgen = startCodgenPlease(shema);
});
