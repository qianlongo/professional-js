本章内容
1. 理解window对象--BOM的核心
2. 控制窗口、框架和弹出窗口
3. 利用location对象的页面信息
4. 使用navigator对象了解浏览器

## 8.1 window对象

> BOM的核心对象是window，它表示浏览器的一个实例，在浏览器中，window对象有双重角色，它既是通过JavaScript访问浏览器窗口的一个接口，也是ECMAScript规范的Global对象，这意味着在网页中定义任何一个对象，变量或者函数，都以window作为Global对象，因此有权访问parseInt等方法

## 8.1.1 全局作用域

> 所有在全局作用域中声明的变量、函数都会变成window对象的属性和方法。

``` javascript

var age = 29

function sayAge () {
  alert(this.age)
}

alert(window.age)
sayAge()
window.sayAge()

```

age和sayAge都被自动归在了window对象名下，所以可以通过window.age和window.sayAge访问

**非常重要**

定义全局变量与在window对象上直接定义属性的差别是：全局变量不能通过delete操作符删除，而直接在window对象上的定义的属性可以。