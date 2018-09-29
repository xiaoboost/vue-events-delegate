# vue-events-delegate
给`Vue`用的事件委托插件

## 加载
```JavaScript
import delegate from 'vue-events-delegate';

Vue.use(delegate);
```

## 使用

### `vue`指令

```html
<div v-delegate:click.left.capture="['.events-delegate', callback]"></div>
```

指令名称为`v-delegate`，支持所有`DOM`事件，事件修饰符与`vue`自带的相同，语义也相同。
后面的参数有两个，第一位的字符串是事件委托的`DOM`选择器，这里的语义与`JQuery`相同，后者是事件回调。

### `vue`方法
这里在`vue`原型链上提供了三个方法，分别是：绑定、解绑和触发。
具体请看类型说明，这里就不再赘述：[types.d.ts](https://github.com/xiaoboost/vue-events-delegate/blob/master/types/index.d.ts)

## **注意**
说明文档写的很简略，主要是因为该项目只是我自己练习用的，且并不准备发布。
在 Vue 上使用事件委托，其实并不推荐，说到底事件委托的优势主要有两个：
1. 帮你保存你的回调数据，让你在解除绑定的时候不再需要提供回调函数的参数
2. 在列表数据中用事件委托可以节省内存开销

然而这两点 Vue 都已经帮你做了，在 Vue 框架中甚至不需要你手动解除绑定，组件被销毁后自动就解除绑定了。对于第二点，在列表渲染中，Vue 也会对回调做处理，实际上绑定的都是同一个回调。
在实际的使用中，手动的使用事件委托其实也并不复杂，你当然可以手动的把事件绑定在`ul`上，然后对下属的`li`事件进行委托。

## License
MIT License
