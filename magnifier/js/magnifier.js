(function (magnifier) {
    if (window) {
        window.magnifier = magnifier
    }

})(function magnifier(obj) {
    var show = obj.show // 展示图片

    var box = obj.box // 获取图片盒子

    var rect = obj.rect // 获取半透明色块

    /**
     * 思路：鼠标移入 触发事件 显示半透明色块 计算边距离
     * 一开始的想法是鼠标进入时创建一个dom节点作为半透明覆盖层
     * 离开时删除这个节点
     * 但是突然就想到前些天看到的文章说频繁增删dom节点会出现重排重绘 对浏览器渲染不好
     * 我就改成通过透明度来显示了
     * 
     * 获取
     */


    // 计算比例 决定宽高比
    /**
     * 查资料知道 
     * clientHeight和clientWidth 元素内尺寸 元素内容+内边距 大小，不包括边框（IE下实际包括）、外边距、滚动条部分
     * 
     * offsetHeight和offsetWidth 元素外尺寸 元素内容+内边距+边框，不包括外边距和滚动条部分
     * 
     * clientTop和clientLeft 内边距(padding) 的边缘和边框的 外边缘 之间的水平和垂直距离，也就是左，上边框宽度
     * 
     * offsetTop和offsetLeft 该元素的左上角（边框外边缘）与已定位的父容器（offsetParent对象）左上角的距离
     * 
     * offsetParent 元素距离最近的定位（relative,absolute）祖先元素，递归上溯，如果没有祖先元素是定位的话，会返回null
     */
    var rectWidth = rect.clientWidth // 获取半透明色块宽高
    var rectHeight = rect.clientHeight

    var proportion = box.clientWidth / rectWidth // 宽度比 倍数
    var maxLeft = box.clientWidth - rectWidth
    var maxtop = box.clientHeight - rectHeight

    box.addEventListener("mouseenter", function (e) {
        rect.style.opacity = .2
        show.style.display = "inline-block"
    })
    var leftNum = 0, // 用来定位放大
        topNum = 0

    box.addEventListener("mousemove", function (e) {

        // 使用从上一次的水波纹效果中学习到的 clientX 和 getBoundingClientRect()
        // 感觉下面这段代码还可以优化
        leftNum = Math.ceil(e.clientX - box.getBoundingClientRect().left - rectWidth / 2) // 计算的是色块左边和外方块左边的距离
        rightNum = Math.ceil(box.getBoundingClientRect().right - e.clientX - rectWidth / 2) // 计算色块右边和外方块右边的距离
        topNum = Math.ceil(e.clientY - box.getBoundingClientRect().top - rectHeight / 2) // 计算色块上边和外方块上边的距离
        bottNum = Math.ceil(box.getBoundingClientRect().bottom - e.clientY - rectHeight / 2) // 计算色块下边和外方块下边的距离
        // clientX：窗口鼠标的x坐标
        // getBoundingClientRect().left 元素的左边 距离窗口左边的 像素长度

        // 限制放大区域
        leftNum <= 0 ? leftNum = 0 : "";
        rightNum <= 0 ? leftNum = maxLeft : "";
        topNum <= 0 ? topNum = 0 : "";
        bottNum <= 0 ? topNum = maxtop : "";

        var left = leftNum + "px"
        var top = topNum + "px"
        if (leftNum >= 0 && rightNum >= 0) {
            rect.style.left = left
        }
        if (topNum >= 0 && bottNum >= 0) {
            rect.style.top = top
        }

        // show.style.backgroundImage = box.style.backgroundImage 
        /**
         * 如果有这里有十几张图片 我们把放大镜的效果写死的话
         * 工作量是相当大的
         * 这里我们可以通过获取背景图的方式将这个box的背景图添加到show上面
         * 按照平时的思维 直接拿 style.样式 来写
         * 但当我们用 style.backgroundImage 的方式来写的时候 发现它皮了一下 获取到的是一片空白
         * 查阅资料后发现
         * 写在样式表里的样式是没办法直接用style来获取的
         * 而是用另一种方式 currentStyle（IE）跟 getComputedStyle。
         */
        var boxStyle = getStyle(box) // 获取style
        show.style.backgroundImage = boxStyle.backgroundImage // 传个url
        show.style.backgroundPosition = leftNum * -proportion + "px " + topNum * -proportion + "px" //根据 proportion半透明色块比例倍数进行背景定位
        show.style.backgroundSize = proportion * 100 + "% " // 放大倍数
    })
    function getStyle(dom) {

        // 封装一个获取样式的函数
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(dom);
        } else {
            return dom.currentStyle;
        }
    }

    box.addEventListener("mouseleave", function (e) {
        rect.style.opacity = 0
        show.style.display = "none"
    })
})

