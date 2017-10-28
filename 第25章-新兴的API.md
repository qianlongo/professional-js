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





