
![](assets/截屏2023-02-21%2013.55.19.png)

## 前言

上篇我们熟悉了 `ESLint` 的使用，其中提到我们用 `eslint-config-prettier` 禁用了 `ESLint` 与 `Prettier` 冲突的那部分校验规则，然后用 `Prettier` 作为项目的代码格式化工具。

本篇我们继续深入的讲讲 `Prettier` 。

## 正文

第一次知道 Prettier 好像是几年前同事 Leon 推荐的，那时候我刚进公司，然后给配的 2015 Imac 27, 算是我第一次使用 macOS 系统, 上班第一天都在手忙脚乱的折腾系统了，问这问那的，就是那时候知道的 Prettier, 当时还不确切的清楚这个工具和 ESLint 有啥区别，反正就是知道做格式化的，项目里配置过了那就用了。

那我现在再来思考这几个问题：

### Prettier 和 ESLint 有啥区别呢？


从官网的介绍我们知道，Prettier 官方是把它作为代码格式化工具，也就是美化工具来使用的，它不提供语法方面的校验，也就是不能发现 bug。

而 ESLint 是侧重于语法 bug 检测和修复，兼顾部分格式化功能, 但是这块比较弱，或者说没有要求的那么严格，这样会导致不同风格的两个代码片段都能通过 ESLint 检测，无法满足我们所要求的代码风格统一的需求。

举个例子，如下代码片段都能通过 ESLint 的检测。

```js
const {age, name, class, grade, sex} = obj;

const {age,
name,
    class,
    grade,
	    sex
} = obj; 

```

