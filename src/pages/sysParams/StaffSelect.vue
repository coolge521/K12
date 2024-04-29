<template>
    <div style="padding: 5px;">
      <div v-if="!readOnly" style="width: 100%;display: flex;justify-content: flex-end;margin-bottom: 5px;background: #ffffff;padding: 10px;">
        <Select v-model="search.areaId" placeholder="请选择校区" @on-change="onChangeArea"  :disabled="areaDisabled" style="margin-right: 5px;width: 120px;margin-bottom: 5px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <Input clearable v-model="search.name" placeholder="请输入姓名"   style="width: 150px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.phone" placeholder="请输入手机号"   style="width: 150px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.empNo" placeholder="请输入工号"   style="width: 150px;margin-right: 5px;"></Input>
        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="doSearch">查询</Button>
      </div>
      <div style="background: #ffffff;">
        <div class='uc-table' >
          <Table row-key="id" ref="table"  border :columns="columns" :data="tableDataList" :stripe="true" @on-selection-change="selectEmployee"></Table>
        </div>
        <div class="right">
          <Page slot='footer' size="small" :show-total=true :transfer=true :total="page.total" :current="page.current" :page-size="page.size" show-elevator   @on-change='pageChanged'  class="footclass"/>
        </div>
      </div>
    </div>
</template>

<script>
   import util from "@/libs/util.js";
    export default {
      name: "StaffSelect",
      components: {
      },
      props:['multiple','areaChange'],
      data() {
        let that=this
        return {
          readOnly:false,
          areaDisabled:true,
          search:{
            areaId:'',
            name:'',
            phone:'',
            empNo:'',
            orgId:'',
          },
          page:{
            current:1,
            size:20,
            total:0,
          },
          tableDataList:[],
          areaList:[],
          columns: [
            {
              type: 'selection',
              width: 40,
              align: 'center',
            },
            {
              title:'序号',
              type: 'index',
              width: 60,
              align: 'center',
              tooltip:true,
            },
            {
              title: '校区',
              key: 'areaName',
              align: 'center',
              minWidth:100,
            },
            {
              title: '姓名',
              key: 'name',
              align: 'center',
              minWidth:100,
            },
            {
              title: '性别',
              key: 'sex',
              width: 50,
              align: 'center',
              render: (h, params) => {
                return h('span', params.row.sex)
              }
            },
            {
              title: '工号',
              key: 'employeeNo',
              align: 'center',
              minWidth:100,
            },
            {
              title: '部门',
              key: 'orgName',
              align: 'center',
              minWidth:100,
            },
            {
              title: '手机号',
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

          selList:[],

          selection:[],

        }
      },
      computed: {},
      watch: {},
      methods: {
        doSearch(){
          this.page.current = 1
          this.getListData()
        },
        onChangeArea(val){
          this.doSearch();
        },
        pageChanged(page){
          this.page.current=page;
          this.getListData();
        },
        getListData() {
          let that = this
          this.$load.show();
          let params = {
            tokenId: util.getSession("token").id,
            schoolId: util.getLocal("schoolId"),
            curPage: this.page.current,
          }
          if(!this.$Filters.isEmpty(this.search.areaId)){
            params.areaId = this.search.areaId
          }
          if(!this.$Filters.isEmpty(this.search.name)){
            params.name = this.search.name
          }
          if(!this.$Filters.isEmpty(this.search.phone)){
            params.phone = this.search.phone
          }
          if(!this.$Filters.isEmpty(this.search.empNo)){
            params.empNo = this.search.empNo
          }
          if(!this.$Filters.isEmpty(this.search.orgId)){
            params.orgId = this.search.orgId
          }
          this.$fetch(this.$api.platform.PLATFORM_EMPLOYEE_LIST, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              this.tableDataList=bodyData.list;
              this.page.current=Number(bodyData.curPage);
              this.page.total=Number(bodyData.totalCount);
              this.page.size=Number(bodyData.pageSize);

              setTimeout(function () {
                that.showSelection();
                that.setSelection();
              },200)

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

        showSelection(){
          let that=this;
          if(that.selList!=undefined && that.selList.length>0){
            for(let j=0;j<that.tableDataList.length;j++){
              let item=that.tableDataList[j];
              if(that.hasEmployee(item)){
                that.$refs.table.objData[j]._isChecked= true;
              }else{
                that.$refs.table.objData[j]._isChecked= false;
              }
            }
          }
        },

        hasEmployee(emp){
          for(let i=0;i<this.selList.length;i++){
            let sel=this.selList[i];
            if(sel==emp.id){
              return true;
            }
          }
          return false;
        },

        selectEmployee(selection){
          if(this.multiple || this.multiple==undefined){
            this.selection=selection;
          }else{
            if(selection.length>1){
              let old=this.selList[0];
              let oldIndex=0;
              for(let i=0;i<selection.length;i++){
                if(old==selection[i].id){
                  oldIndex=i;
                }
              }
              selection.splice(oldIndex,1)
            }

            let current=selection[0];
            this.selList=[current.id];
            this.selection[0]=current;
            setTimeout(()=>{
              this.showSelection()
            },100)
          }
        },

        emitSelectEmployee(){
          this.$emit('selectEmployeeItem',this.selection)
        },

        setSelection(){
          let that=this;
          let sln = []
          if(that.selList!=undefined && that.selList.length>0){
            for(let j=0;j<that.tableDataList.length;j++){
              let item=that.tableDataList[j];
              if(that.hasEmployee(item)){
                sln.push(item);
              }
            }
            if(sln.length > 0){
              this.selection = sln
            }
          }
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
      },
      created() {

      },
      mounted() {
        if(this.areaChange != undefined){
           this.areaDisabled = !this.areaChange
        }
        this.getAreaList()
      },
    }
</script>

<style scoped>

</style>
