const fs = require("fs");
const path = require("path");
const YAML = require('yamljs');
const {execSync} = require("child_process");
const {promises} = fs;
const docConfig = './data/docs.yml';
const layoutTemplateFile = '/themes/docsy/layouts/projectDoc/baseof.html';

traverseDocsConfig()

function readDirSync(path, handleCodeTxt) {
  const pa = fs.readdirSync(path);
  pa.forEach(function (ele, index) {
    const info = fs.statSync(path + "/" + ele);
    if (info.isDirectory()) {
      readDirSync(path + "/" + ele, handleCodeTxt);
    } else {
      const filePath = path + "/" + ele;
      const fileNameReg = /\.md/g;
      let shouldFormat = fileNameReg.test(filePath);
      if (shouldFormat) {
        readFile(filePath, handleCodeTxt);
      }
    }
  });
}

function readFile(filePath, handleCodeTxt) {
  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log("happen an error when read file , error is " + err);
    } else {
      let codeTxt = data.toString();
      codeTxt = handleCodeTxt(codeTxt)
      writeFile(filePath, codeTxt);
    }
  });
}

function replaceMarkdownText(codeTxt) {
  if (!/^([\s]*)(---[\s\S]*---)/.test(codeTxt)) {
    let title = codeTxt.trim().split('\n')[0]
    title = title.match(/(?<=([ ])).*/g)[0];
    title = title.replace(/:/g, '：')

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
              .toLowerCase()
              .replace(/\.md/g, '')

          if (str.startsWith('#')) {
            return `${p1}(${str})`
          }
          if (str.startsWith('./')) {
            return `${p1}(./../${str})`
          }
          return `${p1}(../${str})`
        })
  }
  return codeTxt
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


function traverseDocsConfig() {
  let tpl = '';
  const docsLocalPath = []
  const targetPath = path.join(__dirname, layoutTemplateFile)
  YAML.load(docConfig, async function (result) {
    result.forEach(data => {
      data.list.forEach(item => {
        item.docs && item.docs.forEach(({localPath, sidebarConfigFile, commitId}) => {
          if (localPath && sidebarConfigFile) {
            docsLocalPath.push({localPath, sidebarConfigFile})

            tpl += `{{ if in .File.Path "${localPath.split('/content/')[1]}" }}
                    {{ partial "sidebar-recurse.html" .Site.Data.docSidebar.${sidebarConfigFile} }}
                    {{ end }}\n`

            execSync(`"./doc.sh" ${item.repo} ${item.gitUrl} ${commitId} ${localPath}`);

          }
        })
      })

    })

    await generateLayoutTemplate(targetPath, tpl)
    handleDocsFiles(docsLocalPath)
  });

}

async function generateLayoutTemplate(targetPath, tpl) {
  let codeTxt = await promises.readFile(targetPath, 'utf8');
  codeTxt = codeTxt.toString()
  codeTxt = codeTxt.replace(/(td-sidebar">)([\s\S]*)(<\/div>[\s\S]*<div id="toc")/, function (match, p1, p2, p3) {
    return `${p1}\n${tpl}\n${p3}`
  })
  await promises.writeFile(targetPath, codeTxt, 'utf8');
}

function handleDocsFiles(docsLocalPath) {
  docsLocalPath.forEach(({localPath}) => {
    const root = path.join(__dirname, localPath);
    readDirSync(root, replaceMarkdownText);
  })
}

