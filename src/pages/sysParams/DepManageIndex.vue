<template>
  <div class="v-clock" style="padding: 20px;background: #f5f6f7;">
    <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px"  @click="addData">+添加</Button>
      <div style="float: right;display: flex;align-items: center;">
        <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea" clearable style="margin-right: 5px;width: 200px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="getListData">查询</Button>
      </div>
    </div>
    <div>

      <div class='uc-table' >
        <Table row-key="id" border :columns="columns" :data="tableDataList" :stripe="true"></Table>
      </div>
    </div>

    <!-- 添加或编辑-->
    <Modal
      v-model="showModal"
      ref="modal"
      :title="title"
      :loading="submitLoading"
      :mask-closable="false"
      @on-ok="submit"
      @on-cancel="cancelModal"
      width="600"
      height="500"
      ok-text = '保存'
      cancel-text = '取消'>
      <Form :model="obj" :label-width="120" :rules="ruleInline">
        <div style="display: flex;flex-direction: row;">
          <FormItem label="部门名称:" prop="name">
            <Input type="text" v-model="obj.name" placeholder="">
            </Input>
          </FormItem>
          <FormItem label="序号:" prop="sort">
            <InputNumber :max="99999" :precision="0" :min="0"  v-model="obj.sort" placeholder="请输入序号" style="width: 100%;">
            </InputNumber>
          </FormItem>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;">
          <FormItem  label="上级部门:">
            <div v-if="obj.parentName == null" style="cursor: pointer;text-align: right;width: 160px;" @click="chooseTree">选择上级部门</div>
            <div v-else style="cursor: pointer;text-align: right;width: 160px;" @click="chooseTree">{{obj.parentName}}</div>
          </FormItem>
          <FormItem label="负责人:" >
            <Input v-model="obj.managerName" placeholder="请选择负责人" style="width: 160px;margin-top: 5px;" :readonly="true">
              <Button slot="append" icon="md-add" @click="addPerson"></Button>
            </Input>
          </FormItem>
        </div>
        <div style="display: flex;flex-direction: row;">
          <FormItem  label="办公电话:" prop="officePhone">
            <Input type="text" v-model="obj.officePhone" placeholder="" style="width: 160px;">
            </Input>
          </FormItem>
          <FormItem label="部门状态:" prop="enable">
            <Select v-model="obj.enable" placeholder="请选择部门状态"   clearable style="margin-right: 5px;width: 160px;">
              <Option v-for="(item,index) in statusArr"
                      :value="item.value"
                      :label="item.label"
                      :key="index">
              </Option>
            </Select>
          </FormItem>
        </div>
        <div  style="display: flex;flex-direction: row;">
          <FormItem v-if="$Filters.isEmpty(obj.parentId) || obj.parentId == '0'" label="所属校区:" prop="areaId">
            <Select v-model="obj.areaId" placeholder="请选择所属校区"   clearable style="margin-right: 5px;width: 160px;">
              <Option v-for="(item,index) in areaList"
                      :value="item.id"
                      :label="item.name"
                      :key="item.id">
              </Option>
            </Select>
          </FormItem>
          <FormItem  label="部门编码:" prop="code">
            <Input type="text" v-model="obj.code" placeholder="请输入部门编码" style="width: 160px;" maxlength="10">
            </Input>
          </FormItem>
        </div>
        <div>
          <FormItem label="备注说明">
            <Input
              v-model="obj.remark"
              type="textarea"
              :autosize="{minRows: 5,maxRows: 5}"
              maxlength="500"
              placeholder="请输入备注" />
          </FormItem>
        </div>

      </Form>
    </Modal>

    <Modal
      v-model="treeModal"
      :title="treeTitle"
      :loading="treeLoading"
      :mask-closable="false"
      ref="treeModal"
      @on-ok="treeOk"
      @on-cancel="treeCancel"
      ok-text = '保存'
      cancel-text = '取消'>
      <treeTemplate
        ref="treeTemplate"
        :tableList="treeList"
        :childrenKey="'children'"
        :attribute="attribute"
        @changeTree="changeTree">
      </treeTemplate>
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
      title="人员列表"
      v-model="showStaffModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="cancelShowStaffModal"
      width="800">
      <StaffSelect
       ref="showStaff">
      </StaffSelect>
    </Modal>

  </div>
