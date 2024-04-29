let visitor = {
  'VISITOR_CREATE_TEAM': '/api/app/visitRegistration/visitRegistrationTeam/createRegistrationTeam',//创建工作小组
  'VISITOR_UPDATE_TEAM': '/api/app/visitRegistration/visitRegistrationTeam/update',//更新工作小组
  'VISITOR_DELETE_TEAM': '/api/app/visitRegistration/visitRegistrationTeam/deleteById',//删除工作小组
  'VISITOR_GET_TEAM_DETAIL': '/api/app/visitRegistration/visitRegistrationTeam/getRegistrationTeamById',//获取工作小组详情
  'VISITOR_GET_TEAM_PAGE': '/api/app/visitRegistration/visitRegistrationTeam/getRegistrationTeamByPage',//获取工作小组列表
  'VISITOR_GET_TEAM_ALL': '/api/app/visitRegistration/visitRegistrationTeam/getRegistrationTeamAll',//获取工作小组所有

  'VISITOR_CREATE_SITE': '/api/app/visitRegistration/visitRegistrationPoint/createRegistrationPoint',//新增登记点
  'VISITOR_UPDATE_SITE': '/api/app/visitRegistration/visitRegistrationPoint/update',//更新登记点
  'VISITOR_DELETE_SITE': '/api/app/visitRegistration/visitRegistrationPoint/deleteById',//删除登记点
  'VISITOR_GET_SITE_DETAIL': '/api/app/visitRegistration/visitRegistrationPoint/getRegistrationPointById',//获取登记点详情
  'VISITOR_GET_SITE_PAGE': '/api/app/visitRegistration/visitRegistrationPoint/getRegistrationPointByPage',//获取登记点分页
  'VISITOR_GET_SITE_ALL': '/api/app/visitRegistration/visitRegistrationPoint/getRegistrationPointAll',//获取登记点分页

  'VISITOR_CREATE_CONFIG': '/api/app/visitRegistration/typeReasons/createTypeReasons',//新增配置
  'VISITOR_UPDATE_CONFIG': '/api/app/visitRegistration/typeReasons/update',//更新配置
  'VISITOR_DELETE_CONFIG': '/api/app/visitRegistration/typeReasons/deleteById',//删除配置
  'VISITOR_GET_CONFIG_DETAIL': '/api/app/visitRegistration/typeReasons/getTypeReasonsById',//获取配置详情
  'VISITOR_GET_CONFIG_PAGE': '/api/app/visitRegistration/typeReasons/getTypeReasonsByPage',//获取配置分页
  'VISITOR_GET_CONFIG_ALL': '/api/app/visitRegistration/typeReasons/getTypeReasonsAll',//获取配置分页

  'VISITOR_CREATE_RECORD': '/api/app/visitRegistration/visitRegistrationRecord/createRegistrationRecord',//手动登记录入
  'VISITOR_UPDATE_RECORD': '/api/app/visitRegistration/visitRegistrationRecord/update',//手动登记更新
  'VISITOR_GET_RECORD_PAGE': '/api/app/visitRegistration/visitRegistrationRecord/getVisitRecordPageInWeb',//获取登记列表
  'VISITOR_DELETE_RECORD': '/api/app/visitRegistration/visitRegistrationRecord/deleteById',//删除登记记录
  'VISITOR_GET_RECORD_LIST': '/api/app/visitRegistration/visitRegistrationRecord/getVisitRecordByPage',//获取来访记录列表
  'VISITOR_CREATE_RECORD_REMARK': '/api/app/visitRegistration/visitRegistrationRecord/createRemarks',//添加登记备注

  'VISITOR_RECORD_STATISTICS': '/api/app/visitRegistration/webAnalysis/getVisitRecordHomeAnalysis',//统计
  'VISITOR_RECORD_NOTICES': '/api/app/visitRegistration/visitRegistrationRecord/getScrollBar',//来访登记通知滚动

  'VISITOR_RECORD_ANALYSIS': '/api/app/visitRegistration/webAnalysis/getVisitRecordWebAnalysis',//来访记录统计
  'VISITOR_RECORD_AUDIT_COUNT': '/api/app/visitRegistration/webAnalysis/getVisitRecordWebAnalysis',//获取待审计的数量

}


export default visitor
