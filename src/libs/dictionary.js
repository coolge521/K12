import store from '../store/store'
import dateutil from "./dateUtil";

let Filters;
Filters = {
  sexType: (value) => {
    switch (value) {
      case 0:
        return value = "男"
      case 1:
        return value = "女"
      case '0':
        return value = "男"
      case '1':
        return value = "女"
    }
  },

  // titleType: (value) => {
  //   switch (value) {
  //     case 'repair':
  //       return value = "校园保修"
  //     case 'car':
  //       return value = "通勤车"
  //     case 'apartment':
  //       return value = "公寓管理"
  //     case 'equipment':
  //       return value = "设备管理"
  //     case 'appraisal':
  //       return value = "实习考评"
  //     case 'patrolSignIn':
  //       return value = "巡逻签到"
  //   }
  // },
  percent: (a, b) => {
    if(b!=0){
      return a = Math.round(a / b * 10000) / 100.00 + "%"
    }else{
      return '0%';
    }

  },
  //type传以下类型
  //0-兴趣爱好； 1-警报类型； 2-民族； 3-情感状态； 4-政治面貌；5-行业类型；6-学历；7-在职离职状态；8-员工类型
  //9-举报取消原因；10-举报关闭原因；11-兴趣圈类别；12-举报类型；13-婚姻状态；14-学校性质；15-办学类型；16-个人标签
  dictionary: (value, type) => {
    if (store.state.dictionary[type] == undefined) {
      return value = '请选择';
    }
    if(value == undefined || value == ''){
      return value = '';
    }
    if(value == '请选择'){
      return value = '请选择';
    }
    for (let i = 0; i < store.state.dictionary[type].configs.length; i++) {
      if (value == store.state.dictionary[type].configs[i].key) {
        return value = store.state.dictionary[type].configs[i].value
      }
    }
  },
  fullTimeType: (value) => {
    switch (value) {
      case 0:
        return value = "没有设置"
      case 1:
        return value = "全日制"
      case 2:
        return value = "非全日制"
      default:
        return value = "无"
    }
  },
  degreeType: (value) => {
    switch (value) {
      case '0':
        return value = "专科"
      case '1':
        return value = "本科"
      case '2':
        return value = "硕士"
      case '3':
        return value = "博士"
      case '4':
        return value = "民族预科生"
      case '5':
        return value = "联合培养生"

      default:
        return value = "无"
    }
  },
  blood: (value) => {
    switch (value) {
      case '1':
        return value = "A型"
      case 1:
        return value = "A型"
      case '2':
        return value = "B型"
      case 2:
        return value = "B型"
      case '3':
        return value = "AB型"
      case 3:
        return value = "AB型"
      case '4':
        return value = "O型"
      case 4:
        return value = "O型"

      default:
        return value = "无"
    }
  },
  identity: (value) => {
    switch (value) {
      case '0':
        return value = "身份证"
      case '1':
        return value = "学生证"
    }
  },
  exceptionType: (value) => {
    switch (value) {
      case 1:
        return value = "至今未出"
      case 2:
        return value = "至今未归"
      case 3:
        return value = "有夜未归"
      case 4:
        return value = "早出"
      case 5:
        return value = "晚归"
    }
  },


  attributeType: (value) => {
    switch (value) {
      case 0:
        return value = "正面"
      case 1:
        return value = "负面"
    }
  },


  maritalStatusType: (value,num) => {
    if(value == '请选择' || value == undefined || num == 99 || value == ''){
      if(num == 99){
        return value = '';
      }
      return value = '请选择';
    }
    for (let i = 0; i < store.state.politicalStore.length; i++) {
      if (value == store.state.politicalStore[i].key) {
        return value = store.state.politicalStore[i].value
      }
    }
  },


  constructorType: (value,num) => {
    if(value == '请选择' || value == '' || value == undefined || num == 99){
      if(num == 99){
        return value = '';
      }
      return value = '请选择';
    }
    for (let i = 0; i < store.state.constructor.length; i++) {
      if (value == store.state.constructor[i].id) {
        return value = store.state.constructor[i].tittle
      }
    }
  },
  animalSignType: (value,num) => {
    if(value == '请选择' || value == '' || value == undefined || num == 99){
      if(num == 99){
        return value = '';
      }
      return value = '请选择';
    }
    for (let i = 0; i < store.state.animalSign.length; i++) {
      if (value == store.state.animalSign[i].id) {
        return value = store.state.animalSign[i].tittle
      }
    }
  },


  departmentsType: (value) => {
    if(value == '请选择' || value == '' || value == undefined){
      return value = '请选择';
    }
    // let na = store.state.departments.map(function(value){return value.id;});
    for (let i = 0; i < store.state.departments.length; i++) {
      if(value == store.state.departments[i].id){
        return value = store.state.departments[i].name
      }
      // if(na.includes(value)){
      //   return value = store.state.departments[i].name
      // }else{
      //   return value = store.state.departments[7].name
      // }
    }
  },


  jobNameCodeType: (value) => {
    if(value == '请选择' || value == '' || value == undefined){
      return value = '请选择';
    }
    for (let i = 0; i < store.state.jobNameCode.length; i++) {
      if (value == store.state.jobNameCode[i].postCode) {
        return value = store.state.jobNameCode[i].postName
      }
    }
  },


  jobTitleCodeType: (value) => {
    let arr = store.state.jobTitleCode;
    if(value == '请选择' || value == '' || value == undefined){
      return value = '请选择';
    }
    for (let i = 0; i < arr.length; i++) {
      if (value == arr[i].postCode) {
        return value = arr[i].postName
      }
    }
  },

  politicalStatusType: (value) => {
    if(value == '请选择' || value == '' || value == undefined){
      return value = '请选择';
    }
    for (let i = 0; i < store.state.state.length; i++) {
      if (value == store.state.state[i].id) {
        return value = store.state.state[i].tittle
      }
    }
  },


  categoryType: (value) => {
    if(value == '请选择' || value == '' || value == undefined){
      return value = '请选择';
    }
    for (let i = 0; i < store.state.category.length; i++) {
      if (value == store.state.category[i].key) {
        return value = store.state.category[i].value
      }
    }
  },


  employeeTitleType: (value) => {
    if(value == '请选择' || value == '' || value == undefined){
      return value = '请选择';
    }
    for (let i = 0; i < store.state.employeeTitle.length; i++) {
      if (value == store.state.employeeTitle[i].id) {
        return value = store.state.employeeTitle[i].tittle
      }
    }
  },


  startType: (value) => {
    switch (value) {
      case '0':
        return value = "未开始"
      case '1':
        return value = "进行中"
      case '2':
        return value = "已完成"
    }
  },


  ageType: (value) => {
    if(value != undefined){
      let arr = parseInt(value.slice(0,4))
      let time = new Date().getFullYear();
      return value = time - arr;
    }
  },

  bedType: (value) => {
    switch (value) {
      case '1':
        return value = "上铺"
      case '2':
        return value = "下窗"
      case '3':
        return value = "靠门"
      case '4':
        return value = "组床"
      case 1:
        return value = "上铺"
      case 2:
        return value = "下窗"
      case 3:
        return value = "靠门"
      case 4:
        return value = "组床"
    }
  },
  /**
   * names 显示的值
   * codes 对应的code
   * data  传入的值
   */
  transValue:(names,codes,data) => {
    let result=data;
    if(data.indexOf(',')!=-1){
      let arr=data.split(',');
      for(let i=0;i<arr.length;i++){
        let value=arr[i];
        for(let j=0;j<codes.length;j++){
          let code=codes[j];
          if(value==code){
            result=result.replace(value,names[j]);
            break;
          }
        }
      }
    }else{
      for(let m=0;m<codes.length;m++){
        let code=codes[m];
        if(result==code){
          result=names[m];
          break;
        }
      }
    }
    return result;

  },



  getRepairStatus: (status) => {
    let statusName
    let color
    switch (status) {
      case 'officerAudit':
        statusName = '受理中'
        color = '#35a235'
        break
      case 'officerResponse':
        statusName = '未受理'
        color = '#ff0c00'
        break
      case 'workerFinish':
        statusName = '维修中'
        color = '#f8ba3f'
        break
      case 'workerOnsiteCheckin':
        statusName = '维修工已接单'
        color = '#f8ba3f'
        break
      case 'flowWorkFinish':
        statusName = '已完工'
        color = '#6176f7'
        break
      case 'userRework':
        statusName = '待返修'
        color = '#ff0c00'
        break
      case 'workerPartsUpload':
        statusName = '待上报材料'
        color = '#ff0c00'
        break
      case 'close':
        statusName = '已关闭'
        color = '#6176f7'
        break
      case 'workerResponse':
        statusName = '已派工'
        color = '#00a8ff'
        break
      case 'cancel':
        statusName = '已取消'
        color = '#fe5a00'
        break
      case 'userAudit':
        statusName = '已完工'
        color = '#747474'
        break
      case 'end':
        statusName = '已结束'
        color = '#aba9a9'
        break
      case 'userCharge':
        statusName = '待缴费'
        color = '#fe5a00'
        break
      default:
        statusName = '未受理'
        color = '#ff0c00'
    }
    return {
      statusName: statusName,
      color: color
    }
  },


  transformTypeEn: (type) => {
    let strEn;
    let color;
    switch (type) {
      case 0:
        strEn = '咨询';
        color = '#845cde';
        break;
      case 1:
        strEn = '建议';
        color = '#08ba3f';
        break;
      case 2:
        strEn = '表扬';
        color = '#8d4ba6';
        break;
      case 3:
        strEn = '投诉';
        color = '#fc3f04';
        break;
      default:
        break;
    }
    return {
      strEn: strEn,
      color: color
    }
  },

  transformStatusEn: (status) => {
    let statusEn;
    switch (status) {
      case 0:
        statusEn = '未反馈';
        break;
      case 1:
        statusEn = '已反馈';
        break;
      default:
        break;
    }
    return statusEn;
  },


  typeStr: (type) => {
    let str;
    switch (type) {
      case 0:
        str = '咨询';
        break;
      case 1:
        str = '建议';
        break;
      case 2:
        str = '表扬';
        break;
      case 3:
        str = '投诉';
        break;
      default:
        break;
    }
    return str;
  },


  toDecimal2: (x) => {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  },



  stateStr: (type) => {
    let str;
    switch (type) {
      case 'officerResponse':
        str = '未受理';
        break;
      case 'officerAudit':
        str = '受理中';
        break;
      case 'cancel':
        str = '已取消';
        break;
      case 'workerResponse':
        str = '已派工';
        break;
      case 'workerOnsiteCheckin':
        str = '维修工已接单';
        break;
      case 'close':
        str = '已关闭';
        break;
      case 'workerFinish':
        str = '维修中';
        break;
      case 'rework':
        str = '待返修';
        break;
      case 'closed':
        str = '已关闭';
        break;
      case 'flowWorkFinish':
        str = '已完工';
        break;
      case 'flowRework':
        str = '返修中';
        break;
      case 'end':
        str = '已结束';
        break;
      case 'userAudit':
        str = '已完工';
        break;
      case 'userRework':
        str = '待返修';
        break;
      case 'userCharge':
        str = '待缴费'
        break
    }
    return str;
  },



  judgeAvailable: (type) => {
    let str;
    switch (type.toString()) {
      case '0':
        str = '响应';
        break;
      case '1':
        str = '派工';
        break;
      case '2':
        str = '转单';
        break;
      case '3':
        str = '申请返修';
        break;
      case '4':
        str = '评价';
        break;
      case '5':
        str = '关闭报修单';
        break;
      case '6':
        str = '取消报修单';
        break;
      case '7':
        str = '上传工时材料';
        break;
      case '8':
        str = '签到';
        break;
      case '9':
        str = '完工';
        break;
      case '10':
        str = '查看完工信息';
        break;
      // case '11':
      //   str = '报修用户评价';
      //   break;
    }
    return str;
  },


  judgeShortcut: (type) => {
    let str;
    switch (type) {
      case 0:
        str = '响应';
        break;
      case 1:
        str = '派工';
        break;
      case 2:
        str = '转单';
        break;
      case 3:
        str = '申请返修';
        break;
      case 4:
        str = '评价';
        break;
      case 5:
        str = '关闭报修单';
        break;
      case 6:
        str = '取消报修单';
        break;
      case 7:
        str = '上传工时材料';
        break;
      case 8:
        str = '签到';
        break;
      case 9:
        str = '完工';
        break;
      case 10:
        str = '查看完工信息';
        break;
      // case 11:
      //   str = '报修用户评价';
      //   break;
      case 12:
        str = '维修材料上报更新';
        break;
    }
    return str;
  },



  juageAge: (value) => {
    if(value != undefined && value != ""){
      if(value.replace(/-/g, "/").indexOf('/') != -1){
        let birthdays = new Date(value.replace(/-/g, "/"));
        let d = new Date();
        let age =
          d.getFullYear() -
          birthdays.getFullYear() -
          (d.getMonth() < birthdays.getMonth() ||
          (d.getMonth() == birthdays.getMonth() &&
            d.getDate() < birthdays.getDate())
            ? 1
            : 0);
        return value = age;
      }else{
        return value = '-';
      }

    }else{
      return value = '-';
    }
  },


  scopeOf: (value) => {
    switch (value) {
      case 0:
        return value = "通用"
      case 1:
        return value = "内部"
      case 2:
        return value = "学生"
    }
  },


  taskStatusType: (type) => {
    let strEn;
    let color;
    switch (type) {
      case 0:
        strEn = '未完成';
        color = '#fc3f04';
        break;
      case 1:
        strEn = '正常完成';
        color = '#000000';
        break;
      case 2:
        strEn = '超时完成';
        color = '#000000';
        break;
      case 3:
        strEn = '漏检';
        color = '#fc3f04';
        break;
      default:
        break;
    }
    return {
      strEn: strEn,
      color: color
    }
  },

  returnees: (value) => {
    switch (value) {
      case 0:
        return value = "否"
      default:
        return value = "是"
    }
  },



  education: (type) => {
    let str;
    switch (type) {
      case '1':
        str = '初级中学';
        break;
      case '2':
        str = '高级中学';
        break;
      case '3':
        str = '普通全日制专科';
        break;
      case '4':
        str = '普通全日制本科';
        break;
      case '5':
        str = '成人教育专科';
        break;
      case '6':
        str = '成人教育本科';
        break;
      case '7':
        str = '在职硕士';
        break;
      case '8':
        str = '在职博士';
        break;
      case '9':
        str = '全日制硕士';
        break;
      case '10':
        str = '全日制博士';
        break;
      case '11':
        str = '博士后研究生';
        break;
    }
    return str;
  },


  industry: (type) => {
    let str;
    switch (type) {
      case 1:
        str = '政府部门';
        break;
      case 2:
        str = '农林牧渔';
        break;
      case 3:
        str = '医药卫生';
        break;
      case 4:
        str = '建筑建材';
        break;
      case 5:
        str = '冶金矿产';
        break;
      case 6:
        str = '石油化工';
        break;
      case 7:
        str = '水利水电';
        break;
      case 8:
        str = '交通运输';
        break;
      case 9:
        str = '信息产业';
        break;
      case 10:
        str = '机械机电';
        break;
      case 11:
        str = '轻工食品';
        break;
      case 12:
        str = '服装纺织';
        break;
      case 13:
        str = '社会专业服务';
        break;
      case 14:
        str = '安全防护';
        break;
      case 15:
        str = '环保绿化';
        break;
      case 16:
        str = '旅游休闲';
        break;
      case 17:
        str = '科学研究';
        break;
      case 18:
        str = '学校教育';
        break;
      case 19:
        str = '军事';
        break;
      case 20:
        str = '体育事业';
        break;
      case 21:
        str = '文化传媒';
        break;
      case 22:
        str = '金融银行';
        break;
      case 23:
        str = '商业贸易';
        break;
      case 24:
        str = '公安';
        break;
      case 25:
        str = '检察院';
        break;
      case 26:
        str = '法院';
        break;
      case 27:
        str = '律师';
        break;
      case 28:
        str = '国家安全';
        break;
      case 29:
        str = '其他';
        break;
      case 30:
        str = '新能源开发与市场推广';
        break;
    }
    return str;
  },


  numberToChinese(number){
    var units = '个十百千万@#%亿^&~', chars = '零一二三四五六七八九';
    var a = (number + '').split(''), s = []
    if (a.length > 12) {
      throw new Error('too big');
    } else {
      for (var i = 0, j = a.length - 1; i <= j; i++) {
        if (j == 1 || j == 5 || j == 9) {//两位数 处理特殊的 1*
          if (i == 0) {
            if (a[i] != '1') s.push(chars.charAt(a[i]));
          } else {
            s.push(chars.charAt(a[i]));
          }
        } else {
          s.push(chars.charAt(a[i]));
        }
        if (i != j) {
          s.push(units.charAt(j - i));
        }
      }
    }
    //return s;
    return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {//优先处理 零百 零千 等
      b = units.indexOf(d);
      if (b != -1) {
        if (d == '亿') return d;
        if (d == '万') return d;
        if (a[j - b] == '0') return '零'
      }
      return '';
    }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
      return b;
    }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
      return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m];
    }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
      c = units.indexOf(d);
      if (c != -1) {
        if (a[j - c] == '0') return d + '零' + b
      }
      return m;
    });
  },


  undefinedType(value){
    if(value == undefined || value == ''){
      return value = '请选择'
    }else{
      return value
    }
  },


  runningStatus(value){
    switch (value) {
      case '0':
        return value = "未执行"
      case '1':
        return value = "已执行"
    }
  },
  costOption(value){
    switch (value) {
      case 0:
        return value = '无偿'
      case 1:
        return value = "有偿"
    }
  },

  getEchartsPieDefaultColorPan(){
    return [ '#40A3D8','#FC9F82', '#A677FC','#42C5E7', '#EDCA5F','#70DFE2','#38C32D','#A4E4B9',  '#F8D464',   '#A5C6A2','#c4ccd3'];
  },
  getEchartsBarDefaultColorPan(){
    return [ '#38C32D','#F8D464','#E95858','#40A3D8','#70DFE2', '#FB0909', '#A4E4B9',  '#EDCA5F','#FC9F82', '#A5C6A2','#A677FC', '#c4ccd3'];
  },
  /**
   * 获取本月的第一天和最后一天[start,end]
   * context  当前上下文,一般是this
   * endCurrent  结束日期是否是当天,true  当天   false 当月最后一天
   */
  getCurrentMonthStartAndEndDate(context,endCurrent){
    var dataRange=["",""];
    var start=context.$moment(new Date()).startOf('month').format("YYYY-MM-DD");
    if(endCurrent){
      var end=context.$moment(new Date()).format("YYYY-MM-DD");
    }else{
      var end=context.$moment(new Date()).endOf('month').format("YYYY-MM-DD");
    }
    dataRange[0]=start;
    dataRange[1]=end;
    console.log(dataRange);
    return dataRange;
  },
  /**
   * 获取本年度的第一天和最后一天[start,end]
   * context  当前上下文,一般是this
   * endCurrent  结束日期是否是当天,true  当天   false 当年最后一天
   */
  getCurrentYearStartAndEndDate(context,endCurrent){
    var dataRange=["",""];
    var start=context.$moment(new Date()).startOf('year').format("YYYY-MM-DD");
    if(endCurrent){
      var end=context.$moment(new Date()).format("YYYY-MM-DD");
    }else{
      var end=context.$moment(new Date()).endOf('year').format("YYYY-MM-DD");
    }
    dataRange[0]=start;
    dataRange[1]=end;
    console.log(dataRange);
    return dataRange;
  },

  /**
   * 获取本周的第一天和最后一天[start,end]
   * context  当前上下文,一般是this
   * endCurrent  结束日期是否是当天,true  当天   false 本周最后一天
   */
  getCurrentWeekStartAndEndDate(context,endCurrent){
    var dataRange=["",""];
    var start=context.$moment(new Date()).startOf('week').format("YYYY-MM-DD");
    if(endCurrent){
      var end=context.$moment(new Date()).format("YYYY-MM-DD");
    }else{
      var end=context.$moment(new Date()).endOf('week').format("YYYY-MM-DD");
    }
    dataRange[0]=start;
    dataRange[1]=end;
    console.log(dataRange);
    return dataRange;
  },

  /**
   * 获取本周的第一天和最后一天[start,end]
   * context  当前上下文,一般是this
   * endCurrent  结束日期是否是当天,true  当天   false 本周最后一天
   */
  getWeekStartAndEndDateByDate(context,date,endCurrent){
    var dataRange=["",""];
    var start=context.$moment(date).startOf('week').format("YYYY-MM-DD");
    if(endCurrent){
      var end=context.$moment(date).format("YYYY-MM-DD");
    }else{
      var end=context.$moment(date).endOf('week').format("YYYY-MM-DD");
    }
    dataRange[0]=start;
    dataRange[1]=end;
    console.log(dataRange);
    return dataRange;
  },

  /**
   * 获取当天的数组[start,end]
   * context  当前上下文,一般是this
   */
  getCurrentDayStartAndEndDate(context){
    let dataRange=['',''];
    let date=context.$moment(new Date()).format("YYYY-MM-DD");
    dataRange[0]=date;
    dataRange[1]=date;
    return dataRange;
  },


  /**
   * 获取最近3个月（整3个月）的开始、结束日期[start,end]
   * context  当前上下文,一般是this
   */
  getLatestThreeMonthsStartAndEndDate(context,endCurrent){
    var dataRange=["",""];
    var start=context.$moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD');
    var end=context.$moment(new Date()).format("YYYY-MM-DD");
    dataRange[0]=start;
    dataRange[1]=end;
    console.log(dataRange);
    return dataRange;
  },

  /**
   * 获取第一天开始一周的日期集合
   * date 第一天的日期
   */
  getWeekDateArr(context,date){
    var arr=[];
    for(let i = 0; i< 7;i++){
      let da=context.$moment(date).add(i, 'day').format('YYYY-MM-DD');
      arr.push(da)
    }
    console.log(arr);
    return arr;
  },

  getWeekDay(context,date){
    let week = context.$moment(date).day()
    switch (week) {
      case 1:
        return '星期一'
      case 2:
        return '星期二'
      case 3:
        return '星期三'
      case 4:
        return '星期四'
      case 5:
        return '星期五'
      case 6:
        return '星期六'
      case 0:
        return '星期日'
    }
  },

  /**
   * 获取日期相差的天数
   * dateString1 开始日期
   * dateString2 结束日期
   */
  getDiffDays(dateString1,dateString2){
    var  startDate = Date.parse(dateString1);
    var  endDate = Date.parse(dateString2);
    var days=(endDate - startDate)/(1*24*60*60*1000);
    return  days;
  },

  showTableNoDataView(context){
      context.$refs.noDataTableRef.$refs.body.innerHTML=
      "<div style='width:100%;height:50vh;display:flex;flex-direction: column;align-items:center;justify-content: center;'>"+
      "<img src='static/images/no-data.png' style='width: 150px;height: 100px;'/>"+
      "<strong style='font-weigh:bold;font-size:14px'>查找无相关数据</strong"
      "</div> ";
       setTimeout(function(){
        context.$refs.noDataTableRef.$refs.body.style.display="";
       },300)
  },

  isShowNoDataView(list,context){
    var that=this;
    if((list==undefined || list==null || list.length==0) && context.$refs.noDataTableRef!=undefined){
      setTimeout(function(){
        that.showTableNoDataView(context);
      },100)
      return true;
    }else{
      return false;
    }
  },

  isEmpty:(value)=>{
    if(value==undefined || value=='undefined' || value==null || value=="null" || value.toString()=="" || value.length==0){
      return true
    }else{
      return false;
    }
  },

  checkPhone(phone) {
    if (!(/^1\d{10}$/.test(phone))) {
      return false
    }else{
      return true
    }
  },

  checkIdcard(idcard) {
    //2022.08.30不限制身份证格式
    return true
    /*let reg1=/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    let reg2=/^([A-Z]\d{6,10}(\(\w{1}\))?)$/
    let reg3=/^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/
    if (reg1.test(idcard)){
      return true
    }else if (reg2.test(idcard)){
      return true
    }else if (reg3.test(idcard)){
      return true
    }else{
      return false
    }*/
  },

  getStarString(content,frontNum, endNum) {
    if (frontNum >= content.length || frontNum < 0) {
      return content;
    }
    if (endNum >= content.length || endNum < 0) {
      return content;
    }
    if (frontNum + endNum >= content.length) {
      return content;
    }
    let starStr = "";
    for (let i = 0; i < (content.length - frontNum - endNum); i++) {
      starStr = starStr + "*";
    }
    return content.substring(0, frontNum) + starStr + content.substring(content.length - endNum, content.length);
  },
};

export default Filters
