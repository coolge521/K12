<template>
  <div style="padding: 20px;background: #f5f6f7;">
    <Row style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" @click="add">+添加</Button>
      <div style="float: right">
        <Input clearable v-model="search.content" placeholder="输入校区名称关键字"   style="width: 200px;margin-right: 5px;"></Input>
        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="getData">查询</Button>
      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div>
          <i-table border :columns="columns1" :data="list" :stripe="true" ></i-table>
        </div>
      </i-col>
    </Row>

    <Modal
      v-model="showModal"
      :title="title"
      width="600">
      <Form  :label-width="100" label-position="left" :rules="ruleInline">
        <FormItem label="校区名称:" prop="name">
          <Input type="text" v-model="areaObj.name" placeholder="请输入校区名称" maxlength="50">
          </Input>
        </FormItem>
        <FormItem label="校区地址:" prop="address">
          <Input type="text" v-model="areaObj.address" placeholder="请输入校区地址" maxlength="100">
          </Input>
        </FormItem>
        <FormItem label="校区电话:" prop="phone">
          <Input type="text" v-model="areaObj.phone" placeholder="请输入校区电话" maxlength="50">
          </Input>
        </FormItem>
        <FormItem label="排序码" prop="sort">
          <InputNumber :max="9999" :min="1" v-model="areaObj.sort" placeholder="排序码" style="width:150px"></InputNumber>
        </FormItem>
        <FormItem label="是否启用：">
          <i-switch v-model="areaObj.enable" size="large" @on-change="">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注说明">
          <Input
            v-model="areaObj.remark"
            type="textarea"
            :autosize="{minRows: 5,maxRows: 5}"
            maxlength="200"
            placeholder="请输入备注" />
        </FormItem>
      </Form>
      <div slot="footer" >
        <Button type="text" size="large" @click="showModal=false">取消</Button>
        <Button type="primary" size="large" @click="save" :loading="submitLoading">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
    import util from "@/libs/util.js";
    export default {
      name: "SchoolDistrictIndex",
      components: {},
      data() {
        return {
          search:{
            content:'',
          },
          columns1: [
            {
              title: '序号',
              key: 'id',
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '校区名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '排序码',
              key: 'sort',
              align: 'center',
              width: 60,
            },
            {
              title: '校区地址',
              key: 'address',
              align: 'center',
            },
            {
              title: '校区电话',
              key: 'phone',
              align: 'center',
            },
            {
              title: '备注',
              key: 'remark',
              align: 'center',
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
                  },this.$moment(params.row.optime).format('YYYY-MM-DD HH:mm:ss'))
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
              title: '是否启用',
              key: 'enable',
              width: 80,
              align: 'center',
              render: (h, params) => {
                return h('span', params.row.enable ? '是' : '否')
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
          list:[],

          ruleInline:{
            name: [
              { required: true, message: '请输入校区名称', trigger: 'blur',type:'text' },
            ],
            sort:[
              {required: true, message: '请输入排序码', trigger: 'blur', type:'number'},
            ],
            phone: [
              { required: true, message: '请输入校区电话', trigger: 'blur',type:'text' },
            ],
            address:[
              {required: true, message: '请输入校区地址', trigger: 'blur',type:'text'},
            ],
          },
          areaObj: {},
          title:'',
          showModal:false,
          submitLoading:false,
        }
      },
      computed: {},
      watch: {},
      methods: {
        getData(){
          this.$load.show();
          let params = {
            schoolId: util.getLocal("schoolId"),
            tokenId: util.getSession("token").id,
          }
          if(!this.$Filters.isEmpty(this.search.content)){
            params.search = this.search.content
          }
          this.$fetch(this.$api.platform.PLATFORM_AREA_LIST, params).then((res)=> {
            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              if(undefined != res.body){
                this.list=res.body;
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

        add(){
          this.areaObj={
            id:null,
            name:'',
            remark:'',
            sort:this.list.length+1,
            enable:true,
            schoolId: this.$util.getLocal("schoolId") ,
          }
          this.title="新增校区";
          this.showModal=true;
        },
        save(){
          this.submitLoading=true;
          if(this.$Filters.isEmpty(this.areaObj.name)){
            this.$Message.error("请输入校区名称");
            this.submitLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.areaObj.address)){
            this.$Message.error("请输入校区地址");
            this.submitLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.areaObj.phone)){
            this.$Message.error("请输入校区电话");
            this.submitLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.areaObj.sort)){
            this.$Message.error("请输入排序码");
            this.submitLoading=false;
            return;
          }

          let area = {
            id: this.areaObj.id,
            name: this.areaObj.name,
            phone: this.areaObj.phone,
            address: this.areaObj.address,
            remark: this.areaObj.remark,
            sort: this.areaObj.sort,
            enable: this.areaObj.enable,
            schoolId: this.areaObj.schoolId,
            operatorId:this.$util.getSession("user").id,
          }

          this.$post(this.$api.platform.PLATFORM_AREA_SAVE, {
            tokenId: util.getSession("token").id,
          },area).then((res)=> {
            if (res.code == 200) {
              console.log(res);
              this.$Message.success("操作成功");
              this.submitLoading=false;
              this.showModal=false;
              this.getData();
            }else{
              this.$Message.error(res.message);
              this.submitLoading=false;
            }
          })
            .catch((err)=>{
              this.$Message.error(err);
              this.submitLoading=false;
            });
        },
        deleteById(id){
          var that=this;
          this.$Modal.confirm({
            title: '删除',
            content: '您确定要删除该校区吗？',
            width: '400px',
            okText: '确定',
            cancelText: '关闭',
            loading:true,
            onOk() {
              this.$delete(this.$api.platform.PLATFORM_AREA_DELETE, {
                tokenId: this.$util.getSession("token").id,
                userId: this.$util.getSession("user").id,
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

        edit(row){
          this.title="编辑校区";
          this.areaObj={
            id:row.id,
            name:row.name,
            address:row.address,
            phone:row.phone,
            remark:row.remark,
            schoolId: row.schoolId ,
            sort:row.sort,
            enable:row.enable,
          };
          this.showModal=true;
        },


      },
      created() {
      },
      mounted() {
        this.getData();
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
</style>
