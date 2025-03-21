# 使用 three.js 实现全景图 VR 预览功能

近期工作上遇到一个需求，需要实现 VR 全景图的功能。经过调研，发现可以使用 [`photo-sphere-viewer-4`](https://photo-sphere-viewer-4.netlify.app/plugins/writing-a-plugin.html#creating-a-button) 来实现。不过最后使用的时候发现和需求还是有一部分不符的地方。因此还是选回来用 three.js 来实现这个功能：

## 安装 three.js 和 tween.js

全景图涉及到漫游时的动画过度，这里选用了 tween.js 来实现

首先是安装这两个库

```js-nolint
npm install three

npm install tween.js
```

## 引用

```js
import * as THREE from "three";
import TWEEN from 'tween.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
```

## 变量定义

这里有一个要点，three.js 相关的参数最好在不要在 vue 的 data 中定义，要不然会卡顿

```js
import * as THREE from "three";
import TWEEN from 'tween.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 定义场景
const scene = new THREE.Scene();
// three的控制器必须放在data外，否则会造成卡顿的问题
var controls;
var camera;
var renderer;
var raycaster;
var tween;
let currentTargetIndex = 0;
var mouse = new THREE.Vector2();
var sphere, sphereTexture;
// 监控点标记组，方便统一管理
var cameraGroup = new THREE.Group();
// 漫游标记组，方便统一管理
var roamGroup = new THREE.Group();
// 文字标题组，方便统一管理
var textGroup = new THREE.Group();
export default {
  name: "three-model",
}
```

## 完整代码

这里分别监听了鼠标的左键和右键，分别实现了点击漫游、加点和右键菜单功能。还实现了普通标记点开打开图像以及小地图的功能。

```html
<template>
  <div class="three-box">
    <div class="three-model" id="container"></div>
    <div class="scene-box" @click="isShow = !isShow">场景</div>
    <div class="scene-list" v-if="isShow">
      <div class="scene-item" v-for="(item, index) in dataList" :key="index" @click="toChange(item)">{{ item.name }}
      </div>
    </div>
    <div class="thumb-box">
      <img :src="thumbImg" alt="">
      <img id="thumb-point" class="thumb-point" :src="pointImg" :style="{ 'top': thumby, 'left': thumbx }" alt="">
    </div>

    <div v-if="showMenu" class="menu-box" :style="{ top: menuTop + 'px', left: menuLeft + 'px' }">
      <div class="menu-item" @click.stop="deletePoint">删除</div>
    </div>

    <el-image-viewer v-if="dialogVisible" :url-list="previewList" hide-on-click-modal teleported :on-close="handleClose"
      class="my-image-viewer"></el-image-viewer>
  </div>
</template>

<script>
import * as THREE from "three";
import TWEEN from 'tween.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

// 定义场景
const scene = new THREE.Scene();
// three的控制器必须放在data外，否则会造成卡顿的问题
var controls;
var camera;
var renderer;
var raycaster;
var tween;
let currentTargetIndex = 0;
var mouse = new THREE.Vector2();
var sphere, sphereTexture;
// 监控点标记组，方便统一管理
var cameraGroup = new THREE.Group();
// 漫游标记组，方便统一管理
var roamGroup = new THREE.Group();
// 文字标题组，方便统一管理
var textGroup = new THREE.Group();
// 标注标题组，方便统一管理
var labelGroup = new THREE.Group();
export default {
  name: "three-model",
  components: { ElImageViewer },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      // 监控点图片
      camera: require('@/assets/camera.png'),
      // 漫游标记图片
      roamImg: require('@/assets/logo.png'),
      // demo数据
      dataList: [
        {
          id: '1', name: '大厅', url: require('@/assets/background.jpg'),
          thumbx: '10%',
          thumby: '20%',
          // lookat:
          link: [{ id: '2', name: '公路', type: 'link', url: require('@/assets/back.jpg'), x: -4, y: -1, z: -2, }],
          marker: [{ id: '6', name: '大厅摄像头', type: 'marker', x: 2, y: 1, z: 3 }],
          label: [{ id: '10', name: '柜子', type: 'label', x: 4, y: 0, z: -2, url: require('@/assets/guizi.jpg') }]
        },
        {
          id: '2', name: '公路', url: require('@/assets/back.jpg'),
          thumbx: '10%',
          thumby: '30%',
          link: [{ id: '1', name: '大厅', type: 'link', url: require('@/assets/background.jpg'), x: 4, y: 1, z: 2, }, { id: '3', name: '房间', type: 'link', url: require('@/assets/back1.jpg'), x: 1, y: -1, z: 4, }], marker: [{ id: '6', name: '大厅摄像头2号', type: 'marker', x: 1, y: 1, z: 3 }]
        },
        {
          id: '3', name: '房间', url: require('@/assets/back1.jpg'), link: [], marker: [],
          thumbx: '30%',
          thumby: '60%',
        },
      ],
      isShow: false,
      isClickCamera: false,

      // 菜单
      showMenu: false,
      menuTop: 30,
      menuLeft: 30,
      spriteObj: null,
      // 图片预览
      dialogVisible: false,
      previewList: [],

      //缩略图参数
      thumbImg: require('@/assets/thumb.png'),
      pointImg: require('@/assets/point.png'),
      thumbx: '10%',
      thumby: '20%',
      thumbRotate: '0'
    };
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      this.init(this.dataList[0]);
    });
  },
  methods: {
    init(row) {
      this.createScene(); // 创建场景
      this.createModel(row); // 导入模型
      this.createPoint(row);
      this.createLight(); // 创建光源
      this.createCamera(); // 创建相机
      this.createRender(); // 创建渲染器
      this.createControls(); // 创建控件对象
      raycaster = new THREE.Raycaster();
      this.render();
      // 监听画面变化，更新渲染画面
      window.addEventListener("resize", () => {
        // 更新摄像头
        camera.aspect = window.innerWidth / window.innerHeight;
        //   更新摄像机的投影矩阵
        camera.updateProjectionMatrix();

        //   更新渲染器
        renderer.setSize(window.innerWidth, window.innerHeight);
        //   设置渲染器的像素比
        renderer.setPixelRatio(window.devicePixelRatio);
      });
      // 绑定点击事件
      window.addEventListener('click', e => {
        this.onClick(e)
        this.showMenu = false;
        if (this.isClickCamera) {
          this.toAddCamera(e)
        }
      });

      window.addEventListener(
        'contextmenu',
        (event) => {
          this.rightClickEvent(event)
        },
        false
      )
    },
    createScene() {
      scene.background = new THREE.Color("#172333");
    },
    // 创建全景图背景
    createModel(row) {
      let sphere_geometry = new THREE.SphereGeometry(5, 64, 64)
      sphereTexture = new THREE.TextureLoader().load(row.url, (tex) => {
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      })
      sphereTexture.needsUpdate = true
      let sphere_material = new THREE.MeshStandardMaterial({ map: sphereTexture })
      sphere_geometry.scale(1, 1, -1);
      sphere = new THREE.Mesh(sphere_geometry, sphere_material)
      scene.add(sphere)
    },
    // 创建监控点和漫游标记以及物品标记
    createPoint(row) {
      let roamList = row.link;
      let markerList = row.marker;
      let labelList = row.label;

      const texLoader = new THREE.TextureLoader()
      const texture = texLoader.load(require("@/assets/roam.png"))
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true, //开启透明(纹理图片png有透明信息),
      })

      const texLoader1 = new THREE.TextureLoader()
      const texture1 = texLoader1.load(require("@/assets/camera.png"))
      const spriteMaterial1 = new THREE.SpriteMaterial({
        map: texture1,
        transparent: true, //开启透明(纹理图片png有透明信息),
      })

      const texLoader2 = new THREE.TextureLoader()
      const texture2 = texLoader2.load(require("@/assets/label.png"))
      const spriteMaterial2 = new THREE.SpriteMaterial({
        map: texture2,
        transparent: true, //开启透明(纹理图片png有透明信息),
      })
      // 漫游标记
      roamList?.map(v => {

        let sprite = new THREE.Sprite(spriteMaterial)
        // sprite.id = v.id
        sprite.scale.set(.5, .5, .5)
        sprite.position.set(v.x, v.y, v.z)
        sprite.userData = v;
        roamGroup.add(sprite)

        this.createTextSprite(v.name, v.x, v.y, v.z, 'rgba(0, 0, 0, 0.5)', 'white', 24)
      })
      // 监控点标记
      markerList?.map(v => {
        let sprite = new THREE.Sprite(spriteMaterial1)
        // sprite.id = v.id
        sprite.scale.set(1, 1, 1)
        sprite.position.set(v.x, v.y, v.z)
        sprite.userData = v;
        cameraGroup.add(sprite)
        this.createTextSprite(v.name, v.x, v.y, v.z, 'rgba(0, 0, 0, 0.5)', 'white', 24)
      })
      labelList?.map(v => {

        let sprite = new THREE.Sprite(spriteMaterial2)
        // sprite.id = v.id
        sprite.scale.set(.5, .5, .5)
        sprite.position.set(v.x, v.y, v.z)
        sprite.userData = v;
        labelGroup.add(sprite)

        this.createTextSprite(v.name, v.x, v.y, v.z, 'rgba(0, 0, 0, 0.5)', 'white', 24)
      })

      scene.add(roamGroup)
      scene.add(cameraGroup)
      scene.add(textGroup)
      scene.add(labelGroup)

    },
    // 创建灯光
    createLight() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 2); // 创建环境光
      scene.add(ambientLight); // 将环境光添加到场景

    },
    // 创建相机
    createCamera() {
      const element = document.getElementById("container");
      const width = element.offsetWidth; // 窗口宽度
      const height = element.offsetHeight; // 窗口高度
      const k = width / height; // 窗口宽高比
      camera = new THREE.PerspectiveCamera(75, k, 0.1, 1000);
      camera.position.z = 3
      scene.add(camera);
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById("container");
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
      element.appendChild(renderer.domElement);
    },
    // 创建控制器
    createControls() {
      controls = new OrbitControls(camera, renderer.domElement);
      // 初始控制器配置
      controls.enableDamping = true;  // 启用阻尼效果
      // controls.dampingFactor = 0.05;
      controls.minDistance = 1;       // 最小缩放距离（球体半径2 + 安全距离1）
      controls.maxDistance = 5;      // 最大缩放距离
    },
    // 渲染
    render() {
      requestAnimationFrame(this.render);
      TWEEN.update();
      renderer.render(scene, camera);
      controls.update();
      this.getCamerPosition();
    },
    // 监听点击事件
    onClick(event) {
      // 将鼠标点击位置标准化到 [-1, 1]
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // 更新射线并计算交点
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      // 检查是否有 Sprite 被点击
      for (const intersect of intersects) {
        if (intersect.object instanceof THREE.Sprite) {
          const spriteData = intersect.object.userData;
          this.toAction(spriteData)
          break; // 找到第一个后退出循环
        }
      }
    },
    // 根据 type 来判断接下来的操作
    toAction(row) {
      // 如果是漫游 link 则切换背景图并重新渲染
      if (row.type == 'link') {
        currentTargetIndex = 0;
        this.switchCameraTarget(row);
        // return;
        setTimeout(() => {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(
            row.url, // 新纹理路径
            (newTexture) => {
              // 替换材质纹理并更新
              sphere.material.map = newTexture;
              sphere.material.needsUpdate = true; // 关键步骤！
            },
            undefined,
            (err) => console.error('纹理加载失败:', err)
          );
          while (cameraGroup.children.length > 0) {
            const child = cameraGroup.children[0];
            cameraGroup.remove(child);

            // 可选：释放子对象的几何体和材质资源
            if (child.isMesh) {
              child.geometry?.dispose();
              child.material?.dispose();
            }
          }
          while (roamGroup.children.length > 0) {
            const child = roamGroup.children[0];
            roamGroup.remove(child);

            // 可选：释放子对象的几何体和材质资源
            if (child.isMesh) {
              child.geometry?.dispose();
              child.material?.dispose();
            }
          }
          while (textGroup.children.length > 0) {
            const child = textGroup.children[0];
            textGroup.remove(child);

            // 可选：释放子对象的几何体和材质资源
            if (child.isMesh) {
              child.geometry?.dispose();
              child.material?.dispose();
            }
          }

          while (labelGroup.children.length > 0) {
            const child = labelGroup.children[0];
            labelGroup.remove(child);

            // 可选：释放子对象的几何体和材质资源
            if (child.isMesh) {
              child.geometry?.dispose();
              child.material?.dispose();
            }
          }


          let obj = this.dataList?.find((item) => item.id == row.id)
          this.thumbx = obj.thumbx;
          this.thumby = obj.thumby;
          camera.position.set(0, 0, 3)
          this.createPoint(obj)
        }, 900)
      }
      // 如果是监控点，则打开监控点弹窗播放视频
      else if (row.type == 'marker') {
        console.log('open video')
        /*--------------------*/
      }
      else if (row.type == 'label') {
        this.handleOpen(row)
      }
    },
    // 漫游过程的补间动画
    switchCameraTarget(row) {
      if (TWEEN.getAll().length > 0) return; // 防止重复触发

      // 切换目标位置
      const targetPos = new THREE.Vector3(row.x / 2, row.y / 2, row.z / 2);

      // 创建位置补间动画
      new TWEEN.Tween(camera.position)
        .to(targetPos, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          camera.lookAt(row.x, row.y, row.z); // 保持注视中心点
        })
        .start();
    },
    // 创建文字Sprite的函数
    createTextSprite(text, x, y, z, bgColor = 'rgba(0, 0, 0, 0.5)', fontColor = 'white', fontSize) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      context.font = `${fontSize}px Arial`;
      const textWidth = context.measureText(text).width;
      const padding = 10;
      const canvasWidth = textWidth + padding * 2;
      const canvasHeight = fontSize + padding * 2;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context.fillStyle = bgColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      context.fillStyle = fontColor;
      context.font = `${fontSize}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvasWidth / 2, canvasHeight / 2);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(canvasWidth * 0.01, canvasHeight * 0.01, 1);
      sprite.position.set(x, y + 0.5, z)
      textGroup.add(sprite)
    },
    // 切换到不同的场景
    toChange(row) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        row.url, // 新纹理路径
        (newTexture) => {
          // 替换材质纹理并更新
          sphere.material.map = newTexture;
          sphere.material.needsUpdate = true; // 关键步骤！
        },
        undefined,
        (err) => console.error('纹理加载失败:', err)
      );
      while (cameraGroup.children.length > 0) {
        const child = cameraGroup.children[0];
        cameraGroup.remove(child);

        // 可选：释放子对象的几何体和材质资源
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      }
      while (roamGroup.children.length > 0) {
        const child = roamGroup.children[0];
        roamGroup.remove(child);

        // 可选：释放子对象的几何体和材质资源
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      }
      while (textGroup.children.length > 0) {
        const child = textGroup.children[0];
        textGroup.remove(child);

        // 可选：释放子对象的几何体和材质资源
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      }
      let obj = this.dataList?.find((item) => item.id == row.id)
      this.thumbx = obj.thumbx;
      this.thumby = obj.thumby;
      camera.position.set(0, 0, 3)
      this.createPoint(row)
    },
    toAddCamera(event) {
      // 初次添加
      var mouse = new THREE.Vector2()
      const element = document.getElementById('container')
      const width = element.offsetWidth // 窗口宽度
      const height = element.offsetHeight // 窗口高度
      mouse.x = (event.offsetX / width) * 2 - 1
      mouse.y = -(event.offsetY / height) * 2 + 1
      // 定义一个射线，位于相机位置
      var raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      // 计算射线与场景中所有物体的交点
      var intersects = raycaster.intersectObjects(scene.children, true)
      // 如果有交点，则高亮选中的物体
      if (intersects.length == 0) return
      // 取得第一个交点对应的物体
      var selectedObject = intersects[0].object
      const texLoader = new THREE.TextureLoader()
      const texture = texLoader.load(this.camera)
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true, //开启透明(纹理图片png有透明信息),
      })

      let sprite = new THREE.Sprite(spriteMaterial)
      sprite.scale.set(1, 1, 1)
      // sprite.userData = this.recordRow; // 这里recordRow存储监控点信息

      // sprite.position.y = mouse.y; //标签底部箭头和空对象标注点重合
      let point = intersects[0].point
      if (point.x > 0) point.x = point.x - 0.3
      else point.x = point.x + 0.3
      if (point.y > 0) point.y = point.y - 0.3
      else point.y = point.y + 0.3
      if (point.z > 0) point.z = point.z - 0.3
      else point.z = point.z + 0.3
      sprite.position.set(point.x, point.y, point.z)
      cameraGroup.add(sprite)
    },
    // 右键监听
    rightClickEvent(event) {
      let that = this
      var mouse = new THREE.Vector2()
      const element = document.getElementById('container')
      const width = element.offsetWidth // 窗口宽度
      const height = element.offsetHeight // 窗口高度

      mouse.x = (event.offsetX / width) * 2 - 1

      mouse.y = -(event.offsetY / height) * 2 + 1

      // 定义一个射线，位于相机位置
      var raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      // 计算射线与场景中所有物体的交点
      var intersects = raycaster.intersectObjects(cameraGroup.children, true)
      // 如果有交点，则高亮选中的物体
      if (intersects.length == 0) return
      // 取得第一个交点对应的物体
      var selectedObject = intersects[0].object
      that.spriteObj = selectedObject
      that.menuLeft = event.offsetX
      that.menuTop = event.offsetY
      that.showMenu = true
      that.$forceUpdate()
    },
    handleOpen(row) {
      this.previewList = [row.url]
      this.dialogVisible = true;
    },
    handleClose() {
      this.previewList = []
      this.dialogVisible = false;
    },
    getCamerPosition() {

      // 获取相机的旋转四元数

      let rotation = camera.quaternion.clone()

      // 转换为欧拉角（用rotation取特定轴上的旋转角度）

      let euler = new THREE.Euler().setFromQuaternion(rotation, 'YXZ')

      // // 获取绕z轴的旋转角度（转换为度）

      let currentRotZ = THREE.MathUtils.radToDeg(-euler.y)
      // console.log('currentRotZ', currentRotZ)
      const bgRoate = document.querySelector('.thumb-point')

      bgRoate.style.transform = `rotate(${currentRotZ

        ? Number(currentRotZ)

        : currentRotZ

        }deg)`
    },

  },
};
</script>

