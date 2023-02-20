长期以来，node 中自带的包管理工具只有 [npm](https://docs.npmjs.com/), 作为官方指定工具，使用者众多，从体验上来讲，却是一般，速度真的慢。

### npm 的不足

-   串行安装，要等队列中当前 package 安装成功后才会继续下一个package 的安装
-   install 慢，无缓存，删除node_modules 后重新 install 无法利用缓存
-   node_modules 依赖冗余过多

npm 下载慢的问题一个重要原因是因为包镜像在国外，所以可以通过修改使用国内镜像源来解决这个问题

```
// 查看当前镜像源
npm config get registry

// 临时修改
npm install 软件名 --registry https://registry.npm.taobao.org

// 全局修改
npm config set registry https://registry.npm.taobao.org 
```

如果需要频繁切换的话可以使用开源工具 [nrm](https://github.com/Pana/nrm)，更方便一些

```
npm install -g nrm

nrm ls // 列出可用的镜像源
    npm -----  https://registry.npmjs.org/
    cnpm ----  http://r.cnpmjs.org/
    taobao --  https://registry.npm.taobao.org/
    nj ------  https://registry.nodejitsu.com/
    rednpm -- http://registry.mirror.cqupt.edu.cn
    skimdb -- https://skimdb.npmjs.com/registr
    
// 切换镜像源
nrm use cnpm 

// 测试速度
nrm test taobao 

// 可以增加定制的源，特别适用于添加企业内部的私有源
nrm add <registry> <url>

// 删除源
nrm del <registry>
```

搭建企业内网私有源的一种方案：[cnpmjs架设](https://segmentfault.com/a/1190000000368906)

### 试试其它的吧

#### cnpm

cnpm 这个是国内淘宝镜像，是为解决 npm 速度太慢的问题而产生的，控制台log 也清晰许多,但是它最大的问题是会忽视 package-lock.json 文件，也就是说 你无法锁定小版本，可能会导致依赖版本不一致引起的 bug，防止这个隐患则需要在 package.json 中就锁定版本，如下：

-   符号^：表示主版本固定的情况下，可更新最新版。例如：vuex: "^3.1.3"，3.1.3及其以上的3.x.x都是满足的。
-   符号~：表示次版本固定的情况下，可更新最新版。如：vuex: "~3.1.3"，3.1.3及其以上的3.1.x都是满足的。
-   无符号：无符号表示固定版本号，例如：vuex: "3.1.3"，此时一定是安装3.1.3版本。

#### yarn（npm的升级替代品）

yarn 是 Facebook, Google, Exponent 和Tilde 开发的一款新的JavaScript 包管理工具  
，是为了解决npm的缺点而产生的，Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载，同时利用并行下载以最大化资源利用率，因此安装速度更快。

特点：

-   速度超快 Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。
-   超级安全 在执行代码之前，Yarn 会通过算法校验每个安装包的完整性。
-   超级可靠 使用详细、简洁的锁文件格式和明确的安装算法，Yarn 能够保证在不同系统上无差异的工作。
-   离线模式 如果你以前安装过某个包，再次安装时可以在没有任何互联网连接的情况下进行。
-   确定性 不管安装顺序如何，相同的依赖关系将在每台机器上以相同的方式安装。
-   网络性能 Yarn 有效地对请求进行排队处理，避免发起的请求如瀑布般倾泻，以便最大限度地利用网络资源。
-   相同的软件包 从 npm 安装软件包并保持相同的包管理流程。
-   网络弹性 `重试机制`确保单个请求失败并不会导致整个安装失败。
-   扁平模式 将依赖包的不同版本归结为单个版本，以避免创建多个副本。

常用指令：

```
// 全局安装
npm install -g yarn

// 初始化一个项目
yarn init

// 添加依赖包
yarn add [package]

// 升级依赖包
yarn upgrade [package]

// 移除依赖包
yarn remove [package]

// 安装全部依赖
yarn install （或者 yarn）
```

使用文档：[https://yarn.bootcss.com](https://yarn.bootcss.com/)

#### pnpm （新一代包管理工具）

> 当使用 npm 或 Yarn 时，如果你有100个项目使用了某个依赖（dependency），就会有100份该依赖的副本保存在硬盘上。 而在使用 pnpm 时，依赖会被存储在内容可寻址的存储中，所以，如果你用到了某依赖项的不同版本，那么只会将有差异的文件添加到仓库。 例如，如果某个包有100个文件，而它的新版本只改变了其中1个文件。那么 pnpm update 时只会向存储中心额外添加1个新文件，而不会因为仅仅一个文件的改变复制整新版本包的内容。  
> 摘自：[https://pnpm.io/zh/motivation](https://pnpm.io/zh/motivation)

pnpm 的项目初衷是节约磁盘空间并提升安装速度

[![cafs-illustration-7be6bd97e43ba11a031b099869321deb](https://user-images.githubusercontent.com/37775265/154393765-9359698b-d3c8-4632-9b7f-eddafc853188.jpeg)](https://user-images.githubusercontent.com/37775265/154393765-9359698b-d3c8-4632-9b7f-eddafc853188.jpeg)

所有文件都会存储在硬盘上的某一位置。 当软件包被被安装时，包里的文件会硬链接到这一位置，而不会占用额外的磁盘空间。这允许你跨项目地共享同一版本的依赖,因此，您在磁盘上节省了大量空间，这与项目和依赖项的数量成正比，并且安装速度要快得多。

pnpm 支持npm yarn corepack等多种安装使用方式，比如

```
npm install -g pnpm
pnpm add -g pnpm // 用来升级版本

| npm 命令 | pnpm 等效 |
| npm install | pnpm install |
| npm i <pkg> | pnpm add <pkg> |
| npm run <cmd> | pnpm <cmd> |
```

使用文档：[https://pnpm.io/zh/pnpm-cli](https://pnpm.io/zh/pnpm-cli)

### Corepack「管理包管理器的管理器」

> Corepack is a zero-runtime-dependency Node.js script that acts as a bridge between Node.js projects and the package managers they are intended to be used with during development. In practical terms, Corepack will let you use Yarn and pnpm without having to install them - just like what currently happens with npm, which is shipped by Node.js by default.  
> 摘自：[https://github.com/nodejs/corepack](https://github.com/nodejs/corepack)

Corepack是一个实验性工具，在 Node.js v16.13 版本中引入，它可以指定项目使用的包管理器以及版本, 简单来说，Corepack 会成为 Node.js 官方的内置 CLI，用来管理『包管理工具（~~npm~~、yarn、pnpm、~~cnpm~~）』，用户无需手动安装，即『包管理器的管理器』。

主要作用：

-   不再需要专门全局安装 yarn pnpm 等工具。
-   可以强制团队项目中使用他特定的包管理器版本，而无需他们在每次需要进行更新时手动同步它，如果不符合配置将在控制台进行错误提示。

### corepack 用法

由于corepack 是一个实验性工具，所以默认是没有启动的，需要显式启用，需要运行指令 corepack enable 进行启动；在项目package.json 文件中新增属性 "packageManager"，比如

```
"packageManager": "yarn@1.22.15"

```

代表当前项目只允许使用yarn 包管理器并指定1.22.15版本

```
// 当前应用激活
corepack enable

// 定义包管理器
packageManager": "yarn@1.22.15"

// 声明的包管理器，会自动下载对应的 yarn，然后执行
yarn install

// 用非声明的包管理器，会自动拦截报错
pnpm install
Usage Error: This project is configured to use yarn
```

因为在试验阶段，目前还有些问题待解决：

-   目前仅支持 pnpm 和 yarn，cnpm 也是不支持的
-   兼容性还有些问题，npm 还无法拦截也就是说 即便配置了 packageManager 使用 yarn，但是依然可以调用全局 npm 安装

### 总结

> The full npm package wouldn't be included out of the box anymore (this might be an incremental move, with first a major version shipping pmm + npm, and the next one discarding npm)  
> npm 将慢慢从 Node.js 内置包中移除，预计在下一个大版本启动

虽然npm 是现在node的默认包管理器，但是由于它多年来的不思进取，及种种缺陷，corepack 的出现可以说是大快人心，其最大的意义是让 npm 不再成为唯一的官方指定工具，这将使各种包管理器在一个更公平的地位上进行竞争，相信对前端包管理工具对使用者来说也是一件很好的事情。

参考链接：

-   [https://nodejs.org/dist/latest/docs/api/corepack.html](https://nodejs.org/dist/latest/docs/api/corepack.html)
-   [https://www.zhoulujun.cn/html/webfront/ECMAScript/nodejs/8308.html](https://www.zhoulujun.cn/html/webfront/ECMAScript/nodejs/8308.html)