## 前言

JavaScript 是动态弱类型语言，没有预编译程序，比较容易出错，所以在项目编码阶段，我们经常用 Eslint 来做代码静态检查，它通过可配置的代码规范对项目代码进行校验，并在检测到异常时给出警告或错误信息。

本文主要目的有两点：

一、介绍几种常用的 eslint 配置方法；
二、解答如下几点疑问：

1.  `eslint` 和 `standard 、prettier` 三者的区别？
2.  eslint vscode 插件和 项目中配置 eslint.js 的区别？
3.  不同技术栈的 eslint 配置区别？
4.  为什么配置 eslint 需要装这么多包？（`babel-eslint、eslint-config-prettier、eslint-plugin-prettier、eslint-plugin-vue`，...）

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
  extends: ['plugin:vue/essential', 'standard'],
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

### vue-cli 项目配置 eslint 的流程

vue-cli 这种脚手架搭建的项目和纯 webpack 搭建流程的区别，主要是 vue-cli 提供了 `@vue/cli-plugin-eslint` 插件, 插件可以修改 webpack 的内部配置，也可以向 vue-cli-service 注入命令，不需要自己再一个个安装所有依赖的包，相当于把 eslint 的环境安装过程尽量简化了。

`vue add @vue/eslint` === `vue add @vue/cli-plugin-eslint`, 它相当于做了两件事，安装包和 invoke 运行，等价于 `npm install -D @vue/cli-plugin-eslint` + `vue invoke eslint` [详细解释](https://juejin.cn/post/6844903907580182541)

总体上，vue-cli 项目里面配置 eslint 使用  `@vue/cli-plugin-eslint` 会更简单。

### react 项目配置 eslint 的流程

1. npm install eslint
2. eslint --init

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

## eslintrc.js 相关概念理解

plugin: 支持的第三方插件，以 eslint-plugin-vue 为例，可以省略 eslint-plugin-, 可以这样配置 `plugins: ['vue']`, 就

>This plugin allows us to check the `<template>` and `<script>` of `.vue` files with ESLint, as well as Vue code in `.js` files.

glovals: 脚本在执行期间访问的额外的全局变量，配置后这个变量就不会报错了。

extends: 可以理解为一份 eslint rules 的拓展，它配置的内容实际上就是一份份别人配置好的 `.eslintrc.js`，你也认为，extends == plugin + rules

parseOptions 里的 parser: 解析器，不同语言和框架可能需要使用不同的解析器

## eslint vscode 插件和 项目中配置 eslint.js 的区别？

> The extension uses the ESLint library installed in the opened workspace folder. If the folder doesn't provide one the extension looks for a global install version. If you haven't installed ESLint either locally or globally do so by running `npm install eslint` in the workspace folder for a local install or `npm install -g eslint` for a global install.

如上官方所言，eslint 插件实际上并不能单独使用，它没有在本地配置一套开箱即用的 eslint.js 库，而是从当前项目里、全局环境查找，使用第一个匹配到的 eslint.js 库以及配置规则（`这点和 prettier 不同`）；

可以在 vscode 控制面板里验证：

![](assets/Pasted%20image%2020230216134416.png)

这样有个好处，就是可以完美匹配每个不同的项目 eslint 版本。


所以 eslint 插件最大的功能其实是：

1. 不符合 eslint 规则的代码加上一些**下划线**之类的语法提示；
2. 配置自动保存时候直接修复 fix；

## 几个相关包的介绍

### babel-eslint

### eslint-config-prettier

### eslint-plugin-prettier

### eslint-plugin-vue

## 资料来源

[eslint 官方文档](https://eslint.bootcss.com/docs/user-guide/getting-started)