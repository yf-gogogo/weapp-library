module.exports = {
  title: '在线借书平台',
  description: '一个连接读者与读书馆的图书资源共享平台',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/guide/' }
    ],
    sidebar: {
      '/guide/': [{
        title: '文档',
        collapsable: false,
        children: [
          '',
          'feature'
        ]
      }]
    },
    repo: 'imageslr/weapp-library',

    docsDir: 'docs',
    editLinks: true,
    editLinkText: '在 Github 上编辑此页'
  }
}
