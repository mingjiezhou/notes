## 前言

接着上篇讲，本篇主要给大家讲解一下子弹击中物体、物体销毁、敌方坦克构建生成、运动算法、爆炸效果、以及障碍物的生成；了解了这些我相信你可以不依赖游戏引擎实现大部分小游戏的开发。

**Es5版本：** [在线游戏](https://www.zhoumingjie.com/Battle-of-tank/battle%20city/index.html) [源代码](https://github.com/mingjiezhou/Battle-of-tank)

**W/上 S/下 A/左 D/右 F/射击**

让我们开始吧！

---

## 敌方坦克的生成

我们可以使用 for 循环和Tank 构造函数，批量制造多个敌方坦克，x,y 为其在画布中的坐标，direction 为坦克当前方向，type 为精灵图中截取坦克图片的信息，包含了坐标，尺寸，类型等

```
for(let t=0; t<20; t++) {
  let tank = new Tank(new TankConfig({
    x: 100 + t*30,
    y: 100,
    direction: DIRECTION.DOWN,
    type: TANK_TYPE.ENEMY0,
    is_player: 0
  }))
  tank.star();
}

ENEMY0: {
  type: 'ENEMY1',
  dimension: [30, 30],
  image_coordinates: [129, 1, 129, 33]
}
```

## 坦克移动的算法

emove 函数就是就是物体移动状态下每帧都会执行的函数，将根据当前方向修改下帧的坐标，当下帧坐标到达地图边缘时将执行 dir 函数更新坦克方向，如果是子弹则将销毁。

```
this.emove = function (d, obstacle_sprites) {
    this.direction = d
    switch (d) {
      case DIRECTION.UP:
        if (
          (obstacle_sprites && !this.checkRangeOverlap(obstacle_sprites)) ||
          !obstacle_sprites
        ) {
          this.y -= this.speed
    
          if (this.y <= 10) {
            this.dir()
          }
        } else {
          this.dir()
        }
        break
    ...
```

dir 函数用来随机修改移动的方向，当然这个函数不能每帧都调用，否则坦克将像无头苍蝇一样了；那么什么时候需要修改方向呢，我们认为当坦克和物体相撞的时候或者到达地图边缘时修改方向是合理的；子弹也可以认为是一个物体，所以子弹到达坦克周边一定距离时也将引起坦克规避动作，也就是将触发dir 函数。

```
this.dir = function () {
    if(Math.floor(Math.random()*10) === 0 || Math.floor(Math.random()*10) === 1) {
      this.direction = DIRECTION.UP;
    };
    if(Math.floor(Math.random()*10) === 2 || Math.floor(Math.random()*10) === 3) {
      this.direction = DIRECTION.DOWN;
    };
    if(Math.floor(Math.random()*10) === 4 || Math.floor(Math.random()*10) === 5) {
      this.direction = DIRECTION.LEFT;
    };
    if(Math.floor(Math.random()*10) === 6 || Math.floor(Math.random()*10) === 7) {
      this.direction = DIRECTION.RIGHT;
    };
    if(Math.floor(Math.random()*10) === 8 || Math.floor(Math.random()*10) === 9) {
      this.dir();
    }
}

```

[![2022-03-16 23-11-48 2022-03-16 23_15_44](https://user-images.githubusercontent.com/37775265/158741380-97250a9a-417d-4b60-a2e8-ed7fbd8783c0.gif)](https://user-images.githubusercontent.com/37775265/158741380-97250a9a-417d-4b60-a2e8-ed7fbd8783c0.gif)

## 子弹击中物体的算法

我们定义 checkRangeOverlap 函数来判断两个物体是否相撞，uiobjs 为画布中所有的元素对象列表，包含 坦克、子弹、障碍物等；

this.getFrontPoints() 函数将根据当前方向返回包含三个顶端点坐标数组，形成判断区域；

uiobjs[o].getCornerPoints() 函数返回当前元素的四个边角坐标数组，形成判断区域；

然后getFrontPoints() 的三个点坐标 将分别和 uiobjs[o].getCornerPoints() 的四边坐标进行点对点判断，根据x, y 数值满足下方四个条件时则认为此点坐标在元素内部。

```
 // 判断点坐标是否在区域内部，以识别是否相撞
  CanvasSprite.prototype.checkRangeOverlap = function (uiobjs) {
    for (let o in uiobjs) {
      let obstacle_cp = uiobjs[o].getCornerPoints()
      let fp = this.getFrontPoints()

      for (let idx = 0; idx < fp.length; idx++) {
        if (
          fp[idx].x > obstacle_cp[0].x &&
          fp[idx].x < obstacle_cp[1].x &&
          fp[idx].y > obstacle_cp[0].y &&
          fp[idx].y < obstacle_cp[2].y
        ) {
          return true
        }
      }
    }
    return false
  }
```

```

// 返回当前物体顶端三坐标
  CanvasSprite.prototype.getFrontPoints = function () {
    let front_point
    switch (this.direction) {
      case DIRECTION.UP:
        front_point = [
          new Point(this.x, this.y),
          new Point((2 * this.x + this.width) / 2, this.y),
          new Point(this.x + this.width, this.y),
        ]
        break
      ... 缩略，下左右方向
    }
    return front_point
  }
```

```
// 返回元素四边坐标形成的矩形区域范围
  CanvasSprite.prototype.getCornerPoints = function () {
    var corner_points
    switch (this.direction) {
      case DIRECTION.UP:
        corner_points = [
          new Point(this.x, this.y),
          new Point(this.x + this.width, this.y),
          new Point(this.x + this.width, this.y + this.height),
          new Point(this.x, this.y + this.height),
        ]
        break
        ... 缩略，下左右方向
    }
    return corner_points
  }
```

[![2022-03-17 11-59-10 2022-03-17 12_00_22](https://user-images.githubusercontent.com/37775265/158741771-8af1ba27-178e-4e54-a462-e5490f82ca8a.gif)](https://user-images.githubusercontent.com/37775265/158741771-8af1ba27-178e-4e54-a462-e5490f82ca8a.gif)

啊 坦克搞多了！但是可以看到子弹击中效果是成功的，你发现了没，击中后有一个爆炸效果，这个是怎么实现的呢？

## 爆炸效果的实现

当识别到击中后将此坦克将触发explode 爆炸效果，然后每帧 判断 isDestroied 是否销毁，后续每帧将 explosion_count++ 从 0 到 5，然后更改alive 状态为0 代表已销毁。

```

if (s instanceof Tank && s.alive && s.isDestroied()) {
    s.explode()
}
this.isDestroied = function () {
    return explosion_count > 0
  }
  
this.explode = function () {
    if (explosion_count++ === 5) {
      this.alive = 0
    }
  }
  
```

然后 explosion_count 的数值，从0 到 5 代表爆炸效果图的5帧

```
  this.getImg = function () {
    if (explosion_count > 0) {
      return {
        width: TANK_EXPLOSION_FRAME[explosion_count].dimension[0],
        height: TANK_EXPLOSION_FRAME[explosion_count].dimension[1],
        offset_x: TANK_EXPLOSION_FRAME[explosion_count].image_coordinates[0],
        offset_y: TANK_EXPLOSION_FRAME[explosion_count].image_coordinates[1],
      }
    } else {
      return {
        width: width,
        height: height,
        offset_x: this.type.image_coordinates[0],
        offset_y: this.type.image_coordinates[1],
      }
    }
  }
```

[![image](https://user-images.githubusercontent.com/37775265/158742030-5063e0c6-1d22-4db1-9049-a39e36bba211.png)](https://user-images.githubusercontent.com/37775265/158742030-5063e0c6-1d22-4db1-9049-a39e36bba211.png)

到现在我们的坦克游戏已经基本可玩了，只不过现在是一片大平原，毫无遮拦，我们该为画布增加一些障碍物如墙体，石头等，增加游戏可玩性。

## 生成障碍物（石墙、砖墙等）

有了之前tanke 和 子弹的构建函数，现在这个 Block 就简单多了，只需要定义好基本的信息，如坐标，宽高、状态、方向，然后借用 apply 来使用 CanvasSprite 上的通用方法。

```
    let Block = function (x, y, direction, type) {
      type = type || BLOCK_TYPE.BLOCK_BRICK
      let alive = 1
      let width = type.dimension[0]
      let height = type.dimension[1]
      let explosion_count = 0
      this.type = type

      this.x = x
      this.y = y
      this.genre = 'block'
      this.direction = direction || DIRECTION.UP

      CanvasSprite.apply(this, [
        {
          alive: 1,
          border_y: HEIGHT,
          border_x: WIDTH,
          speed: 0,
          direction: direction,
          x: x,
          y: y,
          width: width,
          height: height,
        },
      ])

      this.isDestroied = function () {
        return explosion_count > 0
      }

      this.explode = function () {
        if (explosion_count++ === 5) {
          this.alive = 0
        }
      }

      this.getImg = function () {
        if (explosion_count > 0) {
          return {
            width: TANK_EXPLOSION_FRAME[explosion_count].dimension[0],
            height: TANK_EXPLOSION_FRAME[explosion_count].dimension[1],
            offset_x: TANK_EXPLOSION_FRAME[explosion_count].image_coordinates[0],
            offset_y: TANK_EXPLOSION_FRAME[explosion_count].image_coordinates[1],
          }
        } else {
          return {
            width: width,
            height: height,
            offset_x: type.image_coordinates[0],
            offset_y: type.image_coordinates[1],
          }
        }
      }

      this._generateId = function () {
        return uuidv4()
      }

      sprites[this._generateId()] = this
    }
```

定义好后，使用时只需批量生成Block 的实例，将坐标，类型等信息传递进去就可以在下一帧渲染出来。

```
  for(let i=0; i<=2; i++) {
    for(let j=0; j<=2; j++) {
      let block = new Block(j*16, 140 + i*16, DIRECTION.UP, BLOCK_TYPE.BLOCK_STONE)
    }
  }

```

好了我们看看最终的效果吧!

[![2022-03-17 13-26-27 2022-03-17 13_28_28](https://user-images.githubusercontent.com/37775265/158743254-eb43b99f-1b53-4ea0-86fb-93d0e70fbea4.gif)](https://user-images.githubusercontent.com/37775265/158743254-eb43b99f-1b53-4ea0-86fb-93d0e70fbea4.gif)

ok 坦克大战基本上完成了，你可以修改子弹发射速度，敌方坦克数量，障碍物也可以自己随意画，可玩性还是挺好的，当然还有很多细节可以完善，如 预制几种不同的地图，做成通关类，预制几条生命等。如果你想试一下，可以 star 下 [github](https://github.com/mingjiezhou/Battle-of-tank) 仓库自己来改造自己的坦克大战吧。

---

合集：[我的 github 博客及案例源代码](https://github.com/mingjiezhou/notes/issues)

团队博客：[上汽保险博客](https://fe-blog.insaic.me/)