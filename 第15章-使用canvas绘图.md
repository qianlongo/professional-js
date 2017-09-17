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


## 15.2 2D上下文

> 使用2D绘图上下文提供的方法，可以绘制简单的2D图形，比如矩形，弧线和路径。2D上下文的坐标开始于canvas元素的左上角，原点是(0, 0)，所有的坐标值都基于这个原点计算，x值越大表示跃靠右，y值越大表示越靠下，默认情况下，width和height表示水平和垂直方向上可用的像素数目。

15.2.1 填充和描边

> 2D上下文的两种基本绘图操作是填充和描边，填充即使用指定的样式（颜色，渐变，或图像）填充图形，描边就是只在图形的边缘画线。大多数2D上下文操作都会细分为填充和描边两个操作，而操作的结果取决于两个属性，fillStyle和strokeStyle

**需要注意的是这两个属性的值都可以是字符串，渐变对象或模式对象，而且默认的值都是“#000000”，如果为他们指定表示颜色的字符串，可以使用css中指定颜色值的任何格式，包括颜色名，十六进制码，rgb，rgba，hsl和hsla**


下面是一个简单的例子

``` javascript
let $drawing = document.getElementById('drawing')
let ctx = $drawing.getContext && $drawing.getContext()

if (ctx) {
	ctx.strokeStyle = 'red'
	ctx.fillStyle = '#0000ff'
}

```

所有涉及描边和填充的操作都将使用这两个样式，直至重新设置这两个值，这两个属性的值也可以是渐变对象和模式对象。

## 15.2.2 绘制矩形

> 矩形是唯一一种可以直接到2D的上下文中绘制的形状，与矩形有关的方法包括`fillRect`,`strokeRect`,`clearRect`这三个方法都可以接受4个参数，矩形的x坐标，矩形的y坐标，矩形的宽度和句型的高度。这些参数的单位都是像素。

fillRect方法在画布上绘制的矩形会填充指定的颜色，填充的颜色通过fillStyle属性指定。比如：

```javascript

let $drawing = document.getElementById('drawing')
let ctx = $drawing.getContext && $drawing.getContext()

if (ctx) {
	// 绘制红色的矩形
	ctx.fillStyle = '#ff0000'
	ctx.fillRect(10, 10, 50, 50)
	// 绘制半透明的矩形
	ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
	ctx.fillRect(30, 30, 50, 50)
}

```


