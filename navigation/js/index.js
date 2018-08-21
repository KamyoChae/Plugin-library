/**
 * js思路
 */

var showUl = document.getElementsByClassName("show-ul")[0] // 获取的是最外面的那个ul，用来做事件委托的

var oTitle = document.getElementsByClassName("title")[0] // 点击的按钮 即需要做出水波纹效果的按钮

var oTitle = document.getElementsByClassName("title") // 这里获取到是一个dom数组对象 

// 创建一个span元素 用来做水波纹动画效果
var oSpan = document.createElement("span")
oSpan.className = "water"
var index = 0
showUl.addEventListener("click",function(e){
    /**
     * 思路：
     * 首先通过 target.nodeName 判断点击的事件源对象是不是超链接a（nodeName<节点名>都是用大写字母表示的）
     * 如果点到了超链接 那就用一个函数findIndex(list,target)计算出这个超链接是第几个(index) 并返回index
     * 通过 index 来给超链接下方做动画划线飘呀飘的效果
     * 
     * 在点击的同时 将原先创建好的水波纹dom元素通过target添加进来
     * 
     */

    var target = e.target

    if(target.nodeName == "A"){
        index = findIndex(oTitle,target) // 获取点击的索引

        

    }
})

function findIndex(list, dom){
    for(var i = 0; i < list.lenth; i++){
        if(list[i] == dom){
            return i
        }
    }
}


