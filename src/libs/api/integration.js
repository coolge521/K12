let integration = {
  'WEATHER': '/api/outside/weather',//获取天气
  //报修
  'GET_REPAIR_DATA_DAYS': '/api/app/repair/WebStatistics/getRepairDayCount',//获取报修数据汇总 按天
  'GET_OFF_LINE_REPAIR_DATA_DAYS': '/api/app/repair/WebStatistics/getOfflineRepairDayCount',//获取线下报修数据汇总  按天
  'GET_COMMENT_INFO': '/api/app/repair/WebStatistics/getFeedbackCountVo',//获取评论信息
  'GET_COMMENT_INFO_V2': 'api/app/repair/WebStatistics/getFeedbackVo',//获取报修评价信息

  'GET_REPAIR_LIST_CONDITION': '/api/app/repair/WebStatistics/getStatisticsPage',//列表条件查询（除特别关注和评价部分）
  'GET_REPAIR_LIST_COMMENT': '/api/app/repair/WebStatistics/getStatisticsPageByFeedback',//列表条件查询（评价部分）
  'GET_REPAIR_LIST_FOCUS': '/api/app/repair/WebStatistics/getStatisticsPageByOutTimeAndErr',//列表条件查询（特别关注）
  'GET_STATE_PIE': '/api/app/repair/WebStatistics/getStatePie',//工单数量占比

  'GET_PROJECT_BY_COLLEGE': '/usercenter/ucProjects/getByCollegeId',//获取项目大屏监控数据


  //集控中心
  'GET_REPAIR_ORDER_COUNT': '/api/app/repair/WebStatistics/getDantinRepairCount',//报修工单



  //保存巡逻

  'GET_EQUIPMENT_DATA': '/api/app/equipmentScreenStatistics/getEquipmentCount',//设备数据
  'GET_MAINTENANCE_DATA': '/api/app/equipmentScreenStatistics/getMaintenanceData',//维保任务
  'GET_OPERATION_DATA': '/api/app/equipmentScreenStatistics/getOperationalData',//运营数据
  'GET_PLAN_STATUS': '/api/app/equipmentScreenStatistics/getPlanStatus',//任务状态
  'GET_ROUTING_DATA': '/api/app/equipmentScreenStatistics/getRoutingInspectionData',//巡检任务
  'GET_RUNNING_DATA': '/api/app/equipmentScreenStatistics/getRunningStatus',//运作状态
  'GET_TASK_RATE': '/api/app/mechanicScreen/getDateRate',//任务完成率
  'GET_TASK_GROUP': '/api/app/mechanicScreen/getGroupStatus',//班组任务
  'GET_MECHANICS_DATA': '/api/app/mechanicScreen/getMechanicsCount',//设备数据
  'GET_MECHANICS_OPERATION_DATA': '/api/app/mechanicScreen/getOperationData',//运营数据
  'GET_MECHANICS_TASK_STATUS': '/api/app/mechanicScreen/getTaskStatus',//任务状态
  'GET_MECHANICS_RECORD': '/api/app/patrolScreenStatistics/getMechanicsRecord',//车辆巡逻
  'GET_PATROL_DATA': '/api/app/patrolScreenStatistics/getPatrolRecord',//巡逻情况
  'GET_PATROL_STATISTICS_DATA': '/api/app/patrolScreenStatistics/getPatrolStatisticsCount',//保安巡逻
  'GET_PERSON_PATROL_TASK': '/api/app/patrolScreenStatistics/getPersonPatrolTask',//任务状态
  'GET_SECURITY_DATA': '/api/app/patrolScreenStatistics/getSecurityPointAnalysis',//保安站岗
  'GET_SECURITY_POINT_DATA': '/api/app/patrolScreenStatistics/getSecurityCenterAnalysis',//岗点情况
  'GET_VISIT_RECORD': '/api/app/patrolScreenStatistics/getVisitRecordAnalysis',//来访登记
  'GET_VISIT_BY_ID': "/api/app/apartment/visitor/byId",//获取单个邀请数据

  //公寓
  'GET_APARTMENT_PREMISES': '/api/app/apartment/webStatistics/getPremises',//获取楼宇
  'GET_APARTMENT_FACULTY': '/api/app/apartment/webStatistics/getDepartment',//获取学院

  'GET_APARTMENT_COLLECT': '/api/app/apartment/webStatistics/collect',//汇总统计
  'GET_ENTRANCE_DAY': '/api/app/apartment/webStatistics/dayEntranceData',//门禁数据统计  按天
  'GET_ENTRANCE_LIST': '/api/app/apartment/webStatistics/entranceStatement',//门禁流水
  'GET_ENTRANCE_LAST': '/api/app/apartment/webStatistics/entranceStatement/last',//最新一条门禁流水
  'GET_EVALUATE_DATA': '/api/app/apartment/webStatistics/evaluateData',//评比数据
  'GET_FACULTY_BAR': '/api/app/apartment/webStatistics/facultyPremises/bar',//按学院统计柱状图
  'GET_FACULTY_PREMISES_COLLECT': '/api/app/apartment/webStatistics/facultyPremises/collect',//按院系、楼宇查询基本数据统计
  'GET_FACULTY_PREMISES_PIE': '/api/app/apartment/webStatistics/facultyPremises/pie',//按学院公寓统计 饼图
  'GET_APARTMENT_TASK': '/api/app/apartment/webStatistics/task',//待办列表
  'GET_APARTMENT_ENTRANCE_BAR': '/api/app/apartment/webStatistics/entrance/state/bar',//门禁流水状态
  'GET_SCREEN_TIME_ENTRANCE_DATA_PAGE': '/api/app/apartment/webStatistics/timeEntranceDataPage',//分页获取按天门禁数据[小时划分]
  'GET_SCREEN_TIME_ENTRANCE_STATE_PAGE': '/api/app/apartment/webStatistics/entrance/state/page',//门禁流水状态(早出、晚归、夜未归)柱状图
  'GET_SCREEN_ENTRANCE_STATEMENT_PAGE': '/api/app/apartment/webStatistics/entranceStatementPage',//分页获取门禁流水数据

  //工单
  'GET_WORK_ORDER_BUSI_RATE': '/api/bi/task/collect/type',//业务比例
  'GET_WORK_ORDER_BUSI_TYPES': '/api/bi/task/collect/type/finish',//业务类型
  'GET_WORK_ORDER_FINISH_RATE': '/api/bi/task/collect/finish',//完成比例
  'GET_WORK_ORDER_DATAS': '/api/bi/task/page',//工单数据

}


export default integration
