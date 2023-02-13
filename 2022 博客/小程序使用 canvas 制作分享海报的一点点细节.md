![小程序使用 canvas 制作活动分享海报的一点点细节](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e356a4b5abed4187b462630e5f0765d9~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?)

## 前言

活动海报制作，在 C 端是很常见的功能，前端程序员应该或多或少的接触过，h5 写的话方案成熟，可以用原生 canvas api 写，也可以使用成熟的插件如 [html-to-image](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dhtml-to-image "https://github.com/search?q=html-to-image")、[html2canvas](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fniklasvh%2Fhtml2canvas "https://github.com/niklasvh/html2canvas") 等； 不过在微信小程序中开发这个功能，第一次的话就会遇到挺多坑的，api 的兼容性、凌乱的文档都在暗示我们过程没那么简单；

如果你也在做相关的功能，这篇博客可能会有所帮助！

大致效果预览：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab6a0f1d67694876b81b15882113941a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 方案评估

### 基本功能

在当前活动中点击按钮可生成一张活动海报，可保存到相册或者直接微信转发，海报中的小程序码和分享人有映射关系，可以记录谁分享的。

### 两类方案

这种需求在营销活动中其实很常见，常见的方案有两类：

一是`后端生成`、前端展示，好处是兼容性良好，不需要关注设备和平台之间的差异性；不过稍微复杂点的UI, 后端的工作量剧增，画起来太费劲。

二是`前端生成`，后端只提供关键数据，由前端通过 canvas 等技术来制作图片，具体又分纯 canvas 绘制和插件编译 Dom 等方案如（html2canvas）。

具体采用哪种方案也要看具体的情况了，网上也有不少讨论，针对小程序环境，html2canvas 是不支持的，所以如果要使用插件，还需要额外的工作，比如将代码运行在 webview 中，最后我还是决定使用 小程序提供的 canvas api 来绘制海报。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e0b988694234b89af2a310c26563f83~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 思维导图

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32a665b1f46e4e3b9d5d363c9ea0ca1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 值得分享的技术点解析

### 初始化 canvas 环境

我们使用最新type="2d"模式，性能和写法上更接近原生

