//导入css样式
require('./index.css')
var Toast = {}
Toast.install = function (Vue, options) {
    Vue.prototype.$animationOwn = (obj) => {
      // 1、创建构造器，定义好提示信息的模板
      //需要创建一个图片元素，需要图片路径，图片大小，图片起点和终点位置
        let AnimationTpl = Vue.extend({     
          //（在vue里面创建元素需要用规定的这种方法）
            render: function (createElement) {
              return createElement('img', {
                attrs: {
                  src: obj.src
                },
                style: {
                  width: obj.width + 'px',
                  height: obj.height + 'px',
                  //开始的位置的left值和top值
                  left: obj.start.left + 'px',
                  top: obj.start.top + 'px'
                },
                //类名
                'class': 'animationOwn'
              })
            }
        });
        // 2、创建实例，挂载到文档以后的地方
        let tpl = new AnimationTpl().$mount().$el;
        // 3、把创建的实例添加到body中  
        document.body.appendChild(tpl);
        //开始动画
        setTimeout(() => {
          //终点位置的left和top值
          tpl.style.left = obj.end.left + 'px'
          tpl.style.top = obj.end.top + 'px'
          tpl.style.transform = 'scale(0.1) rotate(180deg)'
          tpl.style.opacity = 0
        },100)

        // 4、延迟0.9秒后移除该提示     
        setTimeout(() => {        
            document.body.removeChild(tpl);
        }, 900)
    }
}
module.exports = Toast;