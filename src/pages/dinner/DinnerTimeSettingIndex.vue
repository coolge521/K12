<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width: 90px"  @click="addContent">+添加</Button>
      <span></span>

    </Row>
    <Row>
      <i-col span='24'>
        <div>
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
      width="500"
      height="500"
      ok-text = '保存'
      cancel-text = '取消'>
      <Form  :label-width="100" label-position="left">
        <FormItem label="用餐时段：">
          <Input v-model="obj.name" placeholder="请输入用餐时段名称" ></Input>
        </FormItem>
        <FormItem label="供餐单位：">
          <Input v-model="obj.organName" placeholder="请输入供餐单位" ></Input>
        </FormItem>
        <FormItem label="排序码">
          <InputNumber :max="9999" :min="1" v-model="obj.sort" placeholder="排序码" style="width:150px"></InputNumber>
        </FormItem>
        <FormItem label="是否启用：">
          <i-switch v-model="obj.enable" size="large" @on-change="">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>

    </Modal>


  </div>
</template>

<script>
  import ucApi from "@/libs/ucApi.js";
  import util from "@/libs/util.js";

    export default {
      name: "DinnerTimeSettingIndex",
      data() {
        return {
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
              title: '用餐时段',
              minWidth: 120,
              key: 'name',
              align: 'center'
            },
            {
              title: '供餐单位',
              minWidth: 120,
              key: 'organName',
              align: 'center'
            },
            {
              title: '是否启用',
              key: 'name',
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', params.row.enable == 1 ? '是' : '否')
              }
            },
            {
              title: '最新维护时间',
              key: 'updateTime',
              minWidth: 180,
              tooltip:true,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('span', {
                    'style':{
                      // 'color':'#5599e5'
                    }
                  }, params.row.updateTime)
                ]);
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
                          content: '确定删除该用餐时段？',
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
                ])
              }
            }
          ],

          showModal:false,
          title:'',
          submitLoading:true,
          creatorName:'',
          obj:{},

        }
      },
      methods: {
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
            userId: this.$util.getSession("user").id,
            collegeId: this.$util.getLocal("schoolId") ,
            pageNum:this.page.current,
            pageSize:this.page.size,
          }

          this.$fetch(this.$api.food.FOOD_TIME_SETTING_GET_LIST, params).then((res)=> {

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




        addContent(){
          this.obj = {
            enable:true,
            sort:this.tableList.length+1,
            collegeId:this.$util.getLocal("schoolId") ,
            createUserId:this.$util.getSession("user").id,
          }
          this.title = '新增 / 用餐时段配置'
          this.showModal = true;
        },


        EditItem(index,item){
          this.obj = {}
          this.obj.id = item.id
          this.obj.collegeId = item.collegeId
          this.obj.name = item.name
          this.obj.organName = item.organName
          this.obj.sort = item.sort
          this.obj.enable = item.enable == 1?true:false
          this.obj.updateUserId = this.$util.getSession("user").id

          this.title = '编辑 / 用餐时段配置'
          this.showModal = true;
        },


        submit(){
          if(this.$Filters.isEmpty(this.obj.name)){
            this.$Message.error("用餐时段不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.organName)){
            this.$Message.error("供餐单位不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.sort)){
            this.$Message.error("请输入排序码");
            this.$refs.modal.buttonLoading=false;
            return;
          }

          this.$load.show();
          this.submitConfig();

        },

        submitConfig(){
          let Item = {
            id: this.obj.id,
            collegeId: this.obj.collegeId,
            name: this.obj.name,
            organName: this.obj.organName,
            sort: this.obj.sort,
            enable:this.obj.enable?1:0,
            updateUserId:util.getSession("user").id,
          }

          if(!this.$Filters.isEmpty(Item.id)){
            this.Update(Item);
          }else{
            this.Insert(Item);
          }
          this.showModal = false;
        },

        Insert(item){
          let that = this
          this.$post(this.$api.food.FOOD_TIME_SETTING_ADD, {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("user").id,
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
        Update(item){
          let that = this
          this.$put(this.$api.food.FOOD_TIME_SETTING_EDIT, {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("user").id,
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

        delete(id){
          let that = this
          this.$delete(this.$api.food.FOOD_TIME_SETTING_DELETE, {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("user").id,
            id: id
          }).then((res)=> {
            if (res.code == 200) {
              this.$Message.success('删除成功!');
              that.getListData();
            }else{
              this.$Message.error(res.message);
            }
          });
        },

        cancelModal(){
          this.obj= {}
          this.showModal = false;
        },

      },
      created() {

      },
      mounted() {
        this.getListData();

      },
    }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-card-body {
    padding: 10px !important;
  }
</style>
