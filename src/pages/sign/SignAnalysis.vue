<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <div style="display: flex;justify-content: flex-start;align-items: center;">
        <span style="color:#D51024">红色数字</span>：未到人数　　<span style="color:#2FABE9">蓝色数字</span>：已到人数　　<span style="color:#20A9ED">️✔</span>：全到　　空白框：无记录
      </div>
      <div style="float: right;display: flex;flex-direction: row;">
        <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea"  style="margin-right: 5px;width: 120px;margin-bottom: 5px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <DatePicker type="month" size="small" v-model='search.month' split-panels placeholder="统计月份"　:editable="false" :clearable="false" style="width: 120px;margin-right: 5px;"></DatePicker>
        <Select v-model="search.grade" placeholder="请选择年级"  @on-change="onChangeGrade"  style="margin-right: 5px;width: 120px;margin-bottom: 5px;">
          <Option v-for="(item,index) in gradeList"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
          </Option>
        </Select>
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


    <Modal
      title="入校情况"
      v-model="showDetailModel"
      class-name="vertical-center-modal"
      @on-cancel="cancelDetailModal"
      :mask-closable="false"
      :footer-hide="true"
      width="700">
      <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 5px;background: #ffffff;padding: 5px;">
        <div>
          <span style="color:#333333;font-weight: bold;">{{classInfo}}　{{dateInfo}}　</span>
          <span style="color:#666666;">学生入校登记情况：</span>
        </div>
        <div style="display: flex;justify-content: flex-end;align-items: center;">
          <span style="color:#D51024;">✖</span>：未到校　　<span style="color:#20A9ED">️✔</span>：已到校　　空白框：无记录
        </div>
      </div>

      <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;margin-top: 5px;">
        <div class="cell_title">学号</div>
        <div class="cell_title">学生姓名</div>
        <div class="cell_title">签到状态</div>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;width: 100%;">
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;width: 100%" v-for="(item,index) in detailList" v-bind:key="index">
          <div class="cell">{{item.userNum}}</div>
          <div class="cell">{{item.userName}}</div>
          <div v-if="item.arriveStatus == 1" class="cell"><span style="color:#20A9ED">️✔</span></div>
          <div v-else-if="item.arriveStatus == 0" class="cell"><span style="color:#D51024;">✖</span></div>
          <div v-else class="cell"></div>
        </div>
      </div>



    </Modal>
  </div>
</template>

