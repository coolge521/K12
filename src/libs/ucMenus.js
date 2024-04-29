

let ucMenu = {}

// 首页顶部导航栏
ucMenu.indexNav = {
  systemName: '首页',
  subsystem: '首页',
  module: '首页',
  url: '',
  nav: [
    {name: '首页', url: 'home', role: [], display: 1},
    {name: '平台管理', url: 'PlatformManage', role: [''], moduleCode: 1},
    //{name: '课表排课', url: 'ClassScheduleManage', role: [''], moduleCode: 2},
    //{name: '校车出行', url: 'SchoolBusManage', role: [''], moduleCode: 3},

    {name: '教工考核', url: 'StaffInspection', role: [''], moduleCode: 4},
    {name: '教工考勤', url: 'StaffAttendance', role: [''], moduleCode: 5},
    {name: '入校登记', url: 'SignInRecords', role: [''], moduleCode: 6},
    {name: '用餐登记', url: 'DinnerRecords', role: [''], moduleCode: 7},
    {name: '缴费管理', url: 'PaymentManage', role: [''], moduleCode: 8},
    {name: '公告通知', url: 'PublicNotice', role: [''], moduleCode: 9},
  ],
}

//平台管理
ucMenu.PlatformManage = {
  systemName: '平台管理',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    // {
    //   icon: 'md-person',
    //   name: '首页',
    //   url: 'home',
    //   role: [''],
    // },
    {
      icon: 'md-person',
      name: '平台设置',
      url: 'sysParams',
      role: [''],
      firstLayerNav: [
        {
          icon: 'md-person', name: '校区设置', url: 'SchoolDistrictIndex', role: [''],
        },
        {
          icon: 'md-person', name: '教学科目', url: 'TeachSubjectIndex', role: [''],
        },
        {
          icon: 'md-person', name: '课程名称', url: 'CourseNameIndex', role: [''],
        },
        {
          icon: 'md-person', name: '部门管理', url: 'DepManageIndex', role: [''],
        },
        {
          icon: 'md-person', name: '教工信息', url: 'StaffInfoIndex', role: [''],
        },
        {
          icon: 'md-person', name: '学生信息', url: 'StudentInfoIndex', role: [''],
        },
        {
          icon: 'md-person', name: '角色权限', url: 'RolePermissionIndex', role: [''],
        },
        {
          icon: 'md-person', name: '缴费项目', url: 'PaymentItemIndex', role: [''],
        },
      ],
    },

  ],
}


//课表排课
ucMenu.ClassScheduleManage = {
  systemName: '课表排课',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    {
      icon: 'md-person',
      name: '首页',
      url: 'home',
      role: [''],
    },
    {
      icon: 'md-person',
      name: '课表排课',
      url: 'scheduleSetting',
      role: [],
      firstLayerNav: [
        {
          icon: 'md-person', name: '课表时段', url: 'ScheduleTimeRangeIndex', role: [''],
        },
        {
          icon: 'md-person', name: '课表管理', url: 'ScheduleManageIndex', role: [''],
        },
      ],
    },
  ],
}

//校车出行
ucMenu.SchoolBusManage = {
  systemName: '校车出行',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    {
      icon: 'md-person',
      name: '首页',
      url: 'index',
      role: [],
    },
    {
      icon: 'md-person',
      name: '校车出行',
      url: 'schoolBus',
      role: [],
      firstLayerNav: [
        {
          icon: 'md-person', name: '出车计划', url: 'BusPlanIndex', role: [''],
        },
        {
          icon: 'md-person', name: '出车记录', url: 'BusRecordIndex', role: [''],
        },
      ],
    },
  ],
}

//教工考核
ucMenu.StaffInspection = {
  systemName: '教工考核',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    {
      icon: 'md-person',
      name: '教工考核',
      url: 'staffInspection',
      role: [],
      firstLayerNav: [
        {
          icon: 'md-person', name: '考核评级', url: 'InspectionLevelIndex', role: [''],
        },
        {
          icon: 'md-person', name: '考核项目', url: 'InspectionItemIndex', role: [''],
        },
        {
          icon: 'md-person', name: '考核授权', url: 'InspectionAuthIndex', role: [''],
        },
        {
          icon: 'md-person', name: '教工考核', url: 'StaffInspectionIndex', role: [''],
        },
      ],
    },
  ],
}

//教工考勤
ucMenu.StaffAttendance = {
  systemName: '教工考勤',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    {
      icon: 'md-person',
      name: '教工考勤',
      url: 'attendance',
      role: [],
      firstLayerNav: [
        {
          icon: 'md-person', name: '考勤项目', url: 'AttendanceItemIndex', role: [''],
        },
        {
          icon: 'md-person', name: '考勤计划', url: 'AttendancePlanIndex', role: [''],
        },
        {
          icon: 'md-person', name: '考勤录入', url: 'AttendanceInputIndex', role: [''],
        },
        {
          icon: 'md-person', name: '考勤统计', url: 'AttendanceAnalysis', role: [''],
        },
      ],
    },
  ],
}

//用餐管理
ucMenu.DinnerRecords = {
  systemName: '用餐管理',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    {
      icon: 'md-person',
      name: '用餐管理',
      url: 'dinner',
      role: [],
      firstLayerNav: [
        {
          icon: 'md-person', name: '用餐统计', url: 'DinnerAnalysis', role: [''],
        },
        {
          icon: 'md-person', name: '用餐时段配置', url: 'DinnerTimeSettingIndex', role: [''],
        },
        {
          icon: 'md-person', name: '登记员授权', url: 'RecorderAuthIndex', role: [''],
        },
        {
          icon: 'md-person', name: '用餐登记', url: 'DinnerRecordingIndex', role: [''],
        },
      ],
    },
  ],
}

//公告通知
ucMenu.PublicNotice = {
  systemName: '公告通知',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    // {
    //   icon: 'md-person',
    //   name: '首页',
    //   url: 'index',
    //   role: [],
    // },
    {
      icon: 'md-person',
      name: '公告通知',
      url: 'notice',
      role: [],
      firstLayerNav: [
        {
          icon: 'md-person', name: '发布管理', url: 'NoticeManageIndex', role: [''],
        },
      ],
    },
  ],
}

ucMenu.PaymentManage = {
  systemName: '缴费管理',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    {
      icon: 'md-person',
      name: '缴费管理',
      url: 'payment',
      role: [],
      firstLayerNav: [
        {
          icon: 'md-person', name: '缴费记录', url: 'PaymentRecord', role: [''],
        },
        {
          icon: 'md-person', name: '缴费明细', url: 'PaymentRecordDetail', role: [''],
        },
        {
          icon: 'md-person', name: '缴费统计', url: 'PaymentStatistics', role: [''],
        },
        {
          icon: 'md-person', name: '退费管理', url: 'RefundIndex', role: [''],
        },

      ],
    },
  ],
}

//入校登记
ucMenu.SignInRecords = {
  systemName: '入校登记',
  subsystem: '',
  module: '',
  url: '',
  nav: [
    {
      icon: 'md-person',
      name: '入校管理',
      url: 'payment',
      role: [],
      firstLayerNav: [
        {
          icon: 'md-person', name: '入校登记员授权', url: 'SignRecorderAuthIndex', role: [''],
        },
        {
          icon: 'md-person', name: '入校登记', url: 'SignRecordingIndex', role: [''],
        },
        {
          icon: 'md-person', name: '入校统计', url: 'SignAnalysis', role: [''],
        },

      ],
    },
  ],
}
export default ucMenu
