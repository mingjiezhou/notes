## 一、介绍

JavaScript 原生提供了数组类型，但是却没有链表，虽然平常的业务开发中，数组是可以满足基本需求，但是链表在大数据集操作等特定的场景下明显具有优势，那为何 JavaScript 不提供链表类型呢？怎么实现一个完整可用的链表呢？

**数组的特点**

1.  线性结构，顺序存储
2.  插入慢，查找快
3.  查找、更新、插入、删除，的时间复杂度分别为，O(1)、O(1)、O(n)、O(n)

**链表的特点**

1.  线性结构，随机存储（省内存）
2.  插入快，查找慢
3.  查找、更新、插入、删除，的时间复杂度分别为，O(n)、O(1)、O(1)、O(1)

## 二、单链表

talk is easy, show the code, 下面用 JavaScript 实现一个相对完整的单链表，并提供以下方法供调用：

1.  push(element) // 链表尾部插入节点
2.  pop() // 链表尾部删除节点
3.  shift() // 删除头部节点、
4.  unshift(element) // 插入头部节点
5.  find(index) // 查找指定位置节点
6.  insert(element, index) // 指定位置插入节点
7.  edit(element, index) // 修改指定位置节点
8.  delete(index) // 链表删除指定位置节点
9.  cycle() // 使链表首尾成环
```kotlin
function initList() {
    class Node {
        constructor(item) {
            this.element = item
        }
    }
    class List {
        constructor() {
            this.head = null
            this.size = 0
            this.last = null
        }
        /**
        * 链表查找元素
        * @param index 查找的位置
        */
        find(index) {
            let current = this.head
            for (let i = 0; i < index; i++) {
                current = current.next
            }
            return current
        }
        /**
        * 链表尾部插入元素
        * @param element 插入的元素
        */
        push(element) {
            let newNode = new Node(element)
            if (this.size === 0) {
                this.head = newNode
                this.head.next = null
                this.last = this.head
            } else {
                this.last.next = newNode
                this.last = newNode
                newNode.next = null
            }
            this.size += 1
        }
        /**
        * 链表尾部删除元素
        * @param element 删除的位置
        */
        pop(element) {
            this.last.next = null
        }
        /**
        * 链表头部删除元素
        */
        shift() {
            if (this.size === 0)
                return
            this.head = this.head.next
            if (this.size === 1)
                this.last = null
            this.size -= 1
        }
        /**
        * 链表头部插入元素
        * @param element 插入的元素
        */
        unshift(element) {
            let newNode = new Node(element)
            newNode.next = this.head
            this.head = newNode
            if (this.size === 0)
                this.last = this.head
            this.size += 1
        }
        /**
        * 链表插入元素
        * @param element 插入的位置, index 插入的位置
        */
        insert(element, index) {
            if (index < 0 || index > this.size) {
                console.error('超出链表节点范围')
                return
            }
            let newNode = new Node(element)
            if (this.size === 0) {
                // 空链表
                newNode.next = null
                this.head = newNode
                this.last = newNode
            } else if (index === 0) {
                // 插入头部
                newNode.next = this.head
                this.head = newNode
            } else if (index == this.size) {
                //插入尾部
                newNode.next = null
                this.last.next = newNode
                this.last = newNode
            } else {
                // 中间插入
                let preNode = this.find(index - 1)
                newNode.next = preNode.next
                preNode.next = newNode
            }
            this.size += 1
        }
        /*
        *链表编辑元素
        * @param element 编辑的元素，index 元素位置
        */
        edit(element, index) {
            let current = this.find(index)
            current.element = element
        }
        /*
        *链表删除元素
        * @param index 删除元素位置
        */
        delete(index) {
            let current = this.find(index)
            if (index === 0) {
                // 删除头节点
                this.head = this.head.next
            } else if (index === ((this.size) - 1)) {
                // 删除尾节点
                let preNode = this.find(index - 1)
                preNode.next = null
            } else {
                // 删除中间节点
                let preNode = this.find(index - 1)
                let nextNode = preNode.next.next
                let removeNode = preNode.next
                preNode.next = nextNode
            }
            this.size -= 1
        }
        /*
        *链表使首尾成环
        */
        cycle() {
            this.last.next = this.head
        }
    }
    return new List()
}

let list = initList()复制代码
```

## 三、双向链表

双向链表的特点就是添加了指向上一个节点的指针（prev)，比较单链表来说，稍微复杂一些，也更强大，这里把上面的单链表修改一下。

