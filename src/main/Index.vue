<template>
  <div class="layout v-cloak" style="border: 0;">
    <Layout :style="{height: '100%'}">
      <Header >
        <Menu accordion ref="menu" mode="horizontal" :theme=menuTheme :active-name="activeName" @on-select="clickNav">
          <div style="width: 80%!important;display: flex;align-items: center;justify-content: flex-start">
            <div style="display:flex;align-items: center;flex-wrap: nowrap;min-width: 200px">
              <img :src="iconImg" class="layout-logo-img" style="border-radius: 50%"/>&nbsp;
<!--              <img src="../../static/images/logo-right.jpg" class="layout-logo-img" style="margin-left: 20px"/>-->

              <span v-if="this.$util.getLocal('school')!= undefined" style="font-size: 1.8em;color: white;font-weight: bold;margin-left: 20px">{{this.$util.getLocal("school").name}}</span>

<!--              <div style="width: 2px;height: 20px;background: #C2C7D9;margin-right: 25px;"></div>-->
              <!--              <span style="display: flex;align-items: center;font-size: 1.5em;height: 100%;right: 10px">{{systemName}}</span>-->
            </div>
            <div style="width: 2px;height: 20px;background: #C2C7D9;margin-left:60px;margin-right: 5px;"></div>
            <div style="margin-left: 10px">
              <Submenu name="otherSystem" v-if="indexNav.length != 0">
                <template slot="title">
  <!--                  <Icon type="ios-clipboard"/>-->
                    {{systemName}}
                </template>
                <MenuItem v-for="n in indexNav" :name="n.url" :key="n.id" :id="n.id" >
                  {{n.name}}
                </MenuItem>
              </Submenu>

            </div>
          </div>


          <div style="position: absolute;right: 0px;top:0px;width: 50%!important;display: flex;align-items: center;justify-content: flex-end">
            <div style="display: flex;align-items: center;justify-content: flex-end;margin-right: 3%;padding-bottom: 1%;">
              <div style="display: flex;justify-content: center;align-items: flex-end;margin-top: 5px;">
                <strong style="font-size:15px;color:#eeeeee;">{{day}}</strong>
                <strong style="font-size:15px;color:#eeeeee;margin-left: 5px">{{week}}</strong>
                <strong style="font-size:15px;color:#eeeeee;margin-left: 20px">{{time}}</strong>
              </div>
              <div style="display: flex;justify-content: center;margin-left: 20px;align-items: center;margin-top: 5px;">
                <img :src="weather.icon" style="width: 25px;height: 20px;margin-right: 5px"/>
                <strong style="font-size:15px;color:#eeeeee;">{{weather.info}}</strong>
                <strong style="font-size:15px;color:#eeeeee;margin-left: 5px">{{weather.temperature}}</strong>
              </div>
            </div>
            <div class="layout-login" style="margin: 0px!important;">
              <Submenu name="login-user">
                <template slot="title" class="word-v-middle"
                          style="vertical-align: middle;text-align: center;height: 30px">
                  <img :src="loginUser.photo== undefined?nameImg:loginUser.photo" class="layout-login-img"/>
                  &nbsp;{{loginUser.nickname}}
                </template>
                <!--              <MenuItem name="login-user-1">个人中心</MenuItem>-->
                <!--              <MenuItem name="login-user-2" @click.native="setModuleTemplate">模块管理</MenuItem>-->

                <Dropdown placement="right-start" v-if="$util.getSession('admin')==2 && collegeServers.length>0"  @on-click="changeServer">
                  <DropdownItem>
                    超级登陆
                    <Icon type="ios-arrow-forward"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list">
                    <DropdownItem :name="index" v-for="(server,index) in collegeServers" v-bind:key="index" :selected="$util.getSession('curServer')==server.collegeId">{{server.name}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <MenuItem name="login-user-4" @click.native="showChangePwdModal">修改密码</MenuItem>
                <MenuItem name="login-user-3" @click.native="logout()">退出系统</MenuItem>
                <MenuItem name="help">帮助中心</MenuItem>

              </Submenu>
            </div>
          </div>


        </Menu>
      </Header>

      <Layout :class="[ menuItmes.length != 0 ? 'sl' : '' ]">
        <Sider v-if="menuItmes.length != 0" hide-trigger class="ivu-card" :style="{background: '#fff',}" v-model="isCollapsed" collapsible
               :collapsed-width="78"> <!-- ivu-card-bordered :style="{background: '#fff'}" -->
          <leftmenu ref="menuItmes" :menuItmes="menuItmes" :isCollapsed="isCollapsed"></leftmenu>
          <!--<leftmenu></leftmenu>-->
        </Sider>

        <!--面包屑-->
        <Content :style="{padding: '0 10px'}">
          <Layout>
            <bread></bread>

            <Content style="height: 100%;">
              <Card class="mainCss" dis-hover>
                <router-view ref="routerView" style="height: 100%;" id="main-content"></router-view>
              </Card>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>


    <Modal v-model="showModal" title="修改密码" width="600"  :mask-closable="false" :closable="false">
      <Form ref="entityform" :model="account" :label-width="90" :rules="ruleValidate">
        <Row>
          <Col span="24">
            <FormItem label="手机号" prop="phone">
              <Input v-model="account.phone" placeholder="请输入手机号" type="tel" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="旧密码" prop="old">
              <Input v-model="account.old" placeholder="请输入旧密码" type="password" style="width: 80%;"></Input>
              <span style="text-align: right;width: 80px;color: #589DF6;" @click="ifForgetPwd">忘记旧密码？</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="新密码" prop="password">
              <Input v-model="account.password" placeholder="请输入新密码" type="password"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="新密码" prop="passwordAgain">
              <Input v-model="account.passwordAgain" placeholder="请再次输入新密码" type="password"></Input>
            </FormItem>
          </Col>
        </Row>
<!--        <Row>-->
<!--          <Col span="24">-->
<!--            <FormItem label="验证码" prop="code">-->
<!--              <Input v-model="account.code" placeholder="请输入手机收到的验证码" type="text" style="width: 82%;padding: 3px;"></Input>-->
<!--              <Button type="primary" size="small" @click="getCode()" :disabled="disabled" style="width: 80px;">{{buttonText}}</Button>-->
<!--            </FormItem>-->
<!--          </Col>-->
<!--        </Row>-->
      </Form>
      <div slot="footer">
        <Button v-if="(this.$util.checkPasswordRole1(this.$util.getSession('password'))  && this.$util.checkPasswordRole2(this.$util.getSession('password')))|| this.$util.getSession('username')=='admin'" type="text" size="large" @click="showModal=false">取消</Button>
        <Button v-else type="text" size="large" @click="logout">退出系统</Button>
        <Button type="primary" size="large" @click="changePassword()" :loading="loading">确定</Button>
      </div>
    </Modal>



    <audio id="businessAudio" controls :autoplay="true" :hidden="true"></audio>


    <!--    <img v-if="audioPlay" src="../../static/images/notice_icon.png" style="height: 60px;width: 60px;position: absolute;bottom: 20px;left: 20px"@click="audioPlay=false">-->
    <!--    <img v-if="!audioPlay" src="../../static/images/notice_icon.png" class="gray" style="height: 60px;width: 60px;position: absolute;bottom: 20px;left: 20px" @click="audioPlay=true">-->
  </div>

</template>

<script>

  import util from "@/libs/util.js";
  import ucMenu from "@/libs/ucMenus.js";
  import leftmenu from "@/main/LeftMenu";
  import bread from '@/main/bread'
  import md5 from "js-md5";

  export default {
    components: {
      leftmenu,
      bread,
      ucMenu
    },
    data() {
      const validatePwdRole = (rule, value, callback) => {
        if(!this.$util.checkPasswordRole1(value)){
          callback(new Error('密码由8-16位数字、字母或符号组成'));
        }
        if(!this.$util.checkPasswordRole2(value)){
          callback(new Error('至少包含数字、字母、符号2种以上字符'));
        }
        if(this.$util.checkPasswordRole1(value) && this.$util.checkPasswordRole2(value)){
          callback();
        }
      };

      return {
        moduleModal: false,
        indeterminate: true,
        checkAll: false,
        checkAllGroup: [],//回显
        checkAllGroupEcho: [],//回显存储
        setModuleItem: [],//数组
        accordingItem: {},//数据数组
        accordingList: [],//提交数组
        schoolItem: null,
        nothingModule: [],//分离无用数组


        time:'',
        day:'',
        week:'',
        weather:{info:'晴',temperature:'10-25℃',icon:'./static/images/weather/晴天.png'},
        city:'江门市',
        dataInterval:null,

        loginUser: {},
        navItems: [],
        menuItmes: [],
        isCollapsed: false,
        indexNav: [],
        watchNav: [],
        queryNav: [],
        iconImg: './static/images/logo.jpg',//./static/images/logo.png
        collegeName: '',
        nameImg: './static/images/default_head1.png',
        upperName: '',
        activeName: this.$store.getters.topNav,
        systemName: this.$store.getters.systemName == undefined ? "首页" : this.$store.getters.systemName,

        indexItem: {
          name: this.$store.getters.indexItem
        },

        account: {
          phone: '',
          password: '',
          passwordAgain: '',
          code: '',
        },
        showModal: false,
        ruleValidate: {
          phone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'}
          ],
          old: [
            {required: true, message: '旧密码不能为空', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '新密码不能为空', trigger: 'blur'},
            {validator: validatePwdRole, trigger: 'blur'},
          ],
          passwordAgain: [
            {required: true, message: '新密码不能为空', trigger: 'blur'},
            {validator: validatePwdRole, trigger: 'blur'},
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ],
        },
        buttonText: '获取验证码',
        seconds: 60,
        timeInterval: null,
        disabled: false,
        loading: false,

        timer:null,
        active: false,
        placeNewsActive: false,
        placeNewsCount: 0,
        placeNewsDateTime: '',

        hostelNewAddActive: false,
        hostelNewCancelActive: false,
        hostelNewCount: 0,

        audioPlay: false,

        collegeServers:[],

        menuTheme:'light',
      }
    },
    watch: {
      menuItmes() {
        // if (this.$refs.routerView.reDrawEcharts != undefined) {
        //   this.$refs.routerView.reDrawEcharts();
        // }
      }
    },
    methods: {



      clickIndex(name) {
        this.$load.show();
        this.$router.push({
          name: name,
        })
        this.menuItmes = [];
        this.$store.commit('openLeftMenuItem', '')
        this.$store.commit('leftMenu', '')
        this.$store.commit('navListItem', '')
        this.$load.hide();
      },
      clickNav(name) {


        if (name == 'home') {
          this.systemName = '首页'
          this.$store.commit('systemName', this.systemName)
          this.clickIndex(name);
          return;
        }
        if (this.$store.state.role == undefined) {
          if (name != 'business' && name != 'apartmentMyNav' && name != 'login-user-3' && name != 'onlineChooseRoom' && name != 'apartment') {
            this.$Message.error('权限不足');
            return;
          }
        }

        if (this.$refs.menuItmes != undefined) {
          this.$refs.menuItmes.activeName = '';
          this.$refs.menuItmes.openActiveName = [''];
          this.$nextTick(() => {
            if (this.$refs.menuItmes != undefined) {
              this.$refs.menuItmes.$refs.menu.updateOpened();
              this.$refs.menuItmes.$refs.menu.updateActiveName();
            }
          })
        }
        this.$store.commit('topNav', name)
        this.activeName = name;
        switch (name) {

          //父系统
          case 'PlatformManage'://平台管理
            this.systemName = ucMenu.PlatformManage.systemName//top
            this.indexItem.name = 'PlatformManage';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.PlatformManage.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.PlatformManage.nav)
            break;
          case 'ClassScheduleManage'://课表排课
            this.$Modal.info({title:'提示',content:'开发中，敬请期待...'})
            return
            /*this.systemName = ucMenu.ClassScheduleManage.systemName//top
            this.indexItem.name = 'ClassScheduleManage';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.ClassScheduleManage.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.ClassScheduleManage.nav)*/
            break;
          case 'SchoolBusManage'://校车出行
            this.$Modal.info({title:'提示',content:'开发中，敬请期待...'})
            return
           /* this.systemName = ucMenu.SchoolBusManage.systemName//top
            this.indexItem.name = 'SchoolBusManage';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.SchoolBusManage.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.SchoolBusManage.nav)*/
            break;
          case 'StaffInspection'://教工考核
            this.systemName = ucMenu.StaffInspection.systemName//top
            this.indexItem.name = 'StaffInspection';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.StaffInspection.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.StaffInspection.nav)
            break;
          case 'StaffAttendance'://教工考勤
            this.systemName = ucMenu.StaffAttendance.systemName//top
            this.indexItem.name = 'StaffAttendance';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.StaffAttendance.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.StaffAttendance.nav)
            break;
          case 'SignInRecords'://入校登记
            this.systemName = ucMenu.SignInRecords.systemName//top
            this.indexItem.name = 'SignInRecords';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.SignInRecords.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.SignInRecords.nav)
            break;
          case 'DinnerRecords'://用餐管理
            this.systemName = ucMenu.DinnerRecords.systemName//top
            this.indexItem.name = 'DinnerRecords';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.DinnerRecords.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.DinnerRecords.nav)
            break;
          case 'PublicNotice'://公告通知
            this.systemName = ucMenu.PublicNotice.systemName//top
            this.indexItem.name = 'PublicNotice';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.PublicNotice.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.PublicNotice.nav)
            break;
          case 'PaymentManage'://缴费
            this.systemName = ucMenu.PaymentManage.systemName//top
            this.indexItem.name = 'PaymentManage';
            this.$store.commit('systemName', this.systemName)
            this.$store.commit('indexItem', this.indexItem.name)
            this.menuItmes = ucMenu.PaymentManage.nav;//left
            this.$store.commit('navListItem', this.menuItmes)
            this.$store.commit('topListItem', ucMenu.PaymentManage.nav)
            break;
        }

        if (this.menuItmes[0].firstLayerNav == undefined) {
          this.$router.push({
            name: this.menuItmes[0].url,
          })
          this.$nextTick(() => {
            this.$refs.menuItmes.clickMenu(this.menuItmes[0].name, this.menuItmes[0].url);
          })
        } else {
          if (this.menuItmes[0].firstLayerNav != undefined && this.menuItmes[0].firstLayerNav.length > 0) {
            this.$router.push({
              name: this.menuItmes[0].firstLayerNav[0].url,
            })
            // this.$nextTick(() => {
            //   this.$refs.menuItmes.clickMenu(this.menuItmes[0].firstLayerNav[0].name, this.menuItmes[0].firstLayerNav[0].url);
            // })
            this.$store.commit('openLeftMenuItem', [this.menuItmes[0].url])
            this.$store.commit('leftMenu', this.menuItmes[0].firstLayerNav[0].url)
            this.$nextTick(() => {
              this.$refs.menuItmes.leftMenuAn()
            })
          }
        }

      },
      logout() {
        let self = this;
        this.$Modal.confirm({
          title: '退出登录',
          content: '您确定要退出登录吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            this.$Message.success('退出登录成功!');

            util.claerSession("user");
            util.clearLocal("schoolId");
            util.claerSession("token");
            util.claerSession("username");
            util.claerSession("userId");
            util.claerSession("memberId");
            util.claerSession("userType");
            util.claerSession("password");
            location.replace("/web/");
          }
        })
      },
      getCode() {
        if (this.account.phone == '') {
          this.$Message.error("请输入手机号");
          return;
        }
        this.changeButtonStatus();
        this.$post(this.$api.login.FORGETPASS_SEND_CODE, {
          phone: this.account.phone,
        }).then((res) => {
          if (res.code == 200) {
            console.log(res);
          }
        });
      },
      changeButtonStatus() {
        var that = this;
        this.timeInterval = setInterval(function () {
          that.seconds--;
          that.buttonText = '剩余' + that.seconds + '秒';
          that.disabled = true;
          if (that.seconds == 0) {
            that.buttonText = "获取验证码";
            that.seconds = 60;
            that.disabled = false;
            clearTimeout(that.timeInterval);
          }
        }, 1000);
      },
      showChangePwdModal(){
         this.account.phone = util.getSession("username");
         this.showModal = true
      },
      changePassword() {
        if (this.account.phone == '') {
          this.$Message.error("手机号不能为空");
          return;
        }
        if (this.account.old == '') {
          this.$Message.error("请输入旧密码");
          return;
        }
        if (this.account.old != util.getSession("password")) {
          this.$Message.error("旧密码不正确");
          return;
        }
        if (this.account.password == '') {
          this.$Message.error("密码不能为空");
          return;
        }
        if (this.account.passwordAgain == '') {
          this.$Message.error("密码不能为空");
          return;
        }
        if (this.account.password != this.account.passwordAgain) {
          this.$Message.error("两次输入密码不一致");
          return;
        }
        // if (this.account.code == '') {
        //   this.$Message.error("验证码不能为空");
        //   return;
        // }
        this.loading = true;
        this.$post(this.$api.login.resetInitPwd, {
          id: util.getSession("userId"),
          newPwd: this.account.password,
          tokenId: util.getSession("token").id,
          // phone: this.account.phone,
          // code: this.account.code,
        }, {}).then((res) => {
          if (res.code == 200) {

            this.loading = false;
            this.showModal = false;
            this.loginModal();

          } else {
            this.$Message.error(res.message);
            this.loading = false;
          }
        });
      },
      loginModal() {
        this.$Modal.confirm({
          title: '系统提示',
          content: '修改成功,请使用新密码重新登录！',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            util.claerSession("user");
            util.clearLocal("schoolId");
            util.claerSession("token");
            util.claerSession("username");
            util.claerSession("userId");
            util.claerSession("memberId");
            util.claerSession("userType");
            util.claerSession("password");
            location.replace("/web/");
          },
          onCancel() {
            util.claerSession("user");
            util.clearLocal("schoolId");
            util.claerSession("token");
            util.claerSession("username");
            util.claerSession("userId");
            util.claerSession("memberId");
            util.claerSession("userType");
            util.claerSession("password");
            location.replace("/web/");
          },
        })
      },

      ifForgetPwd(){
        this.$Modal.confirm({
          title: '忘记密码',
          content: '请前往登录页->忘记密码， 您确定要退出至登录页吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            this.$Message.success('退出登录成功!');

            util.claerSession("user");
            util.clearLocal("schoolId");
            util.claerSession("token");
            util.claerSession("username");
            util.claerSession("userId");
            util.claerSession("memberId");
            util.claerSession("userType");
            util.claerSession("password");
            location.replace("/web/");
          }
        })
      },


      changePwd(pwd) {
        let arr = md5(pwd).split("");
        let temp1 = arr[0];
        arr[0] = arr[arr.length - 1];
        arr[arr.length - 1] = temp1;
        let temp2 = arr[4];
        arr[4] = arr[arr.length - 5];
        arr[arr.length - 5] = temp2;
        let userpassword = "";
        for (var i = 0; i < arr.length; i++) {
          userpassword = userpassword + arr[i];
        }
        return userpassword;
      },
      type() {
        if (this.$route.name != 'EquipmentManageIndex' && this.$route.name != 'RepairManageIndex' && this.$route.name != 'safeCollege'
          && this.$route.name != 'safeCollegeShiYou' && this.$route.name != 'safeCollegeShiYouMap' && this.$route.name != 'PlantEquipmentIndex'
          && this.$route.name != 'PlantEquipmentMapIndex') {
          this.$fetch(this.$api.apartment.getAllConfigDetail, {//getCityByProvinceCode
            userId: this.$util.getSession("token").userId,
            tokenId: this.$util.getSession('token').tokenId,
          })
            .then((res) => {
              if (res.code != 200) {
                this.$Message.error(res.message);
                return;
              }
              this.$store.commit('dictionary', res.body)
            })
            .catch((err) => {
              this.$Message.error(err.message);
            })
        }
      },
      role() {
        if (this.$route.name != 'EquipmentManageIndex' && this.$route.name != 'RepairManageIndex' && this.$route.name != 'safeCollege'
          && this.$route.name != 'safeCollegeShiYou' && this.$route.name != 'safeCollegeShiYouMap' && this.$route.name != 'PlantEquipmentIndex'
          && this.$route.name != 'PlantEquipmentMapIndex') {
          this.$fetch(this.$api.login.getUserPermission, {//getCityByProvinceCode
            tokenId: this.$util.getSession("token").tokenId,
            userId: this.$util.getSession("user").id,
            collegeId: this.$util.getSession("user").collegeId,
          })
            .then((res) => {
              if (res.code != 200) {
                this.$Message.error(res.message);
                return;
              }
              this.$store.commit('role', res.body)
              this.$nextTick(() => {
                this.navTop()
              })
            })
            .catch((err) => {
              this.$Message.error(err.message);
            })
        }
      },
      navTop() {
        let nav = ucMenu.indexNav.nav;
        this.indexNav = nav;
        this.$util.setSession('topMenu',this.indexNav)
      },



      getTimeAndWeather(){
        this.time=this.$moment(new Date()).format('HH:mm')
        this.day=this.$moment(new Date()).format('YYYY年MM月DD日')
        let weekNum=this.$moment().day();
        switch(weekNum){
          case 1: this.week= "星期一";break;
          case 2: this.week= "星期二";break;
          case 3: this.week= "星期三";break;
          case 4: this.week= "星期四";break;
          case 5: this.week= "星期五";break;
          case 6: this.week= "星期六";break;
          case 0: this.week= "星期日";break;
        }
        // this.$fetch(this.$api.integration.WEATHER, {city:this.city}).then((res)=> {
        //   if (res.code == 200) {
        //     console.log(res);
        //     this.weather.info=res.body.future[0].weather;
        //     this.weather.temperature=res.body.future[0].temperature;
        //     if(res.body.future[0].weather=='晴'){
        //       this.weather.icon='./static/images/weather/晴天.png'
        //     }else if(res.body.future[0].weather=='阴'){
        //       this.weather.icon='./static/images/weather/阴天.png'
        //     }else if(res.body.future[0].weather.indexOf('多云')!=-1){
        //       this.weather.icon='./static/images/weather/多云.png'
        //     }else if(res.body.future[0].weather.indexOf('电')!=-1){
        //       this.weather.icon='./static/images/weather/闪电.png'
        //     }else if(res.body.future[0].weather.indexOf('雨')!=-1){
        //       this.weather.icon='./static/images/weather/雨.png'
        //     }else if(res.body.future[0].weather.indexOf('雪')!=-1){
        //       this.weather.icon='./static/images/weather/雪.png'
        //     }else{
        //       this.weather.icon='./static/images/weather/晴天.png'
        //     }
        //   }
        // })
      },

    },
    created() {

    },

    beforeDestroy() {
      clearInterval(this.timer)
    },
    mounted() {
      this.$nextTick(() => {
          console.log("=========================================")
          this.$Message.destroy();

          let host=this.$util.getSession('host');
          if(host){
            this.$ucconfig.API_HOST=host;
            this.$axios.defaults.baseURL=host;
          }

          // this.type();
          // this.role();
          this.$nextTick(() => {
            this.navTop()
          })
          if (this.$store.getters.navListItem != null) {
            this.menuItmes = this.$store.getters.navListItem
            this.$store.commit('navListItem', this.menuItmes)
          }
          this.loginUser = {
            nickname: util.getSession("user").name,
            // photo: util.getSession("user").imageContainer.small.url,
          }
          // let college = this.$util.getSession("user").college;
          // if (college != undefined) {
          //   this.iconImg = college.badge==undefined?'':college.badge;
          //   this.collegeName = college.xxmc;
          //   document.title = college.xxmc + '校园生态系统';
          // }

          //this.timer = setInterval(this.get, 1000*60);  /** 20200729 将timeout由5000改为60000 **/

          // this.checkAdmin();
          //
          // this.getCollegeServer();

          // this.menuTheme=this.$util.getLocal('college')=='2512'?'dark':'light'
          // document.getElementsByClassName('ivu-layout-header')[0].style.background=this.$util.getLocal('college')=='2512'?'#021D38':'rgba(93, 109, 195, 1)'
          // if(this.menuTheme=='dark'){
          //   document.getElementsByClassName('ivu-menu-dark')[0].style.background='#021D38'
          // }else if(this.menuTheme=='light'){
          //   document.getElementsByClassName('ivu-menu-light')[0].style.background='#031E36'
          // }


          //this.menuTheme='dark'
          // document.getElementsByClassName('ivu-layout-header')[0].style.background='linear-gradient(to right, rgb(16,106,202) , rgb(36,149,251)) '
          document.getElementsByClassName('ivu-layout-header')[0].style.background='#3862CF '
          document.getElementsByClassName('ivu-layout-header')[0].style.height='65px'
          // document.getElementsByClassName('ivu-menu-horizontal')[0].style.background='linear-gradient(to right, rgb(16,106,202) , rgb(36,149,251)) '
          document.getElementsByClassName('ivu-menu-horizontal')[0].style.background='#3862CF '
          //document.getElementsByClassName('ivu-menu-dark')[0].style.background='rgb(16,106,202)'

          let that=this;
          if(this.$util.getSession("username") != 'admin'&& (!this.$util.checkPasswordRole1(this.$util.getSession('password')) || !this.$util.checkPasswordRole2(this.$util.getSession('password')))){
            this.$Modal.confirm({
              title:"提示",
              content:'您的账号密码过于简单，为了账户安全，请前往修改密码!',
              cancelText:'退出系统',
              okText:'修改密码',
              onOk:function () {
                that.account.phone = util.getSession("username");
                that.showModal=true;
              },
              onCancel:function () {
                that.$Message.success('退出登录成功!');

                util.claerSession("user");
                util.clearLocal("schoolId");
                util.clearLocal("school");
                util.claerSession("token");
                util.claerSession("username");
                util.claerSession("userId");
                util.claerSession("memberId");
                util.claerSession("userType");
                util.claerSession("password");
                location.replace("/web/");
              }
            })
          }


          this.getTimeAndWeather();
          if(this.dataInterval!=null){
            clearInterval(this.dataInterval);
          }

          that.dataInterval=setInterval(function(){
            that.getTimeAndWeather();
          },1000*30);

          document.title = this.$util.getLocal('school').name

      })

    }
  }


