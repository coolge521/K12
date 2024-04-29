<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <div style="display: flex;justify-content: flex-start;align-items: center;">

      </div>
      <div style="float: right;display: flex;flex-direction: row;align-items: center;justify-content: flex-end;">
        <DatePicker v-model="search.date"  :editable="false" type="date"   split-panels :options="options"
                    :clearable='false' format="yyyy-MM-dd" style="width: 150px;margin-right: 5px;"
                    placeholder="请选择考勤日期"  @on-change="dateChange"></DatePicker>
        <Select v-model="search.itemId" placeholder="请选择考勤项目" clearable @on-change="onChangeItem"  style="margin-right: 5px;width: 150px;">
          <Option v-for="(item,index) in itemList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <Input clearable v-model="search.taskName" placeholder="输入考勤项目说明关键字"   style="width: 180px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.userName" placeholder="输入人员姓名关键字"   style="width: 180px;margin-right: 5px;"></Input>

        <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doSearch">查询</Button>
        <Button type="primary" style="width: 90px;"  @click="tmpTaskInput">临时考勤</Button>

      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div>
          <i-table border :columns="columns" :data="tableList" :stripe="true" v-show="!($Filters.isShowNoDataView(tableList,this))" @on-row-click=""></i-table>
          <i-table border :columns="columns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(tableList,this)"></i-table>
        </div>
      </i-col>
      <div class="right">
        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page.total" :current="page.current" :page-size="page.size" show-elevator   @on-change='pageChanged'  class="footclass"/>
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


    <!-- 录入考勤-->
    <Modal
      v-model="showModal"
      ref="modal"
      :title="title"
      :loading="submitLoading"
      :mask-closable="false"
      @on-ok="submit"
      @on-cancel="cancelModal"
      width="720"
      height="800"
      ok-text = '保存'
      cancel-text = '取消'>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <span>考勤项目：　{{staffItemName}}</span>
        <span>项目说明：　{{staffTaskName}}</span>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px 0 5px 0;">
        <div style="display: flex;justify-content: flex-start;align-items: center;">
          批量：已选择　<span style="color:#2FABE9">{{multiSelectedCnt}}</span>人
        </div>
        <div style="float: right;display: flex;flex-direction: row;">
          <Select v-model="multiStatus" placeholder="考勤状态" label-in-value @on-change="" style="width: 100px;margin-right: 5px;">
            <Option v-for="(item,index) in typeArr"
                    :value="item.value"
                    :label="item.label"
                    :key="item.value">
            </Option>
          </Select>
          <Input clearable v-model="multiRemark" placeholder="输入情况说明"   style="width: 120px;margin-right: 5px;"></Input>
          <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doMultiInput">批量录入</Button>
        </div>
      </div>
      <div class='uc-table' style="padding: 5px;" >
        <Table ref="reclist" id="reclist" row-key="id" border :columns="columns1" :data="recUserList" :stripe="true" @on-selection-change="multiSelectChange"></Table>
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

    <!-- 录入临时考勤-->
    <Modal
      v-model="showTempModal"
      ref="modaltmp"
      title="临时考勤"
      :loading="submitLoading1"
      :mask-closable="false"
      @on-ok="submitTemp"
      @on-cancel="cancelTempModal"
      width="720"
      height="800"
      ok-text = '保存'
      cancel-text = '取消'>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考勤日期:</span>
        </div>
        <DatePicker v-model="search.date"  :editable="false" type="date"   split-panels :options="options"
                    :clearable='false' format="yyyy-MM-dd" style="margin-left: 25px;margin-right: 5px;"
                    placeholder="请选择考勤日期"  @on-change="tmpDateChange"></DatePicker>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考勤项目:</span>
        </div>
        <Select v-model="tmpItemId" placeholder="请选择考勤项目" label-in-value  @on-change="tmpItemChange"  style="margin-left: 25px;margin-right: 5px;">
          <Option v-for="(item,index) in itemList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
            {{item.name}}
          </Option>
        </Select>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">项目说明:</span>
        </div>
        <Input type="text" v-model="tmpTaskName" placeholder="请输入项目说明" maxlength="100" style="display: flex;flex: 1;margin-right: 5px;">
        </Input>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">被考勤人:</span>
        </div>
        <div style="display: flex;justify-content: flex-end;align-items: center;">
          已选择　<span style="color:#2FABE9">{{selectedCnt}}</span>人
          <Button type="primary" style="width:90px;margin: 0px 5px 0px 10px"  @click="tmpAddEmployees">添加</Button>
        </div>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px 0 5px 0;">
        <div style="display: flex;justify-content: flex-start;align-items: center;">
          批量：已选择　<span style="color:#2FABE9">{{multiSelectedCnt}}</span>人
        </div>
        <div style="float: right;display: flex;flex-direction: row;">
          <Select v-model="multiStatus" placeholder="考勤状态" label-in-value @on-change="" style="width: 100px;margin-right: 5px;">
            <Option v-for="(item,index) in typeArr"
                    :value="item.value"
                    :label="item.label"
                    :key="item.value">
            </Option>
          </Select>
          <Input clearable v-model="multiRemark" placeholder="输入情况说明"   style="width: 120px;margin-right: 5px;"></Input>
          <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doTmpMultiInput">批量录入</Button>
        </div>
      </div>
      <div class='uc-table' style="padding: 5px;" >
        <Table ref="tmpReclist" id="tmpReclist" row-key="id" border :columns="columns4" :data="tmpRecUserList" :stripe="true" @on-selection-change="tmpMultiSelectChange"></Table>
      </div>
    </Modal>


    <Modal
      title="选择教工"
      v-model="selectStaffModel"
      ref="modal1"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="selectStaffOk"
      width="800">
      <StaffSelect
        ref="selStaff1"
        :areaChange="true"
        @selectEmployeeItem="selectItem">
      </StaffSelect>
    </Modal>

  </div>
