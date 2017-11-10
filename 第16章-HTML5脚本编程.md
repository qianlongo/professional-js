本章内容
  -使用跨文档消息传递
  -拖放API
  -音频与视频

## 16.1 跨文档消息传递

> 跨文档消息传送（cross-document-messaging），有时候简称为XDM，指的是在来自不同域的页面间传递消息。例如www.wrox.com域中的页面与位于一个内嵌框架中的p2p.wrox.com域中的页面通信。

XDM的核心是postMessage方法，在HTML5中除了XDM部分之外的其他部分也会提到这个方法名，但都是为了同一个目的：**向另一个地方传递数据**，对于XDM而言，“另一个地方”指的是包含在当前页面中的<iframe>或者由当前页面弹出的窗口

postMessage方法接收两个参数，一条消息和一个表示消息接收方来自哪个域的字符串。第二个参数对保障安全通信非常重要，可以防止浏览器把消息发送到不安全的地方。来看下面的例子

``` javascript

let iframeWindow = document.getElementById('myframe').contentWindow

iframeWindow.postMessage('A secret', 'http://www.wrox.com')


```

如果postMessage的第二个参数是'*'，则可以把消息发送给来自任何域的文档，但是我们不推荐这样做