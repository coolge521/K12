<template>
  <div style="padding: 20px;background: #f5f6f7;">
    <Row style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" @click="add">+添加</Button>
      <div style="float: right">
        <Select v-model="search.itemId" placeholder="请选择考勤项目" clearable @on-change="onChangeItem"  style="margin-right: 5px;width: 150px;">
          <Option v-for="(item,index) in itemList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <Input clearable v-model="search.taskName" placeholder="输入考勤项目说明关键字"   style="width: 180px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.userName" placeholder="输入人员姓名关键字"   style="width: 180px;margin-right: 5px;"></Input>
        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="doSearch">查询</Button>
      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div>
          <i-table border :columns="columns" :data="list" :stripe="true" ></i-table>
        </div>
      </i-col>
      <div class="right">
        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page.total" :current="page.current" :page-size="page.size" show-elevator   @on-change='pageChanged'  class="footclass"/>
      </div>
    </Row>

    <Modal
      v-model="showModal"
      :title="title"
      width="650">
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考勤项目:</span>
        </div>
        <Select v-model="obj.itemId" placeholder="请选择考勤项目"  @on-change=""  style="margin-left: 25px;margin-right: 5px;">
          <Option v-for="(item,index) in itemList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">项目说明:</span>
        </div>
        <Input type="text" v-model="obj.taskName" placeholder="请输入项目说明" maxlength="100" style="display: flex;flex: 1;margin-right: 5px;">
        </Input>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考勤员:</span>
        </div>
        <Input v-model="obj.adminUserName" placeholder="请选择考勤员"  style="width: 160px;margin-top: 5px;margin-right: 5px;" :readonly="true">
          <Button  slot="append" icon="md-add" @click="addPerson"></Button>
        </Input>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">被考勤人:</span>
        </div>
        <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px"  @click="addEmployees">添加</Button>
      </div>
      <div style="background: #ffffff;padding: 3px;">
        <div class='uc-table' >
          <Table id="sublist" row-key="id" border :columns="columns1" :data="empList" :stripe="true" ></Table>
        </div>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考勤周期:</span>
        </div>
        <DatePicker type="daterange" v-model="obj.dateRange" @on-change="dateChange" :editable="false"  placeholder="选择开始日期和结束日期" style="width: 100%;margin-top: 5px;margin-left: 25px;margin-right: 5px;"></DatePicker>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考勤日期:</span>
        </div>
        <div style="display: flex;justify-content: space-between;align-items: center;width: 100%;margin-left: 25px;">
          <Checkbox label="周一" :value="choiceWeek[0] == 1" :disabled="choiceWeekDisable[0]" style="margin-right: 20px;" @on-change="v=>{handleWeekCheckBoxChange(v,0)}">周一</Checkbox>
          <Checkbox label="周二" :value="choiceWeek[1] == 1" :disabled="choiceWeekDisable[1]" style="margin-right: 20px;" @on-change="v=>{handleWeekCheckBoxChange(v,1)}">周二</Checkbox>
          <Checkbox label="周三" :value="choiceWeek[2] == 1" :disabled="choiceWeekDisable[2]" style="margin-right: 20px;" @on-change="v=>{handleWeekCheckBoxChange(v,2)}">周三</Checkbox>
          <Checkbox label="周四" :value="choiceWeek[3] == 1" :disabled="choiceWeekDisable[3]" style="margin-right: 20px;" @on-change="v=>{handleWeekCheckBoxChange(v,3)}">周四</Checkbox>
          <Checkbox label="周五" :value="choiceWeek[4] == 1" :disabled="choiceWeekDisable[4]" style="margin-right: 20px;" @on-change="v=>{handleWeekCheckBoxChange(v,4)}">周五</Checkbox>
          <Checkbox label="周六" :value="choiceWeek[5] == 1" :disabled="choiceWeekDisable[5]" style="margin-right: 20px;" @on-change="v=>{handleWeekCheckBoxChange(v,5)}">周六</Checkbox>
          <Checkbox label="周日" :value="choiceWeek[6] == 1" :disabled="choiceWeekDisable[6]" style="margin-right: 20px;" @on-change="v=>{handleWeekCheckBoxChange(v,6)}">周日</Checkbox>
        </div>
      </div>


      <div slot="footer" >
        <Button type="text" size="large" @click="showModal=false">取消</Button>
        <Button type="primary" size="large" @click="save" :loading="submitLoading">保存</Button>
      </div>
    </Modal>

    <Modal
      title="选择教工"
      v-model="selectRecorderModel"
      ref="modal"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="selectRecorderOk"
      width="800">
      <StaffSelect
        ref="selStaff"
        :areaChange="true"
        @selectEmployeeItem="selectRecorderItem">
      </StaffSelect>
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


    <Modal
      title="被考勤人列表"
      v-model="showEmpModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      width="800">
      <div class='uc-table' style="padding: 3px;" >
        <Table id="emplist" row-key="id" border :columns="columns2" :data="showEmpList" :stripe="true" @on-selection-change=""></Table>
      </div>
      <div class="right">
        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page1.total" :current="page1.current" :page-size="page1.size" show-elevator   @on-change='pageChanged1'  class="footclass"/>
      </div>
    </Modal>
  </div>
