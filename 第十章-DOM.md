## DOM

> DOM（文档对象模型），是针对HTML和XML文档的一个API，DOM描述了一个层次化的节点树，允许开发人员`添加`，`移除`,`修改`页面的某一部分。

## 目标

1. 理解包含不同层次节点的DOM
2. 使用不同的节点类型(一般是元素节点，文本节点，文档碎片，文档节点等)
3. 克服浏览器的兼容性问题及各种陷阱

## 节点的类型

> 接下来会简要的总结常见的几种节点类型以及其相关的知识点

## Node类型

> DOM1定义了一个Node借口，所有的元素都有`nodeType`属性，nodeType可取得值有12中，常见和经常用的有以下几种

1. 1 (元素节点)
2. 3 (文本节点)
3. 9 (文档节点)
4. 11 (文档碎片`DocumentFragment`)

## childNodes

> 每个节点都有`childNodes`属性，其保存着一种类数组对象，用于保存一组有序的节点，可以用下标方式去访问，也可以用`item`方法去访问,当然也要注意，childNodes属性有浏览器的兼容问题，ie下只包含其子节点中为元素节点的子元素，其他浏览器则还包括元素节点


``` javascript
var eles = someNode.childNodes
var len = eles.length
var firstChild = ele[0] or eles.item(0)
var lastChild = eles[len - 1] or eles.item(len - 1)

```

## 节点之间的关系

> 节点之间的关系是多样的，两个节点之间可以父子节点，祖孙节点，兄弟节点等等
