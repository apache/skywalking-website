const fs = require("fs");
const process = require("process");
const path = require("path");
const YAML = require('yamljs');
const axios = require('axios');
const {execSync} = require("child_process");
const {promises} = fs;
const docConfig = './data/docs.yml';
const layoutTemplateFile = '/themes/docsy/layouts/projectDoc/baseof.html';

init();

async function init() {
  try {
    const targetPath = path.join(__dirname, layoutTemplateFile)
    const docsList = await loadYaml(docConfig)
    const {tpl, docsInfo} = await traverseDocsList(docsList)
    await generateLayoutTemplate(targetPath, tpl)
    handleDocsFiles(docsInfo)
  } catch (err) {
    console.log(err);
    process.exit(1)
  }

}

function readDirSync(path, docInfo, replaceMarkdownText) {
  const pa = fs.readdirSync(path);
  pa.forEach(function (ele) {
    const filePath = path + "/" + ele
    const info = fs.statSync(filePath);
    if (info.isDirectory()) {
      readDirSync(filePath, docInfo, replaceMarkdownText);
      return;
    }
    if (isImage(ele)) {
      const {docName, version} = docInfo;
      const imgName = `${docName}_${version}_${ele}`;
      fs.copyFile(filePath, './static/images/' + imgName, function (err) {
        if (err) {
          throw err
        }
      });
      return;
    }
    const reg = /\.md/gi;
    const shouldFormat = reg.test(filePath);
    if (shouldFormat) {
      readFile(filePath, docInfo, replaceMarkdownText);
    }
  });
}

function readFile(filePath, docInfo, replaceMarkdownText) {
  fs.readFile(filePath, function (err, data) {
    if (err) {
      throw err
    } else {
      let codeTxt = data.toString();
      codeTxt = replaceMarkdownText(codeTxt, docInfo, filePath)
      writeFile(filePath, codeTxt);
    }
  });
}

function isImage(file) {
  var reg = /(.*)\.(jpg|jpeg|png|bmp|gif|ico|pcx|tif|tiff|raw|tga|webp|svg)$/;
  return reg.test(file)
}

