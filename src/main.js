// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/store'
import 'babel-polyfill'


import load from './libs/loading.js' // 引入loading
import ucConfig from "@/libs/ucConfig.js";
import iView from 'view-design'; //iView
import 'view-design/dist/styles/iview.css' // 使用 CSS
import '@/assets/css/reset.css'; //引入重置样式
import '@/assets/uc.css'; //引入自定义样式
import BaiduMap from 'vue-baidu-map' //百度地图
import VueLazyload from 'vue-lazyload' //引入这个懒加载插件
import Filters from "@/libs/dictionary.js"; //全局过滤器集合
import ucApi from "@/libs/ucApi.js";
import util from "@/libs/util.js";
import dateUtil from "@/libs/dateUtil.js";
import {custom, fetch, fetchBlob, fetchHtml, patch, post, put, ucdelete} from './libs/vueAxios.js';



import moment from 'moment' //导moment 时间
import VideoPlayer from 'vue-video-player'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'
import axios from 'axios'


//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.use(load) // 全局使用loading
Vue.prototype.$ucconfig = ucConfig;

Vue.use(iView, {transfer: true,size: 'small'});


// Vue.prototype.$load = Spin;//全局loading

Vue.use(BaiduMap, {//地图ak码
  ak: 'aEG97Ej8A7wXq2WiWcO1UQKnGErsn8fl'
})

Vue.use(VueLazyload);

// 或者添加VueLazyload 选项
Vue.use(VueLazyload, {
  preLoad: 1,
  error: 'assets/logo.png',
  // loading: require('static/images/load.gif'),
  attempt: 1
});


for (let key in Filters) {
  Vue.filter(key, Filters[key])
}
Vue.prototype.$Filters = Filters;


Vue.prototype.$moment = moment;
moment.locale('zh-cn');


Vue.use(VideoPlayer)

Vue.config.productionTip = false;

Vue.prototype.$api = ucApi;
Vue.prototype.$util = util;
Vue.prototype.$dateUtil = dateUtil;

Vue.prototype.$post = post;
Vue.prototype.$custom = custom;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
Vue.prototype.$delete = ucdelete;
Vue.prototype.$fetchBlob = fetchBlob;
Vue.prototype.$fetchHtml = fetchHtml;




// Vue.use(VueAwesomeSwiper)


Vue.prototype.$axios = axios;
// axios.interceptors.request.use(config => {
//   Spin.show({
//     render: (h) => {
//       return h('div', [
//         h('Icon', {
//           'class': 'demo-spin-icon-load',
//           props: {
//             type: 'ios-loading',
//             size: 26
//           },
//         }),
//         h('div', {
//           style:{
//             fontSize:'14px'
//           }
//         },'加载中,请稍后')
//       ])
//     }
//   });//全局loading
//   return config
// }, error => {
//
//   return Promise.reject(error)
// })
//
//
// axios.interceptors.response.use( // 回复拦截
//   response => {
//     Spin.hide();
//     return response
//   },
//   error => {
//     Spin.hide();
//     return Promise.reject(error)
//   }
// )



router.beforeEach((to, from, next) => {

  let nickName = sessionStorage.getItem('user');
  if (nickName) {
    if(to.name == null){
      next({
        path: '/main/login',
      })
    }else {
      next();
    }
  }else {
    if(to.path === '/main/login'){
      next();
    }else{
      next({
        path: '/main/login',
      })
    }
  }
})
//这是ie10及以下不支持dataset导致的，而iview的transfer-dom.js使用了这个属性

if (window.HTMLElement) {

  if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {

    Object.defineProperty(HTMLElement.prototype, 'dataset', {

      get:function () {

        var attributes =this.attributes; // 获取节点的所有属性

        var name = [];

        var value = []; // 定义两个数组保存属性名和属性值

        var obj = {}; // 定义一个空对象

        for (var i =0; i < attributes.length; i++) {// 遍历节点的所有属性

          if (attributes[i].nodeName.slice(0, 5) ==='data-') {// 如果属性名的前面5个字符符合"data-"

// 取出属性名的"data-"的后面的字符串放入name数组中

            name.push(attributes[i].nodeName.slice(5));

            // 取出对应的属性值放入value数组中

            value.push(attributes[i].nodeValue);

          }

        }

        for (var j =0; j < name.length; j++) {// 遍历name和value数组

          obj[name[j]] = value[j]; // 将属性名和属性值保存到obj中

        }

        return obj; // 返回对象

      },

    });

  }

}


//解决iview在IE9中list方法报错的问题

if (!('classList' in document.documentElement)) {

  Object.defineProperty(HTMLElement.prototype, 'classList', {

    get:function () {

      var self =this;

      function update(fn) {

        return function (value) {

          var classes = self.className.split(/\s+/g);

          var index = classes.indexOf(value);

          fn(classes, index, value);

          self.className = classes.join(' ');

        };

      }

      return {

        add:update(function (classes, index, value) {

          if (!~index) classes.push(value);

        }),

        remove:update(function (classes, index) {

          if (~index) classes.splice(index, 1);

        }),

        toggle:update(function (classes, index, value) {

          if (~index) { classes.splice(index, 1); }else { classes.push(value); }

        }),

        contains:function (value) {

          return !!~self.className.split(/\s+/g).indexOf(value);

        },

        item:function (i) {

          return self.className.split(/\s+/g)[i] ||null;

        },

      };

    },

  });

}


// axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
//
// axios.defaults.headers.get['Content-Type'] ='application/x-www-form-urlencoded';
//
// axios.defaults.transformRequest = [function (data) {
//
//   let ret =''
//
//   for (let it in data) {
//
//     ret +=encodeURIComponent(it) +'=' +encodeURIComponent(data[it]) +'&'
//
//   }
//
//   return ret
//
// }]


//解决IE9中不支持foreach的解决方法

if ( !Array.prototype.forEach ) {

  Array.prototype.forEach =function forEach( callback, thisArg ) {

    var T, k;

    if (this ==null ) {

      throw new TypeError("this is null or not defined" );

    }

    var O = Object(this);

    var len = O.length >>>0;

    if (typeof callback !=="function" ) {

      throw new TypeError( callback +" is not a function" );

    }

    if ( arguments.length >1 ) {

      T = thisArg;

    }

    k =0;

    while( k < len ) {

      var kValue;

      if ( k in O ) {

        kValue = O[ k ];

        callback.call( T, kValue, k, O );

      }

      k++;

    }

  };

}

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
