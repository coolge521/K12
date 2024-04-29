<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <span></span>
      <div style="float: right;display: flex;flex-direction: row;align-items: center;justify-content: flex-end;">
        <Input v-model="search.date"  placeholder="请选择周" style="width: 220px;margin-right: 5px;"  :readonly="true">
          <Button  slot="append" icon="ios-calendar-outline" @click="chooseWeek"></Button>
        </Input>

        <Select v-model="search.grade" placeholder="请选择年级"  @on-change="onChangeGrade"  style="margin-right: 5px;width: 120px;">
          <Option v-for="(item,index) in gradeList"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
          </Option>
        </Select>
        <Input clearable v-model="search.inClass" placeholder="请输入班级"   style="width: 100px;margin-right: 5px;"></Input>

        <Input clearable v-model="search.content" placeholder="请输入学生姓名"   style="width: 120px;margin-right: 5px;"></Input>

        <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doSearch">查询</Button>
        <Button type="primary" style="width: 90px;"  @click="doExport">导出</Button>

      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div>
          <i-table border :columns="tableColumns" :data="tableList" :stripe="true" v-show="!($Filters.isShowNoDataView(tableList,this))" @on-row-click=""></i-table>
          <i-table border :columns="tableColumns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(tableList,this)"></i-table>
        </div>
      </i-col>
    </Row>


    <!-- 选择周-->
    <Modal
      v-model="showModal"
      ref="modal"
      :title="title"
      :loading="submitLoading"
      :mask-closable="false"
      @on-ok="submitWeek"
      @on-cancel="cancelWeekModal"
      width="400"
      height="250"
      ok-text = '确定'
      cancel-text = '取消'>
      <div style="width: 100%;display: flex;flex-direction: column ;justify-content: space-between;margin-bottom: 5px;background: #ffffff;padding: 5px;">
        <Calendar
          style="height: 100%;"
          ref="Calendar"
          v-on:choseDay="clickDay"
          :markDateMore = "arrDate">
        </Calendar>
        <div>
          <span style="color:#666666;font-size: 16px;margin-right: 10px;">您选择的是：</span>
          <span style="color:#0000ff;font-size: 18px;">{{dateRange[0]}} 至 {{dateRange[1]}}</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>

  import ucApi from "@/libs/ucApi.js";
  import util from "@/libs/util.js";
  import Calendar from 'vue-calendar-component';
  export default {
    name: "SignRecordingIndex",
    components: {
      Calendar,
    },
    data() {
      let that = this
      return {
        search:{
          areaId:'',
          grade:'',
          inClass:'',
          date:'',
          content:'',
        },
        dateRange:[],//选择的周区间
        weekRange:[],//本周区间
        options: {
          disabledDate (date) {
            return date && date.valueOf() > that.$moment(that.$moment().format('YYYY-MM-DD')).valueOf();
          }
        },


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
            title: '学生姓名',
            key: 'userGradeName',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              let stu = params.row.student
              return h('div', [
                h('div',{
                  // class:'fontColor',
                },stu.name)
              ]);
            },
          },
          {
            title: '学号',
            key: 'studentNo',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              let stu = params.row.student
              return h('div', [
                h('div',{
                  // class:'fontColor',
                },stu.studentNo)
              ]);
            },
          },
        ],
        tableColumns: [],
        rgWidth:120,
        rowEdit:[0,0,0,0,0,0,0],
        dataArrs:[[],[],[],[],[],[],[]],

        arrDate:[],
        showModal:false,
        title:'请选择周',
        submitLoading:true,
        obj:{},

      }
    },
    methods: {

      clickDay(data) {
        let that = this
        console.log(data); //选中某天
        let da = this.$moment(data).format("yyyy-MM-DD");
        if(that.$moment(da).valueOf() > that.$moment(that.$moment(that.weekRange[1]).format('YYYY-MM-DD')).valueOf()){
          this.$Message.info("只能选择本周或以前的日期");
          return
        }
        this.dateRange = this.$Filters.getWeekStartAndEndDateByDate(this,da,false)
        let arr = this.$Filters.getWeekDateArr(this,this.dateRange[0])
        this.arrDate = []
        arr.forEach(function (item) {
            that.arrDate.push({
               date:item,
               className: "selected_week"
            })
        })
      },


      onChangeGrade(val){
        this.getListData()
      },
      doSearch(){
        this.getListData()
      },
      getListData() {
        let that = this
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          userId: this.$util.getSession("memberId"),
          collegeId: this.$util.getLocal("schoolId") ,
          startDate:this.$moment(this.dateRange[0]).format('YYYY-MM-DD'),
          endDate:this.$moment(this.dateRange[1]).format('YYYY-MM-DD'),
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
        if(!this.$Filters.isEmpty(this.search.content)){
          params.userName = this.search.content
        }
        this.$fetch(this.$api.sign.SIGN_DO_RECORD_GET_LIST, params).then((res)=> {

          if (res.code == 200) {
            console.log(res);
            this.$Message.success("请求完成！");
            let bodyData=res.body;
            that.tableList=bodyData;
            that.dataArrs = [[],[],[],[],[],[],[]]
            if(that.tableList.length > 0){
              for(let i = 0;i< that.tableList.length; i++){
                 let item = that.tableList[i]
                 let stu = item.student
                 let datali = item.dateList
                 for(let j = 0;j<datali.length; j++){
                   let data = datali[j]
                    that.dataArrs[j].push({
                      arriveDate:data.date,
                      arriveStatus: data.arrive,
                      classId	:stu.inClass,
                      className :stu.inClass,
                      collegeId	:stu.schoolId,
                      gradeId	:stu.gradeCode,
                      gradeName	:stu.gradeName,
                      updateUserId :that.$util.getSession("memberId"),
                      userId :stu.id,
                      userName :stu.name,
                      userNum :stu.studentNo,
                    })
                 }
              }
            }

            that.assembleColumns();
          } else{
            this.$Message.error(res.message);
          }
          this.$load.hide();
        }).catch((err)=>{
          that.tableList = [];
          that.dataArrs = [[],[],[],[],[],[],[]]
          this.$Message.error(err);
          this.$load.hide();
        });
      },


      assembleColumns(){
        let that = this
        that.tableColumns = []
        that.tableColumns = that.tableColumns.concat(that.columns)
        if(that.tableList.length > 0){
          let secList = that.tableList[0].dateList
          for(let i = 0;i<secList.length;i++){
            let item = secList[i]
            let name = that.getWeekDayName(i+1)+'('+item.date.substring(5)+')'
            that.tableColumns.splice(that.tableColumns.length,0,{
              title: name,
              align: 'center',
              renderHeader: (h, params) => {
                if(that.rowEdit[i] == 1){
                  return h('div',{
                    style:{display:'flex',alignItems:'center',justifyContent:'space-between'},
                    attrs:{
                      id:"dayWidth"
                    },
                  }, [
                    h('div', {
                      'style':{
                      },
                    }, name),

                  ]);
                }else{
                  return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between'}}, [
                    h('div', {
                      'style':{
                      },
                    }, name),
                    h('img', {
                      style: {
                        height: '20px',
                        width: '20px',
                        marginLeft:'15px',
                        marginRight:'2px',
                        display:'',
                      },
                      attrs: {
                        src: '../../static/images/edit.png',
                      },
                      on: {
                        click: e => {
                          e.stopPropagation();
                          that.rowEdit[i] = 1
                          that.assembleColumns()

                        }
                      }
                    }),
                  ]);
                }

              },
              children: that.rowEdit[i] == 1?[
                {
                  title: '保存',
                  key: 'save',
                  align: 'center',
                  minWidth: 60,
                  renderHeader: (h, params) => {
                    return h('div', [
                      h('div', {
                        'style':{
                          'minWidth': '60px',
                          'height': '25px',
                          'padding': '3px 0px',
                          'color':'#ffffff',
                          'background':'#86BC3D',
                        },
                        on: {
                          click:e => {
                            e.stopPropagation();
                            that.saveDatas(i);
                          }
                        }
                      }, '保存')
                    ]);
                  },
                  render: (h, params) => {
                    let secLi = params.row.dateList
                    let data = secLi[i].arrive
                    that.rgWidth = document.getElementById('dayWidth').parentElement.parentElement.clientWidth
                    return h('div', [
                      h('RadioGroup', {
                          style: {
                            color:"#333333",
                            display:'flex',
                            flexDirection:'row',
                            zIndex:10,
                            width:that.rgWidth+'px',
                            justifyContent:'space-around',
                          },
                          props:{
                            value:data,
                            required:false,
                          },
                          on: {
                            'on-change': (status) => {
                              that.dataArrs[i][params.index].arriveStatus = status

                             /* setTimeout(function () {
                                that.tableList[params.index].dateList[i].arrive=status;
                              },200)*/
                            }
                          }
                        },[
                          h('Radio',{
                            style: {
                              color:"#20A9ED",
                            },
                            props:{
                              label: '1',
                            }
                          },'已到'),
                          h('Radio',{
                            style: {
                              color:"#D51024",
                            },
                            props:{
                              label: '0',
                            }
                          },'未到')
                        ]
                      )

                    ])
                  }
                },
                {
                  title: '取消',
                  key: 'cancel',
                  align: 'center',
                  minWidth: 60,
                  renderHeader: (h, params) => {
                    return h('div', [
                      h('div', {
                        'style':{
                          'minWidth': '60px',
                          'height': '25px',
                          'padding': '3px 0px',
                          'color':'#ffffff',
                          'background':'#E0E0E0',
                        },
                        on: {
                          click:e => {
                            e.stopPropagation();
                            that.rowEdit[i] = 0
                            that.assembleColumns()
                          }
                        }
                      }, '取消')
                    ]);
                  },
                  /*render: (h, params) => {
                    let secLi = params.row.dateList
                    let stu = params.row.student
                    let data = secLi[i]
                    let arrive = data.arrive
                    return h('div', [
                      h('RadioGroup', {
                          style: {
                            color:"#333333"
                          },
                          props:{
                            value:arrive,
                            required:false,
                          },
                          on: {
                            'on-change': (status) => {
                              that.dataArrs[i][params.index].arriveStatus = status

                              /!*setTimeout(function () {
                                that.tableList[params.index].dateList[i].arrive=status;
                              },200)*!/
                            }
                          }
                        },[
                        h('Radio',{
                          style: {
                            color:"#20A9ED"
                          },
                          props:{
                            label: 1,
                          }
                        },'已到'),
                        // h('Radio',{
                        //   style: {
                        //     color:"#D51024"
                        //   },
                        //   props:{
                        //     label: 0,
                        //   }
                        // },'未到')
                        ]
                      )

                    ])
                  }*/
                },
              ]:[
                {
                  title: '已到',
                  key: 'arriveCount',
                  align: 'center',
                  minWidth: 60,
                  renderHeader: (h, params) => {
                    return h('div', [
                      h('div', {
                        'style':{
                          'minWidth': '60px',
                          'height': '25px',
                          'padding': '3px 0px',
                          'color':'#ffffff',
                          'background':'#20A9ED',
                        }
                      }, '已到('+item.alreadyArriveCount+')')
                    ]);
                  },
                  render: (h, params) => {
                    let secLi = params.row.dateList
                    let data = secLi[i].arrive
                    if(data == 1){
                      return h('div', [
                        h('span', {
                          'style':{
                            'color':'#20A9ED'
                          }
                        }, '️✔')
                      ]);
                    }else{
                      return h('div', [
                        h('span', {
                          'style':{
                            'color':'#20A9ED'
                          }
                        }, '　')
                      ]);
                    }
                  }
                },
                {
                  title: '未到',
                  key: 'notArriveCount',
                  align: 'center',
                  minWidth: 60,
                  renderHeader: (h, params) => {
                    return h('div', [
                      h('div', {
                        'style':{
                          'minWidth': '60px',
                          'height': '25px',
                          'padding': '3px 0px',
                          'color':'#ffffff',
                          'background':'#D51024',
                        }
                      }, '未到('+item.notArriveCount+')')
                    ]);
                  },
                  render: (h, params) => {
                    let secLi = params.row.dateList
                    let data = secLi[i].arrive
                    if(data == 0){
                      return h('div', [
                        h('span', {
                          'style':{
                            'color':'#D51024'
                          }
                        }, '️✔'),
                      ]);
                    }else{
                      return h('div', [
                        h('span', {
                          'style':{
                            'color':'#D51024'
                          }
                        }, '　')
                      ]);
                    }
                  }
                },
              ],

            },)
          }

        }
      },


      chooseWeek(){
        this.showModal = true;
      },
      submitWeek(){
        this.search.date = this.dateRange[0]+' - '+this.dateRange[1]
        this.getListData()
        this.showModal = false;
      },
      cancelWeekModal(){
        this.showModal = false;
      },


      saveDatas(index){
        this.$load.show();
        let vo = {
          schoolSignRecords: this.dataArrs[index],
        }
        this.rowEdit[index] = 0
        this.Update(vo);
      },


      Update(item){
        let that = this
        this.$post(this.$api.sign.SIGN_DO_RECORD_INSERT_RECORD, {
          tokenId: this.$util.getSession("token").id,
          userId: this.$util.getSession("memberId"),
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');
            that.getListData();
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

      doExport(){
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          userId: this.$util.getSession("memberId"),
          collegeId: this.$util.getLocal("schoolId") ,
          startDate:this.$moment(this.dateRange[0]).format('YYYY-MM-DD'),
          endDate:this.$moment(this.dateRange[1]).format('YYYY-MM-DD'),
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
        if(!this.$Filters.isEmpty(this.search.content)){
          params.userName = this.search.content
        }

        this.$fetchBlob(this.$api.sign.SIGN_DO_RECORD_LIST_EXPORT, params).then((res)=> {
          if (res.status == 200) {
            console.log(res);
            // const fileName = res.headers["content-disposition"].split('=')[1];
            const fileName = '入校登记报表.xlsx';
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

      getWeekDayName(week){
        switch (week) {
          case 1:
            return '星期一'
          case 2:
            return '星期二'
          case 3:
            return '星期三'
          case 4:
            return '星期四'
          case 5:
            return '星期五'
          case 6:
            return '星期六'
          case 7:
            return '星期日'
        }
      },

      getGradeList() {
        let that = this
        let params = {
          tokenId: this.$util.getSession("token").id,
          userId: this.$util.getSession("memberId"),
          collegeId: this.$util.getLocal("schoolId") ,
        }

        this.$fetch(this.$api.sign.SIGN_DO_RECORD_GET_GRADE_LIST, params).then((res)=> {
          if (res.code == 200) {
            console.log(res);
            if(undefined != res.body){
              that.gradeList=res.body;
              if(that.gradeList.length > 0){
                that.search.grade = that.gradeList[0].code
                that.getListData()
              }else{
                // this.$Message.warning('缺少年级数据');
              }
            }else{
              that.gradeList=[];
            }
          }

        }).catch((err)=>{
          that.gradeList = [];
        });
      },



    },
    created() {

    },
    mounted() {
      // this.gradeList = util.getLocal("grades")
      this.search.areaId = util.getSession('user').areaId
      this.getGradeList()

      let date = this.$moment(new Date()).format("yyyy-MM-DD");
      this.dateRange = this.$Filters.getWeekStartAndEndDateByDate(this,date,false)
      this.weekRange = this.$Filters.getWeekStartAndEndDateByDate(this,date,false)
      this.search.date = this.dateRange[0]+' - '+this.dateRange[1]
      let arr = this.$Filters.getWeekDateArr(this,this.dateRange[0])
      this.arrDate = []
      let that = this
      arr.forEach(function (item) {
        that.arrDate.push({
          date:item,
          className: "selected_week"
        })
      })

    },
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-table-cell{
    overflow: visible;
  }

  @{deep}.wh_container {
    max-width: 100%!important;
    /*height: 500px;*/
    .wh_content_all{
      height: 100%;
      >div:nth-of-type(1) {
        height: 40px;
      }
      >div:nth-of-type(2) {
        background-color: #F2F2F2;
        height: 40px;
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
    width: 40px!important;
    height: 40px!important;
  }
  @{deep}.wh_item_date:hover{
    background: #dedede;
    width: 100%;
  }
  @{deep}.wh_top_tag{
    height: 30px!important;
  }
  @{deep}.wh_chose_day{
    background: #F0FAFF!important;
    width: 100%!important;
    border-radius: 0%!important;
  }

  @{deep}.selected_week {
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
    height:40px!important;
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
</style>

