### 前言

![](https://user-images.githubusercontent.com/37775265/154396111-ef07185f-8120-47cb-910b-68ddebd4660d.png)

去年下旬公司启动了一个 B To B 营销项目，因为各种原因，决定使用 [vue-antd-admin](https://iczer.gitee.io/vue-antd-admin-docs/) 这个开源的前端解决方案，在那之前我听说过 Ant Design Pro,应该是阿里内部团队出的，vue-antd-admin 是它的 vue 仿版，其实还有个 Ant Design Pro Vue ，也是 一个 开源的 vue 仿版，这种集成方案可以快速提升业务开发效率，但是也有一些缺点：

一是这种项目考虑的场景比较全面，对一个具体的公司项目来说，却显得设计比较冗余，在通读文档后，可以较快的速度完成业务功能开发，但是是在它的框架内；定制化的需求是千变万化的，这时候如果和它的设计理念不相符的话，就要做比较大的兼容二次开发。

二是性能优化会很麻烦，也是因为太多冗余设计，导致文件量比较大，这和精简的优化策略违背。

三是缺乏挑战性，项目技术升级不太方便。

基于以上特点，团队要合理评估决定是否适合当前项目，对于当时我们这个项目来说还是比较合适的，我们团队，产品、设计没有过多干扰，前端话语权还在，所以效率真的很快，而且它提供了一些很cool 的效果和模块，跟自己重新开发比，能节省大量的时间，比如 配置setting ,可以快速的修改项目布局方式、主题色、多语言、动画等，这些通常作为项目亮点的功能都被包含进去了。

这段时间以来，在使用vue-antd-admin 的过程中，有一些心得，虽然可能不是很大的坑，但是觉得还是值得记录和分享一下的。

### 登录系统

官方用 js-cookie 来注入登录返回的 token 到请求 header 中，后端据此验证；我们因为需要单点登录，使用统一的 cookie 注入，所以这个环节不需要。

单点登录（Single Sign On，SSO），即用户通过登录一个应用系统，就可以访问其他所有相互信任的应用系统，实现用户单点多系统登录。

一般多用于企业内网各个独立且互相信任的项目之间使用，有一个专门的登录系统用于各个业务系统的使用。

### 菜单： icon的 渲染

菜单提供了异步和同步两种加载方式，同步的就没什么说的，一般是 404 之类的页面；业务功能页面一般用异步加载，通过接口获取路由数据，结合本地 router.map.js 文件，来生成最终的路由 json, 这里注意：官方提到在 routes 的元数据属性 meta 中注入了三个属性 icon、invisible 和 page，它们将在生成菜单和页头时发挥作用; 我发现它这里的icon 是渲染到 [Ant Design Vue](https://www.antdv.com/components/icon-cn/) 组件库的icon 组件的type 属性, 源码位置 在 menu/menu.js

```
return !icon || icon == 'none' ? null : h(Icon, { props: { type: icon } })

```

组件库提供的几百个 icon 肯定无法满足所有需求，一般都是自己公司的设计师设计的，这里需要做一下改造，{ type: icon } 其实就是传递给 a-icon 组件 prop 的数据。

```
return !icon || icon == 'none' ? null : h(Icon, { props: { component: icon} })

```

这里我改用 component 属性，根据官方的定义：component 控制如何渲染图标，通常是一个渲染根标签为 的 Vue 组件，会使 type 属性失效。

我这里使用 component 将自定义的 svg icon 渲染到菜单中; 在业务开发中，处处有这种需要修改源设计的地方，每个作者的思维逻辑不一样，设计的架构也千差万别，像这种嵌套蛮多层级的，需要梳理他的设计理念，找到那行最终渲染的函数。

[![截屏2022-02-10 14 37 35](https://user-images.githubusercontent.com/37775265/154395943-ac59764d-74cc-4e2c-9ebe-51eb878ed25a.png)](https://user-images.githubusercontent.com/37775265/154395943-ac59764d-74cc-4e2c-9ebe-51eb878ed25a.png)

### 最小像素问题

记得在谷歌浏览器中，默认支持的最小像素为 12px, 有些场景UI 提供的文字是 10px，该如何实现呢

下面提供几种方案供思考：

1.  浏览器设置中是可以修改最小显示的像素的，设置 =》 外观 =》 自定义字体 =》 最小字号，但是这不具有广泛操作性，总不能让用户去操作吧。
2.  通过svg 图片的形式，svg 在缩放时候不会影响清晰度。
3.  字体缩放，这是最推荐的，兼容性也可以

```
.scale10px {
 font-size: 12px
 transform: scale(0.8);
    transform-origin: left;
}
```

### Drawer 、Select 组件的下拉选项错位问题

[![截屏2022-02-14 16 18 41](https://user-images.githubusercontent.com/37775265/154395988-1b61507a-7227-4cd3-a626-544284b02cd2.png)](https://user-images.githubusercontent.com/37775265/154395988-1b61507a-7227-4cd3-a626-544284b02cd2.png)

这两个组件的下拉选项和自身定位位置默认 会渲染到body 上，在默写情况下菜单滚动定位会出现异常，所以要修改其渲染的元素节点：

可以用 getContainer 和 getPopupContainer 属性来进行配置。

### 主题定制

vue Antd Admin 提供了丰富的主题定制功能，像主题颜色、主题模式、导航布局、动画等 都是不缺的，这些‘亮点’功能让项目看起来cool 了许多，我记得一个小插曲，本来我是准备在dev、sit 环境放开配置入口的，但是因为恩一个环境变量配置的 bug，导致第一次版本上线的时候被放开了，业务验收的时候才发现，当时我挺紧张都准备好紧急再发一版了，然而业务和产品们都觉得这个功能很不错，呃，竟然强烈要求保留。

不过后来和老大商量了，为了防止他们乱玩引起bug, 后来还是给分环境禁用了，打开 setting.config.js 文件，看到没，那个 hideSetting 属性，默认是 false ,只要线上环境改为 true 就好了。

```
//隐藏设置抽屉，true:隐藏，false:不隐藏
hideSetting: process.env.VUE_APP_ENV_NAME === 'prod' ? true : false                  

```

也许你注意到了，VUE_APP_ENV_NAME 这个我自定义的变量就代表当前的运行时环境，那么 这个变量是哪里定义的呢，别急，关于环境变量我想再稍微详细的讲一下，请往后看。

### 环境变量

在浏览器中 window 代表全局对象，而node 中的全局对象叫global, process 就挂载在 global 下，所以它可以作为全局使用，process 对象提供了有关当前 Node.js 进程的信息并对其进行控制，前端开发中最常用的就是 process.env，这个属性返回包含当前用户环境的对象,当需要区分多个环境时候也会在 env中自定义全局变量，比如需要区分不同环境的接口域名、埋点项目配置等。具体的配置方案：

#### vue-cli 脚手架

vue cli 脚手架提供了 ‘模式’ 这一概念，默认提供了 development、test、production，三个模式，这多数情况是不够用的，我们可以通过传递 --mode 选项参数为命令行覆写默认的模式。例如，如果你想要在构建命令中使用开发环境变量：

```
vue-cli-service build --mode development
```

当运行 vue-cli-service 命令时，所有的环境变量都从对应的环境文件中载入(需要手动新建),你可以在你的项目根目录中放置下列文件来指定环境变量

```
.env # 在所有的环境中被载入
.env.local # 在所有的环境中被载入，但会被 git 忽略
.env.[mode] # 只在指定的模式中被载入
.env.[mode].local # 只在指定的模式中被载入，但会被 git 忽略
```

示例：  
package.json:

```
"serve": "vue-cli-service serve --mode=sit",
新增 .env.sit 文件

内容为：
VUE_APP_CURRENT=sit
```

VUE_APP_CURRENT 就是我们定义的变量，请注意，只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 `webpack.DefinePlugin` 静态地嵌入到客户端侧的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。

#### 通用方案 cross-env

如果没有使用 vue-cli 或其他集成的脚手架，而是自己基于 webpack 搭建的项目，则是完全不同的写法，首先介绍下 cross-env, 这是为了统一多个平台中使用环境变量的语法差异而产生的 npm 工具，比如在window 平台，直接 NODE_ENV=production 是不生效的，而 macOs 可以 ；它可以抹除这种差异，给不同平台用户统一的操作体验。

> 我最初创建它是为了解决我在 angular-formly中使用 npm 脚本时遇到的问题。这使得 Windows 用户更容易为项目做出贡献。  
> 摘自：[https://www.npmjs.com/package/cross-env](https://www.npmjs.com/package/cross-env)

其使用也是很简单的，首先 安装到项目里，

```
npm install --save-dev cross-env 
```

在package.json 的 script 脚本中这样使用：

```
"build:sit": "cross-env CDN_ENV=sit vue-cli-service build"
```

通过上面指令，已将自定义的 CDN_ENV 变量配置到 process.env 对象里 了，但是在运行时环境还不能访问，为了在运行时环境中访问需要 CDN_ENV 变量，则还需要进一步配置：

```
1. 若是 vue-cli 则 在vue.config.js 文件下

chainWebpack: config => {
	config.plugin('define').tap(args => {
		args[0]['process.env'].CDN_ENV = JSON.stringify(process.env.CDN_ENV)
		return args
	})
}

其实vue-cli 就不建议用 cross-env 了，直接用官方封装的方案。

2. 若纯 webpack 项目则
plugins：[
	new webpack.DefinePlugin({
		NODE_ENV: JSON.stringify(process.env.CDN_ENV),
	})
]

```

通过以上方式，在任意 .vue 或者 .js 文件中 通过 process.env 就可访问到包含 CDN_ENV 在内的所有自定义变量对象了。

在这里，说一下 definePlugin 这个插件，它的作用是在编译时候将你代码中的自定义变量替换为其他值或表达式，上面的示例中也就是替换成了 process.env.CDN_ENV 的值，所以在访问前的编译阶段 CDN_ENV 变量已经被修改替换了。

### 总结

在用 vue-antd-admin 开发业务项目的这段时间，总体上体验是不错的，有很多省心的地方，像一些常用的组件如 search、table 、keep-alive 缓存多页签页面，主题配置等，节省了我们很多时间，并且学习了作者的架构思路。

不过如果想做一个小而美或者有充足的时间前提下，还是建议自己搭建架构，成就感和收获会更多。

谢谢观看，下篇准备写写前端埋点，主要是神策的方案实践，敬请期待。