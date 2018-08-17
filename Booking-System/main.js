var spanAddr = document.getElementsByTagName("span") // 地址
addrArr = Array.prototype.slice.call(spanAddr) // 地址数组 出发地目的地
change = document.getElementsByTagName("a")[0] // 交换按钮
card = document.getElementsByClassName("checkbox")[0] // 选项卡 地址卡片
cancle = document.getElementsByClassName("cancle")[0] // 取消按钮
ul = document.getElementsByTagName("ul")[0]// 地址列表
oActiveEle = null // 留一个坑 

flag = true// 旋转交换开关
reg = 0; // 角度

// 首先做一下按钮点击的交换动画
/**
 * 旋转地址交换按钮 
 * 通过中间值temp交换类名 ele.className
 * 同时按钮旋转+180度
 */
change.onclick = function () {
    var temp = spanAddr[0].className
    spanAddr[0].className = spanAddr[1].className
    spanAddr[1].className = temp
    reg += 180
    change.style.transform = 'rotateZ(' + reg + 'deg)'
}

// 然后做点击地址的按钮
/**
 * 不管点击谁 都会把右边的地址卡飞过来 card.style.left = 0
 * 在点击的时候 我们还要做一件偷偷摸摸的事
 * 给点击的按钮悄悄绑上一个类名 oActiv
 * 想知道为什么吗？
 * 想知道吗？
 * 我偏不说，憋着
 */
addrArr.forEach(function (ele, index) {
    ele.onclick = function () {
        card.style.left = 0 + "px"
        ele.classList.add("oActive")
        oActiveEle = document.getElementsByClassName("oActive")[0]
    }
});

// 接下来做选中新城市的动画
/**
 * 我们得先给li都绑上一个点击事件
 * 但是li可能会有几十几百几千个 
 * 我们还是用forEach的方法来绑定的话 会把小蝉蝉气死的
 * so~ 我们可以尝试一下利用事件源对象 e
 * 但是在使用事件源对象 e 的时候
 * 它可以点击 ul 里面的任何元素 包括ul
 * 为了解决这种 捉田螺捉到鳖 的问题
 * 我们还需要通过 target.nodeName = "LI" 判断一下 
 * 我们是真真正正捉到了田螺！
 */
ul.onclick = function (e) {
    var e = e || window.event
    var target = e.target
    console.log(target)
    if (target.nodeName = "LI") {
        oActiveEle.innerText = target.innerText // 把点击li的文字内容传到一个神秘的地方~
        card.style.left = 500 + "px"
    }


}
/**
 * 最后是取消按钮 从哪来回哪去
 */
cancle.onclick = function () {
    card.style.left = 500 + "px"
}

// 大功告成~
