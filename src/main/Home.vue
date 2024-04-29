<template>
  <div>
    <div style="height: 100%;height: 100%;">
      <div dis-hover style="height: 100%;
      text-align: center;
      line-height: 20vw;
      font-size: 2rem;">

        <div class="box">
          <div class="bgImage" v-bind:style="[{backgroundImage:'url('+ (welcomeImg) +')'}]">
            <div style="display: flex;flex-direction: column;justify-content: flex-start;width: 100%;height: 100%;margin-top: 82px;margin-left: 65px;">
              <span style="width: 630px;height: 75px;font-size: 55px;font-weight: 600;color: #3A5FCF;line-height: 77px;text-align:left;">{{userName}},您好！</span>
              <span v-if="this.$util.getLocal('school')!= undefined" style="width: 520px;height: 56px;font-size: 36px;font-weight: 600;color: #3A5FCF;line-height: 50px;text-align:left;margin-top: 22px;">欢迎使用{{this.$util.getLocal("school").name}}数字管理系统</span>
              <span style="width: 480px;height: 20px;font-size: 18px;font-weight: bold;color: #3A5FCF;line-height: 36px;text-align:left;margin-top: 3px;"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

<!--    <div class="div-copyright">-->
<!--      {{'2016-'+$moment().format("YYYY")}}-->
<!--      <span class="copyright" v-html="$ucconfig.COPYRIGHT" v-if="$ucconfig.COPYRIGHT"></span>-->
<!--      <span v-else class="copyright">-->
<!--                {{' © 技术支持:西安优圈信息技术研究院 '}}<a href="https://beian.miit.gov.cn" target="_blank">{{}}</a>-->
<!--      </span>-->
<!--    </div>-->

  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        collegeName: '',
        collegeIcon: '',
        welcomeImg: require('../../static/images/' + this.$ucconfig.WELCOME_IMAGE),
        userName : this.$util.getSession("user").name,
      }
    },
    methods: {


    },
    mounted() {
      // let college = this.$util.getSession("user").college;
      // if (college != undefined && college.xxmc != undefined) {
      //   this.collegeName = college.xxmc;
      //   this.collegeIcon = college.badge;
      // }

    }
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-card-body {
    padding: 0px !important;
  }

  .box {
    width: 100%;
    height: 100%;

    .bgImage {
      width: 100%;
      height: 100%;
      background: url(../../static/images/welcome.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      /*z-index: 1;*/
    }

    /*.bgText {*/
    /*  position: absolute;*/
    /*  left: 5%;*/
    /*  top: 2%;*/
    /*  z-index: 2;*/
    /*  color: #b1b1b1;*/
    /*  font-size: 30px;*/
    /*  line-height: 30px;*/
    /*  text-align: left;*/

    /*  > div:nth-of-type(1) {*/
    /*    font-size: 3.6rem;*/
    /*    line-height: 3.6rem;*/
    /*  }*/

    /*  > div:nth-of-type(2) {*/
    /*    font-size: 1.6rem;*/
    /*    line-height: 1.6rem;*/
    /*  }*/
    /*}*/
  }

  .text {
    font-weight: bold;
    //text-shadow: black 0.1em 0.1em 0.2em;
    margin-top: 10%;
    background: linear-gradient(to right, gold, indianred);
    -webkit-background-clip: text;
    color: transparent;
  }

  .div-copyright {
    width: 100%;
    height: 32px;
    position: fixed;
    bottom: 0px;
    color: #fff;
    font-size: 14px;
    text-align: center;
  }


  @deep: ~'>>>';
  @{deep}.copyright a {
    color: #fff;
  }

  @{deep}.copyright a:hover {
    color: #ee9900;
  }

</style>
