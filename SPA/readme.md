(这里只是个简单的demo，稍微记录一下思想)
## 何为单页面应用

这有点像我们vue中的路由。

单页面应用：顾名思义，只有一个页面的应用称为单页面应用。那么何为多页面应用就不用解释了吧~~~

**来看看掘金上面的定义**

**单页面应用（SinglePage Web Application，SPA）：**

只有一张Web页面的应用，是一种从Web服务器加载的富客户端，单页面跳转仅刷新局部资源 ，公共资源(js、css等)仅需加载一次，常用于PC端官网、购物等网站

嗯。。。似乎有点绕。我们整理一下句子：

#### 只有一张Web页面的应用，这个页面仅需加载一次。比如pc端官网等

就这意思嘛~~整的贼复杂不好理解

### 构建原理

在单页面应用过程中，我们可能需要用ajax获取数据，但由于是单页面应用，当我们希望返回获取数据前的页面时，点一下返回按钮，这页面就直接蹦出去了，哟哟哟，很调皮嘛。

为了解决单页面的这种十分调皮的行为，我们给它找了个一对一的历史老师（history）专门给这小破孩辅导功课

接下来我们一起看看这位历史老师都有哪些必杀技

## 历史老师的必杀技

### 1. history.pushState(state, title, url) 在原来历史记录上 添加一条历史记录
### 2. histor.replaceState(state,, title, url) 在原来历史记录上 替换当前的历史记录
 
- **state**：指定网址相关的状态对象，popstate事件触发时，该对象会传入回调函数中。如果不需要该函数，此处可填null。
- **title**：新页面的标题，但是目前所有浏览器都忽略这个值，因此此处可填null
- **url**：新网址，必须与当前网址处在同一个域。浏览器地址栏将显示这个网址。



可惜的是，历史老师的必杀技使用后不会刷新页面。也就是说，当地址替换之后，只是地址栏改变，页面，但页面没刷新


## 历史老师不为人知的秘密

1. popstate事件

历史记录发生改变时触发
调用history.pushState() 或者 history.replaceState()不会触发popstate事件

2. haschange事件

当页面的hash值改变的时候触发，常用于单页面应用


# 实现单页面应用核心原理

php代码：
```php
<?php

header("content-type:text/html;charset='utf-8'");
error_reporting(0);

$page = $_GET['page'];
if($page == 'one'){
    $data = '111';
}else if($page == 'two'){
    $data = '222';
}else if($page == 'three'){
    $data = '333';
}

echo "{$data}";

```

css:
```css
.wrapper{
    position: relative;
    width: 420px;
    height: 420px;
    margin: 100px auto;
    border: 1px solid #000;
}
.head{
    display: flex;
    width: 100%;
    height: 10%;
    background: red;
}
button{
    flex-grow: 1;
    color: #fff;
    border: none;
    border-right: 1px solid #fff;
    background: #0091ca;
}
```
html:
```html
<div class="wrapper">
    <div class="head">
        <button>111</button>
        <button>222</button>
        <button>333</button>
    </div>
    <div class="content">
        <div class="item"></div>
    </div>
</div>
```

