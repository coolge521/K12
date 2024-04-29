/**
 * 优圈常量参数
 */

import test from "./config/test.js";
import product from "./config/product.js";
import cqsdzy from "./config/cqsdzy.js";
import xjau from "./config/xjau.js";
import sdust from "./config/sdust.js";
import util from "./util.js";

/**
 * ☆☆☆☆☆ 常量数据切换 ☆☆☆☆☆
 * 每次执行前配置正确的参数名称，可选值有:
 * test - 内测
 * product - 正式
 * cqsdzy - 重庆水电
 * xjau - 新疆农大
 * sdust - 山东科技大学
 */
const CUR_CONFIG_NAME = 'test';


var CUR_CONFIG = {API_HOST: 'http://dantincloud.com:9000', SCREEN_HOST: 'http://dantincloud.com:9000'};
switch (CUR_CONFIG_NAME) {
  case "test"://内测
    CUR_CONFIG = test;
    break;
  case "product"://正式
    CUR_CONFIG = product;
    break;
  case "cqsdzy"://重庆水电
    CUR_CONFIG = cqsdzy;
    break;
  case "xjau"://新疆农大
    CUR_CONFIG = xjau;
    break;
  case "sdust"://山东科技大学
    CUR_CONFIG = sdust;
    break;
}

let ucConfig = {
  API_HOST: CUR_CONFIG.API_HOST,   //API访问地址
  SCREEN_HOST: CUR_CONFIG.SCREEN_HOST,//大屏上下文地址
  SSO_BUTTON: CUR_CONFIG.SSO_BUTTON ? CUR_CONFIG.SSO_BUTTON : false,//是否显示单点登录跳转按钮
  SSO_CODE_LOGIN: CUR_CONFIG.SSO_CODE_LOGIN ? CUR_CONFIG.SSO_CODE_LOGIN : false,//是否显示学号/工号登录
  SSO_LOGIN_URL: CUR_CONFIG.SSO_LOGIN_URL ? CUR_CONFIG.SSO_LOGIN_URL : '/',//单点登录URL
  SSO_LOGOUT_URL: CUR_CONFIG.SSO_LOGOUT_URL ? CUR_CONFIG.SSO_LOGOUT_URL : '/',//单点登录登出URL
  WELCOME_IMAGE: CUR_CONFIG.WELCOME_IMAGE ? CUR_CONFIG.WELCOME_IMAGE : 'welcome.png',//首页欢迎背景图
  COPYRIGHT: CUR_CONFIG.COPYRIGHT ? CUR_CONFIG.COPYRIGHT : '',//版权信息
};

ucConfig.changeServer=function(name){
  switch (name) {
    case "test"://内测
      CUR_CONFIG = test;
      break;
    case "product"://正式
      CUR_CONFIG = product;
      break;
    case "cqsdzy"://重庆水电
      CUR_CONFIG = cqsdzy;
      break;
    case "xjau"://新疆农大
      CUR_CONFIG = xjau;
      break;
    case "sdust"://山东科技大学
      CUR_CONFIG = sdust;
      break;
  }
    this.API_HOST=CUR_CONFIG.API_HOST  //API访问地址
    this.SCREEN_HOST= CUR_CONFIG.SCREEN_HOST//大屏上下文地址
    this.SSO_BUTTON= CUR_CONFIG.SSO_BUTTON ? CUR_CONFIG.SSO_BUTTON : false//是否显示单点登录跳转按钮
    this.SSO_CODE_LOGIN= CUR_CONFIG.SSO_CODE_LOGIN ? CUR_CONFIG.SSO_CODE_LOGIN : false//是否显示学号/工号登录
    this.SSO_LOGIN_URL= CUR_CONFIG.SSO_LOGIN_URL ? CUR_CONFIG.SSO_CODE_LOGIN : '/'//单点登录URL
    this.SSO_LOGOUT_URL= CUR_CONFIG.SSO_LOGOUT_URL ? CUR_CONFIG.SSO_LOGOUT_URL : '/'//单点登录登出URL
    this.WELCOME_IMAGE= CUR_CONFIG.WELCOME_IMAGE ? CUR_CONFIG.WELCOME_IMAGE : 'welcome.png'//首页欢迎背景图
    this.COPYRIGHT= CUR_CONFIG.COPYRIGHT ? CUR_CONFIG.COPYRIGHT : ''//版权信息

    util.setSession('host',CUR_CONFIG.API_HOST)

}
export default ucConfig;
