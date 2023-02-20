## 前言

JavaScript 是动态弱类型语言，没有预编译程序，比较容易出错，所以在项目编码阶段，我们经常用 `ESLint` 来做代码静态检查，它通过可配置的代码规范对项目代码进行校验，并在检测到异常时给出警告或错误信息。

本文主要解决两个问题：

一、介绍几种常用的 `ESLint` 配置方法；
二、解答如下几点疑问：

1.  `ESLint` 和 `standard 、Prettier` 三者的区别？
2.  `ESLint vscode` 插件和 项目中配置 eslint.js 的区别？
3.  不同技术栈的 ESLint 配置区别？
4.  为什么配置 ESLint 需要装这么多包？它们分别的含义和用法是什么？（`babel-eslint、eslint-config-prettier...`)

## 主流技术栈配置流程

### webpack 项目配置 eslint 的全流程

1. package.jon 配置如下包 (版本相互匹配就行)

```javaScript
"eslint": "^7.32.0",
"eslint-config-standard": "^16.0.3",
"eslint-plugin-import": "^2.26.0",
"eslint-plugin-node": "^11.1.0",
"eslint-plugin-promise": "^5.2.0",
"eslint-plugin-vue": "^8.6.0", // 只针对 vue 项目需要安装
"eslint-webpack-plugin": "^3.1.1",
```

2. 根目录新增 eslintrc.js 文件

```javaScript
module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true
  },
  globals: {
	  NODE_ENV: true,
    App: true,
    Page: true,
  },
  extends: ['plugin:vue/essential', 'standard', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'no-async-promise-executor': 'off',
    'no-misleading-character-class': 'off',
    'no-useless-catch': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-new': 'off',
    'no-array-constructor': 'off',
    'no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/require-prop-type-constructor': 'off'
  }
}
```

3. webpack config 的 plugins 里面引入
``` js
const ESLintPlugin = require('eslint-webpack-plugin')

plugins: [
	new ESLintPlugin()
]
```
### vue-cli 项目配置 eslint 的流程

`vue-cli` 这种脚手架搭建的项目和纯 `webpack` 搭建流程的区别，主要是 vue-cli 提供了 `@vue/cli-plugin-eslint` 插件, 插件可以修改 webpack 的内部配置，也可以向 vue-cli-service 注入命令，不需要自己再一个个安装所有依赖的包，相当于把 `ESLint` 的环境安装过程尽量简化了。

