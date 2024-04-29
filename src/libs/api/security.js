let security = {
  'SECURITY_CREATE_TEAM': '/api/app/SecurityPatrol/SecurityGroup/createSecurityGroup',//创建安保小组
  'SECURITY_DELETE_TEAM': '/api/app/SecurityPatrol/SecurityGroup/deleteGroup',//删除安保小组
  'SECURITY_GET_TEAM_ALL': '/api/app/SecurityPatrol/SecurityGroup/getSecurityGroupListByCollegeId',//获取安保分组列表-不分页
  'SECURITY_GET_TEAM_PAGE': '/api/app/SecurityPatrol/SecurityGroup/getSecurityGroupPageByCollegeId',//获取安保分组列表-分页

  'SECURITY_CREATE_STATION': '/api/app/SecurityPatrol/SecurityPoint/createPoint',//创建站岗点
  'SECURITY_DELETE_STATION': '/api/app/SecurityPatrol/SecurityPoint/deletePointById',//删除站岗点
  'SECURITY_GET_STATION_ALL': '/api/app/SecurityPatrol/SecurityPoint/getPointListByCollegeId',//获取站岗点列表-不分页
  'SECURITY_GET_STATION_PAGE': '/api/app/SecurityPatrol/SecurityPoint/getPointPageByCollegeId',//获取站岗点列表-分页

  'SECURITY_CREATE_PLAN': '/api/app/SecurityPatrol/SecurityPlan/createPlan',//创建站岗计划
  'SECURITY_DELETE_PLAN': '/api/app/SecurityPatrol/SecurityPlan/deletePlanById',//删除站岗计划
  'SECURITY_GET_PLAN_PAGE': '/api/app/SecurityPatrol/SecurityPlan/getPlanByCollegeId',//获取站岗计划

  'SECURITY_GET_TASK_PAGE': '/api/app/SecurityPatrol/SecurityTask/getTaskByCollegeId',//获取站岗任务

  'SECURITY_GET_RECORDS_PAGE': '/api/app/SecurityPatrol/SecurityRecord/getCheckInRecord',//获取站岗记录列表
  'SECURITY_DELETE_RECORD_BY_ID': '/api/app/SecurityPatrol/SecurityRecord/deleteCheckInRecord',//删除站岗记录

  'SECURITY_GET_MONITOR_LIST': '/api/app/SecurityPatrol/PointMonitor/getByCollegeId',//获取站岗点监控数据

  'SECURITY_GET_STATISTICS_LIST': '/api/app/SecurityPatrol/SecurityHomeAnalysis/getAnalysis',//获取门岗安保统计报表
  'SECURITY_GET_EXE_LIST': '/api/app/SecurityPatrol/SecurityHomeAnalysis/getPointExecute',//岗点执岗情况一览
}


export default security
