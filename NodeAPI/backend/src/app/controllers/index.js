// import all the controler and router in this file
// use fs and path , node package for read files
const fs = require('fs');
const path = require('path');

module.exports = app => {
  fs
    // read all the controller into the folder
    .readdirSync(__dirname)
    // filter all the files which dosent start with . and index
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== 'index.js')))
    // loop thorugh and impor app
    .forEach(file => require(path.resolve(__dirname, file))(app));
};
