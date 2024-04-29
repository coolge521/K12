<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Tabs @on-click="clickTabs" v-model="curTab" style="background: #ffffff;">
      <TabPane label="按项目查看" name="1" style="background: #f5f5f5;">
        <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
          <div style="display: flex;justify-content: flex-start;align-items: center;">

          </div>
          <div style="float: right;display: flex;flex-direction: row;align-items: center;justify-content: flex-end;">
            <DatePicker v-model="search1.dateRange"  :editable="false" type="daterange"   split-panels :options="options"
                        :clearable='false' format="yyyy-MM-dd" style="width: 220px;margin-right: 5px;"
                        placeholder="请选择考勤日期"  @on-change="dateChange1"></DatePicker>
            <Select v-model="search1.itemId" placeholder="请选择考勤项目" clearable @on-change="onChangeItem1"  style="margin-right: 5px;width: 150px;">
              <Option v-for="(item,index) in itemList"
                      :value="item.id"
                      :label="item.name"
                      :key="item.id">
              </Option>
            </Select>
            <Input clearable v-model="search1.taskName" placeholder="输入考勤项目说明关键字"   style="width: 180px;margin-right: 5px;"></Input>
            <Input clearable v-model="search1.userName" placeholder="输入考核员姓名关键字"   style="width: 180px;margin-right: 5px;"></Input>

            <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doSearch1">查询</Button>

          </div>
        </Row>


      </TabPane>
      <TabPane label="按人员查看" name="2">
        <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
          <div style="display: flex;justify-content: flex-start;align-items: center;">

          </div>
          <div style="float: right;display: flex;flex-direction: row;align-items: center;justify-content: flex-end;">
            <DatePicker v-model="search2.dateRange"  :editable="false" type="daterange"   split-panels :options="options"
                        :clearable='false' format="yyyy-MM-dd" style="width: 220px;margin-right: 5px;"
                        placeholder="请选择考勤日期"  @on-change="dateChange2"></DatePicker>
            <Select v-model="search2.itemId" placeholder="请选择考勤项目" clearable @on-change="onChangeItem2"  style="margin-right: 5px;width: 150px;">
              <Option v-for="(item,index) in itemList"
                      :value="item.id"
                      :label="item.name"
                      :key="item.id">
              </Option>
            </Select>
            <Input clearable v-model="search2.taskName" placeholder="输入考勤项目说明关键字"   style="width: 180px;margin-right: 5px;"></Input>
            <Input clearable v-model="search2.userName" placeholder="输入人员姓名关键字"   style="width: 180px;margin-right: 5px;"></Input>

            <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doSearch2">查询</Button>

          </div>
        </Row>

      </TabPane>
    </Tabs>
    <Row v-if="curTab == '1'">
      <i-col span='24'>
        <div>
          <i-table border :columns="columns" :data="tableList1" :stripe="true" v-show="!($Filters.isShowNoDataView(tableList1,this))" @on-row-click=""></i-table>
          <i-table border :columns="columns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(tableList1,this)"></i-table>
        </div>
      </i-col>
      <div class="right">
        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page1.total" :current="page1.current" :page-size="page1.size" show-elevator   @on-change='pageChanged1'  class="footclass"/>
      </div>
    </Row>

    <Row v-if="curTab == '2'">
      <i-col span='24'>
        <div>
          <i-table border :columns="columns1" :data="tableList2" :stripe="true" v-show="!($Filters.isShowNoDataView(tableList2,this))" @on-row-click=""></i-table>
          <i-table border :columns="columns1" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(tableList2,this)"></i-table>
        </div>
      </i-col>
      <div class="right">
        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page2.total" :current="page2.current" :page-size="page2.size" show-elevator   @on-change='pageChanged2'  class="footclass"/>
      </div>
    </Row>


    <Modal
      title="被考勤人列表"
      v-model="showEmpModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      width="800">
      <div class='uc-table' style="padding: 3px;" >
        <Table row-key="id" border :columns="columns2" :data="showEmpList" :stripe="true" @on-selection-change=""></Table>
      </div>
    </Modal>

    <!-- 记录列表-->
    <Modal
      :title="recTitle"
      v-model="showRecModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      width="800">
      <div class='uc-table' style="padding: 3px;" >
        <Table row-key="id" border :columns="columns3" :data="showRecList" :stripe="true" @on-selection-change=""></Table>
      </div>
    </Modal>
  </div>
