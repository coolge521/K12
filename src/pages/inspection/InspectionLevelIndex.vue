<template>
  <div style="padding: 20px;background: #f5f6f7;">
    <Row style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" @click="add">+添加</Button>

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

      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考核结果:</span>
        </div>
        <Input type="text" v-model="itemObj.result" placeholder="请输入考核结果" maxlength="20">
        </Input>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: flex-start;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">分值设置:</span>
        </div>
        <div style="width: 100%;display: flex;justify-content: flex-start;align-items: center;">
          <InputNumber  v-model="itemObj.scoreStart" :max="itemObj.scoreEnd == null?100:Number(itemObj.scoreEnd - 1)" :min="0"   :step="1" clearable placeholder="不限" style="width: 80px" ></InputNumber>
          　≤　
          <label >总分</label>
          　<　
          <InputNumber  v-model="itemObj.scoreEnd" :max="100" :min="itemObj.scoreStart == null?0:Number(itemObj.scoreStart + 1)" :step="1" clearable placeholder="不限"  style="width: 80px" ></InputNumber>
        </div>
      </div>
      <div style="width: 100%;display: flex;justify-content: space-between;align-items: flex-start;margin-top: 15px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;visibility: hidden">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">备注说明:</span>
        </div>
        <Input
          v-model="itemObj.remarks"
          type="textarea"
          :autosize="{minRows: 3,maxRows: 5}"
          maxlength="200"
          placeholder="请输入备注说明" />
      </div>

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
    name: "InspectionLevelIndex",
    components: {},
    data() {
      return {
        columns1: [
          {
            title: '序号',
            key: 'id',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '考核结果',
            key: 'result',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '指定分值≤总分',
            key: 'start',
            minWidth: 80,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.scoreStart == null ? '不限' : params.row.scoreStart+'分')
            }
          },
          {
            title: '总分＜指定分值',
            key: 'end',
            minWidth: 80,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.scoreEnd == null ? '不限' : params.row.scoreEnd+'分')
            }
          },
          {
            title: '备注说明',
            key: 'remarks',
            minWidth: 100,
            align: 'center',
            tooltip:true,
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
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },params.row.updateUserName + ((params.row.updateUserPhone != null)?'-' + params.row.updateUserPhone:""))
                ]);
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
        this.$fetch(this.$api.kpi.KPI_LEVEL_PAGE_LIST, params).then((res)=> {
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
          result:'',
          remarks:'',
          scoreStart:null,
          scoreEnd:null,
          schoolId: this.$util.getLocal("schoolId") ,
        }
        this.title="新增考核评级";
        this.showModal=true;
      },
      save(){
        this.submitLoading=true;
        if(this.$Filters.isEmpty(this.itemObj.result)){
          this.$Message.error("请输入考核结果");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.itemObj.scoreStart) && this.$Filters.isEmpty(this.itemObj.scoreEnd)){
          this.$Message.error("分值设置的上、下限分值不能全为空");
          this.submitLoading=false;
          return;
        }

        let Item = {
          id: this.itemObj.id,
          schoolId: this.itemObj.schoolId,
          result: this.itemObj.result,
          scoreStart: this.itemObj.scoreStart,
          scoreEnd: this.itemObj.scoreEnd,
          remarks: this.itemObj.remarks,
          updateUserId:this.$util.getSession("memberId"),
        }

        if(!this.$Filters.isEmpty(Item.id)){
            this.Update(Item);
        }else{
            this.Insert(Item);
        }
      },

      Insert(item){
        this.$post(this.$api.kpi.KPI_LEVEL_INSERT, {
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
        this.$put(this.$api.kpi.KPI_LEVEL_UPDATE, {
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
          content: '您确定要删除该考核评级吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          loading:true,
          onOk() {
            this.$delete(this.$api.kpi.KPI_LEVEL_DELETE, {
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
        this.title="编辑考核评级";
        this.itemObj={
          id:row.id,
          schoolId: row.schoolId ,
          result:row.result,
          scoreStart:Number(row.scoreStart),
          scoreEnd:Number(row.scoreEnd),
          remarks:row.remarks,
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