```kotlin
function initList() {
    class Node {
        constructor(item) {
            this.element = item
            this.next = null
            this.prev = null
        }
    }
    class List {
        constructor() {
            this.head = null
            this.size = 0
            this.last = null
        }
        /**
        * 链表查找元素
        * @param index 查找的位置
        */
        find(index) {
            let current = this.head
            for (let i = 0; i < index; i++) {
                current = current.next
            }
            return current
        }
        /**
        * 链表尾部插入元素
        * @param element 插入的元素
        */
        push(element) {
            let newNode = new Node(element)
            if (this.size === 0) {
                this.head = newNode
                this.head.next = null
                this.last = this.head
            } else {
                this.last.next = newNode
                newNode.next = null
                newNode.prev = this.last
                this.last = newNode
            }
            this.size += 1
        }
        /**
        * 链表尾部删除元素
        * @param element 删除的位置
        */
        pop() {
            if (this.size === 0)
                return
            if (this.size === 1) {
                this.head = null
                this.last = null
            } else {
                this.last.prev.next = null
                this.last = this.last.prev
            }
            this.size -= 1
        }
        /**
        * 链表头部删除元素
        */
        shift() {
            if (this.size === 0)
                return
            if (this.size === 1) {
                this.head = null
                this.last = null
            } else {
                this.head = this.head.next
                this.head.prev = null
            }
            this.size -= 1
        }
        /**
        * 链表头部插入元素
        * @param element 插入的元素
        */
        unshift(element) {
            let newNode = new Node(element)
            if (this.size === 0) {
                this.head = newNode
                this.head.next = null
                this.last = this.head
            } else {
                this.head.prev = newNode
                newNode.next = this.head
                this.head = newNode
            }
            this.size += 1
        }
        /**
        * 链表插入元素
        * @param element 插入的位置, index 插入的位置
        */
        insert(element, index) {
            if (index < 0 || index > this.size) {
                console.error('超出链表节点范围')
                return
            }
            let newNode = new Node(element)
            if (this.size === 0) {
                // 空链表
                this.head = newNode
                this.head.next = null
                this.last = this.head
            } else if (index === 0) {
                // 插入头部
                this.head.pre = newNode
                newNode.next = this.head
                this.head = newNode
            } else if (index == this.size - 1) {
                //插入尾部
                newNode.next = null
                newNode.prev = this.last
                this.last.next = newNode
                this.last = newNode
            } else {
                // 中间插入
                let prevNode = this.find(index - 1)
                newNode.next = prevNode.next
                prevNode.next = newNode
                newNode.prev = prevNode
                newNode.next.prev = newNode
            }
            this.size += 1
        }
        /*
        *链表编辑元素
        * @param element 编辑的元素，index 元素位置
        */
        edit(element, index) {
            let current = this.find(index)
            current.element = element
        }
        /*
        *链表删除元素
        * @param index 删除元素位置
        */
        delete(index) {
            let current = this.find(index)
            if (index === 0) {
                // 删除头节点
                this.head = this.head.next
                this.prev = null
            } else if (index === ((this.size) - 1)) {
                // 删除尾节点
                let preNode = this.find(index - 1)
                preNode.next = null
            } else {
                // 删除中间节点
                let preNode = this.find(index - 1)
                let nextNode = preNode.next.next
                let removeNode = preNode.next
                preNode.next = nextNode
                nextNode.prev = preNode
            }
            this.size -= 1
        }
        /*
        *链表使首尾成环
        */
        cycle() {
            this.last.next = this.head
            this.head.prev = this.last
        }
    }
    return new List()
}
let list = new initList()复制代码
```

## 三、循环链表

循环链表可以是单链表也可以是双向链表，它的特点是最后一个节点的 next 指针指向的是 head 节点 而不是 null，上面代码已经提供了 cycle 方法来实现。

## 四、判断链表有环

主要有这些方法：

1.  遍历链表，使每一个节点与之前节点比较，若有重复则为有环链表
    
2.  定义一个 Map 对象，遍历链表到每一个节点，若 Map 中没有次节点 ID，则将节点 ID 为 key, 存入 Map ，每个节点判断一次，如果某个节点的 ID存在，证明链表成环
    
3.  双指针法，举个例子来说，两个人在操场跑步，速度不同时，总会在某些时刻相遇，就是因为跑到是圆的（环），利用这个原理，定义一个循环和两个指向头节点的指针，一个每次移动一个节点，一个移动两个节点，如果是成环的链表，某个时刻必然会遇到同一个节点。
    

## 五、链表在前端开发中的应用

1.  链表的特性表明其擅长修改，不擅查找，所以对于需要大量修改的操作，可以考虑用链表实现，但是前端往往处理的数据量不会大，所以这种场景的实际意义不是很大，个人感觉在框架的底层优化上，使用较多，业务开发中，数组够用。
    
2.  链表因为是随机存储的，所以比较省内存，但是对动态语言 JavaScript 解释器来说，有自动的垃圾回收机制来管理内存，所以链表的这个优势就不明显了。
    
3.  链表特殊的结构，感觉适合做轮播图（双向循环链表）、双向导航列表等
    

分类：

[前端](/frontend)

标签：

[数据结构](/tag/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)

  

作者：Ethan_Zhou  
链接：https://juejin.cn/post/6844903952123691022  
来源：稀土掘金  
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。