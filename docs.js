const fs = require("fs");
const path = require("path");
const dirTree = require("directory-tree");
const YAML = require('json-to-pretty-yaml');


const tarPath = "/content/docs/main/v8.3.0";
const root = path.join(__dirname, tarPath);

readDirSync(root);

let filteredTree = dirTree(root, {extensions: /\.md/});
handleJson(filteredTree)

setTimeout(() => {
  writeFile('docMenu.yml', YAML.stringify(filteredTree));
}, 0)

function readDirSync(path) {
  const pa = fs.readdirSync(path);
  pa.forEach(function (ele, index) {
    const info = fs.statSync(path + "/" + ele);
    if (info.isDirectory()) {
      readDirSync(path + "/" + ele);
    } else {
      const filePath = path + "/" + ele;
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
      let codeTxt = data.toString();

      if (!/^([\s]*)(---[\s\S]*---)/.test(codeTxt)) {
        let title = codeTxt.trim().split('\n')[0]
        title = title.match(/(?<=([ ])).*/g)[0];

        codeTxt =
            `---
title: ${title}
type: projectDoc
layout: baseof
---\n` + codeTxt;
        codeTxt = codeTxt
            .replace(/(\[[\s\S]*?\])\(([\s\S]*?)\)/g, function (match, p1, p2) {
              if (p2 && p2.startsWith('http')) {
                return match
              }
              const str = p2
                  .replace(/README.md/gi, 'readme')
                  .replace(/\.md/g, '')

              if (!str.startsWith('#') && (filePath.toUpperCase().includes('README') || !str.includes('/'))) {
                return `${p1}(../${str})`
              }
              return `${p1}(${str})`
            })
      }

      writeFile(filePath, codeTxt);
    }
  });
}

function writeFile(_path, _txt) {
  fs.writeFile(_path, _txt, function (err) {
    if (err) {
      console.log("happen an error when write file , error is " + err);
    } else {
      // console.log("format file success :", _path);
    }
  });
}


function handleJson(data) {
  data.path = data.path.split('/content')[1];
  data.path = data.path.toLowerCase()
      .replace('.md', '');
  data.name = data.name.split('.')[0];
  if (data.name !== 'FAQ') {
    data.name = data.name.toLowerCase()
  }
  if (data.children) {
    data.children.forEach(item => {
      handleJson(item)
    })
  }
}
