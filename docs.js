var fs = require("fs");
var path = require("path");

// var relativePath = "/content/docs/main/v8.3.1";
var relativePath = "/tmp/skywalking";

var srcPath = path.join(__dirname) + "/tmp/skywalking/docs";
var tarPath = path.join(__dirname) + "/content/docs/main/v8.3.0";
var root = path.join(__dirname) + relativePath;

// copyFile(srcPath, tarPath);
readDirSync(tarPath);

function readDirSync(path) {
  var pa = fs.readdirSync(path);
  pa.forEach(function (ele, index) {
    var info = fs.statSync(path + "/" + ele);
    if (info.isDirectory()) {
      readDirSync(path + "/" + ele);
    } else {
      var filePath = path + "/" + ele;
      const fileNameReg = /\.md/g;
      let shouldFormat = fileNameReg.test(filePath);
      if (shouldFormat) {
        readFile(filePath);
      }
    }
  });
}

function readFile(filePath) {
  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log("happen an error when read file , error is " + err);
    } else {
      var codeTxt = data.toString();
      if (!/(---[\s\S]*---)/.test(codeTxt)) {
        codeTxt =
          `---
title: Welcome
type: blog
layout: baseof
---\n` + codeTxt;
      }
      // var aa = filePath.replace(/\/tmp\//, "/content/docs/");
      // console.log(88,aa);
    }
    writeFile(filePath, codeTxt);
  });
}

function writeFile(_path, _txt) {
  fs.writeFile(_path, _txt, function (err) {
    if (err) {
      console.log("happen an error when write file , error is " + err);
    } else {
      console.log("format file success :", _path);
    }
  });
}
function copyFile(srcPath, tarPath, excludeList = []) {
  fs.readdir(srcPath, function (err, files) {
    console.log(files);
    if (err === null) {
      files.forEach(function (filename) {
        let filedir = path.join(srcPath, filename);
        let filterFlag = excludeList.some((item) => item === filename);
        if (!filterFlag) {
          fs.stat(filedir, function (errs, stats) {
            let isFile = stats.isFile();
            if (isFile) {
              const destPath = path.join(tarPath, filename);
              fs.copyFile(filedir, destPath, (err) => {});
            } else {
              let tarFiledir = path.join(tarPath, filename);
              fs.mkdir(tarFiledir, (err) => {
                console.log(err);
              });
              copyFile(filedir, tarFiledir, excludeList);
            }
          });
        }
      });
    } else {
      if (err) console.error(err);
    }
  });
}
 