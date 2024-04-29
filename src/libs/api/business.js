let business = {
  'MERCHANT_USER_CHECK': '/api/business/merchant/user/checkBusinessUser',//获取用户相关商户账号信息
  'MERCHANT_COLLEGE_BUSINESS': '/api/business/merchant/getBusinessByCollege',//获取学校周边商户

  'MERCHANT_GET_CATEGORY': '/api/business/merchant/product/category/get',//获取商品类别
  'MERCHANT_GET_CATEGORY_BY_ID': '/api/business/merchant/product/category/getById',//根据ID获取商品类别
  'MERCHANT_SAVE_CATEGORY': '/api/business/merchant/product/category/saveOrUpdate',//保存商品类别
  'MERCHANT_DELETE_CATEGORY': '/api/business/merchant/product/category/delete',//删除商品类别

  'MERCHANT_GET_PRODUCT': '/api/business/merchant/product/get',//获取商品
  'MERCHANT_GET_PRODUCT_BY_ID': '/api/business/merchant/product/getById',//根据ID获取商品
  'MERCHANT_CREATE_PRODUCT': '/api/business/merchant/product/create',//创建新的商品
  'MERCHANT_UPDATE_PRODUCT': '/api/business/merchant/product/update',//更新商品
  'MERCHANT_DELETE_PRODUCT': '/api/business/merchant/product/delete',//删除商品
  'REPAST_GET_FOOD_TYPE': '/api/app/repast/foodtype/get',//获取食材类别
  'REPAST_GET_FOOD_MATERIAL': '/api/app/repast/foodmaterial/get',//查询食材列表
  'MERCHANT_ADD_PRODUCT_CATEGORY_MAPPING': '/api/business/merchant/product/category/mapping/create',//商品上架
  'MERCHANT_DELETE_PRODUCT_CATEGORY_MAPPING': '/api/business/merchant/product/category/mapping/delete',//删除货架商品

  'MERCHANT_GET_DISHES_LIST': '/api/business/merchant/dishes/status/getList',//获取下单数据
  'MERCHANT_GET_DISHES_BY_ID': '/api/business/merchant/dishes/getDishes',//根据ID获取
  'MERCHANT_DISHES_CONFIRM_ORDER': '/api/business/merchant/dishes/status/confirmOrder',//确认订单
  'MERCHANT_DISHES_CONFIRM_PAY': '/api/business/merchant/dishes/status/confirmPay',//确认收款
  'MERCHANT_DISHES_CONFIRM_SERVE_FOOD': '/api/business/merchant/dishes/status/confirmServefood',//确认上菜
  'MERCHANT_DISHES_AGREE_REFUND': '/api/business/merchant/dishes/status/agreeRefund',//同意退款
  'MERCHANT_DISHES_REFUSE_REFUND': '/api/business/merchant/dishes/status/refuseRefund',//拒绝退款
  'MERCHANT_DISHES_COMMENT_REPLY': '/api/business/merchant/dishes/saveReply',//商家回复评价

  'MERCHANT_GET_SALE_COLLECT': '/api/business/merchant/dishes/collect/getSaleCollect',//餐饮首页-营业汇总
  'MERCHANT_GET_SALE_TREND': '/api/business/merchant/dishes/collect/getSaleTrend',//餐饮首页-订单走势图
  'MERCHANT_GET_PRODUCT_RANK': '/api/business/merchant/dishes/collect/getProductRank',//餐饮首页-排名统计
  'MERCHANT_GET_BUSINESS_RANK': '/api/business/merchant/dishes/collect/getBusinessRank',//餐饮首页-店铺营业排名
  'MERCHANT_EDIT_CATEGORY_PRODUCTS': '/api/business/merchant/product/category/edit',//编辑货架列表

  'BUSINESS_TAKE_SITE_TEAM_LIST_PAGE': '/api/business/takesite/team/page',//获取提货点班组列表分页
  'BUSINESS_TAKE_SITE_TEAM_LIST_ALL': '/api/business/takesite/team/list',//获取提货点班组列表 所有
  'BUSINESS_TAKE_SITE_TEAM_CREAT': '/api/business/takesite/team/insert',//创建提货点班组
  'BUSINESS_TAKE_SITE_TEAM_UPDATE': '/api/business/takesite/team/update',//更新提货点班组
  'BUSINESS_TAKE_SITE_TEAM_DELETE': '/api/business/takesite/team/delete',//删除提货点班组
  'BUSINESS_TAKE_SITE_TEAM_DELETE_USER': '/api/business/takesite/team/delete/user',//删除提货点班组人员

  'BUSINESS_TAKE_SITE_LIST_PAGE': '/api/business/takesite/page',//获取提货点列表分页
  'BUSINESS_TAKE_SITE_LIST_PAGE_RANGE': '/api/business/takesite/range/list',//按距离查询获取提货点列表
  'BUSINESS_TAKE_SITE_CREAT': '/api/business/takesite/insert',//创建提货点
  'BUSINESS_TAKE_SITE_UPDATE': '/api/business/takesite/update',//更新提货点
  'BUSINESS_TAKE_SITE_DELETE': '/api/business/takesite/delete',//删除提货点

  'BUSINESS_IN_COME': '/api/business/merchant/dishes/collect/income',//收入统计 收入
  'BUSINESS_REFUND': '/api/business/merchant/dishes/collect/refund',//收入统计  退款

  'BUSINESS_IN_COME_EXPORT': '/api/business/merchant/dishes/collect/income/export',//收入统计 收入
  'BUSINESS_REFUND_EXPORT': '/api/business/merchant/dishes/collect/refund/export',//收入统计  退款
  'BUSINESS_ORDER_EXPORT': '/api/business/merchant/dishes/status/export/list',//订单导出

}


export default business
