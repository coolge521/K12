<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <span></span>
      <div style="float: right;display: flex;flex-direction: row;align-items: center;">

        <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea"  style="margin-right: 5px;width: 150px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>

        <Input clearable v-model="search.registerName" placeholder="请输入用餐登记员"   style="width: 150px;margin-left: 5px;margin-right: 5px;"></Input>

        <Input clearable v-model="search.userName" placeholder="用餐学生姓名"   style="width: 150px;margin-left: 5px;margin-right: 10px;"></Input>

        <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doSearch">查询</Button>
        <Button type="primary" style="width: 90px;"  @click="addAuth">添加授权</Button>

      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div >
          <i-table border :columns="columns" :data="tableList" :stripe="true" v-show="!($Filters.isShowNoDataView(tableList,this))" @on-row-click=""></i-table>
          <i-table border :columns="columns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(tableList,this)"></i-table>
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

    <!-- 编辑-->
    <Modal
      v-model="showModal"
      ref="modal"
      :title="title"
      :loading="submitLoading"
      :mask-closable="false"
      @on-ok="submit"
      @on-cancel="cancelModal"
      width="1200"
      height="800"
      ok-text = '保存'
      cancel-text = '取消'>
      <div style="padding: 5px;">
        <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;">
          <div>
            <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
            <span style="color: #333333;text-align: center;font-size: 14px;">用餐登记员:</span>
          </div>
          <Input v-model="obj.managerName" placeholder="请选择登记员" :disabled="isEdit" style="width: 160px;margin-top: 5px;" :readonly="true">
            <Button :disabled="isEdit" slot="append" icon="md-add" @click="addPerson"></Button>
          </Input>
        </div>
        <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
          <div>
            <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
            <span style="color: #333333;text-align: center;font-size: 14px;">用餐人员:</span>
          </div>
          <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px"  @click="addStudent">添加</Button>
        </div>
        <div style="background: #ffffff;">
          <div class='uc-table' >
            <Table row-key="id" border :columns="columns1" :data="foodStudentList" :stripe="true" @on-selection-change="foodStudentsChange"></Table>
          </div>
<!--          <div class="right">-->
<!--            <Page slot='footer' size="small" :show-total=true :transfer=true :total="page1.total" :current="page1.current" :page-size="page1.size" show-elevator   @on-change='pageChanged1'  class="footclass"/>-->
<!--          </div>-->
        </div>
      </div>

    </Modal>


    <Modal
      title="选择教工"
      v-model="selectStaffModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="selectStaffOk"
      :loading="loading"
      width="800">
      <StaffSelect
        ref="selStaff"
        :multiple="false"
        @selectEmployeeItem="selectItem">
      </StaffSelect>
    </Modal>

    <Modal
      title="选择学生"
      v-model="selectStudentModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="selectStudentOk"
      :loading="loading1"
      width="1200">
      <StudentSelect
        ref="selStudent"
        @selectStudentsItem="selectStudents">
      </StudentSelect>
    </Modal>

    <Modal
      title="人员列表"
      v-model="showStudentModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="cancelShowStudentModal"
      width="800">
      <div class='uc-table' >
        <Table row-key="id" border :columns="columns2" :data="foodStudentList" :stripe="true" @on-selection-change="foodStudentsChange"></Table>
      </div>
    </Modal>

  </div>
</template>

