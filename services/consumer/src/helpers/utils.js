const fs = require("fs");
const {
  promisify
} = require("util");

const writeFile = async (outFile, data) => {
  const foulderPath = outFile.substring(0, outFile.lastIndexOf("/"));
  if (!fs.existsSync(foulderPath)){
    fs.mkdirSync(foulderPath);
  }
  await promisify(fs.writeFile)(outFile, data, {
    encoding: "utf8"
  });
};

const readJSON = async fileName => {
  const conent = await promisify(fs.readFile)(fileName, "utf-8");
  return JSON.parse(conent);
};

const readComponentFile = async fileName => {
  const componentContent = await promisify(fs.readFile)(fileName, "utf-8");
  return componentContent;
};

const getWaysToFilesWithExtension = async (extension, startPath, callback) => 
{
  var results = [];
  return promisify(fs.readdir)(startPath, function (err, list) 
  {
      if (err) return callback(err);
      var i = 0;
      (function next()
      {
        var file = list[i++];
        if (!file) return callback(null, results);
        file = startPath + '/' + file;
        fs.stat(file, async function (err, stat) 
        {
          if (stat && stat.isDirectory()) 
          {
            getWaysToFilesWithExtension(extension, file, function (err, res) 
            {
              results = results.concat(res);
              next();
            });
          } 
          else 
          {
            var fileEx = "." + file.split('.')[2];
            if (fileEx == extension) 
            {
              results.push(file);
            }
            next();
          }
        });
      })();
  });
};


module.exports = {
  writeFile,
  readJSON,
  readComponentFile,
  getWaysToFilesWithExtension
};