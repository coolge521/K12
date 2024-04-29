<template>
    <div style="padding: 20px;background: #f5f5f5;">
      <Row style="display: flex;justify-content: flex-end;align-items: center;padding: 20px;background: #ffffff">
        <RadioGroup v-model="searchType">
          <Radio :label="1" :true-value="1" :false-value="2"><span style="color: #262626;margin-right: 10px">按年级统计</span></Radio>
          <Radio :label="2" :true-value="3" :false-value="1" style="margin-right: 10px"><span style="color: #262626">按班级统计</span></Radio>
        </RadioGroup>
        <Select v-model="grade" placeholder="请选择年级"  :disabled="searchType==1" style="margin-left: 5px;margin-right: 10px;width: 120px;">
          <Option v-for="(item,index) in gradeList"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
          </Option>
        </Select>
        <Select v-model="payItemId" style="width:150px;;margin-right: 10px" placeholder="请选择缴费项目" clearable>
          <Option v-for="item in payItems" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Button :type="button_year" @click="status=0" style="width: 120px;height: 30px;margin-right: 10px">本年</Button>
        <Button :type="button_month" @click="status=1" style="width: 120px;height: 30px;margin-right: 10px">本月</Button>
        <Button :type="button_week" @click="status=2" style="width: 120px;height: 30px;margin-right: 10px">本周</Button>
        <Button :type="button_today" @click="status=3" style="width: 120px;height: 30px;">今日</Button>
      </Row>
      <Row :gutter="24" class="partent">
        <Col span="12">
          <Card class="bgColor" style="overflow: hidden;">
            <p slot="title" >缴费人数情况(人)</p>
            <a  slot="extra" >

            </a>
            <Row :gutter="16">
              <Col span="24">
                <div id="chart1" style="width:100%;"></div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span="12">
          <Card class="bgColor">
            <p slot="title" >缴费金额情况(元)</p>
            <a  slot="extra" >

            </a>
            <Row :gutter="16">
              <Col span="24">
                <div id="chart2" style="width:100%;"></div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row :gutter="24" class="partent">
        <Col span="12">
          <Card class="bgColor" style="overflow: hidden;">
            <p slot="title" >缴费收入情况(元)</p>
            <a  slot="extra" >

            </a>
            <Row :gutter="16">
              <Col span="24">
                <div id="chart3" style="width:100%;"></div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span="12">
          <Card class="bgColor">
            <p slot="title" >缴费流水</p>
            <a  slot="extra" >
            </a>
            <Row :gutter="16">
              <Col span="24">
                <div style="width:100%!important;height: 100%!important;">
                  <Table border  :columns="columns" :data="list" ></Table>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require("echarts/lib/component/legend")
  require("echarts/lib/component/grid")

  import ucApi from "@/libs/ucApi.js";
  import util from "@/libs/util.js";
    export default {
        name: "statistics",
        data(){
          return{
            searchType:1,//1 按年级   2按班级
            payItems:[],
            payItemId:'',
            payItem:'',
            gradeList:[],
            grade:'',

            status:0,//0本年   1 本月   2  本周  3  今日
            button_year:"primary",
            button_month:"default",
            button_week:"default",
            button_today:"default",

            startDate:this.$Filters.getCurrentYearStartAndEndDate(this,false)[0],
            endDate:this.$Filters.getCurrentYearStartAndEndDate(this,false)[1],


            chart1:null,
            chart2:null,
            chart3:null,
            list:[],
            columns: [
              {
                title: '序号',
                key: 'id',
                type: 'index',
                width: 60,
                align: 'center'
              },
              {
                title: '缴费时间',
                key: 'payTime',
                align: 'center',
                minWidth: 100,
              },
              {
                title: '年级',
                minWidth: 120,
                key: 'stuGradeName',
                align: 'center'
              },
              // {
              //   title: '班级',
              //   key: 'stuClass',
              //   align: 'center',
              //   minWidth: 100,
              // },
              {
                title: '学生姓名',
                key: 'stuName',
                align: 'center',
                minWidth: 100,
              },
              {
                title: '学生学号',
                key: 'stuNo',
                align: 'center',
                minWidth: 100,
              },
              {
                title: '缴费项目',
                key: 'itemName',
                align: 'center',
                minWidth: 100,
              },
              {
                title: '缴费渠道',
                key: 'source',
                align: 'center',
                minWidth: 100,
                render:(h,params)=>{
                  let source=params.row.source;
                  switch (source) {
                    case 1:
                      return h('span',{
                        'style':{
                          'color':'rgb(119,180,38)',
                          'margin-left':'5px',
                          'margin-right':'5px',
                        }
                      },"已代扣" )
                      break;
                    case 2:
                      return h('span',{
                        'style':{
                          'color':'rgb(25,128,127)',
                          'margin-left':'5px',
                          'margin-right':'5px',
                        }
                      },"自主缴费" )
                      break;
                    case 3:
                      return h('span',{
                        'style':{
                          'color':'rgb(217,38,53)',
                          'margin-left':'5px',
                          'margin-right':'5px',
                        }
                      },"等待代扣" )
                      break;
                    case 4:
                      return h('span',{
                        'style':{
                          'color':'rgb(217,38,53)',
                          'margin-left':'5px',
                          'margin-right':'5px',
                        }
                      },"线下现金" )
                      break;
                    case 5:
                      return h('span',{
                        'style':{
                          'color':'rgb(217,38,53)',
                          'margin-left':'5px',
                          'margin-right':'5px',
                        }
                      },"线下扫码" )
                      break;
                  }
                }
              },
              {
                title: '缴费金额(元)',
                key: 'strAmount',
                align: 'center',
                minWidth: 150,
                render:(h, params) => {
                  let source=params.row.source;
                  if(source==3){
                    return h('div',[
                      h('span',{
                        'style':{
                          'color':'#5599e5',
                          'margin-left':'5px',
                          'margin-right':'5px',
                        }
                      }, params.row.strAmount),
                      h('span', {
                        'style':{
                          'color':'rgb(217,38,53)',
                          'margin-left':'5px',
                          'margin-right':'5px',
                        }
                      },'(已冻结)'),
                    ])
                  }else {
                    return h('span',{
                      'style':{
                        'color':'#5599e5',
                        'margin-left':'5px',
                        'margin-right':'5px',
                      }
                    },params.row.strAmount)
                  }
                }
              },

            ],
          }
        },
        watch:{
          searchType(val){
            switch (val) {
              case 1:
                this.grade="";
                this.getData();
                break;
              case 2:
                this.grade=this.gradeList[0].code;
                break;
            }

          },
          payItemId(val){
            if(val!='' && val!=undefined){
              for(let i=0;i<this.payItems.length;i++){
                if(val==this.payItems[i].id){
                  this.payItem=this.payItems[i].name;
                  break;
                }
              }
            }else{
              this.payItem="";
            }

            this.getData();
          },
          grade(val){
            this.grade=val;
            this.getData();
          },
          status(val){
            switch (val) {
              case 0:
                this.button_year="primary";
                this.button_month="default";
                this.button_week="default";
                this.button_today="default";
                this.startDate=this.$Filters.getCurrentYearStartAndEndDate(this,false)[0];
                this.endDate=this.$Filters.getCurrentYearStartAndEndDate(this,false)[1];
              break;
              case 1:
                this.button_year="default";
                this.button_month="primary";
                this.button_week="default";
                this.button_today="default";
                this.startDate=this.$Filters.getCurrentMonthStartAndEndDate(this,false)[0];
                this.endDate=this.$Filters.getCurrentMonthStartAndEndDate(this,false)[1];
              break;
              case 2:
                this.button_year="default";
                this.button_month="default";
                this.button_week="primary";
                this.button_today="default";
                this.startDate=this.$Filters.getCurrentWeekStartAndEndDate(this,false)[0];
                this.endDate=this.$Filters.getCurrentWeekStartAndEndDate(this,false)[1];
              break;
              case 3:
                this.button_year="default";
                this.button_month="default";
                this.button_week="default";
                this.button_today="primary";
                this.startDate=this.$Filters.getCurrentDayStartAndEndDate(this,false)[0];
                this.endDate=this.$Filters.getCurrentDayStartAndEndDate(this,false)[1];
              break;
            }
            this.getData();
          }
        },
        methods:{
          getGradeList(){
            let that=this;
            let params={
              type:1,
            }
            this.$fetch(ucApi.payment.GET_GRADE_LIST, params).then((res)=> {
              if (res.code == 200 && res.body!=undefined) {
                let body=res.body;
                for(let i=0;i<body.length;i++){
                  let item=body[i]
                  if(item.code==1){
                    that.gradeList=item.grades;
                  }
                }

              }
            }).catch((err)=>{

            });
          },
          getPayItems(){
            let params={
              schoolId: util.getLocal("schoolId"),
              tokenId: util.getSession("token").id,
              curPage:1,
            }
            this.$fetch(ucApi.platform.PLATFORM_GET_PAYMENT_LIST_BY_PAGE, params).then((res)=> {
              if (res.code == 200) {
                this.payItems=res.body==undefined?[]:res.body.list;
                //this.payItemId=this.payItems[0].id;
              }
            }).catch((err)=>{

            });
          },
          getCard1Data(){
            let params={
              schoolId: util.getLocal("schoolId"),
              tokenId: util.getSession("token").id,
              type:this.searchType,
              //itemName:this.payItem,
              startDate:this.startDate,
              endDate:this.endDate,

            }
            if(!this.$Filters.isEmpty(this.payItem)){
              params.itemName=this.payItem;
            }
            if(this.searchType==2){
              params.grade=this.grade;
            }
            this.$fetch(ucApi.payment.GET_PAYMENT_COLLECT_PEOPLE, params).then((res)=> {
              if (res.code == 200) {
                let list=res.body==undefined?[]:res.body;
                let arr=[];
                list.forEach((item,index)=>{
                  arr.push({
                    name:item.name,finish:item.paid,notFinish:item.unpaid,
                  })
                })
                this.showCard1Data(arr);
              }
            }).catch((err)=>{

            });
          },
          showCard1Data(arr){
            let categories=[];
            let finish=[];
            let notFinish=[];
            arr.forEach((item)=>{
              categories.push(item.name)
              finish.push(item.finish)
              notFinish.push(item.notFinish)
            })
            let option = {
              color: ['#5B8FF9','#9f4ef4','#ffdb5c','#ff9f7f',
                '#e062ae','#ea6a6a','#97c979','#fb8d34','#feebae',
                '#fdcf84','#48b788','#9f4ef4','#7894ea',],
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              legend: {
                bottom: 0,
                left: 'center',
                icon:'rent',
                textStyle:{
                  color:"#9a9a9a",
                }
              },
              grid:{
                left: 10,
                right: 10,
                bottom: 30,
                top:20,
                containLabel: true
              },
              xAxis:{
                type: 'category',
                data: categories,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel:{
                  color:"#999999",
                  interval:0,
                  fontSize:14,
                  formatter:function (params) {
                    if(params=='undefined'){
                      return '';
                    }else{
                      return params;
                    }
                  }
                },
                axisLine:{
                  lineStyle:{
                    color:"#999999",
                  },
                },
              } ,
              yAxis: [
                {
                  type: 'value',
                  axisLine:{
                    show:false,
                  },
                  axisTick:{
                    show:false,
                  },
                  axisLabel:{
                    color:'#999999'
                  },
                  splitLine:{
                    show:true,
                    lineStyle:{
                      type:'dotted',
                      color:'#999999',
                      opacity:0.15
                    },
                  },
                }
              ],
              series: [
                {
                  name: '已缴费',
                  type: 'bar',
                  barGap:0,
                  barWidth: '35%',
                  data: finish
                },
                {
                  name: '未缴费',
                  type: 'bar',
                  barWidth: '35%',
                  data: notFinish
                }
              ],
            };

            this.chart1 = echarts.init(document.getElementById("chart1"));
            this.chart1.setOption(option,true);
            let that=this;
            setTimeout(()=>{if(that.chart1!=null);that.chart1.resize();},200)
          },
          getCard2Data(){
            let params={
              schoolId: util.getLocal("schoolId"),
              tokenId: util.getSession("token").id,
              type:this.searchType,
              //itemName:this.payItem,
              startDate:this.startDate,
              endDate:this.endDate,

            }
            if(!this.$Filters.isEmpty(this.payItem)){
              params.itemName=this.payItem;
            }
            if(this.searchType==2){
              params.grade=this.grade;
            }
            this.$fetch(ucApi.payment.GET_PAYMENT_COLLECT_AMOUNT, params).then((res)=> {
              if (res.code == 200) {
                let list=res.body==undefined?[]:res.body;
                let arr=[];
                list.forEach((item,index)=>{
                  arr.push({
                    name:item.name,initiative:(item.source1/100).toFixed(2),payment:(item.source2/100).toFixed(2),paying:(item.source3/100).toFixed(2),offline:(item.source4/100).toFixed(2)
                  })
                })
                this.showCard2Data(arr);
              }
            }).catch((err)=>{

            });
          },
          showCard2Data(arr) {
            let categories = [];
            let initiative = [];
            let payment = [];
            let paying = [];
            let offline = [];
            arr.forEach((item) => {
              categories.push(item.name)
              initiative.push(item.initiative)
              payment.push(item.payment)
              paying.push(item.paying)
              offline.push(item.offline)
            })
            let option = {
              color: ['#5B8FF9', '#9f4ef4', '#ffdb5c', '#ff9f7f',
                '#e062ae', '#ea6a6a', '#97c979', '#fb8d34', '#feebae',
                '#fdcf84', '#48b788', '#9f4ef4', '#7894ea',],
              tooltip: {
                textStyle:{
                  color:"#ffffff",
                },
                trigger: 'axis',
                //formatter: '{b}:<br /> {a0}:{c0}元<br />{a1}:{c1}元<br />{a2}:{c2}元<br />{a3}:{c3}元'
                //valueFormatter: (value) => '$' + value.toFixed(2)
              },
              legend: {
                bottom: 0,
                left: 'center',
                icon: 'rent',
                textStyle: {
                  color: "#9a9a9a",
                }
              },
              grid: {
                left: 10,
                right: 10,
                bottom: 30,
                top: 20,
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: categories,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  color: "#999999",
                  interval: 0,
                  fontSize: 14,
                  formatter: function (params) {
                    if (params == 'undefined') {
                      return '';
                    } else {
                      return params;
                    }
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: "#999999",
                  },
                },
              },
              yAxis: [
                {
                  type: 'value',
                  axisLine: {
                    show: false,
                  },
                  axisTick: {
                    show: false,
                  },
                  axisLabel: {
                    color: '#999999'
                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dotted',
                      color: '#999999',
                      opacity: 0.15
                    },
                  },
                }
              ],
              series: [
                {
                  name: '自主缴费',
                  type: 'bar',
                  barGap: 0,
                  barWidth: '20%',
                  data: initiative
                },
                {
                  name: '已代扣',
                  type: 'bar',
                  barWidth: '20%',
                  data: payment
                },
                {
                  name: '等待代扣',
                  type: 'bar',
                  barWidth: '20%',
                  data: paying
                },
                {
                  name: '线下现金缴费',
                  type: 'bar',
                  barWidth: '20%',
                  data: offline
                }
              ],
            };

            this.chart2 = echarts.init(document.getElementById("chart2"));
            this.chart2.setOption(option, true);
            let that = this;
            setTimeout(() => {
              if (that.chart2 != null) ;
              that.chart2.resize();
            }, 200)
          },
          getCard3Data(){

            let params={
              schoolId: util.getLocal("schoolId"),
              tokenId: util.getSession("token").id,
              type:this.searchType,
              //itemName:this.payItem,
              startDate:this.startDate,
              endDate:this.endDate,

            }
            if(!this.$Filters.isEmpty(this.payItem)){
              params.itemName=this.payItem;
            }
            if(this.searchType==2){
              params.grade=this.grade;
            }
            this.$fetch(ucApi.payment.GET_PAYMENT_COLLECT_INCOME, params).then((res)=> {
              if (res.code == 200) {
                let list=res.body==undefined?[]:res.body;
                let arr=[];
                list.forEach((item,index)=>{
                  let months=item.data;
                  let monthArr=[];
                  months.forEach((data,index)=>{
                    monthArr.push({
                      month:data.payMonth,
                      count:(data.income/100).toFixed(2),
                    })
                  })
                  arr.push({
                    name:item.name,data:monthArr,
                  })
                })
                this.showCard3Data(arr);
              }
            }).catch((err)=>{

            });
          },
          showCard3Data(arr){

            let colors=['#5B8FF9','#9f4ef4','#ffdb5c','#ff9f7f',
              '#e062ae','#ea6a6a','#97c979','#fb8d34','#feebae',
              '#fdcf84','#48b788','#9f4ef4','#7894ea',];
            let series=[];
            let categories=[];
            let legend=[];
            arr.forEach((item,index)=>{
              legend.push({
                name:item.name,
                textStyle:{
                  color:'#495062',
                },
              })
              let data=[];
              item.data.forEach((month,p)=>{
                if(index==0){
                  categories.push(month.month)
                }
                data.push(month.count)
              })
              series.push(
                {
                  name: item.name,
                  type: 'line',
                  smooth:true,
                  symbolSize: 5,
                  lineStyle:{
                    color: colors[index],
                  },
                  data: data,
                  itemStyle: {
                    normal: {
                      borderWidth: 5,
                      color: colors[index],
                    }
                  },
                  label:{
                    show:false,
                    position:'top',
                    offset:[0,0],
                    color:colors[index],
                  },
                  // areaStyle: {
                  //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  //     offset: 0,
                  //     color: '#ffc000'
                  //   }, {
                  //     offset: 1,
                  //     color: '#1D2C3A'
                  //   }])
                  // },
                },
              )
            })

            let option = {
              //color:['#ffc000','#16dbff'],
              title: {
                text: '',//数据(单位)
                textStyle:{color:'#495062',padding:10,fontSize:12}
              },
              tooltip: {
                show:true,
                //formatter: '{a} <br/> {b} : {c}',
              },

              legend: {
                data: legend,
                itemWidth:20,
                itemHeight:10,
                bottom:0,
                left:'center',
                icon:'rect',
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '15%',
                top:'5%',
                containLabel: true,

              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel:{
                  color:'#999999',
                  fontWeight:'bold',
                  fontFamily:'Microsoft YaHei',
                  //rotate: 30
                },
                axisLine:{
                  lineStyle:{
                    color:'#999999',
                    width:1,
                  },
                },
                data: categories
              },
              yAxis: {
                type: 'value',
                axisLine:{
                  show:false,
                },
                axisTick:{
                  show:false,
                },

                axisLabel:{
                  color:'#999999',
                  //fontWeight:'bold',
                  fontFamily:'Microsoft YaHei',
                },
                splitLine:{
                  show:true,
                  lineStyle:{
                    type:'dotted',
                    color:"#999999",
                    opacity:0.5,
                  },
                },
              },
              series: series

            };


            this.chart3 = echarts.init(document.getElementById("chart3"));
            this.chart3.setOption(option,true);
            let that=this;
            setTimeout(()=>{if(that.chart3!=null);that.chart3.resize();},200)
          },
          getCard4Data(){
            let params = {
              tokenId: util.getSession("token").id,
              //userId: util.getSession("user").id,
              schoolId: this.$util.getLocal("schoolId"),
              curPage:1,
              source:0,
            }

            this.$fetch(ucApi.payment.GET_PAYMENT_RECORDS, params).then((res)=> {

              if (res.code == 200) {
                console.log(res);
                this.$Message.success("请求完成！");
                let bodyData=res.body;
                this.list=bodyData.list==undefined?[]:bodyData.list;
              } else{
                this.$Message.error(res.message);
              }
              this.$load.hide();
            }).catch((err)=>{
              this.tableList = [];
              this.$Message.error(err);
              this.$load.hide();
            });
          },
          getData(){
            if(this.searchType==0){

            }else if(this.searchType==1){

            }
            this.getCard1Data();
            this.getCard2Data();
            this.getCard3Data();
            this.getCard4Data();
          },
          onResize(){
            let that=this;
            window.onresize=function(){
              if (that.windowChange!=null) {
                clearTimeout(that.windowChange);
              }
              that.windowChange = setTimeout(function(){
                if(that.chart1!=null);that.chart1.resize();
                if(that.chart2!=null);that.chart2.resize();
                if(that.chart3!=null);that.chart3.resize();
                if(that.chart4!=null);that.chart4.resize();
              } , 500);

            };
          },
        },
        mounted() {
          this.getGradeList();
          this.getPayItems();
          this.getData();
        }
    }
