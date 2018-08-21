var showUl = document.getElementsByClassName("show-ul")[0] // 获取的是最外面的那个ul，用来做事件委托的
var oActive = document.getElementsByClassName('active')[0] // 激活状态的标识符类名 在这里获取到dom节点
var oItem = document.getElementsByClassName("item") // 获取到的是三个组块 即类名为item的li元素
var oTitle = document.getElementsByClassName("title") // 这里获取到是一个dom数组对象 

var oSlider = document.getElementsByClassName("slider")[0] // 这里获取的是下划线 

// 创建一个span元素 用来做水波纹动画效果
var oSpan = document.createElement("span")
oSpan.className = "water"
var index = 0
showUl.addEventListener("click", function (e) {
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

    if (target.nodeName == "A") {
        oActive.classList.remove('active'); // 为了防止被上一次点击干扰，我们先将触发这个动画的css类名去掉
        index = findIndex(oTitle, target) // 获取点击的索引

        /** 
         * 这里我重写了html css结构 所以我用另一种方式实现下划线飞飞飞飞~
         * 但是这一步做得不是特别好，如果缩放页面 或是改动页面宽度，就会出现下划线偏移的问题
         * 不过这个小细节一定还能做得更好的，感觉自己还要好好补一补css的知识点
         */
        oSlider.style.left = target.getBoundingClientRect().left - 45 + "px" // -45这个值是一次次测的，并不懂这个45像素从哪来

        /**
         * dom.getBoundingClientRect()这个方法我还是第一次看到，
         * 去查了一下资料，
         * 才知道getBoundingClientRect()获取到的是这个元素各个边与页面窗口左边和上边的距离
         * 比如 ele.getBoundingClientRect().top 是该ele元素的上边(可以粗略理解成border-top)与窗口上方的距离
         * 而 ele.getBoundingClientRect().bottom 则是该ele元素的下边(可以粗略理解成boder-bottom) 与窗口上方的距离
         */

        oTitle[index].appendChild(oSpan) // 在点击的按钮里面插入一个span元素
   
        oItem[index].classList.add("active") // 给索引对应的元素添加类名

        oActive = oItem[index]; // 这步操作 个人理解是相当于重新定向上一次点击的dom元素类名了 但是对于为什么没有它就不行的原因还没有想明白 
        /**
         * 接下来我们实现 指哪打哪 的 田螺纹 效果
         * 通过上面的注解 我们知道getBoundingClientRect()可以获取到当前dom节点的各边与窗口上方及左方距离
         * 假若我们还知道鼠标点击的当前坐标 我们就可以得出当前点击的位置距离所点击元素的上、左距离
         * 简而言之，就是点击位置与元素左边、上边的距离，即left = e.pageX - target.getBoundingClientRect().left
         * 
         * 但是我们还需要考虑一个地方，这个田螺纹是有宽高的，而它定位的方式就是通过左边和上边来决定
         * 所以我们还需要偷偷做个小动作，减去宽高的一半 即left = e.pageX - target.getBoundingClientRect().left - 40 + "px"
         */

        var left =  parseInt(e.clientX - oTitle[index].getBoundingClientRect().left) - 40 + "px"
        var top = parseInt(e.clientY - oTitle[index].getBoundingClientRect().top ) - 40 + "px"
        // 页面重构了，不能用e.pageX 和e.pageY 今晚在这改bug花了好多时间 QAQ
        oSpan.style.left = left
        oSpan.style.top = top

    }
})

function findIndex(list, dom) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == dom) {
            return i
        }
    }
}