</template>

<script>
    import util from "@/libs/util.js";
    export default {
      name: "AttendanceAnalysis",
      data() {
        let that = this
        return {
          curTab:'1',
          search1:{
            dateRange:[],
            itemId:'',
            taskName:'',
            userName:'',
          },
          search2:{
            dateRange:[],
            itemId:'',
            taskName:'',
            userName:'',
          },
          options: {
            disabledDate (date) {
              return date && date.valueOf() > that.$moment(that.$moment().format('YYYY-MM-DD')).valueOf();
            }
          },
          itemList:[],

          page1:{
            current:1,
            size:20,
            total:0,
          },
          page2:{
            current:1,
            size:20,
            total:0,
          },
          tableList1:[],
          tableList2:[],
          columns: [
            {
              title: '序号',
              key: 'id',
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '考勤项目',
              key: 'itemName',
              minWidth: 100,
              align: 'center'
            },
            {
              title: '项目说明',
              key: 'taskName',
              minWidth: 100,
              align: 'center'
            },
            {
              title: '考勤员',
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                if (params.row.adminUserName == null && params.row.adminUserPhone == null) {
                  return h('div', [
                    h('div', {
                      // class:'fontColor',
                    }, '无')
                  ]);
                } else {
                  return h('div', [
                    h('div', {
                      // class:'fontColor',
                    }, params.row.adminUserName + ((params.row.adminUserPhone != null) ? '-' + params.row.adminUserPhone : ""))
                  ]);
                }

              },
            },
            {
              title: '被考勤人员',
              key: 'userList',
              align: 'center',
              minWidth: 70,
              render: (h, params) => {
                let that=this;
                let userList = params.row.userList
                if(that.$Filters.isEmpty(userList)|| userList.length == 0){
                  return h('div', [
                    h('span',{},'0人')
                  ]);
                }else{
                  return h('div', [
                    h('a',{
                      class:'fontColor',
                      style:{
                        textDecoration:'underline'
                      },
                      on: {
                        click:e => {
                          e.stopPropagation();
                          that.showStaffs(params.row);
                        }
                      }
                    },userList.length+'人')
                  ]);
                }
              }
            },
            {
              title: '正常(人)',
              key: 'normal',
              align: 'center',
              minWidth: 70,
              render: (h, params) => {
                let that=this;
                let userList = params.row.normalRecords
                if(that.$Filters.isEmpty(userList)|| userList.length == 0){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },0),
                  ]);
                }else{
                  return h('div', [
                    h('a',{
                      class:'fontColor',
                      style:{
                        textDecoration:'underline'
                      },
                      on: {
                        click:e => {
                          e.stopPropagation();
                          that.showRecs(params.row,0);
                        }
                      }
                    },userList.length)
                  ]);
                }
              }
            },
            {
              title: '迟到(人)',
              key: 'late',
              align: 'center',
              minWidth: 70,
              render: (h, params) => {
                let that=this;
                let userList = params.row.lateRecords
                if(that.$Filters.isEmpty(userList)|| userList.length == 0){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },0),
                  ]);
                }else{
                  return h('div', [
                    h('a',{
                      class:'fontColor',
                      style:{
                        textDecoration:'underline'
                      },
                      on: {
                        click:e => {
                          e.stopPropagation();
                          that.showRecs(params.row,1);
                        }
                      }
                    },userList.length)
                  ]);
                }
              }
            },
            {
              title: '早退(人)',
              key: 'normal',
              align: 'center',
              minWidth: 70,
              render: (h, params) => {
                let that=this;
                let userList = params.row.earlyRecords
                if(that.$Filters.isEmpty(userList)|| userList.length == 0){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },0),
                  ]);
                }else{
                  return h('div', [
                    h('a',{
                      class:'fontColor',
                      style:{
                        textDecoration:'underline'
                      },
                      on: {
                        click:e => {
                          e.stopPropagation();
                          that.showRecs(params.row,2);
                        }
                      }
                    },userList.length)
                  ]);
                }
              }
            },
            {
              title: '未到(人)',
              key: 'absent',
              align: 'center',
              minWidth: 70,
              render: (h, params) => {
                let that=this;
                let userList = params.row.absentRecords
                if(that.$Filters.isEmpty(userList)|| userList.length == 0){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },0),
                  ]);
                }else{
                  return h('div', [
                    h('a',{
                      class:'fontColor',
                      style:{
                        textDecoration:'underline'
                      },
                      on: {
                        click:e => {
                          e.stopPropagation();
                          that.showRecs(params.row,3);
                        }
                      }
                    },userList.length)
                  ]);
                }
              }
            },
          ],
          columns1: [
            {
              title: '序号',
              key: 'id',
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '姓名',
              key: 'userName',
              align: 'center',
              minWidth:90,
            },
            {
              title: '考勤项目',
              key: 'itemName',
              align: 'center',
              minWidth:70,
            },
            {
              title: '项目说明',
              key: 'taskName',
              align: 'center',
              minWidth:90,
            },
            {
              title: '到岗情况',
              key: 'status',
              minWidth: 80,
              align: 'center',
              render: (h, params) => {
                let status = ''
                let color = '#999999'
                switch (params.row.status) {
                  case 0:
                    status = '正常'
                    color = '#75B321'
                    break;
                  case 1:
                    status = '迟到'
                    color = '#ff0000'
                    break;
                  case 2:
                    status = '早退'
                    color = '#F97341'
                    break;
                  case 3:
                    status = '未到'
                    color = '#999999'
                    break;
                }
                return h('div', [
                  h('div',{
                    'style':{
                      'color':color
                    }
                  },status)
                ]);
              },
            },
            {
              title: '情况说明',
              key: 'remarks',
              minWidth: 100,
              align: 'center',
              render: (h, params) => {
                if(this.$Filters.isEmpty(params.row.remarks)){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },'无')
                  ]);
                }else{
                  return h('div', [
                    h('div',{

                    },params.row.remarks)
                  ]);
                }
              },
            },
            {
              title: '考勤员',
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                if (params.row.adminUserName == null && params.row.adminUserPhone == null) {
                  return h('div', [
                    h('div', {
                      // class:'fontColor',
                    }, '无')
                  ]);
                } else {
                  return h('div', [
                    h('div', {
                      // class:'fontColor',
                    }, params.row.adminUserName + ((params.row.adminUserPhone != null) ? '-' + params.row.adminUserPhone : ""))
                  ]);
                }

              },
            },
            {
              title: '考勤录入时间',
              key: 'createTime',
              minWidth: 130,
              align: 'center'
            },
          ],
          columns2: [
            {
              title: '序号',
              key: 'id',
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '姓名',
              key: 'userName',
              align: 'center',
              minWidth:90,
            },
            {
              title: '手机号',
              align: 'center',
              minWidth:90,
              render: (h, params) => {
                if(params.row.userPhone == null){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },'无')
                  ]);
                }else{
                  return h('div', [
                    h('div',{
                      class:'fontColor',
                      style:{
                        textDecoration:'underline'
                      },
                    },params.row.userPhone)
                  ]);
                }

              },
            },
            {
              title: '部门',
              key: 'title',
              align: 'center',
              minWidth:90,
            },
          ],
          columns3: [
            {
              title: '序号',
              key: 'id',
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '姓名',
              key: 'userName',
              align: 'center',
              minWidth:90,
            },
            {
              title: '手机号',
              align: 'center',
              minWidth:90,
              render: (h, params) => {
                if(params.row.userPhone == null){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },'无')
                  ]);
                }else{
                  return h('div', [
                    h('div',{
                      class:'fontColor',
                      style:{
                        textDecoration:'underline'
                      },
                    },params.row.userPhone)
                  ]);
                }

              },
            },
            // {
            //   title: '部门',
            //   key: 'title',
            //   align: 'center',
            //   minWidth:90,
            // },
            {
              title: '考勤状态',
              key: 'status',
              minWidth: 80,
              align: 'center',
              render: (h, params) => {
                let status = ''
                switch (params.row.status) {
                  case 0:
                    status = '正常'
                    break;
                  case 1:
                    status = '迟到'
                    break;
                  case 2:
                    status = '早退'
                    break;
                  case 3:
                    status = '未到'
                    break;
                }
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },status)
                ]);
              },
            },
            {
              title: '考勤说明',
              key: 'remarks',
              minWidth: 100,
              align: 'center',
              render: (h, params) => {
                if(this.$Filters.isEmpty(params.row.remarks)){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },'无')
                  ]);
                }else{
                  return h('div', [
                    h('div',{

                    },params.row.remarks)
                  ]);
                }
              },
            },
            {
              title: '考勤员',
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                if (params.row.adminUserName == null && params.row.adminUserPhone == null) {
                  return h('div', [
                    h('div', {
                      // class:'fontColor',
                    }, '无')
                  ]);
                } else {
                  if(params.row.adminUserPhone != null){
                    return h('div', [
                      h('div', {
                        // class:'fontColor',
                      }, params.row.adminUserName),
                      h('div', {
                        // class:'fontColor',
                      }, params.row.adminUserPhone)
                    ]);
                  }else{
                    return h('div', [
                      h('div', {
                        // class:'fontColor',
                      }, params.row.adminUserName + ((params.row.adminUserPhone != null) ? '-' + params.row.adminUserPhone : ""))
                    ]);
                  }
                }

              },
            },
            {
              title: '考勤录入时间',
              key: 'createTime',
              minWidth: 130,
              align: 'center'
            },
          ],

          showEmpModel:false,
          showEmpList:[],//显示被考勤人列表

          showModal:false,
          title:'',
          submitLoading:true,
          obj:{},

          curStaffItem:{},
          staffItemName:'',
          staffTaskName:'',
          typeArr:[
            {
              value:0,
              label:'正常',
            },
            {
              value:1,
              label:'迟到',
            },
            {
              value:2,
              label:'早退',
            },
            {
              value:3,
              label:'未到',
            },
          ],
          multiStatus:-1,
          multiRemark:'',
          multiSelection:[],
          multiSelectedCnt:0,
          recUserList:[],

          showRecModel:false,
          recTitle:'',
          showRecList:[],//显示考勤记录列表

        }
      },
      methods: {
        clickTabs(item){
          switch (item) {
            case '1':

              console.log('1')
              return
            case '2':

              return
          }
        },
        dateChange1(value){
          this.doSearch1()
        },
        onChangeItem1(value){
          this.search1.itemId = value;
          this.doSearch1()
        },
        doSearch1(){
          this.page1.current = 1
          this.getListData1()
        },
        pageChanged1(page){
          this.page1.current = page
          this.getListData1()
        },
        getListData1() {
          this.$load.show();
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            schoolId: this.$util.getLocal("schoolId") ,
            pageNum:this.page1.current,
            pageSize:this.page1.size,
            startDate:this.$moment(this.search1.dateRange[0]).format('YYYY-MM-DD'),
            endDate:this.$moment(this.search1.dateRange[1]).format('YYYY-MM-DD'),
          }
          if(!this.$Filters.isEmpty(this.search1.itemId)){
            params.itemId = this.search1.itemId
          }
          if(!this.$Filters.isEmpty(this.search1.taskName)){
            params.taskName = this.search1.taskName
          }
          if(!this.$Filters.isEmpty(this.search1.userName)){
            params.userName = this.search1.userName
          }
          this.$fetch(this.$api.staff.STAFF_TASK_ANALYSIS_BY_ITEM, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              this.tableList1=bodyData.list;
              this.page1.current=Number(bodyData.curPage);
              this.page1.total=Number(bodyData.totalCount);
              this.page1.size=Number(bodyData.pageSize);
            } else{
              this.$Message.error(res.message);
            }
            this.$load.hide();
          }).catch((err)=>{
            this.tableList1 = [];
            this.$Message.error(err);
            this.$load.hide();
          });
        },


        dateChange2(value){
          this.doSearch2()
        },
        onChangeItem2(value){
          this.search2.itemId = value;
          this.doSearch2()
        },
        doSearch2(){
          this.page2.current = 1
          this.getListData2()
        },
        pageChanged2(page){
          this.page2.current = page
          this.getListData2()
        },
        getListData2() {
          this.$load.show();
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            schoolId: this.$util.getLocal("schoolId") ,
            pageNum:this.page2.current,
            pageSize:this.page2.size,
            startDate:this.$moment(this.search2.dateRange[0]).format('YYYY-MM-DD'),
            endDate:this.$moment(this.search2.dateRange[1]).format('YYYY-MM-DD'),
          }
          if(!this.$Filters.isEmpty(this.search2.itemId)){
            params.itemId = this.search2.itemId
          }
          if(!this.$Filters.isEmpty(this.search2.taskName)){
            params.taskName = this.search2.taskName
          }
          if(!this.$Filters.isEmpty(this.search2.userName)){
            params.userName = this.search2.userName
          }
          this.$fetch(this.$api.staff.STAFF_TASK_ANALYSIS_BY_PEOPLE, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              this.tableList2=bodyData.list;
              this.page2.current=Number(bodyData.curPage);
              this.page2.total=Number(bodyData.totalCount);
              this.page2.size=Number(bodyData.pageSize);
            } else{
              this.$Message.error(res.message);
            }
            this.$load.hide();
          }).catch((err)=>{
            this.tableList2 = [];
            this.$Message.error(err);
            this.$load.hide();
          });
        },

        showStaffs(item){
          this.showEmpList = item.userList
          this.showEmpModel = true;
        },


        showRecs(item,type){
          let typeName = ''
          switch(type){
            case 0:
              this.showRecList = item.normalRecords
              typeName = '正常'
              break;
            case 1:
              this.showRecList = item.lateRecords
              typeName = '迟到'
              break;
            case 2:
              this.showRecList = item.earlyRecords
              typeName = '早退'
              break;
            case 3:
              this.showRecList = item.absentRecords
              typeName = '未到'
              break;
          }
          this.recTitle = item.itemName+'　-　'+typeName
          this.showRecModel = true;
        },

        doMultiInput(){
          if(this.multiSelection.length == 0){
            this.$Message.error("请选择人员");
            return
          }
          if(this.multiStatus == -1 || this.multiStatus == undefined){
            this.$Message.error("请选择考勤状态");
            return
          }
          for(let i = 0;i<this.recUserList.length;i++){
            let rec = this.recUserList[i]
            for(let j = 0;j<this.multiSelection.length;j++) {
              let sel = this.multiSelection[j]
              if(rec.userId == sel.userId){
                rec.status = this.multiStatus
                if(!this.$Filters.isEmpty(this.multiRemark)){
                  rec.remarks = this.multiRemark
                }
              }
            }
          }
          this.multiSelection = []
          this.multiSelectedCnt = 0
          this.multiStatus = -1
          this.multiRemark = ''
          this.$refs.reclist.selectAll(false)
          console.log('--'+this.recUserList)
        },

        multiSelectChange(selection){
          this.multiSelection = selection
          this.multiSelectedCnt = selection.length
        },


        EditItem(index,item){
          this.multiSelection = []
          this.recUserList = []
          let ulist = JSON.parse(JSON.stringify(item.userList))
          let allRecs = []
          allRecs = allRecs.concat(item.normalRecords,item.lateRecords,item.earlyRecords,item.absentRecords)
          for(let i = 0;i< ulist.length;i++){
            let uu = ulist[i]
            let data = {
              adminUserId:this.$util.getSession("memberId"),
              adminUserName:this.$util.getSession("user").name,
              date:this.$moment(this.search.date).format('YYYY-MM-DD'),
              itemId:item.itemId,
              itemName:item.itemName,
              taskId:item.taskId,
              taskName:item.taskName,
              status:-1,
              remarks:'',
              userId:uu.userId,
              userName:uu.userName,
              userPhone:uu.userPhone,
            }
            for(let j = 0; j<allRecs.length;j++){
              let rec = allRecs[j]
              if(uu.userId == rec.userId){
                data.id = rec.id
                data.status = rec.status
                data.remarks = rec.remarks
                data.type = rec.type
              }

            }
            this.recUserList.push(data)
          }

          this.staffItemName = item.itemName
          this.staffTaskName = item.taskName
          this.multiStatus = -1
          this.multiRemark = ''
          this.multiSelection = []
          this.multiSelectedCnt = 0
          this.title = '录入考勤'
          this.showModal = true;
        },



        submit(){
          console.log('--'+this.recUserList)
          let submitRecs = []
          for(let i = 0;i<this.recUserList.length;i++){
            let rec = this.recUserList[i]
            if(rec.status != -1){
              submitRecs.push(rec)
            }
          }
          let vo = {
            recordList: submitRecs,
          }

          this.Update(vo);
          this.showModal = false;
        },


        Update(item){
          let that = this
          this.$post(this.$api.staff.STAFF_TASK_DO_RECORD_MULTI_INSERT, {
            tokenId: this.$util.getSession("token").id,
            // userId: this.$util.getSession("memberId"),
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

        cancelModal(){
          this.showModal = false;
        },


        tmpTaskInput(){
          this.tmpDate = this.$moment(new Date()).format("yyyy-MM-DD")
          this.tmpItemId = ''
          this.tmpItemName = ''
          this.tmpTaskName = ''
          this.multiSelection = []
          this.multiSelectedCnt = 0
          this.empSelectList = []
          this.tmpRecUserList = []
          this.showTempModal=true;
        },

        doTmpMultiInput(){
          if(this.multiSelection.length == 0){
            this.$Message.error("请选择人员");
            return
          }
          if(this.multiStatus == -1 || this.multiStatus == undefined){
            this.$Message.error("请选择考勤状态");
            return
          }
          for(let i = 0;i<this.tmpRecUserList.length;i++){
            let rec = this.tmpRecUserList[i]
            for(let j = 0;j<this.multiSelection.length;j++) {
              let sel = this.multiSelection[j]
              if(rec.userId == sel.userId){
                rec.status = this.multiStatus
                if(!this.$Filters.isEmpty(this.multiRemark)){
                  rec.remarks = this.multiRemark
                }
              }
            }
          }
          this.multiSelection = []
          this.multiSelectedCnt = 0
          this.multiStatus = -1
          this.multiRemark = ''
          this.$refs.tmpReclist.selectAll(false)
          console.log('--'+this.tmpRecUserList)
        },

        tmpMultiSelectChange(selection){
          this.multiSelection = selection
          this.multiSelectedCnt = selection.length
        },

        tmpDateChange(value){
          this.tmpDate=this.$moment(value).format("yyyy-MM-DD");
        },

        tmpItemChange(value){
          this.tmpItemId=value.value;
          this.tmpItemName=value.label;
        },

        tmpAddEmployees(){
          let sel = []
          if(this.tmpRecUserList.length > 0){
            this.tmpRecUserList.forEach(function (item) {
              sel.push(item.userId)
            })
          }
          this.$refs.selStaff1.selList = sel
          this.$refs.selStaff1.getListData()
          this.selectStaffModel = true
        },

        selectStaffOk(){
          this.$refs.selStaff1.emitSelectEmployee();
          let newArr = []
          for(let i = 0;i<this.empSelectList.length;i++){
            let emp = this.empSelectList[i]
            let has = false
            for(let j = 0;j<this.tmpRecUserList.length;j++){
              let lemp = this.tmpRecUserList[j]
              if(emp.id == lemp.userId){
                has = true;
              }
            }
            if(!has){
              newArr.push({
                adminUserId:this.$util.getSession("memberId"),
                adminUserName:this.$util.getSession("user").name,
                date:this.$moment(this.tmpDate).format('YYYY-MM-DD'),
                itemId:this.tmpItemId,
                itemName:this.tmpItemName,
                taskName:this.tmpTaskName,
                type:1,//临时考勤
                status:-1,
                remarks:'',
                userId:emp.id,
                userName:emp.name,
                userPhone:emp.phone,
                // title:emp.orgName,
              })
            }
          }
          if(newArr.length > 0){
            this.tmpRecUserList = this.tmpRecUserList.concat(newArr)
            console.log('newAdd==='+newArr.length)
          }
          this.selectedCnt = this.tmpRecUserList.length
        },


        selectItem(item){
          this.empSelectList = item;
        },


        submitTemp(){
          if(this.$Filters.isEmpty(this.tmpItemId)){
            this.$Message.error("请选择考勤项目");
            this.$refs.modaltmp.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.tmpTaskName)){
            this.$Message.error("请输入项目说明");
            this.$refs.modaltmp.buttonLoading=false;
            return;
          }
          if(this.tmpRecUserList.length == 0){
            this.$Message.error("请选择被考勤人");
            this.$refs.modaltmp.buttonLoading=false;
            return;
          }

          console.log('--'+this.tmpRecUserList)
          let submitRecs = []
          for(let i = 0;i<this.tmpRecUserList.length;i++){
            let rec = this.tmpRecUserList[i]
            if(rec.status != -1){
              rec.date = this.$moment(this.tmpDate).format('YYYY-MM-DD')
              rec.itemId = this.tmpItemId
              rec.itemName = this.tmpItemName
              rec.taskName = this.tmpTaskName
              submitRecs.push(rec)
            }else{
              this.$Message.error("请选择"+rec.userName+"的考勤状态");
              this.$refs.modaltmp.buttonLoading=false;
              return
            }
          }
          let vo = {
            recordList: submitRecs,
          }

          this.Update(vo);
          this.showTempModal = false;
        },

        cancelTempModal(){
          this.showTempModal = false;
        },


        getItemList() {
          let that = this
          let params = {
            tokenId: util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            schoolId: util.getLocal("schoolId"),
            useStatus:1,
          }

          this.$fetch(this.$api.staff.STAFF_ALL_ITEM_LIST, params).then((res)=> {
            if (res.code == 200) {
              console.log(res);
              if(undefined != res.body){
                that.itemList=res.body;
              }else{
                that.itemList=[];
              }
            }

          }).catch((err)=>{
            that.itemList = [];
          });
        },
      },
      created() {

      },
      mounted() {
        this.search1.dateRange = this.$Filters.getCurrentMonthStartAndEndDate(this,true);
        this.search2.dateRange = this.$Filters.getCurrentMonthStartAndEndDate(this,true);
        this.getItemList();
        this.getListData1();
        this.getListData2();

      },
    }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-tabs-bar{
     margin-bottom: 0;
  }
  @{deep}.ivu-table{
    @media screen and (max-height: 1800px) and (orientation: landscape){
      height: calc(85vh - 20px )!important;
    }
    @media screen and (max-height: 1200px) and (orientation: landscape){
      height: calc(80vh - 35px )!important;
    }
    @media screen and (max-height: 1080px) and (orientation: landscape){
      height: calc(78vh - 40px)!important;
    }
    @media screen and (max-height: 1024px) and (orientation: landscape){
      height: calc(76vh - 56px )!important;
    }
    @media screen and (max-height: 900px) and (orientation: landscape){
      height: calc(74vh - 45px )!important;
    }
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(70vh - 50px )!important;
    }
  }

  #reclist @{deep}.ivu-table{
    background: #ffffff;
    height: 400px!important;
  }


</style>
