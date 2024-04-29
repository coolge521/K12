import business from "./api/business";
import guestHouse from "./api/guestHouse";
import visitor from "./api/visitor";
import security from "./api/security";
import integration from "./api/integration";
import umbrella from "./api/umbrella";

let ucApi = {}

ucApi.business = business;
ucApi.guestHouse = guestHouse;
ucApi.visitor = visitor;
ucApi.security = security;
ucApi.integration = integration;
ucApi.umbrella = umbrella;

//公共接口
ucApi.login = {
  'login': '/school/common/system/login/password',//登录
  'resetInitPwd': '/school/common/system/user/changePwd',//重置初始密码
  'FORGETPASS_SEND_CODE': '/school/common/sms/send',//获取验证码
  'FORGETPASS_UPDATE_USER_PWD': '/school/common/system/login/forget/password',//忘记密码修改密码



  // // 'login': '/api/social/login/login',//登录
  // 'home': '/api/app/home',
  // 'get': '/api/social/college/module/get',
  // 'updateAll': '/api/social/college/module/updateAll',
  // 'logout': '/api/social/login/logoff',//退出登录
  // 'getUserPermission': '/api/common/role/getUserPermission',
  // 'ldapLogin': '/api/social/login/ldap/login',//工号登录
  // 'password': '/api/social/user/update/password',//修改密码
  //
  // 'allowManage': '/api/common/role/allowManage',//
  //
  // 'checkAdmin': '/api/common/role/checkAdmin',//判断是管理员  0-不是管理员 1-学校管理员 2-超级管理员
}


