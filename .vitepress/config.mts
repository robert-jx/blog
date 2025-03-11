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
      { text: 'Vue', link: '/vue/axios' },
      { text: 'Javascript', link: '/markdown-examples' },
      { text: 'Three.js', link: '/markdown-examples' },
      { text: 'Python', link: '/markdown-examples' }
    ],

    sidebar: {
      '/vue/': [
        {
          text: 'Vue2',
          items: [
            { text: 'axios使用总结', link: '/vue/axios' },
            { text: '鼠标滚轮实现元素横向滚动', link: '/vue/scroll' },
            { text: 'video常用配置控制', link: '/vue/video' },
            { text: 'echarts常见三类图标的封装', link: '/vue/echarts' },
            { text: 'ant-design-vue使用总结', link: '/vue/ant-design-vue' },
            { text: 'vuedraggable实现表格拖拽', link: '/vue/vuedraggable' },
            { text: 'element-ui使用总结', link: '/vue/element-ui' },
            { text: '百度GL地图轨迹功能的实现', link: '/vue/baidugl-route' },
            { text: '二维码的生成及批量下载', link: '/vue/qrcode' },
            { text: '页面加载进度条', link: '/vue/nprogress' },
            { text: 'div元素键盘事件监听问题', link: '/vue/div-key' },
            { text: 'electron桌面应用程序使用总结', link: '/vue/electron' },
            { text: 'jessibuca视频插件的使用', link: '/vue/jessibuca' },
            { text: 'svg内添加鼠标事件', link: '/vue/svg-mouse' },
            { text: '实时监听窗口宽度变化', link: '/vue/real-window' },
          ]
        },

        {
          text: 'Vue3',
          items: [
            { text: '基于vite的vue3项目创建', link: '/vue/vite' },
            { text: 'json编辑器使用总结', link: '/vue/json' },
            { text: '键盘事件', link: '/vue/keyword' },
            { text: 'nvm基本使用', link: '/vue/nvm' },
            { text: '前端RSA加密', link: '/vue/rsa' },
            { text: '进度条效果实现', link: '/vue/progress-bar' },
            { text: '基于clip-path实现的不规则区域放大效果', link: '/vue/blowup-picture' },
            { text: '拖拽布点功能实现', link: '/vue/dragging-demo' },
            { text: '实现全屏和非全屏的切换', link: '/vue/fullscreen-demo' },

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
