const process = require("process");
const path = require("path");
const fs = require("fs");
const YAML = require("yamljs");
const axios = require("axios");

const { promises } = fs;
const docsFile = path.join(__dirname, "../data/docs.yml");
const teamFile = path.join(__dirname, "../data/team.yml");

const sleep = (ms = 2 * 1000) => {
  console.log("waiting...");
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
};

class GenerateTeamYaml {
  constructor(docsFile, teamFile) {
    this.docsFile = docsFile;
    this.teamFile = teamFile;
    this.nativeObject = [];
    this.logins = {};
    this.mergedData = [];
  }

  async init() {
    try {
      console.log("start...");
      this.nativeObject = await this.loadYaml(docsFile);
      await this.getAllRepoData();
      await this.writeFile();
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  async getAllRepoData() {
    const promiseList = [];
    for (const k of this.nativeObject) {
      for (const item of k.list) {
        const { user, repo, extraContributors } = item;
        const list = [];
        if (user && repo) {
          promiseList.push(
            this.getRepoContributors({
              user,
              repo,
              extraContributors,
              list,
              item,
            })
          );
        }
        await sleep();
      }
    }
    await Promise.all(promiseList);
  }

  async writeFile() {
    const data = {
      totalCount: Object.keys(this.logins).length,
      projects: this.nativeObject,
    };
    const yamlString = YAML.stringify(data);
    await promises.writeFile(this.teamFile, yamlString, "utf8");
    console.log("team.yml success!");
  }

  async loadYaml() {
    const data = await new Promise((resolve) => {
      YAML.load(this.docsFile, (result) => {
        resolve(result);
      });
    });
    return data;
  }

  handleData(data) {
    return data
      .filter((item) => item.type !== "Bot")
      .map((item) => {
        const { type, email } = item;
        if (type === "Anonymous") {
          item.login = email.replace(/(.+)@.+/, "$1**");
        }
        this.logins[item.login] = item.login;
        return item;
      });
  }

  async getRepoContributors({
    user,
    repo,
    extraContributors = [],
    page = 1,
    per_page = 100,
    list = [],
    item,
  }) {
    let { data = [] } = await axios.get(
      `https://api.github.com/repos/${user}/${repo}/contributors?page=${page}&per_page=${per_page}&anon=true&t=${new Date().getTime()}`
    );
    data = this.handleData(data);
    list.push(...data);
    if (data.length === per_page) {
      page++;
      await sleep();
      console.log(`/${user}/${repo}/contributors?page=${page}`);
      await this.getRepoContributors({
        user,
        repo,
        extraContributors,
        page,
        per_page,
        list,
        item,
      });
    } else {
      if (extraContributors && extraContributors.length) {
        extraContributors.forEach(
          (item) => (this.logins[item.login] = item.login)
        );
      }
      const repoContributors = [...list, ...extraContributors];
      item.contributors = repoContributors;
      item.contributorCount = [
        ...new Set(repoContributors.map((item) => item.id || item.login)),
      ].length;
    }
  }
}

new GenerateTeamYaml(docsFile, teamFile).init();