//平台设置接口
ucApi.platform = {
  'getDictionary': '/school/common/system/commonDict/byType',//获取通用字典
  'getSchool': '/school/common/system/school/byId',//获取学校信息
  'getUserById': '/school/common/system/user/byId',//获取用户信息

  'PLATFORM_SUBJECT_LIST': '/school/common/system/subject/list',//获取教学科目
  'PLATFORM_SUBJECT_SAVE': '/school/common/system/subject/save',//保存教学科目
  'PLATFORM_SUBJECT_DELETE': '/school/common/system/subject/delete',//删除教学科目

  'PLATFORM_COURSE_LIST': '/school/common/system/course/page',//获取课程
  'PLATFORM_COURSE_SAVE': '/school/common/system/course/save',//保存课程
  'PLATFORM_COURSE_DELETE': '/school/common/system/course/delete',//删除课程

  'PLATFORM_AREA_LIST': '/school/common/system/schoolArea/list',//获取学校校区
  'PLATFORM_AREA_SAVE': '/school/common/system/schoolArea/save',//保存学校校区
  'PLATFORM_AREA_DELETE': '/school/common/system/schoolArea/delete',//删除学校校区

  'PLATFORM_DEP_LIST': '/school/common/system/organization/list/tree',//获取学校机构
  'PLATFORM_DEP_SAVE': '/school/common/system/organization/save',//保存学校机构
  'PLATFORM_DEP_DELETE': '/school/common/system/organization/delete',//删除学校机构

  'PLATFORM_EMPLOYEE_LIST': '/school/common/system/employee/page',//获取教职工列表
  'PLATFORM_EMPLOYEE_SAVE': '/school/common/system/employee/save',//保存教职工
  'PLATFORM_EMPLOYEE_DELETE': '/school/common/system/employee/delete',//删除教职工
  'PLATFORM_EMPLOYEE_GET_BY_ID': '/school/common/system/employee/byId',//教职工详情

  'PLATFORM_EMPLOYEE_KINSFOLK_LIST': '/school/common/system/employee/kinsfolk/byEmployeeId',//获取教职工亲属列表
  'PLATFORM_EMPLOYEE_KINSFOLK_SAVE': '/school/common/system/employee/kinsfolk/save/batch',//批量保存教职工亲属列表
  'PLATFORM_EMPLOYEE_KINSFOLK_DELETE': '/school/common/system/employee/kinsfolk/delete',//删除教职工亲属

  'PLATFORM_EMPLOYEE_EDUCATION_LIST': '/school/common/system/employee/education/byEmployeeId',//获取教职工教育经历列表
  'PLATFORM_EMPLOYEE_EDUCATION_SAVE': '/school/common/system/employee/education/save/batch',//批量保存教职工教育经历列表
  'PLATFORM_EMPLOYEE_EDUCATION_DELETE': '/school/common/system/employee/education/delete',//删除教职工教育经历

  'PLATFORM_EMPLOYEE_WORK_LIST': '/school/common/system/employee/work/byEmployeeId',//获取教职工工作经历列表
  'PLATFORM_EMPLOYEE_WORK_SAVE': '/school/common/system/employee/work/save/batch',//批量保存教职工工作经历列表
  'PLATFORM_EMPLOYEE_WORK_DELETE': '/school/common/system/employee/work/delete',//删除教职工工作经历

  'PLATFORM_STUDENT_LIST': '/school/common/system/student/page',//获取学生列表
  'PLATFORM_STUDENT_SAVE': '/school/common/system/student/save',//保存学生
  'PLATFORM_STUDENT_DELETE': '/school/common/system/student/delete',//删除学生
  'PLATFORM_STUDENT_GET_BY_ID': '/school/common/system/student/byId',//学生详情

  'PLATFORM_STUDENT_PARENT_LIST': '/school/common/system/student/parent/byStudentId',//获取学生家长列表
  'PLATFORM_STUDENT_PARENT_SAVE': '/school/common/system/student/parent/save/batch',//批量保存学生家长列表
  'PLATFORM_STUDENT_PARENT_DELETE': '/school/common/system/student/parent/delete',//删除学生家长

  /*'PLATFORM_STUDENT_SCHOOLBUS_LIST': '/school/common/system/employee/work/byEmployeeId',//获取学生乘坐校车列表
  'PLATFORM_STUDENT_SCHOOLBUS_SAVE': '/school/common/system/employee/work/save/batch',//批量保存学生乘坐校车列表
  'PLATFORM_STUDENT_SCHOOLBUS_DELETE': '/school/common/system/employee/work/delete',//删除学生乘坐校车*/

  'PLATFORM_ACCOUNT_BIND': '/school/common/system/user/bind',//用户绑定
  'PLATFORM_ACCOUNT_FORBID': '/school/common/system/user/not/allow',//用户禁用
  'PLATFORM_ACCOUNT_ALLOW': '/school/common/system/user/allow',//用户解禁
  'PLATFORM_ACCOUNT_UNLOCK': '/school/common/system/user/unlock',//用户解锁
  'PLATFORM_ACCOUNT_RESET_PWD': '/school/common/system/user/update/base',//用户密码重置

  'PLATFORM_GET_PAYMENT_ITEM_BY_ID': '/school/common/system/payItem/byId',//根据id获取缴费项目
  'PLATFORM_DELETE_PAYMENT_ITEM_BY_ID': '/school/common/system/payItem/delete',//删除缴费项目
  'PLATFORM_GET_PAYMENT_LIST_BY_PAGE': '/school/common/system/payItem/page',//获取缴费项目列表
  'PLATFORM_SAVE_PAYMENT_ITEM': '/school/common/system/payItem/save',//保存缴费项目
}

