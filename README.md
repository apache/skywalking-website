# Apache SkyWalking webpage

This is the repository including all source codes of `http://skywalking.incubator.apache.org`.

## Compile, preview and generate static files

Usage:

1. Git pull branch `master`
2. You may need to run `npm install` before your start somehow.
3. Run `npm run clean` to remove dist folder
4. Run `npm run dev` in your local env, open `http://localhost:8080` in browser, check whether it works fine
6. Push files and send pull request if necessary, with screenshots showing how you would change.


## How to add document in the site


```
|-- docs                    // English version
|   |-- README.md           // homepage's markdown
|   |-- .vuepress
|   |   |-- config.js       // website config
|   |   |-- public          // public resources
|   |   |   |-- assets          // website static resources
|   |   |   |-- static          // markdown resources
|   |   |   |   |-- blog          // blog  markdown resources
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

## How to add and manage images in the site
You can put your markdown images in the path ``` /docs/.vuepress/public/static/ ``` and use the folder to separate the site parts. 

Such as adding a ```blog``` folder in ``` /docs/.vuepress/public/static/ ```,and then you can make a folder which names about your blog in it. Put the images in this named folder.

In markdown, you can use ```/docs/.vuepress/public/static/blog/{blogName}/{imageName} ``` path to add the image into markdown doc.

## Blog
When you try to publish blogs in Apache SkyWalking official website, no advertising is allowed here. You could add markdown test link(`[name](url)`) pointing to you personal website/twitter and company website.
