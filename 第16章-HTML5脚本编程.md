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

如果postMessage的第二个参数是'*'，则可以把消息发送给来自任何域的文档，但是我们不推荐这样做。

接收到XDM消息的时候会触发window对象的message事件，这个事件是以异步形式触发的，因此从发送消息到接收消息（触发窗口的message事件）可能要经过一段时间的延迟。触发message事件之后，传递给onmessage处理程序的事件包含以下三方面的信息。

1. data：作为postMessage第一个参数传入的字符串参数
2. origin：发送消息的文档所在的域，例如"http://www.wrox.com"
3. source: 发送消息的文档的window对象的代理，这个代理对象主要用于发送一条消息的窗口中调用postMessage方法，如果发送消息的窗口来自同一个域，那么这个对象就是window。


**特别注意**

1. event.source大多数情况下只是window对象的代理，并非是实际的window对象，换句话说，不能通过这个代理对象拿到window对象的其他任何信息，记住，只通过这个代理调用postMessage就好，这个方法永远存在。

2. XDM还有一些怪异之处，首先就是postMessage的第一个参数最早是作为“永远都是字符串”来实现的，但是后来这个参数定义改了，改成允许传入任何数据结构，可是并非所有的浏览器都实现了这一变化，为了保险起见，使用postMessage时，最好还是只传字符串，如果要传结构化后的数据，最佳选择是现在要传入的数据上调用JSON.stringfy,通过postMessage传入得到的字符串，然后再在onmessage事件处理程序中调用JSON.parse