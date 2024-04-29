<template>
  <div class="v-clock" style="height: calc(100% - 160px);">
    <!--日历报表-->

    <Calendar
      style="height: 100%;"
      ref="Calendar"
      v-on:choseDay="clickDay"
      v-on:changeMonth="changeDate"
      :markDateMore = "arrDate">
    </Calendar>
    <!--      v-on:isToday="clickToday"-->
    <!--      :markDate=arr // arr=['2018/4/1','2018/4/3'] 标记4月1日和4月3日 简单标记-->
    <!--      :markDateMore=arr // 多种不同的标记-->
    <!--      第一个标记和第二个标记不能同时使用-->
    <!--      :agoDayHide='1514937600' //某个日期以前的不允许点击  时间戳10位-->
    <!--      :futureDayHide='1525104000' //某个日期以后的不允许点击  时间戳10位-->
    <!--      :sundayStart="true" //默认是周一开始 当是true的时候 是周日开始-->
    <!--      this.$refs.Calendar.PreMonth();  //调用方法实现转到上个月-->
    <!--      this.$refs.Calendar.NextMonth(); //调用方法实现转到下个月-->
    <!--      this.$refs.Calendar.ChoseMonth('2018-12-12'); //调用方法实现转到某个月-->
    <!--      this.$refs.Calendar.ChoseMonth('2018-12-12',false); //跳转到18年12月12日 但是不选中当天-->
    <!--      第二个参数 false表示不选中日期 。-->
  </div>
</template>

<script>
  import Calendar from 'vue-calendar-component';
  export default {
    name: "DinnerCalendar",
    components: {
      Calendar,
    },
    props: ['arrDate','arrStatus'],
    data() {
      return {
        // arr: [ "2019/11/2", "2019/11/3", "2019/11/4"],
        arr: [
          {
            date: "2022-08-15",
            className: "normal_eat"
          },
          {
            date: "2022-08-05",
            className: "not_eat"
          },
          {
            date: "2022-08-16",
            className: "normal_eat"
          },
        ]
      }
    },
    computed: {},
    watch: {
      // arrDate(){
      //   this.$nextTick(()=>{
      //     for (let i = 0; i < this.arrStatus.length; i++) {
      //       let div = document.createElement("div")
      //       div.innerHTML = this.arrStatus[i].status;
      //       document.getElementsByClassName('color1')[i].append(div);
      //     }
      //   })
      // },
    },
    methods: {
      clickDay(data) {
        this.$emit('clickDay',data)
        console.log(data); //选中某天
      },
      changeDate(data) {
        // let date = new Date(data).format('MM')
        this.$emit('changDate',data)
      },
      clickToday(data) {
        console.log(data); //跳到了本月
      },
      chooseDay(item){

      },
      showNowMonth(){
        this.$refs.Calendar.ChoseMonth(this.$moment(new Date()).format('YYYY-MM-DD'),false);
      },


    },
    created() {

    },
    mounted() {

    },
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-card-body {
    padding: 10px !important;
  }
  @{deep}.wh_container {
    max-width: 100%!important;
    /*height: 500px;*/
    .wh_content_all{
      height: 100%;
      >div:nth-of-type(1) {
        height: 60px;
      }
      >div:nth-of-type(2) {
        background-color: #F2F2F2;
        height: 60px;
      }
      >div:nth-of-type(3) {
        height: calc(100% - 100px);
        background: #fff;
        /*padding-top: 5%;*/
        align-items: center;
      }
    }
  }

  @{deep}.wh_item_date{
    font-size: 1rem!important;
    font-weight: bold!important;
    width: 60px!important;
    height: 60px!important;
  }
  @{deep}.wh_item_date:hover{
    background: #dedede;
    width: 100%;
  }
  @{deep}.wh_top_tag{
    height: 60px!important;
  }
  @{deep}.wh_chose_day{
    background: #F0FAFF!important;
    width: 100%!important;
    border-radius: 0%!important;
  }
  @{deep}.normal_eat {
    background-color: #CCF688!important;
    width: 100%!important;
    border-radius: 0%!important;
    position: relative;
    >div{
      width: 20px;
      height: 20px;
      background: red;
      position: absolute;
      right: 0;
      top: 0;
      line-height: 20px;
    }
  }


  @{deep}.not_eat {
    background-color: #D51024!important;
    border-radius: 50%!important;
    color: #ffffff;
    width: 50px!important;
    height: 50px!important;
    >div{
      width: 20px;
      height: 20px;
      background: red;
      position: absolute;
      right: 0;
      top: 0;
      line-height: 20px;
    }
  }


  @{deep}.color3 {
    background-color: #ffa40e;
    border-radius: 50%;
    >div{
      width: 20px;
      height: 20px;
      background: red;
      position: absolute;
      right: 0;
      top: 0;
      line-height: 20px;
    }
  }


  @{deep}.color4 {
    background-color: #ff008d;
    border-radius: 50%;
    >div{
      width: 20px;
      height: 20px;
      background: red;
      position: absolute;
      right: 0;
      top: 0;
      line-height: 20px;
    }
  }

  @{deep}.wh_content_item .wh_isToday{
    background: #fff;
    width: 100%;
    border-radius: 0%;
  }
  @{deep}.wh_content_all {
    background-color: #fff!important;
    border-radius: 5px;
  }
  @{deep}.wh_content_item {
    color: #655c5c!important;
    border: 1px solid #dedede;
    width: 14%!important;
    font-size: 1rem!important;
    height:60px!important;
    align-items: center;
    display: flex;
  }
  @{deep}.wh_content {
    width: 102%!important;
    margin: 0 auto!important;
    border-radius: 3px;
    padding: 0 0;
  }
  @{deep} .wh_top_changge {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  @{deep} .wh_content_li {
    font-size: 22px;
    font-weight: bold;
    color:#666666!important;
  }
  @{deep} .wh_jiantou1 {
    border-top: 2px solid #666666!important;
    border-left: 2px solid #666666!important;
  }
  @{deep} .wh_jiantou2 {
    border-top: 2px solid #666666!important;
    border-right: 2px solid #666666!important;
  }
  @{deep} .wh_top_tag{
    font-size: 18px;
    font-weight: bold;
  }
</style>
