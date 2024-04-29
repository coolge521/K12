let guestHouse = {
  'GET_PREMISES_LIST': '/api/app/hostel/room/premises/list',//获取楼宇列表
  'GET_PREMISES_INFO': '/api/app/hostel/room/premises/info',//获取楼宇信息
  'GET_ROOM_TYPE_LIST': '/api/app/hostel/room/dict/roomType/list',//获取所有房间类型
  'GET_ROOM_SERVICE_LIST': '/api/app/hostel/room/dict/supportService/list',//获取所有配置服务
  'SET_ROOM_SERVICE': '/api/app/hostel/room/setHostel',//设置房间配套服务
  'SET_ROOM_NUMBER': '/api/app/hostel/room/setRoomNo',//设置房间名称
  'SET_PREMISES_PHONE': '/api/app/hostel/room/premises/setPhone',//设置楼宇电话
  'GET_PREMISES_IMAGES': '/api/app/hostel/image/get',//获取楼宇图集
  'SET_PREMISES_IMAGES': '/api/app/hostel/image/set',//设置楼宇图集
  'DELETE_PREMISES_IMAGE': '/api/app/hostel/image/delete',//删除图集图片

  'GET_HOSTEL_TYPE_LIST': '/api/app/hostel/room/dict/roomType/list',//获取所有房型
  'DELETE_HOSTEL_TYPE': '/api/app/hostel/room/dict/roomType/delete',//删除房型
  'INSERT_HOSTEL_TYPE': '/api/app/hostel/room/dict/roomType/create',//新增房型
  'UPDATE_HOSTEL_TYPE': '/api/app/hostel/room/dict/roomType/update',//编辑房型

  'GET_HOSTEL_ASSORT_LIST': '/api/app/hostel/room/dict/supportService/list',//获取所有配套服务
  'DELETE_HOSTEL_ASSORT': '/api/app/hostel/room/dict/supportService/delete',//删除配套服务
  'INSERT_HOSTEL_ASSORT': '/api/app/hostel/room/dict/supportService/create',//新增配套服务
  'UPDATE_HOSTEL_ASSORT': '/api/app/hostel/room/dict/supportService/update',//编辑配套服务

  'GET_ROOM_RESERVE_LIST': '/api/app/hostel/admin/reserve/list',//获取预约列表
  'CONFIRM_RESERVE_ORDER': '/api/app/hostel/admin/reserve/agree',//确定订单
  'REFUSE_RESERVE_ORDER': '/api/app/hostel/admin/reserve/reject',//拒绝订单
  'CHECKIN_ORDER': '/api/app/hostel/admin/checkin',//登记入住
  'GET_HOSTEL_PREMISES_LIST': '/api/app/hostel/admin/premises/list',//获取招待所楼宇列表
  'GET_HOSTEL_FLOOR_LIST': '/api/app/hostel/admin/floor/list',//获取招待所楼层列表
  'GET_HOSTEL_ROOM_LIST': '/api/app/hostel/admin/room/list',//获取招待房间列表
  'GET_RESERVE_DETAIL': '/api/app/hostel/admin/order/info',//获取订单详情
  'LEAVE_HOSTEL': '/api/app/hostel/admin/leave',//退房
  'ADD_REMARK': '/api/app/hostel/admin/add/remark',//添加备注
  'DELETE_RESERVE_ORDER': '/api/app/hostel/admin/reserve/delete',//删除订单
  'GET_HOSTEL_RECORDS_LIST': '/api/app/hostel/admin/person/list',//获取入住记录
  'EXPORT_HOSTEL_RECORDS_LIST': '/api/app/hostel/admin/export/person/list',//导出列表

  'GET_CHECK_IN_PREVIEW_LIST': '/api/app/hostel/admin/premises/checkin/info',//获取入住一览列表

  'GET_CHECK_IN_STATUS_LIST': '/api/app/hostel/collect/hostelStay',//入住情况统计
  'GET_CHECK_IN_STATUS_HOTEL_TYPE': '/api/app/hostel/collect/hostelType',//房型入住情况统计
  'GET_CHECK_IN_STATUS_PREMISES': '/api/app/hostel/collect/premises',//楼宇入住情况统计
  'GET_CHECK_IN_PERSON_LIST': '/api/app/hostel/collect/stay/list',//入住人员列表

  'GET_HOSTEL_NEW_ADD': '/api/app/hostel/admin/reserve/new/task',//获取招待所新增提醒
  'GET_HOSTEL_NEW_CANCEL': '/api/app/hostel/admin/reserve/cancel/task',//获取招待所取消提醒
  'GET_HOSTEL_NEW_COUNT': '/api/app/hostel/admin/reserve/task/count',//获取招待所待审批菜单的数字

}


export default guestHouse
