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

以上代码先将fillStyle设置为红色，然后从（10， 10）处开始绘制矩形，矩形的宽度和高度均为50像素，然后通过rgba格式将fillStyle设置为半透明的颜色，在第一个矩形上面绘制的第二矩形，结果就是可以透过蓝色的矩形看到红色的矩形。

**strokeRect**

strokeRect方法在画布上绘制的矩形会使用指定的颜色描边，描边的颜色通过strokeStyle指定。

``` javascript
let $drawing = document.getElementById('drawing')
let ctx = $drawing.getContext && $drawing.getContext()

if (ctx) {
	// 绘制红色的矩形
	ctx.fillStyle = '#ff0000'
	ctx.strokeRect(10, 10, 50, 50)
	// 绘制半透明的矩形
	ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
	ctx.strokeRect(30, 30, 50, 50)
}

```

以上代码绘制了两个重叠的矩形，不过这两个矩形都只有框线，内部没有填充颜色。

## 15.2.3 绘制路径

> 2D绘制上下文支持很多在画布上绘制路径的方法，通过路径可以创造出复杂的形状和线条。要绘制路径，首先必须调用`beginPath()`方法，表示要开始绘制新的路径，然后再通过调用以下方法来实际地绘制路径。

1. arc(x, y, radius, startAngle, endAngle, counterclockwise); 以(x, y)为圆心绘制一条弧线，弧线的半径为radius，起始角度和结束角度（用弧度表示）分别为startAngle何endAngle，最后一个参数表示是否按照逆时针方向计算，值为false表示按顺时针计算。

2. arcTo(x1, y1, x2, y2, radius)：从上一点开始绘制一条弧线，到(x2, y2)并且以给定的半径radius穿过(x1, y1)

3. bezierCurveTo(c1x, c1y, c2x, c2y, x, y)： 从上一点开始绘制一条曲线，到(x, y)位置，并且以（c1x, c1y）和（c2x, c2y）为控制点。

4. lineTo(x, y): 从上一点开始绘制一条直线，直到(x, y)为止。

5. moveTo(x, y): 将绘图游标移动到(x, y)，不画线。

6. quadraticCurveTo(cx, cy, x, y): 从上一点开始绘制一条二次曲线，到(x, y)为止。并且以(cx, cy)为控制点。

7. rect(c, y, width, height), 从点(x, y)开始绘制一个矩形，宽度和高度由width和height指定，这个方法绘制的是矩形路径，而不是strokeRect和fillRect所绘制的**独立矩形形状**。

创立了路径后，接下来有几种可能的选择，如果要绘制一条连接到起点的线条，可以调用closePath(),如果路径已经完成，你想用fillStyle填充他，可以调用fill(),另外，还可以调用stroke()方法对路径描边，描边使用的是strokeStyle，最后还可以调用clip，这个方法可以在路径上创建一个剪切区域。

接下来我们要绘制一个不带数字的时钟表盘。

``` javascript
let $drawing = document.getElementById('drawing')
let ctx = $drawing.getContext && $drawing.getContext('2d')

	if (ctx) {
		ctx.beginPath()
		ctx.arc(100, 100, 100, 0, 2 * Math.PI, false)
		ctx.moveTo(190, 100) // 防止画出多余的线
		ctx.arc(100, 100, 90, 0, 2 * Math.PI, false)
		ctx.moveTo(100, 100)
		ctx.lineTo(100, 20)
		ctx.moveTo(100, 100)
		ctx.lineTo(40, 100)
		ctx.stroke()
	}

```

## 15.2.4 绘制文本

> 2d绘图上下文也提供了绘制文本的方法，绘制文本主要有两个方法：fillText()和strokeText()。这两个方法都可以接受4个参数，要绘制的文本字符串，x坐标，y坐标和可选的最大像素宽度。而且这两个方法都以下列3个属性为基础。

1. font: 表示文本样式，大小，以及字体，用css中指定的字体格式来指定例如： "10px Arial"

2. textAlign: 表示文本对齐方式，可能的值有“start”， “end”，“left”，“right”， “center”，建议使用“start”， “end”，不适用“left”，“right”，因为前者的意思更稳妥，能同时适合从左到右，和从右到左的语言。

3. textBaseline： 表示文本的基线，可能的值有“top”， “hanging”， “middle”， “alphabetic”， “ideographic”，“bottom”

这几个属性都有默认值，因此没有必要每次使用它们都重新设置一遍值，fillText()方法使用fillStyle属性绘制文本，strokeText使用strokeStyle属性为文本描边，相对来说，还是使用fillText的时候更多，因为该方法模仿了在网页中正常显示文本。

接下来我们接着上面的例子绘制数字。

``` javascript

	ctx.font = 'bold 14px Arial'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillText('12', 100, 20)
	ctx.textAlign = 'start'
	ctx.fillText('12', 100, 40)
	ctx.textAlign = 'end'
	ctx.fillText('12', 100, 60)

```
注意：将textAlign设置为“center”，把textBaseline设置为“middle”，所以坐标为(100, 20)表示的是文本水平和垂直重点的坐标，如果将textAlign设置为“start”，则x坐标表示的是文本左端的位置（从左到右的语言），设置为“end”，则x坐标表示的是文本右端的位置.

**measureText**

当需要将文本控制在某一区域中的时候，2D上下文提供了辅助确定文本大小的方法measureText(),这个方法接收一个参数，即要回执的文本，返回一个textMetrics对象，返回的对象只有一个width属性，并且该方法是利用font，textAlign和textBaseline的当前值计算指定的文本的大小。比如，假设你想在一个140像素宽的矩形区域中绘制文本，Hello world！下面的代码从100像素的字体大小开始递减，最终会找到合适的字体大小。


``` javascript
let fontSize = 100





```






