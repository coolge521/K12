<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">

      <span></span>
      <div style="float: right;display: flex;flex-direction: row;">
        <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea"  style="margin-right: 5px;width: 120px;margin-bottom: 5px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <DatePicker type="daterange" size="small" v-model='search.timeRange' split-panels placeholder="用餐时段" :clearable="false" style="width: 220px;margin-right: 5px;"></DatePicker>
        <Select v-model="search.grade" placeholder="请选择年级"  @on-change="onChangeGrade" clearable style="margin-right: 5px;width: 120px;margin-bottom: 5px;">
          <Option v-for="(item,index) in gradeList"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
          </Option>
        </Select>
        <Input clearable v-model="search.inClass" placeholder="请输入班级"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
        <Input clearable v-model="search.name" placeholder="请输入姓名"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
        <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doSearch">查询</Button>
        <Button type="primary" style="width: 90px;"  @click="doExport">导出</Button>

      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div class='uc-table'>
          <i-table border :columns="tableColumns" :data="tableList" :stripe="true" v-show="!($Filters.isShowNoDataView(tableList,this))" @on-row-click=""></i-table>
          <i-table border :columns="tableColumns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(tableList,this)"></i-table>
        </div>
      </i-col>
    </Row>
    <div>
      <Page
        :total="page.total"
        show-total
        size="small"
        :page-size="page.size"
        :current="page.current"
        show-elevator
        @on-change='pageChanged'>
      </Page>
    </div>


    <Modal
      title="用餐记录"
      v-model="showDetailModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      width="1000">
      <div style="width: 100%;display: flex;justify-content: flex-start;margin-bottom: 5px;background: #ffffff;padding: 5px;">
        <span style="color:#666666;font-size: 18px;">【{{detailType}}】用餐记录 - {{userName}}　{{sex}}　{{userClassName}}　</span>
        <span style="color:#5599e5;font-size: 18px;">{{userSchoolNum}}</span>
      </div>
      <div style="background: #ffffff;">
        <div class='uc-table' >
          <Table row-key="id" ref="table" border :columns="detailColumns" :data="detailList" :stripe="true" ></Table>
        </div>
        <div class="right">
          <Page slot='footer' size="small" :show-total=true :transfer=true :total="page1.total" :current="page1.current" :page-size="page1.size" show-elevator   @on-change='pageChanged1'  class="footclass"/>
        </div>
      </div>
    </Modal>

    <Modal
      title="用餐日历"
      v-model="showCalendarModel"
      class-name="vertical-center-modal"
      @on-cancel="cancelCalendarModal"
      :mask-closable="false"
      :footer-hide="true"
      width="700">
      <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 5px;background: #ffffff;padding: 5px;">
        <div>
          <span style="color:#666666;font-size: 18px;">用餐记录 - {{userName}}　{{sex}}　{{userClassName}}　</span>
          <span style="color:#5599e5;font-size: 18px;">{{userSchoolNum}}</span>
        </div>
        <Select v-model="timeZoneId" placeholder="请选择用餐时段"  @on-change="onChangeTimeZone"  style="margin-left: 5px;margin-right: 10px;width: 90px;">
          <Option v-for="(item,index) in timeZoneList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
      </div>
      <DinnerCalendar
        ref="calen"
        @clickDay = "clickDay"
        :arrDate = "arrDate"></DinnerCalendar>

      <div style="display: flex;justify-content: flex-end;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="background-color: #D51024;border-radius: 50%;width: 30px;height:30px;"></div>
        <span style="color: #929090;margin-left: 10px;">当日有未用餐记录</span>

        <div style="background-color: #CCF688;width: 30px;height:30px;margin-left: 50px;"></div>
        <span style="color: #929090;margin-left: 10px;margin-right: 5px;">当日正常用餐</span>
      </div>
    </Modal>


    <Modal id="dateInfo" v-model="showDateInfoModal" title="" width="400" height="300"
           class-name="vertical-center-modal"
           transfer
           :footer-hide="true">
        <div style="display: flex;justify-content: flex-start;">
           <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: center;">
             <span style="color:#ffffff;font-size: 15px;">{{infoType}}　-　</span>
           </div>
           <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;">
             <span style="color:#ffffff;font-size: 15px;">用餐日期：{{infoDate}}</span>
             <span style="color:#ffffff;font-size: 15px;margin-top: 5px;">用餐情况：{{infoName}}</span>
             <span style="color:#ffffff;font-size: 15px;margin-top: 5px;">情况说明：{{infoMark}}</span>
             <span style="color:#ffffff;font-size: 15px;margin-top: 5px;">登记员：　{{infoRegister}}</span>
           </div>
        </div>
    </Modal>
  </div>
</template>

