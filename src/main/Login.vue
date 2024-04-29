<template>
  <div class="mian">
    <div style="background-image: url('./static/images/login_input_bg.png'); background-size: 100% 100%;width: 1010px;height: 640px; ">
      <div style="width: 60%;height: 100%;display: flex;justify-content: center;align-items: center;padding:20px;">
        <login
          ref="login"
          @handleSubmit="handleSubmit"
          @forgetPwd="forgetPwd"
          :userName="userName">
        </login>
      </div>
    </div>

<!--    <div class="div-copyright">-->
<!--      {{'2016-'+$moment().format("YYYY")}}-->
<!--      <span class="copyright" v-if="$ucconfig.COPYRIGHT" v-html="$ucconfig.COPYRIGHT" > </span>-->
<!--      <span v-else class="copyright">-->
<!--        {{' © 技术支持:西安优圈信息技术研究院 '}}<a href="https://beian.miit.gov.cn" target="_blank">aaa</a>-->
<!--      </span>-->
<!--    </div>-->


    <Modal v-model="showModal" title="修改密码" width="450" :mask-closable="false" :closable="false"
        :footer-hide="true">
        <div style="background: #ffffff;padding: 30px;display: flex;flex-direction: column;align-items: center;justify-content: center;">
          <span class="word1">修改密码</span>

          <Input
            style="color: #77A3FF;border: 2px solid #77A3FF;border-radius: 5px;margin-top: 20px;display: flex;align-items: center; "
            type="password"
            v-model="password"
            placeholder="请输入密码"
            size="large"
            clearable
            ref="inputAutoPassword">
          </Input>

          <Input
            style="color: #77A3FF;border: 2px solid #77A3FF;border-radius: 5px;margin-top: 20px; display: flex;align-items: center;"
            type="password"
            v-model="passwordConfirm"
            placeholder="请再次输入密码"
            size="large"
            clearable
            ref="inputAutoPassword">
          </Input>

          <Button type="primary" @click="changeInitPwd" size="default" style="margin-top: 20px;">完 成</Button>
        </div>
    </Modal>

    <Modal v-model="showForgetModal" title="" width="650" height="600"
        :footer-hide="true">
        <div style="background: #ffffff;padding: 30px;display: flex;flex-direction: column;align-items: center;justify-content: center;">
          <span class="word1">忘记密码</span>

          <Input
            style="color: #77A3FF;border: 2px solid #77A3FF;border-radius: 5px;margin-top: 20px;display: flex;align-items: center; "
            type="password"
            v-model="pwd"
            placeholder="请输入新密码"
            size="large"
            clearable
            ref="inputAutoPassword">
          </Input>

          <Input
            style="color: #77A3FF;border: 2px solid #77A3FF;border-radius: 5px;margin-top: 20px; display: flex;align-items: center;"
            type="password"
            v-model="pwdConfirm"
            placeholder="请再次输入新密码"
            size="large"
            clearable
            ref="inputAutoPassword">
          </Input>

          <Input
            style="color: #77A3FF;border: 2px solid #77A3FF;border-radius: 5px;margin-top: 20px; display: flex;align-items: center;"
            v-model="pwdPhone"
            :disabled="true"
            placeholder=""
            size="large"
            clearable
            ref="inputAutoPassword">
          </Input>

          <div style="display: flex;justify-content: space-between;align-items: center;">

            <Input
              style="color: #77A3FF;border: 2px solid #77A3FF;border-radius: 5px;margin-top: 20px; display: flex;align-items: center;"
              type="number"
              v-model="veriCode"
              placeholder="请输入手机收到的验证码"
              size="large"
              clearable
              ref="inputAutoPassword">
            </Input>
            <Button type="primary"  @click="getCode" size="default" :disabled="disabled" style="width: 20px;margin-left: 15px;margin-top: 20px;">{{buttonText}}</Button>
          </div>

          <Button type="primary" @click="forgetChangePwd" :loading="loading" size="default" style="margin-top: 20px;">完 成</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  import util from "@/libs/util.js";
  import md5 from "js-md5";
  import login from "./loginTemplate";

  export default {
    components: {
      login,
    },
    data() {
      return {
        userName: '手机号',

        showModal:false,
        password:'',
        passwordConfirm:'',

        showForgetModal:false,
        pwd:'',
        pwdConfirm:'',
        pwdPhone:'',
        veriCode:'',

        buttonText: '获取验证码',
        seconds: 60,
        timeInterval: null,
        disabled: false,
        timer:null,
        loading: false,
      }
    },
    methods: {
      handleSubmit(item) {
        let that=this;
        // that.$router.push({
        //   name: 'home'
        // })
        item.loading = true;
        let pwd = item.password;
        this.$post(this.$api.login.login, {
          username: item.phone,
          password: pwd,
        }).then((res) => {
          if (res.code == 200) {
            util.setSession("user", res.body.user);
            util.setLocal("schoolId", "1");
            util.setSession("token", res.body.token);
            util.setSession("username", item.phone);
            util.setSession("userId", res.body.user.id);
            util.setSession("memberId", res.body.user.memberId);
            util.setSession("userType", res.body.user.type);
            util.setSession("password", item.password);


            if(res.body.user.initPassword){
              this.$Modal.info({
                title: '温馨提示',
                content: '您使用的是初始密码，为了您的账号安全，请修改密码!',
                width: '400px',
                okText: '确定',
                showCancel:false,
                onOk() {
                  that.showModal = true;

                }
              })
              item.loading = false;
              return
            }
            this.$Message.success('登录成功!');
            that.$router.push({
              name: 'home'
            })

          } else {
            this.$Message.error(res.message);
          }
          item.loading = false;
        });
      },

      changeInitPwd(){
        let that = this
        if (this.password == '') {
          this.$Message.error("密码不能为空");
          return;
        }
        if (!this.$util.checkPasswordRole1(this.password)) {
          this.$Message.error("密码由8-16位数字、字母或符号组成");
          return;
        }
        if (!this.$util.checkPasswordRole2(this.password)) {
          this.$Message.error("至少包含数字、字母、符号2种以上字符");
          return;
        }
        if (this.passwordConfirm == '') {
          this.$Message.error("密码不能为空");
          return;
        }
        if (this.password != this.passwordConfirm) {
          this.$Message.error("两次输入密码不一致");
          return;
        }
        this.$post(this.$api.login.resetInitPwd, {
          id: util.getSession("userId"),
          newPwd: this.password,
          tokenId: util.getSession("token").id,
        }).then((res) => {
          if (res.code == 200) {

            //this.$Message.success('密码修改成功!');
            that.$refs.login.formInline.password = ''
            that.showModal = false
            that.loginModal();

          } else {
            this.$Message.error(res.message);
          }
        });
      },

      loginModal() {
        this.$Modal.info({
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

      forgetPwd(phone){
          this.pwdPhone = phone
          this.pwd = ''
          this.pwdConfirm = ''
          this.veriCode = ''
          this.showForgetModal = true
      },

      getCode() {
        if (this.pwdPhone == '') {
          this.$Message.error("请输入手机号");
          return;
        }
        this.changeButtonStatus();
        this.$post(this.$api.login.FORGETPASS_SEND_CODE, {
          phone: this.pwdPhone,
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

      forgetChangePwd(){
        if (this.pwd == '') {
          this.$Message.error("密码不能为空");
          return;
        }
        if (!this.$util.checkPasswordRole1(this.pwd)) {
          this.$Message.error("密码由8-16位数字、字母或符号组成");
          return;
        }
        if (!this.$util.checkPasswordRole2(this.pwd)) {
          this.$Message.error("至少包含数字、字母、符号2种以上字符");
          return;
        }
        if (this.pwdConfirm == '') {
          this.$Message.error("密码不能为空");
          return;
        }
        if (this.pwd != this.pwdConfirm) {
          this.$Message.error("两次输入密码不一致");
          return;
        }
        if (this.veriCode == '') {
          this.$Message.error("验证码不能为空");
          return;
        }
        this.loading = true;
        this.$post(this.$api.login.FORGETPASS_UPDATE_USER_PWD, {
          phone: this.pwdPhone,
          newPwd: this.pwd,
          code: this.veriCode,
        }, {}).then((res) => {
          if (res.code == 200) {

            this.loading = false;
            this.showForgetModal = false;
            this.loginModal();

          } else {
            this.$Message.error(res.message);
            this.loading = false;
          }
        });
      },


      getSchoolById(id){
        let that = this
        this.$fetch(this.$api.platform.getSchool, {
          id:id,
        })
          .then((res) => {
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            if(!that.$Filters.isEmpty(res.body)){
              that.$util.setLocal("school", res.body);
              if(!that.$Filters.isEmpty(res.body.schoolTypes)){
                that.$util.setLocal("grades", res.body.schoolTypes[0].grades);
              }
            }
          })
          .catch((err) => {
            this.$Message.error(err.message);
          })
      },
    },
    mounted() {
      let storage = window.localStorage;
      storage.clear()

      this.getSchoolById('1')
      let query=this.$route.query;

      if(query.phone!=undefined && query.password!=undefined){
        this.$refs.login.setUserPassword({phone:query.phone,password:query.password});
        this.handleSubmit({phone:query.phone,password:query.password})
      }
    },
    // created() {
    //   var user = util.getSession("user");
    //   var college = util.getLocal("college");
    //   var token = util.getSession("token");
    //   if (user && college && token) {
    //     this.$router.push({name: 'home'});
    //   }
    // }
  }
</script>
<style scoped lang="less">
  .mian {
    height: 100%;
    background: url(../../static/images/login_bg.png) no-repeat;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

    .sendInfo {
      display: flex;
    }

    .main-form {
      padding: 0 3%;
    }
  }

  .main-top {
    height: 180px;
  }

  .main-form span {
    font-family: "Microsoft YaHei";
    font-size: 24px;
    color: #FF5C26;
  }

  .assist {
    font-size: 8px;
  }

  .div-copyright {
    position: fixed;
    bottom: 0;
    color: #fff;
    font-size: 14px;
  }
  .word1 {
    overflow-wrap: break-word;
    color: rgba(58, 95, 207, 1);
    font-size: 36px;
    font-family: HiraginoSansGB-W6;
    text-align: left;
    white-space: nowrap;
    line-height: 56px;
    display: block;
  }

  @deep: ~'>>>';
  @{deep}.copyright a {
    color: #fff;
  }

  @{deep}.copyright a:hover {
    color: #ee9900;
  }
  @{deep}.ivu-modal-header{
    display: none;
  }

  @{deep}.ivu-input{
    height: 72px!important;
    color:#77A3FF;
    border: none;
    font-size: 24px;
    padding: 20px!important;

  }

  @{deep}.ivu-btn{
    width: 358px!important;
    height: 72px!important;
    background: #3862CF!important;
    border-radius: 8px!important;
    border: 1px solid #3877FF!important;
    font-size: 24px;
  }
  @{deep}.ivu-modal .ivu-modal-body {
    max-height: 82vh!important;
  }
</style>
