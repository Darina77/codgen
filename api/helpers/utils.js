const fs = require("fs");
const { promisify } = require("util");

const writeFile = async (outFile, data) => {
  //await promisify(fs.truncate)(outFile, 0);
  await promisify(fs.writeFile)(outFile, data, {encoding: "utf8", flag: "w"});
};

const readJSON = async fileName => {
  const conent = await promisify(fs.readFile)(fileName, "utf-8");
  return JSON.parse(conent);
};

const readComponentFile = async fileName => {
  const componentContent = await promisify(fs.readFile)(fileName, "utf-8");
  return componentContent;
};

const getAllFilesIn = async (path) => {
  const val = await promisify(fs.readdir)(path);
  return val;
};

module.exports = {writeFile, readJSON,  readComponentFile, getAllFilesIn};
