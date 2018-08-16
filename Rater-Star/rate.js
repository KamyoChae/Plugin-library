(function (rater) {
    window ? window.rater = rater : this.rater = rater
})(function rater(obj) {
    // 判断是否是对象
    console.log(obj)
    if (Object.prototype.toString.call(obj) !== "[object Object]") {
        throw new Error("rater需要一个对象作为参数，帮帮它")
    }
    // 判断是否输入了正确的dom节点
    if (!obj.element) { 
        /**
         * 老师源码里面写的是 if(typeof options.element === "undefined" || options.element === null) {throw new Error("需要一个dom节点")}
         * 但是我想的是 如果用户比较皮 把 obj.element = 0 
         * 这时候 typeof 0 是"number" 
         * 字符串"number"既不是undefined 也不是null 
         * 就不会抛出异常提醒了
         */
        throw new Error("请绑定一个正确的dom节点作为渲染") 
    }
    // 判断星星完整度
    if (obj.step) {
        if (obj.step > 1 || obj.step < 0) {
            throw new Error("请输入0-1之间的数")
        }
    }

    var showTT = null;
    if (obj.showTT == null) {

        // 如果showTT没有定义 则把showTT默认true
        obj.showTT = true
    } else {
        showTT = obj.showTT
    }
 
    // 获取传参
    var ele = obj.element; // 获取节点 父div
    var nums = obj.nums; // 获取默认星星数量 默认星数
    var max = obj.max; // 获取最多能有多少个星星 总星数
    var starSize = obj.starSize; // 星星有多大 像素
    var showTT = obj.showTT; // 要不要显示提示框 true false
    var step = obj.step; // 星星完整度  半个还是一个

    ele.classList.add("star-rating") // 在该节点增加一个class类名
    ele.style.width = max * starSize + "px" // 设定节点的宽度 星星宽度 = 星星数 * 星星像素大小
    ele.backgroundSize = starSize // 背景图片的覆盖状况 将其设为starSize像素大小一个单位
    ele.style.height = starSize + "px"// 背景div高度为一个星星的宽度 
    var div = document.createElement("div"); // 创建一个dom节点 用于显示黄色星星
    div.classList.add("star-value"); // 给该节点添加一个class类名

    // 上面是看了源码的写的 下面是自己的思考

    /**
     * 先进行默认的配置情况 
     * 默认多少个黄色星星 nums 
     * 要显示的有色星星宽度 width = nums * starSize + "px"
     */
    
    var showLen = null  // 显示有色星星的宽度
    showLen = nums * starSize + "px"
    div.style.width = showLen 
    ele.appendChild(div) // 将创建的节点作为子节点传入父div中

    /**
     * 鼠标滑动的时候 
     * 获取到鼠标位置距离左边的距离 oLeft 然后 除去 一个星星大小的宽度 starSize 并向上取整 得出多少个星星 num
     * 但是这里我们有一个需求
     * 用户自定义每次只能添加半个小星星 那就需要 mySize = starSize * step 来兼容半个小星星
     * 
     * 鼠标移动的时候还有个需求 显示提示框当前是几个星星
     * 我们可以通过自定义属性来完成 
     */
    // 鼠标滑动函数
    
    var moveLen = null;

    function moveFn(e){
        var oLeft = e.offsetX
            mySize = starSize * step
            num = Math.ceil(oLeft / mySize) // 星星数 
            moveLen = mySize * num
        div.style.width = moveLen + "px"
        if (showTT) {
            // 如果需要显示提示框 则给该组件设置提示框属性 当前星星数 / 总星星数
            ele.setAttribute("data-title", num * step + "/" + max)
        }
    }
    /**
     * 鼠标点击函数 和 鼠标离开函数
     * 鼠标点击的时候 其实已经知道了有多少个星星 num
     * 我们只需要把这几个星星的长度 存进一个变量里面 moveLen = mySize * num
     * 
     * 鼠标点击的时候就把这个movelen存进另一个值 widthLen里面 
     * 离开鼠标的时候还是用重新赋值的星星数量就好啦 nums
     */
    var widthLen = showLen; // 初始化宽度等于有色星星默认长度
    function clickFn (e){
        widthLen = moveLen
        div.style.width = widthLen + "px"
        console.log(widthLen)
    }

    /**
     * 鼠标离开函数
     * 当我们鼠标离开时
     * 希望有色星星长度恢复上一次点击的长度 
     * 我们就需要使用原先存储的widthLen作为标记了
     * 那么离开时 有色星星的长度就是 widthLen
     */
    function levFn(e){
        div.style.width = widthLen + "px"
    }
    ele.addEventListener("mousemove", moveFn)
    ele.addEventListener("click", clickFn)
    ele.addEventListener("mouseleave", levFn)

    // 大功告成
    /// 最后 表白超级有耐心有爱心的小蝉 半夜一两点还耐心回答我的问题~~
})