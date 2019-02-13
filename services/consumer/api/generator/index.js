const { GenerateJson } = require("./GenerateJson.js");

const generator = new GenerateJson({
  extension: ".cpp", 
  componentsPath: "./src/components/"
});

generator.generate();
