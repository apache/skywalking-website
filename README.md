# Apache SkyWalking webpage

This is the repository including all source codes of `http://skywalking.incubator.apache.org`.

## Compile, preview and generate static files

Usage:

1. Git pull branch `asf-site`
1. You may need to run `npm install` before your start somehow.
1. Run `npm run clean`
1. Run `npm run dev` in your local env, open `http://localhost:8080` in browser, check whether it works fine
1. Run `npm run build` to generate static files.
1. Push files and send pull request if necessary, with screenshots showing how you would change.


## How to add document in the site


```
|-- docs                    // English version
|   |-- README.md           // homepage's markdown
|   |-- .vuepress
|   |   |-- config.js       // website config
|   |   |-- public          // public resources
|   |   |-- theme           // vue theme project
|   |-- blog
|   |   |-- xxx.md          // other blog markdowns
|   |   |-- README.md       // blog's markdown
|   |-- downloads
|   |   |-- README.md       // downloads's markdown
|   |-- events
|   |   |-- README.md       // events's markdown
|   |-- team
|   |   |-- README.md       // team's markdown
|   |-- zh                  // Chinese version
|   |   |-- README.md       // homepage's markdown
|   |   |-- blog
|   |   |   |-- xxx.md      // other blog markdowns
|   |   |   |-- README.md   // blog's markdown
|   |   |-- downloads
|   |   |   |-- README.md   // downloads's markdown
|   |   |-- events
|   |   |   |-- README.md   // events's markdown
|   |   |-- team
|   |   |   |-- README.md   // team's markdown

```
