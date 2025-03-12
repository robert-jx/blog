# 实现项目的自动化部署

基于前端项目打包部署时比较繁琐，故研究了一下如何使用脚本实现一键打包并自动部署到公司的本地服务器。由于公司本地服务器部署时使用的时 `xshell`，因此脚本采用的原理是 `sftp`，这里选用的是 `ssh2-sftp-client`

## 安装

```js-nolint
npm install ssh2-sftp-client --save-dev
```

## 使用

在项目根目录建立个新文件 `deploy.js`，然后输入以下代码👇

```js
const SftpClient = require('ssh2-sftp-client');
const path = require('path');

const sftp = new SftpClient();
const localPath = path.resolve(__dirname, './dist')
const remotePath = '/test/here' //远程路径
const remotePathDir = `${remotePath}/www`

const configFtp = {
    host: 'host', // 使用你的测试 host
    port: 22,              // 使用你的测试端口
    username: 'username',     // 使用拼接后的用户名
    password: 'password',        // 使用你的密码
}

const main = async () => {
    try {
        await sftp.connect(configFtp);
        console.log('Connected to SFTP server successfully!');
        // 文件操作
        if (await sftp.exists(remotePath)) {
            // 第一次上传没有dist文件夹，创建dist文件夹
            if (!(await sftp.exists(remotePathDir))) {
                // 递归创建目录
                await sftp.mkdir(remotePathDir, true);
                console.log(`Directory created: ${remotePathDir}`);
            }
            // else {
            //     // 删除dist文件夹
            //     await sftp.rmdir(remotePathDir, true)
            //     console.log('File deleted successfully')
            // }

            // 上传文件
            await sftp.uploadDir(localPath, remotePathDir);
            console.log('File uploadDir successfully');
        }
    } catch (err) {
        // 错误处理
        console.error('Error connecting to SFTP server:', err);
    } finally {
        // 关闭连接（别忘了）
        await sftp.end();
    }
};

main();

```

到这里，就已经可以使用以下命令去部署了：

```js-nolint
node deploy.js
```

还可以再简洁一点，在 `package.json` 文件内声明一下该命令：

```js
"build:p": "vue-cli-service build&&node deploy.js"
```

这样子以后只需要输入 `npm run build:p` 就可以执行打包和部署全部步骤了！