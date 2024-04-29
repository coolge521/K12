<!--该页面为最新的住宿统计页面（模拟数据）-->
<template>
  <div class="v-cloak" style="width: 100%;overflow-x: hidden;background: #001529 ;padding: 10px">
<!--    <div style="width: 100%;display: flex;justify-content: flex-end;align-items: center;margin-bottom: 10px">-->
<!--      <Select v-model="areaId" placeholder="选择区域"  style="width: 200px;height: 40px;margin-left: 10px;" :clearable="true">-->
<!--        <Option v-for="(item,index) in areaList"-->
<!--                :value="item.id"-->
<!--                :label="item.name"-->
<!--                :key="index">-->
<!--        </Option>-->
<!--      </Select>-->
<!--    </div>-->

    <!--通知 -->
    <div style="display: flex;height: 40px;align-items: center;padding-left: 30px;background: url('../../static/images/notice-bg.jpg') no-repeat;background-size: 100% 100%">
      <img style="width: 30px;" src="../../static/images/alarm.png" alt="">
      <div style="width: 95%;">
        <p  class="microsoft marquee" style="color: #fff;font-weight:bold " v-html="notice"></p>
      </div>
<!--      <img style="width: 30px;" src="../../static/images/right-arrow.png" alt="">-->
    </div>

    <div style="display: flex;width: 100%;height:60px;justify-content: flex-start;align-items: center;flex-wrap: wrap;margin-top: 10px">
      <div class="divBox" v-for="(item,index) in titleCount2" v-bind:key="index" :style="{marginRight:index<(titleCount2.length-1)?'2%':''}">
        <div :style="{height: '60px',width: '60px',background:item.color,display:'flex',justifyContent:'center',alignItems:'center'}">
          <img :src="item.icon" style="width: 40px;height: 40px;border-radius: 5px"/>
        </div>
        <div style="display: flex;flex-direction: column;padding-left:0.5vw;padding-right: 10px">
          <span style="color: #fff;font-size: 18px">{{item.name}} ></span>
          <div style="display: flex;align-items: center;padding-left: 1vw">
            <span style="font-size: 22px;font-weight: bold;color: #fff">{{item.count}}</span>
            <span style="margin-left: 5px;font-size: 16px;color: #fff">{{item.unit}}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex;height: auto;margin-top: 10px;width: 100%">
      <div style="display: flex;flex-direction: column;width:70%;height: 400px;background: #021D38;">
        <Tabs value="1" @on-click="tabChanged">
          <TabPane label="楼宇入住人员比" name="1"></TabPane>
          <TabPane label="楼宇住宿房间数比" name="2"></TabPane>
          <TabPane label="年级人数比" name="3"></TabPane>
          <TabPane label="学院人数比" name="4"></TabPane>
        </Tabs>
        <div id="chart4" style="height: 380px;width: 100%"></div>
      </div>

      <div style="display: flex;flex-direction: column;width:30%;height: 400px;padding: 10px;margin-left: 10px;background: #021D38">
        <Card class="bgColor">
          <p slot="title" style="color:#fff;font-size:18px;">统计数据</p>
          <a  slot="extra" style="padding: 5px 5px">
          </a>
          <div style="display: flex;flex-direction: column;justify-content: space-around;padding: 10px;height: 100%">
            <div style="display: flex;justify-content: space-between;align-items: center;height: 5px!important;padding: 10px!important;"
                 v-for="(item,index) in titleCount1" v-bind:key="index" class="effect">
              <img style="width: 20px;height: 20px;margin-right: 5px" :src="item.icon"/>
              <span style="width: 180px;color:#fff;font-size: 16px;">{{item!=undefined?item.name:''}}</span>
              <i-progress v-if="item!=undefined" :percent="item.percent" :hide-info='true' :stroke-width="12" style="display: flex;align-items: center;" status="active"></i-progress>
              <div style="display: flex;justify-content: space-between;align-items: center;padding-left: 2%;width: 150px">
                <span style="color: #fff;font-size:16px;opacity:1;" v-if="item.name.indexOf('率')!=-1">{{item.count}}%</span>
                <span style="color: #fff;font-size:16px;opacity:1;" v-else>{{item.count}}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>

    <div style="display: flex;height: auto;margin-top: 10px;width: 100%">
      <div style="display: flex;flex-direction: column;width:70%;height: 400px;background: #021D38;">
            <Tabs value="1" v-model="btnType">
              <TabPane label="钥匙借还" name="1"></TabPane>
              <TabPane label="来访登记" name="2"></TabPane>
              <TabPane label="换宿申请" name="3"></TabPane>
              <TabPane label="退宿办理" name="4"></TabPane>
              <TabPane label="入住申请" name="5"></TabPane>
            </Tabs>
            <div style="width:100%!important;height: 90%!important;padding: 10px;overflow-y: hidden">
              <Table border  :columns="column" :data="list" ></Table>
            </div>
        </div>
      <div style="display: flex;flex-direction: column;width:30%;height: 400px;padding: 10px;margin-left: 10px;background: #021D38">
        <Card class="bgColor">
          <p slot="title" style="color:#fff;font-size:18px;">门禁流水监控</p>
          <a  slot="extra" style="padding: 5px 5px">
            <Select v-model="premisesId" style="width:200px;margin-left: 10px;margin-right: 10px" placeholder="请选择楼宇">
              <Option v-for="item in premisesList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </a>
          <div style="display: flex;flex-direction: column;padding: 20px;width: 100%">
            <div style="display: flex;width: 100%;align-items: center">
              <img :src="lastEntrance.photo" style="height: 120px;width: 110px">
              <div style="display: flex;flex-direction: column;width: calc(100% - 120px);justify-content: space-around;align-items: center">
                <span style="font-size: 18px;margin-top: 5px;">{{lastEntrance.name}}</span>
                <span style="font-size: 16px;margin-top: 5px;">{{lastEntrance.major}}</span>
              </div>
            </div>
            <div style="height: 40px;background: #E6F7FF;border: 1px solid #91D5FF;border-radius: 2px;margin-top: 10px;display: flex;justify-content: space-between;align-items: center;padding: 0px 10px">
              <span style="font-size: 16px;color:#5C6266">{{lastEntrance.date=='-'?'无用户出入':lastEntrance.date}}</span>
              <span style="font-size: 16px;color:#5C6266">{{lastEntrance.time}}</span>
            </div>
            <div style="display: flex;flex-direction: column;justify-content: space-around;height: 100%;margin-top: 10px">
              <div style="display: flex;justify-content: space-between;align-items: center;height: 30px!important;padding: 2px!important;"
                   v-for="(item,index) in entranceList" v-bind:key="index" class="effect">
                <span style="width: 180px;color:#fff;font-size: 16px;">{{item!=undefined?item.name:''}}</span>
                <i-progress v-if="item!=undefined" :percent="parseInt(item.count>0?Math.random()*100:0)" :hide-info='true' :stroke-width="12" style="display: flex;align-items: center;" status="active"></i-progress>
                <div style="display: flex;justify-content: space-between;align-items: center;padding-left: 2%;width: 150px">
                  <span style="color: #fff;font-size:16px;opacity:1;">{{item!=undefined?item.count:0}}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <div style="height: 80px;display: flex;justify-content: space-between;align-items: center;background: #021D38;margin: 10px 0px">
      <div style="width: 50%;height: 100%;padding: 0px 10px;display: flex;align-items: center">
        <RadioGroup v-model="search.type">
          <Radio :label="0" :true-value="0" :false-value="1"><span style="color: #fff">按学院统计</span></Radio>
          <Select v-model="search.collegeId" style="width:200px;margin-left: 10px;" placeholder="按学院统计" clearable>
            <Option v-for="item in collegeList" :value="item.id" :key="item.id" :disabled="search.type==1">{{ item.name }}</Option>
          </Select>
          <Radio :label="1" :true-value="1" :false-value="0" style="margin-left: 20px"><span style="color: #fff">按公寓楼统计</span></Radio>
          <Select v-model="search.premisesId" style="width:200px;margin-left: 10px;" placeholder="按公寓楼统计" clearable>
            <Option v-for="item in premisesList" :value="item.id" :key="item.id" :disabled="search.type==0">{{ item.name }}</Option>
          </Select>
        </RadioGroup>
      </div>

      <div style="width: 50%;height: 100%;display: flex;justify-content: space-between;align-items: center">
        <div class="divBox2"  v-for="(item,index) in titleCount3" v-bind:key="index">
          <div style="display: flex;justify-content: space-between;width: 100% ;">
            <div style="display: flex;flex-direction: column;width: 90%;align-items: center;">
              <div style="display: flex;align-items: center;height: calc(50%- 30px);">
                <span v-if="index==0" class="nameClass0" style="color: #666;font-size: 14px;font-weight: bold;">{{item.name}}</span>
                <span v-if="index==1" class="nameClass1" style="color: #666;font-size: 14px;font-weight: bold;">{{item.name}}</span>
                <span v-if="index==2" class="nameClass2" style="color: #666;font-size: 14px;font-weight: bold;">{{item.name}}</span>
                <span v-if="index==3" class="nameClass3" style="color: #666;font-size: 14px;font-weight: bold;">{{item.name}}</span>
              </div>
              <div style="display: flex;justify-content: center;align-items: center;height: calc(50%- 30px);">
                <span style="color: #fff;font-size: 20px">{{item.count}}</span>
              </div>
            </div>
