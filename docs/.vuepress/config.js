module.exports = {
  base: "/",
  dest: "dist",
  locales: {
    '/': {
      lang: 'en-US', // 将会被设置为 <html> 的 lang 属性
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
            { text: 'Latest dev version', link: "https://github.com/apache/skywalking/tree/master/docs" },
            { text: '6.2.0', link: "https://github.com/apache/skywalking/tree/v6.2.0/docs"},
            { text: '6.1.0', link: "https://github.com/apache/skywalking/tree/v6.1.0/docs"},
            { text: '6.0.0-GA', link: "https://github.com/apache/skywalking/tree/v6.0.0-GA/docs"},
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
              { text: '开发版本文档', link: "https://github.com/apache/skywalking/tree/master/docs" },
              { text: '6.2.0', link: "https://github.com/apache/skywalking/tree/v6.2.0/docs"},
              { text: '6.1.0', link: "https://github.com/apache/skywalking/tree/v6.1.0/docs"},
              { text: '6.0.0-GA', link: "https://github.com/apache/skywalking/tree/v6.0.0-GA/docs"},
            ],
          },
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
