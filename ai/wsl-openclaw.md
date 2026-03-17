# Windows系统下虚拟机Ubuntu安装OpenClaw详细部署说明文档

## 一、文档概述

### 1.1 文档目的

本文档详细描述在Windows操作系统中，通过VMware Workstation搭建Ubuntu虚拟机，并在虚拟机内完成OpenClaw的安装、配置与验证的全流程，适用于零基础用户，每一步均提供具体操作指引、命令说明及常见问题解决方案，确保部署过程可复现、无遗漏。

### 1.2 适用环境

- 主机系统：Windows 10/11（64位，建议专业版）

- 虚拟机软件：VMware Workstation 17（推荐17.5及以上版本，兼容性更好）

- Ubuntu系统：Ubuntu 24.04 LTS（长期支持版，稳定性强，适配OpenClaw所有版本）

- OpenClaw版本：最新稳定版（文档将采用官方推荐的一键安装方式，自动适配最新版本）

### 1.3 硬件要求

为确保虚拟机及OpenClaw正常运行，主机硬件需满足以下最低要求，推荐配置可提升运行流畅度：

|硬件类型|最低要求|推荐要求|
|---|---|---|
|处理器|双核及以上，支持虚拟化技术（VT-x/AMD-V）|四核及以上，Intel i5/i7或AMD Ryzen 5/7|
|内存（RAM）|4GB空闲内存（主机总内存≥8GB）|8GB空闲内存（主机总内存≥16GB）|
|存储空间|至少25GB可用磁盘空间（建议非C盘）|50GB及以上可用磁盘空间（SSD优先，提升读写速度）|
|网络|稳定的有线/无线网络（用于下载系统镜像、软件依赖）|高速网络（加速镜像及依赖包下载）|
### 1.4 前置准备

部署前需提前下载以下工具及镜像，建议保存至非C盘（如D盘“部署工具”文件夹），避免后续操作中磁盘空间不足：

