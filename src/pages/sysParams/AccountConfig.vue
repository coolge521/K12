<template>
  <div style="padding: 5px;">
      <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 100%;height: 40px;">
        <span style="font-size: 14px;color: #666666;width: 180px;">用户姓名：</span>
        <span style="font-size: 14px;color: #333333;width: 150px;">{{name}}</span>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 100%;height: 40px;">
        <span style="font-size: 14px;color: #666666;width: 180px;">账号（手机号）：</span>
        <span style="font-size: 14px;color: #333333;width: 150px;">{{username}}</span>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 100%;height: 40px;">
        <span style="font-size: 14px;color: #666666;width: 180px;">账号状态：</span>
        <div style="display: flex;flex-direction: row;justify-content: flex-end;align-items: center;">
          <span style="font-size: 14px;color: #333333;width: 100px;" :style="{'color':bindStatusColor[bindStatus]}">{{bindStatusNames[bindStatus]}}</span>
          <Button v-if="bindStatus == 0" type="primary" style="width:90px;margin: 0px 60px 0px 0px"  @click="bind">激活账号</Button>
          <Button v-else-if="bindStatus == 1" type="primary" style="width:90px;margin: 0px 60px 0px 0px"  @click="forbid">禁用账号</Button>
          <Button v-else-if="bindStatus == 2" type="primary" style="width:90px;margin: 0px 60px 0px 0px"  @click="allow">解除禁用</Button>
          <Button v-else-if="bindStatus == 3" type="primary" style="width:90px;margin: 0px 60px 0px 0px"  @click="unlock">解除锁定</Button>
        </div>
      </div>
      <div v-if="bindStatus != 0" style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 100%;height: 40px;">
        <span style="font-size: 14px;color: #666666;width: 180px;">用户密码：</span>
        <div style="display: flex;flex-direction: row;justify-content: flex-end;align-items: center;">
          <span style="font-size: 14px;color: #333333;width: 100px;text-align: center;" >******</span>
          <Button type="primary" style="width:90px;margin: 0px 60px 0px 0px"  @click="resetPwd">重置密码</Button>
        </div>
      </div>
      <div v-if="bindStatus != 0" style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 100%;height: 40px;">
        <span style="font-size: 14px;color: #666666;width: 180px;"></span>
        <div style="display: flex;flex-direction: row;justify-content: flex-end;align-items: center;width: 100%;">
          <span style="font-size: 14px;color: #0000ff;width: 200px;text-align: center;" >（初始密码 111111）</span>
        </div>
      </div>
  </div>
</template>

<script>
  import util from "@/libs/util.js";
  export default {
    name: "AccountConfig",
    components: {
    },
    props:[''],
    data() {
      let that=this
      return {
        name:'',
        username:'',
        passwordOld:'',
        bindStatus:0,//账号状态 0-未激活 1-已激活 2-已禁用 3-已锁定
        bindStatusNames:['账号未激活','账号已激活','账号已禁用','账号已锁定'],
        bindStatusColor:['#666666','#0000ff','#D51024','#ff0000'],

        memberId:'',
        type:0,//1教工  2学生
        objId:'',//账号的userId
      }
    },
    computed: {},
    watch: {},
    methods: {
      getUserById(id){
        let that = this
        this.$load.show();
        this.$fetch(this.$api.platform.getUserById, {
          tokenId: this.$util.getSession("token").id,
          id:id,
        })
          .then((res) => {
            this.$load.hide();
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            let body = res.body;
            this.name = body.name
            this.username = body.username
            this.objId = body.id
          })
          .catch((err) => {
            this.$Message.error(err.message);
            this.$load.hide();
          })
      },

      bind(){
        let that = this
        this.$Modal.confirm({
          title: '提示',
          content: '确定激活该账号吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            that.doBind();

          }
        })
      },

      doBind(){
        let that = this
        this.$load.show();
        this.$post(this.$api.platform.PLATFORM_ACCOUNT_BIND, {
          tokenId: this.$util.getSession("token").id,
          memberId:this.memberId,
          type:this.type,
          userId:this.$util.getSession("user").id,
        }).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('操作成功!');
            that.$emit('closeAccount')
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

      forbid(){
        let that = this
        this.$Modal.confirm({
          title: '提示',
          content: '确定禁用该账号吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            that.doForbid();

          }
        })
      },

      doForbid(){
        let that = this
        this.$load.show();
        this.$post(this.$api.platform.PLATFORM_ACCOUNT_FORBID, {
          tokenId: this.$util.getSession("token").id,
          id:this.objId,
          userId:this.$util.getSession("user").id,
        },{}).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('操作成功!');
            that.$emit('closeAccount')
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

      allow(){
        let that = this
        this.$Modal.confirm({
          title: '提示',
          content: '确定解禁该账号吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            that.doAllow();

          }
        })
      },

      doAllow(){
        let that = this
        this.$load.show();
        this.$post(this.$api.platform.PLATFORM_ACCOUNT_ALLOW, {
          tokenId: this.$util.getSession("token").id,
          id:this.objId,
          userId:this.$util.getSession("user").id,
        },{}).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('操作成功!');
            that.$emit('closeAccount')
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

      unlock(){
        let that = this
        this.$Modal.confirm({
          title: '提示',
          content: '确定解锁该账号吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            that.doUnlock();

          }
        })
      },

      doUnlock(){
        let that = this
        this.$load.show();
        this.$post(this.$api.platform.PLATFORM_ACCOUNT_UNLOCK, {
          tokenId: this.$util.getSession("token").id,
          id:this.objId,
          userId:this.$util.getSession("user").id,
        },{}).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('操作成功!');
            that.$emit('closeAccount')
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

      resetPwd(){
        let that = this
        this.$Modal.confirm({
          title: '提示',
          content: '确定重置该账号的密码吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            that.doResetPwd();

          }
        })
      },

      doResetPwd(){
        let that = this
        this.$load.show();
        this.$post(this.$api.platform.PLATFORM_ACCOUNT_RESET_PWD, {
          tokenId: this.$util.getSession("token").id,
          id:this.objId,
          newPwd:'111111',
          // userId:this.$util.getSession("user").id,
        }).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('操作成功!');
            that.$emit('closeAccount')
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

    },
    created() {

    },
    mounted() {

    },
  }
</script>

<style scoped>

</style>