<script>
    import util from "@/libs/util.js";
    import StaffSelect from '../sysParams/StaffSelect'
    import StudentSelect from '../sysParams/StudentSelect'
    export default {
      name: "RecorderAuthIndex",
      components: {
        StaffSelect,
        StudentSelect,
      },
      data() {
        return {
          search:{
            areaId:'',
            registerName:'',
            userName:'',
          },
          stuSearch:{
            name:'',
            phone:'',
            studentNo:'',
          },
          page:{
            current:1,
            size:20,
            total:0,
          },
          page1:{
            current:1,
            size:20,
            total:0,
          },
          isMultiEdit: false,


          areaList:[],

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
              title: '用餐登记员',
              minWidth: 120,
              key: 'name',
              align: 'center'
            },
            {
              title: '登记员手机号',
              key: 'phone',
              align: 'center',
              minWidth: 200,
            },
            {
              title: '登记员部门',
              key: 'position',
              align: 'center',
              minWidth: 100,
            },
            {
              title: '管理班级',
              key: 'classNames',
              align: 'center',
              minWidth: 200,
            },
            {
              title: '用餐人员',
              key: 'userCount',
              align: 'center',
              minWidth: 150,
              render: (h, params) => {
                let that=this;
                if(params.row.userCount == 0){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },params.row.userCount),
                    h('span',{},'人')
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
                          that.showStudents(params.row);
                        }
                      }
                    },params.row.userCount+'人')
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
                  }, '编辑'),
                  h('Divider', {props: {type: 'vertical'}}),
                  h('a', {
                    style: {
                      color: 'red',
                    },
                    on: {
                      click:e => {
                        e.stopPropagation();
                        this.$Modal.confirm({
                          title: '删除',
                          content: '确定删除该授权信息吗？',
                          width: '400px',
                          okText: '确定',
                          cancelText: '关闭',
                          onOk() {
                            that.doDeleteAuth(params.row.phone);

                          }
                        })
                      }
                    }
                  }, '删除'),
                ])
              }
            }
          ],
          columns1: [
            {
              title:'序号',
              type: 'index',
              width: 60,
              align: 'center',
              tooltip:true,
            },
            // {
            //   title: '校区',
            //   key: 'areaName',
            //   align: 'center',
            //   minWidth:80,
            // },
            // {
            //   title: '年级',
            //   key: 'gradeName',
            //   align: 'center',
            //   width: 50,
            // },
            {
              title: '班级',
              key: 'userClassName',
              align: 'center',
              minWidth:60,
            },
            {
              title: '学号',
              key: 'userSchoolNum',
              align: 'center',
              minWidth:50,
            },
            {
              title: '姓名',
              key: 'userName',
              align: 'center',
              minWidth:80,
            },
            {
              title: '性别',
              key: 'sex',
              align: 'center',
              minWidth:50,
            },
            {
              title: '出生日期',
              key: 'birthday',
              align: 'center',
              minWidth:100,
            },
            {
              title: '绑定手机号',
              align: 'center',
              minWidth:100,
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
              title: '操作',
              key: 'action',
              width: 120,
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
                              that.doDeleteFoodStudent(params.row.id,pos)
                            }else{
                              that.foodStudentList.splice(pos,1);
                            }
                          }
                        })

                      }
                    }
                  }, '移除')])
              }
            },

          ],
          columns2: [
            {
              title:'序号',
              type: 'index',
              width: 60,
              align: 'center',
              tooltip:true,
            },
            {
              title: '班级',
              key: 'userClassName',
              align: 'center',
              minWidth:60,
            },
            {
              title: '学号',
              key: 'userSchoolNum',
              align: 'center',
              minWidth:50,
            },
            {
              title: '姓名',
              key: 'userName',
              align: 'center',
              minWidth:80,
            },
            {
              title: '性别',
              key: 'sex',
              align: 'center',
              minWidth:50,
            },
            {
              title: '出生日期',
              key: 'birthday',
              align: 'center',
              minWidth:100,
            },
            {
              title: '绑定手机号',
              align: 'center',
              minWidth:100,
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
          ],

          selectStaffModel:false,
          loading:true,
          selectList:[],//登记员选择

          selectStudentModel:false,
          loading1:true,
          stuSelectList:[],//选择的学生列表

          showModal:false,
          foodStudentList:[],//登记员管理的学生

          showStudentModel:false,

          isEdit:false,
          title:'',
          submitLoading:true,
          obj:{},


        }
      },
      methods: {
        onChangeArea(val){
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


        getListData() {
          this.$load.show();
          let params = {
            tokenId: util.getSession("token").id,
            userId: util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId"),
            pageNum:this.page.current,
            pageSize:this.page.size,
          }
          if(!this.$Filters.isEmpty(this.search.areaId)){
            params.areaId = this.search.areaId
          }
          if(!this.$Filters.isEmpty(this.search.registerName)){
            params.registerName = this.search.registerName
          }
          if(!this.$Filters.isEmpty(this.search.userName)){
            params.userName = this.search.userName
          }
          this.$fetch(this.$api.food.FOOD_GET_REGISTER_AUTH_LIST, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              this.page.current=Number(bodyData.curPage);
              this.page.total=Number(bodyData.totalCount);
              this.page.size=Number(bodyData.pageSize);
              this.tableList=bodyData.list;
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



        addAuth(){
          this.obj = {}
          this.foodStudentList = []
          this.isEdit = false
          this.title = '新增用餐登记员授权'
          this.showModal = true
        },



        EditItem(index,item){
          this.obj = {}
          this.foodStudentList = []
          this.getDetail(item.phone)

          this.title = '编辑用餐登记员授权'
          this.isEdit =true
          this.showModal = true;
        },



        getDetail(phone){
          let that = this
          this.$load.show();
          this.$fetch(this.$api.food.FOOD_GET_DETAIL, {
            tokenId: util.getSession("token").id,
            userId: util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId"),
            registerPhone:phone,
          })
            .then((res) => {
              this.$load.hide();
              if (res.code != 200) {
                this.$Message.error(res.message);
                return;
              }
              let body = res.body;
              let register = body[0]
              that.obj.managerUserId = register.registerUserId
              that.obj.managerName = register.registerUserName
              that.obj.managerPhone = register.registerUserPhone
              that.obj.managerOrg = register.registerUserPosition

              that.foodStudentList = body

            })
            .catch((err) => {
              this.$Message.error(err.message);
              this.$load.hide();
            })
        },


        addPerson(){
          if(!this.$Filters.isEmpty(this.obj.managerId)){
            this.$refs.selStaff.selList = [this.obj.managerId]
          }else{
            this.$refs.selStaff.selList = []
          }
          this.$refs.selStaff.search.areaId = this.search.areaId
          this.$refs.selStaff.getListData()
          this.selectStaffModel = true
        },

        selectStaffOk(){
          this.$refs.selStaff.emitSelectEmployee();
          if(this.selectList.length > 1){
            this.$Message.error('只能选择一个');
            setTimeout(() => {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            }, 300);
            return
          }
          this.checkIfRegister(this.selectList[0])

        },


        selectItem(item){
          this.selectList = item;
        },


        checkIfRegister(employee){
          let that = this
          this.$load.show();
          this.$fetch(this.$api.food.FOOD_CHECK_IF_AUTH_REGISTER, {
            tokenId: util.getSession("token").id,
            RegisterUserPhone:employee.phone,
          })
            .then((res) => {
              this.$load.hide();
              if (res.code != 200) {
                this.$Message.error(res.message);
                return;
              }
              let flag = res.body;
              if(flag){
                this.$Modal.warning({
                  title: '提示',
                  content: employee.name+'已经授权为登记员，请选择其他人员',
                  width: '400px',
                  okText: '确定',
                  onOk() {
                    setTimeout(() => {
                      that.loading = false;
                      that.$nextTick(() => {
                        that.loading = true;
                      });
                    }, 300);

                  }
                })
              }else{
                that.obj.managerId = this.selectList[0].id;
                that.obj.managerUserId = this.selectList[0].id;
                that.obj.managerName = this.selectList[0].name;
                that.obj.managerPhone = this.selectList[0].phone;
                that.obj.managerOrg = this.selectList[0].orgName;
                that.selectStaffModel = false;
              }

            })
            .catch((err) => {
              this.$Message.error(err.message);
              this.$load.hide();
            })
        },



        selectStudentOk(){
          let that = this
          this.$refs.selStudent.emitSelectStudent();
          if(this.stuSelectList.length > 0){
             if(this.foodStudentList.length == 0){
                this.stuSelectList.forEach(function (item) {
                    that.foodStudentList.push({
                        account:item.id,
                        userName:item.name,
                        userPhone:item.phone,
                        sex:item.sex,
                        userClassName:!that.$Filters.isEmpty(item.inClass)?item.inClass:null,
                        userSchoolNum:!that.$Filters.isEmpty(item.studentNo)?item.studentNo:null,
                        birthday:!that.$Filters.isEmpty(item.birthday)?item.birthday:null,
                        // userId:!that.$Filters.isEmpty(item.userId)?item.userId:null,
                        userId:item.id,
                    })
                })
             }else{
                let newArr = []
                for(let i = 0;i<this.stuSelectList.length;i++){
                   let stu = this.stuSelectList[i]
                   let has = false
                   for(let j = 0;j<this.foodStudentList.length;j++){
                      let fstu = this.foodStudentList[j]
                      if(stu.id == fstu.account){
                          has = true;
                      }
                   }
                   if(!has){
                     newArr.push({
                       account:stu.id,
                       userName:stu.name,
                       userPhone:stu.phone,
                       sex:stu.sex,
                       userClassName:!that.$Filters.isEmpty(stu.inClass)?stu.inClass:null,
                       userSchoolNum:!that.$Filters.isEmpty(stu.studentNo)?stu.studentNo:null,
                       birthday:!that.$Filters.isEmpty(stu.birthday)?stu.birthday:null,
                       // userId:!that.$Filters.isEmpty(stu.userId)?stu.userId:null,
                       userId:stu.id,
                     })
                   }
                }
                if(newArr.length > 0){
                  this.foodStudentList = this.foodStudentList.concat(newArr)
                  console.log('newAdd==='+newArr.length)
                }
             }
             console.log('selStu==='+this.stuSelectList.length)
          }

          this.stuSelectList = []
          this.selectStudentModel = false;
        },
        selectStudents(item){
          this.stuSelectList = item;
        },

        addStudent(){
          let sel = []
          if(this.foodStudentList.length > 0){
             this.foodStudentList.forEach(function (item) {
                sel.push(item.account)
             })
          }
          this.$refs.selStudent.search.areaId = this.search.areaId
          this.$refs.selStudent.selList = sel
          this.$refs.selStudent.getListData()
          this.selectStudentModel = true
        },

        foodStudentsChange(item){

        },




        submit(){
          if(this.$Filters.isEmpty(this.obj.managerName)){
            this.$Message.error("登记员不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.foodStudentList)){
            this.$Message.error("用餐人员不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }


          this.$load.show();
          this.submitConfig();

        },

        submitConfig(){
          let that = this
          this.foodStudentList.forEach(function (stu) {
              stu.collegeId = util.getLocal("schoolId")
              if(!that.$Filters.isEmpty(that.obj.managerUserId)){
                stu.registerUserId = that.obj.managerUserId
              }
              if(!that.$Filters.isEmpty(that.obj.managerName)){
                stu.registerUserName = that.obj.managerName
              }
              if(!that.$Filters.isEmpty(that.obj.managerPhone)){
                stu.registerUserPhone = that.obj.managerPhone
              }
              if(!that.$Filters.isEmpty(that.obj.managerOrg)){
                stu.registerUserPosition = that.obj.managerOrg
              }
          })
          let vo = {
            userList: this.foodStudentList,
          }

          this.Update(vo);
          this.obj= {}
          this.showModal = false;
        },

        Update(item){
          this.$post(this.$api.food.FOOD_ADD_EDIT_AUTH, {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("user").id,
          },item).then((res)=> {
            if (res.code == 200) {
              this.$load.hide();
              this.$Message.success('保存成功!');
              this.getListData();
            }else{
              this.$load.hide();
              this.$Message.error(res.message);
            }
          });
        },

        cancelModal(){
          this.obj= {}
          this.showModal = false;
        },

        showStudents(item){
          this.foodStudentList = []
          this.getDetail(item.phone)
          this.showStudentModel = true;
        },

        cancelShowStudentModal(){
          this.showStudentModel = false;
        },




        doDeleteAuth(phone){
          let that = this
          this.$delete(this.$api.food.FOOD_DELETE_AUTH, {
            tokenId: util.getSession("token").id,
            RegisterUserPhone: phone
          }).then((res)=> {
            if (res.code == 200) {
              this.$Message.success('删除成功');
              that.getListData();
            }else{
              this.$Message.error(res.message);
            }
          });
        },


        doDeleteFoodStudent(id,pos){
          let that = this
          this.$delete(this.$api.food.FOOD_DELETE_AUTH_STUDENT, {
            tokenId: util.getSession("token").id,
            id: id
          }).then((res)=> {
            if (res.code == 200) {
              this.$Message.success('删除成功');
              that.foodStudentList.splice(pos,1);
              that.getListData();
            }else{
              this.$Message.error(res.message);
            }
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
        this.getAreaList();

      },
    }
</script>

<style scoped lang="less">
  @deep: ~'>>>';

</style>