ucApi.payment = {
  'GET_PAYMENT_ITEMS': '/school/payment/record/paid/itemName',//获取已存在的缴费项目
  'GET_GRADE_LIST': '/school/common/system/school/grade',//获取年级列表
  'GET_PAYMENT_RECORDS': '/school/payment/record/page',//获取缴费记录
  'CHANGE_PAYMENT_PRINT_COUNT': '/school/payment/record/print/count',//获取缴费记录
  'GET_PAYMENT_ITEMS_BY_ID': '/school/payment/record/detail',//获取缴费项目明细
  'SAVE_PAYMENT_ITEMS_BY_ID': '/school/payment/record/derate',//保存惠减补、校长减免
  'SAVE_PAYMENT_RECORD_REMARK': '/school/payment/record/remark',//保存惠减补、校长减免
  'GET_PAYMENT_RECORD_PRINT': '/school/payment/record/print/info',//获取订单打印详情
  'SAVE_OFFLINE_PAYMENT_RECORD': '/school/payment/record/offline',//保存线下缴费单登记

  'GET_PAYMENT_COLLECT_PEOPLE': '/school/payment/collect/people',//缴费人数统计
  'GET_PAYMENT_COLLECT_AMOUNT': '/school/payment/collect/amount',//缴费金额统计
  'GET_PAYMENT_COLLECT_INCOME': '/school/payment/collect/income',//缴费收入统计
  'EXPORT_PAYMENT_RECORD': '/school/payment/record/export',//缴费记录导出

  'GET_PAYMENT_COLLECT_INCOME_DETAIL': '/school/payment/record/item/page',//缴费明细列表
  'EXPORT_PAYMENT_RECORD_DETAIL': '/school/payment/record/item/export',//缴费明细导出

  'GET_REFUND_RECORD_LIST': '/school/payment/record/refund/page',//获取退费记录
  'GET_REFUND_RECORD_PRINT': '/school/payment/record/refund/print/info',//获取退费打印详情
  'GET_TERM_LIST': '/school/payment/record/paid/term',//获取学期列表
  'SAVE_REFUND_ITEMS': '/school/payment/record/refund/save',//保存退费项目

  'GET_REFUND_DETAIL_INFO': '/school/payment/record/refund/info',//获取退费详情
  'GET_REFUND_ITEM_NAME_LIST': '/school/payment/record/refund/exist/item',//获取已存在的退费名称

}

//用餐登记接口
ucApi.food = {
  'FOOD_GET_REGISTER_AUTH_LIST': '/school/food/schoolFoodUser/findByPage',//获取PC用餐登记员授权列表
  'FOOD_GET_MY_LIST': '/school/food/schoolFoodUser/findMineList',//获取用餐登记列表（我管理的人员列表）-不分页
  'FOOD_GET_DETAIL': '/school/food/schoolFoodUser/getDetailList',//点击编辑获取详细列表
  'FOOD_ADD_EDIT_AUTH': '/school/food/schoolFoodUser/insertList',//添加、编辑授权
  'FOOD_DELETE_AUTH': '/school/food/schoolFoodUser/deleteByRegisterUserId',//删除授权
  'FOOD_DELETE_AUTH_STUDENT': '/school/food/schoolFoodUser/deleteById',//移除用餐人员
  'FOOD_CHECK_IF_AUTH_REGISTER': '/school/food/schoolFoodUser/checkUserIfRegister',//检查选择的教工是否已是登记员

  'FOOD_TIME_SETTING_GET_LIST': '/school/food/schoolFoodSection/getByPage',//获取用餐时段列表
  'FOOD_TIME_SETTING_GET_ALL': '/school/food/schoolFoodSection/getList',//获取用餐时段列表 全部
  'FOOD_TIME_SETTING_GET_BY_ID': '/school/food/schoolFoodSection/getById',//获取用餐时段详情
  'FOOD_TIME_SETTING_ADD': '/school/food/schoolFoodSection/insert',//新增用餐时段
  'FOOD_TIME_SETTING_EDIT': '/school/food/schoolFoodSection/update',//编辑用餐时段
  'FOOD_TIME_SETTING_DELETE': '/school/food/schoolFoodSection/deleteById',//删除用餐时段

  'FOOD_DO_RECORD_GET_LIST': '/school/food/eatRecord/findListByDate',//获取登记人员列表
  'FOOD_DO_RECORD_POST': '/school/food/eatRecord/insertList',//新增或更新今天的用餐记录
  'FOOD_DO_RECORD_GET_COUNTS': '/school/food/eatRecord/findCountByDate',//获取日计数
  'FOOD_ANALYSIS': '/school/food/eatRecord/getStatistics',//用餐统计
  'FOOD_GET_STUDENT_FOOD_CALENDAR': '/school/food/eatRecord/findRecordCalendar',//获取用餐日历
  'FOOD_GET_STUDENT_COUNT_DETAIL': '/school/food/eatRecord/getStatisticsDetail',//用餐统计-点击数字count获取详情
  'FOOD_EXPORT_EXCEL': '/school/food/eatRecord/downloadExcel',//用餐统计-导出用餐记录
}


