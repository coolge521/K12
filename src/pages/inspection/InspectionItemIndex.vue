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
      width="800">

      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考核项目:</span>
        </div>
        <Input type="text" v-model="itemObj.name" placeholder="请输入考核项目" maxlength="20">
        </Input>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">基础分:</span>
        </div>
        <InputNumber  v-model="itemObj.baseScore" :max="999" :min="0"   :step="1" clearable placeholder="不限" style="width: 100%"></InputNumber>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">排序码:</span>
        </div>
        <InputNumber :max="99999" :min="0" v-model="itemObj.sort" placeholder="请输入排序码" style="width: 100%"></InputNumber>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">是否启用:</span>
        </div>
        <i-switch v-model="itemObj.enable" size="large" @on-change="">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </i-switch>
      </div>

      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考核点:</span>
        </div>
        <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px"  @click="addItem">添加</Button>
      </div>
      <div style="background: #ffffff;padding: 3px;">
        <div class='uc-table' >
          <Table id="sublist" row-key="id" border :columns="columns2" :data="itemList" :stripe="true" ></Table>
        </div>
      </div>

      <div slot="footer" >
        <Button type="text" size="large" @click="showModal=false">取消</Button>
        <Button type="primary" size="large" @click="save" :loading="submitLoading">保存</Button>
      </div>
    </Modal>

    <Modal
      v-model="showPointModal"
      :title="pointTitle"
      width="500">

      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">考核点:</span>
        </div>
        <Input type="text" v-model="pnt.pointName" placeholder="请输入考核点" maxlength="20">
        </Input>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">排序码:</span>
        </div>
        <InputNumber :max="99999" :min="0" v-model="pnt.sort" placeholder="请输入排序码" style="width: 100%"></InputNumber>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">得分方式:</span>
        </div>
        <Select v-model="pnt.scoreType" placeholder="请选择得分方式"  label-in-value @on-change="onSelectScoreType"  clearable style="width: 100%">
          <Option v-for="(item,index) in scoreTypeArr"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
            {{item.name}}
          </Option>
        </Select>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">得分:</span>
        </div>
        <InputNumber :max="999" :min="-999" v-model="pnt.score" placeholder="请输入得分" style="width: 100%"></InputNumber>
      </div>
      <div style="width: 100%;height:40px;display: flex;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">是否启用:</span>
        </div>
        <i-switch v-model="pnt.enable" size="large" @on-change="">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </i-switch>
      </div>
      <div style="width: 100%;display: flex;justify-content: space-between;align-items: flex-start;margin-top: 15px;margin-bottom: 5px;">
        <div style="width: 120px;">
          <span style="color: #ff0000;text-align: center;font-size: 14px;visibility: hidden">*</span>
          <span style="color: #333333;text-align: center;font-size: 14px;">备注:</span>
        </div>
        <Input
          v-model="pnt.remarks"
          type="textarea"
          :autosize="{minRows: 3,maxRows: 5}"
          maxlength="200"
          placeholder="请输入备注" />
      </div>

      <div slot="footer" >
        <Button type="text" size="large" @click="showPointModal=false">取消</Button>
        <Button type="primary" size="large" @click="savePnt" :loading="submitLoading1">保存</Button>
      </div>
    </Modal>

    <Modal
      title="考核点列表"
      v-model="showItemsModal"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      width="800">
      <div class='uc-table' style="padding: 3px;" >
        <Table  row-key="id" border :columns="columns3" :data="showItemsList" :stripe="true" @on-selection-change=""></Table>
      </div>
    </Modal>
  </div>
</template>

