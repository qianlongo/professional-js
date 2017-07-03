## Ajax与Comet

[也可以查看阮一峰AJAX学习](http://javascript.ruanyifeng.com/bom/ajax.html)

> Asynchronous Javascript and XML(`Ajax`),这一技术能够能够向服务器请求额外的数据而不用刷新页面，能够带来更好的用户体验，熟练地使用XHR对象是Web开发人员必须掌握的一项技能。

## 阅读主要内容和目标

1. 使用`XMLHttpRequest`
2. 使用`XMLHttpRequest`相应的事件
3. 跨域Ajax通信的限制

## 21.1 XMLHttpRequest对象

> XMLHttpRequest对象是使用Ajax技术最重要的一个点，最早支持该api的浏览器是IE5，在该浏览器中通过MSXML中的一个ActiveX对象实现的，所以在IE中也可能会遇到三个不同版本的XHR对象，分别是`MSXML2.XMLHttp`、`MSXML2.XMLHttp.3.0`、`MSXML2.XMLHttp.6.0`。需要兼容的话可以使用下面这个函数。

``` javascript

//  适用于ie7之前的版本

function createXHR () {
  if (typeof arguments.callee.activeXString != 'string') {
    var versions = [
      'MSXML2.XMLHttp',
      'MSXML2.XMLhttp.3.0',
      'MSXML2.XMLhttp.6.0'
    ]
    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        new ActiveXObject(versions[i])
        arguments.callee.activeXString = versions[i]
        break
      } catch (e) {
        // 跳过
      }
    }
  }
  return new ActiveXObject(arguments.callee.activeXString)
}

```

**当然如果我们只想支持ie7以及更高版本的浏览器只需要像下面这样使用构造函数**

``` javascript

var xhr = new XMLHttpRequest()


```

**如果必须支持ie7以下的版本，稍微改造下前面的createXHR函数即可**

``` javascript
function createXHR () {
  if (typeof XMLHttpRequest != 'undefined') {
    return new XMLHttpRequest()
  } else if (typeof arguments.callee.activeXString != 'string') {
    console.log('进了arguments.callee.activeXString')
    var versions = [
      'MSXML2.XMLHttp',
      'MSXML2.XMLhttp.3.0',
      'MSXML2.XMLhttp.6.0'
    ]
    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        // 为什么这里不将实例返回也可以得到XHR对象
        console.log(versions[i])
        new ActiveXObject(versions[i])
        arguments.callee.activeXString = versions[i]
        break
      } catch (e) {
        // 跳过
      }
    }
    console.log('ActiveXObject')
    return new ActiveXObject(arguments.callee.activeXString)
  } else {
    throw new Error('No XHR object available')
  }
}

```

## 21.1.1 XHR的用法

> 上面了解了如何用兼容的方式获取一个xhr对象，现在开始学习如何使用，一般大致上可以分为以下三步。

1. 通过`onreadystatechange`监听请求状态
2. xhr.open(method, url, true or false)
3. xhr.send()


`xhr.open(method, url, true or false)`的三个参数分别是请求的类型(`get`、`post`等)，请求的url，以及请求是否设置为异步。

**示例**

``` javascript
xhr.open('get', 'example.php', false)

```

**特别说明**

1. url可以是相对路径也可以是绝对路径
2. 调用`open`方法后并不会立即发送一个请求到服务器，只是启动一个请求以备发送。


真正发送请求是从xhr.send()开始

``` javascript
xhr.open('get', 'example.php', false)
xhr.send(null)

```

`send`方法接收一个参数，即作为请求主体发送的数据，如果不需要发送数据必须传入`null`,此时请求才真正地被分派至服务器。

当发送的请求接收到响应的时候会自动填充`xhr`对象的相关属性，现在对相关属性介绍如下。

1. responseText(作为响应主体被返回的文本)
2. status (响应的http状态)
3. statusText(http状态说明)

接收到响应的时候先判断`status`属性，以判断响应是否完成，一般将http状态为200(304表示请求的资源没有更改，可以走浏览器缓存)时作为成功的标志。

所以可以如下写法检查请求的状态

``` javascript
xhr.open('get', 'example.php', false)
xhr.send(null)
if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
  // 成功
  alert(xhr.responseText)
} else {
  alert('request was unsuccessful' + xhr.status)
}

```

像上面那样发送的是同步请求，大多数情况下我们发送的还是异步请求以不阻塞js继续执行，这个时候可以监测xhr对象的`readyState`属性,该属性表示请求/响应过程属于哪一个阶段。总共有以下几个阶段

1. 0 : 未初始化，还没有调用open()方法
2. 1 : 启动，已经吊用open()方法但是还没有调用send()方法
3. 2 : 发送，已经调用send()方法，但是尚未接收到响应
4. 3 : 接收，已经接收到部分数据
5. 4 : 完成，已经接收到全部数据，而且已经可以在客户端使用了。

通常`readyState`由一个值切换到另一个值都会触发`onreadystatechange`事件，通常我们只对为4的情况感兴趣，因为只有这个时候响应的数据是完整的。

**看一个完成一些的例子**

``` javascript
let xhr = createXHR()

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      // 成功
      alert(xhr.responseText)
    } else {
      // 失败
    }
  }
}
xhr.open('get', 'example.php', true)
xhr.send(null)

```

**另外既然可以发送请求，我们也可以终止请求，调用xhr.abort()法方法，xhr对象将会停止触发事件，此时也应该对xhr对象解除引用操作**

## 21.1.2 http头部信息

> 每个http的请求和响应都会带有响应的头部信息，xhr对象提供了操作这两种头部(请求头部和响应头部)信息的方法。

1. Accept : 浏览器能够处理的内容类型
2. Accept-charset : 浏览器能够显示的字符集
3. Accept-Encoding : 浏览器能够处理的压缩编码
4. Accept-Language : 浏览器当前设置的语言
5. Connection : 浏览器与服务器之间的连接类型
6. Cookie : 当前页面设置的任何cookie
7. Host : 发出的请求所在的域
8. Referer : 发出请求的页面URI (`特别注意：这个单词正确拼写应该是referrer,但是HTTP规范把单词拼错了，也只能将错就错了`)

**可以使用`xhr.setRequestHeader`来设置自定义的请求头部信息**

该方法接收两个参数，即头部字段的名称和头部字段的值。

**如果要成功的发送请求头部信息，必须在调用open方法之后并且调用send方法之前调用setRequesHeader方法**，比如

``` javascript
var xhr = createXHR()
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
       console.log((xhr.responseText))
    }
  }
}
xhr.open('get', 'example', true)
xhr.setRequestHeader('name', 'qianlongo')
xhr.send(null)

```
服务端在接收到这种自定义的头部信息之后，可以执行响应的后续操作，建议不要修改浏览器默认的头部相关字段。

我们也可以调用`xhr.getResponseHeader()`，并传入一个头部字段的名称即可获取响应的头部信息，而调用`xhr.getAllResponseHeaders()`则可以获取包含所有头部信息的长字符串。

以下是示例。

``` javascript
var myHeader = xhr.getResponseHeader('myHeader')
var allHeaders = xhr.getAllResponseHeaders()
```

当然了客户端在发起请求的时候可以自定义请求头部信息，服务端同样可以返回客户端一些自定义的头部信息。

## 21.1.3 GET请求

> GET是最常见的请求类型，最常用于向服务器查询某些信息，将查询字符串跟在url的后面，以便将信息发送给服务器。，对于XHR而言传入open方法的url后的查询字符串，必须经过正确的编码（即名和值都必须使用encodeURIComponent()进行处理）才行。
 
``` javascript
function addURLParam (url, name, value) {
  url += (url.indexOf('?') === -1 ? '?' : '&')
  url += encodeURIComponent(name) + '=' + encodeURIComponent(value)
  return url
}

```

## 21.1.4 POST请求

> 使用频率仅次于get的是post请求，通常用于向服务器发送应该被保存的数据，post请求应该将数据作为请求的主体提交而get请求传统上不是如此，post请求可以包含非常多的数据而且格式不限。


**默认情况下，服务器对post请求和提交的web表单请求并不会一视同仁，因此服务器必须有程序来读取发送过来的原始数据，并且解析出有用的部分，不过我们可以用xhr来模仿表单提交**

模仿表单提交一般有以下两点

1. 将请求头的`Content-type`设置为`application/x-www-form-urlencoded`,也就是表单提交的类型
2. 其次以合适的格式创建一个字符串，post格式与查询字符串的格式相同

**简单示例**

``` javascript
function submitData () {
  var xhr = createXHR()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        alert(xhr.responseText)
      } else {
        alert('err')
      }
    }
  }
  xhr.open('post', 'example.php', true)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded') // 着重点
  var form = document.getElementById('user-info')
  xhr.send(serialize(form)) // 着重点
}

```

**与GET请求相比POST请求消耗的资源会更多一些，从性能角度看，发送相同的数据，GET请求的速度可以达到POST请求的2倍**

**因为Ajax涉及到模仿表单提交等知识，现在暂停到这里，先回顾完第14章－表单脚本再回到这里**

**对于了解本章知识点需要的表单知识主要是以GET和POST两种方式提交时的请求头部`Content-type`和`formData`以及提交给后端的是经过`encodeURIComponent()`处理的即可**

## 21.2 XMLHttpRequest 2级

## 21.2.1 FormData

> 现代Web应用中频繁使用的一项功能就是表单序列化，`XMLHttpRequest 2`为此定义了`FormData`类型，FormData为序列化表单和创建与表单格式相同的数据(用于通过XHR传输)提供了便利。

使用示例

``` javascript
var data = new FormData()

data.append('name', 'qianlongo')

```

其接收两个参数，数据的健和值

当然也可以直接像`FormData`传入表单

示例
 
``` javascript
var xhr = createXHR()
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      alert(xhr.responseText)
    } else {
      alert('err')
    }
  }
}
xhr.open('post', 'example.php', true)
var form = document.getElementById('user-info')
xhr.send(new FormData(form)) // 着重点

```

**对比上面一个例子我们可以发现，使用FormData来传输数据的时候，可以省去设置头部`Content-type`，也不必自己序列化表单，可谓方便多了**

## 21.2.2 超时设置

> 超时设置可以参考zepto ajax模块中的处理 [zepto-ajax模块](https://github.com/qianlongo/zepto-analysis/blob/master/src/ajax.js)

## overrideMimeType()方法

> 该方法用于重写XHR响应的MIME类型，因为返回响应的类型决定了XHR对象如何处理它，所以提供一种能够重写服务端返回的MIME类型是很有用的。[MIME MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

举个例子：服务器返回的MIME类型是text/plain,但是数据中实际包含的是XML，那么XHR根据MIME的类型，即使数据是XML。responseXML属性中仍然是null，通过调用overrideMimeType方法，可以保证把响应当作XML而非穿文本来处理。

``` javascript
var xhr = createXHR()
xhr.open('get', 'text.php', true)
xhr.overrideMimeType('text/xml')
xhr.send(null)
```

**注意该方法必须要在send方法之前调用，才能保证重写响应的MIME类型**

## 21.3 进度事件

> Progress Events定义了客户端与服务器通信有关的事件。

1. loadStart ： 在接收到响应数据的第一个自己触发
2. progress ：在接收响应期间持续不断的触发
3. error ： 在请求发生错误时触发
4. abort ： 在因为调用abort()方法而终止连接时触发
5. load ： 在接收到完整的数据时触发
6. loadend ： 在通信完成或者触发error、abort或load事件后触发

现在着重看`load`和`progress`事件

## 21.3.1 load事件

> load事件的初衷在于简化异步交互的模型，用以替代readystatechange事件，响应接收完毕将会触发load事件，因此也就没有必要检查readyState属性。并且load事件处理程序会受到一个event对象，target属性就是指向xhr对象的实例，也就可以访问到其所有的属性和方法。

遗憾的是并不是所有的浏览器都实现了适当的事件对象，所以兼容写法还是如下

``` javascript
var xhr = createXHR()
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
    alert(xhr.responseText)
  } else {
    alert('Request was unsuccessful')
  }
}

```

## 21.3.2 progress事件

> 该事件会在浏览器接收数据期间周期性的触发。而onprogress的事件处理程序会接收到一个event对象，其target属性是XHR对象，但是包含三个而外的属性 

1. `lengthComputable` (表示进度信息是否可用)
2. `position` (表示已经接收的字节数)
3. `totalSize` (表示根据Content-Length响应头部确定的预期的字节数)

**这些属性兼容性问题比较大，谨慎使用**

## 21.4 跨域资源共享

## 21.4.1 IE对CORS的实现

## 21.4.2 其他浏览器对CORS的实现

## 21.4.3 Preflighted Request

## 21.4.4 带凭据的请求

## 21.4.5 跨浏览器的CORS

**以上章节都是讲解CORS形式跨域的解决方案，本书介绍比较少，可以看阮一峰的文章 [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)**

## 21.5 其他跨域技术

> 在CORS技术出现之前，解决跨域问题，一般是利用DOM中能够执行跨域请求的功能，在不依赖XHR对象的情况下也能发送某种请求。

## 21.5.1 图像ping

> 网页中无论从哪个网页中加载图片都不用担心跨域的问题，通过动态的创建图像，使用它们的onload和onerror事件处理程序来确定是否接收到了响应。

**图像ping是与服务器进行简单、单向的跨域通信的一种方式，请求的数据通过查询字符串形式发送给服务器，而响应可以是任意内容，但通常是像素图或204响应，通过图像ping浏览器得到不任何数据，但可以通过onload和onerror事件知晓请求是何时接收到的。**

``` javascript
var img = new Image()
img.onload = img.onerror = function () {
  alert('DONE')
}
img.src = 'www.baidu.com'

```

## 21.5.2 JSONP

> JSONP(JSON with padding),由两部分组成：回调函数和数据，回调函数是当响应到来的时应该在页面中调用的函数，回调函数的名字一般是在请求中指定的。而数据就是传入回调函数中的json数据。

**通过动态地创建`<script>`标签，将其src属性指向一个跨域的url，其实这里的script标签和img标签类似，都有能力不受限制的跨域加载资源，因为JSONP是有效的JavaScript代码，所以在请求完成之后，即在JSONP响应加载到页面以后，就会立即执行。**

可以看一篇自己以前写过的文章[原来你是这样的jsonp(原理与具体实现细节)](https://github.com/qianlongo/zepto-analysis/issues/4)

**示例**

``` javascript
function handleResponse (response) {
  console.log(response)
}

var script = document.createElement('script')
script.src = 'http://example.php?callback=handleReponse'
document.body.appendChild(script)

```

