const {
    Codegen
} = require('../controllers/codgen');
const {
    readJSON
} = require("../helpers/utils");
const codgen = new Codegen({
    extension: '.cpp',
    oneLineComment: '//',
    manyLineCommentStart: '/*',
    manyLineCommentEnd: '*/',
    mainComponent: 'main/main'
});

var shemaTemplate =  readJSON("./schemaFromFractal.json");
shemaTemplate.then(function(shema)
{
    codgen.generateFrom(shema);
});
