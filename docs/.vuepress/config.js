module.exports = {
  base: "/",
  dest: "dist",
  locales: {
    '/': {
      lang: 'en-US', 
      title: ' Apache SkyWalking™ | SkyWalking Team ',
      logo: "/favicon.ico",
      head: [["link", { rel: "icon", href: `/logo.svg` }]],
    },
    '/zh/': {
      lang: 'zh-CN',
      title: ' Apache SkyWalking™ | SkyWalking Team ',
      logo: "/favicon.ico",
      head: [["link", { rel: "icon", href: `/logo.svg` }]],
    }
  },
  themeConfig: {
    locales: {
      '/': {
        lang: 'en-US',
        selectText: 'Lang',
        label: 'En',
        sidebar: {
          '/events/': genSidebarConfig('Events')
        },
        nav: [
          { text: "Home", link: "/" },
          { text: "Docs",  items: [
            { text: '8.2.0', link: "https://github.com/apache/skywalking/tree/v8.2.0/docs"},
            { text: '8.1.0', link: "https://github.com/apache/skywalking/tree/v8.1.0/docs"},
            { text: 'Nginx LUA 0.3.0', link: "https://github.com/apache/skywalking-nginx-lua/tree/v0.3.0"},
            { text: 'CLI 0.4.0', link: "https://github.com/apache/skywalking-cli/tree/0.4.0"},
            { text: 'Kubernetes helm 3.1.0', link: "https://github.com/apache/skywalking-kubernetes/tree/v3.1.0"},
            { text: 'Kubernetes helm 3.0.0', link: "https://github.com/apache/skywalking-kubernetes/tree/v3.0.0"},
            { text: 'Python Agent 0.3.0', link: "https://github.com/apache/skywalking-python/tree/v0.3.0"},
            { text: 'Client JS 0.1.0', link: "https://github.com/apache/skywalking-client-js/tree/v0.1.0"},
          ], },
          { text: "GitHub",  items: [
            { text: 'Main Repo, Javaagent and Backend', link: "https://github.com/apache/skywalking/" },
            { text: 'Nginx LUA Agent', link: "https://github.com/apache/skywalking-nginx-lua"},
            { text: 'RocketBot UI', link: "https://github.com/apache/skywalking-rocketbot-ui"},
            { text: 'CLI', link: "https://github.com/apache/skywalking-cli/"},
            { text: 'Data Collect Protocol', link: "https://github.com/apache/skywalking-data-collect-protocol"},
            { text: 'Data Query Protocol', link: "https://github.com/apache/skywalking-query-protocol"},
            { text: 'Docker', link: "https://github.com/apache/skywalking-docker"},
            { text: 'Kubernetes helm', link: "https://github.com/apache/skywalking-kubernetes/"},
            { text: 'K8s Operator', link: "https://github.com/apache/skywalking-swck"},
            { text: 'Website', link: "https://github.com/apache/skywalking-website"},
            { text: 'Python Agent', link: "https://github.com/apache/skywalking-python"},
            { text: 'Client JS', link: "https://github.com/apache/skywalking-client-js"},
          ], },
          { text: "Events", link: "/events/" },
          { text: "Blog", link: "/blog/" },
          { text: "Downloads", link: "/downloads/" },
          { text: "Team", link: "/team/" },
          { text: "Links",
            items: [
              { text: 'Apache Software Foundation', link: "http://www.apache.org/" },
              { text: 'GitHub Issue Tracker', link: "https://github.com/apache/skywalking/issues" },
              { text: 'Dev Mailing List', link: "https://lists.apache.org/list.html?dev@skywalking.apache.org" },
              { text: 'License', link: "http://www.apache.org/licenses/" },
              { text: 'Apache Events', link: "http://www.apache.org/events/current-event" },
              { text: 'Security', link: "http://www.apache.org/security/" },
              { text: 'Sponsorship and Donate', link: "http://www.apache.org/foundation/sponsorship.html" },
              { text: 'Thanks', link: "http://www.apache.org/foundation/thanks.html"}
            ], },
        ],
      },
      '/zh/': {
        lang: 'zh-CN',
        selectText: '语言',
        label: '中文',
        sidebar: {
          '/zh/events/': genSidebarConfig('Events')
        },
        nav: [
          { text: "主页", link: "/zh/" },
          { text: "文档",
            items: [
              { text: '8.2.0', link: "https://github.com/apache/skywalking/tree/v8.2.0/docs"},
              { text: '8.1.0', link: "https://github.com/apache/skywalking/tree/v8.1.0/docs"},
              { text: 'Nginx LUA 0.3.0', link: "https://github.com/apache/skywalking-nginx-lua/tree/v0.3.0"},
              { text: 'CLI 0.4.0', link: "https://github.com/apache/skywalking-cli/tree/0.4.0"},
              { text: 'Kubernetes helm 3.1.0', link: "https://github.com/apache/skywalking-kubernetes/tree/v3.1.0"},
              { text: 'Kubernetes helm 3.0.0', link: "https://github.com/apache/skywalking-kubernetes/tree/v3.0.0"},
              { text: 'Python Agent 0.3.0', link: "https://github.com/apache/skywalking-python/tree/v0.3.0"},
              { text: 'Client JS 0.1.0', link: "https://github.com/apache/skywalking-client-js/tree/v0.1.0"},
            ],
          },
          { text: "GitHub",  items: [
            { text: 'Main Repo, Javaagent and Backend', link: "https://github.com/apache/skywalking/" },
            { text: 'Nginx LUA Agent', link: "https://github.com/apache/skywalking-nginx-lua"},
            { text: 'RocketBot UI', link: "https://github.com/apache/skywalking-rocketbot-ui"},
            { text: 'CLI', link: "https://github.com/apache/skywalking-cli/"},
            { text: 'Data Collect Protocol', link: "https://github.com/apache/skywalking-data-collect-protocol"},
            { text: 'Data Query Protocol', link: "https://github.com/apache/skywalking-query-protocol"},
            { text: 'Docker', link: "https://github.com/apache/skywalking-docker"},
            { text: 'Kubernetes helm', link: "https://github.com/apache/skywalking-kubernetes/"},
            { text: 'K8s Operator', link: "https://github.com/apache/skywalking-swck"},
            { text: 'Website', link: "https://github.com/apache/skywalking-website"},
            { text: 'Python Agent', link: "https://github.com/apache/skywalking-python"},
            { text: 'Client JS', link: "https://github.com/apache/skywalking-client-js"},
          ], },
          { text: "事件", link: "/zh/events/" },
          { text: "博客", link: "/zh/blog/" },
          { text: "下载", link: "/zh/downloads/" },
          { text: "团队", link: "/zh/team/" },
          { text: "链接",
          items: [
            { text: 'Apache Software Foundation', link: "http://www.apache.org/" },
            { text: 'GitHub Issue Tracker', link: "https://github.com/apache/skywalking/issues" },
            { text: 'Dev Mailing List', link: "https://lists.apache.org/list.html?dev@skywalking.apache.org" },
            { text: 'License', link: "http://www.apache.org/licenses/" },
            { text: 'Apache Events', link: "http://www.apache.org/events/current-event" },
            { text: 'Security', link: "http://www.apache.org/security/" },
            { text: 'Sponsorship and Donate', link: "http://www.apache.org/foundation/sponsorship.html" },
            { text: 'Thanks', link: "http://www.apache.org/foundation/thanks.html"}
          ], },
        ],
      }
    },
  },
  markdown: {
    // options for markdown-it-anchor
    anchor: { permalink: false },
    config: md => {
      md.use(require("markdown-it-katex"));
    }
  }
};

function genSidebarConfig (title) {
  return [
    {
      // title,
      collapsable: false,
      children: [
        '',
        // 'getting-started',
        // 'customize',
        // 'advanced',
      ]
    }
  ]
}