<script>
    import util from "@/libs/util.js";
    export default {
      name: "SignAnalysis",
      data() {
        return {
          search:{
            areaId:'',
            month:'',
            grade:'',
          },


          areaList:[],
          gradeList:[],
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
              title: '班级',
              minWidth: 120,
              key: 'classId',
              align: 'center'
            },

          ],
          tableColumns: [],

          detailList:[],
          classInfo:'',
          dateInfo:'',


          showDetailModel:false,

        }
      },
      methods: {
        dateChange(value){
          this.search.month=this.$moment(value).format("yyyy-MM");
          this.doSearch();
        },
        onChangeGrade(val){
          this.doSearch();
        },
        doSearch(){
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
            month:this.$moment(this.search.month).format('YYYY-MM'),
          }
          if(!this.$Filters.isEmpty(this.search.areaId)){
            params.areaId = this.search.areaId
          }
          if(!this.$Filters.isEmpty(this.search.grade)){
            params.gradeId = this.search.grade
          }
          this.$fetch(this.$api.sign.SIGN_DO_RECORD_LIST_ANALYSIS, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              that.tableList=bodyData;

              that.tableColumns = []
              that.tableColumns = that.tableColumns.concat(that.columns)

              if(that.tableList.length > 0){
                let secList = that.tableList[0].signDateDetailList

                that.tableColumns.splice(that.tableColumns.length-1,1,{
                  title: '班级',
                  key: 'classId',
                  align: 'center',
                  minWidth: 120,
                  render: (h, params) => {
                    let className = params.row.className
                    let sList = params.row.signDateDetailList
                    let totalCnt = sList[0].totalCount
                    return h('div', {style:{padding:'5px',}},[
                      h('div',{
                        // class:'fontColor',
                      },className),
                      h('div',{
                        // class:'fontColor',
                        style:{
                          fontSize:'12px',
                        },
                      },'('+totalCnt+'人)')
                    ]);
                  },
                },)

                for(let i = 0;i<secList.length;i++){
                  let item = secList[i]
                  let dateStr = item.date.substring(5)
                  let weekName = item.weekName

                  that.tableColumns.splice(that.tableColumns.length,0,{
                    title: dateStr,
                    align: 'center',
                    renderHeader: (h, params) => {
                        return h('div',{style:{display:'flex',width:'100%',alignItems:'center',justifyContent:'space-between',backgroundColor:weekName == '周六'||weekName == '周日'?'#E0E0E0':'#FAFAFA',}}, [
                          h('div', {
                            'style':{
                              padding: '8px 0',
                              width:'100%!important',
                              color: weekName == '周六'||weekName == '周日'?'#D51024':'#565656',
                            },
                          }, dateStr),

                        ]);

                    },
                    children: [
                      {
                        title: weekName,
                        key: 'arriveCount',
                        align: 'center',
                        minWidth: 60,
                        renderHeader: (h, params) => {
                          return h('div', {style:{display:'flex',width:'100%',alignItems:'center',justifyContent:'space-between',backgroundColor:weekName == '周六'||weekName == '周日'?'#E0E0E0':'#FAFAFA',}},[
                            h('div', {
                              'style':{
                                'height': '25px',
                                'padding': '3px 0px',
                                width:'100%!important',
                                color: weekName == '周六'||weekName == '周日'?'#D51024':'#565656',
                              }
                            }, weekName)
                          ]);
                        },
                        render: (h, params) => {
                          let totalCount = params.row.signDateDetailList[i].totalCount
                          let normalCount = params.row.signDateDetailList[i].normalCount
                          let absentCount = params.row.signDateDetailList[i].absentCount
                          let date = params.row.signDateDetailList[i].date
                          let className = params.row.classId
                          if(totalCount == normalCount){
                            return h('div', {style:{display:'flex',width:'100%',height:'100%',alignItems:'center',justifyContent:'space-between',backgroundColor:weekName == '周六'||weekName == '周日'?'#E0E0E0':'#ffffff',}},[
                              h('span', {
                                'style':{
                                  'color':'#20A9ED',
                                  width:'100%!important'
                                },
                                on: {
                                  click:e => {
                                    e.stopPropagation();
                                    that.showDetail(className,date)
                                  }
                                }
                              }, '️✔')
                            ]);
                          }else if(normalCount == 0 && absentCount == 0){
                            return h('div', {style:{display:'flex',width:'100%',height:'100%',alignItems:'center',justifyContent:'space-between',backgroundColor:weekName == '周六'||weekName == '周日'?'#E0E0E0':'#ffffff',}},[
                              h('span', {
                                'style':{
                                  'color':'#20A9ED',
                                  width:'100%!important'
                                }
                              }, '　')
                            ]);
                          }else{

                            return h('div', {style:{display:'flex',width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:weekName == '周六'||weekName == '周日'?'#E0E0E0':'#ffffff',}},[
                              h('span', {
                                'style':{
                                  'color':'#D51024',
                                  'textDecoration':'underline',
                                },
                                on: {
                                  click:e => {
                                    e.stopPropagation();
                                    that.showDetail(className,date)
                                  }
                                }
                              }, absentCount),
                              h('span', {

                              }, '/'),
                              h('span', {
                                'style':{
                                  'color':'#20A9ED',
                                  'textDecoration':'underline',
                                },
                                on: {
                                  click:e => {
                                    e.stopPropagation();
                                    that.showDetail(className,date)
                                  }
                                }
                              }, normalCount)
                            ]);
                          }
                        }
                      },
                    ],

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


        showDetail(className,date){
          this.classInfo = className
          this.dateInfo = date
          this.getDetailList(className,date)
          this.showDetailModel = true
        },

        cancelDetailModal(){
          this.classInfo = ''
          this.dateInfo = ''
          this.showDetailModel = false
        },


        getDetailList(classId,date){
          let that = this
          this.$load.show();
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId") ,
            areaId: this.search.areaId,
            gradeId: this.search.grade,
            classId: classId,
            date: this.$moment(date).format('YYYY-MM-DD'),
          }
          this.$fetch(this.$api.sign.SIGN_DO_RECORD_LIST_ANALYSIS_DETAIL, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              that.detailList=bodyData;

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


        doExport(){
          this.$load.show();
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId") ,
            month:this.$moment(this.search.month).format('YYYY-MM'),
          }
          if(!this.$Filters.isEmpty(this.search.areaId)){
            params.areaId = this.search.areaId
          }
          if(!this.$Filters.isEmpty(this.search.grade)){
            params.gradeId = this.search.grade
          }

          this.$fetchBlob(this.$api.sign.SIGN_DO_RECORD_LIST_ANALYSIS_EXPORT, params).then((res)=> {
            if (res.status == 200) {
              console.log(res);
              // const fileName = res.headers["content-disposition"].split('=')[1];
              const fileName = '入校登记统计报表.xlsx';
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
        this.search.month = this.$moment(new Date()).format("yyyy-MM");
        this.gradeList = util.getLocal("grades");
        if(this.gradeList.length > 0){
           this.search.grade = this.gradeList[0].code
        }
        this.getAreaList();

      },
    }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-table{
    @media screen and (max-height: 1800px) and (orientation: landscape){
      height: calc(89vh + 20px)!important;
    }
    @media screen and (max-height: 1200px) and (orientation: landscape){
      height: calc(84vh + 10px)!important;
    }
    @media screen and (max-height: 1080px) and (orientation: landscape){
      height: calc(82vh + 15px)!important;
    }
    @media screen and (max-height: 1024px) and (orientation: landscape){
      height: calc(81vh + 15px)!important;
    }
    @media screen and (max-height: 900px) and (orientation: landscape){
      height: calc(79vh + 10px)!important;
    }
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(76vh + 5px)!important;
    }
  }


  @{deep}.ivu-table-header th {
    //background-color: #00ff00!important;
    padding: 0!important;
  }
  @{deep}.ivu-table-cell{
    padding-left: 0!important;
    padding-right: 0!important;
    width: 100% !important;
    height: 100% !important;
    display:flex;
    align-items: center;
    justify-content:center;
  }


  .cell{
    display: flex;flex: 1;justify-content: center;align-items: center;height: 45px;
    color:#333333;border: 1px solid #dedede;padding: 5px;width: 100%;background: #ffffff;text-align: center;
  }
  .cell_title{
    display: flex;flex: 1;justify-content: center;align-items: center;height: 45px;
    color:#333333;border: 1px solid #dedede;padding: 5px;width: 100%;background: #F2F2F2;text-align: center;font-weight: bold;
  }
</style>
