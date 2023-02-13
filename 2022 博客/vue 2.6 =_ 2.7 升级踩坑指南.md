## 前言

7月1号，尤大在博客上宣布了 vue2.7 版本的正式发布，这对于 vue2 版本的用户来说绝对是一个利好消息，不需要大刀阔斧的重构就能体验到 vue3 中的核心特性了；

> 尽管 Vue 3 现在是默认版本，但我们了解到仍有许多用户由于依赖兼容性、浏览器支持要求或根本没有足够的带宽升级而不得不留在 Vue 2。在 Vue 2.7 中，我们从 Vue 3 向后移植了一些最重要的功能，以便 Vue 2 用户也可以从中受益。[Vue 2.7 “Naruto” Released | The Vue Point](https://blog.vuejs.org/posts/vue-2-7-naruto.html)

## 升级流程
## package.json 配置升级

注意我的项目基础架构是 webpack 5 + vue 2.6, 没有使用 vue-cli 脚手架哦，以下升级步骤都基于此架构；首先将 node_modules 和 lock.json 文件都删除，修改一下配置，然后重新安装。

1. vue-template-compiler 可以删掉了，因为 vue 2.7 中不再需要它
2. eslint-plugin-vue 需要升级到 9
```javascript
// "vue": "^2.6.14",
"vue": "^2.7.8",
  
// "vue-template-compiler": "^2.6.14",
  
// "eslint-plugin-vue": "^8.6.0",
"eslint-plugin-vue": "^9.0.0",
```

## 踩坑：升级过程中遇到的 bug
### [webpack-cli] Error: Cannot find module 'ajv/dist/compile/codegen'
![截屏2022-08-09 09.50.44.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1660023488584-57b202e6-677a-499b-b3e7-8e0155cc4a77.png#clientId=u6ea32a9f-5d18-4&from=ui&height=206&id=u78316411&name=%E6%88%AA%E5%B1%8F2022-08-09%2009.50.44.png&originHeight=212&originWidth=618&originalType=binary&ratio=1&rotation=0&showTitle=false&size=41417&status=done&style=none&taskId=udf91c807-22e9-4750-94fa-2ab498b4fe7&title=&width=600)
分析： ajv 是一个  JSON schema 的模式验证工具（[文档](https://ajv.js.org/)），不知道为何 vue2.7 会依赖这个，先不管，我们安装一下试试；
```javascript
npm install --save-dev ajv@^7
```
装好这个包后发现这个报错消失了。
### Cannot read properties of undefined (reading 'replace')
### ![截屏2022-08-09 13.32.22.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1660023500690-beefc554-8d78-4b11-8f0d-7e84386e0281.png#clientId=u6ea32a9f-5d18-4&from=ui&id=ufbd464fc&name=%E6%88%AA%E5%B1%8F2022-08-09%2013.32.22.png&originHeight=307&originWidth=681&originalType=binary&ratio=1&rotation=0&showTitle=false&size=62850&status=done&style=none&taskId=ud5a935bc-ba6f-43a0-a262-cecf33d02a1&title=)

这个错误最终发现是 node-sass 的版本问题导致的，因为我项目中同时使用了 less、sass, 升到 2.7 后，发现 sass 无法使用了，怀疑是版本问题，尝试升级 node-sass 到 7.0.1, 问题解决。

```javascript
npm install node-sass@7.0.1
```

注意 node-sass 依赖的 node 版本至少要 14+，否则找不到包。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28919253/1660023824015-fbe3f796-a7da-48c6-b4b9-b142e5e6d250.png#clientId=u6ea32a9f-5d18-4&from=paste&height=336&id=u38dd34b7&name=image.png&originHeight=295&originWidth=600&originalType=binary&ratio=1&rotation=0&showTitle=false&size=111469&status=done&style=none&taskId=uc3cba2fc-c96c-41ed-b3b5-a9ba725cc3d&title=&width=683)
## 踩坑：基于 vue 2.7 新特性编写页面 | 语法转换
### 组合式 API 基本用法
组合式 API (Composition API) 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。它是一个概括性的术语，涵盖了以下方面的 API：

- [响应式 API](https://cn.vuejs.org/api/reactivity-core.html)：例如 ref() 和 reactive()，使我们可以直接创建响应式状态、计算属性和侦听器。
- [生命周期钩子](https://cn.vuejs.org/api/composition-api-lifecycle.html)：例如 onMounted() 和 onUnmounted()，使我们可以在组件各个生命周期阶段添加逻辑。
- [依赖注入](https://cn.vuejs.org/api/composition-api-dependency-injection.html)：例如 provide() 和 inject()，使我们可以在使用响应式 API 时，利用 Vue 的依赖注入系统。

个人最直观的感受是没有 this 对象了，更接近函数式编程的写法，更加简洁了。

基本写法示例
```javascript
<template>
  <div>
  {{data.age}}
  {{data.name}}
  <button @click="increment">点击了：{{ count }} 次</button>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  // ref() 可以接受任何值类型。ref 会返回一个包裹对象，并在 .value 属性下暴露内部值,而在模板中访问 ref 定义的变量时不需要使用 .value
  const count = ref(0)
  
  // reactive 只适用于对象 (包括数组和内置类型，如 Map 和 Set)，可以这样写，通过 data.‘propertyName’ 来访问和修改
  const data = reactive({
    age: 18,
    name: 'ethan'
  })
  
  // 更改状态、触发更新的函数
  function increment() {
    count.value++
  }
  
  // 生命周期钩子
  onMounted(() => {
    console.log(`计数器初始值为 ${count.value}。`)
  })
</script>
```

### 组件无需注册

在使用 `<script setup>` 的单文件组件中，导入的组件可以直接在模板中使用，无需注册了；

### 挂载在 Vue.prototype 原型上的方法怎么调用

因为使用 setup, 获取不到 this 对象了，所以挂载在 vue prototype 上的方式调用失败，此时可以使用 getCurrentInstance，不过不推荐；

```javascript
// proxy 可以代替 this 使用
const { proxy } = getCurrentInstance()
proxy.$toast()
```

### 路由使用
参考上面，新的 proxy 对象，proxy.$router.push()

### 计算属性的用法
计算属性在组合式 API 中，以一个函数的形式来使用

```javascript
const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])
const filteredTodos = computed(() => {
  // 根据 `todos.value` & `hideCompleted.value`
  // 返回过滤后的 todo 项目
})
```

### 监听器的用法
```javascript
watch(count, (newCount) => {
  console.log(`new count is: ${newCount}`)
})
```

### Props 的使用

组合式API中可以通过 defineProps 方法来定义 props, 注意 defineProps() 是一个编译时宏，并不需要导入,一旦声明，msg prop 就可以在子组件的模板中使用。它也可以通过 defineProps() 所返回的对象在 JavaScript 中访问。
```javascript
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>


<ChildComp :msg="greeting" />
```

### Emits 的使用

组合式API中的emits 使用相比vue2.6 来说多了一个生命的过程，需要通过 defineEmits 方法来声明 emits

```javascript
<script setup>
// 声明触发的事件
const emit = defineEmits(['response'])

// 带参数触发
emit('response', 'hello from child')
</script>
```

### vuex 的使用

组合式API 写法中，mapState 等 vuex 的写法不再支持了，没找到特别好的方案，暂时当成普通 js 文件中那样用；

```javascript
import store from '@/store/index';

// state
store.state.moduleName.stateName

//actions
store.dispatch("moduleName/actionName", paramsObj);
```

## 总结

升级过程总体还是顺利的，主要就是几个包的 版本问题，升级后除了 :deep 需要更换写法外，之前的代码基本上不用改动, 后面基于 2.7，我们可以逐步过渡到组合式 API 的写法上去了。
当然像 vuex 这种貌似在 2.7 中，没有之前使用方便了，这个暂时没有找到啥好的办法。


