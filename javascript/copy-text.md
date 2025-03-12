# 实现文本复制功能

该内容记录了如何使用 `javascript` 实现自定义文本复制功能

```js
toCopy(){
    let copyText = '你想要复制的内容'
    const input = document.createElement('textarea');
    document.body.appendChild(input);
    input.innerHTML = copyText;
    input.setAttribute('code',1);
    input.select();
    document.execCommand("Copy");
    
    var list = document.getElementsByTagName('textarea');
    var inputList = Array.prototype.slice.call(list);
    inputList.forEach((item)=>{
           if(item.getAttribute('code'))document.body.removeChild(item);
    });
}
```
