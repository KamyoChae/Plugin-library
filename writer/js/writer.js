function writer(container){

    /**
     * 这是一个构造函数
     * 
     */

     // 将this指向自身的这个特性保存起来 以解决定时器问题
    var _this = this
    //是否传了这个参数
    if (!container) {
        // 如果参数没有传进来 那就抛出异常
        throw new Error("必须要有一个参数")
    }
    _this.state = {

        // 私有化属性 一来防止变量污染 二来方便阅读理解
        element: null, // 节点
        wrapper: null, // 
        cursor: null, // 光标
        eventQueue: [], // 队列
        visibleString: '',
        lastFrameTime: null,
        pauseTime: null
    }
    if(typeof container === 'string'){

        // 如果输入的是一个字符串
        // 通过css3的节点选择器查询这个节点是否存在
        var element = document.querySelector(container)
        if (!element) {
            // 如果节点不存在 那就抛出一个异常
            throw new Error('您获取的dom有误')
        }

        // 如果这个节点存在 那就保存到一个对象里面的element属性
        _this.state.element = element
    }else{

        // 这一步意思是 如果传入的不是字符串 那就把这个节点放进这个对象的element里面 
        // 但是这里我们是否能准确的知道 传入的就是一个元素节点而不是一个文本节点 注释节点 或者文档碎片？
        // 所以我们在这里其实还可以做个判断

        if(container.nodeType == 1){

            _this.state.element = container
        }else{
            throw new Error("您传入的不是一个元素节点！")
        }
    }  
    //定义typeString这个函数
    _this.typeString = function(string){

        
        var characters = string.split(''); // 将这个string字符串分割成一个字符一个字符 存到characters里面
        characters.forEach(function(character){ // 遍历characters数组，将每一个值 作为参数传到一个函数addEventToQueue里面
            _this.addEventToQueue('ADD_STRING',character)
        })
        return _this // 返回this 实现链式调用
    }
    //删除
    _this.deleteAll = function(){
        _this.addEventToQueue('REMOVE_ALL',null) // 没看懂这个啥意思
        return _this // 返回this 实现链式调用
    }
    _this.delectChar = function(count){
        for(var i = 0;i < count;i++){ // 计数
            _this.addEventToQueue('REMOVE_CHAR',null)
        }
        return _this
    }
    _this.pauseFor = function(ms){
        _this.addEventToQueue('PAUSE_FOR',ms)
        return _this
    }
    //添加队列
    _this.addEventToQueue = function(eventName, eventArgs, flag){

        /**
         * 自定义一个函数
         * 三个参数 eventName eventArgs flag
         * 创建一个对象，将实参传到变量里面
         * 
         * 之前一直想不明白的是 eventName这个属性不会覆盖掉吗？
         * 后来明白了 每触发一次这个函数 都会重新var 一个对象eventItem
         * 然后如果flag这个开关如果是开 flag = true
         * 那就在eventQueue这个state对象eventQueue属性里面
         * 添加到最前面
         * 否则的话就添加到最后面
         */
        var eventItem = {
            // var一个中间件 用来给构造器的eventQueue数组添加子元素的
            eventName: eventName,
            eventArgs: eventArgs
        }
        if(flag){// 开关

            // 在数组最前面添加一个eventItem对象
            _this.state.eventQueue.unshift(eventItem)
        }else{
            // 在数组最后面添加一个eventItem
            _this.state.eventQueue.push(eventItem)
        }
        
    }
    //开始函数
    _this.start = function(){
        this.runEventLoop()
    }
    //队列里面的事件循环
    _this.runEventLoop = function(){
        if(!_this.state.eventQueue.length){
            // 如果队列里面什么都没有了 那就结束这个函数
            return
        }
        if(!_this.state.lastFrameTime){

            // 如果上一个时间为false 就给它一个新的时间
            _this.state.lastFrameTime = Date.now()
        }


        requestAnimationFrame(_this.runEventLoop) // 给动画帧一个事件 循环调用

        var nowTime = Date.now() // 查看当前时间
        var delay = nowTime - _this.state.lastFrameTime // 当前时间减去上次触发的时间  =  延迟时间
        var time = Math.floor(Math.random() * 101) + 100 // 随机生成100 ~ 200之间的正数
        if(delay < time){
            // 如果延迟时间小于这个随机数 那就结束这个函数
            return 
        }
        if(_this.state.pauseTime){

            // 如果pauseTime这个值存在
            if(nowTime < _this.state.pauseTime){

                // 如果当前时间小于暂停时间 结束函数
                return
            }

            // 如果这个事件不为空 并且小于当前时间 那就将这个值设为空
            _this.state.pauseTime = null
        }

        var currentEvent = _this.state.eventQueue.shift() // 删除队列里面最前面的一个数
        var eventName = currentEvent.eventName // 剩余队列面的对象的一个eventName属性
        var eventArgs = currentEvent.eventArgs // 剩余队列里面的一个eventArgs属性
        var visibleString = _this.state.visibleString // 用于拼接字符串的
        switch(eventName){

            // 这个操作可谓是十分灵性了，不断删除掉原来数组里面的元素 以达到更新eventName的原始值
            // 这个值只要改变 就会触发switch函数 然后就会将执行下面的字符串拼接
            case 'ADD_STRING':{
                visibleString = visibleString + eventArgs
                break
            }
            case 'REMOVE_ALL':{

                // 删除全部字符串 思路：把拼接的字符串全部分割 然后传入参数 触发删除事件
                var characters = _this.state.visibleString.split('')
                characters.forEach(function(character){
                    _this.addEventToQueue('REMOVE_CHAR',null,true)
                })
                break
            }
            case 'REMOVE_CHAR':{
                // 相当于删除事件了 
                visibleString = visibleString.slice(0,-1)
            }
            case 'PAUSE_FOR':{

                // 暂停
                _this.state.pauseTime = Date.now() + eventArgs
            }
        }
        _this.state.wrapper.innerText = visibleString // 将字符串显示出汗来
        _this.state.visibleString = visibleString //显示字符串
        _this.state.lastFrameTime = nowTime // 存储当前时间
    }
    
    //初始化
    _this.init = function(){

        /**
         * 初始化的一些操作
         * 创建节点 添加类名
         * 添加到指定元素
         * 
         */
        var wrapper = document.createElement('span')
        var cursor = document.createElement('span')
        cursor.innerText = '|'
        cursor.classList.add('writer_cursor')
        _this.state.element.appendChild(wrapper)
        _this.state.element.appendChild(cursor)
        _this.state.wrapper = wrapper
        _this.state.cursor = cursor
    }
    _this.init()
}
