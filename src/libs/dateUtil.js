let dateutil = {}

//获取某个日期的0点
dateutil.zero = function (date) {
  var _date = new Date();
  if (date) {
    _date = new Date(date);
  }
  _date.setHours(0, 0, 0);
  return _date;
}

//计算两个时间的分钟差
dateutil.minutes = function (start, end) {
  var dateDiff = end.getTime() - start.getTime();//时间差的毫秒数
  var minutes = Math.floor((dateDiff / (60 * 1000)));
  return minutes;
}


//计算当前时间和0点之间的时间差
dateutil.minutesZero = function (date) {
  var zero = this.zero(date);
  return this.minutes(zero, date);
}

//将与0点时间差的分钟值转换为时分形式
dateutil.minutesToTime = function (minutes) {
  var hour = Math.floor(minutes / 60);
  var minute = Math.floor(minutes % 60);
  var _date = new Date();
  _date.setHours(hour, minute, 0);
  return _date.format('HH:mm');
}

//时间格式的字符串转换为距当天0时的分钟数字
dateutil.timeToNumber = function (time) {
  var strs = time.split(":");
  var number = Math.floor(60 * parseInt(strs[0]) + parseInt(strs[1]));
  return number;
}


Date.prototype.format = function (pattern) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(pattern)) pattern = pattern.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(pattern)) pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return pattern;
}

export default dateutil
