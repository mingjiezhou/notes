
“我正在参加「创意开发 投稿大赛」详情请看：[掘金创意开发大赛来了！](https://juejin.cn/post/7120441631530549284 "https://juejin.cn/post/7120441631530549284")”

## 前言

贪吃蛇作为一个经典的小游戏，是很多人儿时的记忆，当时的掌机、诺基亚手机里面都有它的身影，随着时间流逝，当年的我们已经变成大人模样，玩着王者，吃鸡等大型游戏；贪吃蛇这种小游戏已经吊不起我们的兴趣了，不过如果你是一名程序员，那还是建议实现一下，毕竟作为 leetcode 353 算法题你总不想在面试的时候遇到它却不会吧。

本文让我们来复刻一下这款经典的小游戏吧

[在线地址](https://l8idb0.csb.app/)

[![image.png](https://camo.githubusercontent.com/c45af49472e7f4d0c577d29e287c5a6419aa5bf77bbe884c5820d69a13815558/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f32626632376236656231643734303364383138386630366634373464666334637e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)](https://camo.githubusercontent.com/c45af49472e7f4d0c577d29e287c5a6419aa5bf77bbe884c5820d69a13815558/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f32626632376236656231643734303364383138386630366634373464666334637e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)

## 规则

玩法：玩家使用方向键操控一条长长的蛇不断吞下豆子，同时蛇身随着吞下的豆子不断变长，当蛇头撞到蛇身或障壁时游戏结束。

## 思路

`元素`：边界、蛇头、蛇身、食物

`边界`：输入 行数 x, 列数 y 生成边界地图，用二维坐标标识每个点的位置；

`蛇头、蛇身`：蛇头和蛇身分离，当吃到食物后，蛇身尾部加一

`食物`：位置随机生成；

## 流程图

[![image.png](https://camo.githubusercontent.com/f53724aac66e9fbf08ce5162663c1f5a471e85c6f1e99d2368c0e1334fb8087d/68747470733a2f2f70362d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f32363536616466653537633234333234613963633765386661383333666564357e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)](https://camo.githubusercontent.com/f53724aac66e9fbf08ce5162663c1f5a471e85c6f1e99d2368c0e1334fb8087d/68747470733a2f2f70362d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f32363536616466653537633234333234613963633765386661383333666564357e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)

## 代码实现

### 技术栈

选择 `vue3、vite` 基础架构；  
视图选用 `canvas` 技术来实现，相比 dom 来说性能更好；

### 基本变量定义

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  let width = ref(600) // 地图默认宽度
  let height = ref(400) // 地图默认高度
  let canvas: any = null // canvas 对象
  let ctx: any = null // canvas 渲染上下文对象
  let snakeList = [[0, 100], [10, 100],] // 蛇的点位坐标
  let direction = 'right' // top | down | left | right // 当前方向
  let elementWidth = 10 // 元素尺寸
  let step = 10 // 速度
  let store = ref(0) // 分数
  let status = ref('start') // unStart | start | pause ｜ over | success(通关) // 状态
  let foodCoordinate: any = [
    ((Math.random() * width.value) / 10) | 0,
    ((Math.random() * height.value) / 10) | 0,
  ] // 食物坐标
  let process: any = null // 定时器 Id
</script>

### 初始化

在 onMounted 里执行，主要做 地图绘制、鼠标坐标检测、方向监测、食物绘制、定时器启用等操作。

function handleInit() {
  canvas = document.getElementById('canvas')

  if (canvas?.getContext) {
    ctx = canvas?.getContext('2d')

    canvas.addEventListener('mousemove', e => {
      ctx.clearRect(10, height.value - 20, 120, 40)
      ctx.fillText(`当前鼠标位置：${e.offsetX}, ${e.offsetY}`, 10, height.value - 10)
    })

    document.addEventListener('keydown', e => {
      e.preventDefault()

      if (Direction[e.keyCode]) {
        direction = Direction[e.keyCode]
      }
    })

    process = setInterval(handleRenderSnake, 150)
    handleRenderFood()
    // window.requestAnimationFrame(handleRenderSnake)
  } else {
    alert('您的浏览器不支持 canvas')
  }
}

### 食物绘制

当食物被吃掉后，需要销毁和重新生成

// 绘制食物
function handleRenderFood() {
  ctx.clearRect(foodCoordinate[0], foodCoordinate[1], 10, 10)
  foodCoordinate = [(Math.random() * width.value) | 0, (Math.random() * height.value) | 0]
  ctx.fillStyle = '#eb2f96'
  ctx.fillRect(foodCoordinate[0], foodCoordinate[1], 10, 10)
}

### 蛇头/蛇身绘制

蛇是通过二维数组来表示的，每个节点代表身体的一部分，第一个节点代表蛇头，蛇的移动是通过 删除尾部节点，添加头部节点来实现，中间节点不用动，在四个方向上的处理略有不同。  
注意当吃到食物时，当前帧尾部节点不再删除，即可实现蛇身长度加 1。

function handleRenderSnake() {
  switch (direction) {
    case 'top':
      if (snakeList.slice(-1)[0][1] <= 0) {
        status.value = 'over'
        return
      }

      snakeList.push([
        snakeList[snakeList.length - 1][0],
        snakeList[snakeList.length - 1][1] - step,
      ])
      handleUpdateVerify()
      break
    case 'down':
      if (snakeList.slice(-1)[0][1] >= height.value - 1) {
        status.value = 'over'
        return
      }

      snakeList.push([
        snakeList[snakeList.length - 1][0],
        snakeList[snakeList.length - 1][1] + step,
      ])
      handleUpdateVerify()

      break
      ...

### 碰撞💥算法、边界条件

当蛇头触碰到地图边缘，将 game over, 只需根据蛇头当前坐标、当前方向，计算下一步的坐标是否会超出地图尺寸即可。

吃到食物的计算方法：分别对蛇头坐标和食物坐标的 x、y 轴进行绝对值计算，小于元素尺寸时认为已接触。

// 更新校验
function handleUpdateVerify() {
  if (status.value === 'pause') {
    clearInterval(process)
  }

  if (store.value >= 100) {
    status.value = 'success'
    return
  }

  for (let i of snakeList) {
    ctx.clearRect(i[0], i[1], elementWidth, elementWidth)
  }

  let currentSnake = snakeList.slice(-1)[0]
  if (
    Math.abs(currentSnake[0] - foodCoordinate[0]) < 10 &&
    Math.abs(currentSnake[1] - foodCoordinate[1]) < 10
  ) {
    store.value++
    handleRenderFood()
  } else {
    snakeList.shift()
  }
}

### 积分计算、暂停，继续等功能

全局变量 status 代表当前局势的状态，当 status === 'pause' 时，触发暂停操作，删除 定时器变量，点击重新开始按钮，生成新的定时器。

当吃到食物时，全局变量 store ++, 双向绑定到页面上显示，暂时设置积分超过 100 即可通关。

## 后记

通过接近 200行的代码，实现了这款贪吃蛇的核心玩法; 另外对于初次使用 vue3 和 vite 也会有一些小收获，比如

1.  vite 自带了 `less sass` 支持，不再需要 安装 `less-loader` 了，如果强行安装 loader 终端会报警告；
2.  通过 `ref` 定义的响应式变量在 Dom 中可以直接使用，在 js 中则需要通过 `.value` 属性访问和修改，啥时候能再简化些直接用就好了；
3.  canvas 画线条的时候触发了 bug 无意中明白了 画笔工具的原理；

---

合集：[Github 博客合集](https://github.com/mingjiezhou/notes/issues)