(function (option) {
    // 挂在全局上
    window ? window.loop = option : this.loop = option
}(function loop(obj) {
    if (Object.prototype.toString.call(obj) !== "[object Object]") {
        throw new Error("loop需要一个对象作为参数")
    }
    if (1 !== obj.box.nodeType) {
        /**
         * 节点类型：nodeType 
         * nodeType ： 1 元素节点
         * nodeType ： 2 属性节点
         * nodeType ： 3 文本节点
         * nodeType ： 8 注释节点
         * nodeType ： 9 document
         * nodeType ： 11 documentFragment 文档碎片
         */
        // 如果这个节点不是元素节点 就抛出异常
        throw new Error("请绑定一个正确的dom节点作为渲染")
    }

    var box = obj.box, // 包含点击按钮 图片组 小圆点的div
        btnLeft = obj.btnLeft, // 向左
        btnRight = obj.btnRight, // 向右
        boxDotted = obj.boxDotted, // 小圆点 用于事件委托
        boxUl = obj.boxUl, // 装载图片的ul 用于动态更变宽度
        dotted = obj.dotted; // 小圆点数量

    var myWidth = box.clientWidth; // 获取box宽度，用于修改div 及滑动

    // 初始化函数 首先生成小圆点 改变装载图片的ul宽度 
    (function () {
        boxUl.style.width = (dotted + 1) * myWidth + "px"// 通过小圆点数 得知共有多少个图片 改变最长宽度 +1目的是实现轮播效果
        boxUl.style.left = 0 // 默认初始化
        var str = ""
        for (var i = 0; i < dotted; i++) {
            str += "<li></li>"
        }
        boxDotted.innerHTML = str
    })()

    var index = 0; // 当前页数 通过页数来判断滑动页面到了第几页

    // 左右点击的动画效果
    btnLeft.addEventListener("click", function () {
        var left = "left"
        move(left)
    }, false)

    btnRight.addEventListener("click", function () {
        var right = "right"
        move(right)
    }, false)

    
    var dotChild = boxDotted.children

    var timer = null;
    var speed = 0;
    var key = 1; // 加锁 如果连续点击了 那就加快切换速度
    function move(direction) {
        var con = 40 // 移速
        var Natural = 0; // 用于确定方向 前进和后退

        for(var prop in dotChild){
            dotChild[prop].className = ""
        }
       console.log(dotChild[index])
       dotChild[index].className="active"

        if (direction == "right") {
            Natural = -1;
            index++;
            if(index == dotted + 1){
                index = 1
            }
        } else if (direction == "left") {
            Natural = 1;
            index--
            if(index == -1){
                index = dotted
            }
        }
        console.log(index)
        if (key) {
            clearInterval(timer)
            key = 0; // 关闭重复点击
            if (index < 0) {
                index = dotted - 1
                speed = -myWidth * dotted
                boxUl.style.left = speed + "px"
            }
            timer = setInterval(function () {
                speed = speed + con * Natural  // Natural  负数 -1 
                boxUl.style.left = speed + "px"
                if (Math.abs(speed) >= Math.abs(myWidth * index)) {
                    clearInterval(timer)
                    key = 1 // 开锁
                    if (index == dotted) {
                        index = 0
                        speed = 0
                        boxUl.style.left = 0
                    }
                }
            }, 1000 / 60)

        }

    }

}))
