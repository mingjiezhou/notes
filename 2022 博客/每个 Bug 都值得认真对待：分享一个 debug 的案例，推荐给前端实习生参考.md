  
![每个 Bug 都值得认真对待：分享一个 debug 的案例，推荐给前端实习生参考](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7b6dd7649884f958b6e3fe813c0e3d4~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?)

## 前言

最早听说 wangEditor 编辑器还是在 17 年，当时读王福朋大佬的 [深入理解javascript原型和闭包](https://link.juejin.cn/?target=https%3A%2F%2Fwww.cnblogs.com%2Fwangfupeng1988%2Fp%2F3977924.html "https://www.cnblogs.com/wangfupeng1988/p/3977924.html") 时提到的，作为国产开源项目，历经近十年依然在不断的技术迭代并使用 ts vdom 重构，真的很强。 近期有个文字编辑需求，用 textarea 效果总是不尽如人意，于是就上了富文本编辑器。

## Bug 初现

首先安装下面两个包：

```perl
"@wangeditor/editor": "^5.1.0",
"@wangeditor/editor-for-vue": "^1.0.2",然后浅看下文档：
复制代码
```

这种项目一般是不依赖框架的，不过为了方便用户使用，官方还提供了 vue、react 组件，本着能不动手尽量 copy 的原则，我们用他的 vue 组件，然后意料之外的出现了警告：

```bash
vue.esm.js?4f66:5023 [Vue warn]: $attrs is readonly

vue.esm.js?4f66:5023 [Vue warn]: $listeners is readonly

复制代码
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21b80f68347d4444893fd7212dbb0088~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

这个警告虽然目前看来并没有造成流程阻断，但确是个很大的隐患，一定要在上线前 debug 掉。

## Debug & 修复

首先让我们熟练的打开 谷歌🦴，输入`vue.esm.js?4f66:5023 [Vue warn]: $attrs is readonly` 或者 `vue.esm.js?4f66:5023 [Vue warn]: $listeners is readonly`都行

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdf9477a871049aabf7ef1a97e3c917b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f60e1c70bb4647acacf4fb5ec41f116e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

很顺利的就初步定位到了原因，很可能是由于 `@wangeditor/editor-for-vue` 组件内部引入的 vue 版本和我们项目本地的不同导致的冲突；为了确认是这个原因，让我们找到它的源码，从中看到它竟然使用的是 `vue2.7.5` 的版本，竟然是跟 vue 官方同步的节奏，然而我的项目中 vue 还是 `2.6.14` 的版本，看来是这个原因引起的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c07675c291b4f29891c2466e04c95db~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db25d534414b47efaa8b322e64f37e5e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

解决方案：使 vue 版本保持一致即可，为了这个小插件来升级我的项目 vue 版本不太合适，还是降级下吧，看了下它的版本更新记录，发现固定到 `1.0.0` 的版本即可，从 package.json 中把这俩插件版本锁定

```perl
"@wangeditor/editor": "5.1.0",
"@wangeditor/editor-for-vue": "1.0.0"
复制代码
```

重新装包，启动，发现已经不再报警告了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fea7d86fbb22448cafd30b5d4c4dc04d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 思考

### 为什么引入两个不同的 vue版本，会出现这个警告呢？

虽然这只是个小小的 bug, 不过其背后的执行逻辑还是引起了我的好奇，为什么引入两个不同的 vue版本，会出现这个警告呢？让我们从源码中来寻找答案：🤔

```php
// js 中相关代码

// 此变量默认为 false
var isUpdatingChildComponent = false;

// 渲染函数
function initRender (vm) {

  /* istanbul ignore else */
  {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);

    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
    ...
  }
}

}

// 关键
function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key) ||
    (!newScopedSlots && vm.$scopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}
复制代码
```

从上面找到的相关代码，可以看到，updateChildComponent 函数负责给 `$attrs`、`$listener` 属性赋值, isUpdatingChildComponent 变量默认为 false, 处理前将 isUpdatingChildComponent 置为true,在处理完成后 isUpdatingChildComponent 置为false。

根据 `initRender` 函数中的判断条件 ​`!isUpdatingChildComponent && warn("$attrs is readonly.", vm)`就明白了，只有在更新子组件的时候，�����/attrs/listeners 是可写的，否则都会报 `$attrs/$listeners is readonly` 的警告错误, 而当 `@wangeditor/editor-for-vue` 插件运行的时候，其内部重新加载了 vue, 导致 isUpdateChildComponent 被重置成 false 了, 因此 initRender 执行时出现 `$attrs/$listeners is readonly` 的错误警告。

### listeners 和 attrs 又是什么 api 呢？

> listeners 定义： 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。

> attrs 定义： 包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。

大多数同学们对这两个 api 都不是很熟悉，因为日常真的不常用到，从官网可以看到，这两个 api 是从 2.4.0 版本开始新增的，一般都是创建高阶组件时候可能会用到，日常的组件传值是不建议用的，会影响代码的可读性。

下面我以伪代码为例来讲解下它俩的实际用法：

```javascript
// parent.vue 父组件中给 index 组件传值 定义了2个 prop
<index age=18 name='zhou'></index>

// index.vue
<index>
    {{age}} // index.vue 只用了 age,那么 name 等其余属性就可以通过 attrs 的形式传给 son 组件使用
    <son v-bind="$attrs" @click="age++"></son> // v-on 定义的事件都可以在son 中通过 $listeners 监听到
</index>

// son.vue
mounted() {
    console.log(this.$attrs) // {name: 'zhou'}
    console.log(this.$listeners) // {click: f}
}
复制代码
```

好了，以上就是本文的全部内容了，希望这个 debug 的过程和思路对你有那么点帮助吧。

---

提一嘴吧：这篇是前些日子写的，不慎删除无备份找不回了，郁闷良久，昨日无意中发现该文章当初被人爬走了，哭笑不得，算是因祸得福，得以再次发表。