<script>

  import util from "@/libs/util.js";
  import DinnerCalendar from "./DinnerCalendar";
    export default {
      name: "DinnerAnalysis",
      components: {
        DinnerCalendar,
      },
      data() {
        return {
          search:{
            areaId:'',
            timeRange:[],
            grade:'',
            inClass:'',
            name:'',
          },
          page:{
            current:1,
            size:20,
            total:0,
          },

          areaList:[],
          gradeList:[],
          timeZoneList:[],
          tableList:[],
          columns: [
            {
              title: '序号',
              key: 'id',
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '人员姓名',
              minWidth: 120,
              key: 'userName',
              align: 'center'
            },

            {
              title: '操作',
              key: 'action',
              minWidth: 100,
              align: 'center',
              render: (h, params) => {
                let that=this;
                return h('a', [
                  h('a', {
                    on: {
                      click:e => {
                        e.stopPropagation();
                        that.showCalendar(params.row);
                      }
                    }
                  }, '用餐日历'),
                ])
              }
            }
          ],
          tableColumns: [],

          page1:{
            current:1,
            size:20,
            total:0,
          },
          detailList:[],
          detailColumns: [
            {
              title: '序号',
              key: 'id',
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '用餐日期',
              minWidth: 100,
              key: 'eatDate',
              align: 'center'
            },
            {
              title: '用餐情况',
              minWidth: 70,
              key: 'eat',
              align: 'center',
              render: (h, params) => {
                let color = params.row.eat == 1?'#20A9ED':'#D51024'
                let eat = params.row.eat == 1?'已用餐':'未用餐'
                return h('div', [
                  h('span', {
                    'style':{
                      'color':color
                    }
                  }, eat)
                ]);
              }
            },
            {
              title: '情况说明',
              minWidth: 120,
              key: 'mark',
              align: 'center'
            },
            {
              title: '登记员姓名',
              minWidth: 100,
              key: 'registerUserName',
              align: 'center'
            },
            {
              title: '登记员手机号',
              minWidth: 100,
              key: 'registerUserPhone',
              align: 'center'
            },
            {
              title: '登记时间',
              minWidth: 100,
              key: 'createTime',
              align: 'center'
            },
          ],
          detailType:'',
          userName:'',
          userClassName:'',
          sex:'',
          userSchoolNum:'',

          showDetailModel:false,
          showCalendarModel:false,
          showDateInfoModal:false,
          arrDate:[],
          calendarDataList:[],
          timeZoneId:'',
          calendarItem:{},
          dataMap:{},

          infoDate:'',
          infoType:'',
          infoName:'',
          infoMark:'',
          infoRegister:'',
        }
      },
      methods: {
        dateChange(value){
          this.search.date=this.$moment(value).format("yyyy-MM-DD");

        },
        onChangeGrade(val){
          this.doSearch();
        },
        doSearch(){
          this.page.current = 1
          this.getListData()
        },
        pageChanged(page){
          this.page.current = page
          this.getListData()
        },
        onChangeArea(val){
          this.doSearch();
        },
        getListData() {
          let that = this
          this.$load.show();
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId") ,
            startDate:this.$moment(this.search.timeRange[0]).format('YYYY-MM-DD'),
            endDate:this.$moment(this.search.timeRange[1]).format('YYYY-MM-DD'),
            pageNum:this.page.current,
            pageSize:this.page.size,
          }
          if(!this.$Filters.isEmpty(this.search.areaId)){
            params.areaId = this.search.areaId
          }
          if(!this.$Filters.isEmpty(this.search.grade)){
            params.gradeId = this.search.grade
          }
          if(!this.$Filters.isEmpty(this.search.inClass)){
            params.classId = this.search.inClass
          }
          if(!this.$Filters.isEmpty(this.search.name)){
            params.userName = this.search.name
          }
          this.$fetch(this.$api.food.FOOD_ANALYSIS, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              that.page.current=Number(bodyData.curPage);
              that.page.total=Number(bodyData.totalCount);
              that.page.size=Number(bodyData.pageSize);
              that.tableList=bodyData.list;

              that.tableColumns = []
              that.tableColumns = that.tableColumns.concat(that.columns)
              if(that.tableList.length > 0){
                 let secList = that.tableList[0].foodSectionVoList
                 for(let i = 0;i<secList.length;i++){
                   let item = secList[i]
                   let secId = item.sectionId
                   let name = item.sectionName
                   that.tableColumns.splice(-1,0,{
                     title: name,
                     align: 'center',
                     children: [
                       {
                         title: '已用餐',
                         key: 'eatCount',
                         align: 'center',
                         minWidth: 80,
                         renderHeader: (h, params) => {
                           return h('div', [
                             h('div', {
                               'style':{
                                 'minWidth': '70px',
                                 'height': '25px',
                                 'padding': '3px 0px',
                                 'color':'#ffffff',
                                 'background':'#20A9ED',
                               }
                             }, '已用餐')
                           ]);
                         },
                         render: (h, params) => {
                           let secLi = params.row.foodSectionVoList
                           let data = secLi[i].eatCount
                           if(data == 0){
                             return h('div', [
                               h('span', {
                                 'style':{
                                   'color':'#20A9ED'
                                 }
                               }, data)
                             ]);
                           }else{
                             return h('div', [
                               h('a',{
                                 style:{
                                   'color':'#20A9ED',
                                   textDecoration:'underline'
                                 },
                                 on: {
                                   click:e => {
                                     e.stopPropagation();
                                     that.showStuDetail(secId,name,params.row);
                                   }
                                 }
                               },data)
                             ]);
                           }
                         }
                       },
                       {
                         title: '未用餐',
                         key: 'notEatCount',
                         align: 'center',
                         minWidth: 80,
                         renderHeader: (h, params) => {
                           return h('div', [
                             h('div', {
                               'style':{
                                 'minWidth': '70px',
                                 'height': '25px',
                                 'padding': '3px 0px',
                                 'color':'#ffffff',
                                 'background':'#D51024',
                               }
                             }, '未用餐')
                           ]);
                         },
                         render: (h, params) => {
                           let secLi = params.row.foodSectionVoList
                           let data = secLi[i].notEatCount
                           if(data == 0){
                             return h('div', [
                               h('span', {
                                 'style':{
                                   'color':'#D51024'
                                 }
                               }, data)
                             ]);
                           }else{
                             return h('div', [
                               h('a',{
                                 style:{
                                   'color':'#D51024',
                                   textDecoration:'underline'
                                 },
                                 on: {
                                   click:e => {
                                     e.stopPropagation();
                                     that.showStuDetail(secId,name,params.row);
                                   }
                                 }
                               },data)
                             ]);
                           }
                         }
                       }
                     ]
                   },)
                 }

              }
            } else{
              this.$Message.error(res.message);
            }
            this.$load.hide();
          }).catch((err)=>{
            that.tableList = [];
            this.$Message.error(err);
            this.$load.hide();
          });
        },

        showStuDetail(secId,secName,item){
           this.detailType = secName
           this.userName = item.userName
           this.userClassName = item.userClassName
           this.sex = item.sex
           this.userSchoolNum = item.userSchoolNum
           this.page1.current = 1
           this.detailList = []
           this.getDetailList(secId,item.userPhone)
           this.showDetailModel = true
        },

        getDetailList(timeId,phone){
          let that = this
          this.$load.show();
          let params = {
            tokenId: this.$util.getSession("token").id,
            registerUserId: this.$util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId") ,
            startDate:this.$moment(this.search.timeRange[0]).format('YYYY-MM-DD'),
            endDate:this.$moment(this.search.timeRange[1]).format('YYYY-MM-DD'),
            pageNum:this.page1.current,
            pageSize:this.page1.size,
            timeZoneId:timeId,
            userPhone:phone,
          }
          this.$fetch(this.$api.food.FOOD_GET_STUDENT_COUNT_DETAIL, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              that.page1.current=Number(bodyData.curPage);
              that.page1.total=Number(bodyData.totalCount);
              that.page1.size=Number(bodyData.pageSize);
              that.detailList=bodyData.list;

            } else{
              this.$Message.error(res.message);
            }
            this.$load.hide();
          }).catch((err)=>{
            that.detailList = [];
            this.$Message.error(err);
            this.$load.hide();
          });
        },


        pageChanged1(page){
          this.page1.current = page
          this.getDetailList()
        },


        showCalendar(item){
          this.userName = item.userName
          this.userClassName = item.userClassName
          this.sex = item.sex
          this.userSchoolNum = item.userSchoolNum

          if(this.timeZoneList.length > 0){
             this.timeZoneId = this.timeZoneList[0].id
          }
          this.arrDate = []
          this.calendarItem = item
          this.$refs.calen.showNowMonth()
          this.getCalendarData(item)
          this.showCalendarModel = true
        },

        cancelCalendarModal(){
          this.dataMap = new Map()
          this.showCalendarModel = false
        },


        getTimeZoneList() {
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("user").id,
            collegeId: this.$util.getLocal("schoolId") ,
            enable:1,
          }
          this.$fetch(this.$api.food.FOOD_TIME_SETTING_GET_ALL, params).then((res)=> {

            if (res.code == 200) {
              let bodyData=res.body;
              this.timeZoneList=bodyData;
            }
          }).catch((err)=>{
            this.timeZoneList = [];
          });
        },
        onChangeTimeZone(value){
          this.timeZoneId = value;
          this.getCalendarData(this.calendarItem)
        },

        getCalendarData(item){
          let that = this
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: item.userId,
            collegeId: this.$util.getLocal("schoolId") ,
            timeZoneId:this.timeZoneId,
            date:this.$moment(new Date()).format('YYYY-MM'),
          }
          this.$fetch(this.$api.food.FOOD_GET_STUDENT_FOOD_CALENDAR, params).then((res)=> {

            if (res.code == 200) {
              let bodyData=res.body;
              console.log(bodyData)
              that.calendarDataList=bodyData;
              that.arrDate = []
              that.dataMap = new Map()
              if(that.calendarDataList.length > 0){
                that.calendarDataList.forEach(function (item) {
                    if(item.schoolFoodEatRecord != null){
                       let record = item.schoolFoodEatRecord
                       that.arrDate.push({
                          date:item.date,
                          className: record.eat == 1?'normal_eat':'not_eat',
                          rec:record,
                       })
                      that.dataMap.set(item.date,record)
                    }
                })
              }

            }
          }).catch((err)=>{
            that.calendarDataList = [];
            that.arrDate = [];
          });
        },


        clickDay(item){
          let key = this.$moment(item).format('YYYY-MM-DD')
          if(this.dataMap.has(key)){
            let rec = this.dataMap.get(key)
            // console.log(rec)
            this.infoDate = rec.eatDate
            this.infoType = rec.timeZoneName
            this.infoName = rec.eat == 1?'已用餐':'未用餐'
            this.infoMark = rec.mark
            this.infoRegister = rec.registerUserName+'  '+rec.createTime
            this.showDateInfoModal = true
          }

        },


        doExport(){
          this.$load.show();
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId") ,
            startDate:this.$moment(this.search.timeRange[0]).format('YYYY-MM-DD'),
            endDate:this.$moment(this.search.timeRange[1]).format('YYYY-MM-DD'),
            pageNum:this.page.current,
            pageSize:this.page.size,
          }
          if(!this.$Filters.isEmpty(this.search.areaId)){
            params.areaId = this.search.areaId
          }
          if(!this.$Filters.isEmpty(this.search.grade)){
            params.gradeId = this.search.grade
          }
          if(!this.$Filters.isEmpty(this.search.inClass)){
            params.classId = this.search.inClass
          }
          if(!this.$Filters.isEmpty(this.search.name)){
            params.userName = this.search.name
          }

          this.$fetchBlob(this.$api.food.FOOD_EXPORT_EXCEL, params).then((res)=> {
            if (res.status == 200) {
              console.log(res);
              // const fileName = res.headers["content-disposition"].split('=')[1];
              const fileName = '用餐统计报表.xlsx';
              const aLink = document.createElement('a');
              const blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
              const _href = URL.createObjectURL(blob);
              aLink.style.display = 'none';
              aLink.href = _href;
              document.body.appendChild(aLink);
              aLink.setAttribute('download', decodeURI(fileName));
              aLink.click();
              document.body.removeChild(aLink);
              URL.revokeObjectURL(_href);
            } else{
              this.$Message.error(res.message);
            }
            this.$load.hide();
          }).catch((err)=>{
            this.$Message.error(err);
            this.$load.hide();
          });
        },


        getAreaList() {
          let that = this
          let params = {
            tokenId: util.getSession("token").id,
            schoolId: util.getLocal("schoolId"),
            enable:1,
          }

          this.$fetch(this.$api.platform.PLATFORM_AREA_LIST, params).then((res)=> {
            if (res.code == 200) {
              console.log(res);
              if(undefined != res.body){
                that.areaList=res.body;
                if(that.areaList.length > 0){
                  that.search.areaId = that.areaList[0].id
                  that.getListData()
                }else{
                  this.$Message.warning('缺少校区数据');
                }
              }else{
                that.areaList=[];
              }
            }

          }).catch((err)=>{
            that.areaList = [];
          });
        },


      },
      created() {

      },
      mounted() {
        this.search.timeRange = this.$Filters.getCurrentMonthStartAndEndDate(this,true);
        this.gradeList = util.getLocal("grades");
        this.getTimeZoneList();
        this.getAreaList();

      },
    }
</script>

<style scoped lang="less">
  @deep: ~'>>>';


  #dateInfo .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #dateInfo @{deep}.ivu-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.5);
    top: 35%!important;
  }
  #dateInfo @{deep}.ivu-modal-content{
    background: rgba(0,0,0,0);
    box-shadow: none;
    border: none;
  }
  #dateInfo @{deep}.ivu-modal-mask{
    background: rgba(0,0,0,0);
  }
</style>
