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
    this.nativeObject = [];
    this.logins = {};
  }

  async init() {
    try{
      console.log('start...');
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
        if(user && repo){
          promiseList.push(this.getRepoContributors({user, repo, list, item}))
        }

      }

    }
    await Promise.all(promiseList)

  }

  async writeFile() {
    const data = {
      totalCount: Object.keys(this.logins).length,
      projects: this.nativeObject
    }
    const yamlString = YAML.stringify(data);
    await promises.writeFile(this.teamFile, yamlString, 'utf8');
    console.log('team.yml success!');
  }

  async loadYaml() {
    const data = await new Promise((resolve) => {
      YAML.load(this.docsFile, (result) => {
        resolve(result)
      });
    })
    return data
  }

  handleData(data) {
    return data
        .filter((item) => item.type !== 'Bot')
        .map((item) => {
          const { type, email } = item;
          if (type === 'Anonymous') {
            item.login = email.replace(/(.+)@.+/, '$1**');
          }
          this.logins[item.login] = item.login;
          return item;
        });
  }

  async getRepoContributors({user, repo, page = 1, per_page = 100, list = [], item}) {
    let {data} = await axios.get(`https://api.github.com/repos/${user}/${repo}/contributors?page=${page}&per_page=${per_page}&anon=true&t=${new Date().getTime()}`)
    data = this.handleData(data);
    list.push(...data)
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
