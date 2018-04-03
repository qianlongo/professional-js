本章目标
 1. 创建平滑的动画
 2. 操作文件
 3. 使用Web Workers在后台执行JavaScript

**第25章，我们先看看文件操作相关的知识点**

## 25.4 File API

> 不能直接访问用户计算机中的文件，一直都是web应用开发中的一大障碍，2000年以前，处理文件唯一的方式就是在表单中加入<input type="file">字段，仅此而已，File API的宗旨是为Web开发人员开提供一种安全的的方式，以便在客户端访问用户计算机中的文件，并更好地对这些文件进行操作。

File API在表单的文件字段的基础上又添加了一些直接访问文件信息的接口，HTML5中在DOM中为文件输入元素添加了一个files集合，在通过文件输入字段选择了一或多个文件时，files集合中将包含一组File对象，每个File对象对应一个文件，每个File对象下面都有下列的只读属性。

name: 本地文件系统中的文件名
size: 文件的字节大小
type: 字符串，文件的MIME类型
lastModifiedDate: 字符串，文件上一次被修改的时间（只有Chrome实现了这个属性）

**文件信息获取示例**
html

``` html

<input type="file" class="files" multiple>

```

javascript

``` javascript

let $files = document.querySelector('.files')

  $files.addEventListener('change', (e) => {
    let target, files

    e = e || event
    target = e.target || e.srcElement
    files = target.files

    Array.from(files).forEach((file, i) => {
      console.table(file)
    })
  }, false)


```

## 25.4.1 FileReader类型

> FileReader类型实现的是一种异步文件读取机制，可以把FileReader想象成XMLHttpRequest，区别只是它读取的是文件系统，而不是远程服务器。问了读取文件中的数据，FileReader提供了以下几个方法。

1. readAsText(file, encoding)： 以纯文本形式读取文件，将读取到的文本保存在result属性中

2. readAsDataURL(file): 读取文件并将文件以数据URI的形式保存在result属性中。

3. readAsBinaryString(file): 读取文件并将一个字符串保存在result属性中，字符串中的每个字符表示一个字节。

4. readArrayBuffer(file): 读取文件并将一个包含文件内容的ArrayBuffer保存在result属性中。

**由于读取文件的过程是异步的，因为FileReader也提供了几个事件，其中最有用的三个事件是progress，error，load，分别表示是否又读取了数据，是否发生错误以及是否已经读完了整个文件**

每隔50ms左右，就会触发一次progress事件，通过事件对象可以获得与XHR的progress事件相同的信息。lengthComputed,loaded,total,另外尽管可能没有包含全部数据但是每次progress事件中都可以通过FileReader的result属性读取到文件内容。

由于种种原因无法读取文件，就会触发error事件，触发error事件时，相关的信息将会保存到FileReader的error属性中，这个属性中将保存一个对象，该对象只有一个属性code，即错误码，这个错误码是

1. 表示未找到文件
2. 表示安全性错误
3. 表示读取中断
4. 表示文件不可读
5. 表示编码错误

文件成功加载后会触发load事件，如果发生了error事件就不会触发load事件。 

## 25.4.2 读取部分内容

> 有时候，我们只想读取文件的一部分内容而不是全部内容，为此，File对象还支持一个slice方法，这个方法在Firefox中叫mozSlice，在chrome中叫做webkitSlice，其接受两个参数，起始字节，以及要读取的字节数。这个方法返回一个Blob的实例，Blob是File类型的父类型。下面是一个兼容的方法

``` javascript

function blobSlice (blob, startByte, length) {
  if (blob.slice) {
    return blob.slice(startByte, length)
  } else if (blob.webkitSlice) {
    return blob.webkitSlice(startByte, length)
  } else if (blob.mozSlice) {
    return blob.mozSlice(startByte, length)
  } else {
    return null
  }
}


```

具体例子可以查看/examples/第25章-新兴的API/files2.html

这种特性允许只读取部分内容可以节省很多时间，非常适合只关注数据中某个特性部分（比如文件头部）的情况

## 25.4.3 对象URL

## 25.4.4 读取拖放的文件

> 围绕文件信息，结合使用的HTML5 API和文件API，可以做出很赞的东西来。与拖放一张图片或者一个链接类似，从桌面上把文件拖放到浏览器中也会触发drop事件，而且可以在event.dataTransfer.files中读取到被放置的文件，当然此时他是一个File对象，与通过文件输入字段取得的File对象一样


## 25.6 Web Workers

> 随着Web应用复杂性的与日俱增，越来越复杂的计算在所难免，长时间运行的JavaScript进行会导致浏览器冻结用户界面，让人感觉屏幕“冻结”了，Web Workers规范通过让JavaScript在后台运行解决了这个问题，浏览器实现Web Worker的方式有很多种，可以使用线程，后台进程或者运行在其他处理器上的进程，等等。怎么实现细节其实没有那么重要，重要的是开发人员现在可以放心地运行JavaScript而不必担心影响用户体验了。