//公告通知接口
ucApi.notice = {
  'NOTICE_GET_ALL_LIST': '/school/notice/notice/findPcAll',//获取公告列表
  'NOTICE_GET_BY_ID': '/school/notice/notice/getById',//获取公告详情
  'NOTICE_INSERT': '/school/notice/notice/insert',//新增公告
  'NOTICE_UPDATE': '/school/notice/notice/update',//更新公告
  'NOTICE_DELETE': '/school/notice/notice/deleteById',//删除公告
  'NOTICE_GET_READ_LIST': '/school/notice/notice/findAlreadyReadList',//点击已读count获取已读人员列表
  'NOTICE_GET_READ_LIST_COUNTS': '/school/notice/notice/findNoticeReadStatus',//点击已读count获取已读未读count计数
  'NOTICE_SIGN': '/school/notice/notice/sign',//需要签署的时候提交签署
}


//入校登记接口
ucApi.sign = {
  'SIGN_GET_REGISTER_AUTH_LIST': '/school/sign/sign/findPcPage',//获取PC入校登记员授权列表
  'SIGN_SET_REGISTER_AUTH': '/school/sign/sign/insert',//新增/编辑（单个）管理授权/入校管理
  'SIGN_EXPORT_REGISTER_AUTH_LIST': '/school/sign/sign/pcPageExport',//导出入校登记员授权列表
  'SIGN_DO_RECORD_GET_LIST': '/school/sign/sign/findRecordList',// PC-入校登记列表
  'SIGN_DO_RECORD_GET_GRADE_LIST': '/school/sign/sign/findGradeIds',// 获取入校登记可选年级列表
  'SIGN_DO_RECORD_INSERT_RECORD': '/school/sign/sign/insertRecords',// 入校登记（批量登记）
  'SIGN_DO_RECORD_LIST_EXPORT': '/school/sign/sign/downloadWeekExcel',// 入校登记 导出列表
  'SIGN_DO_RECORD_LIST_ANALYSIS': '/school/sign/sign/findMonthList',// 入校登记 统计
  'SIGN_DO_RECORD_LIST_ANALYSIS_EXPORT': '/school/sign/sign/downloadMonthList',// 入校登记 统计 导出
  'SIGN_DO_RECORD_LIST_ANALYSIS_DETAIL': '/school/sign/sign/findMonthListByDate',// 入校登记 统计  点击日期详情
}