从这一点上看 Prettier 确实有它的优势所在，就是对代码风格的 ”强烈控制“， 中文官网叫 “有态度”，原文 opinionated，它默认提供了自己的一套代码风格配置规则，并且强烈不建议去修改它，这也是 Prettier 的特点所在吧, 下图是 reactjs 团队成员在 Prettier github [issue](https://github.com/prettier/prettier/issues/40) 上的倡导, 官方的态度也是如此，尽量不要去自定义自己的配置选项，就用官方提供的就行了

> 每个人都想添加一小部分配置来满足他们的用例。结果，我们最终得到了设计不一致的工具，无法正常工作的意外组合，错误和回归，当在一种配置中修复时，会破坏另一种配置的其他东西。
> 
> 希望增加自定义配置选项的呼声更容易被人看到，但是保持简单的要求的大多数人通常是沉默的。
> 

> 我只想花点时间说，我们中的一些人实际上很欣赏范围有限的工具，这些工具不会试图解决每个人的用例，而是做好特定的事情
> 
> 我甚至不太关心这里的“最常见的代码风格”，只要它是一致的并且尽可能没有错误。这些风格差异并不重要，人们太在意它们了。
![](assets/截屏2023-02-21%2017.02.33.png)


Prettier 还有些其他的优势，它支持多语言，有自己的插件可以和编辑器深度融合，包括和 ESLint 结合使用，**让擅长的做自己擅长的事**。

所以如果你的团队对代码风格有严格的要求，Prettier 确实是很适合，它在这块可以说事无巨细的定义了相关规则，同时也暴露出了一些可配置的选项 **（虽然官方对此颇有微词，甚至暗示是被迫的）**。

提供个在线体验地址，[官方体验地址](https://www.prettier.cn/playground), 可以看到它也是先把代码识别为 AST 语法树，然后再做转换的，可以学习下。

![](assets/截屏2023-02-21%2017.41.12.png)


### Prettier 的使用

项目中使用，需要先装这几个包，然后再项目根目录中修改或者添加 eslintrc.js 文件, 新增如下配置

```
"prettier": "^2.6.2",
"eslint-config-prettier": "^8.5.0",
"eslint-plugin-prettier": "^4.0.0",
```

```js
// eslintrc.js

// 简化写法，和下面等价, 推荐！！！
module.exports = {
	{
	  "extends": ["plugin:prettier/recommended"]
	}
}

// 完整写法
module.exports = {
	{
	  "extends": ["prettier"], // prettier 等价于 eslint-config-prettier
	  "plugins": ["prettier"], // prettier 等价于 eslint-plugins-prettier
	  "rules": {
	    "prettier/prettier": "error",
	    "arrow-body-style": "off",
	    "prefer-arrow-callback": "off"
	  }
	}
}
```

然后在项目根目录添加 `.prettierrc` 文件，这里定义你想要的配置规则, 示例如下：

```json
module.exports = {
  "arrowParens": "avoid",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "proseWrap": "preserve",
  "bracketSpacing": true,
  "endOfLine": "auto",
  "htmlWhitespaceSensitivity": "ignore",
  "jsxSingleQuote": false,
  "trailingComma": "es5"
}
```

### VSCode 的集成

你需要下载 `Prettier - Code formatter` vscode 插件，然后在 vscode setting.json 本地文件中修改配置

```json
    "[vue]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "explorer.confirmDragAndDrop": false,
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
		"[javascriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
```


```json

    /* prettier的配置 */
    "prettier.printWidth": 100, // 超过最大值换行
    "prettier.tabWidth": 2, // 缩进字节数
    "prettier.useTabs": false, // 缩进不使用tab，使用空格
    "prettier.semi": false, // 句尾添加分号
    "prettier.singleQuote": true, // 使用单引号代替双引号
    "prettier.proseWrap": "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
    "prettier.arrowParens": "avoid", //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
    "prettier.bracketSpacing": true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
    "prettier.disableLanguages": ["vue"], // 不格式化vue文件，vue文件的格式化单独设置
    "prettier.endOfLine": "auto", // 结尾是 \n \r \n\r auto
    "prettier.eslintIntegration": false, //不让prettier使用eslint的代码格式进行校验
    "prettier.htmlWhitespaceSensitivity": "ignore",
    "prettier.ignorePath": ".prettierignore", // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
    "prettier.jsxBracketSameLine": false, // 在jsx中把'>' 是否单独放一行
    "prettier.jsxSingleQuote": false, // 在jsx中使用单引号代替双引号
    "prettier.parser": "babylon", // 格式化的解析器，默认是babylon
    "prettier.requireConfig": false, // 需要 Prettier的配置文件
    "prettier.stylelintIntegration": false, //不让prettier使用stylelint的代码格式进行校验
    "prettier.trailingComma": "es5", // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
    "prettier.tslintIntegration": false,
```


这时候你可能会有疑问，刚才在项目 `.prettierrc` 里面不是配置过了么，怎么又重复配置校验规则，其实这和 Prettier 插件的运行机制有关，它们都会被加载到，只是优先级不同而已，项目里的同属性配置信息，会覆盖 `setting.json` 文件里的配置。

配置好了后，我们在代码编写过程中可以 `ctrl/command + shift + F`  来进行格式化操作。


![](assets/截屏2023-02-21%2017.37.15.png)

## 总结

好了，所有的配置都完成了，你可以使用命令行的形式来对代码进行 `lint` 操作，一部分规则会 auto 修复，剩下的会在控制台提示出来，比如 const、=== 啥的，自己看着改一下就行了。

不建议开启代码 保存时候的自动 Prettier 格式化，因为多项目切换时候，可能有的项目配置没有统一，最好少动。

也不建议 commit 时候对代码进行 `pre-commit` 之类的钩子处理，项目大的时候比较慢，而且不利于养成好的编码习惯。

如果一定要，可以使用 `husky` 工具来对 `git hook` 进行监控，实现 pre-commit 拦截操作；

两外 `lint-staged` 工具可解决全量 eslint 扫描导致机器卡顿的弊端，它可以只针对当前 stage 区文件进行扫描，可大大提升效率，也不失为一个好的方案。 