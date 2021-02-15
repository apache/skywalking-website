const fs = require("fs");
const path = require("path");
const YAML = require('yamljs');
const {execSync} = require("child_process");
const {promises} = fs;
const docConfig = './data/docs.yml';
const layoutTemplateFile = '/themes/docsy/layouts/projectDoc/baseof.html';
const docDirList = ['concepts-and-designs', 'FAQ', 'guides', 'protocols', 'setup', 'ui']

traverseDocsConfig()

function readDirSync(path, handleCodeTxt, docInfo) {
  const pa = fs.readdirSync(path);
  pa.forEach(function (ele, index) {
    const info = fs.statSync(path + "/" + ele);
    if (info.isDirectory()) {
      readDirSync(path + "/" + ele, handleCodeTxt, docInfo);
    } else {
      const filePath = path + "/" + ele;
      const fileNameReg = /\.md/g;
      let shouldFormat = fileNameReg.test(filePath);
      if (shouldFormat) {
        readFile(filePath, handleCodeTxt, docInfo);
      }
    }
  });
}

function readFile(filePath, handleCodeTxt, docInfo) {
  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log("happen an error when read file , error is " + err);
    } else {
      let codeTxt = data.toString();
      codeTxt = handleCodeTxt(codeTxt, docInfo)
      writeFile(filePath, codeTxt);
    }
  });
}

function replaceMarkdownText(codeTxt, docInfo) {
  if (!/^([\s]*)(---[\s\S]*---)/.test(codeTxt)) {
    const {repoUrl, commitId} = docInfo;
    const prefix = repoUrl.replace('.git', '/tree') + `/${commitId}`

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
          if (str.includes('../changes')) {
            return `${p1}(${prefix}/changes)`
          }
          if (str.includes('../../../')) {
            const url = str.replace(/\.\.\//g, '')
            if (!docDirList.some(dir => url.includes(dir))) {
              return `${p1}(${prefix}/${url})`
            }
          }
          return `${p1}(../${str})`
        })
  }
  return codeTxt
}

function writeFile(filePath, codeTxt) {
  fs.writeFile(filePath, codeTxt, function (err) {
    if (err) {
      console.log("happen an error when write file , error is " + err);
    }
  });
}


async function traverseDocsConfig() {
  let tpl = '';
  const docsInfo = []
  const targetPath = path.join(__dirname, layoutTemplateFile)
  const result = await loadYaml(docConfig)
  result.forEach(data => {
    data.list.forEach(item => {
      item.docs && item.docs.forEach(({version, commitId}) => {
        if (commitId) {
          const {repo, repoUrl} = item;
          const docName = repo === 'skywalking' ? 'main' : repo;
          const localPath = `/content/docs/${docName}/${version}`;
          const menuFileName = `${docName}${version}`.replace(/v|\./g, '_');
          docsInfo.push({localPath, repoUrl, commitId})

          tpl += `{{ if in .File.Path "${localPath.split('/content/')[1]}" }}
                    <h5>Documentation: {{.Site.Data.docSidebar.${menuFileName}.version}}</h5>
                    {{ partial "sidebar-recurse.html" .Site.Data.docSidebar.${menuFileName} }}
                    {{ end }}\n`

          execSync(`"./doc.sh" ${repo} ${repoUrl} ${commitId} ${localPath} ${menuFileName}`);

          handleMenuFiles(`./data/docSidebar/${menuFileName}.yml`, version, `/docs/${docName}/${version}`)
        }
      })
    })

  })
  await generateLayoutTemplate(targetPath, tpl)
  handleDocsFiles(docsInfo)

}

async function generateLayoutTemplate(targetPath, tpl) {
  let codeTxt = await promises.readFile(targetPath, 'utf8');
  codeTxt = codeTxt.toString()
  codeTxt = codeTxt.replace(/(td-sidebar">)([\s\S]*)(<\/div>[\s\S]*<div id="toc")/, function (match, p1, p2, p3) {
    return `${p1}\n${tpl}\n${p3}`
  })
  await promises.writeFile(targetPath, codeTxt, 'utf8');
}

function handleDocsFiles(docsInfo) {
  docsInfo.forEach((docInfo) => {

    const {localPath} = docInfo
    const root = path.join(__dirname, localPath);
    readDirSync(root, replaceMarkdownText, docInfo);
  })
}

async function handleMenuFiles(menuFilePath, version, localPath) {
  const nativeObject = await loadYaml(menuFilePath)
  nativeObject.version = version;

  handleMenuPath(nativeObject.catalog, localPath)
  const yamlString = YAML.stringify(nativeObject, 2);
  await promises.writeFile(menuFilePath, yamlString, 'utf8');
}

function handleMenuPath(list, localPath) {
  list.forEach(item => {
    const pagePath = item.path;
    if (pagePath) {
      item.path = pagePath.startsWith('http') ? pagePath : localPath + pagePath;
    }
    if (item.catalog) {
      handleMenuPath(item.catalog, localPath)
    }
  })
}

function loadYaml(filePath) {
  return new Promise((resolve) => {
    YAML.load(filePath, function (result) {
      resolve(result)
    });
  })
}