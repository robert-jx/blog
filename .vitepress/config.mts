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
      { text: 'Javascript', link: '/javascript/copy-text' },
      { text: 'Three.js', link: '/three/use' },
      { text: 'Python', link: '/python/qrcode' }
    ],

    sidebar: {
      '/vue/': [
        {
          text: 'Vue2',
          items: [
            { text: 'axios 使用总结', link: '/vue/axios' },
            { text: '鼠标滚轮实现元素横向滚动', link: '/vue/scroll' },
            { text: 'video 常用配置控制', link: '/vue/video' },
            { text: 'echarts 常见三类图标的封装', link: '/vue/echarts' },
            { text: 'ant-design-vue 使用总结', link: '/vue/ant-design-vue' },
            { text: 'vuedraggable 实现表格拖拽', link: '/vue/vuedraggable' },
            { text: 'element-ui 使用总结', link: '/vue/element-ui' },
            { text: '百度 GL 地图轨迹功能的实现', link: '/vue/baidugl-route' },
            { text: '二维码的生成及批量下载', link: '/vue/qrcode' },
            { text: '页面加载进度条', link: '/vue/nprogress' },
            { text: 'div 元素键盘事件监听问题', link: '/vue/div-key' },
            { text: 'electron 桌面应用程序使用总结', link: '/vue/electron' },
            { text: 'jessibuca 视频插件的使用', link: '/vue/jessibuca' },
            { text: 'svg 内添加鼠标事件', link: '/vue/svg-mouse' },
            { text: '实时监听窗口宽度变化', link: '/vue/real-window' },
            { text: '实现项目的自动化部署', link: '/vue/deploy' },
          ]
        },

        {
          text: 'Vue3',
          items: [
            { text: '基于 vite 的 vue3 项目创建', link: '/vue/vite' },
            { text: 'json 编辑器使用总结', link: '/vue/json' },
            { text: '键盘事件', link: '/vue/keyword' },
            { text: 'nvm 基本使用', link: '/vue/nvm' },
            { text: '前端 RSA 加密', link: '/vue/rsa' },
            { text: '进度条效果实现', link: '/vue/progress-bar' },
            { text: '基于 clip-path 实现的不规则区域放大效果', link: '/vue/blowup-picture' },
            { text: '拖拽布点功能实现', link: '/vue/dragging-demo' },
            { text: '实现全屏和非全屏的切换', link: '/vue/fullscreen-demo' },

          ]
        },
      ],

      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/three/': [
        {
          text: 'Three',
          items: [
            { text: '安装与使用', link: '/three/use' },
            { text: '镜头切换', link: '/three/camera' },
            { text: 'vue3-三维地图的实现', link: '/three/map' },
          ]
        }
      ],
      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/javascript/': [
        {
          text: 'Javascript',
          items: [
            { text: '实现文本复制功能', link: '/javascript/copy-text' },
            { text: '数组与树之间的转换', link: '/javascript/arr-tree' },
            { text: '当前时间戳、日期转换', link: '/javascript/time-change' },
            { text: '获取视频第一帧截图', link: '/javascript/video-screenshot' },
            { text: '数组根据某个字段排序', link: '/javascript/arr-sort' },
            { text: '使用正则进行手机号、邮箱、身份证验证', link: '/javascript/form-verify' },
            { text: '获取屏幕缩放比例和分辨率', link: '/javascript/screen-zoom' },
            { text: '解决跨页选择后对数据判断的问题', link: '/javascript/crosspage-selection' },
            { text: '获取 image 图片的原始尺寸', link: '/javascript/image-originsize' },
            { text: '生成桌面快捷方式', link: '/javascript/shortcuts' },
            { text: '防抖和节流', link: '/javascript/request-control' },
            { text: '实现模糊过滤功能', link: '/javascript/key-search' },
            { text: '数组去重', link: '/javascript/arr-deduplication' }
          ]
        }
      ],
      '/python/': [
        {
          text: 'Python',
          items: [
            { text: '生成二维码', link: '/python/qrcode' },
            { text: '坐标对比的GUI程序实现', link: '/python/coordinate-compare' },
            { text: '简易记事本的实现', link: '/python/book' },
            { text: '类 xftp 的文件传输工具的实现', link: '/python/ftp' },
            { text: '调用 Ollama 使用大语言模型', link: '/python/model' },
            { text: '实现简单的微信自动回复功能', link: '/python/auto-response' }
          ]
        }
      ],
    },


    socialLinks: [
      { icon: 'github', link: 'https://github.com/robert-jx' }
    ],

    logo: '/images/logo.jpeg'
  }
})