//教工考勤接口
ucApi.staff = {
  'STAFF_ITEM_PAGE_LIST': '/school/staff/item/findByPage',// PC-考勤项目列表
  'STAFF_ALL_ITEM_LIST': '/school/staff/item/findAll',// PC-考勤项目列表  获取所有
  'STAFF_ITEM_INSERT': '/school/staff/item/insert',//新增考勤项目
  'STAFF_ITEM_UPDATE': '/school/staff/item/update',//编辑考勤项目
  'STAFF_ITEM_DELETE': '/school/staff/item/deleteById',//删除考勤项目
  'STAFF_TASK_PAGE_LIST': '/school/staff/task/findByPage',// PC-考勤计划列表
  'STAFF_TASK_INSERT': '/school/staff/task/insert',//新增考勤计划
  'STAFF_TASK_UPDATE': '/school/staff/task/update',//编辑考勤计划
  'STAFF_TASK_DELETE': '/school/staff/task/deleteById',//删除考勤计划
  'STAFF_TASK_DELETE_EMP': '/school/staff/taskUser/deleteById',//删除被考勤人
  'STAFF_TASK_USER_LIST': '/school/staff/taskUser/findByPage',// 考勤计划被考勤人列表
  'STAFF_TASK_DO_RECORD_GET_LIST': '/school/staff/task/findRecordList',// 考勤录入/教工考勤
  'STAFF_TASK_DO_RECORD_MULTI_INSERT': '/school/staff/record/insertList',// 批量新增教工考勤记录
  'STAFF_TASK_ANALYSIS_BY_ITEM': '/school/staff/task/findRecordByItem',// 考勤统计 按项目
  'STAFF_TASK_ANALYSIS_BY_PEOPLE': '/school/staff/task/findRecordByUser',// 考勤统计 按人员
}


//教工考勤接口
ucApi.kpi = {
  'KPI_LEVEL_PAGE_LIST': '/school/kpi/schoolKpi/param/findByPage',// 考核评级列表
  'KPI_LEVEL_INSERT': '/school/kpi/schoolKpi/param/insert',// 新增考核评级
  'KPI_LEVEL_UPDATE': '/school/kpi/schoolKpi/param/update',// 编辑考核评级
  'KPI_LEVEL_DELETE': '/school/kpi/schoolKpi/param/delete',// 删除考核评级

  'KPI_ITEM_PAGE_LIST': '/school/kpi/schoolKpi/item/findByPage',// 考核项目列表
  'KPI_ITEM_INSERT': '/school/kpi/schoolKpi/item/insert',// 新增考核项目
  'KPI_ITEM_UPDATE': '/school/kpi/schoolKpi/item/update',// 编辑考核项目
  'KPI_ITEM_DELETE': '/school/kpi/schoolKpi/item/delete',// 删除考核项目
  'KPI_ITEM_POINT_DELETE': '/school/kpi/schoolKpi/item/child/deleteById',// 删除考核项目的考核点

  'KPI_AUTH_PAGE_LIST': '/school/kpi/schoolKpi/item/user/findByPage',// 考核授权列表
  'KPI_AUTH_INSERT': '/school/kpi/schoolKpi/item/user/insert',// 新增考核授权
  'KPI_AUTH_UPDATE': '/school/kpi/schoolKpi/item/user/update',// 编辑考核授权
  'KPI_AUTH_DELETE': '/school/kpi/schoolKpi/item/user/deleteById',// 删除考核授权
  'KPI_AUTH_OBJ_DELETE': '/school/kpi/schoolKpi/user/deleteById',// 删除考核授权的考核对象

  'KPI_BY_MONTH_LIST': '/school/kpi/schoolKpi/record/findByMonth',// 教工考核 按月份查看列表
  'KPI_CHECK_MONTH_IF_UPLOAD': '/school/kpi/schoolKpi/record/checkIfUploadKpi',// 教工考核 按月份检测月份下是否上传过考核
  'KPI_BY_YEAR_LIST': '/school/kpi/schoolKpi/record/findByYear',// 教工考核 按年份查看列表
  'KPI_RECORD_INSERT': '/school/kpi/schoolKpi/record/insert',// 教工考核 提交
  'KPI_RECORD_UPDATE': '/school/kpi/schoolKpi/record/update',// 教工考核 编辑

}

//文件上传服务接口
ucApi.uploadImage = {
  'UPLOAD_IMAGE': '/school/media/upload/image',
  'UPLOAD_VIDEO': '/school/media/upload/video',
  'UPLOAD_VOICE': '/school/media/upload/voice',
  'UPLOAD_ATTACHMENT': '/school/media/upload/attachment',
}






export default ucApi
