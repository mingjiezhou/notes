### 前言

上个月啊，我写了篇 [叮咚抢菜运力监控](https://juejin.cn/post/7084886593089044493)的文章，后面把代码 push 到github 的时候，发现网络报错 443

```
fatal: unable to access 'https://github.com/mingjiezhou/live-host.git/':

LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443 
```

这一度让我很苦恼，即便开启了“科学上网” 也不行，一番调查后发现是因为国内的 github 域名 DNS 解析被污染了，DNS 污染的表现主要为，1- 域名解析错误，2- 封ip，不管是哪种情况都会导致 git clone pull push 等出现 443 或者 timeout。

最近五一放假终于有时间来好好研究这个课题了：

如果你也遇到这个问题，往下看就对了，下面讲讲我的解决方案。

### Host 文件修改（添加 github ip）

> hosts 是一个没有扩展名的系统文件，可以用记事本等工具打开，其作用就是将一些常用的网址域名与其对应的IP地址建立一个关联“数据库”，当用户在浏览器中输入一个需要登录的网址时，系统会首先自动从Hosts文件中寻找对应的IP地址，一旦找到，系统会立即打开对应网页，如果没有找到，则系统会再将网址提交DNS域名解析服务器进行IP地址的解析。 -- 来自百科

由 host 文件的定义知道，如果我配置了github 的本地 ip 映射关系，那么系统将优先使用本地的 DNS 映射关系，按照这个思路做下去，

先找到 git 命令行操作涉及到的几个相关域名

1.  github.com
2.  github.global.ssl.fastly.net
3.  assets-cdn.github.com
4.  ...

然后可以到下面几个 ip 查询的网站(任选一个就行)，查找其对应的 ip 地址

1.  [https://github.com.ipaddress.com](https://github.com.ipaddress.com/)
2.  [http://ip.tool.chinaz.com](http://ip.tool.chinaz.com/)
3.  [https://whatismyipaddress.com//hostname-ip](https://whatismyipaddress.com//hostname-ip)
4.  [http://ip-api.com](http://ip-api.com/)

最终我们将获取类似这样的数据

```
199.232.69.194                github.global.ssl.fastly.net
185.199.108.153               assets-cdn.github.com
140.82.112.3                  github.com
```

然后将此数据添加到系统 host 文件中；

以 mac 为例：在终端执行 `sudo vim /etc/hosts` 指令，输入管理员密码，进入 host 文件的编辑页, 将数据填充进去。如果没立即生效可能需要手动 `sudo killall -HUP mDNSResponder` 强制刷新。

[![截屏2022-05-09 16 53 02](https://user-images.githubusercontent.com/37775265/167404364-8a23fc54-9f63-43ef-af00-fd0cebcea0dc.png)](https://user-images.githubusercontent.com/37775265/167404364-8a23fc54-9f63-43ef-af00-fd0cebcea0dc.png)

如果顺利的话，这时候 git 操作应该就正常了！

### Vscode 插件：更优雅的方式

在过去的几年里，我曾经多次这样手动的修改 host 文件，但是频率并不高，因为我觉得比较麻烦，要输入指令，编辑起来也慢，特别这次 github 的 ip 又经常变化，如果还是手动修改 host，真是增加了不少心智负担，于是我就想，能否将其 封装成一个工具呢，几经思考觉得 vscode 插件是一个不错的idea，毕竟哪个前端程序员不用 vscode 呢？（狗头～～｜）

关于 vscode 插件的入口知识这里就不详解了，因为我也是新手，就暂且把觉得不错的几个文档和教程贴出来供大家参考

0.  [官方文档](https://code.visualstudio.com/api)
1.  [中文文档](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/)
2.  [vscode 插件市场](https://marketplace.visualstudio.com/manage)
3.  [Azure 网站](https://dev.azure.com/mingjiezhou)
4.  [一个系列教程](https://www.cnblogs.com/liuxianan/p/vscode-plugin-overview.html)
5.  [一个不错的中文翻译文档](https://www.bookstack.cn/read/VS-Code-Extension-Doc-ZH/README.md)

下面我说下几个需要注意的地方：

#### 源码阅读

除了看文档学习，很重要的是看其他人的插件源码，因为vscode 插件发布后源码是公开的，所以只要你安装后就自动下载到你电脑上了，以mac 为例，cd 到当前用户名下，`command + shift + .` , 将隐藏文件显示出来， 找到 `.vscode` , 插件就在里面的 extensions 文件夹里。

[![截屏2022-05-09 17 30 47](https://user-images.githubusercontent.com/37775265/167404493-85cc063a-5985-4df8-91de-73f94b8b8d33.png)](https://user-images.githubusercontent.com/37775265/167404493-85cc063a-5985-4df8-91de-73f94b8b8d33.png)

#### 调试方法

本地安装包后，F5 键将启用一个调试窗口，起到类似浏览器和控制台的作用

#### 本地安装

vsce 是一个用于将插件发布到市场上的命令行工具, 可以用它来将插件打包成 vsix 包，然后插件就可以本地安装了

```
npm install vsce -g

vsce package
```

[![截屏2022-05-09 17 59 08](https://user-images.githubusercontent.com/37775265/167404920-03002a3a-c0dd-433e-b5be-2496d06e1bb4.png)](https://user-images.githubusercontent.com/37775265/167404920-03002a3a-c0dd-433e-b5be-2496d06e1bb4.png)

#### 插件市场发布

很多文章中讲到使用 vsce publish 的命令行方式来发布，其实也可以通过web 端来操作，[vscode 插件市场](https://marketplace.visualstudio.com/manage) 中注册自己的账号就行了。

[![截屏2022-05-09 18 11 11](https://user-images.githubusercontent.com/37775265/167404872-fdcad83f-131e-4b10-ab26-a89489e968b2.png)](https://user-images.githubusercontent.com/37775265/167404872-fdcad83f-131e-4b10-ab26-a89489e968b2.png)

### Live Host 的功能介绍

_站在巨人的肩膀上_

1、支持快速增删改查 host 文件 ([参考开源 host 方案](https://github.com/gamedilong/ahost))

注：这个很 6，果真是当你有一个idea的时候，这个世界上就已经有人作出了成品，把这个插件吃透了就可以入门了。

2、每天获取最新的 github host 配置，不需要自己再去手动查找了 （[参考开源 Api](https://github.com/isevenluo/github-hosts)）

注：本来是打算自己去查 ip的，无意中发现了这个项目每天都会更新 host 配置，而且覆盖的 github 域名相当多，貌似是靠谱的所以就使用了他的 api, 一切从简了哈哈。

3、监听任意域名（Array）的有效 IP，自动更新 host；（开发中）

### 总结

在学习vscode 插件和实现 [Live Host](https://github.com/mingjiezhou/live-host) 工具的过程中，不仅解决了 github ip 访问的问题，也对 vscode 的插件机制有了些浅薄的了解，希望后续能做些更有意思的项目吧。

最后，感兴趣的朋友不妨去下载试一试哦，插件市场搜索 [Live Host](https://github.com/mingjiezhou/live-host) 就好了。

[![截屏2022-05-09 19 10 14](https://user-images.githubusercontent.com/37775265/167404760-e33afdcf-8ba6-4cdf-9741-4d3284974e86.png)](https://user-images.githubusercontent.com/37775265/167404760-e33afdcf-8ba6-4cdf-9741-4d3284974e86.png)

---

源码： [live-host](https://github.com/mingjiezhou/live-host)

合集：[我的博客合集](https://github.com/mingjiezhou/notes/issues)