
let umbrella = {
  'POINT_CREATE': '/api/app/umbrella/umbrellaServicePoint/createPoint',//创建更新服务点
  'POINT_DELETE': '/api/app/umbrella/umbrellaServicePoint/deletePointById',//删除服务点
  'GET_POINTS': '/api/app/umbrella/umbrellaServicePoint/getAllByCollegeId',//获取服务点  不分页
  'GET_POINTS_PAGE': '/api/app/umbrella/umbrellaServicePoint/getByCollegeId',//获取服务点  分页


  'GET_UMBRELLA_TYPE_ALL': '/api/app/umbrella/umbrellaType/getAllByCollegeId',//获取雨伞类型  不分页
  'GET_UMBRELLA_LIST_ALL': '/api/app/umbrella/umbrellaManagement/getByCollegeId',//获取雨伞列表  分页
  'CREATE_UMBRELLA': '/api/app/umbrella/umbrellaManagement/createUmbrella',//创建更新雨伞
  'DELETE_UMBRELLA': '/api/app/umbrella/umbrellaManagement/deleteById',//删除雨伞
  'EXPORT_UMBRELLA': '/api/app/umbrella/umbrellaManagement/downloadExcel',//导出雨伞
  'GET_SCRAP_UMBRELLA_LIST': '/api/app/umbrella/umbrellaScrapRecord/getUmbrellaById',//获取报废伞记录



  'UMBRELLA_TYPE_CREATE_UPDATE': '/api/app/umbrella/umbrellaType/createType',//创建/更新雨伞类型
  'UMBRELLA_TYPE_DELETE': '/api/app/umbrella/umbrellaType/deleteTypeById',//删除雨伞类型
  'UMBRELLA_TYPE_GET_PAGE': '/api/app/umbrella/umbrellaType/getByCollegeId',//获取雨伞类型  分页
  'UMBRELLA_TYPE_GET_ALL': '/api/app/umbrella/umbrellaType/getAllByCollegeId',//获取雨伞类型  不分页

  'UMBRELLA_SETTING_GET': '/api/app/umbrella/umbrellaSetting/getByCollegeId',//获取雨伞参数设置
  'UMBRELLA_SETTING_EDIT': '/api/app/umbrella/umbrellaSetting/createSetting',//创建/更新雨伞参数设置

  'GET_USER_BEHAVIOUR': '/api/app/umbrella/umbrellaUserScore/getByCollegeId',//获取用户行为
  'EXPORT_USER_BEHAVIOUR': '/api/app/umbrella/umbrellaUserScore/downloadScore',//用户行为导出

  'GET_USER_SCORE_RECORDS': '/api/app/umbrella/umbrellaUserScore/getDetailByUserId',//获取用户的积分记录列表
  'REPEAL_SCORE': '/api/app/umbrella/umbrellaUserScore/adminCancelScore',//撤销积分

  'GET_BORROW_LIST': '/api/app/umbrella/umbrellaBorrowRecords/getBorrowList',//获取供还信息列表
  'EXPORT_BORROW_LIST': '/api/app/umbrella/umbrellaBorrowRecords/downloadRecord',//导出供还信息
  'GET_URGE_RETURN_LIST': '/api/app/umbrella/umbrellaUrge/getByUserId',//获取最近十条催还记录
  'POST_URGE_RETURN': '/api/app/umbrella/umbrellaUrge/sendUrge',//发送供还信息提醒

}
export default umbrella
