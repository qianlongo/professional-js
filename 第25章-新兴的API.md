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





