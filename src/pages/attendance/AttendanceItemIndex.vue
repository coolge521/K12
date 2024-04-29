<template>
  <div style="padding: 20px;background: #f5f6f7;">
    <Row style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" @click="add">+添加</Button>
      <div style="float: right">
        <Input clearable v-model="search.content" placeholder="输入考勤项目名称关键字"   style="width: 200px;margin-right: 5px;"></Input>
        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="doSearch">查询</Button>
      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div>
          <i-table border :columns="columns1" :data="list" :stripe="true" ></i-table>
        </div>
      </i-col>
      <div class="right">
        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page.total" :current="page.current" :page-size="page.size" show-elevator   @on-change='pageChanged'  class="footclass"/>
      </div>
    </Row>

    <Modal
      v-model="showModal"
      :title="title"
      width="600">
      <Form  :label-width="120" label-position="left" :rules="ruleInline">
        <FormItem label="考勤项目名称:" prop="name">
          <Input type="text" v-model="itemObj.name" placeholder="请输入名称" maxlength="50">
          </Input>
        </FormItem>
        <FormItem label="是否启用：">
          <i-switch v-model="itemObj.enable" size="large" @on-change="">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
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
    name: "AttendanceItemIndex",
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
            title: '考勤项目名称',
            key: 'name',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '是否启用',
            key: 'enable',
            minWidth: 80,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.useStatus == '1' ? '是' : '否')
            }
          },
          {
            title: '最新维护时间',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if(params.row.updateTime == null){
                return h('span',{
                  // class:'numberColor',
                },this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss'))
              }else{
                return h('span',{
                  // class:'numberColor',
                },this.$moment(params.row.updateTime).format('YYYY-MM-DD HH:mm:ss'))
              }
            }

          },
          {
            title: '维护人',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if(params.row.updateUserName == null && params.row.updateUserPhone == null){
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },params.row.createUserName + ((params.row.createUserPhone != null)?'-' + params.row.createUserPhone:""))
                ]);
              }else{
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },params.row.updateUserName + ((params.row.updateUserPhone != null)?'-' + params.row.updateUserPhone:""))
                ]);
              }

            },
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
        page:{
          current:1,
          size:20,
          total:0,
        },
        list:[],

        ruleInline:{
          name: [
            { required: true, message: '请输入名称', trigger: 'blur',type:'text' },
          ],
        },
        itemObj: {},
        title:'',
        showModal:false,
        submitLoading:false,
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
      getData(){
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          userId: this.$util.getSession("memberId"),
          schoolId: this.$util.getLocal("schoolId") ,
          pageNum:this.page.current,
          pageSize:this.page.size,
        }
        if(!this.$Filters.isEmpty(this.search.content)){
          params.name = this.search.content
        }
        this.$fetch(this.$api.staff.STAFF_ITEM_PAGE_LIST, params).then((res)=> {
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

      add(){
        this.itemObj={
          id:null,
          name:'',
          enable:true,
          schoolId: this.$util.getLocal("schoolId") ,
        }
        this.title="新增考勤项目";
        this.showModal=true;
      },
      save(){
        this.submitLoading=true;
        if(this.$Filters.isEmpty(this.itemObj.name)){
          this.$Message.error("请输入考勤项目名称");
          this.submitLoading=false;
          return;
        }

        let Item = {
          id: this.itemObj.id,
          name: this.itemObj.name,
          useStatus: this.itemObj.enable?'1':'0',
          schoolId: this.itemObj.schoolId,
        }

        if(!this.$Filters.isEmpty(Item.id)){
          Item.updateUserId = this.$util.getSession("memberId"),
          this.Update(Item);
        }else{
          Item.createUserId = this.$util.getSession("memberId"),
          this.Insert(Item);
        }
      },

      Insert(item){
        this.$post(this.$api.staff.STAFF_ITEM_INSERT, {
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
        this.$put(this.$api.staff.STAFF_ITEM_UPDATE, {
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
            this.$delete(this.$api.staff.STAFF_ITEM_DELETE, {
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

      edit(row){
        this.title="编辑考勤项目";
        this.itemObj={
          id:row.id,
          name:row.name,
          schoolId: row.schoolId ,
          enable:row.useStatus == '1'?true:false,
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
    background: #ffffff;
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(72vh - 10px)!important;
    }
  }
</style>

