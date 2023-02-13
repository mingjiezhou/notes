## 前言
canvas 真是一个好东西，它给前端插上了想象的翅膀，伴随着 h5 而来，将 web 代入了新的领域，基于canvas 技术实现的各种酷炫效果和2d、3d 游戏，也让浏览器能承载更加强大的功能。尤其是它性能还很好，搞游戏再合适不过了，我就喜欢用 canvas 写一些小游戏玩。
![ScreenFlow.gif](https://cdn.nlark.com/yuque/0/2022/gif/28919253/1658812445225-a0c82105-a272-4d1c-8320-a9060a80b370.gif#averageHue=%23dddddd&clientId=ucd6891c6-c204-4&from=paste&height=600&id=u43a802ae&name=ScreenFlow.gif&originHeight=1080&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=356374&status=done&style=none&taskId=u0ee8cad1-4d1c-450c-8072-71d74ddd494&title=&width=1066.6666949236842)

最近无意中看到前段时间写的这个小效果，觉得挺有意思的，就分享出来；这是苹果ios 12 发布会上库克 ppt 里展示的内容，一个带荧光效果的环形进度条；一个做外包项目的朋友，遇到客户指定要这个效果，实在搞不定了找到我，于是才有了下面的复刻实现。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1658809666937-f8cc35ec-bd09-440f-b480-2b067f5316a8.png#averageHue=%23c3c3c3&clientId=ucd6891c6-c204-4&from=paste&height=629&id=ud67960ef&name=image.png&originHeight=1133&originWidth=1238&originalType=binary&ratio=1&rotation=0&showTitle=false&size=266166&status=done&style=none&taskId=u339e2e56-9137-4e0e-a54d-580fe00fb18&title=&width=687.7777959976672)

## 基础 Dom 结构
第一步先把标签元素写上，后面将据此生成画布上下文对象，canvas 标签内的内容将在浏览器不支持的情况下显示，否则会自动忽略。
```json
<div class="container">
  <canvas id="canvas" width="600" height="600">
    <p>抱歉，您的浏览器不支持canvas</p>
  </canvas>
</div>
```

## 基本变量

```javascript
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d") // 上下文对象
let circleX = canvas.width / 2 // 中心x坐标
let circleY = canvas.height / 2 // 中心y坐标
let radius = 100 // 圆环半径
let percent = 90 // 最终百分比
let lineWidth = 1 // 圆形线条的宽度
let fontSize = 42 // 字体大小

```
## 画圆
首先画一个圆出来，主要定义画笔颜色、位置、样式、阴影、模糊值等, 这个是作为背景图使用的。
```javascript
// 画圆
function circle(cx, cy, r) {
  ctx.beginPath()
  // ctx.moveTo(cx, cy-r-10)
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = "#666"
  ctx.lineCap = "round"
  ctx.shadowColor = "#000" //设置阴影颜色
  ctx.shadowBlur = 0 //设置模糊值
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.arc(cx, cy, r + 10, 0, (Math.PI / 180) * 360)
  ctx.moveTo(cx + r, cy)
  // ctx.moveTo(cx, cy-r)
  ctx.arc(cx, cy, r, 0, (Math.PI / 180) * 360)
  ctx.stroke()
}
```
## 画弧线
背景层之上，就需要弧线来表示主效果了
```javascript
// 画弧线
function sector(cx, cy, r, startAngle, endAngle, anti) {
  ctx.beginPath()
  ctx.moveTo(cx, cy - r - 5) // 从圆形底部开始画
  ctx.lineWidth = 12
  ctx.strokeStyle = "#ffccff"
  // ctx.fillStyle = '#ffccff'
  // 圆弧两端的样式
  ctx.lineCap = "round"
  ctx.shadowColor = "#ff6699" //设置阴影颜色
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 4 //设置模糊值

  // 圆弧
  ctx.arc(
    cx,
    cy,
    r + 5,
    startAngle * (Math.PI / 180.0) - Math.PI / 2,
    endAngle * (Math.PI / 180.0) - Math.PI / 2,
    anti
  );
  ctx.moveTo(cx, cy - r) // 从圆形底部开始画
  ctx.moveTo(cx, cy - r) // 从圆形底部开始画
  ctx.stroke()
}
```
## 让画面动起来

通过定时执行刷新动作，来实现进度条的数据更新和画布重绘，可以使用 while 循环配合 async await  setTimeout 异步来实现帧率控制 
```javascript
// 刷新
function loading(n) {
  // 清除canvas内容
  ctx.clearRect(0, 0, circleX * 2, circleY * 2)

  // 中间的字
  ctx.font = fontSize + "px April"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = "#ffccff"
  ctx.fillText(parseFloat(n).toFixed(0) + "%", circleX, circleY)

  // 圆形
  circle(circleX, circleY, radius)

  // 圆弧
  sector(circleX, circleY, radius, 0, (n / 100) * 360)
  sector2(circleX, circleY, radius, 0, (n / 100) * 360)
  // 遮盖
  cover(circleX, circleY, radius)
}

// 更新进度
function changeProcess(val, times) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      loading(val)
      resolve()
    }, times)
  })
}

// 循环
async function loop(val) {
  while (true) {
    for (let i = 0; i < val; i++) {
      await changeProcess(i + 1, 1000);
    }
    return
  }
}

loop(percent)


```
## 总结
通过 canvas 提供的 arc api 结合样式配置，100 行左右的代码实现了苹果发布会上的这个效果，是不是很有意思呐。

---
合集：[Github 博客合集]([https://github.com/mingjiezhou/notes/issues)](https://github.com/mingjiezhou/notes/issues))
