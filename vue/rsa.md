# 前端 RSA 加密

最近的安全测试中，提出了用RSA对用户登录密码加密的需求。记录一下👇

一般情况下，我们都是使用公钥加密、私钥解密。使用JSEncrypt已经基本可以解决问题

### 安装

```
npm install jsencrypt -s
```

### 引入

```
import JSEncrypt from 'jsencrypt'
```

### 公钥加密

```javascript
const publicKey = '接口获取的公钥'
const encrypt = new JSEncrypt() // 设置公钥
encrypt.setPublicKey(publicKey)
const pass = encrypt.encrypt(password) // 密码加密
```

### 私钥解密

```javascript
const publicKey = '接口获取的私钥'
const crypt = new JSEncrypt() // 设置私钥
crypt.setKey(publicKey)
const content = crypt.decrypt(passContent) // 解密
```