</template>

<script>
    import util from "@/libs/util.js";
    import treeTemplate from '@/main/treeTemplate'
    import StaffSelect from './StaffSelect'
    export default {
      name: "DepManageIndex",
      components: {
        treeTemplate,
        StaffSelect,
      },
      props:[''],
      data() {
        return {
          search:{
            areaId:'',
          },
          tableDataList:[],
          areaList:[],
          statusArr:[
            {
              value:'true',
              label:'有效',
            },
            {
              value:'false',
              label:'注销',
            },
          ],
          columns: [
            {
              title:'序号',
              type: 'index',
              width: 60,
              align: 'center',
              tooltip:true,
            },
            {
              title: '部门名称',
              key: 'name',
              align: 'left',
              type:'tree',
              tree: true,
              expand: true,
              minWidth:150,
            },
            {
              title: '部门编码',
              key: 'code',
              align: 'center',
              width: 70,
            },
            {
              title: '负责人',
              align: 'center',
              width: 70,
              render: (h, params) => {
                if(params.row.managerName == null){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },'无')
                  ]);
                }else{
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },params.row.managerName)
                  ]);
                }

              },
            },
            {
              title: '负责人电话',
              align: 'center',
              width: 100,
              render: (h, params) => {
                if(params.row.managerPhone == null){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },'无')
                  ]);
                }else{
                  return h('div', [
                    h('div',{
                      class:'fontColor',
                    },params.row.managerPhone)
                  ]);
                }

              },
            },
            {
              title: '人员数',
              key: 'empCount',
              width: 50,
              align: 'center',
              render: (h, params) => {
                let that=this;
                if(params.row.empCount == 0){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },params.row.empCount)
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
                          that.showStaff(params.row);
                        }
                      }
                    },params.row.empCount)
                  ]);
                }
              }
            },
            {
              title: '状态',
              key: 'enable',
              width: 80,
              align: 'center',
              render: (h, params) => {
                return h('span', params.row.enable == true || params.row.enable == 'true' ? '有效' : '注销')
              }
            },
            {
              title: '最新维护时间',
              align: 'center',
              render: (h, params) => {
                if(params.row.optime == null){
                  return h('span',{
                    'style':{
                      // 'color':'red'
                    }
                  },'无')
                }else{
                  return h('span',{
                    // class:'numberColor',
                  },this.$moment(params.row.optime).format('YYYY-MM-DD HH:mm'))
                }
              }

            },
            {
              title: '维护人',
              align: 'center',
              render: (h, params) => {
                if(params.row.operatorName == null && params.row.operatorPhone == null){
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },'无')
                  ]);
                }else{
                  return h('div', [
                    h('div',{
                      // class:'fontColor',
                    },params.row.operatorName + ((params.row.operatorPhone != null)?'-' + params.row.operatorPhone:""))
                  ]);
                }

              },
            },
            {
              title: '操作',
              key: 'action',
              align: 'center',
              width: 180,
              render: (h, params) => {
                let that=this;
                return h('a', [
                  h('a', {
                    on: {
                      click:e => {
                        e.stopPropagation();
                        that.EditItem(params.row);
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
                          content: '确定删除该部门的数据吗？\n删除后将不再可见，请谨慎操作！',
                          width: '400px',
                          okText: '确定',
                          cancelText: '关闭',
                          onOk() {
                            that.delete(params.row.id);

                          }
                        })
                      }
                    }
                  }, '删除'),
                  h('Divider', {props: {type: 'vertical'}}),
                  h('a', {
                    style: {
                      color: '#0000ff',
                    },
                    on: {
                      click:e => {
                        e.stopPropagation();
                        that.addChild(params.row);
                      }
                    }
                  }, '添加下级'),
                ])

              }
            },
          ],
          ruleInline:{
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            sort:[
              {required: true, message: '请输入排序码', trigger: 'blur', type:'number'},
            ],
            officePhone: [
              { required: true, message: '请输入办公电话', trigger: 'blur' }
            ],
            areaId:[
              {required: true, message: '请选择所属校区', trigger: 'blur',type:'text'},
            ],
            enable:[
              {required: true, message: '请选择部门状态', trigger: 'blur',type:'text'},
            ],
            code: [
              { required: true, message: '请输入部门编码', trigger: 'blur' }
            ],
          },
          obj:{},

          showModal:false,
          title:'',
          submitLoading:true,

          treeModal:false,
          treeTitle:'',
          treeLoading:true,
          treeItem:{},

          item:[],
          treeList:[],
          attribute:{
            showCheckbox:false,
          },

          selectStaffModel:false,
          loading:true,
          selectList:[],

          showStaffModel:false,
        }
      },
      computed: {},
      watch: {},
      methods: {
        getListData() {
          this.$load.show();
          let params = {
            tokenId: util.getSession("token").id,
            schoolId: util.getLocal("schoolId"),
          }
          if(!this.$Filters.isEmpty(this.search.areaId)){
             params.areaId = this.search.areaId
          }
          this.$fetch(this.$api.platform.PLATFORM_DEP_LIST, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let body=JSON.parse(JSON.stringify(res.body))
              body.forEach((item)=>{
                item._showChildren = true
                if(item.children != null && item.children.length > 0){
                  item.children.forEach((chi)=>{
                    chi._showChildren = true
                  })
                }
              })
              this.tableDataList=body;

            } else{
              this.$Message.error(res.message);
            }
            this.$load.hide();
          }).catch((err)=>{
            this.tableDataList = [];
            this.$Message.error(err);
            this.$load.hide();
          });
        },

        getTreeListForUse() {
          this.$load.show();
          let params = {
            tokenId: util.getSession("token").id,
            schoolId: util.getLocal("schoolId"),
            enable:1,
          }

          this.$fetch(this.$api.platform.PLATFORM_DEP_LIST, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              // this.$Message.success("请求完成！");
              let body=JSON.parse(JSON.stringify(res.body))
              body.forEach((item)=>{
                item._showChildren = true
                if(item.children != null && item.children.length > 0){
                  item.children.forEach((chi)=>{
                    chi._showChildren = true
                  })
                }
              })
              this.treeList = JSON.parse(JSON.stringify(body))

            } else{
              this.$Message.error(res.message);
            }
            this.$load.hide();
          }).catch((err)=>{
            this.treeList = [];
            this.$Message.error(err);
            this.$load.hide();
          });
        },

        onChangeArea(val){
           this.getListData();
        },

        delete(idd){
          this.$delete(this.$api.platform.PLATFORM_DEP_DELETE, {
            tokenId: util.getSession("token").id,
            id: idd
          }).then((res)=> {
            if (res.code == 200) {
              this.$Message.success('删除成功');
              this.getListData();
            }else{
              this.$Message.error(res.message);
            }
          });
        },


        submit(){
          let that=this;
          if(this.$Filters.isEmpty(this.obj.sort)){
            this.$Message.error("排序码不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.name)){
            this.$Message.error("部门名称不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.officePhone)){
            this.$Message.error("办公电话不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.enable)){
            this.$Message.error("请选择部门状态");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if((this.$Filters.isEmpty(this.obj.parentId) || this.obj.parentId == '0') && this.$Filters.isEmpty(this.obj.areaId)){
            this.$Message.error("请选择所属校区");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.code)){
            this.$Message.error("请输入部门编码");
            this.$refs.modal.buttonLoading=false;
            return;
          }


          let Item = {
            id: this.obj.id,
            schoolId: this.obj.schoolId,
            name:this.obj.name,
            sort:this.obj.sort,
            parentId:this.obj.parentId,
            // parentName:this.obj.parentName,
            managerId:this.obj.managerId,
            remark:this.obj.remark,
            officePhone:this.obj.officePhone,
            enable:this.obj.enable,
            areaId:this.obj.areaId,
            code:this.obj.code,

            operatorId:util.getSession("user").id,
            operatorName:util.getSession("user").name,
            operatorPhone:util.getSession("user").username,
          }

          this.save(Item);
        },

        save(item){
          let that = this
          this.$load.show();
          this.$post(this.$api.platform.PLATFORM_DEP_SAVE, {
            tokenId: this.$util.getSession("token").id,
          },item).then((res)=> {
            if (res.code == 200) {
              this.$load.hide();
              that.showModal = false;
              this.$Message.success('保存成功!');
              that.getListData();
            }else{
              this.$load.hide();
              this.$Message.error(res.message);
              that.$refs.modal.buttonLoading=false;
            }
          });
        },





        cancelModal(){
          this.obj= {
          }
          this.showModal = false;
        },

        addData(){
          this.obj = {
            name:'',
            sort: 0,
            parentId:null,
            parentName:null,
            remark:'',
            schoolId: this.$util.getLocal("schoolId") ,
            officePhone:'',
            code:'',
            areaId:null,
            enable:null,
          }
          this.title = '新增组织机构'
          this.showModal = true;
        },

        EditItem(item){
          this.obj = JSON.parse(JSON.stringify(item))
          this.obj.id = item.id
          this.obj.itemId = item.itemId
          this.obj.name = item.name
          this.obj.sort = item.sort
          this.obj.parentId = item.parentId
          this.obj.parentName = item.parentName
          this.obj.remark = item.remark,
          this.obj.officePhone = item.officePhone,
          this.obj.code = item.code,
          this.obj.areaId = item.areaId,
          this.obj.enable = item.enable+'',
          this.title = '编辑组织机构'
          this.showModal = true;
        },

        addChild(item){
          this.obj = {
            name:'',
            sort: 0,
            parentId:item.id,
            parentName:item.name,
            remark:'',
            schoolId: this.$util.getLocal("schoolId") ,
            officePhone:'',
            code:'',
            areaId:item.areaId,
            enable:null,
          }

          this.title = '新增组织机构'
          this.showModal = true;
        },


        treeOk(){
          if(this.item.length != 0){
            if(this.obj.id == this.item[0].id){
              this.$Message.error("上级部门不能选择自己");
              this.$refs.treeModal.buttonLoading=false;
              return;
            }
            this.obj.parentId = this.item[0].id
            this.obj.parentName = this.item[0].name
            this.obj.areaId = this.item[0].areaId
          }
          this.treeModal = false;
        },

        treeCancel(content){
          this.treeModal = false;
        },

        chooseTree(){
          this.getTreeListForUse();
          this.treeItem = {}
          this.treeTitle = '选择上级部门'
          this.treeModal = true;
        },
        changeTree(item){
          this.item = item;
        },


        getAreaList() {
          let params = {
            tokenId: util.getSession("token").id,
            schoolId: util.getLocal("schoolId"),
            enable:1,
          }

          this.$fetch(this.$api.platform.PLATFORM_AREA_LIST, params).then((res)=> {
            if (res.code == 200) {
              console.log(res);
              if(undefined != res.body){
                this.areaList=res.body;
              }else{
                this.areaList=[];
              }
            }

          }).catch((err)=>{
            this.areaList = [];
          });
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
          this.obj.managerId = this.selectList[0].id;
          this.obj.managerName = this.selectList[0].name;
          this.obj.managerPhone = this.selectList[0].phone;

          this.selectStaffModel = false;
        },

        selectItem(item){
          this.selectList = item;
        },
        addPerson(){
          if(!this.$Filters.isEmpty(this.obj.managerId)){
            this.$refs.selStaff.selList = [this.obj.managerId]
          }else{
            this.$refs.selStaff.selList = []
          }
          this.$refs.selStaff.search.areaId = this.obj.areaId
          this.$refs.selStaff.getListData()
          this.selectStaffModel = true
        },
        showStaff(item){
          this.$refs.showStaff.readOnly = true
          this.$refs.showStaff.search.orgId = item.id
          this.$refs.showStaff.getListData()
          this.showStaffModel = true
        },
        cancelShowStaffModal(){
          this.$refs.showStaff.readOnly = false
          this.$refs.showStaff.search.orgId = ''
          this.showStaffModel = false
        },
      },
      created() {

      },
      mounted() {
        this.getListData()
        this.getAreaList()
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
      height: calc(84vh + 13px)!important;
    }
    @media screen and (max-height: 1080px) and (orientation: landscape){
      height: calc(82vh + 15px)!important;
    }
    @media screen and (max-height: 1024px) and (orientation: landscape){
      height: calc(81vh + 16px)!important;
    }
    @media screen and (max-height: 900px) and (orientation: landscape){
      height: calc(79vh + 10px)!important;
    }
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(76vh + 5px)!important;
    }
  }
</style>
