function writer(container) {
    var that = this

    that.state = {
        // 用于存变量
        element: null,  // 节点
        queue: [], // 数组队列
        visitStr: "" // 拼接字符串
    }
    if (container.nodeType == 1) {
        that.state.element = container
    } else if (typeof container === 'string') {
        var node = document.querySelector('container')
        if (node) {
            that.state.element = container
        }
    } else {
        new Error('传入的节点有误！')
    }
    that.addToQueue = function (queueType, char, flag) {
        var obj = {
            queueType: queueType,
            char: char
        }
        if (flag) {
            that.state.queue.unshift(obj)
        } else {
            that.state.queue.push(obj)
        }

    }
    that.typeString = function (str) {
        var arr = str.split("")
        arr.forEach(function (char) {
            that.addToQueue("add-all", char)
        });
        return that
    }
    that.deleteAll = function () {
        _this.addEventToQueue('remove-all', null) // 没看懂这个啥意思
        return _this // 返回this 实现链式调用
    }
    that.delectChar = function (num) {

        // 删除函数 其实也不算是删除 只是置空了
        for (var i = 0; i < num; i++) {
            that.addToQueue("remove-chart", null)
        }
        return that
    }
    // deleteAll和delectChar这两个函数名在调试的时候搞混了~~ 
    // 当时delectChar当成deleteAll来使 结果把字符串全部删了
    // 那感觉跟走路小心 手里的一碗香喷喷的田螺被人撞了一地般蓝瘦
    // 咕叽咕叽


    that.pauseFor = function (dur) {
        /**
         * 接下来实现暂停效果
         * 思路：通过传入来的时间 在当前时间的基础上累加
         * 累加完了加入循环 通过比较累加时间和当前时间的差判断是否结束延迟效果
         * 如果当前时间没有到达累加时间 那就结束这个函数 
         */
        that.addToQueue("pause", dur)
        return that
    }
    that.start = function () {
        that.loop()
    }
    that.loop = function () {
        if (!that.state.queue.length) {
            // 这个是用来做打完字之后的停顿效果的 
            // 原因是打完字 数组被提取完了 就变成空 否则就执行下面的函数
            // 如果队列里面什么都没有了 那就结束这个函数
            return
        }
        

        // 如果单单是在这样写 函数只会执行一次
        // 所以我们还需要给它添加一个动画帧用来实现递归
        requestAnimationFrame(that.loop)
        // 由于动画帧每隔16.66666666毫秒就会刷新一次，原因是动画帧随浏览器刷新而刷新
        // 所以我们需要做一个延迟效果

        /**
         * 延迟思路 通过Date.now()来获取当前时间
         * 第一次运行 将当前时间存进一个变量lastTime里面 如果这个变量还没赋值 就给这个变量装上当前时间
         * 
         * 继续获取当前时间 如果当前时间nowTime-上次存入的时间lastTime小于某个值 
         * 就直接return结束函数 直到大于的时候才放行
         * 放行之后 等本次函数执行完毕 就把当前时间存入lastTime作为下一次比较的时间
         * 如果不存入lastTime 就会在下一次执行的时候不遵守交通规则而一下子打印出来 喵喵喵
         * 通过这个方式 实现了延迟效果
         * */
        if (!that.state.lastTime) {
            that.state.lastTime = Date.now()
        }
        var nowTime = Date.now()
        var resTime = nowTime - that.state.lastTime
       
        if (that.state.pause) { 

            /**
             * 这里做一下暂停效果
             * 利用that.state.pause作为开关
             * 如果没有执行暂停的指令 这个属性是为undefined的
             * 当执行指令后 这个属性等于当时时间 + 所设定的时间
             * 
             * 如果暂停的时间比这次时间长 那就不执行下面的函数
             * 从而生成延迟效果
             */
                 
            if (nowTime < that.state.pause) {
                return
            }else{
            //    that.state.pause = null
            }
        }

        // --------------------------
        // 如果我们还想要有在打印字过程中
        // 出现一种如同吃田螺煲时
        // 那种吸田螺般的抑扬顿挫之感
        // 还可以做一个随机数来作为比较缓冲打字 
        // 喵喵喵
        // --------------------------
        var time = Math.ceil(Math.random() * 100) + 100
        if (resTime < time) {
            return
        }


        // 循环删除队列里面的东西
        var shifObj = that.state.queue.shift() // 提取出数组最前面的元素 由于是直接提取的 会改变数组 直至数组为空
        // 通过判断不同的数组里面的元素含有不同类型 objType 执行不同的操作
        var objType = shifObj.queueType
        var objChar = shifObj.char
        var visitStr = that.state.visitStr // 用于拼接字符串 
        switch (objType) {

            /**
             * 这个操作可谓是十分灵性了
             * 之前一直卡在这，原因是没想明白是怎么实现从一个指令调到另一个指令的
             * 后来做源码笔记的时候在控制台输出一下that.state.queue这个数组 
             * 才知道原来在html里面早已把对应的指令装载好
             * 程序执行start之前，那些设置都已经生效 所有执行效果都早已传到了数组里面
             * start一循环 大大小小的一整煲田螺就会老老实实按照对应的标记进到这个switch的锅来
             */

            case "add-all": {
                visitStr = visitStr + objChar // 拼接成一串
                break
            }
            case "remove-all": {
                /**
                 * 如果我们想删除 可以从之前保存下来的字符串副本visitStr进行操作
                 * 首先我们可以把它分割开来
                 * 然后遍历每一个 同时给它加上一个re-chart指令
                 * 用于触发一个个删除字符的效果
                 * 要删除多少个 完全取决于前面delectChar函数存了多少个remove-all
                 */
                var charlist = that.state.visitStr.split("")
                charlist.forEach(function (ele, index) {
                    that.addToQueue("remove-chart", null, true)
                })
                break
            }
            case "remove-chart": {
                // 如果想要删除 可以利用一个数组方法slice()

                visitStr = visitStr.slice(0, -1)
                break
            }
            case "pause": {
                that.state.pause = Date.now() + objChar
            }
        }
        that.state.text.innerHTML = visitStr // 将字符串显示出来
        that.state.visitStr = visitStr // 用一个空间存起来 用于删除
        that.state.lastTime = nowTime // 将最新的时间戳存到旧一个变量里面
    }

    that.init = function () {
        // 初始化
        var text = document.createElement('span')
        var line = document.createElement('span')
        line.innerHTML = "|"
        line.classList.add("writer_cursor")
        that.state.element.appendChild(text)
        that.state.element.appendChild(line)

        // 存进一个地方
        that.state.text = text
        that.start.line = line

    }
    that.init()


}


/**
 * 听说感冒了多笑笑会好得快一些~~
 * -----------------------------
 * 电梯里，小屁孩看了我一眼：“叔叔好！叔叔你真帅！”
 * 我心想，咦，这孩子家教真好，正美着呢！
 * 他妈说：“那个。。。孩子没见过世面，就会瞎说，看谁都说帅，真不好意思。”
 * 我：(╯°Д°)╯︵ ┻━┻
 * -----------------------------
 * 甲：
 * “你说，我学个什么乐器，
 * 才能突出我这古典清雅端庄的气质？
 * 不要太复杂，我懒，最好能速成。” 
 * 
 * 乙：
 * “木鱼。”
 * -----------------------------
 * 我有个邻居，名字叫朱川，他妈妈每次给他买衣服，都会跟人说这是买给我们家朱川的……
 * -----------------------------
 * 咕叽咕叽~~ 
 * */
