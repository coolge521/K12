let ucRouter = {}


//公用
ucRouter.common = [
  {name: 'home', path: '/home', component: 'main/Home'}
]

//设备设施
ucRouter.equipment = [
  {name: 'maintenanceGroupTable', path: '/apartment/group/list', component: 'equipment/setting/MaintenanceGroupTable'},
  {name: 'maintenanceParameters', path: '/apartment/parameters/list', component: 'equipment/setting/MaintenanceParametersTable'},
  {name: 'installationCompanys', path: '/apartment/installationCompany/list', component: 'equipment/setting/InstallationCompanyTable'},
]

//校园报修
ucRouter.repair = [
  //管理配置
  {name: 'teamList', path: '/repair/team/list', component: 'repair/setting/TeamList'},
  {name: 'projectCategoryList', path: '/repair/project/category/list', component: 'repair/setting/ProjectCategoryList'},
  {name: 'parts', path: '/repair/parts/list', component: 'repair/setting/PartsList'},
  {name: 'labors', path: '/repair/labor/list', component: 'repair/setting/LaborList'},
  {name: 'systemSetting', path: '/repair/systemSetting', component: 'repair/setting/SystemSetting'},
  {name: 'remindMessageSwitchSetting', path: '/repair/remindMessageSwitchSetting', component: 'repair/setting/RemindMessageSwitchSetting'},
  {name: 'evaluateObjectSettings', path: '/repair/evaluateObjectSetting', component: 'repair/setting/EvaluateProjectList'},
  {name: 'messageDetails', path: '/repair/messageDetails', component: 'repair/setting/MessageDetailList'},
  {name: 'repairHours', path: '/repair/repairHour/list', component: 'repair/setting/RepairHourList'},

  //报修数据
  {name: 'newestList', path: '/repair/newest/list', component: 'repair/data/NewestList'},

  {name: 'installationCompanys', path: '/apartment/installationCompany/list', component: 'equipment/setting/InstallationCompanyTable'},
]

//通勤车
ucRouter.car = [
  {name: 'sendCar', path: '/car/sendCar', component: 'car/setting/SendCar'},

  {name: 'carStation', path: '/car/station', component: 'car/setting/station'},
  {name: 'carCar001', path: '/car/car001', component: 'apartment/statistics/FacultyBed'}
]

//公寓
ucRouter.apartment = [
  {name: 'sendCar', path: '/car/sendCar', component: 'car/setting/SendCar'},
  {name: 'carStation', path: '/car/station', component: 'car/setting/station'},
  {name: 'carCar001', path: '/car/car001', component: 'apartment/statistics/FacultyBed'}
]

ucRouter.switch = function (router, sysName) {
  // var info = {'router': router, 'sysName': sysName};
  // localStorage.setItem('ucRouter', JSON.stringify(info));

  router.options.routes[0].children.length = 0;
  ucRouter.loadCommon(router);//加载公共路由

  var routers = ucRouter[sysName];
  var dynamicRouters = [];

  for (var i = 0; i < routers.length; i++) {
    var curRouter = {};
    curRouter = routers[i];
    let name = curRouter.name;
    let path = curRouter.path;
    let comName = curRouter.component;

    dynamicRouters.push({
      name: name,
      path: path,
      component: resolve => require(['@/' + comName + '.vue'], resolve)
    });

    // router.options.routes[0].children.push({
    //   name: name,
    //   path: path,
    //   component: resolve => require(['@/' + comName + '.vue'], resolve)
    // });
  }

  router.options.routes[0].children = dynamicRouters;
  router.addRoutes(router.options.routes);
}

ucRouter.loadCommon = function (router) {
  var routers = ucRouter.common;
  var dynamicRouters = [];

  for (var i = 0; i < routers.length; i++) {
    var curRouter = {};
    curRouter = routers[i];
    let name = curRouter.name;
    let path = curRouter.path;
    let comName = curRouter.component;
    dynamicRouters.push({
      name: name,
      path: path,
      component: resolve => require(['@/' + comName + '.vue'], resolve)
    });

    router.options.routes[0].children.push({
      name: name,
      path: path,
      component: resolve => require(['@/' + comName + '.vue'], resolve)
    });
  }
  router.options.routes[0].children = dynamicRouters;
  router.addRoutes(router.options.routes);
}

export default ucRouter