function replaceMarkdownText(codeTxt, docInfo, filePath) {
  if (!/^([\s]*)(---[\s\S]*---)/.test(codeTxt)) {
    const {repoUrl, commitId, date, docName, version} = docInfo;
    const prefix = repoUrl.replace('.git', '/tree') + `/${commitId}`;
    const depth = filePath.split('/docs')[1].match(/\//g).length - 2;

    let title = codeTxt.trim().split('\n')[0]
    title = title.match(/(?<=([ ])).*/g)[0];
    title = title.replace(/:/g, '：')

    codeTxt =
        `---
title: ${title}
date: ${date}
type: projectDoc
layout: baseof
---\n` + codeTxt;
    codeTxt = codeTxt
        .replace(/(\[[\s\S]*?\])\(([\s\S]*?)\)/g, function (match, p1, p2) {
          if (p2 && p2.startsWith('http') || isImage(p2)) {
            return match
          }
          if (p2.startsWith('../')) {
            const parentDepth = p2.match(/\.\.\//g).length;
            if (parentDepth >= depth) {
              const url = p2.replace(/\.\.\//g, '')
              return `${p1}(${prefix}/${url})`
            }
          }
          const str = p2
              .toLowerCase()
              .replace(/\.md/g, '')

          if (str.startsWith('#')) {
            return `${p1}(${str})`
          }
          if (str.startsWith('./')) {
            return `${p1}(./../${str.slice(2)})`
          }
          return `${p1}(../${str})`
        })
        .replace(/<img(.*?)src="(.*?)"(.*?)>/g, function (match, p1, p2, p3) {
          if (p2 && p2.startsWith('http')) {
            return match
          }
          const imgName = `${docName}_${version}_` + p2.split('/').pop();
          return `<img${p1}src="/images/${imgName}"${p3}>`
        })
        .replace(/(\!\[[\s\S]*?\])\((.*?)\)/g, function (match, p1, p2,) {
          if (p2 && p2.startsWith('http')) {
            return match
          }
          const imgName = `${docName}_${version}_` + p2.split('/').pop();
          return `${p1}(/images/${imgName})`
        })
  }
  return codeTxt
}

function writeFile(filePath, codeTxt) {
  fs.writeFile(filePath, codeTxt, function (err) {
    if (err) {
      throw err
    }
  });
}


async function traverseDocsList(result) {
  let tpl = '';
  const docsInfo = []
  for (const data of result) {
    for (const item of data.list) {
      if (!item.docs) {
        continue;
      }
      for (const doc of item.docs) {
        const {repo, repoUrl, docs} = item;
        let {version, commitId} = doc;
        let date;
        if (version === 'latest') {
          const res = await axios.get(`https://api.github.com/repos/apache/${repo}/commits?page=1&per_page=1`)
          commitId = res.data[0].sha;
          date = res.data[0].commit.author.date;
        }
        if (commitId) {
          if (!date) {
            const res = await axios.get(`https://api.github.com/repos/apache/${repo}/commits/${commitId}`)
            date = res.data.commit.author.date;
          }
          const docName = repo === 'skywalking' ? 'main' : repo;
          const localPath = `/content/docs/${docName}/${version}`;
          const menuFileName = `${docName.replace(/\-|\./g, '_')}${version.replace(/\-|v|\./g, '_')}`;
          docsInfo.push({localPath, repoUrl, commitId, date, docName, version})

          tpl += `{{ if in .File.Path "${localPath.split('/content/')[1]}" }}
                    {{ $currentVersion := .Site.Data.docSidebar.${menuFileName}.version }}
                    <h5>Documentation: 
                    <select class="version-select">
                    {{range .Site.Data.docSidebar.${menuFileName}.repoDocs}}
                    {{$version := .version}}
                    <option {{ cond (eq $currentVersion $version) "selected" "" }} value="{{$version}}">{{$version}}</option>
                    {{end}}
                    </select>
                    </h5>
                    
                    {{ partial "sidebar-menu.html" .Site.Data.docSidebar.${menuFileName} }}
                    <div class="commit-id">Commit Id: {{.Site.Data.docSidebar.${menuFileName}.commitId}}</div>
                  {{ end }}\n`;

          execSync(`"./doc.sh" ${repo} ${repoUrl} ${commitId} ${localPath} ${menuFileName}`);

          await handleMenuFiles(`./data/docSidebar/${menuFileName}.yml`, {
            version,
            commitId,
            docs,
          }, `/docs/${docName}/${version}`)
        }
      }

    }
  }
  return {tpl, docsInfo}
}

async function generateLayoutTemplate(targetPath, tpl) {
  let codeTxt = await promises.readFile(targetPath, 'utf8');
  codeTxt = codeTxt.toString()
  codeTxt = codeTxt.replace(/(td-sidebar">)([\s\S]*)(<\/div>[\s\S]*<main)/, function (match, p1, p2, p3) {
    return `${p1}\n${tpl}\n${p3}`
  })
  await promises.writeFile(targetPath, codeTxt, 'utf8');
}

function handleDocsFiles(docsInfo) {
  docsInfo.forEach((docInfo) => {

    const {localPath} = docInfo
    const root = path.join(__dirname, localPath);
    readDirSync(root, docInfo, replaceMarkdownText);
  })
}

async function handleMenuFiles(menuFilePath, docInfo, localPath) {
  const nativeObject = await loadYaml(menuFilePath);
  const {version, commitId, docs} = docInfo
  nativeObject.version = version;
  nativeObject.commitId = commitId.slice(0, 7);
  nativeObject.repoDocs = docs;

  handleMenuPath(nativeObject.catalog, localPath)
  const yamlString = YAML.stringify(nativeObject, 2);
  await promises.writeFile(menuFilePath, yamlString, 'utf8');
}

function handleMenuPath(list, localPath) {
  list.forEach(item => {
    const pagePath = item.path;
    if (pagePath) {
      item.path = pagePath.startsWith('http') ? pagePath : (localPath + pagePath).toLowerCase();
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
