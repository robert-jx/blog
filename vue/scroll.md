# 鼠标滚轮实现元素横向滚动

在实现面包屑功能的时候，要考虑到面包屑长度过长后不易查找的情况。因此想着使用原生js来实现一个鼠标滚轮控制元素横向滚动的效果。

## 实现过程

首先，要给目标元素提前添加好overflow-x等效果👇

```css
.crumbs{
    ...
    overflow-x:auto;
    
}
```

然后在methods里面添加鼠标滚动事件

```js
handleScroll(e) {
  let direction = e.deltaY > 0 ? '0' : '1'
  const crumbs = document.querySelector('.crumbs')
  //下面的实现的是内部元素横向滚动
  if (direction === '0') {
    tabBar.scrollLeft += 30
  } else {
    tabBar.scrollLeft -= 30
  }
}
```

接着在mounted()里面添加事件监听，整个横向滚动效果就实现了

```js
mounted(){
  const crumbs = document.querySelector('.crumbs')
  crumbs.addEventListener('mousewheel', this.handleScroll) // 监听滚轮滚动事件
}
```

## 完整代码👇

```html
<template>
    <section>
        <section class="crumbs">
            <section v-for="(item,index) in menuList" :key="index"></section>
        </section>
    </section>
</template>
<script>
    export default{
        name:'crumbs',
        data(){
            return{
                menuList:[]
            }
        },
        mounted(){
            const crumbs = document.querySelector('.crumbs')
            crumbs.addEventListener('mousewheel', this.handleScroll) // 监听滚轮滚动事件
        },
        methods:{
            handleScroll(e) {
              let direction = e.deltaY > 0 ? '0' : '1'
              const crumbs = document.querySelector('.crumbs')
              //下面的实现的是内部元素横向滚动
              if (direction === '0') {
                crumbs.scrollLeft += 30
              } else {
                crumbs.scrollLeft -= 30
              }
            }
        }
    }
</script>

<style lang="scss" scoped>
.crumbs{
    width:100%;
    ...
    overflow-x:auto;
}
</style>
```
