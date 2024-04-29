<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <span></span>
      <div style="float: right;display: flex;flex-direction: row;align-items: center;">

        <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea"  style="margin-right: 5px;width: 120px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <Select v-model="search.grade" placeholder="请选择年级"  @on-change="onChangeGrade" clearable style="margin-right: 5px;width: 120px;">
          <Option v-for="(item,index) in gradeList"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
          </Option>
        </Select>
        <Input clearable v-model="search.inClass" placeholder="请输入班级"   style="width: 120px;margin-right: 5px;"></Input>

        <Input clearable v-model="search.registerName" placeholder="请输入考勤老师姓名"   style="width: 150px;margin-right: 5px;"></Input>

        <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doSearch">查询</Button>
        <Button type="primary" style="width: 90px;"  @click="doExport">导出</Button>

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



    <Modal
      title="选择教工"
      v-model="selectStaffModel"
      ref="modal"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="selectStaffOk"
      :loading="loading"
      width="800">
      <StaffSelect
        ref="selStaff"
        @selectEmployeeItem="selectItem">
      </StaffSelect>
    </Modal>



    <Modal
      title="学生列表"
      v-model="showStudentModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="cancelShowStudentModal"
      width="800">
      <div class='uc-table' >
        <Table row-key="id" border :columns="columns2" :data="signStudentList" :stripe="true" @on-selection-change=""></Table>
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
    name: "SignRecorderAuthIndex",
    components: {
      StaffSelect,
    },
    data() {
      return {
        search:{
          areaId:'',
          grade:'',
          inClass:'',
          registerName:'',
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
            title: '校区',
            key: 'areaName',
            align: 'center',
            minWidth:80,
          },
          {
            title: '年级',
            key: 'gradeName',
            align: 'center',
            minWidth:80,
          },
          {
            title: '班级',
            key: 'classId',
            align: 'center',
            minWidth:80,
          },
          {
            title: '学生总数',
            key: 'count',
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              let that=this;
              if(params.row.count == 0){
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },params.row.count),
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
                  },params.row.count+'人')
                ]);
              }
            }
          },
          {
            title: '考勤老师',
            minWidth: 200,
            key: 'emp',
            align: 'center',
            render: (h, params) => {
              let that=this;
              let emps = params.row.employeeList
              if(emps == null){
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },'未设置'),
                ]);
              }else{
                let empsString = '<div>'
                for(let i = 0;i< emps.length;i++){
                  let emp = emps[i]
                  empsString += emp.name+'-'+emp.phone+'<br>'
                }
                empsString += '</div>'
                return h('div', [
                  h('div',{
                    class:'fontColor',
                    style:{
                      // textDecoration:'underline'
                    },
                    domProps: {
                      innerHTML:empsString
                    }
                  },)
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
                }, '设置'),
              ])
            }
          }
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
            title: '年级',
            key: 'gradeName',
            align: 'center',
            minWidth:60,
          },
          {
            title: '班级',
            key: 'inClass',
            align: 'center',
            minWidth:60,
          },
          {
            title: '学号',
            key: 'studentNo',
            align: 'center',
            minWidth:50,
          },
          {
            title: '姓名',
            key: 'name',
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
              if(params.row.phone == null){
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
                  },params.row.phone)
                ]);
              }

            },
          },
        ],

        selectStaffModel:false,
        loading:true,
        empSelectList:[],//选择的教职工列表


        signStudentList:[],//班级学生
        showStudentModel:false,
        curObj:null,

        isEdit:false,
        title:'',
        submitLoading:true,


      }
    },
    methods: {
      onChangeArea(val){
        this.doSearch();
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
        if(!this.$Filters.isEmpty(this.search.grade)){
          params.gradeId = this.search.grade
        }
        if(!this.$Filters.isEmpty(this.search.inClass)){
          params.classId = this.search.inClass
        }
        if(!this.$Filters.isEmpty(this.search.registerName)){
          params.name = this.search.registerName
        }

        this.$fetch(this.$api.sign.SIGN_GET_REGISTER_AUTH_LIST, params).then((res)=> {

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




      EditItem(index,item){
        this.curObj = item
        if(!this.$Filters.isEmpty(this.curObj.areaId)){
          this.$refs.selStaff.search.areaId = this.curObj.areaId
        }
        let sel = []
        if(!this.$Filters.isEmpty(this.curObj.employeeIds)){
          sel = this.curObj.employeeIds.split(',')
        }

        this.$refs.selStaff.selList = sel
        this.$refs.selStaff.getListData()
        this.selectStaffModel = true

      },



      getDetail(){
        let that = this
        this.$load.show();
        this.$fetch(this.$api.platform.PLATFORM_STUDENT_LIST, {
          tokenId: util.getSession("token").id,
          schoolId: util.getLocal("schoolId"),
          curPage: this.page1.current,
          areaId : this.curObj.areaId,
          grade : this.curObj.grade,
          inClass : this.curObj.classId,
        })
          .then((res) => {
            this.$load.hide();
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            let bodyData = res.body;
            that.signStudentList=bodyData.list;
            that.page1.current=Number(bodyData.curPage);
            that.page1.total=Number(bodyData.totalCount);
            that.page1.size=Number(bodyData.pageSize);

          })
          .catch((err) => {
            this.$Message.error(err.message);
            this.$load.hide();
          })
      },

      pageChanged1(page){
        this.page1.current = page
        this.getDetail()
      },


      selectStaffOk(){
        this.$refs.selStaff.emitSelectEmployee();
        if(this.empSelectList.length > 0){
          console.log('selemp==='+this.empSelectList.length)
          this.curObj.teacherIds = ''
          for(let i=0;i<this.empSelectList.length;i++){
            this.curObj.teacherIds += this.empSelectList[i].id+','
          }
          if(this.curObj.teacherIds.endsWith(',')){
            this.curObj.teacherIds = this.curObj.teacherIds.slice(0,-1)
          }

          this.curObj.collegeId = this.$util.getLocal("schoolId")
          this.curObj.updateUserId = this.$util.getSession("memberId")
          delete this.curObj._index
          delete this.curObj._rowKey
          delete this.curObj.employeeIds
          this.Update(this.curObj);
        }else{
          this.$Message.error("请选择考勤老师");
          this.$refs.modal.buttonLoading=false;
        }

      },

      selectItem(item){
        this.empSelectList = item;
      },



      Update(item){
        let that = this
        this.$post(this.$api.sign.SIGN_SET_REGISTER_AUTH, {
          tokenId: this.$util.getSession("token").id,
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');

            that.empSelectList = []
            that.selectStaffModel = false;
            that.getListData();
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },


      showStudents(item){
        this.curObj = item
        this.signStudentList = []
        this.page1.current = 1
        this.getDetail()
        this.showStudentModel = true;
      },

      cancelShowStudentModal(){
        this.curObj = null
        this.showStudentModel = false;
      },



      doExport(){
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          userId: this.$util.getSession("memberId"),
          collegeId: this.$util.getLocal("schoolId") ,
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
        if(!this.$Filters.isEmpty(this.search.registerName)){
          params.name = this.search.registerName
        }

        this.$fetchBlob(this.$api.sign.SIGN_EXPORT_REGISTER_AUTH_LIST, params).then((res)=> {
          if (res.status == 200) {
            console.log(res);
            // const fileName = res.headers["content-disposition"].split('=')[1];
            const fileName = '入校登记员授权报表.xlsx';
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
      this.gradeList = util.getLocal("grades")
      this.getAreaList();
    },
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';

</style>
