# 防抖和节流

## 防抖

```js
// 连续触发，只执行一次
/** 
 * fn 要执行的回调
 * wait 延时的时间
 * promptly 是否立即执行
 */
let times = null
function Debounce(fn, wait = 200, promptly = false) {
  if (times !== null) clearTimeout(times)
  if (promptly) { // 多次触发只执行第一次
    let callNow = !times
    times = setTimeout(() => {
      times = null
    }, wait)
    if (callNow) typeof fn === 'function' && fn()
  } else { // 多次触发只执行最后一次
    times = setTimeout(() => {
      typeof fn === 'function' && fn()
    }, wait)
  }
}
Debounce( () => { console.log('test') }, 1000, true )
```

## 节流

```js
// 触发后，需等待 wait 时间冷却
/**
 * fn 要执行的回调
 * wait 冷却时间
 * promptly 是否立即执行
 */
let times, flag;
function Throttle(fn, wait = 200, promptly = false) {
  if (promptly) { // 立即执行
    if (!flag) {
      flag = true
      typeof fn === 'function' && fn()
      times = setTimeout(() => {
        flag = false
      }, wait)
    }
  } else {  // 延迟执行
    if (!flag) {
      flag = true
      times = setTimeout(() => {
        flag = false
        typeof fn === 'function' && fn()
      }, wait)
    }
  }
}
Throttle( () => { console.log('test') }, 1000, true )
```