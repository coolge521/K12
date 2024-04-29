<template>
  <div style="padding: 20px;background: #f5f6f7;">
    <Row style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" @click="add">+添加授权</Button>
      <div style="float: right">
        <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea"  style="margin-right: 5px;width: 150px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <Input clearable v-model="search.kpiUserName" placeholder="请输入考核员姓名"   style="width: 150px;margin-right: 5px;"></Input>

        <Input clearable v-model="search.childUserName" placeholder="请输入被考核人姓名"   style="width: 150px;margin-right: 5px;"></Input>

        <Button type="primary" style="width: 90px;"  @click="doSearch">查询</Button>
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
          <span style="color: #333333;text-align: center;font-size: 14px;">管理员:</span>
        </div>
        <Input v-model="obj.name" placeholder="请选择管理员"  style="width: 160px;margin-top: 5px;margin-right: 5px;" :readonly="true">
          <Button  slot="append" icon="md-add" @click="addPerson"></Button>
        </Input>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考核对象:</span>
        </div>
        <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px"  @click="addEmployees">添加</Button>
      </div>
      <div style="background: #ffffff;padding: 3px;">
        <div class='uc-table' >
          <Table id="sublist" row-key="id" border :columns="columns1" :data="empList" :stripe="true" ></Table>
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
        :multiple="false"
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
        @selectEmployeeItem="selectItem">
      </StaffSelect>
    </Modal>


    <Modal
      title="考核对象列表"
      v-model="showEmpModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      width="800">
      <div class='uc-table' style="padding: 3px;" >
        <Table id="emplist" row-key="id" border :columns="columns2" :data="showEmpList" :stripe="true" @on-selection-change=""></Table>
      </div>
<!--      <div class="right">-->
<!--        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page1.total" :current="page1.current" :page-size="page1.size" show-elevator   @on-change='pageChanged1'  class="footclass"/>-->
<!--      </div>-->
    </Modal>
  </div>
</template>

<script>
  import util from "@/libs/util.js";
  import StaffSelect from '../sysParams/StaffSelect'
  export default {
    name: "InspectionAuthIndex",
    components: {
      StaffSelect,
    },
    data() {
      return {
        search:{
          areaId:'',
          kpiUserName:'',
          childUserName:'',
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
            title: '考核员姓名',
            key: 'name',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '考核员部门',
            key: 'title',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '考核员手机号',
            key: 'phone',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '被考核人数',
            key: 'userList',
            align: 'center',
            minWidth: 70,
            render: (h, params) => {
              let that=this;
              let userList = params.row.childList
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
            title: '工号',
            key: 'employeeNo',
            align: 'center',
            minWidth:90,
          },
          {
            title: '部门',
            key: 'organName',
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
                            that.doDeleteEmp(params.row,pos)
                          }else{
                            that.delSelected(params.row.userId)
                            that.empList.splice(pos,1);
                            this.$Modal.remove();
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
            title: '工号',
            key: 'employeeNo',
            align: 'center',
            minWidth:90,
          },
          {
            title: '部门',
            key: 'organName',
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

        areaList:[],

        obj: {},
        title:'',
        showModal:false,
        submitLoading:false,

        selectRecorderModel:false,
        recorderSelectList:[],//选择的考勤员列表
        selectStaffModel:false,
        empSelectList:[],//选择的教职工列表
        empList:[],//提交的教职工列表

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
      onChangeArea(val){
        this.doSearch();
      },
      doSearch(){
        this.page.current = 1
        this.getData()
      },
      pageChanged(page){
        this.page.current = page
        this.getData()
      },
      getData(){
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          userId: this.$util.getSession("memberId"),
          schoolId: this.$util.getLocal("schoolId") ,
          pageNum:this.page.current,
          pageSize:this.page.size,
        }
        if(!this.$Filters.isEmpty(this.search.areaId)){
          params.areaId = this.search.areaId
        }
        if(!this.$Filters.isEmpty(this.search.kpiUserName)){
          params.kpiUserName = this.search.kpiUserName
        }
        if(!this.$Filters.isEmpty(this.search.childUserName)){
          params.childUserName = this.search.childUserName
        }
        this.$fetch(this.$api.kpi.KPI_AUTH_PAGE_LIST, params).then((res)=> {
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
        if(!this.$Filters.isEmpty(this.obj.userId)){
          this.$refs.selStaff.selList = [this.obj.userId]
        }else{
          this.$refs.selStaff.selList = []
        }
        this.$refs.selStaff.search.areaId = this.search.areaId
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
        this.obj.userId = res.id
        this.obj.name = res.name
        this.obj.phone = res.phone
        this.obj.title = res.orgName

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
        this.$refs.selStaff1.search.areaId = this.search.areaId
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
              employeeNo:emp.employeeNo,
              organId:emp.orgId,
              organName:emp.orgName,
              schoolId: this.$util.getLocal("schoolId") ,
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



      add(){
        this.obj={
          areaId:this.search.areaId,
          id:null,
          name:'',
          phone:'',
          userId:'',
          title:'',
          schoolId: this.$util.getLocal("schoolId") ,
          childList:[],
        }
        this.recorderSelectList = []
        this.empSelectList = []
        this.empList = []
        this.title="新增考核授权";
        this.showModal=true;
      },


      save(){
        this.submitLoading=true;
        if(this.$Filters.isEmpty(this.obj.userId)){
          this.$Message.error("请选择管理员");
          this.submitLoading=false;
          return;
        }
        if(this.empList.length == 0){
          this.$Message.error("请选择被考核人");
          this.submitLoading=false;
          return;
        }

        let Item = {
          id: this.obj.id,
          areaId: this.obj.areaId,
          schoolId: this.obj.schoolId,
          userId: this.obj.userId,
          name: this.obj.name,
          phone: this.obj.phone,
          title: this.obj.title,
          childList: this.empList,
        }

        if(!this.$Filters.isEmpty(Item.id)){
          this.Update(Item);
        }else{
          this.Insert(Item);
        }
      },

      Insert(item){
        this.$load.show();
        this.$post(this.$api.kpi.KPI_AUTH_INSERT, {
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
        this.$put(this.$api.kpi.KPI_AUTH_UPDATE, {
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
          content: '您确定要删除该考核授权吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          loading:true,
          onOk() {
            this.$delete(this.$api.kpi.KPI_AUTH_DELETE, {
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

      doDeleteEmp(item,pos){
        let that = this
        this.$delete(this.$api.kpi.KPI_AUTH_OBJ_DELETE, {
          tokenId: util.getSession("token").id,
          id: item.id
        }).then((res)=> {
          if (res.code == 200) {
            this.$Message.success('删除成功');
            this.$Modal.remove();
            that.delSelected(item.userId)
            that.empList.splice(pos,1);
            that.getListData();
          }else{
            this.$Message.error(res.message);
          }
        });
      },

      edit(row){
        this.title="编辑考核授权";
        this.obj={
          id:row.id,
          areaId:row.areaId,
          schoolId:row.schoolId,
          name:row.name,
          userId:row.userId,
          phone:row.phone,
          title:row.title,
        };
        this.empList = row.childList
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
        // this.getShowStaffList(item.id)
        this.showEmpList = item.childList
        this.showEmpModel = true;
      },

      pageChanged1(page){
        this.page1.current = page
        this.getData()
      },

      getShowStaffList(taskId){
        /*let that = this
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
          })*/
      },

      delSelected(id){
        for(let i=this.empSelectList.length-1; i>=0; i--){
          if(this.empSelectList[i].id == id){
            this.empSelectList.splice(i,1);
          }
        }
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
                that.getData()
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
      this.getAreaList();
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


