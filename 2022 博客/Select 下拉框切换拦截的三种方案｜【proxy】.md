### 前言

select 下拉框，想必我们都经常用的，不论是表单提交还是搜索，都常有它的身影，现在的组件库也都有封装相关组件，如 ant-design-vue 的 a-select、element-ui 的 el-select，用法一般是普通的选择、多选、支持搜索的选择、联动等。

那么你有没有遇到过需要对 select 切换进行拦截的操作？

我就遇到了这样的需求，所以记录一下，重点介绍结合 proxy 的实现方案。

效果图：

[![截屏2022-02-23 14 32 30](https://user-images.githubusercontent.com/37775265/155290903-4d31673c-f8fd-4370-be7f-83c10d1875b9.png)](https://user-images.githubusercontent.com/37775265/155290903-4d31673c-f8fd-4370-be7f-83c10d1875b9.png)

[在线测试地址](https://vv4u38.csb.app/)

### 要点

不论是原生的 select、a-select、el-select，其官方文档中都并没有显示其提供了 类似beforeChange 事件这样的钩子，而只有选项改变后的 change 事件回调，这样如果你在 change 事件里绑定弹窗事件的话会导致，Modal 对话框弹出时选项已经改变，此时选择取消操作，则还需要数据回溯，视觉体验上也不好；针对这个问题，我给出三种解决方案。

#### event.stopPropagation

这个思路是通过阻止事件的传播，来进行拦截的,可以给 a-select-option 下的dom 增加click 事件,加一个事件修饰符 click.stop (阻止单击事件继续传播)

```
// 伪代码
<a-select-option value="上海">
  <div @click.stop="handleClick">上海测试</div>
</a-select-option>

methods: {
    handleClick(item) {
        let _this = this
        _this.$confirm({
            title: "确认要切换么?",
            content: "切换经销商将重新载入页面数据",
            mask: false,
            onOk() {
              _this.data.value = item.value
            },
            onCancel() {},
          });
    }
}
```

#### Object.defineProperty

Object.defineProperty() 方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的对象,具体语法可以看这本书 [javascript 教程](https://wangdoc.com/javascript/stdlib/attributes.html#objectdefinepropertyobjectdefineproperties) 的属性描述对象章节; 这里我用它的存值函数 set 来对 data.value 进行处理

```
<a-select
    centered
    default-value="lucy"
    style="width: 120px"
    v-model="data.value"
    >
    <a-select-option value="上海"> 上海测试 </a-select-option>
    <a-select-option value="河南"> 河南测试 </a-select-option>
    <a-select-option value="深圳">深圳测试</a-select-option>
</a-select>

methods: {
   initProxy() {
      let _this = this

      Object.defineProperty(this.data, "value", {
        set: function (value) {
          _this.$confirm({
            title: "确认要切换么?",
            content: "切换经销商将重新载入页面数据",
            mask: false,
            onOk() {
              return value
            },
            onCancel() {},
          });
        },
      })
  },
  
  mounted() {
    this.initProxy()
  }
```

#### Proxy 拦截

Proxy 可以对 a-select 的 value 进行拦截，然后修改其默认行为，这和直接修改 value 不同；等同于在语言层面做出修改，属于一种“元编程”（meta programming），即对编程语言进行编程。

具体语法可看下这本书: [ECMAScript6 入门](https://es6.ruanyifeng.com/#docs/proxy) 的 proxy 章节，这里不多介绍了，还是直接上代码：

```
<a-select
    centered
    default-value="lucy"
    style="width: 120px"
    v-model="data.value"
    >
    <a-select-option value="上海"> 上海测试 </a-select-option>
    <a-select-option value="河南"> 河南测试 </a-select-option>
    <a-select-option value="深圳">深圳测试</a-select-option>
</a-select>

  methods: {
    initProxy() {
      let _this = this;
      this.data = new Proxy(
        { value: "上海" },
        {
          set: function (target, propKey, value) {
            return _this.$confirm({
              title: "确认要切换么?",
              content: "切换经销商将重新载入页面数据",
              mask: false,
              onOk() {
                target["value"] = value
              },
              onCancel() {},
            })
          },
        }
      )
    },
  },
  
  mounted() {
    this.initProxy()
  },
```

利用 v-model 的双向绑定特性，结合 proxy 对其 data.value 进行拦截; v-model 默认是只支持 input 事件的，ant-design-vue 的源码中用 model 选项重写了 v-model 指令，将其触发条件修改为 change。

```
  model: {
    prop: 'value',
    event: 'change'
  }
```

以上三种方案都可以实现我们要的效果，至于哪种更好其实这个地方谈不上，因为这个需求还不足够复杂还体验不出它们的差异。

### 总结

今天通过一个 select 拦截的需求，给大家讲解了 事件传递、Object.defineProperty、proxy 相关知识的应用，不知你有没有发现，这些貌似工具库里才经常用到的特性，原来也可以很好的服务于日常业务开发，是不是一件很 cool 的事呢？看后你有收获吗？

---

更新：2022-2-27 19:20

我上面理解的复杂了，评论里大兄弟说的对，只要你不用 v-model 就没这个问题了，直接绑定 value, 然后在 change 事件里是可以拦截的。。

---

合集：[我的 github 博客及案例源代码](https://github.com/mingjiezhou/notes/issues)