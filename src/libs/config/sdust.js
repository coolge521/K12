/**
 * 山东科技大学
 */
const CONFIG = {
  API_HOST: 'http://hqxt.sdust.edu.cn',   //API访问地址
  SCREEN_HOST: 'http://hqxt.sdust.edu.cn/api/sdust',//大屏上下文地址
  SSO_BUTTON: true,//是否显示单点登录跳转按钮
  SSO_CODE_LOGIN: true,//是否显示学号/工号登录
  SSO_LOGIN_URL: 'http://hqxt.sdust.edu.cn/api',
  SSO_LOGOUT_URL: 'http://my.sdust.edu.cn/cas/logout?service=http://hqxt.sdust.edu.cn/api/sdust/#/main/login',
}

export default CONFIG;
