## 前言
css 揭秘这本书以案例的形式，介绍了 47 个网页设计经典难题的解决方案，我在学习之余将其一一实现了下，特记录下来。

在线预览 [http://play.csssecrets.io](http://play.csssecrets.io/)
## 1-半透明边框
### 难题
当你用 rgba() 或者 hsla() ，写了一个半透明的颜色，给到容器边框时候，你会发现，没有半透明效果，这是因为默认情况下，背景色会填充到边框区域，导致边框的半透明效果失效，当把 border 样式设置为 dashed 时候，你会很直观的发现这一点。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661145760478-9c834266-7c97-40e3-a538-bf027bfaedac.png#averageHue=%23999d7b&clientId=u437a448f-b75f-4&from=paste&height=385&id=ubf9ade57&name=image.png&originHeight=770&originWidth=1544&originalType=binary&ratio=1&rotation=0&showTitle=false&size=327806&status=done&style=none&taskId=u1f269505-f9b0-47cf-83c5-4c7335f4df4&title=&width=772)

### 方案
使用 background-clip 属性调整上面的默认效果，这个属性的默认值为 border-box，此时背景会被元素的border 给遮盖，它还可以配置 padding-box || content-box,  此时浏览器将以内边距或内容区外沿来渲染。
修改后，border 的半透明效果就生效了。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661138401898-50f44ff1-e649-4a2c-9d25-a942875bec41.png#averageHue=%23c9c6c3&clientId=u437a448f-b75f-4&from=paste&height=752&id=u04198507&name=image.png&originHeight=1504&originWidth=2686&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3824163&status=done&style=none&taskId=u68ca3b68-2989-4bc9-a30e-024dcf608e0&title=&width=1343)
### 拓展
background-clip 还有个 text 属性，很有意思，当设置为text 后，背景会被裁剪成文字的`前景色`。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661146651206-9b577c13-e871-47f0-9cdd-6ded6e4a5526.png#averageHue=%23b2b19b&clientId=u437a448f-b75f-4&from=paste&height=443&id=uddf9dc51&name=image.png&originHeight=886&originWidth=1774&originalType=binary&ratio=1&rotation=0&showTitle=false&size=195258&status=done&style=none&taskId=u4c0cb548-24f5-49da-8f85-5397395be42&title=&width=887)
## 2-多重边框
### 难题
使用 border 来生成单一的边框很容易，但是若想生成多重边框就做不到了，通常需要使用各种 hack 例如使用多个元素来模拟实现。
### 方案1： box-shadow
一个正值的扩张半径加上两个为零的偏移量以及为零的模糊值，得到的“投影”其实就是一条实线；再结合 box-shadow  的逗号分隔语法，来创建任意数量的投影。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661147416460-8e02bbd1-1681-45f7-adc0-08894ddc04f0.png#averageHue=%23f0edec&clientId=u437a448f-b75f-4&from=paste&height=460&id=u596e7c50&name=image.png&originHeight=920&originWidth=1972&originalType=binary&ratio=1&rotation=0&showTitle=false&size=814020&status=done&style=none&taskId=uf4e3341d-4d26-4701-9527-5f5c04fdc47&title=&width=986)
注意：

1. 投影行为跟边框不完全一致
2. 生成的边框默认出现在元素外圈，可以加上 inset 关键字来使投影绘制在元素的内圈，注意预留足够的内边距来腾出足够的间隙

### 方案2 : outline

如果只需要两层边框，可以在常规边框的基础上，增加 outline(描边)属性来产生外层的边框，特点是比较灵活。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661147886377-51b2e9c1-96f8-4305-8eaf-95ff0cb8f0b2.png#averageHue=%23f0edec&clientId=u437a448f-b75f-4&from=paste&height=417&id=ueff0653d&name=image.png&originHeight=834&originWidth=2030&originalType=binary&ratio=1&rotation=0&showTitle=false&size=744423&status=done&style=none&taskId=u31f80902-0d32-495a-b75b-95cdaf0d400&title=&width=1015)

### 总结
这两种方案都可以实现多重边框的效果，但是outline 只适用于双层边框的场景，如果需要更多层边框，可以用 box-shadow 来实现，另外这两种方案都有一个潜在的缺陷，采用时一定要在不同的浏览器中测试好最终效果。

## 3-灵活的背景定位
### 难题
想要的效果：使背景图片针对某个角进行准确的偏移定位？

### 方案1 background-position

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661148998238-6036c457-ce92-4ec8-bc14-cd2671dc3181.png#averageHue=%23f0eeed&clientId=u437a448f-b75f-4&from=paste&height=453&id=ud0d31de5&name=image.png&originHeight=906&originWidth=1844&originalType=binary&ratio=1&rotation=0&showTitle=false&size=850300&status=done&style=none&taskId=ua940071d-f5ec-41a3-a6ee-67af7c81bda&title=&width=922)
### 方案2 background-origin
这种方案的优点是，当内边距改变时，其会自动进行位置偏移更新，不用重新声明新的偏移量。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661149152916-743e970c-726d-41a0-8e74-2e037456e0f9.png#averageHue=%23f0eeed&clientId=u437a448f-b75f-4&from=paste&height=459&id=u3ea4f303&name=image.png&originHeight=918&originWidth=1834&originalType=binary&ratio=1&rotation=0&showTitle=false&size=872784&status=done&style=none&taskId=u34210184-b7d9-4173-8d06-8464ac3aa56&title=&width=917)
### 方案3 calc()
calc() 也可以结合 background-position 进行准确的计算偏移量，达到同样的效果。注意 calc() 函数内部的 - 和 + 运算符两侧需要各加一个空白符，否则会解析错误。

```javascript
background-position: calc(100% - 20px) calc(100% - 10px);
```

## 4-边框内圆角

想要的效果如下，只显示内部圆角，外部仍然为矩角
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661151647120-72b20313-5fb6-47f6-be9d-e3948fd4e34e.png#averageHue=%23e6ded3&clientId=u437a448f-b75f-4&from=paste&height=415&id=u52de88ac&name=image.png&originHeight=830&originWidth=1270&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26779&status=done&style=none&taskId=u5687c2a7-0f33-481d-8201-f0007b3c131&title=&width=635)

### 方案1双元素叠加
使用双 div 元素叠加来实现
```javascript
<div class="parent">
  <div class="child"></div>
</div>

.parent {
  margin: 100px auto;
  width: 400px;
  height: 200px;
  background: #655;
  padding: 0.8em;
}

.child {
  height: 170px;
  background: tan;
  padding: 1em;
  border-radius: 0.8em;
}

```

### 方案2 单元素
这种方案在书中提到是个 hack, 果然我写这篇文章的时候，验证了谷歌浏览器中 outline 的样式会跟着border-radius 走，所以这个方案基本已经失效了。
```javascript
div {
	outline: .6em solid #655;
	box-shadow: 0 0 0 .4em #655; /* todo calculate max of this */
	
	max-width: 10em;
	border-radius: .8em;
	padding: 1em;
	margin: 1em;
	background: tan;
	font: 100%/1.5 sans-serif;
}

```
## 5-条纹背景
### ![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661840944899-349b8d4b-2ec7-4ec1-b6af-3a4a6cf21c9d.png#averageHue=%23a6a070&clientId=uca3ed760-a322-4&from=paste&height=105&id=GHEDl&name=image.png&originHeight=226&originWidth=360&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4424&status=done&style=none&taskId=u3a4e8c4b-7b6f-4ffb-bd11-e12dc8891e1&title=&width=168)![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661840968246-fddc1f78-afc8-4b64-a299-0a97ceeb1d1c.png#averageHue=%23aaa16e&clientId=uca3ed760-a322-4&from=paste&height=103&id=meZne&name=image.png&originHeight=205&originWidth=301&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7275&status=done&style=none&taskId=ud8897e28-8c6b-440e-b0cd-6f19cfc0437&title=&width=150.5)![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661840998328-109c6680-603b-471a-a7f1-062de9ebe1db.png#averageHue=%23899785&clientId=uca3ed760-a322-4&from=paste&height=102&id=EaPYd&name=image.png&originHeight=203&originWidth=300&originalType=binary&ratio=1&rotation=0&showTitle=false&size=31470&status=done&style=none&taskId=uf4dfedd0-dd26-4c36-8ac6-44b42c21d15&title=&width=150)![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661841468480-afab750a-0f95-471b-9a8e-2d3e44432bbd.png#averageHue=%235d8eae&clientId=uca3ed760-a322-4&from=paste&height=104&id=kte2U&name=image.png&originHeight=207&originWidth=303&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6986&status=done&style=none&taskId=u6a9893eb-a5e1-4e5f-b78f-8fbd9dee7bb&title=&width=151.5)
### 介绍
传统方案都是用 svg 或者图片来解决，这里直接使用 css 来创建条纹图案
```javascript
// 水平条纹效果
background: linear-gradient(#fb3 50%, #58a 50%); 
background-size: 100% 30px;

// 垂直条纹效果
background: linear-gradient(to right, #fb3 50%, #58a 0);
background-size: 30px 100%;

// 斜向条纹
background: linear-gradient(45deg, #fb3 50%, #58a 0);
background-size: 30px 30px;

// 同色系条纹
background: repeating-linear-gradient(30deg, #79b, #79b 15px, #58a 0, #58a 30px);
background: #58a;

// 同色系条纹 重构
background: repeating-linear-gradient(
  30deg, 
  hsla(0, 0%, 100%, .1),
  hsla(0, 0%, 100%, .1) 15px,
  transparent 0,
  transparent 30px);
background: #58a;
```

## 6-复杂的背景图案
### 桌布图案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661935401761-b90a8b5f-03ff-4b85-903d-02da78f72c59.png#averageHue=%235d8dae&clientId=uca3ed760-a322-4&from=paste&height=101&id=u7e216887&name=image.png&originHeight=201&originWidth=305&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3727&status=done&style=none&taskId=u831176b8-7ea9-49fb-a62c-0dee519145f&title=&width=152.5)![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661935438842-4e750ce2-92cb-4070-86a5-7939389a67ad.png#averageHue=%23725f5b&clientId=uca3ed760-a322-4&from=paste&height=102&id=uc4807f26&name=image.png&originHeight=204&originWidth=300&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5912&status=done&style=none&taskId=ub2d74a4d-84ad-4e3f-99b2-562403876cd&title=&width=150)

```javascript

/**
 * Checkerboard
 */

background: #eee;
background-image: 
	linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,.25) 0),
	linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,.25) 0);
background-position: 0 0, 15px 15px;
background-size: 30px 30px;

min-height: 100%;

/**
 * Polka dot
 */

background: #655;
background-image: radial-gradient(tan 20%, transparent 0),
                  radial-gradient(tan 20%, transparent 0);
background-size: 30px 30px;
background-position: 0 0, 15px 15px;
```

### 棋盘
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661935468601-b5a12769-2307-4a8f-b199-a3b1101197ce.png#averageHue=%23cfcfcf&clientId=uca3ed760-a322-4&from=paste&height=101&id=u1fc301a1&name=image.png&originHeight=201&originWidth=304&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3062&status=done&style=none&taskId=uc1c40a52-becc-4b89-8828-d154ef6fa4c&title=&width=152)

```javascript
/**
 * Checkerboard
 */

background: #eee;
background-image: 
	linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,.25) 0),
	linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,.25) 0);
background-position: 0 0, 15px 15px;
background-size: 30px 30px;

min-height: 100%;

/**
 * Checkerboard with SVG
 */

background: #eee url('data:image/svg+xml,\
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".25" >\
            <rect x="50" width="50" height="50" />\
            <rect y="50" width="50" height="50" />\
            </svg>');
background-size: 30px 30px;
```
### 角向渐变
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661936408051-acf62644-161b-4211-9457-75efb810da23.png#averageHue=%2300d0c2&clientId=uca3ed760-a322-4&from=paste&height=112&id=ue3362285&name=image.png&originHeight=223&originWidth=367&originalType=binary&ratio=1&rotation=0&showTitle=false&size=39861&status=done&style=none&taskId=u1abf7794-f9b3-46c7-a7d2-98bd03457aa&title=&width=183.5)

```javascript
/**
 * Conic gradients test
 * PASS if green gradient, FAIL if red.
 */

background: red;
background: conic-gradient(limegreen, green, limegreen);
min-height: 100%;
```

## 7-伪随机背景
难点：重复的平铺图案虽然美观，但是不太自然，下面介绍增加随机性背景的方法
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661937854522-832c26e4-7408-4e92-958c-04e38908ec0f.png#averageHue=%23b6aa6f&clientId=uca3ed760-a322-4&from=paste&height=104&id=u3f1bdd4e&name=image.png&originHeight=207&originWidth=308&originalType=binary&ratio=1&rotation=0&showTitle=false&size=8605&status=done&style=none&taskId=u0ee797c1-4672-47c7-bbbb-73cdd69c066&title=&width=154)

```javascript

/**
 * Pseudorandom stripes
 */

background: hsl(20, 40%, 90%);
background-image: 
	linear-gradient(90deg, #fb3 11px, transparent 0),
	linear-gradient(90deg, #ab4 23px, transparent 0),
	linear-gradient(90deg, #655 23px, transparent 0);
background-size: 83px 100%, 61px 100%, 41px 100%;
```

## 8-连续的图像边框
难点：通常这种效果是借助双 Dom 来实现，一个作为背景图，一个作为内容；我们的改进方案是基于一个元素来实现的。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661995720303-0dbdd0db-007d-40e3-87c3-2df9f5381774.png#averageHue=%23d1cccb&clientId=uca3ed760-a322-4&from=paste&height=343&id=u934536b0&name=image.png&originHeight=686&originWidth=574&originalType=binary&ratio=1&rotation=0&showTitle=false&size=102008&status=done&style=none&taskId=ub98db248-c3ad-4668-afd9-736c6353e68&title=&width=287)
```javascript
/**
 * Basic border-image demo
 */

div {
	border: 40px solid transparent;
	border-image: 33.334% url('data:image/svg+xml,<svg xmlns="http:%2F%2Fwww.w3.org%2F2000%2Fsvg" width="30" height="30"> \
	                      <circle cx="5" cy="5" r="5" fill="%23ab4"%2F><circle cx="15" cy="5" r="5" fill=" %23655"%2F> \
	                      <circle cx="25" cy="5" r="5" fill="%23e07"%2F><circle cx="5" cy="15" r="5" fill=" %23655"%2F> \
	                      <circle cx="15" cy="15" r="5" fill="hsl(15, 25%, 75%)"%2F> \
	                      <circle cx="25" cy="15" r="5" fill=" %23655"%2F><circle cx="5" cy="25" r="5" fill="%23fb3"%2F> \
	                      <circle cx="15" cy="25" r="5" fill=" %23655"%2F><circle cx="25" cy="25" r="5" fill="%2358a"%2F><%2Fsvg>');
	padding: 1em;
	max-width: 20em;
	font: 130%/1.6 Baskerville, Palatino, serif;
}

div:nth-child(2) {
	margin-top: 1em;
	border-image-repeat: round;
}
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661996151807-23e27d56-c21c-4ead-ac5e-de1a8af894ee.png#averageHue=%23f1e3e3&clientId=uca3ed760-a322-4&from=paste&height=116&id=u6f2e6d8d&name=image.png&originHeight=231&originWidth=398&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27439&status=done&style=none&taskId=u863523e7-9322-4084-862d-ec5064f8664&title=&width=199)

利用上面的条纹背景
```javascript
/**
 * Vintage envelope themed border
 */

div {
	padding: 1em;
	border: 1em solid transparent;
	background: linear-gradient(white, white) padding-box,
	            repeating-linear-gradient(-45deg, red 0, red 12.5%, transparent 0, transparent 25%, 
	              #58a 0, #58a 37.5%, transparent 0, transparent 50%) 0 / 6em 6em;
	
	max-width: 20em;
	font: 100%/1.6 Baskerville, Palatino, serif;
}
```
## 
## 9-自适应的椭圆
难点：border-radius 其实可以单独指定水平和垂直半径，用斜杠（/）分隔这两个值即可。利用这个特性可以创建椭圆圆角。

### 椭圆

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661999835740-5713dae3-b8a5-44b2-987e-e338bc7feb8d.png#averageHue=%23ffda92&clientId=uca3ed760-a322-4&from=paste&height=101&id=uad306f5e&name=image.png&originHeight=201&originWidth=301&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6223&status=done&style=none&taskId=ud72f3dae-a5bd-4fee-9b6f-52aa04a5955&title=&width=150.5)


```javascript
/**
 * Flexible ellipse
 */

div {
	width: 20em;
	height: 10em;
	background: #fb3;
	border-radius: 50%;
}


```
### 半椭圆
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1661999861413-e86e303b-1f24-48df-92ec-c9679c7a41d9.png#averageHue=%23ffebc3&clientId=uca3ed760-a322-4&from=paste&height=193&id=vaVXy&name=image.png&originHeight=386&originWidth=1153&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21970&status=done&style=none&taskId=u7d9bfd99-53b3-4f0c-8181-3682cedfb80&title=&width=576.5)
```javascript
/**
 * Flexible half ellipse
 */

div {
	display: inline-block;
	width: 16em;
	height: 10em;
	margin: 1em;
	background: #fb3;
	border-radius: 50% / 100% 100% 0 0;
}

div:nth-of-type(2) { border-radius: 50% / 0 0 100% 100%; }
div:nth-of-type(3) { border-radius: 100% 0 0 100% / 50%; }
div:nth-of-type(4) { border-radius: 0 100% 100% 0 / 50%; }
```

### 四分之一椭圆
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662000264704-3fa651e7-fa86-446a-86bc-e57e2e4696db.png#averageHue=%23ffeac2&clientId=uca3ed760-a322-4&from=paste&height=189&id=u67c65406&name=image.png&originHeight=377&originWidth=1157&originalType=binary&ratio=1&rotation=0&showTitle=false&size=18413&status=done&style=none&taskId=uf2e9f56b-27ed-4848-8d3e-b5f83b6eca6&title=&width=578.5)

```javascript

/**
 * Flexible quarter ellipse
 */

div {
	display: inline-block;
	width: 16em;
	height: 10em;
	margin: 1em;
	background: #fb3;
	border-radius: 100% 0 0 0;
}

div:nth-of-type(2) { border-radius: 0 100% 0 0; }
div:nth-of-type(3) { border-radius: 0 0 100% 0; }
div:nth-of-type(4) { border-radius: 0 0 0 100%; }
```

## 10-平行四边形
背景知识： 基本的 css 变形 transform: skewx()

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662000392383-ad3c9a14-a8f0-4422-99d9-c2a444108795.png#averageHue=%23fefefe&clientId=uca3ed760-a322-4&from=paste&height=107&id=ud477f24f&name=image.png&originHeight=213&originWidth=586&originalType=binary&ratio=1&rotation=0&showTitle=false&size=8802&status=done&style=none&taskId=u47c23255-2482-45a0-8bce-14182852034&title=&width=293)

### 潜套元素方案
可以解决文字变形的问题
```javascript
/**
 * Parallelograms — with extra HTML element
 */

<a href="#yolo" class="button"><div>Click me</div></a>
<button class="button"><div>Click me</div></button>
  
 
.button { transform: skewX(45deg); }
.button > div { transform: skewX(-45deg); }

.button {
	display: inline-block;
	padding: .5em 1em;
	border: 0; margin: .5em;
	background: #58a;
	color: white;
	text-transform: uppercase;
	text-decoration: none;
	font: bold 200%/1 sans-serif;
}
```

### 伪元素方案

```javascript
/**
 * Parallelograms — with pseudoelements
 */

<a href="#yolo" class="button"><div>Click me</div></a>
<button class="button"><div>Click me</div></button>

.button {
	position: relative;
	display: inline-block;
	padding: .5em 1em;
	border: 0; margin: .5em;
	background: transparent;
	color: white;
	text-transform: uppercase;
	text-decoration: none;
	font: bold 200%/1 sans-serif;
}

.button::before {
	content: ''; /* To generate the box */
	position: absolute;
	top: 0; right: 0; bottom: 0; left: 0;
	z-index: -1;
	background: #58a;
	transform: skew(45deg);
}
```

## 11-菱形图片
介绍两种使用 css 制作菱形图片的方案，相对于设计师提供裁切好的图片，更加灵活
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662013520185-4b45d1d8-2202-41e6-b42a-f5db295f97ee.png#averageHue=%2348443f&clientId=uca3ed760-a322-4&from=paste&height=193&id=u3ca1ce18&name=image.png&originHeight=385&originWidth=406&originalType=binary&ratio=1&rotation=0&showTitle=false&size=87892&status=done&style=none&taskId=u97041209-7fa6-4c7f-845c-6dcba23cf98&title=&width=203)
### 基于变形的方案
```javascript
/**
 * Diamond images — via transforms
 */
<div class="diamond">
	<img src="http://placekitten.com/200/300" />
</div>

.diamond {
	width: 250px;
	height: 250px;
	transform: rotate(45deg);
	overflow: hidden;
	margin: 100px;
}

.diamond img {
	max-width: 100%;
	transform: rotate(-45deg) scale(1.42);
	z-index: -1;
	position: relative;
}
```
### 裁切路径方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662013974851-6a45285f-5ac7-4259-93a4-fdedd83fc2b7.png#averageHue=%2345423d&clientId=uca3ed760-a322-4&from=paste&height=170&id=u21d3349c&name=image.png&originHeight=340&originWidth=478&originalType=binary&ratio=1&rotation=0&showTitle=false&size=59557&status=done&style=none&taskId=udf8d0dc4-183d-46fb-ad8e-f8a8019e984&title=&width=239)
```javascript
/**
 * Diamond images — via clip-path
 */

img {
	max-width: 250px;
	margin: 20px;
	-webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
	clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
	transition: 1s;
}

img:hover {
	-webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
```

## 12-切角效果
背景知识：css 渐变，background-size,'条纹背景'

切角是一种流行的设计风格，使用css 制作切角可以实现更加灵活和多样的颜色效果

### 渐变方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662014210101-698df7f7-3616-49fb-a056-5265a0429138.png#averageHue=%23fcfdfd&clientId=uca3ed760-a322-4&from=paste&height=123&id=u10925a60&name=image.png&originHeight=246&originWidth=363&originalType=binary&ratio=1&rotation=0&showTitle=false&size=24077&status=done&style=none&taskId=u807d7d4f-9c7c-4a51-9935-f12c5a03220&title=&width=181.5)
```javascript
<div>Hey, focus! You’re er!</div>

/**
 * Beveled corners — with gradients
 */

div {
	background: #58a;
	background: linear-gradient(135deg, transparent 15px, #58a 0) top left,
	            linear-gradient(-135deg, transparent 15px, #58a 0) top right,
	            linear-gradient(-45deg, transparent 15px, #58a 0) bottom right,
	            linear-gradient(45deg, transparent 15px, #58a 0) bottom left;
	background-size: 50% 50%;
	background-repeat: no-repeat;
	
	padding: 1em 1.2em;
	max-width: 12em;
	color: white;
	font: 150%/1.6 Baskerville, Palatino, serif;
}

```
### 弧形切角

渐变技巧的一个变种
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662014469390-7893fa8c-17be-49b4-9e4c-740ab0c15c04.png#averageHue=%239dbace&clientId=uca3ed760-a322-4&from=paste&height=125&id=u148d0f92&name=image.png&originHeight=250&originWidth=336&originalType=binary&ratio=1&rotation=0&showTitle=false&size=20673&status=done&style=none&taskId=u71e86c15-c22f-4f45-9735-bbc4ac692e4&title=&width=168)
```javascript
/**
 * Scoop corners
 */

div {
	background: #58a;
	background:	radial-gradient(circle at top left, transparent 15px, #58a 0) top left,
	            radial-gradient(circle at top right, transparent 15px, #58a 0) top right,
	            radial-gradient(circle at bottom right, transparent 15px, #58a 0) bottom right,
	            radial-gradient(circle at bottom left, transparent 15px, #58a 0) bottom left;
	background-size: 50% 50%;
	background-repeat: no-repeat;
	
	padding: 1em 1.2em;
	max-width: 12em;
	color: white;
	font: 130%/1.6 Baskerville, Palatino, serif;
}
```

### 内联 SVG 与 border-image 方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662014535583-f0e62ad2-9a22-4251-9a96-35858234dcc6.png#averageHue=%23a0bccf&clientId=uca3ed760-a322-4&from=paste&height=146&id=u8b383c07&name=image.png&originHeight=291&originWidth=402&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22973&status=done&style=none&taskId=ue3750fad-0961-4d5e-bdcd-3c9068a3c8b&title=&width=201)
```javascript
/**
 * Beveled corners — with border-image and an inline SVG
 */

div {
	border: 21px solid transparent;
	border-image: 1 url('data:image/svg+xml,\
	                      <svg xmlns="http://www.w3.org/2000/svg" width="3" height="3" fill="%2358a">\
	                      <polygon points="0,1 1,0 2,0 3,1 3,2 2,3 1,3 0,2" />\
	                      </svg>');
	background: #58a;
	background-clip: padding-box;
	
	padding: .2em .3em;
	max-width: 12em;
	color: white;
	font: 150%/1.6 Baskerville, Palatino, serif;
}
```

### 裁切路径方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662014625280-6ca09772-681a-46b9-964a-78ab4cae019e.png#averageHue=%23feffff&clientId=uca3ed760-a322-4&from=paste&height=128&id=uf4e76363&name=image.png&originHeight=255&originWidth=384&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21704&status=done&style=none&taskId=ue76dbb4d-7622-4a84-b417-135d6964c6e&title=&width=192)
强烈推荐这种，可以比较方便的制作大量不同颜色的切角图片，只需要改变背景色就好。
```javascript
/**
 * Beveled corners — with clip-path
 */

div {
	background: #58a;
	-webkit-clip-path: 
		polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px),
		calc(100% - 20px) 100%,
		20px 100%, 0 calc(100% - 20px), 0 20px);
	clip-path:
	 		polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px),
	 		calc(100% - 20px) 100%,
	 		20px 100%, 0 calc(100% - 20px), 0 20px);
	
	padding: 1em 1.2em;
	max-width: 12em;
	color: white;
	font: 150%/1.6 Baskerville, Palatino, serif;
}
```

## 13-梯形标签页
背景知识：基本的3D变形，“平行四边形”

方案1: 伪元素制作两条斜边，border  制作上下平行边
方案2: 3D 旋转，普通的3D 旋转会有副作用比如 文字的变形

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662015280251-65a85a17-e885-4a56-8dc1-c3443134fbb6.png#averageHue=%23ebebeb&clientId=uca3ed760-a322-4&from=paste&height=206&id=uaae4195b&name=image.png&originHeight=411&originWidth=590&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32840&status=done&style=none&taskId=ud8a9d214-2735-410d-870a-2be4e0a3502&title=&width=295)

```javascript

<!-- This HTML is invalid and just for demo purposes. Don't use multiple main elements! -->

<nav>
	<a href="#">Home</a>
	<a href="#" class="selected">Projects</a>
	<a href="#">About</a>
</nav>
<main>
	Content area
</main>

<nav class="left">
	<a href="#">Home</a>
	<a href="#" class="selected">Projects</a>
	<a href="#">About</a>
</nav>
<main>
	Content area
</main>

<nav class="right">
	<a href="#">Home</a>
	<a href="#" class="selected">Projects</a>
	<a href="#">About</a>
</nav>
<main>
	Content area
</main>

/**
 * Trapezoid tabs
 */

body {
	padding: 40px;
	font: 130%/2 Frutiger LT Std, sans-serif;
}

nav {
	position: relative;
	z-index: 1;
	padding-left: 1em;
}

nav > a {
	position: relative;
	display: inline-block;
	padding: .3em 1em 0;
	color: inherit;
	text-decoration: none;
	margin: 0 -.3em;
} 

nav > a::before,
main {
	border: .1em solid rgba(0,0,0,.4);
}

nav a::before {
	content: ''; /* To generate the box */
	position: absolute;
	top: 0; right: 0; bottom: 0; left: 0;
	z-index: -1;
	border-bottom: none;
	border-radius: .5em .5em 0 0;
	background: #ccc linear-gradient(hsla(0,0%,100%,.6), hsla(0,0%,100%,0));
	box-shadow: 0 .15em white inset;
	transform: scale(1.1, 1.3) perspective(.5em) rotateX(5deg);
	transform-origin: bottom;
}

nav a.selected { z-index: 2;}

nav a.selected::before {
	background-color: #eee;
	margin-bottom: -.08em;
}

main {
	display: block;
	margin-bottom: 1em;
	background: #eee;
	padding: 1em;
	border-radius: .15em;
}

nav.left > a::before {
	transform: scale(1.2, 1.3) perspective(.5em) rotateX(5deg);
	transform-origin: bottom left;
}

nav.right { padding-left: 2em; }

nav.right > a::before {
	transform: scale(1.2, 1.3) perspective(.5em) rotateX(5deg);
	transform-origin: bottom right;
}
```

14-简单的饼图
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662015782179-a1768966-c05a-4b67-bd6b-6120a02edbb4.png#averageHue=%23f3f1f1&clientId=uca3ed760-a322-4&from=paste&height=96&id=uec9ce7aa&name=image.png&originHeight=192&originWidth=300&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5652&status=done&style=none&taskId=u7e778f1e-919e-4b2b-a4b1-c573cd444e9&title=&width=150)

### 基于transtorm 和 animation
```javascript
/**
 * Animated pie chart
 */

.pie {
	width: 100px; height: 100px;
	border-radius: 50%;
	background: yellowgreen;
	background-image: linear-gradient(to right, transparent 50%, currentColor 0);
	color: #655;
}

.pie::before {
	content: '';
	display: block;
	margin-left: 50%;
	height: 100%;
	border-radius: 0 100% 100% 0 / 50%;
	background-color: inherit;
	transform-origin: left;
	animation: spin 3s linear infinite, bg 6s step-end infinite;
}

@keyframes spin {
	to { transform: rotate(.5turn); }
}
@keyframes bg {
	50% { background: currentColor; }
}
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662015815048-e4590d4a-8077-4b81-bef0-8c2160343d63.png#averageHue=%23e8e5e5&clientId=uca3ed760-a322-4&from=paste&height=117&id=u0279b509&name=image.png&originHeight=233&originWidth=557&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16271&status=done&style=none&taskId=u414004c9-b1e8-42e3-9bc8-9522358f879&title=&width=278.5)
```javascript
/**
 * Static pie charts
 */

.pie {
	display: inline-block;
	position: relative;
	width: 100px;
	line-height: 100px;
	border-radius: 50%;
	background: yellowgreen;
	background-image: linear-gradient(to right, transparent 50%, #655 0);
	color: transparent;
	text-align: center;
}

@keyframes spin {
	to { transform: rotate(.5turn); }
}
@keyframes bg {
	50% { background: #655; }
}   

.pie::before {
	content: '';
	position: absolute;
	top: 0; left: 50%;
	width: 50%; height: 100%;
	border-radius: 0 100% 100% 0 / 50%;
	background-color: inherit;
	transform-origin: left;
	animation: spin 50s linear infinite, bg 100s step-end infinite;
	animation-play-state: paused;
	animation-delay: inherit;
}
```

### SVG 方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662017556138-1655471d-5403-44cb-99d1-0fa8de79a89a.png#averageHue=%23e8e5e5&clientId=uca3ed760-a322-4&from=paste&height=107&id=u02cce2b6&name=image.png&originHeight=214&originWidth=412&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7655&status=done&style=none&taskId=ufa30a5a6-ecec-45d5-b13d-4bd42308ffb&title=&width=206)
```javascript
/**
 * Pie charts — with SVG
 */

.pie {
	width: 100px;
	height: 100px;
	display: inline-block;
	margin: 10px;
	transform: rotate(-90deg);
}

svg {
	background: yellowgreen;
	border-radius: 50%;
}

circle {
	fill: yellowgreen;
	stroke: #655;
	stroke-width: 32;
}

@keyframes grow { to { stroke-dasharray: 100 100 } }

.pie.animated circle {
	animation: grow 2s infinite linear;
}
```

## 15-单侧投影

### 单侧投影
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662018285460-dc0239f2-91eb-440f-92b1-940d009168ec.png#averageHue=%23fde3af&clientId=uca3ed760-a322-4&from=paste&height=114&id=u574aaa30&name=image.png&originHeight=161&originWidth=239&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2543&status=done&style=none&taskId=ud7ea9391-63f5-4629-998e-0c9edf93872&title=&width=169.5)
```javascript
/**
 * One-sided shadow
 */

div {
	width: 1.6in;
	height: 1in;
	background: #fb3;
	box-shadow: 0 5px 4px -4px black;
}
```
### 邻边投影
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662018351282-254c1067-98aa-4897-90b6-238ceca457bd.png#averageHue=%23fde7ba&clientId=uca3ed760-a322-4&from=paste&height=89&id=ue42c2e39&name=image.png&originHeight=177&originWidth=256&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3217&status=done&style=none&taskId=u28cebcf8-aa81-4657-bc18-c82ffaf2e4e&title=&width=128)
```javascript
/**
 * One-sided shadow
 */

div {
	width: 1.6in;
	height: 1in;
	background: #fb3;
	box-shadow: 3px 3px 6px -3px black;
}
```
### 双侧投影
### ![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662018446022-f96a268c-d383-4b94-8275-5013f358b357.png#averageHue=%23fdca62&clientId=uca3ed760-a322-4&from=paste&height=114&id=u3d5d37bd&name=image.png&originHeight=228&originWidth=383&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3981&status=done&style=none&taskId=ub5ef4090-3087-4e5f-bea6-d85f89d7436&title=&width=191.5)

```javascript
/**
 * One-sided shadow
 */

div {
	width: 1.6in;
	height: 1in;
	background: #fb3;
	box-shadow: 5px 0 5px -5px black,
	           -5px 0 5px -5px black;
}
```
## 16-不规则投影
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662018714184-d9551488-58c8-4ac7-a05d-27aec4237e7e.png#averageHue=%23f7e1b5&clientId=uca3ed760-a322-4&from=paste&height=140&id=uaa3d0f9a&name=image.png&originHeight=280&originWidth=696&originalType=binary&ratio=1&rotation=0&showTitle=false&size=41096&status=done&style=none&taskId=u7ab5160c-cd5a-4c55-b836-f851a1436bc&title=&width=348)
```javascript
<div class="speech">Speech bubble</div>
<div class="dotted">Dotted border</div>
<div class="cutout">Cutout corners</div>

/**
 * Irregular drop-shadows
 */

div {
	position: relative;
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
	vertical-align: bottom;
	box-sizing: border-box;
	width: 5.9em;
	height: 5.2em;
	margin: .6em;
	background: #fb3;
	/*box-shadow: .1em .1em .3em rgba(0,0,0,.5);*/
	-webkit-filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));
	filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));
	font: 200%/1.6 Baskerville, Palatino, serif;
	text-align: center;
}

.speech {
	border-radius: .3em;
}

.speech::before {
	content: '';
	position: absolute;
	top: 1em;
	right: -.7em;
	width: 0;
	height: 0;
	border: 1em solid transparent;
	border-left-color: #fb3;
	border-right-width: 0;
}

.dotted {
	background: transparent;
	border: .3em dotted #fb3;
}

.cutout {
	border: .5em solid #58a;
	border-image: 1 url('data:image/svg+xml,\
	                     <svg xmlns="http://www.w3.org/2000/svg"\
		                 width="3" height="3" fill="%23fb3">\
		     	         <polygon points="0,1 1,0 2,0 3,1 3,2 2,3 1,3 0,2"/>\
		     	</svg>');
	background-clip: padding-box;
}
```

## 17-染色效果
### 基于滤镜的方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662018822228-a3854e94-a295-4a5c-ab90-643b63214f72.png#averageHue=%23e4bbbc&clientId=uca3ed760-a322-4&from=paste&height=172&id=u0761e6ea&name=image.png&originHeight=344&originWidth=326&originalType=binary&ratio=1&rotation=0&showTitle=false&size=71469&status=done&style=none&taskId=u8b3e7a7d-e1f0-48a1-bf01-9f13ef664f8&title=&width=163)
```javascript
/**
 * Color tinting — with filters
 */

img {
	max-width: 640px;
	transition: 1s filter, 1s -webkit-filter;
	-webkit-filter: sepia() saturate(4) hue-rotate(295deg);
	filter: sepia() saturate(4) hue-rotate(295deg);
}

img:hover,
img:focus {
	-webkit-filter: none;
	filter: none;
}
```

### 基于混合模式的方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662018925978-dfc1cddd-1d7f-4195-8c5d-c97272cfc030.png#averageHue=%23d882a6&clientId=uca3ed760-a322-4&from=paste&height=237&id=ua6bd60cc&name=image.png&originHeight=473&originWidth=329&originalType=binary&ratio=1&rotation=0&showTitle=false&size=136547&status=done&style=none&taskId=u4c1ba9c6-dfc9-4d5e-9ab3-016e632388f&title=&width=164.5)
```javascript
/**
 * Color tinting — with blending modes
 */

.tinted-image {
	width: 300px; height: 440px;
	background-size: cover;
	background-color: hsl(335, 100%, 50%);
	background-blend-mode: luminosity;
	transition: .5s background-color;
}

.tinted-image:hover {
	background-color: transparent;
}
```
## 18-毛玻璃效果
背景知识：PGBA/HSLA 颜色 , filter: blur()

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662019371695-37e82683-546f-48e3-a938-9291c6bbb3ea.png#averageHue=%2351504b&clientId=uca3ed760-a322-4&from=paste&height=194&id=u682d1987&name=image.png&originHeight=387&originWidth=792&originalType=binary&ratio=1&rotation=0&showTitle=false&size=254571&status=done&style=none&taskId=uf21c6a9c-6ef1-4685-a5aa-3f6c6dcf655&title=&width=396)

```javascript
/**
 * Frosted glass effect
 */

body {
	min-height: 100vh;
	box-sizing: border-box;
	margin: 0;
	padding-top: calc(50vh - 6em);
	font: 150%/1.6 Baskerville, Palatino, serif;
}

body, main::before {
	background: url("http://placekitten.com/200/300") 0 / cover fixed;
}

main {
	position: relative;
	margin: 0 auto;
	padding: 1em;
	max-width: 23em;
	background: hsla(0,0%,100%,.25) border-box;
	overflow: hidden;
	border-radius: .3em;
	box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset,
	            0 .5em 1em rgba(0, 0, 0, 0.6);
	text-shadow: 0 1px 1px hsla(0,0%,100%,.3);
}

main::before {
	content: '';
	position: absolute;
	top: 0; right: 0; bottom: 0; left: 0;
	margin: -30px;
	z-index: -1;
	-webkit-filter: blur(20px);
	filter: blur(20px);
}

blockquote { font-style: italic }
blockquote cite { font-style: normal; }
```

## 19-折角效果
背景知识： css 变形， css 渐变， “切角效果”
### 45度折角的解决方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662020460440-4d82b398-4a13-431c-8845-647d3672f8df.png#averageHue=%23a2bed0&clientId=uca3ed760-a322-4&from=paste&height=114&id=u75e0fa7b&name=image.png&originHeight=227&originWidth=326&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15121&status=done&style=none&taskId=u0b49eec5-0303-4551-af36-f3a0b1a1ef4&title=&width=163)
```javascript
/**
 * Folded corner effect
 */

div {
	width: 12em;
	background: #58a; /* Fallback */
	background:
		linear-gradient(to left bottom, transparent 50%, rgba(0,0,0,.4) 0) 100% 0 no-repeat,
		linear-gradient(-135deg, transparent 1.5em, #58a 0);
	background-size: 2em 2em, auto;
	
	padding: 2em;
	color: white;
	font: 100%/1.6 Baskerville, Palatino, serif;
}
```
### 其他角度的解决方案
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1662020514066-31d9827a-8630-46a0-b183-2a6305548c1a.png#averageHue=%23a1bdcf&clientId=uca3ed760-a322-4&from=paste&height=111&id=ud3a6d248&name=image.png&originHeight=222&originWidth=327&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17551&status=done&style=none&taskId=ufc95c3e5-dc84-4ca7-a6a1-20ca5e62a0b&title=&width=163.5)
```javascript
/**
 * Folded corner effect — at an angle
 */

div {
	position: relative;
	width: 12em;
	background: #58a; /* Fallback */
	background: linear-gradient(-150deg, transparent 1.5em, #58a 0);
	padding: 2em;
	color: white;
	font: 100%/1.6 Baskerville, Palatino, serif;
	border-radius: .5em;
}

div::before {
	content: '';
	position: absolute;
	top: 0; right: 0;
	width: 1.73em; height: 3em;
	background: linear-gradient(to left bottom, transparent 50%, rgba(0,0,0,.2) 0, rgba(0,0,0,.4)) 100% 0 no-repeat;
	transform: translateY(-1.3em) rotate(-30deg);
	transform-origin: bottom right;
	border-bottom-left-radius: .5em;
	box-shadow: -.2em .2em .3em -.1em rgba(0,0,0,.15)
}
```
