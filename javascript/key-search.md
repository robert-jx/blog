# 实现模糊过滤功能

```js
function keySearch(list, keyWord, column = 'title') {
  const reg = new RegExp(keyWord, 'i')
  return list.filter((item) => reg.test(item[column]))
}
```