`vue add @vue/eslint` === `vue add @vue/cli-plugin-eslint`, 它相当于做了两件事，安装包和 `invoke` 运行，等价于 `npm install -D @vue/cli-plugin-eslint` + `vue invoke eslint` [详细解释](https://juejin.cn/post/6844903907580182541)

总体上，vue-cli 项目里面配置 `ESLint` 使用  `@vue/cli-plugin-eslint` 会更简单。

### react 和 vue3 新项目配置 eslint 的流程

1. `npm install eslint`
2. `eslint --init`

经过一系列交互操作后，就会在根目录生成 `.eslintrc.js` 文件, 并且在 package.json 安装如下包

``` json
"babel-eslint": "7.2.4",  
"eslint": "4.10.1",  
"eslint-config-react-app": "^2.1.1",  
"eslint-loader": "1.9.0",  
"eslint-plugin-flowtype": "2.39.1",  
"eslint-plugin-import": "2.8.0",  
"eslint-plugin-jsx-a11y": "5.1.2",  
"eslint-plugin-react": "7.4.0",
```
![](assets/Pasted%20image%2020230220132828.png)

## 相关包介绍

### 01 babel-eslint

Eslint 支持不同的解析器（parser），而 `babel-eslint` 就是 babel 为 Eslint 开发的语法解析器，使 Eslint 可以支持 ES6 语法，当初 ESLint 之所以能反超 `JSLint` 和 `JSHint`，成为 JavaScript 最流心的 `Lint` 工具，babel-eslint 的助力还是蛮大的。

不过这个包快停止更新了，后面可以用 `@babel/eslint-parser` 替代。

>babel-eslint is now @babel/eslint-parser. This package will no longer receive updates

### 02 eslint-config-prettier

`ESLint` 主要做代码质量约束，但是它其实也具备一定的代码风格和格式化能力，这一点可能和 prettier 这个专门做格式化的工具有冲突，所以我们一般禁用掉 ESLint 的格式化规则，`eslint-config-prettier` 这个就是做这件事，它会默认关闭所有不必要的或可能与 `Prettier` 冲突的规则。

```js
{
  "extends": [
    "prettier" // prettier 等价于 eslint-config-prettier
  ]
}
```

### 03 eslint-plugin-prettier

关掉了 ESLint 的格式化规则，只能保证执行 ESLint  不会和 Prettier 冲突，但是并没有把两者结合起来，不符合 `Prettier` 标准的代码并不会报 ESLint 错误；

所以 eslint-plugin-prettier 插件就是解决这件事的，它会将 Prettier 作为 `ESLint` 的规则来使用，相当于代码不符合 Prettier 的标准时，会报一个 ESLint 错误，同时也可以通过 `eslint --fix` 来进行格式化。


```js
{
  "extends": ["prettier"], 
  "plugins": ["prettier"], // prettier 等价于 eslint-plugins-prettier
  "rules": {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}
```

```js
// 简化写法，和上面等价, 推荐！！！
{
  "extends": ["plugin:prettier/recommended"]
}

```

### 04 eslint-plugin-vue

`eslint-plugin-vue` 是 Vue.js 的官方 ESLint 插件，这个插件允许我们使用 ESLint 检查文件的 `<template>`，以及文件中的 Vue 代码。`<script>``.vue``.js`

这个插件提供了一些预定义的配置选项：

-  `"plugin:vue/base"` 基础用法。

用于 vue 3.x
-  `"plugin:vue/vue3-essential"` 加上防止错误或意外行为的规则。
-  `"plugin:vue/vue3-strongly-recommended"`  加上可显着提高代码可读性和/或开发体验的规则。 
-  `"plugin:vue/vue3-recommended"` 加上强制执行主观社区默认设置以确保一致性的规则。

使用 Vue 2.x 的配置
-   `"plugin:vue/essential"` 加上防止错误或意外行为的规则。
-   `"plugin:vue/strongly-recommended"` 加上可显着提高代码可读性和/或开发体验的规则。
-   `"plugin:vue/recommended"` 加上强制执行主观社区默认设置以确保一致性的规则。

建议用法

```js
module.exports = {
extends: ['plugin:vue/recommended'],
}
```

### 05 @vue/cli-plugin-eslint

这是针对 vue-cli 项目的插件，如上 vue-cli 项目配置 部分已经有所介绍。

## eslintrc.js 文件相关概念理解

### 01 plugin
支持的第三方插件，以 `eslint-plugin-vue` 为例，可以省略 eslint-plugin-, 可以这样配置 `plugins: ['vue']`, 就

>This plugin allows us to check the `<template>` and `<script>` of `.vue` files with ESLint, as well as Vue code in `.js` files.

### 02 glovals
脚本在执行期间访问的额外的全局变量，配置后这个变量就不会报错了。

### 03 extends

可以理解为一份 eslint rules 的拓展，它配置的内容实际上就是一份份别人配置好的 `.eslintrc.js`，你也认为，extends == plugin + rules

### 04 parseOptions 里的 parser

语法解析器，不同语言和框架可能需要使用不同的解析器。

## ESLint vscode 插件和 项目中配置 eslint.js 的区别？

> The extension uses the ESLint library installed in the opened workspace folder. If the folder doesn't provide one the extension looks for a global install version. If you haven't installed ESLint either locally or globally do so by running `npm install eslint` in the workspace folder for a local install or `npm install -g eslint` for a global install.

如上官方所言，eslint 插件实际上并不能单独使用，它没有在本地配置一套开箱即用的 eslint.js 库，而是从当前项目里、全局环境查找，使用第一个匹配到的 `ESLint.js` 库以及配置规则（`这点和 prettier 不同`）；

可以在 `vscode` 控制面板里验证：

![](assets/Pasted%20image%2020230216134416.png)

这样有个好处，就是可以完美匹配每个不同的项目 `ESLint` 版本。


所以 `ESLint` 插件最大的功能其实是：

1. 不符合 `ESLint` 规则的代码加上一些**下划线**之类的语法提示；
2. 配置自动保存时候直接修复 fix；

## 总结

本文介绍了几种主流的技术栈下 ESLint 的配置方式，然后对涉及到的 npm 包进行了讲解，有助于我们加深对 代码 Lint 机制的理解；

另外也对 vscode 插件和 npm 包之间的关系进行了分析，知道了`ESLint Vscode` 插件本身并没有下载 eslint.js 代码和默认配置文件，而是优先从项目中、系统中查询，没有找到的话就不会进行校验。

## 资料来源

1. [eslint 官方文档](https://eslint.bootcss.com/docs/user-guide/getting-started)
2. [eslint-plugin-vue 文档](https://eslint.vuejs.org/)
3. [npm](https://www.npmjs.com/)
4. [prettier 文档](https://prettier.io/docs/en/plugins.html)