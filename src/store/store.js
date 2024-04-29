import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    navListItem:[],
    topListItem:[],
    chooseHotelHierarchy:null,
    dictionary:[],
    politicalStore:[],
    // constructor:[],
    // animalSign:[],
    departments:[],
    jobNameCode:[],
    jobTitleCode:[],
    // state:[],
    // category:[],
    // employeeTitle:[],
    bloodType:[
      {
        id:1,
        tittle:'A型'
      },
      {
        id:2,
        tittle:'B型'
      },
      {
        id:3,
        tittle:'AB型'
      },
      {
        id:4,
        tittle:'O型'
      }
    ],
    constructor:[
      {
        id:'1',
        tittle:'水瓶座'
      },
      {
        id:'2',
        tittle:'双鱼座'
      },
      {
        id:'3',
        tittle:'白羊座'
      },
      {
        id:'4',
        tittle:'金牛座'
      },
      {
        id:'5',
        tittle:'双子座'
      },
      {
        id:'6',
        tittle:'巨蟹座'
      },
      {
        id:'7',
        tittle:'狮子座'
      },
      {
        id:'8',
        tittle:'处女座'
      },
      {
        id:'9',
        tittle:'天秤座'
      },
      {
        id:'10',
        tittle:'天蝎座'
      },
      {
        id:'11',
        tittle:'射手座'
      },
      {
        id:'12',
        tittle:'摩羯座'
      },
    ],//星座
    animalSign:[
      {
        id:'1',
        tittle:'鼠'
      },
      {
        id:'2',
        tittle:'牛'
      },
      {
        id:'3',
        tittle:'虎'
      },
      {
        id:'4',
        tittle:'兔'
      },
      {
        id:'5',
        tittle:'龙'
      },
      {
        id:'6',
        tittle:'蛇'
      },
      {
        id:'7',
        tittle:'马'
      },
      {
        id:'8',
        tittle:'羊'
      },
      {
        id:'9',
        tittle:'猴'
      },
      {
        id:'10',
        tittle:'鸡'
      },
      {
        id:'11',
        tittle:'狗'
      },
      {
        id:'12',
        tittle:'猪'
      },
    ],//属相
    studentType:[
      {
        id:'1',
        tittle:'专科生'
      },
      {
        id:'2',
        tittle:'本科生'
      },
      {
        id:'3',
        tittle:'硕士生'
      },
      {
        id:'4',
        tittle:'博士生'
      },
      {
        id:'5',
        tittle:'民族预科生'
      },
      {
        id:'6',
        tittle:'联合培养生'
      },
    ],//学生类型
    state:[
      {
        id:'1',
        tittle:'在职'
      },
      {
        id:'2',
        tittle:'退休'
      },
      {
        id:'3',
        tittle:'离职'
      },
      {
        id:'4',
        tittle:'逝世'
      }
    ],//人员状态
    category:[

    ],//人员类别
    employeeTitle:[
      {
        id:'1',
        tittle:'专任教师'
      },
      {
        id:'2',
        tittle:'管理干部'
      },
      {
        id:'3',
        tittle:'专业技术人员'
      },
      {
        id:'4',
        tittle:'工勤服务人员'
      },
    ],//教工类型

    role:[],
    leftMenu:'',
    openLeftMenuItem:[],
    topNav:'',
    systemName:'',
    indexItem:'',

    commonlyAddressList:[],
    pushCount:{},
  },
  getters:{
    role(state){
      if(localStorage.getItem('role') == undefined || localStorage.getItem('role') == 'undefined'){
        return state.role
      }
      state.role = JSON.parse(localStorage.getItem('role'))
      return state.role
    },
    chooseHotelHierarchy(state){
      state.chooseHotelHierarchy = JSON.parse(localStorage.getItem('chooseHotelHierarchy'))
      return state.chooseHotelHierarchy
    },
    navListItem(state){
      state.navListItem = JSON.parse(localStorage.getItem('navPpath'))
      return state.navListItem
    },
    topListItem(state){
      state.topListItem = JSON.parse(localStorage.getItem('topPath'))
      return state.topListItem
    },
    topNav(state){
      state.topNav = JSON.parse(localStorage.getItem('topNav'))
      return state.topNav
    },
    dictionary(state){
      state.dictionary = JSON.parse(localStorage.getItem('dictionary'))
      return state.dictionary
    },
    politicalStore(state){
      state.politicalStore = JSON.parse(localStorage.getItem('politicalStore'))
      return state.politicalStore
    },
    constructor(state){
      state.constructor = JSON.parse(localStorage.getItem('constructor'))
      return state.constructor
    },
    leftMenu(state){
      state.leftMenu = JSON.parse(localStorage.getItem('leftMenu'))
      return state.leftMenu
    },
    openLeftMenuItem(state){
      state.openLeftMenuItem = JSON.parse(localStorage.getItem('openLeftMenuItem'))
      return state.openLeftMenuItem
    },
    animalSign(state){
      state.animalSign = JSON.parse(localStorage.getItem('animalSign'))
      return state.animalSign
    },
    departments(state){
      state.departments = JSON.parse(localStorage.getItem('departments'))
      return state.departments
    },
    jobNameCode(state){
      state.jobNameCode = JSON.parse(localStorage.getItem('jobNameCode'))
      return state.jobNameCode
    },
    jobTitleCode(state){
      state.jobTitleCode = JSON.parse(localStorage.getItem('jobTitleCode'))
      return state.jobTitleCode
    },
    state(state){
      state.state = JSON.parse(localStorage.getItem('state'))
      return state.state
    },
    category(state){
      state.category = JSON.parse(localStorage.getItem('category'))
      return state.category
    },
    employeeTitle(state){
      state.employeeTitle = JSON.parse(localStorage.getItem('employeeTitle'))
      return state.employeeTitle
    },
    systemName(state){
      state.systemName = JSON.parse(localStorage.getItem('systemName'))
      return state.systemName
    },
    indexItem(state){
      state.indexItem = JSON.parse(localStorage.getItem('indexItem'))
      return state.indexItem
    },
    pushCount(state){
      state.pushCount = JSON.parse(localStorage.getItem('pushCount'))
      return state.pushCount
    },
    commonlyAddressList: (state) => () => {
      if(localStorage.getItem('commonlyAddressList')!= ""){
        state.commonlyAddressList = JSON.parse(localStorage.getItem('commonlyAddressList'))
        return state.commonlyAddressList
      }
    },
  },
  mutations:{
    role(state,msg){
      localStorage.setItem('role',JSON.stringify(msg))
      state.role = msg
    },
    navListItem(state,msg){
      localStorage.setItem('navPpath',JSON.stringify(msg))
      state.navListItem = msg
    },
    topListItem(state,msg){
      localStorage.setItem('topPath',JSON.stringify(msg))
      state.topListItem = msg
    },
    topNav(state,msg){
      localStorage.setItem('topNav',JSON.stringify(msg))
      state.topNav = msg
    },
    chooseHotelHierarchy(state,msg){
      localStorage.setItem('chooseHotelHierarchy',JSON.stringify(msg))
      state.chooseHotelHierarchy = msg
    },
    clickChangeItemType(state,msg){
      localStorage.setItem('Type',msg)
      state.changType = msg
    },
    dictionary(state,msg){
      localStorage.setItem('dictionary',JSON.stringify(msg))
      state.dictionary = msg
    },
    politicalStore(state,msg){
      localStorage.setItem('politicalStore',JSON.stringify(msg))
      state.politicalStore = msg
    },
    constructor(state,msg){
      localStorage.setItem('constructor',JSON.stringify(msg))
      state.constructor = msg
    },
    leftMenu(state,msg){
      localStorage.setItem('leftMenu',JSON.stringify(msg))
      state.leftMenu = msg
    },
    openLeftMenuItem(state,msg){
      localStorage.setItem('openLeftMenuItem',JSON.stringify(msg))
      state.openLeftMenuItem = msg
    },
    animalSign(state,msg){
      localStorage.setItem('animalSign',JSON.stringify(msg))
      state.animalSign = msg
    },
    departments(state,msg){
      localStorage.setItem('departments',JSON.stringify(msg))
      state.departments = msg
    },
    jobNameCode(state,msg){
      localStorage.setItem('jobNameCode',JSON.stringify(msg))
      state.jobNameCode = msg
    },
    jobTitleCode(state,msg){
      localStorage.setItem('jobTitleCode',JSON.stringify(msg))
      state.jobTitleCode = msg
    },
    state(state,msg){
      localStorage.setItem('state',JSON.stringify(msg))
      state.state = msg
    },
    category(state,msg){
      localStorage.setItem('category',JSON.stringify(msg))
      state.category = msg
    },
    employeeTitle(state,msg){
      localStorage.setItem('employeeTitle',JSON.stringify(msg))
      state.employeeTitle = msg
    },
    systemName(state,msg){
      localStorage.setItem('systemName',JSON.stringify(msg))
      state.systemName = msg
    },
    indexItem(state,msg){
      localStorage.setItem('indexItem',JSON.stringify(msg))
      state.indexItem = msg
    },
    pushCount(state,msg){
      localStorage.setItem('pushCount',JSON.stringify(msg))
      state.pushCount = msg
    },
    commonlyAddressList(state,msg){
      localStorage.setItem('commonlyAddressList',JSON.stringify(msg))
      state.commonlyAddressList = msg
    },
  }
})

export default store
