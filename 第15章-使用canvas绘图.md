目标
	1. 理解<canvas>元素
	2. 绘制简单的2d图形
	3. 使用WebGL绘制3D图形

## 15.1 基本用法

> 使用canvas元素，需要先设置其width和height，指定可以绘图的大小，出现在开始和结束标签中的内容是后备信息，如果浏览器不支持canvas元素就会显示这些信息。

``` html
<canvas id="drawing" width="200" height="200"></canvas>

```

与其他元素一样，canvas对象的DOM元素也有width和height属性，可以随意修改，而且也可以通过css为该元素添加样式(**与直接在html指定width和height有什么不同呢？**)，如果不添加任何样式或者不绘制图形，在页面中是看不到该元素的。

要在这块画布上绘图，需要取得绘图上下文。并通过`getContext()`方法传入上下文的名字`2d`。

``` javascript
let drawing = document.getElementById('drawing')

// 如果确定支持canvas元素
if (drawing.getContext) {
	let ctx = drawing.getContext()
}

```

如上代码，在使用canvas元素之前需要先检测getContext方法是否存在，在有些浏览器中会HTML规范之外的元素创建默认的HTML元素对象，在这种情况中，虽然保存着一个有效的元素引用，也检测不到getContext方法。

使用toDataURL方法，可以导出在canvas元素上绘制的图像，这个方法接收一个参数，即图像的MIME类型格式，而且适合用于创建图像的任何上下文，比如，要取得画布中的一幅PNG格式的图像，可以使用以下代码。

``` javascript
let drawing = document.getElementById('drawing')

if (drawing.getContext) {
	let imgURL = drawing.toDataURL('image/png')
	let image = document.createElement('img')
	image.src = imgURL
	document.body.appendChild(image)
}

```

**注意： 如果绘制到画布上的图像源自不同的域，toDataURL方法会抛出错误**



