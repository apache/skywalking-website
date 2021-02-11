#!/bin/bash


repo=$1
gitUrl=$2
commitId=$3
localPath=$4
sidebarConfigFile=$5


if [ ! -d "./tmp" ]; then
  mkdir ./tmp
fi
cd ./tmp

if [ ! -d "./${repo}" ]; then
  git clone ${gitUrl}
  cd ./${repo}
  else
  cd ./${repo}
  git pull origin master
fi

git reset --hard ${commitId}

if [ -d "../../${localPath}" ]; then
  rm -rf ../../${localPath}
fi
mkdir -p ../../${localPath}
cp -rf ./docs/* ../../${localPath}
#cp ./docs/${sidebarConfigFile} ../../data/docSidebar/