<script>
  import util from "@/libs/util.js";
  export default {
    name: "InspectionItemIndex",
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
            title: '考核项目',
            key: 'name',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '',
            key: 'baseScore',
            minWidth: 130,
            align: 'center',
            renderHeader: (h, params) => {
              return h('div', [
                h('div', {
                  // class:'fontColor',
                }, '基础分'),
                h('div', {
                  // class:'fontColor',
                }, '（当基础分扣为0分后不再继续扣分）')
              ]);
            }
          },
          {
            title: '考核点',
            key: 'userList',
            align: 'center',
            minWidth: 70,
            render: (h, params) => {
              let that=this;
              let childList = params.row.childList
              if(that.$Filters.isEmpty(childList)|| childList.length == 0){
                return h('div', [
                  h('span',{},'0个')
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
                        that.showItems(params.row);
                      }
                    }
                  },childList.length+'个')
                ]);
              }
            }
          },
          {
            title: '是否启用',
            key: 'enable',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.enable == 1 ? '是' : '否')
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
        columns2: [
          {
            title: '序号',
            key: 'id',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '考核点',
            key: 'pointName',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '得分方式',
            key: 'scoreTypeName',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '得分',
            key: 'score',
            minWidth: 60,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remarks',
            minWidth: 120,
            tooltip:true,
            align: 'center'
          },
          {
            title: '是否启用',
            key: 'name',
            align: 'center',
            minWidth: 60,
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
              let that = this
              return h('a', [
                h('a', {
                  on: {
                    click: () => {
                      that.editItem(params.row,params.index);
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
                      this.$Modal.confirm({
                        title: '删除',
                        content: '您确定要删除该考核项目吗？',
                        width: '400px',
                        okText: '确定',
                        cancelText: '关闭',
                        loading:true,
                        onOk() {
                          if(!that.$Filters.isEmpty(params.row.id)){
                            that.doDeleteItem(params.row.id,params.index)
                          }else{
                            that.itemList.splice(params.index,1);
                            this.$Modal.remove();
                          }
                        }
                      })
                    }
                  }
                }, '删除')])
            }
          }
        ],
        columns3: [
          {
            title: '序号',
            key: 'id',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '考核点',
            key: 'pointName',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '得分方式',
            key: 'scoreTypeName',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '得分',
            key: 'score',
            minWidth: 60,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remarks',
            minWidth: 120,
            tooltip:true,
            align: 'center'
          },
          {
            title: '是否启用',
            key: 'name',
            align: 'center',
            minWidth: 60,
            render: (h, params) => {
              return h('span', params.row.enable ? '是' : '否')
            }
          },
        ],
        page:{
          current:1,
          size:20,
          total:0,
        },
        list:[],
        itemList:[],

        itemObj: {},
        title:'',
        showModal:false,
        submitLoading:false,

        scoreTypeArr:[
          {
            code:'1',
            name:'单次等值得分',
          },
          {
            code:'2',
            name:'每次递增得分',
          },
        ],

        pnt:{},
        pointTitle:'',
        showPointModal:false,
        submitLoading1:false,
        editPos:-1,

        showItemsModal:false,
        showItemsList:[],
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
        this.$fetch(this.$api.kpi.KPI_ITEM_PAGE_LIST, params).then((res)=> {
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

      onSelectScoreType(item){
        if(item != undefined){
          this.pnt.scoreType = item.value;
          this.pnt.scoreTypeName = item.label;
        }else{
          this.pnt.scoreType = '';
          this.pnt.scoreTypeName = '';
        }
      },

      add(){
        this.itemObj={
          id:null,
          name:'',
          baseScore:null,
          enable:true,
          schoolId: this.$util.getLocal("schoolId") ,
        }
        this.itemList = []
        this.itemObj.sort = this.list.length+1,
        this.title="新增考核项目";
        this.showModal=true;
      },

      save(){
        this.submitLoading=true;
        if(this.$Filters.isEmpty(this.itemObj.name)){
          this.$Message.error("请输入考核项目");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.itemObj.baseScore)){
          this.$Message.error("请输入基础分");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.itemObj.sort)){
          this.$Message.error("请输入排序码");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.itemList)){
          this.$Message.error("考核点不能为空");
          this.submitLoading=false;
          return;
        }

        let Item = {
          id: this.itemObj.id,
          schoolId: this.itemObj.schoolId,
          name: this.itemObj.name,
          baseScore: this.itemObj.baseScore,
          sort: this.itemObj.sort,
          enable:this.itemObj.enable?1:0,
          childList:this.itemList,
          updateUserId:this.$util.getSession("memberId"),
        }

        if(!this.$Filters.isEmpty(Item.id)){
          this.Update(Item);
        }else{
          this.Insert(Item);
        }
      },

      Insert(item){
        this.$post(this.$api.kpi.KPI_ITEM_INSERT, {
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
        this.$put(this.$api.kpi.KPI_ITEM_UPDATE, {
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
          content: '您确定要删除该考核项目吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          loading:true,
          onOk() {
            this.$delete(this.$api.kpi.KPI_ITEM_DELETE, {
              tokenId: this.$util.getSession("token").id,
              id: id
            }).then((res)=> {
              if (res.code == 200) {
                this.$Message.success('删除成功!');
                this.$Modal.remove();
                that.getData();
              }
            });
          }
        })
      },

      edit(row){
        this.title="编辑考核项目";
        this.itemObj={
          id:row.id,
          schoolId: row.schoolId ,
          name:row.name,
          baseScore:Number(row.baseScore),
          enable:row.enable == 1?true:false,
          sort:row.sort,
        };
        this.itemList = row.childList == null ? []:row.childList
        this.showModal=true;
      },

      addItem(){
        this.pnt={
          id:null,
          pointName:'',
          remarks:'',
          score:null,
          scoreType:'',
          scoreTypeName:'',
          enable:true,
          itemId:null,
          schoolId: this.$util.getLocal("schoolId") ,
        }
        if(!this.$Filters.isEmpty(this.itemObj.id)){
           this.pnt.itemId = this.itemObj.id
        }
        this.pnt.sort = this.itemList.length+1,
        this.editPos = -1
        this.pointTitle="新增考核点";
        this.showPointModal=true;
      },
      editItem(item,pos){
        this.pnt={
          id:item.id,
          pointName:item.pointName,
          remarks:item.remarks,
          score:item.score,
          scoreType:item.scoreType,
          scoreTypeName:item.scoreTypeName,
          enable:item.enable == 1?true:false,
          itemId:item.itemId,
          schoolId: item.schoolId ,
          sort:item.sort,
        }
        this.editPos = pos
        this.pointTitle="编辑考核点";
        this.showPointModal=true;
      },
      savePnt(){
        this.submitLoading1=true;
        if(this.$Filters.isEmpty(this.pnt.pointName)){
          this.$Message.error("请输入考核点");
          this.submitLoading1=false;
          return;
        }
        if(this.$Filters.isEmpty(this.pnt.sort)){
          this.$Message.error("请输入排序码");
          this.submitLoading1=false;
          return;
        }
        if(this.$Filters.isEmpty(this.pnt.scoreType)){
          this.$Message.error("请选择得分方式");
          this.submitLoading1=false;
          return;
        }
        if(this.$Filters.isEmpty(this.pnt.score)){
          this.$Message.error("请输入得分");
          this.submitLoading1=false;
          return;
        }

        let Point = {
          id: this.pnt.id,
          schoolId: this.pnt.schoolId,
          itemId: this.pnt.itemId,
          pointName: this.pnt.pointName,
          score: this.pnt.score,
          scoreType: this.pnt.scoreType,
          scoreTypeName: this.pnt.scoreTypeName,
          remarks: this.pnt.remarks,
          enable: this.pnt.enable?1:0,
          sort: this.pnt.sort,
        }
        this.submitLoading1=false;
        if(this.editPos == -1){
          this.itemList.push(Point)
        }else{
          this.itemList.splice(this.editPos,1, Point)
        }
        this.showPointModal=false
      },

      doDeleteItem(id,pos){
        let that = this
        this.$delete(this.$api.kpi.KPI_ITEM_POINT_DELETE, {
          tokenId: this.$util.getSession("token").id,
          id: id
        }).then((res)=> {
          if (res.code == 200) {
            this.$Message.success('删除成功!');
            this.$Modal.remove();
            that.itemList.splice(pos,1);
            that.getData();
          }
        });
      },

      showItems(item){
        this.showItemsList = !this.$Filters.isEmpty(item.childList)?item.childList:[]
        this.showItemsModal = true;
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



