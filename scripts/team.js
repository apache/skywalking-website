const process = require("process");
const path = require("path");
const YAML = require('yamljs');
const axios = require('axios');
const fs = require("fs");
const {promises} = fs;
const docsFile = path.join(__dirname, '../data/docs.yml')
const teamFile = path.join(__dirname, '../data/team.yml')

class GenerateTeamYaml {
  constructor(docsFile, teamFile) {
    this.docsFile = docsFile;
    this.teamFile = teamFile;
  }

  nativeObject = []
  ids = {}

  async init() {
    try{
      this.nativeObject = await this.loadYaml(docsFile);
      await this.getAllRepoContributors()
      await this.writeFile()
    }catch (err){
      console.log(err);
      process.exit(1)
    }
  }

  async getAllRepoContributors() {
    const promiseList = [];
    for (const k of this.nativeObject) {
      for (const item of k.list) {
        const {user, repo} = item
        const list = []
        promiseList.push(this.getRepoContributors({user, repo, list, item}))

      }

    }
    await Promise.all(promiseList)

  }

  async writeFile() {
    const data = {
      totalCount: Object.keys(this.ids).length,
      projects: this.nativeObject
    }
    const yamlString = YAML.stringify(data);
    await promises.writeFile(this.teamFile, yamlString, 'utf8');
    console.log('team.yml success!');
  }

  getUniqueId(list) {
    list.forEach(item => {
      const {id, email,} = item;
      const key = id || email
      if (!this.ids[key]) {
        this.ids[key] = key
      }
    })
  }

  async loadYaml() {
    const data = await new Promise((resolve) => {
      YAML.load(this.docsFile, (result) => {
        resolve(result)
      });
    })
    return data
  }

  async getRepoContributors({user, repo, page = 1, per_page = 100, list = [], item}) {
    let {data} = await axios.get(`https://api.github.com/repos/${user}/${repo}/contributors?page=${page}&per_page=${per_page}&anon=true`)
    data = data.filter(item => item.type !== 'Bot')
    list.push(...data)
    this.getUniqueId(data)
    if (data.length === per_page) {
      page++;
      await this.getRepoContributors({user, repo, page, per_page, list, item})
    } else {
      item.contributors = list;
      item.contributorCount = [...new Set(list.map(item => item.id || item.email))].length;
    }
  }
}

new GenerateTeamYaml(docsFile, teamFile).init()
