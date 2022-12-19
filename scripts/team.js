const process = require('process');
const path = require('path');
const fs = require('fs');
const YAML = require('yamljs');
const axios = require('axios');

const {promises} = fs;
const docsFile = path.join(__dirname, '../data/docs.yml')
const teamFile = path.join(__dirname, '../data/team.yml')
const mergedDataFile = path.join(__dirname, '../themes/docsy/static/js/mergedData.js')

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

class GenerateTeamYaml {
  constructor(docsFile, teamFile) {
    this.docsFile = docsFile;
    this.teamFile = teamFile;
    this.mergedDataFile = mergedDataFile;
    this.nativeObject = [];
    this.logins = {};
    this.mergedData = [];
  }

  async init() {
    try {
      console.log('start...');
      this.nativeObject = await this.loadYaml(docsFile);
      await this.getAllRepoData()
      await this.writeFile()
    } catch (err) {
      console.log(err);
      process.exit(1)
    }
  }

  async getAllRepoData() {
    const promiseList = [];
    const mergedPromiseList = [];
    for (const k of this.nativeObject) {
      for (const item of k.list) {
        const {user, repo, extraContributors} = item;
        const list = [];
        if (user && repo) {
          promiseList.push(this.getRepoContributors({user, repo, extraContributors, list, item}));
          mergedPromiseList.push(this.getMergedData({user, repo}));
        }
        await sleep(1500)
      }
    }
    await Promise.all(promiseList)
    await Promise.all(mergedPromiseList)
  }

  async getMergedData({user, repo}) {
    const that = this;
    let count = 0;
    const NUM = 8;
    const FAIL_TIPS = `${user}/${repo}/graphs failed!`;

    try {
      await getContributionsGraphs()
    } catch (e) {
      console.log(FAIL_TIPS);
      process.exit(1)
    }

    async function getContributionsGraphs() {
      ++count;
      if (count > 1) {
        console.log(`${user}/${repo}: retry ${count} ...`);
      }
      try {
        const res = await axios.get(`https://github.com/${user}/${repo}/graphs/contributors-data`, {
          headers: {
            'accept': 'application/json',
            'User-Agent': '',
          },
        });
        const {status, data: source = []} = res
        if (status === 200 && source.length) {
          source.repo = repo;
          that.mergedData.push(source);
          console.log(`${user}/${repo}/graphs success!`);
        } else {
          console.log(`${user}/${repo}/graphs: res.status ${status}!`);
          if (count < NUM) {
            await sleep(1000)
            await getContributionsGraphs()
          }

        }
      } catch (e) {
        console.log(`${user}/${repo}/`, e);
        if (count < NUM) {
          await getContributionsGraphs()
        }
      }
    }
  }

  buildMergedData(sources) {
    const maxSource = this.getMaxData(sources);
    const maxWeekLen = maxSource[0].weeks.length;
    const data = [];
    const date = [];

    const x = new Date();
    const timepoint = x.setFullYear(2021, 7, 25);

    for (let i = 0; i < maxWeekLen; i++) {
      let num = 0;
      const {w: week} = maxSource[0].weeks[i];

      const now = new Date(+(week + '000'));
      date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));

      sources.forEach((source = []) => {
        if (!source[0] || !source[0].weeks) {
          return;
        }
        const len = source[0].weeks.length;

        for (let k = 0; k < len; k++) {
          const usersCount = source.length;
          const curWeek = source[0].weeks[k] && source[0].weeks[k].w;
          if (curWeek === week) {
            for (let j = 0; j < usersCount; j++) {
              const {c} = source[j] && source[j].weeks[k];
              if (source.repo !== 'skywalking-java' || now > timepoint) {
                num += c
              }
            }
          }
        }
      })

      data.push(num)
    }
    return {data, date}
  }

  getMaxData(sources) {
    let maxWeekLen = 0;
    let maxSource;
    sources.forEach(item => {
      if (item.length > maxWeekLen) {
        maxWeekLen = item.length
        maxSource = item
      }
    })
    return maxSource
  }

  async writeFile() {
    const data = {
      totalCount: Object.keys(this.logins).length,
      projects: this.nativeObject
    }
    const yamlString = YAML.stringify(data);
    await promises.writeFile(this.teamFile, yamlString, 'utf8');
    console.log('team.yml success!');

    const mergedGraphData = this.buildMergedData(this.mergedData)
    await promises.writeFile(this.mergedDataFile, `var mergedData = ${JSON.stringify(mergedGraphData)}`, 'utf8');
    console.log('mergedData.js success!');
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
          const {type, email} = item;
          if (type === 'Anonymous') {
            item.login = email.replace(/(.+)@.+/, '$1**');
          }
          this.logins[item.login] = item.login;
          return item;
        });
  }

  async getRepoContributors({user, repo, extraContributors = [], page = 1, per_page = 100, list = [], item}) {
    let {data = []} = await axios.get(`https://api.github.com/repos/${user}/${repo}/contributors?page=${page}&per_page=${per_page}&anon=true&t=${new Date().getTime()}`)
    data = this.handleData(data);
    list.push(...data);
    if (data.length === per_page) {
      page++;
      await this.getRepoContributors({user, repo, extraContributors, page, per_page, list, item})
    } else {
      if (extraContributors && extraContributors.length) {
        extraContributors.forEach(item => this.logins[item.login] = item.login);
      }
      const repoContributors = [...list, ...extraContributors];
      item.contributors = repoContributors;
      item.contributorCount = [...new Set(repoContributors.map(item => item.id || item.login))].length;
    }
  }
}

new GenerateTeamYaml(docsFile, teamFile).init()
