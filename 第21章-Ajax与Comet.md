## Ajax与Comet

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
    var versions = [
      'MSXML2.XMLHttp',
      'MSXML2.XMLhttp.3.0',
      'MSXML2.XMLhttp.6.0'
    ]
    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        // 为什么这里不将实例返回也可以得到XHR对象
        new ActiveXObject(versions[i])
        arguments.callee.activeXString = versions[i]
        break
      } catch (e) {
        // 跳过
      }
    }
  }
  return new ActiveXObject(arguments.callee.activeXString)
} else {
  throw new Error('No XHR object available')
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

