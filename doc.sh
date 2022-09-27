#!/bin/bash
set -o errexit
set -x

repo=$1
repoUrl=$2
commitId=$3
localPath=$4
menuFileName=$5


if [ ! -d "./tmp" ]; then
  mkdir ./tmp
fi
cd ./tmp

if [ -d "./${repo}" ]; then
  rm -rf ./${repo}
fi

mkdir ./${repo}
cd ./${repo}
if [ "$commitId" = "Next" ]; then
  git clone --depth=1 ${repoUrl} .
else
  git init
  git remote add origin ${repoUrl}
  git fetch origin "$commitId"
  git reset --hard FETCH_HEAD
fi

if [ -d "../../${localPath}" ]; then
  rm -rf ../../${localPath}
fi
mkdir -p ../../${localPath}
cp -rf ./docs/* ../../${localPath}
cp ./docs/menu.yml ../../data/docSidebar/${menuFileName}.yml