[对应文档](https://link.juejin.cn/?target=https%3A%2F%2Fdevelopers.weixin.qq.com%2Fminiprogram%2Fdev%2Fframework%2Fability%2Fcanvas.html "https://developers.weixin.qq.com/miniprogram/dev/framework/ability/canvas.html")

```bash
<canvas type="2d" id="canvas2d" class="canvasTag"></canvas>
复制代码
```

**注意**：官方文档例子是写在小程序页面里的，模式为 page, 如果是写在小程序组件里 Component, 需要使用 `in(this)` 来固定 this 对象, 否则 res 获取不到。

```csharp
示例：
const query = wx.createSelectorQuery().in(this)
query.select('#canvas2d')
    .fields({ node: true, size: true })
    .exec(async res => {
const canvas = res[ 0 ].node
复制代码
```

### canvas 尺寸和生成图片的关系

因为canvas 是以像素来绘制的，不像 svg 那样可以无损，所以为了在高分屏设备上保持清晰度，需要根据当前设备的 dpr 来对canvas 尺寸进行放大，保持比例，这样可以消除图片的锯齿感。

```ini
示例：
const canvas = res[ 0 ].node
canvas.width = windowWidth * dpr
canvas.height = windowHeight * dpr
const ctx = canvas.getContext('2d')
ctx.scale(dpr, dpr)
复制代码
```

### 文字的换行计算

canvas 绘制不像 DOM 可以自适应位置，所以需要根据文字数量动态计算行数和占用到高度

```ini
formatText (context, text = '' , x, y, maxWidth, lineHeight) {
  let arrText = text.split('')
  let line = ''
  let row = 1

  for (let n = 0; n < arrText.length; n++) {
    let testLine = line + arrText[n]
    let metrics = context.measureText(testLine)
    let testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      // 超出 2 行缩略，显示 ...
      if (row === 2) {
        for (let n = 0; n < line.length; n++) {
          // eslint-disable-next-line no-undef, no-new-wrappers
          let $testLine = new String(line).substring(0, line.length - 1 - n) + '...'
          let $metrics = context.measureText($testLine)
          let $testWidth = $metrics.width
          if ($testWidth <= maxWidth) {
            context.fillText($testLine, x, y)
            return
          }
        }
      } else {
        context.fillText(line, x, y)
      }
      line = arrText[n]
      y += lineHeight
      row++
    } else {
      line = testLine
    }
  }
  
  context.fillText(line, x, y)
}
复制代码
```

### 获取指定文本的高度

```ini
// 获取文本高度
getFormatTextHeight (context, text = '', maxWidth, lineHeight) {

  let arrText = text.split('')
  let line = ''
  let row = 1
  for (let n = 0; n < arrText.length; n++) {
    if (row === 2) {
      break
    }
    let testLine = line + arrText[n]
    let metrics = context.measureText(testLine)
    let testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      line = arrText[n]
      row++
    } else {
      line = testLine
    }
  }
  return row * lineHeight
}
复制代码
```

### Base64 图片的展示

Base64 类型的图片不能直接渲染到画布上，需要先缓存下来转为本地路径, 主要用到小程序提供的 wx.getFileSystemManager（） 和 writeFile 两个 api。

```javascript
// base64 转本地文件
setBase64Save (base64File) {
  const fsm = wx.getFileSystemManager()
  // eslint-disable-next-line no-useless-escape
  let extName = base64File.match(/data:\S+/(\S+);/)
  if (extName) {
    extName = extName[1]
  }

  let fileName = Date.now() + '.' + extName
  return new Promise((resolve, reject) => {
    let filePath = wx.env.USER_DATA_PATH + '/' + fileName
    fsm.writeFile({
      filePath,
      data: base64File.replace(/^data:\S+/\S+;base64,/, ''),
      encoding: 'base64',
      success: res => {
        resolve(filePath)
      },
      fail () {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('写入失败')
      }
    })
  })
}
复制代码
```

### 网络图片的绘制

社区说网络图片不能直接绘制，需要转化为本地路径 path（但是当这样操作后，发现真机调试时候并没有成功，反而使用直接绘制（drawImage）的方式成功了。）

```ini
wx.getImageInfo({
  src: headerImg,
  success (res) {
    headerImgObj.src = res.path || ''
    headerImgObj.onload = resolve
    headerImgObj.onerror = reject
  }
})
复制代码
```

### 版本兼容

实测发现，开发者工具中的内核版本和真机并不完全一致，所以建议要在真机上调试下，否则可能在上线后出现不同的兼容性问题；比如 wx.drawImage 这个 api 实测在基础库版本 2.25.0 之上才能正常使用，可以在微信管理后台中配置最低使用版本 2.25.2，可自动给低版本用户提示更新微信以使用当前小程序。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/298874c30b1e4e4380b6e680eb8fd1bb~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0e84e14d480487e9f6230e2a82f4ce1~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

### 设计稿的建议

建议以标准尺寸设计稿如 750px 来绘制画布，然后通过缩放来展示。

## 总结

小程序的 canvas 标签和原生的有较大差异，需要结合文档和社区反馈，多做调试，api 经常变动也需要关注，如果某个接口废弃了，要注意在下个迭代发布时做好处理，因为只要发布，之前的接口就失效了;

以上就是我在做小程序海报时候觉得有价值、值得分享的点，希望对大家有帮助。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3d166e08b7e47ac85fd289cc8429d0d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

文章合集： [Github 合集](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmingjiezhou%2Fnotes%2Fissues "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmingjiezhou%2Fnotes%2Fissues") [掘金首发合集](https://juejin.cn/user/1151943916391965/posts "https://juejin.cn/user/1151943916391965/posts")

_**本文正在参加[「金石计划 . 瓜分6万现金大奖」](https://juejin.cn/post/7162096952883019783 "https://juejin.cn/post/7162096952883019783")**_