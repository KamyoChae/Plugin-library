rater({
    starSize: 48,
    element:document.getElementById("app"),
    max: 5,
    showTT:true,

    step:.5, // 0-1 星星完整度 
    nums: 3, // 默认有色星星多少个

})
    /*
    * starSize：数字  可以设置星星的大小
    * element：dom节点 要把这个组件渲染到哪个dom节点上
    * max：数字 要显示星星的数量
    * showToolTip：布尔型 当hover的时候是否显示提示框
    * */