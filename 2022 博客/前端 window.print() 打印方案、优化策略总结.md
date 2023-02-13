近期拿到一个需求，里面涉及到网页打印，本来以为执行浏览器自带的 window.print() 方法调取打印控件就好了，没想到事情并非那么简单, 打印预览中不仅样式不对，连内容都无法展示全，多页的内容只显示了一页，这明显无法满足项目需求啊！

于是研究了下相关的优化方案，整理如下：

## window.print() 默认效果缺陷

1.打印控件默认没给分页，就只显示了一页

2.dom 布局和样式很容易发生错位、丢失

3.我想要局部打印，但默认是获取的整个 body.innerHtml 的内容

## 打印样式

这种方式是通过增加针对打印机及预览才识别的css代码来调整效果，css 引入的方式有下面几种

### 样式加载

1.  `<link rel="stylesheet" href="" media="print">`
2.  [@import](https://github.com/import) url print

```
概述
    @import CSS@规则，用于从其他样式表导入样式规则。这些规则必须先于所有其他类型的规则，@charset 规则除外; 因为它不是一个嵌套语句，@import不能在条件组的规则中使用。
    
    因此，用户代理可以避免为不支持的媒体类型检索资源，作者可以指定依赖媒体的@import规则。这些条件导入在URI之后指定逗号分隔的媒体查询。在没有任何媒体查询的情况下，导入是无条件的。指定所有的媒体具有相同的效果。
    
    语法
    @import url;
    @import url list-of-media-queries;
```

3.style 内联样式，注意依然要配置 media="print"  
4.通过媒体查询 [@media](https://github.com/media)

### 去除页眉页脚

```
  <style>
    @media print {
      @page {
        margin: 0; // 可以控制打印布局（四周边距）
      }
      body {
        border: 1px solid #999;
      }
    }
  </style>
```

[![截屏2022-03-03 16 14 17](https://user-images.githubusercontent.com/37775265/156685939-3f0bfd6c-e17f-4ea5-a43b-28b587a52ca1.png)](https://user-images.githubusercontent.com/37775265/156685939-3f0bfd6c-e17f-4ea5-a43b-28b587a52ca1.png)

[@page 介绍](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@page)

[@page](https://github.com/page) 规则用于在打印文档时修改某些CSS属性。你不能用[@page](https://github.com/page)规则来修改所有的CSS属性，而是只能修改margin,orphans,widow 和 page breaks of the document。对其他属性的修改是无效的。

```
@page {
  margin: 1cm;
}

@page :first {
  margin: 2cm;
}
```

### 控制分页

page-break-before: 控制在指定元素前是否分页

page-break-after: 控制在指定元素后是否分页

page-break-inside 控制指定元素中是否可以插入分页符

可选参数： always | auto | avoid | left | right | inherit

示例：

```
  <style>
    @media print {
      @page {
        margin: 0;
      }
      body {
        border: 1px solid #999;
      }
      p {
        page-break-after: always;
      }
    }
  </style>
```

[![2022-03-04 10-06-46 2022-03-04 10_07_55](https://user-images.githubusercontent.com/37775265/156686040-0e081a57-dc65-4e8c-afb1-c1307be3b1a4.gif)](https://user-images.githubusercontent.com/37775265/156686040-0e081a57-dc65-4e8c-afb1-c1307be3b1a4.gif)

## 封装 print.js 实现局部打印

既然打印的是 body 里的内容，那么我们可以手动创建一个 dom 元素，当执行 print() 时替换掉 body, print() 有两个生命周期勾子函数，分别是 beforeprint 和 afterprint, 在打印前替换dom 以实现打印我想要的 dom， 打印后重新恢复之前的 dom 就好了。

这种 github 上找了个案例，测试了下

```javaScript
// https://github.com/xyl66/vuePlugs_printjs/blob/master/print.js

// 打印类属性、方法定义
/* eslint-disable */
const Print = function (dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options);

  this.options = this.extend({
    'noPrint': '.no-print'
  }, options);

  if ((typeof dom) === "string") {
    this.dom = document.querySelector(dom);
  } else {
    this.isDOM(dom)
    this.dom = this.isDOM(dom) ? dom : dom.$el;
  }

  this.init();
};
Print.prototype = {
  init: function () {
    var content = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  },
  extend: function (obj, obj2) {
    for (var k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },

  getStyle: function () {
    var str = "",
      styles = document.querySelectorAll('style,link');
    for (var i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";

    return str;
  },

  getHtml: function () {
    var inputs = document.querySelectorAll('input');
    var textareas = document.querySelectorAll('textarea');
    var selects = document.querySelectorAll('select');

    for (var k = 0; k < inputs.length; k++) {
      if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute('checked', "checked")
        } else {
          inputs[k].removeAttribute('checked')
        }
      } else if (inputs[k].type == "text") {
        inputs[k].setAttribute('value', inputs[k].value)
      } else {
        inputs[k].setAttribute('value', inputs[k].value)
      }
    }

    for (var k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type == 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value
      }
    }

    for (var k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type == 'select-one') {
        var child = selects[k3].children;
        for (var i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true) {
              child[i].setAttribute('selected', "selected")
            } else {
              child[i].removeAttribute('selected')
            }
          }
        }
      }
    }
    // 包裹要打印的元素
    // fix: https://github.com/xyl66/vuePlugs_printjs/issues/36
    let outerHTML = this.wrapperRefDom(this.dom).outerHTML
    return outerHTML;
  },
  // 向父级元素循环，包裹当前需要打印的元素
  // 防止根级别开头的 css 选择器不生效
  wrapperRefDom: function (refDom) {
    let prevDom = null
    let currDom = refDom
    // 判断当前元素是否在 body 中，不在文档中则直接返回该节点
    if (!this.isInBody(currDom)) return currDom

    while (currDom) {
      if (prevDom) {
        let element = currDom.cloneNode(false)
        element.appendChild(prevDom)
        prevDom = element
      } else {
        prevDom = currDom.cloneNode(true)
      }

      currDom = currDom.parentElement
    }

    return prevDom
  },

  writeIframe: function (content) {
    var w, doc, iframe = document.createElement('iframe'),
      f = document.body.appendChild(iframe);
    iframe.id = "myIframe";
    //iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";
    iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;');
    w = f.contentWindow || f.contentDocument;
    doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    var _this = this
    iframe.onload = function(){
      _this.toPrint(w);
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 100)
    }
  },

  toPrint: function (frameWindow) {
    try {
      setTimeout(function () {
        frameWindow.focus();
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
      }, 10);
    } catch (err) {
      console.log('err', err);
    }
  },
  // 检查一个元素是否是 body 元素的后代元素且非 body 元素本身
  isInBody: function (node) {
    return (node === document.body) ? false : document.body.contains(node);
  },
  isDOM: (typeof HTMLElement === 'object') ?
    function (obj) {
      return obj instanceof HTMLElement;
    } :
    function (obj) {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
};
const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  // 4. 添加实例方法
  Vue.prototype.$print = Print
}
export default MyPlugin
```

其 100 多行就实现了刚才描述的效果，但是功能比较简单，不支持配置一些常用参数如自定义样式覆盖，而且我发现一个 bug,就是默认就给显示了 2 页，而此时内容其实很少，导致又一个空白页；不过可以在这个基础上拓展一下，还是不错的。

## CLODOP 打印控件

据说功能很强大可以静默打印，但是不支持 mac系统，pass [官网](http://www.lodop.net/)

## 终极方案：printJS

这是我最终选定的方案，和上面那个简陋的js 封装函数相比，其提供了更多的功能配置，并可支持 pdf、html、image、json、raw-html 打印。

[github 地址](https://github.com/crabbly/Print.js)

使用也很简单：

``` JavaScript
npm install print-js --save

// 以vue 为例 main.js 
import printJS from 'print-js'

Vue.prototype.$printJS = printJS

// 以 html 格式为例
// 在vue 文件里直接

this.$printJS({printable: 'elementId',type: 'html', : ['*']})

```

这个方案我在使用的时候也一度遇到了一个bug,是因为我用的 image 格式，基于 [html-to-image](https://github.com/bubkoo/html-to-image) 将网页元素转化为 png 图片，然后使用

```
this.$printJS({printable: image-url,type: 'image'})

```

来打印，用图片打印有个好处，就是样式不会错位，可是出现了一个报错： css的跨域，问题出在html-to-image 插件上，不使用这个插件就没这个bug 了。

css 跨域经常是由于 在js 内部使用了 link 标签引入css 样式，随着浏览器的安全要求越来越严格，现需要在link 上配置 crossOrigin="anonymous"。

还有个问题，我使用了内网 cdn 的情况下，打印预览中 css 样式全部丢失，暂不清楚原因，先放弃cdn 形式使用。

## 总结

网页打印的功能在一些 ims 系统中已经很常见，上面这几个优化方案都是最近遇到后临时研究后的成果，已经满足我们的项目需求，可能还有不足之处，仅可供参考。