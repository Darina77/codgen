const fs = require("fs");
const { promisify } = require("util");

const writeFile = async (outFile, data) => {
  await promisify(fs.writeFile)(outFile, data, {encoding: "utf8", flag: "w"});
};

const getAllFilesIn = async (path) => {
  const val = await promisify(fs.readdir)(path);
  return val;
};

const readComponentFile = async fileName => {
  const componentContent = await promisify(fs.readFile)(fileName, "utf-8");
  return componentContent;
};

const readJSON = async fileName => {
  const conent = await promisify(fs.readFile)(fileName, "utf-8");
  return JSON.parse(conent);
};

module.exports = {writeFile, getAllFilesIn,  readJSON, readComponentFile};
