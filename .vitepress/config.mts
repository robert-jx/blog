import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/blog/',
  title: "Robert-jx",
  description: "Robert-jx的个人学习网站",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: 'Vue', link: '/vue/echarts' },
      { text: 'Javascript', link: '/markdown-examples' },
      { text: 'Three.js', link: '/markdown-examples' },
      { text: 'Python', link: '/markdown-examples' }
    ],

    sidebar: {
      '/vue/': [
        {
          text: 'Vue',
          items: [
            { text: 'echarts常见三类图标的封装', link: '/vue/echarts' },
            { text: 'ant-design-vue安装使用及常见问题总结', link: '/vue/ant-design-vue' },
            { text: 'axios 使用总结', link: '/vue/axios' },
          ]
        },
      ],

      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/config/': [
        {
          text: 'Config',
          items: [
            { text: 'Index', link: '/config/' },
            { text: 'Three', link: '/config/three' },
            { text: 'Four', link: '/config/four' }
          ]
        }
      ]
    },


    socialLinks: [
      { icon: 'github', link: 'https://github.com/robert-jx' }
    ],

    logo: '/images/logo.jpeg'
  }
})
