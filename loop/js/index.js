loop({
    box:document.getElementsByClassName("box")[0], // 包含点击按钮 图片组 小圆点的div
    btnLeft:document.getElementsByClassName("btn-left")[0], // 向左
    btnRight:document.getElementsByClassName("btn-right")[0], // 向右
    boxDotted:document.getElementsByClassName("box-dotted")[0], // 小圆点ul 用于事件委托
    boxUl:document.getElementsByClassName("box-ul")[0], // 装载图片的ul 用于改变宽度 
    dotted: 5, // 显示多少个小圆点li
})
