let util = {}
util.getLocal = function (key) {
  if(key=='college' && window.localStorage.getItem(key)==null){
    return JSON.parse(window.sessionStorage.getItem('user')).collegeId
  }else{
    return JSON.parse(window.localStorage.getItem(key))
  }

}
util.setLocal = function (key, obj) {
  window.localStorage.setItem(key, JSON.stringify(obj))
}
util.removeLocal = function (key) {
  window.localStorage.removeItem(key)
}
util.clearLocal = function (key) {
  window.localStorage.clear()
}
util.getSession = function (key) {
  return window.sessionStorage.getItem(key)=='undefined'?'':JSON.parse(window.sessionStorage.getItem(key))
}
util.setSession = function (key, obj) {
  window.sessionStorage.setItem(key, JSON.stringify(obj))
}
util.removeSession = function (key) {
  window.sessionStorage.removeItem(key)
}
util.claerSession = function (key) {
  window.sessionStorage.clear(key)
}

// 制保留2位小数，如：2，会在2后面补上00.即2.00
util.toDecimal2 = function (x) {
  let f = parseFloat(x)
  if (isNaN(f)) {
    return false
  }
  f = Math.round(x * 100) / 100
  let s = f.toString()
  let rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}

//数组对象去重
util.myunique = function (arr) {
  let result = [], hash = {};
  for (let i = 0, f_code; (f_code = arr[0]) != null; i++) {
    if (!hash[f_code]) {
      result.push(f_code);
      hash[f_code] = true;
    }
  }
  return result;
}

util.hidePhoneNumber=function(phoneNumber){
  let reg = /^(\d{3})\d*(\d{4})$/;
  let phone = phoneNumber.replace(reg,'$1****$2')
  return phone
}

util.BdToGd=function(bd_lng, bd_lat){
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return {longitude: gg_lng, latitude: gg_lat}
}

util.checkPasswordRole1=function (pwd){
  var patter=/^[a-zA-Z0-9~!@#$%^&*()_+|<>,.?/:;'[{}\]]{8,16}.*$/
  if(pwd.trim().length>0 && patter.test(pwd)){
    return true;
  }else{
    return false;
  }
}

util.checkPasswordRole2=function (pwd) {
  var patter1 = /^(?=.*[a-z|A-Z])/
  var patter3 = /^(?=.*\d)/
  var patter4 = /^(?=.*[~!@#$%^&*()_+|<>,.?/:;'[{}\]])/

  let kind = 0;
  if (pwd.trim().length > 0 && patter1.test(pwd)) {
    kind++;
  }
  if (pwd.trim().length > 0 && patter3.test(pwd)) {
    kind++;
  }
  if (pwd.trim().length > 0 && patter4.test(pwd)) {
    kind++;
  }

  if (kind >= 2) {
    return true;
  } else {
    return false;
  }
}

util.convertCurrency=function (money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  // 传入的参数为空情况
  if(money == '') {
    return '';
  }
  money = parseFloat(money)
  if(money >= maxNum){
    return ''
  }
  // 传入的参数为0情况
  if(money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr
  }
  // 转为字符串
  money = money.toString();
  // indexOf 检测某字符在字符串中首次出现的位置 返回索引值（从0 开始） -1 代表无
  if(money.indexOf('.') == -1){
    integerNum = money;
    decimalNum = ''
  }else{
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0,4);
  }
  //转换整数部分
  if(parseInt(integerNum,10) > 0){
    let zeroCount  = 0;
    let IntLen = integerNum.length
    for(let i = 0; i < IntLen; i++){
      let n = integerNum.substr(i,1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if( n == '0'){
        zeroCount ++ ;
      }else{
        if(zeroCount > 0){
          chineseStr += cnNums[0]
        }
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if(m == 0 && zeroCount < 4){
        chineseStr += cnIntUnits[q];
      }
    }
    // 最后+ 元
    chineseStr += cnIntLast;
  }
  // 转换小数部分
  if(decimalNum != ''){
    let decLen = decimalNum.length;
    for(let i = 0; i <decLen; i++){
      let n = decimalNum.substr(i,1);
      if(n != '0'){
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if(chineseStr == ''){
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  }else if(decimalNum == ''){
    chineseStr += cnInteger;
  }

  return chineseStr
}



export default util
