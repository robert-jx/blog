# 数组去重

```js
// 数组去重
let arr = [11, 22, 22, 33, 11]
 
// 利用 Set 的去重复性
let new_arr = [...new Set(arr)]
 
// 使用 indexOf 与 filter 方法
let new_arr1 = arr.filter((item, index) => {
  return arr.indexOf(item) === index
})
 
// 使用 includes 与 forEach 方法
let new_arr2 = []
arr.forEach((item, index) => {
  if (!new_arr2.includes(item)) new_arr2.push(item)
})
 
 
//数组对象去重
let arr = [
  { name: 'name1', age: 22 },
  { name: 'name2', age: 33 },
  { name: 'name1', age: 11 }
]
let new_arr = []
arr.forEach((item) => {
  let exist = false
  for (let el of new_arr) {
    if (item.name === el.name) return (exist = true)
  }
  if (!exist) new_arr.push(item)
})
console.log(new_arr)
```