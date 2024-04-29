<template>
  <div>
    <div class="main-form">
      <!--        <span>用户登录</span>-->
      <span class="word1">欢迎登录丹田智能系统</span>
      <Form ref="formInline" :model="formInline" :label-width="0" :rules="ruleInline" style="margin-top: 10%;">
        <FormItem prop="user" align="middle" >
          <Input
            style="color: #77A3FF;border: 2px solid #77A3FF;border-radius: 5px;display: flex;align-items: center;"
            type="text"
            v-model="formInline.phone"
            placeholder="请输入手机号"
            size="large"
            clearable
            @keyup.enter.native="handleSubmit('formInline')"
            ref="inputAutoPhone">
          </Input>
        </FormItem>
        <FormItem style="margin-top: 10%;" prop="password" align="middle" >
          <Input
            style="color: #77A3FF;border: 2px solid #77A3FF;border-radius: 5px;display: flex;align-items: center; "
            type="password"
            v-model="formInline.password"
            placeholder="请输入密码"
            size="large"
            clearable
            @keyup.enter.native="handleSubmit('formInline')"
            ref="inputAutoPassword">
          </Input>
        </FormItem>

        <!--<FormItem>-->
        <!--<div>-->
        <!--<Checkbox class="assist" style="float: left;margin-left: 19px">记住密码</Checkbox>-->
        <!--<a href="" class="assist" style="float: right;margin-right: 20px">忘记密码</a>-->
        <!--</div>-->
        <!--</FormItem>-->

        <FormItem style="margin-top: 10%;" align="middle" :label-width="0">
          <Button type="primary" @click="handleSubmit('formInline')" size="default" :loading="formInline.loading">登 录</Button>
        </FormItem>
        <span class="word2" @click="forget">忘记密码 >></span>
      </Form>
    </div>
  </div>
</template>

<script>

  export default {
    name: "loginTemplate",
    components: {},
    props: ['userName'],
    data() {
      return {
        formInline: {
          phone: '',
          password: '',
          loading: false,
        },
        ruleInline: {
          phone: [
            {required: true, message: '请输入手机号', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            // {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'change'}
          ]
        },

      }
    },
    computed: {},
    watch: {},
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$emit('handleSubmit', this.formInline)
          } else {
            this.$Message.error('填写正确账号密码');
          }
        })
      },
      cas_login() {
        window.location.href = this.$ucconfig.SSO_LOGIN_URL;
      },

      setUserPassword(item){
        this.formInline=item;
      },

      forget(){
        if(this.$Filters.isEmpty(this.formInline.phone)){
          this.$Message.error('手机号不能为空');
          return
        }
        this.$emit('forgetPwd',this.formInline.phone)
      },
    },
    created() {

    },
    mounted() {
      this.$nextTick(() => {
        // formInline: {
        //   phone: '',
        //     password: ''
        // }
        if (this.formInline.phone == '') {
          this.$refs.inputAutoPhone.focus();
        } else {
          this.$refs.inputAutoPassword.focus();
        }

      })
    },
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
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
  .word2 {
    overflow-wrap: break-word;
    color: rgba(58, 95, 207, 1);
    font-size: 22px;
    text-align: right;
    white-space: nowrap;
    line-height: 40px;
    display: block;
  }
  @{deep}.ivu-input{
    height: 72px!important;
    color:#77A3FF;
    border: none;
    font-size: 24px;
    padding: 20px!important;

  }

  @{deep}.ivu-btn{
    width: 380px!important;
    height: 72px!important;
    background: #3862CF!important;
    border-radius: 8px!important;
    border: 1px solid #3877FF!important;
    font-size: 24px;
  }

  input::-webkit-input-placeholder{
    color:  #77A3FF;
  };
  input:-moz-placeholder{
    color:  #77A3FF;
  };
  input::-moz-placeholder{
    color:  #77A3FF;
  };
  input:-ms-input-placeholder {
    color: #77A3FF;
  };
</style>