<!--            <div style="height: 100%;width: 1px;background: #eeeeee;" v-if="index<titleCount3.length-1"></div>-->
          </div>
        </div>
      </div>
    </div>
    <!-- 统计图表-->
    <div style="display: flex;justify-content: space-between;margin-top: 10px;width: 100%;height: 280px">
      <div style="width: 33.3%;background: #021D38;padding-top: 10px;padding-left: 10px;display: flex;flex-direction: column">
        <span style="font-size: 14px;font-weight: bold;color: #fff">人员类型构成</span>
        <div id="chart1" style="width: 100%;height: 100%"></div>
      </div>
      <div style="width: 33.3%;background: #021D38;padding-top: 10px;padding-left: 10px;margin-left: 10px;display: flex;flex-direction: column">
        <span style="font-size: 14px;font-weight: bold;color: #fff">人员性别构成</span>
        <div id="chart2" style="width: 100%;height: 100%"></div>
      </div>
      <div style="width: 33.3%;background: #021D38;padding-top: 10px;padding-left: 10px;margin-left: 10px;display: flex;flex-direction: column">
        <span style="font-size: 14px;font-weight: bold;color: #fff">人员民族构成</span>
        <div id="chart3" style="width: 100%;height: 100%"></div>
      </div>
    </div>

    <div style="display: flex;justify-content: space-between;margin-top: 10px;width: 100%;height: 280px">
      <div style="width: 33.3%;background: #021D38;padding-top: 10px;padding-left: 10px;display: flex;flex-direction: column">
        <span style="font-size: 14px;font-weight: bold;color: #fff">毕业生人数比</span>
        <div id="chart5" style="width: 100%;height: 100%"></div>
      </div>
      <div style="width: 33.3%;background: #021D38;padding-top: 10px;padding-left: 10px;margin-left: 10px;display: flex;flex-direction: column">
        <span style="font-size: 14px;font-weight: bold;color: #fff">毕业房间数比</span>
        <div id="chart6" style="width: 100%;height: 100%"></div>
      </div>
      <div style="width: 33.3%;background: #021D38;padding-top: 10px;padding-left: 10px;margin-left: 10px;display: flex;flex-direction: column">
        <span style="font-size: 14px;font-weight: bold;color: #fff">民汉合宿比</span>
        <div id="chart7" style="width: 100%;height: 100%"></div>
      </div>
    </div>

    <div style="display: flex;justify-content: space-between;margin-top: 10px;width: 100%;height: 280px">
      <div style="width: 33.3%;background: #021D38;padding-top: 10px;padding-left: 10px;display: flex;flex-direction: column">
        <span style="font-size: 14px;font-weight: bold;color: #fff">年级分布情况</span>
        <div id="chart8" style="width: 100%;height: 100%"></div>
      </div>
      <div style="width: 66.6%;background: #021D38;padding-top: 10px;padding-left: 10px;margin-left: 10px;display: flex;flex-direction: column">
        <span style="font-size: 14px;font-weight: bold;color: #fff">人数分布情况</span>
        <div id="chart9" style="width: 100%;height: 100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require("echarts/lib/component/legend")
  require("echarts/lib/component/legendScroll")
  require('echarts/lib/chart/pie')
  require('echarts/lib/chart/line')
  export default {
    data() {
      return {
        notice:"",
        titleCount1:[],
        titleCount2:[],
        colors:['#377AFC','#02A4EC','#EC808D','#F59A24','#C280FF','#ea6a6a','#97c979','#fb8d34','#feebae','#fdcf84','#48b788','#9f4ef4','#7894ea',],
        birthdayCount:0,
        chart4:null,

        areaList: [],
        areaId:'',
        premisesList:[],
        premisesId:'',
        entranceList:[],
        lastEntrance:{},

        btn:{
          all:"text",
          key:"primary",
          visitor:"text",
          changeroom:"text",
          quit:"text",
          in:'text',
        },
        btnType:'1',
        interval:null,

        column:[{title:'发起时间',key:'time',align:'center'},{title:'事务类型',key:'type',align:'center'},{title:'发起人',key:'userName',align:'center'},
          {title:'房间号',key:'romNum',align:'center'},{title:'状态',key:'stateName',align:'center'}],
        list:[],

        search:{
          type:0,//0学院  1楼宇
          collegeId:'',
          premisesId:'',
        },
        titleCount3:[],
        collegeList:[],

        chart1:null,
        chart2:null,
        chart3:null,
        chart5:null,
        chart6:null,
        chart7:null,
        chart8:null,
        chart9:null,

        windowChange:null,
      }
    },
    watch:{
      areaId:function(value){
        this.getPremises();
      },
      premisesId:function(value){
        this.entranceList=[];
        this.getEntranceList();
      },
      btnType:function(value){
        this.getTStringByType(value);
      },
      'search.collegeId':{
        handler: function (value, oldval) {
          if(oldval!=undefined && value!=undefined && value!=oldval){
            this.getFPData();
          }

        },
        deep: true,
        immediate:true,
      },
      'search.premisesId':{
        handler: function (value, oldval) {
          if(oldval!=undefined && value!=undefined && value!=oldval) {
            this.getFPData();
          }
        },
        deep: true,
        immediate:true,
      },
      'search.type':{
        handler: function (value, oldval) {
          if(this.search.premisesId!=''){
            this.search.premisesId='';
            return;
          }
          if(this.search.collegeId!=''){
            this.search.collegeId='';
            return;
          }
          if(oldval!=undefined && value!=undefined && value!=oldval){
            this.getFPData();
          }

        },
        deep: true,
        immediate:true,
      }
    },
    methods: {

      getNotices(){
        let that=this;
        this.$fetch(this.$api.apartment.GET_Last_Entrance, {
          tokenId: this.$util.getSession("token").tokenId,
          userId:  this.$util.getSession("user").id,
          collegeId:this.$util.getSession("user").collegeId,
          areaId:this.areaId==''?null:this.areaId,
        }).then((res)=> {
          if (res.code == 200 && res.body!=undefined) {
            let body=res.body;
            that.notice=body.memberName+'&nbsp;&nbsp;&nbsp;'+body.organization+'&nbsp;&nbsp;&nbsp;'+(this.$Filters.isEmpty(body.entranceName)?'':body.entranceName)+'&nbsp;&nbsp;&nbsp;'+
              '<font color=#ffffff>'+body.optime+'</font>'+'&nbsp;&nbsp;&nbsp;'+(this.$Filters.isEmpty(body.inOut)?'':body.inOut)
          }else{
            that.notice='暂无人员出入门禁'
          }
          clearInterval(that.interval)
          that.interval=setInterval(function(){
            that.getNotices()
          },1000*30);
        })
          .catch((err)=>{
          });
      },
      getHomeCollect(){
        let that=this;
        this.$fetch(this.$api.apartment.GET_HOME_COLLECT, {
          tokenId: this.$util.getSession("token").tokenId,
          userId:  this.$util.getSession("user").id,
          collegeId:  this.$util.getSession("user").collegeId,
          areaId:this.areaId==''?null:this.areaId,
        }).then((res)=> {
          if (res.code == 200) {
            Object.getOwnPropertyNames(res.body).forEach(function (key) {
              switch (key) {
                case 'reside':that.titleCount1.push({name:'入住人员',count:res.body[key],icon:'./static/images/rzry.png'}) ;break;
                case 'premises':that.titleCount1.push({name:'楼宇总数',count:res.body[key],icon:'./static/images/lyzs.png'});break;
                case 'room':that.titleCount1.push({name:'房间总数',count:res.body[key],icon:'./static/images/fjzs.png'});break;
                case 'totalBed':that.titleCount1.push({name:'床位总数',count:res.body[key],icon:'./static/images/cwzs.png'});break;
                case 'emptyBed':that.titleCount1.push({name:'空床数量',count:res.body[key],icon:'./static/images/kcsl.png'});break;
                case 'mixture':that.titleCount1.push({name:'民汉合宿率',count:(res.body[key]*100).toFixed(2),icon:'./static/images/kcsl.png'});break;
                case 'rate':that.titleCount1.push({name:'入住率',count:(res.body[key]*100).toFixed(2),icon:'./static/images/rzl.png'});break;

                case 'faculty':that.titleCount2.push({name:'学院数量',count:res.body[key],color:'#5AD8A6',icon:'./static/images/xysl.png',unit:'个'});break;
                case 'grade':that.titleCount2.push({name:'年级数量',count:res.body[key],color:'#F6BD16',icon:'./static/images/njsl.png',unit:'个'});break;
                case 'graduate':that.titleCount2.push({name:'毕业生数量',count:res.body[key],color:'#E86452',icon:'./static/images/byssl.png',unit:'人'});break;
                case 'education':that.titleCount2.push({name:'学历数量',count:res.body[key],color:'#5B8FF9',icon:'./static/images/xlsl.png',unit:'种'});break;
                case 'people':that.titleCount2.push({name:'民族数量',count:res.body[key],color:'#6DC8EC',icon:'./static/images/mzsl.png',unit:'人'});break;

                case 'birthday':that.titleCount2.push({name:'今日生日',count:res.body[key],color:'#FF9845',icon:'./static/images/srsl.png',unit:'人'});break;
              }
            })
          }
        })
          .catch((err)=>{
          });
      },

      getStatisticsByType(type){
        let that=this;
        let series=[];
        let xAxis=[];

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
          grid:{
            left: 10,
            right: 10,
            bottom: 10,
            top:10,
            containLabel: true
          },
          xAxis:xAxis ,
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
                color:'#fff'
              },
              splitLine:{
                show:true,
                lineStyle:{
                  type:'dashed',
                  color:'#D8D8D8',
                  opacity:0.15
                },
              },
            }
          ],
          series: series,
        };
        this.$fetch(this.$api.apartment.GET_HOME_BAR, {
          tokenId: this.$util.getSession("token").tokenId,
          userId:  this.$util.getSession("user").id,
          collegeId:  this.$util.getSession("user").collegeId,
          type:type,
          areaId:this.areaId==''?null:this.areaId,
        }).then((res)=> {
          if (res.code == 200) {
            Object.getOwnPropertyNames(res.body).forEach(function (key) {
              let names=[];let datas=[];
              switch (key) {
                case 'premisesReside':
                  res.body.premisesReside.forEach((item)=>{
                    names.push(item.premisesName)
                    datas.push(item.resideCount)
                  })
                  if(names.length<8){
                    names.length=8;
                  }
                  option.xAxis.push(
                    {
                      type: 'category',
                      data: names,
                      axisTick: {
                        alignWithLabel: true
                      },
                      axisLabel:{
                        color:"#999999",
                        interval:names.length>10?2:0,
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
                          color:"rgba(255,255,255,0.06)",
                        },
                      },
                    }
                  )
                  option.series.push({
                    name: '',
                    type: 'bar',
                    barWidth: datas.length>8?'30%':'40%',
                    data: datas
                  })
                  that.chart4 = echarts.init(document.getElementById("chart4"));
                  that.chart4.setOption(option,true);
                  break;
                case 'premisesRoom':
                  let all=[];
                  let empty=[];
                  res.body.premisesRoom.forEach((item)=>{
                    names.push(item.premisesName)
                    all.push(item.total)
                    empty.push(item.empty)
                  })
                  if(names.length<8){
                    names.length=8;
                  }
                  option.xAxis.push(
                    {
                      type: 'category',
                      data: names,
                      axisTick: {
                        alignWithLabel: true
                      },
                      axisLabel:{
                        color:"#999999",
                        interval:names.length>10?2:0,
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
                    }
                  )
                  option.series.push(
                    {
                      name: '总房间数',
                      type: 'bar',
                      barGap:0,
                      barWidth: all.length>8?'30%':'40%',
                      data: all
                    },
                    {
                      name: '空房间数',
                      type: 'bar',
                      barWidth: empty.length>8?'30%':'40%',
                      data: empty
                    }
                  )
                  that.chart4 = echarts.init(document.getElementById("chart4"));
                  that.chart4.setOption(option,true);
                  break;
                case 'grade':
                  let male=[];
                  let female=[];
                  res.body.grade.forEach((item)=>{
                    names.push(item.grade)
                    male.push(item.male)
                    female.push(item.female)
                  })
                  if(names.length<8){
                    names.length=8;
                  }
                  option.xAxis.push(
                    {
                      type: 'category',
                      data: names,
                      axisTick: {
                        alignWithLabel: true
                      },
                      axisLabel:{
                        color:"#999999",
                        interval:names.length>10?2:0,
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
                    }
                  )
                  option.series.push(
                    {
                      name: '男',
                      type: 'bar',
                      barGap:0,
                      barWidth: male.length>8?'30%':'40%',
                      data: male
                    },
                    {
                      name: '女',
                      type: 'bar',
                      barWidth: female.length>8?'30%':'40%',
                      data: female
                    }
                  )
                  that.chart4 = echarts.init(document.getElementById("chart4"));
                  that.chart4.setOption(option,true);
                  break;
                case 'faculty':
                  let man=[];
                  let woman=[];
                  res.body.faculty.forEach((item)=>{
                    names.push(item.facultyName==undefined?'':item.facultyName)
                    man.push(item.male)
                    woman.push(item.female)
                  })
                  if(names.length<8){
                    names.length=8;
                  }
                  option.xAxis.push(
                    {
                      type: 'category',
                      data: names,
                      axisTick: {
                        alignWithLabel: true
                      },
                      axisLabel:{
                        color:"#999999",
                        interval:names.length>10?2:0,
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
                    }
                  )
                  option.series.push(
                    {
                      name: '男',
                      type: 'bar',
                      barGap:0,
                      barWidth: man.length>8?'30%':'40%',
                      data: man
                    },
                    {
                      name: '女',
                      type: 'bar',
                      barWidth: woman.length>8?'30%':'40%',
                      data: woman
                    }
                  )
                  that.chart4 = echarts.init(document.getElementById("chart4"));
                  that.chart4.setOption(option,true);
                  break;
              }
            })
            setTimeout(function () {
              that.chart4.resize()
            },400)
          }
        })
          .catch((err)=>{
          });
      },
      tabChanged(name){
        this.getStatisticsByType(name);
      },

      getPremises() {
        this.$fetch(this.$api.apartment.GET_ALL_PREMISES_BY_AREAID, {
          userId: this.$util.getSession("token").userId,
          collegeId:this.$util.getSession('user').collegeId,
          tokenId: this.$util.getSession('token').tokenId,
          areaId:this.areaId==''?null:this.areaId,
        }).then((res) => {
          if (res.code == 200) {
            this.premisesList = res.body;
            if(this.premisesList!=undefined && this.premisesList.length>0){
              this.premisesId=this.premisesList[0].id;
            }
          }

        }).catch((err) => {

        })
      },
      getEntranceList(){
        let that=this;
        this.$fetch(this.$api.apartment.GET_EntranceStatement, {
          tokenId: this.$util.getSession("token").tokenId,
          userId:  this.$util.getSession("user").id,
          collegeId:this.$util.getSession("user").collegeId,
          areaId:this.areaId==''?null:this.areaId,
          premisesId:  this.premisesId==''?null:this.premisesId,
        }).then((res)=> {
          if (res.code == 200) {
            Object.getOwnPropertyNames(res.body).forEach(function (key) {
              switch (key) {
                case 'in24H':that.entranceList.push({name:'24小时早出',count:res.body[key]}) ;break;
                case 'inMonth':that.entranceList.push({name:'本月早出',count:res.body[key]});break;
                case 'out24H':that.entranceList.push({name:'24小时晚归',count:res.body[key]});break;
                case 'outMonth':that.entranceList.push({name:'本月晚归',count:res.body[key]});break;
              }
            })
            //找出最大数构造百分比
            let max=1;
            for(let i=0;i<that.entranceList.length;i++){
              let item=that.entranceList[i];
              if(item.count>max){
                max=item.count;
              }
            }
            that.entranceList.forEach((item,index)=>{
              item.percent= ((item.count/max)*100).toFixed(1);
            })

            if(res.body.last!=undefined){
              let last=res.body.last;
              that.lastEntrance={
                name:last.memberName,
                date:that.$moment(last.optime).format('YYYY-MM-DD'),
                time:that.$moment(last.optime).format('HH:mm:ss'),
                photo:last.memberPhoto==undefined?'./static/images/no-people-entrance.png':last.memberPhoto,
                major:last.major};
            }else{
              that.lastEntrance={
                name:'-',
                date:'-',
                time:'-',
                photo:'./static/images/no-people-entrance.png',
                major:'-'};
            }
          }
        })
          .catch((err)=>{
          });
      },


      getTStringByType(type){
        switch(parseInt(type)){
          case 0:
            this.btn.all="primary";
            this.btn.key="text";
            this.btn.visitor="text";
            this.btn.changeroom="text";
            this.btn.quit="text";
            this.btn.in="text";
            break;
          case 1:
            this.btn.all="text";
            this.btn.key="primary";
            this.btn.visitor="text";
            this.btn.changeroom="text";
            this.btn.quit="text";
            this.btn.in="text";
            break;
          case 2:
            this.btn.all="text";
            this.btn.key="text";
            this.btn.visitor="primary";
            this.btn.changeroom="text";
            this.btn.quit="text";
            this.btn.in="text";
            break;
          case 3:
            this.btn.all="text";
            this.btn.key="text";
            this.btn.visitor="text";
            this.btn.changeroom="primary";
            this.btn.quit="text";
            this.btn.in="text";
            break;
          case 4:
            this.btn.all="text";
            this.btn.key="text";
            this.btn.visitor="text";
            this.btn.changeroom="text";
            this.btn.quit="primary";
            this.btn.in="text";
            break;
          case 5:
            this.btn.all="text";
            this.btn.key="text";
            this.btn.visitor="text";
            this.btn.changeroom="text";
            this.btn.quit="text";
            this.btn.in="primary";
            break;
        }
        this.getTaskList();
      },

      getTaskList(){
        let that=this;
        that.list=[];
        this.$fetch(this.$api.apartment.GET_TASK_LIST, {
          tokenId: this.$util.getSession("token").tokenId,
          userId:  this.$util.getSession("user").id,
          collegeId:this.$util.getSession("user").collegeId,
          type:this.btnType,
          areaId:this.areaId==''?null:this.areaId,
        }).then((res)=> {
          if (res.code == 200) {
            if(that.btnType==1 && res.body.borrowKeyTasks!=undefined){
              res.body.borrowKeyTasks.forEach((item)=>{
                that.list.push({
                  time:item.opreatTime==undefined?'':item.opreatTime,
                  type:'钥匙借还',
                  userName:item.name==undefined?'':item.name,
                  romNum:item.roomInfo==undefined?'':item.roomInfo,
                  stateName:'待审批',
                })
              })
            }else if(that.btnType==2 && res.body.visitorTasks!=undefined){
              res.body.visitorTasks.forEach((item)=>{
                that.list.push({
                  time:item.createTime==undefined?'':item.createTime,
                  type:'来访登记',
                  userName:item.intervieweeName==undefined?'':item.intervieweeName,
                  romNum:item.room==undefined?'':item.room,
                  stateName:'待审批',
                })
              })
            }else if(that.btnType==3 && res.body.changeTasks!=undefined){
              res.body.changeTasks.forEach((item)=>{
                that.list.push({
                  time:item.changeRoomTime==undefined?'':item.changeRoomTime,
                  type:'换宿申请',
                  userName:item.organStudentBean==undefined?'':item.organStudentBean.name,
                  romNum:item.roomNum==undefined?'':item.roomNum,
                  stateName:'待审批',
                })
              })
            }else if(that.btnType==4 && res.body.retreatTasks!=undefined){
              res.body.retreatTasks.forEach((item)=>{
                that.list.push({
                  time:item.createTime==undefined?'':item.createTime,
                  type:'退宿办理',
                  userName:item.name==undefined?'':item.name,
                  romNum:item.roomNum==undefined?'':item.roomNum,
                  stateName:'待审批',
                })
              })
            }else if(that.btnType==5 && res.body.applyBedTasks!=undefined){
              res.body.applyBedTasks.forEach((item)=>{
                that.list.push({
                  time:item.optime==undefined?'':item.optime,
                  type:'入住申请',
                  userName:item.student==undefined?'':item.student.name,
                  romNum:item.roomNo==undefined?'':item.roomNo,
                  stateName:'待审批',
                })
              })
            }
          }
        })
          .catch((err)=>{
          });
      },

      getDepartmentList(){
        this.$fetch(this.$api.apartment.GET_DEPARTMENT_BY_COLLEGE, {
          collegeId: this.$util.getLocal("college"),
          tokenId:this.$util.getSession("token").tokenId,
          areaId:this.areaId==''?null:this.areaId,
        }).then((res)=> {
          if (res.code == 200) {
            this.collegeList=res.body;
          }
        })
          .catch((err)=>{

          });
      },

      getFPBase(){
        return this.$fetch(this.$api.apartment.GET_FP_BASE, {
          collegeId: this.$util.getLocal("college"),
          tokenId:this.$util.getSession("token").tokenId,
          userId: this.$util.getSession("token").userId,
          searchType:this.search.type,
          searchId:this.search.type==0?(this.search.collegeId==''?null:this.search.collegeId):(this.search.premisesId==''?null:this.search.premisesId)
        })
      },
      getFPPie(){
        return this.$fetch(this.$api.apartment.GET_FP_PIE, {
          collegeId: this.$util.getLocal("college"),
          tokenId:this.$util.getSession("token").tokenId,
          userId: this.$util.getSession("token").userId,
          searchType:this.search.type,
          searchId:this.search.type==0?(this.search.collegeId==''?null:this.search.collegeId):(this.search.premisesId==''?null:this.search.premisesId),
          pieType:0,
        })
      },
      getFPBar(){
        return this.$fetch(this.$api.apartment.GET_FP_BAR, {
          collegeId: this.$util.getLocal("college"),
          tokenId:this.$util.getSession("token").tokenId,
          userId: this.$util.getSession("token").userId,
          searchType:this.search.type,
          searchId:this.search.type==0?(this.search.collegeId==''?null:this.search.collegeId):(this.search.premisesId==''?null:this.search.premisesId)
        })
      },

      getFPData(){
        let that=this;
        that.titleCount3=[];
        this.$axios.all([this.getFPBase(),this.getFPPie(),this.getFPBar(),])
          .then(this.$axios.spread((baseData,pieData,barData)=>{
            if(baseData.body!=undefined){
              that.titleCount3.push({name:'人员总数',count:baseData.body.reside});
              that.titleCount3.push({name:'毕业人数',count:baseData.body.graduate});
              that.titleCount3.push({name:'房间总数',count:baseData.body.room});
              that.titleCount3.push({name:'毕业房间数',count:baseData.body.graduateRoom});
            }
            if(pieData.body!=undefined && pieData.body.studentType){
              let list=[];
              pieData.body.studentType.forEach((item)=>{list.push({name:item.name,value:item.count})})
              that.drawStudentType(list)
            }
            if(pieData.body!=undefined && pieData.body.sex){
              let list=[];
              pieData.body.sex.forEach((item)=>{list.push({name:item.name,value:item.count})})
              that.drawStudentSex(list)
            }
            if(pieData.body!=undefined && pieData.body.nation){
              let list=[];
              pieData.body.nation.forEach((item)=>{list.push({name:item.name,value:item.count})})
              that.drawStudentNation(list)
            }
            if(pieData.body!=undefined && pieData.body.graduatePerson){
              let list=[];
              pieData.body.graduatePerson.forEach((item)=>{list.push({name:item.name,value:item.count})})
              that.drawGraduatePerson(list)
            }
            if(pieData.body!=undefined && pieData.body.graduateRoom){
              let list=[];
              pieData.body.graduateRoom.forEach((item)=>{list.push({name:item.name,value:item.count})})
              that.drawGraduateRoom(list)
            }
            if(pieData.body!=undefined && pieData.body.mixtureRoom){
              let list=[];
              pieData.body.mixtureRoom.forEach((item)=>{list.push({name:item.name,value:item.count})})
              that.drawMixtureRoom(list)
            }
            if(pieData.body!=undefined && pieData.body.grade){
              let list=[];
              pieData.body.grade.forEach((item)=>{list.push({name:item.name,value:item.count})})
              that.drawGrade(list)
            }
            if(barData.body!=undefined){
              let names=[];
              let datas=[];
              barData.body.forEach((item)=>{names.push(item.name);datas.push(item.count)})
              that.drawBar(names,datas)
            }
          }))
      },

      drawStudentType(data){
        let lagend={
          type: 'scroll',
          orient: 'vertical',
          tooltip: {
            show: true
          },
          right:10,
          top:'center',
          icon:'circle',
          textStyle:{
            color:"#999999",
            fontSize:12,
          }}
        this.chart1 = echarts.init(document.getElementById('chart1'));
        let option =this.$echartUtil.annularChartOption(data,[],lagend,['40%','50%'],['30%', '60%']);
        this.chart1.setOption(option);
      },
      drawStudentSex(data){
        let lagend={
          type: 'scroll',
          orient: 'vertical',
          tooltip: {
            show: true
          },
          right:10,
          top:'center',
          icon:'circle',
          textStyle:{
            color:"#999999",
            fontSize:12,
          }}
        this.chart2 = echarts.init(document.getElementById('chart2'));
        let option =this.$echartUtil.annularChartOption(data,[],lagend,['40%','50%'],['30%', '60%']);
        this.chart2.setOption(option);
      },
      drawStudentNation(data){
        let lagend={
          type: 'scroll',
          orient: 'vertical',
          tooltip: {
            show: true
          },
          right:10,
          top:'center',
          icon:'circle',
          textStyle:{
            color:"#999999",
            fontSize:12,
            overflow:'truncate',
            ellipsis:'...',

          }}
        this.chart3 = echarts.init(document.getElementById('chart3'));
        let option =this.$echartUtil.annularChartOption(data,[],lagend,['40%','50%'],['30%', '60%'],{show:false},{show:false});
        this.chart3.setOption(option,true);
      },
      drawGraduatePerson(data){
        let lagend={
          type: 'scroll',
          orient: 'vertical',
          tooltip: {
            show: true
          },
          right:10,
          top:'center',
          icon:'circle',
          textStyle:{
            color:"#999999",
            fontSize:12,
          }}
        this.chart5 = echarts.init(document.getElementById('chart5'));
        let option =this.$echartUtil.annularChartOption(data,[],lagend,['40%','50%'],['30%', '60%']);
        this.chart5.setOption(option);
      },
      drawGraduateRoom(data){
        let lagend={
          type: 'scroll',
          orient: 'vertical',
          tooltip: {
            show: true
          },
          right:10,
          top:'center',
          icon:'circle',
          textStyle:{
            color:"#999999",
            fontSize:12,
          }}
        this.chart6 = echarts.init(document.getElementById('chart6'));
        let option =this.$echartUtil.annularChartOption(data,[],lagend,['40%','50%'],['30%', '60%']);
        this.chart6.setOption(option);
      },
      drawMixtureRoom(data){
        let lagend={
          type: 'scroll',
          orient: 'vertical',
          tooltip: {
            show: true
          },
          right:10,
          top:'center',
          icon:'circle',
          textStyle:{
            color:"#999999",
            fontSize:12,
          }}
        this.chart7 = echarts.init(document.getElementById('chart7'));
        let option =this.$echartUtil.annularChartOption(data,[],lagend,['40%','50%'],['30%', '60%']);
        this.chart7.setOption(option);
      },
      drawGrade(data){
        let lagend={
          type: 'scroll',
          orient: 'vertical',
          tooltip: {
            show: true
          },
          right:10,
          top:'center',
          icon:'circle',
          textStyle:{
            color:"#999999",
            fontSize:12,
          }}
        this.chart8 = echarts.init(document.getElementById('chart8'));
        let option =this.$echartUtil.annularChartOption(data,[],lagend,['40%','50%'],['30%', '60%']);
        this.chart8.setOption(option);
      },
      drawBar(names,datas){
        this.chart9 = echarts.init(document.getElementById('chart9'));
        let option =this.$echartUtil.barChartOption(names,datas,[]);
        option.xAxis[0].axisLine.lineStyle.color="rgba(255,255,255,0.06)";
        option.yAxis[0].axisLabel.color='#fff';
        option.yAxis[0].splitLine.lineStyle.color='rgba(255,255,255,0.06)';
        this.chart9.setOption(option,true);
      },
      getAllAreaList() {
        this.$fetch(this.$api.apartment.GET_COLLEGE_HOUSE_MANAGE_AREALIST, {
          collegeId: this.$util.getLocal("college"),
          tokenId: this.$util.getSession("token").tokenId,
          userId: this.$util.getSession("user").id,
        }).then((res) => {
          this.$load.hide();
          if (res.code == 200) {
            this.areaList = res.body;
          }
        })
          .catch((err) => {
          });
      },

      onResize(){
        let that=this;
        window.onresize=function(){
          if (that.windowChange!=null) {
            clearTimeout(that.windowChange);
          }
          that.windowChange = setTimeout(function(){
            that.chart1.resize();
            that.chart2.resize();
            that.chart3.resize();
            that.chart4.resize();
            that.chart5.resize();
            that.chart6.resize();
            that.chart7.resize();
            that.chart8.resize();
            that.chart9.resize();
          } , 500);

        };
      },
    },
    created() {

    },
    mounted(){
      this.getAllAreaList();

      this.getNotices();
      this.getHomeCollect();
      this.getStatisticsByType(1)
      this.getPremises();
      this.getTaskList();
      this.getDepartmentList();
      this.getFPData();
      let that=this;
      setTimeout(function(){
        that.onResize();
      },1000);
    },
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  .partent{
    padding: 5px;height: 50%;margin-top:0.2%;width:100%;
    div{
      height: 100%!important;
      margin: 0 !important;
    }
  }
  .marquee {
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    animation: marquee 35s linear infinite;
  }

  .marquee:hover {
    animation-play-state: paused
  }

  /* Make it move */
  @keyframes marquee {
    0%   { text-indent: 100% }
    100% { text-indent: -100% }
  }

  /* Make it pretty */
  .microsoft {
    padding-left: 1.5em;
    position: relative;
    font: 18px 'Segoe UI', Tahoma, Helvetica, Sans-Serif;
    font-weight: bold;
  }

  /* ::before was :before before ::before was ::before - kthx */
  .microsoft:before, .microsoft::before {
    z-index: 2;
    content: '';
    position: absolute;
    top: -1em; left: -1em;
    width: .5em; height: .5em;
  }

  .microsoft:after, .microsoft::after {
    z-index: 1;
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 2em; height: 2em;
    background-image: linear-gradient(90deg, rgb(47,138,251,0.8) 70%, rgba(255,255,255,0));
  }

  .divBox{
    background-color: #021D38;display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 15%;height: 100%;
    transition: 0.3s;
    border-radius: 2%;
    opacity: 1;
  }
  .divBox:hover {opacity: 1;transform: scale(1.1);}
  .divBox2{
    display: flex;flex-direction: column;justify-content: center;align-items: center;width: 15%;height: 90%;

  }

  .bgColor {
    background:#021D38;
    width: 100%;
    height: 100%;
  }
  @{deep}.ivu-card-bordered{
    border: none;
  }
  @{deep}.ivu-card-head{
    border: none;
  }
  @{deep}.ivu-card-body{
    height: calc(100% - 40px)!important;
  }
  @{deep}.ivu-tabs-nav-container{
    line-height: 3;
  }
  @{deep}.ivu-tabs-nav .ivu-tabs-tab-active{
    color: #fff;
    font-size: 16px;
  }
  @{deep}.ivu-tabs-bar{
    border-bottom: 1px solid #000000;
  }
  @{deep}.ivu-progress-bg{
    background: -webkit-linear-gradient(360deg,#5B8FF9,#01c1ec);
    -webkit-background-clip: content;-webkit-text-fill-color:transparent
  }
  @{deep}.ivu-progress-inner{
    display: inline-block;
    width: 100%;
    background-color: rgb(50,50,50);
    vertical-align: middle;
    position: relative;
    opacity:1;
  }
  @{deep}.ivu-table{
    background: transparent;
  }
  @{deep}.ivu-table:before{
    height: 0px;
  }
  @{deep}.ivu-table-border:after{
    width: 0px;
  }
  @{deep}.ivu-table-row{
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  @{deep}.ivu-table-header thead tr th {
    background: #1B324F;
    color: white;
    font-size: 16px;
    border: none;
  }
  @{deep}.ivu-table-wrapper-with-border{
    border: none;
  }
  @{deep}.ivu-table td, .ivu-table th{
    height: 50px!important;
    background: #021D38;
    border: none!important;
    border-bottom: 1px solid #666666;
    border-right:  1px solid #666666;
    color: white;
    font-size: 14px;
  }
  @{deep}.ivu-select-selection{
    background: transparent;
    border: 1px solid rgba(255,255,255,0.06);
  }
  @{deep}.ivu-select-dropdown{
    background: rgba(255,255,255,0.06)!important;
  }
  @{deep}.ivu-select-placeholder{
    color: #666!important;
  }
  .nameClass0::before{
    content: '●';
    size: 30px;
    color: #5B8FF9;
    opacity: 0.45;
  }
  .nameClass1::before{
    content: '●';
    size: 30px;
    color: #E3B936;
    opacity: 0.45;
  }
  .nameClass2::before{
    content: '●';
    size: 30px;
    color: #7BE0B7;
    opacity: 0.45;
  }
  .nameClass3::before{
    content: '●';
    size: 30px;
    color: #7C8CA7;
    opacity: 0.45;
  }
</style>
