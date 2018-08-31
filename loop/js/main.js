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



    // 左右点击的动画效果
    btnLeft.addEventListener("click", function () {
        clearInterval(timo)
        var left = "left"
        move(btnLeft, left)
    }, false)

    btnRight.addEventListener("click", function () {
        clearInterval(timo)
        var right = "right"
        move(btnRight, right)
    }, false)

    var timo
    function autoPlay() {
        timo = setInterval(function () {
            move(btnRight, "right")
        }, 2000)
    }
    autoPlay()
    box.addEventListener("mouseleave",function(){
        autoPlay()
    },false)
    box.addEventListener("mouseenter",function(){
        clearInterval(timo)
    },false)

    var dotChild = boxDotted.children
    var goPage = null
    boxDotted.addEventListener("click", function (e) {
        /**
         * 点击小圆点
         * 感觉这里还能做得更好一下 点击小圆点是动画效果
         */
        dotChild = Array.prototype.slice.call(dotChild)
        dotChild.forEach(function (ele, index) {

            // 本来是return index  用goPage接收 但是返回undefined 就换个写法
            if (ele == e.target) {
                goPage = index
            }
        });
        boxUl.style.left = -myWidth * goPage + "px"
        for (var prop in dotChild) {
            dotChild[prop].className = ""
        }
        index = goPage
        dotChild[goPage].className = "active"
    }, false)

    dotChild[0].className = "active"
    var timer = null;
    var speed = 0;
    var key = 1; // 加锁 如果连续点击了 那就加快切换速度
    var index = 0; // 当前页数 通过页数来判断滑动页面到了第几页


    var op = null; // 用于保存上一次left值
    function move(ele, dire) {

        /**
         * 这是第三次重写了 
         * 第一第二次写的时候思路已崩QAQ 喵喵喵
         * 
         * 第一第二次想实现连续点击的功能
         * 思路是利用一个计算页面 点击了多少次 页面调到多少页 通过计算 页面宽度 mywidth * 页数 index 得出临界点，到达临界点就清除定时器
         * 但是写崩了 写到后来脑子里突然闪过几种写法 忍不住发了下呆在大脑模拟了一下 
         * 结果一下子思路混乱了 气得差点把猫的毛给拔光光~啊呀呀呀呀
         * 
         * 咳咳 第三次写的时候老实一点暂时不实现连续点击了
         * 点击左右两边的按钮都会触发滑动事件
         * 根据左右两边点击传进来的不同实参判断向左还是向右
         * 在触发这个函数前 我们需要遍历小圆点 把他们的active颜色都去掉
         * 
         * 开关开始之前 都得吧speed设为默认0 不然等下轮播图就会像火箭一样突突突突突飞上天
         * 
         * 大体思路是给一个值不断累加 并添加到原来的left里面 累加到宽度大小 就清除定时器
         * 
         */
        for (var prop in dotChild) {
            dotChild[prop].className = ""
        }

        if (key) {

            /**
             * 给个开关 
             * 先禁止自己无限的想象力 
             * 压制各种天马行空的想法 
             * 唯独留下自己沉鱼落雁 闭月羞...啊不，
             * 专注一个问题的思路（思考状）
            */

            key = 0
            speed = 0
            if (dire === "right") {
                if (index + 1 > dotted) {
                    /**
                    * index 的默认是0  第几页
                    * dotted 总共有多少页
                    * 如果到了最后一页 再点一下 
                    * 那就田螺宝宝（boxUl）就会生气了
                    * 宝宝一生气 辛辛苦苦点出来的图片都会被仍回到起点
                    * 扔回起点 boxUl.style.left = 0 + "px"
                    * 这还不行 把你的累加器（speed）啊 上一次的位置（op）啊 还有页数index
                    * 全都巴啦啦一下变成 0
                    */
                    boxUl.style.left = 0 + "px"
                    speed = op = 0
                    index = 0
                }

                index++  // 这货叫愚螺 只知道给页数增加 1 也不知道有没有被别人偷偷改成0
                if (index != dotted) {
                    // 君住长江头
                    // 我住长江尾
                    // 夜夜思君不见君
                    // 共饮长江水
                    // ————田螺歌
                    dotChild[index].className = "active"
                } else {
                    // 长江尾田螺姑娘的歌声终于传到了长江头的田螺公子那 （index = 5）
                    // 于是田螺公子做了一件特别的事情 
                    // 买了艘船开开心心说要去见田螺姑娘 （激活active）
                    dotChild[0].className = "active"
                }
                op = parseInt(boxUl.style.left) // 田螺公子追溯到上一次歌声传唱的小岛

                ele.timer = setInterval(function () {

                    /**
                     * 在小岛上 田螺公子花重金得知田螺姑娘 并不在此
                     * 于是又雇了25个船夫给自己划船 顺流而下 （speed = speed - 25）
                     * 从这个小岛出发 （op）
                     * 25个船夫像是疯了般卖力
                     * 划了八百里水路 （mywidth）
                     * 终于看到了一个小岛
                     * 船夫甲：“他奶奶的，再看不到岛老子都要饿死了”
                     * 
                     * 停船clearInterval(ele.timer)
                     * 卸锚 （speed = 0  key = 1）
                     */
                    speed -= 25
                    boxUl.style.left = op + speed + "px"
                    if (speed == -myWidth) { // index 2 3 4 5
                        clearInterval(ele.timer)
                        speed = 0
                        key = 1
                    }
                }, 1000 / 60)
            }

            if (dire === "left") {
                /**
                 * “蒹葭苍苍
                 * 白露为霜
                 * 所谓伊人
                 * 在水一方”
                 * 
                 * 田螺姑娘唱罢
                 * 与田螺公子相视一笑
                 * 看着25个船夫在夕阳的歌声中汗流浃背
                 * 心中一紧
                 * 往回张望
                 * 只见江面芦苇轻荡 炊烟袅袅 
                 * 而远处的灯火 
                 * 却是越来越暗 越来越暗
                 * 
                 */
                if (index - 1 < 0) {
                    boxUl.style.left = - myWidth * dotted + "px"
                    speed = op = 0
                    index = dotted
                }
                index--  // index 2 3 4 5
                if (index != 0) {
                    dotChild[index].className = "active"
                } else {
                    dotChild[0].className = "active"
                }
                op = parseInt(boxUl.style.left) // 保存上一次存储的位置
                ele.timer = setInterval(function () {
                    speed += 25
                    boxUl.style.left = op + speed + "px"
                    if (speed == myWidth) { // index 2 3 4 5
                        clearInterval(ele.timer)
                        speed = 0
                        key = 1
                    }
                }, 1000 / 60)
            }
        }


        /**
         * 一些总结
         * 1、forEach return index 是undefined 可能写法有问题
         * 2、一二次写 能实现连续点击 但点太快会飞 过程 写一个模块优化一个模块 结果写到最后自己也看不懂
         * 3、第三次 不实现连续点击  先用繁琐的办法写 然后慢慢优化重复的代码 思路没有混乱
         * 4、定时器的this不熟
         * 5、mouseleave 经常少写了个a
         * 
         */






        /* 重写一遍 结果 这个也是废弃的写法~~
        if (dire === "left") {

            index-- // 自减 用于显示小圆点
            if (index === 0) { // 如果点之前是第一张 向左点之后index是0 
                index = dotted  // 切换到最后一张 dotted 5
            } else {

            }

            boxUl.style.left = - myWidth * index + "px" // 通过计算上一次的值 与本次
            // 正常向左滑动 
            timer = setInterval(function () {
                /**
                 * 每次-25个像素 speed -= 25
                 * 如果-满了一个宽度  Math.abs(speed) == Math.abs(myWidth)
                 * 那就停止
                 */
        /*        speed += 25  // 每次加25像素
                op = parseInt(boxUl.style.left)
                boxUl.style.left = speed + "px"
                console.log(myWidth)
                if (Math.abs(myWidth) == Math.abs(speed)) {

                    console.log("停,speed=", speed)
                    clearInterval(timer)
                    speed = 0
                }
            }, 1000 / 60)
        }
        */
    }

    // 一开始是下面这个写法 写之前没写注释也没写思路 直接就凭感觉写 一心想着优化 最后被自己逼疯了QAQ 啊啊啊啊啊啊啊
    // 已废弃的写法
    function move1(direction) {
        var con = 40 // 移速
        var Natural = 0; // 用于确定方向 前进和后退

        for (var prop in dotChild) {
            dotChild[prop].className = ""
        }
        //  console.log(dotChild[index])

        if (direction == "right") {
            Natural = -1;
            index++;
            if (index == dotted) {
                index = 0
                boxUl.style.left = 0 + "px"
            }
        } else if (direction == "left") {
            Natural = 1;
            index--
            if (index == -1) {
                index = dotted - 1
            }
        }
        dotChild[index].className = "active"
        console.log(index)
        if (key) {
            key = 0; // 关闭重复点击
            if (index < 0) {
                index = dotted - 1
                speed = -myWidth * dotted
                boxUl.style.left = speed + "px"
            }
            timer = setInterval(function () {
                speed = speed + con * Natural  // Natural  负数 -1 
                boxUl.style.left = speed + "px"
                if (Math.abs(speed) == Math.abs(myWidth * index)) {

                    console.log(speed, myWidth * index)
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
