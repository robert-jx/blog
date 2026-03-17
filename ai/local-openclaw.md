# OpenClaw 本地部署（Windows + Node.js + MiniMax）指南

## 📋 文档信息

|项目|说明|
|---|---|
|适用环境|Windows 10/11 + Node.js ≥ 22.x|
|部署目标|本地运行 OpenClaw 并接入 MiniMax 模型|
|模型选择|MiniMax M2.1 / M2.1 Lightning（国内优先选 CN 节点）|
|配置方式|推荐 OAuth（免 API Key），备选 API Key|
---

## 🧰 一、前置准备

### 1. 硬件要求

- 内存：最低 4GB，推荐 8GB+

- 磁盘：至少 1GB 可用空间，推荐 5GB+（用于依赖与缓存）

- 网络：需稳定联网（依赖下载、模型调用）

### 2. 软件安装（核心）

#### 2.1 Node.js（必选 ≥22.x）

1. 下载：访问 [Node.js 官网](https://nodejs.org/zh-cn/)，选择 Windows 安装包（.msi）（LTS 或 Current 版 ≥22 均可）。

2. 安装：双击运行，勾选**Add to PATH**（自动配置环境变量），其余默认下一步。

3. 验证：以普通用户打开 PowerShell，执行以下命令，输出版本 ≥22 即合格：

```powershell
node --version  # 示例输出：v22.11.0
npm --version   # 示例输出：10.9.0
```

#### 2.2 可选工具

- Windows Terminal：微软商店下载，推荐用于命令行操作。

- Git：[官网下载](https://git-scm.com/download/win)，默认安装即可（仅从源码部署时必需）。

---

## 🚀 二、OpenClaw 安装（两种方式，二选一）

### 方式一：官方一键脚本（推荐，新手友好）

1. 以管理员身份打开 PowerShell（Win+S 搜索 PowerShell → 右键“以管理员身份运行”）。

2. 若遇到执行策略报错，先执行以下命令解除限制，再重新运行安装脚本：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

1. 执行官方安装脚本：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

1. 脚本完成后，自动启动初始化向导；若未自动启动，手动执行：

```powershell
openclaw onboard --install-daemon
```

### 方式二：手动 npm 全局安装（适合有 Node 经验用户）

1. 以普通用户打开 PowerShell，执行全局安装：

```powershell
npm install -g openclaw@latest
```

1. 若出现 sharp 构建失败，添加环境变量跳过原生构建，重新安装：

```powershell
$env:SHARP_IGNORE_GLOBAL_LIBVIPS = 1
npm install -g openclaw@latest
```

1. 执行初始化向导（安装守护进程，实现开机自启）：

```powershell
openclaw onboard --install-daemon
```

---

## 🔑 三、MiniMax 模型配置（核心步骤）

OpenClaw 接入 MiniMax 支持 OAuth（免 API Key） 和 API Key 两种方式，优先推荐 OAuth（更安全、无需手动管理密钥）。

### 方式一：OAuth 配置（推荐，国内用户优先）

1. 启用 MiniMax OAuth 插件并重启网关：

```powershell
openclaw plugins enable minimax-portal-auth
openclaw gateway restart
```

1. 执行认证向导，选择 MiniMax 作为认证方式：

```powershell
openclaw onboard --auth-choice minimax-portal
```

1. 按提示选择节点：

- 国内用户：输入 CN（对接 api.minimaxi.com，低延迟）

- 国际用户：输入 Global（对接 api.minimax.io）

1. 浏览器自动弹出 MiniMax 授权页面，登录账号并授权，完成后返回命令行即可。

### 方式二：API Key 配置（备选，适合自动化场景）

#### 3.1 获取 MiniMax API Key

1. 访问 [MiniMax 平台](https://platform.minimax.io)，注册并登录账号。

2. 进入“API 密钥”页面，创建并复制 API Key（格式：sk-xxx）。

#### 3.2 配置 OpenClaw

1. 临时设置环境变量（仅当前终端有效）：

```powershell
$env:MINIMAX_API_KEY = "sk-你的API密钥"
```

**永久生效**：将 MINIMAX_API_KEY 添加到系统环境变量（此电脑 → 属性 → 高级系统设置 → 环境变量）。

1. 启动配置向导，选择 MiniMax 模型：

```powershell
openclaw configure
```

1. 按交互提示依次选择：

- a. Model/auth → 模型/认证配置

- b. MiniMax M2.1 或 MiniMax M2.1 Lightning（按需选择）

- c. 设置为默认模型

#### 3.3 手动编辑配置文件（可选，高级用户）

若需自定义模型参数，编辑 OpenClaw 配置文件 ~/.openclaw/openclaw.json（Windows 路径：C:\Users\你的用户名\.openclaw\openclaw.json），替换 models 部分为以下内容：

```json
{
  "env": {
    "MINIMAX_API_KEY": "sk-你的API密钥"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "minimax/MiniMax-M2.1"  // 设为默认模型
      }
    }
  },
  "models": {
    "mode": "merge",
    "providers": {
      "minimax": {
        "baseUrl": "https://api.minimaxi.com/anthropic",  // 国内节点
        "apiKey": "${MINIMAX_API_KEY}",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "MiniMax-M2.1",
            "name": "MiniMax M2.1",
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "MiniMax-M2.1-lightning",
            "name": "MiniMax M2.1 Lightning",
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
```

编辑完成后，重启网关使配置生效：

```powershell
openclaw gateway restart
```

---

## ✅ 四、部署验证与基础使用

### 1. 服务状态检查

执行以下命令，确保所有服务正常运行：

```powershell
# 检查系统依赖与配置完整性
openclaw doctor
# 查看网关状态
openclaw status
# 检查模型连接健康度
openclaw health
```

### 2. 模型可用性验证

1. 列出已配置的模型，确认 MiniMax 模型存在：

```powershell
openclaw models list
```

1. 切换到目标 MiniMax 模型（若未设为默认）：

```powershell
openclaw models set minimax/MiniMax-M2.1
```

1. 发起测试对话，验证模型响应：

```powershell
openclaw chat "你好，请介绍一下自己"
```

若收到 MiniMax 模型的回复，说明配置成功。

### 3. 打开 Web 控制台

执行以下命令，自动在浏览器打开 OpenClaw 仪表盘（支持可视化操作与聊天）：

```powershell
openclaw dashboard
```

---

## 🛠️ 五、常见问题与故障排除

|问题现象|原因分析|解决方案|
|---|---|---|
|openclaw: 无法将“openclaw”项识别为 cmdlet|npm 全局路径未加入系统 PATH|1. 执行 npm prefix -g 获取全局路径；2. 将该路径添加到系统环境变量 PATH；3. 重启终端生效。|
|模型调用失败，提示“认证失败”|OAuth 授权过期或 API Key 错误|1. OAuth 方式：重新执行 openclaw onboard --auth-choice minimax-portal 授权；2. API Key 方式：检查密钥是否正确，重新配置环境变量。|
|sharp 安装失败，出现编译错误|缺少原生构建工具|执行 $env:SHARP_IGNORE_GLOBAL_LIBVIPS = 1 后，重新安装 OpenClaw。|
|网关启动失败，提示端口被占用|默认端口（如 3000）被占用|编辑 ~/.openclaw/openclaw.json，修改 gateway 端口配置，重启网关。|
---

## 📊 六、维护与管理

### 1. 版本更新

```powershell
# 一键更新到最新版
npm update -g openclaw@latest
# 重启网关使更新生效
openclaw gateway restart
```

### 2. 服务启停

```powershell
# 启动网关
openclaw gateway start
# 停止网关
openclaw gateway stop
# 重启网关
openclaw gateway restart
```

### 3. 卸载 OpenClaw

```powershell
# 全局卸载
npm uninstall -g openclaw
# 删除配置文件（可选）
Remove-Item -Recurse -Force ~/.openclaw
```

---

## 📌 附录：关键路径与命令汇总

### 1. 关键路径

- OpenClaw 配置目录：C:\Users\你的用户名\.openclaw

- 核心配置文件：~/.openclaw/openclaw.json

### 2. 常用命令

|功能|命令|
|---|---|
|初始化配置|openclaw onboard --install-daemon|
|模型配置|openclaw configure|
|切换模型|openclaw models set minimax/MiniMax-M2.1|
|测试对话|openclaw chat "测试内容"|
|打开仪表盘|openclaw dashboard|
|重启网关|openclaw gateway restart|