</script>

<style scoped lang="less">
  @deep: ~'>>>';

  .partent{
    height: calc(50% - 70px);
    margin-top:20px;
    @media screen and (max-height: 1800px) and (orientation: landscape){
      height: calc(50% - 60px) !important;
    }
    @media screen and (max-height: 1200px) and (orientation: landscape){
      height: calc(50% - 60px) !important;
    }
    @media screen and (max-height: 1080px) and (orientation: landscape){
      height: calc(50% - 60px) !important;
    }
    @media screen and (max-height: 1024px) and (orientation: landscape){
      height: calc(50% - 70px) !important;
    }
    @media screen and (max-height: 900px) and (orientation: landscape){
      height: calc(50% - 60px) !important;
    }
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(50% - 60px) !important;
    }
    div{
      height: 100%!important;
      margin: 0 !important;
    }
    @{deep}.ivu-card-body{
      height: e('calc(100% - 20px)')!important;

      overflow-y: hidden !important;
      overflow-x: hidden !important;
      >div{
        height: 100%!important;
      }

    }
    @{deep}.ivu-card-bordered {
      border-color: #eeeeee;
      border-width: 0px;
      margin: 0px;
    }
    @{deep}.ivu-card-head {
      border-bottom: 0px;
      height: 20px!important;
      p {
        color: #333!important;//#657180
        font-size: 16px;
      }
    }
    .ivu-card:hover{
      -webkit-box-shadow:none;
      box-shadow:none
    }
    .bgColor{
      background: #ffffff;
      >div:nth-of-type(2){
        >div{
          height: 100%!important;
        }
      }
      >div:nth-of-type(3){
        >div{
          height: 100%!important;
        }
      }
    }
  }
  @{deep}.ivu-table{
    height: 100%!important;
  }
</style>
