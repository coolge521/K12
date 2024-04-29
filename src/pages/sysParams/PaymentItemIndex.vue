<template>
  <div class="v-clock" style="padding: 20px;background: #f5f5f5;">
    <Row style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" @click="add">+添加</Button>
      <div style="float: right">
        <Input clearable v-model="search.content" placeholder="请输入项目名称关键字"   style="width: 200px;margin-right: 5px;"></Input>
        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="searchData">查询</Button>
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
      <Form  :label-width="100" label-position="left">
        <FormItem label="项目名称:" prop="name">
          <Input type="text" v-model="payItem.name" placeholder="请输入项目名称">
          </Input>
        </FormItem>
        <FormItem label="收费金额" prop="amount">
          <InputNumber :max="99999" :min="0" v-model="payItem.amount" placeholder="请输入项目金额(精确到小数点后两位)" style="width: 100%" @on-blur="fomartMoney"></InputNumber>
        </FormItem>
        <FormItem label="排序码">
          <InputNumber :max="99999" :min="0" v-model="payItem.sort" placeholder="请输入排序码" style="width: 100%"></InputNumber>
        </FormItem>
        <FormItem id="derate" label="是否享受政府补助：" >
          <i-switch v-model="payItem.derate" size="large" @on-change="">
            <span slot="open">是</span>
            <span slot="close">否</span>
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
    name: "PaymentItemIndex",
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
            title: '项目名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '收费金额',
            key: 'amount',
            align: 'center'
          },

          {
            title: '是否享受政府补助',
            key: 'derate',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.derate ? '是' : '否')
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
            title: '操作',
            key: 'action',
            width: 200,
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

        payItem: {},
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
          curPage:this.page.current,
        }
        if(!this.$Filters.isEmpty(this.search.content)){
          params.search = this.search.content
        }
        this.$fetch(this.$api.platform.PLATFORM_GET_PAYMENT_LIST_BY_PAGE, params).then((res)=> {
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
      pageChanged(page){
        this.page.current=page;
        this.getData();
      },
      searchData(){
        this.page.current=1;
        this.page.total=0;
        this.list=[];
        this.getData();
      },
      add(){
        this.payItem={
          id:null,
          name:'',
          amount:0,
          sort:this.list.length+1,
          derate:false,
          schoolId: this.$util.getLocal("schoolId") ,
        }
        this.title="新增缴费项目";
        this.showModal=true;
      },
      save(){
        this.submitLoading=true;
        if(this.$Filters.isEmpty(this.payItem.name)){
          this.$Message.error("请输入缴费项目名称");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.payItem.amount)){
          this.$Message.error("请输入缴费项目金额");
          this.submitLoading=false;
          return;
        }

        let area = {
          id: this.payItem.id,
          name: this.payItem.name,
          amount: this.payItem.amount,
          sort: this.payItem.sort,
          derate: this.payItem.derate,
          schoolId: this.payItem.schoolId,
          operatorId:this.$util.getSession("user").id,
        }

        this.$post(this.$api.platform.PLATFORM_SAVE_PAYMENT_ITEM, {
          tokenId: util.getSession("token").id,
        },area).then((res)=> {
          if (res.code == 200) {
            console.log(res);
            this.$Message.success("操作成功");
            this.submitLoading=false;
            this.showModal=false;
            this.searchData();
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
          content: '您确定要删除该项目吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          loading:true,
          onOk() {
            this.$delete(this.$api.platform.PLATFORM_DELETE_PAYMENT_ITEM_BY_ID, {
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
        this.title="编辑缴费项目";
        this.payItem={
          id:row.id,
          name:row.name,
          amount: row.amount,
          sort: row.sort,
          derate: row.derate,
          schoolId: row.schoolId,
        };
        this.showModal=true;
      },

      fomartMoney: function () {
        if (this.payItem.amount > 0) {
          this.payItem.amount = Number(this.$util.toDecimal2(this.payItem.amount));
        }
      }
    },
    created() {
    },
    mounted() {
      this.searchData();
    },
  }
</script>

<style scoped lang="less">
  @deep:~'>>>';
   #derate@{deep}.ivu-form-item-label{
     width: 160px!important;
   }

</style>