</template>

<script>
  import util from "@/libs/util.js";
  import StaffSelect from '../sysParams/StaffSelect';
    export default {
        name: "AttendanceInputIndex",
        components: {
          StaffSelect,
        },
        data() {
          let that = this
          return {
            search:{
              date:'',
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

            page:{
              current:1,
              size:20,
              total:0,
            },
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
              {
                title: '操作',
                key: 'action',
                minWidth: 60,
                align: 'center',
                render: (h, params) => {
                  let that=this;
                  return h('a', [
                    h('a', {
                      on: {
                        click:e => {
                          e.stopPropagation();
                          that.EditItem(params.index,params.row);
                        }
                      }
                    }, '录入考勤'),
                  ])
                }
              }
            ],
            columns1: [
              {
                type: 'selection',
                width: 40,
                align: 'center',
              },
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
                title: '签到状态',
                key: 'status',
                align: 'center',
                minWidth:60,
                render: (h, params) => {
                  let that = this
                  return h('Select', {
                      props: {
                        value: params.row.status,
                      },
                      on: {
                        'on-change': (e) => {
                          params.row.status= e;
                          setTimeout(function () {
                            that.recUserList[params.index].status=params.row.status;
                          },200)
                        }
                      },
                    },
                    this.typeArr.map(function (item) {
                      return h('Option', {
                        props: {
                          value: item.value,
                          label: item.label
                        }
                      });
                    }),)
                },
              },
              {
                title: '情况说明',
                key: 'remark',
                align: 'center',
                minWidth:120,
                render: (h, params) => {
                  return h('div', [
                    h('Input', {
                      style: {
                        color:"#333333",
                        marginRight:'20px',
                        width:'95%'
                      },
                      props:{
                        value:params.row.remarks,
                        required:false,
                        placeholder:'请输入内容',
                      },
                      on: {
                        input:function (value) {
                          params.row.remarks=value;
                          setTimeout(function () {
                            that.recUserList[params.index].remarks=params.row.remarks;
                          },200)
                        }
                      }
                    })
                  ])
                },
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
                key: 'adminUserName',
                minWidth: 80,
                align: 'center'
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

            showTempModal:false,
            submitLoading1:true,
            tmpItemId:'',
            tmpItemName:'',
            tmpTaskName:'',
            selectedCnt:0,
            tmpDate: '',
            tmpRecUserList:[],
            columns4: [
              {
                type: 'selection',
                width: 40,
                align: 'center',
              },
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
                title: '签到状态',
                key: 'status',
                align: 'center',
                minWidth:60,
                render: (h, params) => {
                  let that = this
                  return h('Select', {
                      props: {
                        value: params.row.status,
                      },
                      on: {
                        'on-change': (e) => {
                          params.row.status= e;
                          setTimeout(function () {
                            that.tmpRecUserList[params.index].status=params.row.status;
                          },200)
                        }
                      },
                    },
                    this.typeArr.map(function (item) {
                      return h('Option', {
                        props: {
                          value: item.value,
                          label: item.label
                        }
                      });
                    }),)
                },
              },
              {
                title: '情况说明',
                key: 'remark',
                align: 'center',
                minWidth:120,
                render: (h, params) => {
                  return h('div', [
                    h('Input', {
                      style: {
                        color:"#333333",
                        marginRight:'20px',
                        width:'95%'
                      },
                      props:{
                        value:params.row.remarks,
                        required:false,
                        placeholder:'请输入内容',
                      },
                      on: {
                        input:function (value) {
                          params.row.remarks=value;
                          setTimeout(function () {
                            that.tmpRecUserList[params.index].remarks=params.row.remarks;
                          },200)
                        }
                      }
                    })
                  ])
                },
              },
              {
                title: '操作',
                key: 'action',
                width: 60,
                align: 'center',
                render: (h, params) => {
                  let that = this
                  let pos = params.row._index
                  return h('a', [
                    h('a', {
                      style: {
                        color: 'red',
                      },
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: '移除',
                            content: '确定移除该人员吗？',
                            width: '400px',
                            okText: '确定',
                            cancelText: '关闭',
                            onOk() {
                              that.tmpRecUserList.splice(pos, 1);
                              that.selectedCnt = that.tmpRecUserList.length
                            }
                          })
                        }
                      }
                    }, '移除')])
                }
              },
            ],

            selectStaffModel:false,
            empSelectList:[],//选择的教职工列表
          }
        },
        methods: {
          dateChange(value){
            this.search.date=this.$moment(value).format("yyyy-MM-DD");
            this.doSearch()
          },
          onChangeItem(value){
            this.search.itemId = value;
            this.doSearch()
          },
          doSearch(){
            this.page.current = 1
            this.getListData()
          },
          pageChanged(page){
            this.page.current = page
            this.getListData()
          },
          getListData() {
            this.$load.show();
            let params = {
              tokenId: this.$util.getSession("token").id,
              userId: this.$util.getSession("memberId"),
              schoolId: this.$util.getLocal("schoolId") ,
              pageNum:this.page.current,
              pageSize:this.page.size,
              date:this.$moment(this.search.date).format('YYYY-MM-DD'),
            }
            if(!this.$Filters.isEmpty(this.search.itemId)){
              params.itemId = this.search.itemId
            }
            if(!this.$Filters.isEmpty(this.search.taskName)){
              params.taskName = this.search.taskName
            }
            if(!this.$Filters.isEmpty(this.search.userName)){
              params.userName = this.search.userName
            }
            this.$fetch(this.$api.staff.STAFF_TASK_DO_RECORD_GET_LIST, params).then((res)=> {

              if (res.code == 200) {
                console.log(res);
                this.$Message.success("请求完成！");
                let bodyData=res.body;
                this.tableList=bodyData.list;
                this.page.current=Number(bodyData.curPage);
                this.page.total=Number(bodyData.totalCount);
                this.page.size=Number(bodyData.pageSize);
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
                adminUserPhone:this.$util.getSession("username"),
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
                  adminUserPhone:this.$util.getSession("username"),
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
          this.search.date = this.$moment(new Date()).format("yyyy-MM-DD");
          this.getItemList();
          this.getListData();

        },
    }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-table{
    background: #ffffff;
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(72vh - 10px)!important;
    }
  }

  #reclist @{deep}.ivu-table{
    background: #ffffff;
    height: 400px!important;
  }


</style>
