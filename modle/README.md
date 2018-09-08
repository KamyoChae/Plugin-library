**需求**

写一个组件popModel

通过组件可以生成模态框（例子参考gif效果）

整个组件有HTML CSS 与 JS 参照使用示例

**使用**

HTML模板 给最外层特殊的属性data-popmodel-id  关闭模态框按钮也需要特殊属性data-popmodel-close

```html
 <div data-popmodel-id="mypopbox1" class="popbox">
   <div class="popbox_container">
    自定义内容
    <button data-popmodel-close="mypopbox1">Close</button>
   </div>
 </div>
```

JS

```js
var popmodel =   new popModel();
popmodel.open('mypopbox1');	    //打开模态框 传值是html当中特殊属性的值
popmodel.close('mypopbox1');	//关闭模态框 传值是html当中特殊属性的值
```

![](https://github.com/KamyoChae/Plugin-library/blob/master/modle/model.gif)
