### 前言

mine-clearance(扫雷)作为一个经典的 windows 小游戏，也是 leetcode 第 529 题，难度中等，今天我将手把手教你完成这个实践方案。

我用的技术栈：react、webpack5、pnpm、less，对 pnpm 不了解的可以参考我这两篇文章 [昨晚，我体会了没有 pnpm 的痛](https://juejin.cn/post/7062611988886585381 "https://juejin.cn/post/7062611988886585381")， [2022 前端包管理方案-pnpm 和 corepack](https://juejin.cn/post/7060448346107805732 "https://juejin.cn/post/7060448346107805732")

效果图： ![截屏2022-02-16 17 41 49](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce5e624281284badb371263edd652ebd~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

[在线访问](https://link.juejin.cn?target=https%3A%2F%2Fj0uim.csb.app "https://j0uim.csb.app")、[源码地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmingjiezhou%2Fnotes "https://github.com/mingjiezhou/notes")

### 搭建项目

如果你希望尽快开始的话，像这种 js 小游戏之类的项目是很适合用在线编辑器来写的，最初我是用的 [codesandbox](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2F "https://codesandbox.io/") 这个在线编辑器来写的，它比 codepen 之类侧重代码片段的工具来说更好用，甚至可以完成完整项目的在线开发，不过这次我将使用本地环境来搭建。

首先使用 [creat-react-app](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fcreate-a-new-react-app.html%23create-react-app "https://zh-hans.reactjs.org/docs/create-a-new-react-app.html#create-react-app") 创建新项目, 你注意到了么，我用了 pnpx 而不是大家熟知的 npx，其实这个是 pnpm 平台从源获取包的命令行工具, 和 npx 提供了相同的接口。(最新文档显示 pnpx 已弃用！官方建议改用 pnpm exec 和 [pnpm dlx](https://link.juejin.cn?target=https%3A%2F%2Fpnpm.io%2Fzh%2Fcli%2Fdlx "https://pnpm.io/zh/cli/dlx") 命令。)

```
pnpx creat-react-app mine-clearance

pnpm dlx creat-react-app mine-clearance
复制代码
```

执行完毕后，可以通过 npm run start 启动服务, 哎等等，不是说用 pnpm 的么，恩~这时候 pnpm 确实还不能工作，往下看就知道了。

现在我想使用 less，因为 creat-react-app 默认支持的是 sass/scss, 我需要先使用 eject 命令暴露 webpack 配置（不可逆）, 当然也可以用 react-app-rewired 搭配 customize-cra 来覆盖默认的 webpack 配置；这里我选择直接 eject。

```arduino
npm run eject
复制代码
```

![截屏2022-02-16 16 55 44](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f729f52a21c40248d46838bf3af73d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp) eject 后的项目目录发生了巨大变化，最核心的就是暴露了 config 文件夹，webpck 相关的配置都在里面。

这个时候，pnpm 就可以使用了，先在package.json 中添加 less 包文件信息，

```json
"devDependencies": {
    "less": "3.9.0",
    "less-loader": "4.1.0"
 }
复制代码
```

然后使用 pnpm install 指令重新安装包,它将先删除原 npm 类型的 node_modules 文件，然后按照 pnpm 的方式重新安装依赖。

下面讲讲 less 的配置，打开 config 下的 webpack.config.js 按照 sass 的格式进行配置, 修改style files regexes（样式文件正则），找到注释 style files regexes，在这最后添加如下两行代码：

![截屏2022-02-17 11 24 49](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8e781ac4d634bcdba4d88a3ce8e7cad~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

找到 getStyleLoaders 函数，添加 lessOptions 参数，在css-loader 下面添加 less-loader 配置

```css
{
    loader: require.resolve('less-loader'),
    options: lessOptions,
}
复制代码
```

![截屏2022-02-17 11 30 53](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82865a5b3c2f4492b6dc229e1147905c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

然后仿照 sass 添加如下配置

![截屏2022-02-17 11 21 20](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db2e9095a6354a94b376d06944f3a9b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

执行完成后，我们的环境配置就全部结束了，接下来就开始介绍 扫雷游戏的核心代码实现。

### 核心代码实现

#### Cell 方块（细胞）类型 Map

这个Map 用来保存所有的方块状态数据，以及映射关系，0 代表此方块为空，就是没有地雷，1-8 代表此方块周围相邻元素中有多少个地雷，10 代表此方块为地雷，这里找了张图片来显示。

```css
  const STATUSMAP = new Map([    [0, '空'],
    [1, '1'],
    [2, '2'],
    [3, '3'],
    [4, '4'],
    [5, '5'],
    [6, '6'],
    [7, '7'],
    [8, '8'],
    [10, require('./assets/mine.jpeg')],
  ])
复制代码
```

#### Board 雷区组件

此组件根据输入的参数动态生成游戏面板（雷区） table，包含列和方块组件,Square 代表每个可操作的单元格，给其配置了位置坐标、状态、操纵函数等属性。

```ini
  const Board = props => {
    // 细胞(最小单位)
    const Square = props => {
      return (
        <td
          onClick={() => {
            props.updateSquareValue(props)
          }}
          className={`td-${props.colCoord}-${props.rowCoord} square`}
        >
          {props.show ? props.value : ''}
        </td>
      )
    }
    // 列
    const trList = square.map((item, index) => {
      return (
        <tr key={index}>
          {item.map((subItem, tdIndex) => {
            return (
              <Square
                updateSquareValue={updateSquareValue}
                colCoord={index}
                rowCoord={tdIndex}
                value={square[index][tdIndex].value}
                key={`${index}-${tdIndex}`}
                show={false}
                hasClearance={false}
              />
            )
          })}
        </tr>
      )
    })

    return (
      <table className="board-container" cellSpacing="0">
        <thead></thead>
        <tbody>{trList}</tbody>
      </table>
    )
  }
复制代码
```

#### 随机生成地雷数据，并初始化

creatBoardParams 函数根据输入的地雷数量，为每一个地雷随机分配坐标，返回包含所有坐标数据的数组。

initSquareValue 根据输入的宽和高，给每一个方块设置默认值0，然后第三个参数 mineArray 就是 creatBoardParams 函数所生成的随机地雷坐标，将相关方块值更新。

```css
const creatBoardParams = () => {
const mineArray = []
    for (let i = 0; i < mineNum; i++) {
      mineArray.push({
        col: Number(Number(Math.random() * (width - 1 || 0)).toFixed(0)),
        row: Number(Number(Math.random() * (height - 1 || 0)).toFixed(0)),
      })
    }
    setMineCoord(mineArray)
    setTimeout(() => {
      setSquare(initSquareValue(width, height, mineArray))
    })
  }
  
  const initSquareValue = (width, height, mineArray) => {
    let square = []
    for (let i = 0; i < height; i++) {
      let a = []
      for (let j = 0; j < width; j++) {
        a.push({ value: 0 })
      }
      square.push(a)
    }
    mineArray.forEach(i => {
      square[i['col']][i['row']].value = 10
    })
    return square
  }
复制代码
```

#### 获取并计算邻居方块的地雷数量(递归)

因为要判断每一个方块的8个邻居状态，这里用递归来处理，为防止递归函数无休止的进行，必须在函数内有终止条件，这就要求你必须要考虑好边界条件，不然将引起内存溢出直到程序崩溃。

定义 num 变量用来保存其周围邻居地雷数量，递归每个邻居，如果邻居为空，则以邻居为原点继续递归

根据每一个 Square 的最终 value 来判断其状态，并更新其显示状态。

```ini
 const updateSquareValue = props => {
    let dom = document.querySelector(`.td-${props.colCoord}-${props.rowCoord}`)
    const v = dom.innerText
    if (v !== '') {
      return
    }
    if (props.value === 10) {
      dom.style.background = `#fff url(${STATUSMAP.get(10)})`
      dom.style.backgroundSize = 'cover'
      setTimeout(() => {
        // if (window.confirm('游戏结束，是否初始化服务？')) {
        //   init()
        // }
      }, 100)
      return
    }
    let neighbor = []
    let num = 0
    for (let i = props.colCoord - 1; i <= props.colCoord + 1; i++) {
      for (let j = props.rowCoord - 1; j <= props.rowCoord + 1; j++) {
        if (
          i < 0 ||
          j < 0 ||
          (i === props.colCoord && j === props.rowCoord) ||
          i >= height ||
          j >= width
        ) {
          continue
        }
        neighbor.push({ colCoord: i, rowCoord: j })
        if (
          mineCoord.filter(item => {
            return item.col === i && item.row === j
          }).length > 0
        ) {
          num++
        }
      }
    }
    // if (STATUSMAP.get(num) === '空') {
    console.log(num)
    if (num === 0) {
      neighbor.forEach(s => {
        window.requestAnimationFrame(() => {
          updateSquareValue(s)
        })
      })
    }
    dom.innerText = STATUSMAP.get(num)
  }
复制代码
```

#### 生成游戏面板、重置、游戏结束

通过定义的 creatBoardParams() 、init() 函数来创建、重置游戏，当点击到包含地雷的方块时，停止递归函数，并confirm 提示游戏结束

```scss
  const init = () => {
    setWidth(16) // 默认面板宽度16
    setHeight(16) // 默认面板高度16
    setMineCoord([]) // 默认地雷坐标数据[]
    setMineNum(50) // 默认地雷数量 50
    setSquare([]) // 默认方块数据
  }
  
    const initSquareValue = (width, height, mineArray) => {
    let square = []
    for (let i = 0; i < height; i++) {
      let a = []
      for (let j = 0; j < width; j++) {
        a.push({ value: 0 })
      }
      square.push(a)
    }
    mineArray.forEach(i => {
      square[i['col']][i['row']].value = 10
    })
    return square
  }
复制代码
```

### 总结

扫雷游戏的主要逻辑就完成了，基于react技术栈，实现这样一个程序， 只需要两百行左右 jsx 代码就可以了，而且还有**巨大**优化空间。

你学会了么？

---

合集：[我的 github 博客及案例源代码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmingjiezhou%2Fnotes%2Fissues "https://github.com/mingjiezhou/notes/issues")

  

作者：Ethan_Zhou  
链接：https://juejin.cn/post/7065578761692905509  
来源：稀土掘金  
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。