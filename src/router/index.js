import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
//push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

export default new Router({
  routes: [
    // {
    //   path: '/pages/index',
    //   name: 'HelloWorld',
    // },
    {
      path: '/index',
      name: 'index',
      meta: {
        CName: '首页'
      },
      component: resolve => require(['@/main/Index'], resolve),
      // meta: {
      //   keepAlive: true // 需要被缓存
      // },
      children: [
        {
          name: 'home',
          path: '/home',
          component: resolve => require(['@/main/Home'], resolve)
        },

        /**
         * 平台设置
         */
        {
          name: 'SchoolDistrictIndex',
          path: '/pages/sysParams/SchoolDistrictIndex',
          component: resolve => require(['@/pages/sysParams/SchoolDistrictIndex'], resolve),
        },
        {
          name: 'TeachSubjectIndex',
          path: '/pages/sysParams/TeachSubjectIndex',
          component: resolve => require(['@/pages/sysParams/TeachSubjectIndex'], resolve),
        },
        {
          name: 'CourseNameIndex',
          path: '/pages/sysParams/CourseNameIndex',
          component: resolve => require(['@/pages/sysParams/CourseNameIndex'], resolve),
        },
        {
          name: 'DepManageIndex',
          path: '/pages/sysParams/DepManageIndex',
          component: resolve => require(['@/pages/sysParams/DepManageIndex'], resolve),
        },
        {
          name: 'StaffInfoIndex',
          path: '/pages/sysParams/StaffInfoIndex',
          component: resolve => require(['@/pages/sysParams/StaffInfoIndex'], resolve),
        },
        {
          name: 'StudentInfoIndex',
          path: '/pages/sysParams/StudentInfoIndex',
          component: resolve => require(['@/pages/sysParams/StudentInfoIndex'], resolve),
        },
        {
          name: 'RolePermissionIndex',
          path: '/pages/sysParams/RolePermissionIndex',
          component: resolve => require(['@/pages/sysParams/RolePermissionIndex'], resolve),
        },
        {
          name: 'PaymentItemIndex',
          path: '/pages/sysParams/PaymentItemIndex',
          component: resolve => require(['@/pages/sysParams/PaymentItemIndex'], resolve),
        },


        /**
         * 用餐管理
         */
        {
          name: 'DinnerAnalysis',
          path: '/pages/dinner/DinnerAnalysis',
          component: resolve => require(['@/pages/dinner/DinnerAnalysis'], resolve),
        },
        {
          name: 'DinnerTimeSettingIndex',
          path: '/pages/dinner/DinnerTimeSettingIndex',
          component: resolve => require(['@/pages/dinner/DinnerTimeSettingIndex'], resolve),
        },
        {
          name: 'RecorderAuthIndex',
          path: '/pages/dinner/RecorderAuthIndex',
          component: resolve => require(['@/pages/dinner/RecorderAuthIndex'], resolve),
        },
        {
          name: 'DinnerRecordingIndex',
          path: '/pages/dinner/DinnerRecordingIndex',
          component: resolve => require(['@/pages/dinner/DinnerRecordingIndex'], resolve),
        },

        /**
         * 公告通知
         */
        {
          name: 'NoticeManageIndex',
          path: '/pages/notice/NoticeManageIndex',
          component: resolve => require(['@/pages/notice/NoticeManageIndex'], resolve),
        },
        /**
         * 缴费管理
         */
        {
          name: 'PaymentRecord',
          path: '/pages/payment/record',
          component: resolve => require(['@/pages/payment/record'], resolve),
        },
        {
          name: 'PaymentRecordDetail',
          path: '/pages/payment/recordDetail',
          component: resolve => require(['@/pages/payment/recordDetail'], resolve),
        },
        {
          name: 'PaymentStatistics',
          path: '/pages/payment/statistics',
          component: resolve => require(['@/pages/payment/statistics'], resolve),
        },
        {
          name: 'RefundIndex',
          path: '/pages/payment/RefundIndex',
          component: resolve => require(['@/pages/payment/RefundIndex'], resolve),
        },

        /**
         * 入校登记
         */
        {
          name: 'SignAnalysis',
          path: '/pages/sign/SignAnalysis',
          component: resolve => require(['@/pages/sign/SignAnalysis'], resolve),
        },
        {
          name: 'SignRecorderAuthIndex',
          path: '/pages/sign/SignRecorderAuthIndex',
          component: resolve => require(['@/pages/sign/SignRecorderAuthIndex'], resolve),
        },
        {
          name: 'SignRecordingIndex',
          path: '/pages/sign/SignRecordingIndex',
          component: resolve => require(['@/pages/sign/SignRecordingIndex'], resolve),
        },

        /**
         * 教工考勤
         */
        {
          name: 'AttendanceItemIndex',
          path: '/pages/attendance/AttendanceItemIndex',
          component: resolve => require(['@/pages/attendance/AttendanceItemIndex'], resolve),
        },
        {
          name: 'AttendancePlanIndex',
          path: '/pages/attendance/AttendancePlanIndex',
          component: resolve => require(['@/pages/attendance/AttendancePlanIndex'], resolve),
        },
        {
          name: 'AttendanceInputIndex',
          path: '/pages/attendance/AttendanceInputIndex',
          component: resolve => require(['@/pages/attendance/AttendanceInputIndex'], resolve),
        },
        {
          name: 'AttendanceAnalysis',
          path: '/pages/attendance/AttendanceAnalysis',
          component: resolve => require(['@/pages/attendance/AttendanceAnalysis'], resolve),
        },

        /**
         * 教工考核
         */
        {
          name: 'InspectionLevelIndex',
          path: '/pages/inspection/InspectionLevelIndex',
          component: resolve => require(['@/pages/inspection/InspectionLevelIndex'], resolve),
        },
        {
          name: 'InspectionItemIndex',
          path: '/pages/inspection/InspectionItemIndex',
          component: resolve => require(['@/pages/inspection/InspectionItemIndex'], resolve),
        },
        {
          name: 'InspectionAuthIndex',
          path: '/pages/inspection/InspectionAuthIndex',
          component: resolve => require(['@/pages/inspection/InspectionAuthIndex'], resolve),
        },
        {
          name: 'StaffInspectionIndex',
          path: '/pages/inspection/StaffInspectionIndex',
          component: resolve => require(['@/pages/inspection/StaffInspectionIndex'], resolve),
        },


        /**
         * 正在开发
         */
        {
          name: 'developing',
          path: '/pages/developing',
          component: resolve => require(['@/pages/developing'], resolve),
        },
      ]
    },


    {
      path: '/',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/main/Login',
      component: resolve => require(['@/main/Login'], resolve)
    },
    {
      name: 'leftNav',
      path: '/main/LeftMenu',
      component: resolve => require(['@/main/LeftMenu'], resolve)
    },

  ]
})