</script>
<style scoped lang="less">
  @deep: ~'>>>';
  .ivu-layout {
    height: 100%;
    > .ivu-layout-content {
      height: 100%;
      padding: 0 !important;
      > .mainCss {
        height: 100%;
        overflow-y: auto;
        border: 0;
        @{deep}.ivu-card-body:nth-of-type(1){
          height: 100%;
          overflow-y: auto;
          padding: 0;
          >div:nth-of-type(1){
            padding: 10px;
          }
        }
      }
    }
  }

  .ivu-layout-sider {
    min-width: 210px !important;
    width: 210px !important;
    max-width: 220px !important;
    height: 100%;
    overflow: auto;
  }

  .sl {
    display: flex;
    flex-direction: row;
    height: e('calc(100% - 64px)') !important;

    > .ivu-layout-content {
      width: e('calc(100% - 210px)');
      background: rgb(245,245,245)!important;
    }
  }

  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }

  //@{deep}.ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-submenu-active, .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-submenu:hover, .ivu-menu-primary.ivu-menu-horizontal .ivu-menu-item, .ivu-menu-primary.ivu-menu-horizontal .ivu-menu-submenu{
  //  background:rgb(13,128,242)!important;
  //}
</style>
<style lang="less">
  @deep:~'>>>';
  .partentBox {
    height: 600px;

    .bgColor {
      height: 100%;

      > div:nth-of-type(3) {
        height: e('calc(100% - 51px)') !important;

        > div {
          height: 100%;

          > div {
            height: 100%;

            > div {
              height: 100%;

              > div {
                canvas {
                  height: 600px;
                }
              }

              > div:nth-of-type(2) {
                display: none;
              }
            }
          }
        }
      }
    }
  }
</style>

