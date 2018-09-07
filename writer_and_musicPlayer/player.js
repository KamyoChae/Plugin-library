
var myWriter = new writer(document.getElementById("writer"))

var lrcQueue // 借用队列思想
(function () {
    /**
     * 借用队列思想 初始化歌词
     */
    lrcQueue = []
    var getLrc = lrc
    var newArr = getLrc.split("[")
    newArr.forEach(function (index) {
        var arr = index.split("]")
        if (typeof arr[1] !== 'undefined') {
            // 先来个判断 除去空字符
            var enter = {
                enterTime: arr[0],
                enterText: arr[1]
            }
            lrcQueue.push(enter)
        }
    })
}())

/**
 * 根据构造函数 得出
 * 1.我们需要输入歌词到typeString里面
 * 2.根据上下两句歌词的时间计算出时间间隔 传入pauseFor
 * 3.需要计算出这行歌词一共有几个字(通过字符串.length) 然后传入字数 删除掉所有字符 
 * 3.将新的歌词传入下一句
 * 4.最后执行
 * 
 * 发现规律：重复的typeString、pasuseFor和delectChar
 * myWriter.typeString("that sounds good ")
    .pauseFor(2000)
    .delectChar(3)
    .typeString("大帅比")
    .start()
 */

/**
 * 思路：
 * 第一种思路：
 * 把typeString、pasuseFor和delectChar当成字符串，
 * 中间插入变量，然后前后加上myWriter和.start() 
 * 合并成一整条字符串，到evel里面执行
 * 不过这种思路好投机啊~~喵喵喵？
 * 
 * 
 * 第二种思路：
 * 用递归？用递归感觉上是可行的，不过还没想明白怎么递...
 * 
 */
// 为了不扼杀自己的想象力
// 我决定还是用鬼畜的字符串拼接来实现吧..QAQ
// 等哪天想到了解决的方式，再回来优化一下代码
// 一个多小时后....
// 经过我一个多小时的努力，发现第一种方法是用不了的，
// 因为eval不能执行带有引用值的代码 
// 哭瞎 (´థ౪థ)σ 


/* 亮瞎了的eval思路
var str = null
Object.prototype.render = function(array) {
    var timeArr = array // 用来遍历的
   
    //   分析：
    //   typeString(这里写上第一个字符串)
    //     .pauseFor(这里写上第二个字符串的时间减去第一个字符串的时间)
    //     .delectChar(这里写上第一个字符串的长度)
    //     前后记得拼接
     
    
    str = "myWriter." // 拼接头
    for (var i = 1; i < timeArr.length; i++) {
        str += "typeString('" + timeArr[i].enterText + "')"
            + ".pauseFor(" + puassTime(timeArr, i) + ")" +
            ".delectChar(" + timeArr[i].enterText.length + ")"
    }
    str += ".start()"

    return str 
}

eval(render(lrcQueue))


*/



// 愉快的下午又开始了 
// 经过上午的折腾 睡梦中隐约想到了解决的方式

// 中午梦到的思路：先别管那么多，想捉田螺，撩起裤脚下河摸，发现一只捉一只！

function render(arr) {
    /**
     * 根据构造函数 得出
     * 1.我们需要输入歌词到typeString里面
     * 2.根据上下两句歌词的时间计算出时间间隔 传入pauseFor
     * 3.需要计算出这行歌词一共有几个字(通过字符串.length) 然后传入字数 删除掉所有字符 
     * 3.将新的歌词传入下一句
     * 4.最后执行
     * 
     * 发现规律：重复的typeString、pasuseFor和delectChar
     * myWriter.typeString("that sounds good ")
        .pauseFor(2000)
        .delectChar(3)
        .typeString("大帅比")
        .start()
    */
    arr.forEach(function (ele, index) {
        var dur = puassTime(arr, index)
        myWriter.typeString(ele.enterText)
            .pauseFor(dur)
            .delectChar(ele.enterText.length)

    })

}
render(lrcQueue)


// 由于时间间隔计算量较大 我们独立出来封装成一个函数
// arr:需要遍历的数组 index 数组索引号，用于计算前后
function puassTime(arr, index) {
    index += 1
    var result = null // 用于存储结果 返回
    // 00:04:60
    // 00:26:39
    //
    // 如何计算两个数之间的间隔？
    // 第一种情况 后面的数比前面的大 秒*100 加上毫秒 直接减
    // 第二种情况 后面的数比前面的小 后面的直接加上60 *100 加上毫秒 再减去前面的
    // 完美！喵喵喵
    // 
    //
    if (!arr[index + 1]) {
        // 如果超出了最后一条 则表示结束
        return
    }
    var lastT = null // 用来记录时间
    var nowT = null  // 用来记录时间 两者相减乘上1000 就是需要暂停打字的时间
    lastT = arr[index - 1].enterTime.split(":") // 分割成一个数组 里面有分秒
    nowT = arr[index].enterTime.split(":") // 分割成一个数组 里面有分秒

    nowSec = Number(nowT[1])  // 秒
    nowMi = Number(nowT[2]) // 毫秒
    lastSec = Number(lastT[1]) // 上局歌词的秒
    lastMi = Number(lastT[2]) // 上句歌词的毫秒

    if (nowSec) {

        if (nowSec < lastSec) {
            if (nowMi < lastMi) {
                result = (nowSec + 59 - lastSec) * 100 + nowMi + 100 - lastMi
            } else {
                result = (nowSec + 60 - lastSec) * 100 + nowMi - lastMi
            }
        } else {
            if (nowMi < lastMi) {
                result = (nowSec - 1 - lastSec) * 100 + nowMi + 100 - lastMi
            } else {
                result = (nowSec - lastSec) * 100 + nowMi - lastMi
            }

        }
    }

    if (index != 30) {
        return result * 5
    } else {
        console.log(999, index)
        // 这里用的是一个索引 写死了 
        // 如果实际可以在副歌部分打个标记 前端获取的时候可以根据标记判断有没有到副歌部分
        // 副歌部分 清除半个间隔时间
        // 这个bug查了我一个小时 最后用手机秒表计时才找出bug 哭晕QAQ 喵喵喵
        return result * 10
    }

}

var btn = document.getElementsByClassName('btn')[0]
var btnAfter = document.getElementsByClassName('btnAfter')[0]
var cd = document.getElementsByClassName('cd')[0]
var cdBox = document.getElementsByClassName('cd-box')[0]
var audio = document.getElementsByTagName("audio")[0]
var show = document.getElementsByClassName('show')[0]
function playing() {
    audio.play()
    myWriter.start()
}
cdBox.addEventListener("click", function () {
    console.log(lrcQueue)
    playing()
})
var flag = true
cd.addEventListener("click",function(){
    if(flag){
        flag = false
        btn.classList.add('larg1')
        btnAfter.classList.add('larg2')
        cdBox.classList.add('rotate')
        
        show.style.display = "none"
    }else{
        flag = true
        btn.classList.remove('larg1')
        btnAfter.classList.remove('larg2')
        cdBox.classList.remove('rotate')
        show.style.display = "block"
    }
})