- VMware Workstation 17安装包：可从[VMware官方网站](https://www.vmware.com/)下载，或参考文档提供的可靠链接（二选一即可，如17.5或17.6版本）

- Ubuntu 24.04 LTS镜像文件（ISO格式）：从Ubuntu官方网站下载，无需解压，直接用于虚拟机安装；

- 管理员权限：Windows主机需拥有管理员权限，用于安装VMware及启用虚拟化功能；

- 网络通畅：确保主机可正常访问互联网，用于下载Ubuntu系统更新、OpenClaw及相关依赖。

## 二、Windows主机安装VMware Workstation

### 2.1 安装步骤

1. 双击下载的VMware Workstation安装包，弹出安装向导，点击“下一步”；

2. 勾选“我接受许可协议中的条款”，点击“下一步”；

3. 选择安装路径（建议修改为非C盘，如D:\Program Files\VMware），取消勾选“启动时检查产品更新”（可后续手动更新），点击“下一步”；

4. 取消勾选“创建桌面快捷方式”“创建开始菜单快捷方式”（可选，根据个人习惯），点击“下一步”；

5. 点击“安装”，等待安装完成（约5-10分钟，取决于主机性能）；

6. 安装完成后，弹出激活界面，可输入激活密钥（自行获取），或选择“试用30天”，点击“完成”；

7. 启动VMware Workstation，确认软件正常打开，无报错即可进入下一步。

### 2.2 启用主机虚拟化功能（关键步骤）

若启动VMware后提示“无法启用虚拟化”，需先在主机BIOS中启用虚拟化功能，操作步骤如下：

1. 关闭Windows主机，重启电脑；

2. 开机时立即多次按快捷键（不同品牌电脑不同，常见F2、Delete、F10），进入BIOS界面；

3. 在BIOS中找到“Virtualization”“VT-x”或“SVM”选项（通常在“Advanced”“CPU Configuration”菜单下）；

4. 将该选项设置为“Enabled”（启用），按快捷键保存并退出BIOS（通常为F10）；

5. 重启电脑，再次启动VMware，即可正常使用虚拟化功能。

### 2.3 常见问题

- 问题1：安装VMware时提示“缺少.NET Framework”？
解决方案：下载并安装对应版本的.NET Framework（可从微软官网下载），重启电脑后重新安装VMware。

- 问题2：BIOS中找不到虚拟化选项？
解决方案：确认主机处理器支持虚拟化技术（大部分2018年后的电脑均支持），若仍找不到，可查询电脑品牌的BIOS操作手册，或联系厂商客服。

## 三、VMware中创建并安装Ubuntu虚拟机

### 3.1 创建虚拟机

1. 启动VMware Workstation，点击主界面“创建新虚拟机”，或通过“文件→新建虚拟机”进入向导；

2. 在弹出的向导中，选择“典型（推荐）”选项，点击“下一步”；

3. 选择“安装程序光盘镜像文件（ISO）”，点击“浏览”，找到提前下载的[Ubuntu 2](https://ubuntu.com/download/desktop)[4](https://ubuntu.com/download/desktop)[.04 LTS ISO镜像文件](https://ubuntu.com/download/desktop)，点击“下一步”；

4. VMware会自动识别Ubuntu系统，无需手动选择系统类型，直接进入个性化设置界面：
- 全名：输入英文名或拼音（如“ZhangWei”，禁止使用中文、空格及特殊符号）；
- 用户名：输入小写英文字母（如“zhangwei”，将作为Ubuntu登录用户名）；
- 密码：设置易记且不易破解的密码（如“Ubuntu123!”）；
- 确认密码：再次输入相同密码；
填写完成后点击“下一步”。

1. 命名虚拟机（如“Ubuntu-OpenClaw”），选择虚拟机文件保存路径（建议非C盘，如D:\VMware\Ubuntu-OpenClaw），点击“下一步”；

2. 设置虚拟磁盘大小：基础使用建议25-30GB，若需深度使用或安装更多依赖，建议40-60GB，保持默认的“将虚拟磁盘存储为单个文件”，点击“下一步”；

3. 在概要页面确认所有设置无误，点击“完成”，虚拟机开始创建并自动启动，进入Ubuntu安装流程。

### 3.2 安装Ubuntu系统

虚拟机启动后，会自动进入Ubuntu安装界面，按以下步骤操作：

1. 选择安装语言：默认“Chinese”，点击“Install Ubuntu”；

2. 选择键盘布局：默认“汉语)”，点击“Continue”；

3. 提示更新可用，选择跳过

4. 选择安装类型：交互式安装，包含图形界面及常用工具，点击“Continue”；

5. 磁盘分区：默认“Erase disk and install Ubuntu”（擦除虚拟磁盘并安装，仅针对虚拟机磁盘，不影响主机），点击“Install Now”，弹出确认提示，点击“Continue”；

6. 确认用户信息：自动填充之前设置的全名、用户名及密码，无需修改，点击“Continue”；

7. 选择时区：在地图上点击“Shanghai”（或搜索“Shanghai”），确认时区为“Asia/Shanghai”，点击“Continue”；

8. 开始安装：系统自动完成安装流程，期间会下载系统更新及依赖，耗时约15-25分钟（取决于网络速度和主机性能）；

9. 安装完成后，弹出提示“Please restart now”，点击“Restart Now”，虚拟机重启，重启时会提示“Please remove the installation medium”，无需操作，直接按Enter键即可；

10. 重启后，进入Ubuntu登录界面，输入之前设置的密码，登录系统，至此Ubuntu虚拟机安装完成。

### 3.3 虚拟机优化配置（选做）

为提升虚拟机使用体验，解决屏幕分辨率、鼠标切换、文件共享等问题，需完成以下优化配置：

#### 3.3.1 安装VMware增强工具

1. 在VMware菜单栏点击“虚拟机→安装VMware Tools”；

2. Ubuntu桌面会出现一个挂载的光盘图标，双击打开，找到里面的VMware Tools安装包（.tar.gz格式）；

3. 右键点击安装包，选择“提取到…”，将其解压到桌面；

4. 打开终端（按快捷键Ctrl+Alt+T），输入以下命令进入解压后的目录（替换“vmware-tools-distrib”为实际解压文件夹名称）：
`cd 桌面/vmware-tools-distrib/`

5. 执行安装命令（添加-d参数可使用默认设置，无需手动确认）：
`sudo ./vmware-install.pl -d`

6. 安装完成后，输入命令重启虚拟机：
`sudo reboot`

7. 重启后，虚拟机分辨率会自动适配主机屏幕，鼠标可无缝在主机与虚拟机之间切换，剪贴板共享功能也会生效。

#### 3.3.2 更新系统及安装基础工具

新安装的Ubuntu系统需更新软件包，避免依赖冲突，同时安装后续OpenClaw所需的基础工具：

1. 打开终端，输入以下命令更新系统包列表：
`sudo apt update && sudo apt upgrade -y`

2. 安装基础工具链（git、curl等，OpenClaw安装必需）：
`sudo apt install -y curl wget git build-essential`

3. 等待命令执行完成，若出现提示“是否继续”，按Enter键确认即可。

#### 3.3.3 配置中文输入法（可选）

若需要在Ubuntu中使用中文输入，可按以下步骤配置：

1. 在终端输入命令安装中文输入法相关包：
`sudo apt install fcitx5 fcitx5-chinese-addons -y`

2. 打开“设置→区域和语言→输入源”，点击“+”号，添加中文输入法；

3. 重启虚拟机，按Ctrl+空格即可切换中英文输入法。

#### 3.3.4 配置主机与虚拟机文件共享（可选）

为方便在主机与虚拟机之间传输文件，可通过VMware共享文件夹功能实现，步骤如下：

1. 关闭Ubuntu虚拟机，在VMware中右键点击该虚拟机，选择“设置→选项→共享文件夹”；

2. 点击“添加”，选择主机上的文件夹（如D:\VMware\Share）作为共享目录，勾选“启动共享”，点击“完成”；

3. 在“共享文件夹”界面选择“总是启用”，点击“确定”；

4. 启动虚拟机，在Ubuntu中进入“/mnt/hgfs”目录，即可看到共享文件夹，实现主机与虚拟机文件互传。

### 3.4 常见问题

- 问题1：Ubuntu安装时卡在“Download updates”界面？
解决方案：取消勾选“Download updates while installing Ubuntu”，先完成安装，后续再手动更新系统。

- 问题2：虚拟机屏幕太小，分辨率无法调整？
解决方案：确认VMware增强工具已正确安装，若未安装或安装失败，重新执行3.3.1步骤；若已安装仍有问题，输入命令：
`sudo apt install open-vm-tools-desktop -y && sudo reboot`。

- 问题3：Ubuntu无法上网？
解决方案：在VMware中选择“编辑→虚拟网络编辑器”，确保NAT模式已启用；在Ubuntu终端输入以下命令修复DNS：
`echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf && sudo service network-manager restart`。

## 四、Ubuntu虚拟机中安装OpenClaw

OpenClaw提供三种主流安装方式：一键脚本安装（最推荐，适合新手）、Docker安装（适合环境隔离）、源码安装（适合开发者），本文重点介绍一键脚本安装方式，兼顾便捷性和稳定性，同时简要说明其他两种方式的操作流程。

### 4.1 安装前准备

1. 确认Ubuntu虚拟机已联网，可通过终端输入以下命令测试网络连通性：
`ping www.baidu.com`，若能正常接收数据包，说明网络正常；

2. 确认已完成3.3.2步骤的系统更新及基础工具安装，避免依赖缺失；

3. （可选）若需使用AI模型功能，提前获取对应AI供应商的API密钥（如OpenAI、Anthropic等），后续配置时需用到。

### 4.2 一键脚本安装（最推荐）

这是官方推荐的最简单方式，脚本会自动处理Node.js依赖的检测、安装，以及OpenClaw的部署，无需手动配置，步骤如下：

1. 打开Ubuntu终端（Ctrl+Alt+T）；

2. 输入以下一键安装命令，按Enter键执行：
`curl -fsSL https://openclaw.ai/install.sh | bash`

3. 脚本执行过程中，会自动下载Node.js（22+版本，OpenClaw必需）及OpenClaw相关依赖，耗时约5-10分钟（取决于网络速度）；

4. 若出现“Permission denied”（权限不足）提示，在命令前添加sudo：
`sudo curl -fsSL https://openclaw.ai/install.sh | bash`

5. 等待脚本执行完成，若提示“OpenClaw installed successfully”，说明安装成功。

### 4.3 Docker安装（环境隔离，可选）

若偏好使用Docker实现环境隔离，避免影响Ubuntu系统原有配置，可按以下步骤操作：

1. 安装Docker及Docker Compose（若未安装）：
`sudo apt install -y docker.io docker-compose`

2. 启动Docker服务并设置开机自启：
`sudo systemctl start docker && sudo systemctl enable docker`

3. 创建并进入OpenClaw项目目录：
`mkdir -p ~/openclaw && cd ~/openclaw`

4. 克隆OpenClaw官方仓库：
`git clone https://github.com/openclaw/openclaw.git .`

5. 运行Docker设置脚本，自动构建镜像、生成访问令牌并启动服务：
`./docker-setup.sh`

6. 脚本执行完成后，Docker容器会自动启动，OpenClaw部署完成。

### 4.4 源码安装（开发者，可选）

若需修改OpenClaw源码，可选择从源码编译安装，步骤如下：

1. 安装Node.js 22+（若未安装）：
`curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash && sudo apt install -y nodejs`

2. 验证Node.js版本：
`node --version`，需显示v22.x.x；

3. 克隆OpenClaw官方仓库：
`git clone https://github.com/openclaw/openclaw.git`

4. 进入仓库目录并安装依赖、编译源码：
`cd openclaw && npm install && npm run build`

5. 编译完成后，即可启动OpenClaw。

## 五、OpenClaw初始化配置与验证

### 5.1 初始化配置

安装完成后，需通过交互式向导完成OpenClaw的核心配置，包括AI模型选择、API密钥配置等，步骤如下：

1. 打开终端，输入以下命令启动配置向导：
`openclaw onboard --install-daemon`

2. 按照向导提示逐步操作：
① 选择AI模型提供商：根据自身需求选择（如OpenAI、Anthropic、阿里云百炼等）；
② 输入API密钥：粘贴提前获取的对应AI供应商的API密钥（密钥仅存储在本地，不发送至第三方）；
③ 配置网关守护进程：确认安装，该进程可让OpenClaw在后台持续运行，并支持开机自启；
④ 设置工作区路径：默认路径为~/.openclaw/workspace，用于存储配置和数据，无需修改，直接确认；

3. 配置完成后，向导会提示“Configuration completed successfully”，表示初始化完成。

注：若使用Docker安装，docker-setup.sh脚本会自动启动配置向导，无需手动执行上述命令。

### 5.2 验证安装

配置完成后，需验证OpenClaw是否正常运行，步骤如下：

1. 检查OpenClaw版本，确认安装成功：
`openclaw --version`，若能显示版本号（如v2026.3.2），说明安装正常；

2. 检查网关状态，确认守护进程正常运行：
`openclaw gateway status`，若显示“running”，说明网关已启动；

3. 获取访问令牌（用于登录Web界面）：
`grep -A1 '"token"' ~/.openclaw/openclaw.json`，复制输出的令牌内容；

4. 访问Web UI：打开Ubuntu自带的浏览器，输入地址`http://127.0.0.1:18789`，粘贴获取的令牌，点击登录；

5. 登录成功后，进入OpenClaw控制面板，可尝试发送测试消息（如“你能做什么？”），若能正常回复，说明OpenClaw完全部署成功。

### 5.3 额外配置（可选）

#### 5.3.1 局域网访问配置

若需在主机或局域网内其他设备访问Ubuntu虚拟机中的OpenClaw Web界面，需修改配置，让其监听所有网络接口：

```Plain Text
openclaw config set gateway.bind lan && openclaw gateway restart
```

修改后，可通过“Ubuntu虚拟机IP地址:18789”访问Web界面（虚拟机IP可通过`ifconfig`命令查询）。

#### 5.3.2 开机自启配置

若希望Ubuntu重启后，OpenClaw自动启动，可执行以下命令：
`sudo systemctl enable openclaw`

### 5.4 常见问题

- 问题1：执行openclaw命令提示“command not found”？
解决方案：确认OpenClaw安装成功，若未成功，重新执行一键安装命令；若已安装，重启终端后再次尝试。

- 问题2：网关状态显示“stopped”，无法启动？
解决方案：检查Node.js版本是否为22+，若版本过低，重新安装Node.js；执行命令`openclaw gateway start`手动启动网关。

- 问题3：Web界面无法访问？
解决方案：确认网关已启动，检查Ubuntu防火墙是否关闭（执行`sudo ufw disable`关闭防火墙）；若为局域网访问，确认虚拟机IP地址正确，且主机与虚拟机网络互通。

## 六、后续操作与维护

### 6.1 OpenClaw升级

为获取最新功能和安全补丁，可定期升级OpenClaw，根据安装方式选择对应命令：

- 一键脚本/ npm安装：
`npm update -g openclaw@latest`

- Docker安装：
`docker pull openclaw/openclaw:latest && docker restart openclaw`

- 源码安装：
`cd openclaw && git pull && npm install && npm run build`

### 6.2 虚拟机备份与恢复

为避免部署环境丢失，可定期备份虚拟机：

1. 关闭Ubuntu虚拟机；

2. 在VMware中右键点击该虚拟机，选择“管理→克隆”，按照向导完成克隆（备份）；

3. 若需恢复，直接打开克隆后的虚拟机文件即可。

### 6.3 常见故障排查

- 故障1：OpenClaw无法调用AI模型，提示“API Key错误”？
解决方案：检查API密钥是否正确，确认密钥未过期，重新在配置向导中输入密钥。

- 故障2：虚拟机运行卡顿？
解决方案：关闭虚拟机，在VMware中右键点击虚拟机→“设置”，增加内存（至少4GB）和处理器核心数（至少2核），若有条件，将虚拟磁盘迁移到SSD。

- 故障3：OpenClaw启动失败，提示依赖缺失？
解决方案：重新执行系统更新命令`sudo apt update && sudo apt upgrade -y`，然后重新安装OpenClaw。

## 七、总结

本文档完整覆盖了“Windows主机安装VMware→创建并配置Ubuntu虚拟机→安装OpenClaw→初始化配置与验证”的全流程，重点推荐新手使用一键脚本安装OpenClaw，操作简单、不易出错。部署过程中，若遇到问题，可参考各章节的常见问题解决方案，或查阅OpenClaw官方文档（https://openclaws.io/zh/install/）获取更多帮助。

完成部署后，可根据自身需求，配置AI模型、局域网访问等功能，充分发挥OpenClaw的作用。