</template>

<script>
  import util from "@/libs/util.js";
  import StaffSelect from '../sysParams/StaffSelect'
  export default {
    name: "AttendancePlanIndex",
    components: {
      StaffSelect,
    },
    data() {
      return {
        search:{
          itemId:'',
          taskName:'',
          userName:'',
        },
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
              if(params.row.adminUserName == null && params.row.adminUserPhone == null){
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },'无')
                ]);
              }else{
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },params.row.adminUserName + ((params.row.adminUserPhone != null)?'-' + params.row.adminUserPhone:""))
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
            title: '考勤周期',
            key: 'range',
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              let startDate = this.$moment(params.row.startDate).format('YYYY-MM-DD')
              let endDate = this.$moment(params.row.endDate).format('YYYY-MM-DD')
              return h('span',{
                // class:'numberColor',
              },startDate +' 至 '+endDate)
            }

          },
          {
            title: '考勤日期',
            key: 'weekday',
            minWidth: 80,
            align: 'center',
            render: (h, params) => {
              let that = this
              let str = ''
              let weeks = params.row.weekDays
              if(!this.$Filters.isEmpty(weeks)){
                let arr = weeks.split(',')
                arr.forEach(function (item) {
                   str += that.getWeekDayName(Number(item))+','
                })
                if(str.length > 0){
                  str = str.slice(0,-1)
                }
              }
              return h('span', str)
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('a', [
                h('a', {
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                }, '编辑'),
                h('Divider', {props: {type: 'vertical'}}),
                h('a', {
                  style: {
                    color: 'red',
                  },
                  on: {
                    click: () => {
                      this.deleteById(params.row.id);
                    }
                  }
                }, '删除')])
            }
          }
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
                          if(!that.$Filters.isEmpty(params.row.id)){
                            that.doDeleteEmp(params.row.id,pos)
                          }else{
                            that.empList.splice(pos,1);
                          }
                        }
                      })
                    }
                  }
                }, '移除')])
            }
          }
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
        page:{
          current:1,
          size:20,
          total:0,
        },
        list:[],

        itemList:[],

        obj: {},
        title:'',
        showModal:false,
        submitLoading:false,

        selectRecorderModel:false,
        recorderSelectList:[],//选择的考勤员列表
        selectStaffModel:false,
        empSelectList:[],//选择的教职工列表
        empList:[],//提交的教职工列表
        choiceWeek:[0,0,0,0,0,0,0],//考勤日期  周一~周日
        choiceWeekDisable:[false,false,false,false,false,false,false],//考勤日期  周一~周日

        showEmpModel:false,
        showEmpList:[],//显示被考勤人列表
        page1:{
          current:1,
          size:20,
          total:0,
        },
      }
    },
    computed: {},
    watch: {},
    methods: {
      doSearch(){
        this.page.current = 1
        this.getData()
      },
      pageChanged(page){
        this.page.current = page
        this.getData()
      },
      onChangeItem(value){
        this.search.itemId = value;
        this.doSearch()
      },
      getData(){
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          schoolId: this.$util.getLocal("schoolId") ,
          pageNum:this.page.current,
          pageSize:this.page.size,
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
        this.$fetch(this.$api.staff.STAFF_TASK_PAGE_LIST, params).then((res)=> {
          if (res.code == 200) {
            console.log(res);
            this.$Message.success("请求完成！");
            if(undefined != res.body){
              let bodyData=res.body;
              this.list=bodyData.list;
              this.page.current=Number(bodyData.curPage);
              this.page.total=Number(bodyData.totalCount);
              this.page.size=Number(bodyData.pageSize);
            }else{
              this.list=[];
            }
          } else{
            this.$Message.error(res.message);
          }
          this.$load.hide();
        })
          .catch((err)=>{
            this.$Message.error(err);
            this.$load.hide();
          });
      },

      addPerson(){
        if(!this.$Filters.isEmpty(this.obj.adminUserId)){
          this.$refs.selStaff.selList = [this.obj.adminUserId]
        }else{
          this.$refs.selStaff.selList = []
        }
        this.$refs.selStaff.doSearch()
        this.selectRecorderModel = true
      },

      selectRecorderOk(){
        this.$refs.selStaff.emitSelectEmployee();
        if(this.recorderSelectList.length > 1){
          this.$Message.error('只能选择一个');
          setTimeout(() => {
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          }, 300);
          return
        }
        let res = this.recorderSelectList[0]
        this.obj.adminUserId = res.id
        this.obj.adminUserName = res.name
        this.obj.adminUserPhone = res.phone

      },

      selectRecorderItem(item){
        this.recorderSelectList = item;
      },

      addEmployees(){
        let sel = []
        if(this.empSelectList.length > 0){
          this.empSelectList.forEach(function (item) {
            sel.push(item.id)
          })
        }
        this.$refs.selStaff1.selList = sel
        this.$refs.selStaff1.doSearch()
        this.selectStaffModel = true
      },

      selectStaffOk(){
        this.$refs.selStaff1.emitSelectEmployee();
        let newArr = []
        for(let i = 0;i<this.empSelectList.length;i++){
          let emp = this.empSelectList[i]
          let has = false
          for(let j = 0;j<this.empList.length;j++){
            let lemp = this.empList[j]
            if(emp.id == lemp.userId){
              has = true;
            }
          }
          if(!has){
            newArr.push({
              userId:emp.id,
              userName:emp.name,
              userPhone:emp.phone,
              title:emp.orgName,
            })
          }
        }
        if(newArr.length > 0){
          this.empList = this.empList.concat(newArr)
          console.log('newAdd==='+newArr.length)
        }
      },

      selectItem(item){
        this.empSelectList = item;
      },



      handleWeekCheckBoxChange (v, pos) {
        if (v) {
          this.choiceWeek[pos] = 1
        } else {
          this.choiceWeek[pos] = 0
        }
        let res = ''
        for(let i = 0;i <this.choiceWeek.length;i++){
          if(this.choiceWeek[i] == 1){
             res += (i+1)+','
          }
        }
        if(res.length > 0){
           res = res.slice(0,-1)
        }
        this.obj.weekDays = res
        console.log(this.obj.weekDays)
      },

      getWeekDayName(week){
        switch (week) {
          case 1:
            return '周一'
          case 2:
            return '周二'
          case 3:
            return '周三'
          case 4:
            return '周四'
          case 5:
            return '周五'
          case 6:
            return '周六'
          case 7:
            return '周日'
        }
      },

      dateChange(value){
         this.choiceWeekDisable = [true,true,true,true,true,true,true]
         this.choiceWeek = [0,0,0,0,0,0,0]
         let start = value[0]
         let end = value[1]
         let diff = this.$Filters.getDiffDays(start,end)
         if(diff < 7){
           for(let i = 0; i< diff+1;i++){
            let da= this.$moment(start).add(i, 'day').day()
             if(da == 0){
               this.choiceWeekDisable[6] = false
             }else{
               this.choiceWeekDisable[da - 1] = false
             }
           }
         }else{
           this.choiceWeekDisable = [false,false,false,false,false,false,false]
         }


      },


      add(){
        this.obj={
          id:null,
          taskName:'',
          adminUserId:'',
          adminUserName:'',
          adminUserPhone:'',
          itemId:'',
          schoolId: this.$util.getLocal("schoolId") ,
          userList:[],
          dateRange:[],
          weekDays:'',
        }
        this.choiceWeek = [0,0,0,0,0,0,0]
        this.recorderSelectList = []
        this.empSelectList = []
        this.empList = []
        this.title="新增考勤计划";
        this.showModal=true;
      },


      save(){
        this.submitLoading=true;
        if(this.$Filters.isEmpty(this.obj.itemId)){
          this.$Message.error("请选择考勤项目");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.obj.taskName)){
          this.$Message.error("请输入项目说明");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.obj.adminUserId)){
          this.$Message.error("请选择考勤员");
          this.submitLoading=false;
          return;
        }
        if(this.empList.length == 0){
          this.$Message.error("请选择被考勤人");
          this.submitLoading=false;
          return;
        }
        if(this.obj.dateRange.length == 0 || this.obj.dateRange[0] == '' || this.obj.dateRange[1] == '' ){
          this.$Message.error("请选择考勤周期");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.obj.weekDays)){
          this.$Message.error("请选择考勤日期");
          this.submitLoading=false;
          return;
        }

        let Item = {
          id: this.obj.id,
          schoolId: this.obj.schoolId,
          itemId: this.obj.itemId,
          itemName: this.obj.itemName,
          taskName: this.obj.taskName,
          adminUserId: this.obj.adminUserId,
          adminUserName: this.obj.adminUserName,
          adminUserPhone: this.obj.adminUserPhone,
          userList: this.empList,
          startDate:this.$moment(this.obj.dateRange[0]).format('YYYY-MM-DD'),
          endDate:this.$moment(this.obj.dateRange[1]).format('YYYY-MM-DD'),
          weekDays: this.obj.weekDays,
        }

        if(!this.$Filters.isEmpty(Item.id)){
            this.Update(Item);
        }else{
            this.Insert(Item);
        }
      },

      Insert(item){
        this.$load.show();
        this.$post(this.$api.staff.STAFF_TASK_INSERT, {
          tokenId: util.getSession("token").id,
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');
            this.submitLoading=false;
            this.showModal=false;
            this.getData();
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
            this.submitLoading=false;
          }
        });
      },

      Update(item){
        this.$load.show();
        this.$put(this.$api.staff.STAFF_TASK_UPDATE, {
          tokenId: util.getSession("token").id,
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');
            this.submitLoading=false;
            this.showModal=false;
            this.getData();
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
            this.submitLoading=false;
          }
        });
      },


      deleteById(id){
        var that=this;
        this.$Modal.confirm({
          title: '删除',
          content: '您确定要删除该考勤项目吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          loading:true,
          onOk() {
            this.$delete(this.$api.staff.STAFF_TASK_DELETE, {
              tokenId: this.$util.getSession("token").id,
              id: id
            }).then((res)=> {
              if (res.code == 200) {
                this.$Message.success('成功删除!');
                this.$Modal.remove();
                that.getData();
              }
            });
          }
        })
      },

      doDeleteEmp(id,pos){
        let that = this
        this.$delete(this.$api.staff.STAFF_TASK_DELETE_EMP, {
          tokenId: util.getSession("token").id,
          id: id
        }).then((res)=> {
          if (res.code == 200) {
            this.$Message.success('删除成功');
            that.empList.splice(pos,1);
            that.getListData();
          }else{
            this.$Message.error(res.message);
          }
        });
      },

      edit(row){
        this.title="编辑考勤项目";
        this.obj={
          id:row.id,
          schoolId:row.schoolId,
          itemId:row.itemId,
          itemName:row.itemName,
          taskName:row.taskName,
          adminUserId:row.adminUserId,
          adminUserName:row.adminUserName,
          adminUserPhone:row.adminUserPhone,
          dateRange: [this.$moment(row.startDate).format('YYYY-MM-DD'),this.$moment(row.endDate).format('YYYY-MM-DD')],
          weekDays:row.weekDays,
        };
        this.empList = row.userList
        this.choiceWeek = [0,0,0,0,0,0,0]
        this.dateChange(this.obj.dateRange)
        let arr = this.obj.weekDays.split(',')
        for(let i = 0;i< arr.length; i++){
          this.choiceWeek[Number(arr[i])-1] = 1
        }
        this.recorderSelectList = []
        this.empSelectList = []
        for(let i = 0;i< this.empList.length; i++){
          let em = this.empList[i]
          this.empSelectList.push({id:em.userId})
        }
        this.showModal=true;
      },


      showStaffs(item){
        this.showEmpList = []
        this.page1.current = 1
        this.getShowStaffList(item.id)
        this.showEmpModel = true;
      },

      pageChanged1(page){
        this.page1.current = page
        this.getData()
      },

      getShowStaffList(taskId){
        let that = this
        this.$load.show();
        this.$fetch(this.$api.staff.STAFF_TASK_USER_LIST, {
          tokenId: util.getSession("token").id,
          pageNum: this.page1.current,
          pageSize: this.page1.size,
          taskId : taskId,
        })
          .then((res) => {
            this.$load.hide();
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            let bodyData = res.body;
            that.showEmpList=bodyData.list;
            that.page1.current=Number(bodyData.curPage);
            that.page1.total=Number(bodyData.totalCount);
            that.page1.size=Number(bodyData.pageSize);

          })
          .catch((err) => {
            this.$Message.error(err.message);
            this.$load.hide();
          })
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
      this.getItemList();
      this.getData();
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
  #sublist @{deep}.ivu-table{
    background: #ffffff;
    height: 220px!important;
  }
  #emplist @{deep}.ivu-table{
    background: #ffffff;
    height: 430px!important;
  }
</style>