js
```javascript

        var page = null;
        var head = document.getElementsByClassName("head")[0]
        var dom = document.getElementsByClassName("item")[0]
        function init(){
            history.replaceState({},null,"?one")
            ajax('GET', './getData.php', true, 'page=one', doData)
        }
        init()
        function doData(res){
            dom.innerHTML = res
        }
        
        head.addEventListener("click",function(e){
            /**
            * 当用户点击按钮的时候
            * 给页面存入一条历史记录 然后
            * 进行ajax刷新页面数据 
            */
            page = e.target.getAttribute("data")
            history.pushState({newPage:page}, null, "?" + page) // state title url
            ajax("GET", "./getData.php", true, "page=" + page, doData)
        })

        window.addEventListener("popstate", function(e){

            var newPage = e.state.newPage // 获取上一次存储到history.state.newPage里面的值 放到newPage中

            // 重新获取一ajax请求
            ajax("GET", "./getData.php", true, "page=" + newPage, doData)
        })

        function ajax(method, url, flag, data, callback){
            var app = null;
            // 兼容ie
            if(window.XMLHttpRequest){
                app = new XMLHttpRequest();
            }else{
                app = new ActiveXObject("Microsoft.XMLHTTP");
            }

            // 如果是GET方法 直接凭借在地址后面 如果是POST方法 修改编码然后发送
            if(method == "GET"){
                app.open(method, url + "?" +data, flag)
                app.send()
            }else if(method == "POST"){
                app.open(method, url, flag);
                app.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
                app.send(data)
            }

            app.onreadystatechange = function(){
                if(app.readyState == 4){
                    if(app.status == 200){
                        callback(app.responseText)
                    }
                }
            }
        }
```
HTML、CSS没什么讲的，讲一下PHP，在做这个demo的时候，php最后面少了个“；”号。查了不少资料都没解决。后来怀疑是php出了问题，加了个分号就解决了。

在上面的代码中，我们封装了一个ajax函数，篇幅所及，这里就暂时不回顾ajax了。下面讲一讲核心函数：

```javascript
function init(){
    history.replaceState({},null,"?one")
    ajax('GET', './getData.php', true, 'page=one', doData)
}
init()
function doData(res){
    dom.innerHTML = res
}

head.addEventListener("click",function(e){
    /**
    * 当用户点击按钮的时候
    * 给页面存入一条历史记录 然后
    * 进行ajax刷新页面数据 
    */
    page = e.target.getAttribute("data")
    history.pushState({newPage:page}, null, "?" + page) // state title url
    ajax("GET", "./getData.php", true, "page=" + page, doData)
})

window.addEventListener("popstate", function(e){

    var newPage = e.state.newPage // 获取上一次存储到history.state.newPage里面的值 放到newPage中

    // 重新获取一ajax请求
    ajax("GET", "./getData.php", true, "page=" + newPage, doData)
})
```
1. init: 初始化函数
    - history.replaceState({},null,"?one")
        
        replaceState( state, title, url ) 替换历史记录
    - ajax('GET', './getData.php', true, 'page=one', doData)
        
        默认发起ajax请求

2. function doData(res) 回调函数，初始化完毕之后调用，ajax执行完毕也调用

3. head.addEventListener 事件委托 监听点击事件

4. window.addEventListener("popstate", function(e){...}) 页面返回时，触发该事件，重新发起ajax请求，返回刷新上一次数据。


**小总结**： 
- 初次加载时，给一个默认的历史记录设置```history.replaceState({}, null, "?one")```。设置完还不忘加个ajax请求。
- 接下来，如果点击一个按钮，那么这个按钮就会触发一个ajax请求，在请求之前还会对历史记录进行保存某个标识记录```history.pushState({newPage:page}, null, "?" + page)```。这个page就是预先存在data里面的数据，通过事件源对象获取。
- 最后还要在全局window下绑定一个popstate事件，这个事件是用来检测是不是点击了返回，当用户返回的时候，由于数据已经改变了，我们需要重新进行ajax获取数据。由于在点击之前，我们就已经保存了一个state对象，因此只需要通过事件源对象e进行传值，获取上一次点击的表示，传到这一次的ajax参数里面重新拿一下数据就好了。



### 简短概括：

1. 点击选项，添加记录，ajax获取数据。
2. 触发返回popstate，获取上次记录数据，ajax获取上次数据。
 

### hashchange事件
当页面的hash值改变时触发，常用于构建单页面应用

hash值：#。“#”代表的就是hash值。和popchange对比，hashchange只监听hash值的改变，即只监听#的改变。原理和popchange一样，只是改变一下，将"?"改成“#”即可