<style lang="scss" scoped>
.three-box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .three-model {
    width: 100%;
    height: 100%;
  }

  .thumb-box {
    position: absolute;
    top: 50px;
    right: 50px;
    height: 220px;
    display: flex;
    justify-content: center;
    // height: 250px;
    padding: 10px;
    z-index: 9999;
    background-color: rgba($color: #000000, $alpha: 0.6);

    img {
      width: auto;
      height: 220px;
    }

    .thumb-point {
      width: 20px;
      height: 20px;
      position: absolute;
    }
  }

  .scene-box {
    width: 50px;
    height: 50px;
    position: absolute;
    right: 30px;
    bottom: 100px;
    background-color: rgba($color: #000000, $alpha: 0.6);
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .scene-list {
    padding: 0 50px 0 20px;
    height: 50px;
    position: absolute;
    right: 30px;
    bottom: 100px;
    background-color: rgba($color: #000000, $alpha: 0.6);
    border-radius: 25px;
    cursor: pointer;
    font-size: 12px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: left;

    .scene-item {
      padding: 0 20px;
    }
  }

  .menu-box {
    position: absolute;
    width: 60px;
    height: 60px;
    height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    cursor: pointer;
    z-index: 9999;

    .menu-item {
      width: 100%;
      height: 30px;
      text-align: center;
      font-size: 12px;
      line-height: 30px;
      z-index: 999;

      &:hover {
        background-color: green;
        color: #fff;
      }
    }
  }
}
</style>

```