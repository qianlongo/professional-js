## Ajax与Comet

> Asynchronous Javascript and XML(`Ajax`),这一技术能够能够向服务器请求额外的数据而不用刷新页面，能够带来更好的用户体验，熟练地使用XHR对象是Web开发人员必须掌握的一项技能。

## 阅读主要内容和目标

1. 使用`XMLHttpRequest`
2. 使用`XMLHttpRequest`相应的事件
3. 跨域Ajax通信的限制

## XMLHttpRequest对象

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
