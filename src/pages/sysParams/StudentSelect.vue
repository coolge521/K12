<template>
  <div style="padding: 5px;">
    <div v-if="!readOnly" style="width: 100%;display: flex;justify-content: flex-end;margin-bottom: 5px;background: #ffffff;padding: 10px;">
      <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea" disabled style="margin-right: 5px;width: 120px;margin-bottom: 5px;">
        <Option v-for="(item,index) in areaList"
                :value="item.id"
                :label="item.name"
                :key="item.id">
        </Option>
      </Select>
      <Select v-model="search.grade" placeholder="请选择年级"  @on-change="onChangeGrade" clearable style="margin-right: 5px;width: 120px;margin-bottom: 5px;">
        <Option v-for="(item,index) in gradeList"
                :value="item.code"
                :label="item.name"
                :key="item.code">
        </Option>
      </Select>
      <Input clearable v-model="search.inClass" placeholder="请输入班级"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
      <Input clearable v-model="search.name" placeholder="请输入姓名"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
      <Input clearable v-model="search.phone" placeholder="请输入手机号"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
      <Input clearable v-model="search.studentNo" placeholder="请输入学号"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
      <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="doSearch">查询</Button>
    </div>
    <div style="background: #ffffff;">
      <div class='uc-table' >
        <Table row-key="id" ref="table" border :columns="columns" :data="tableDataList" :stripe="true" @on-selection-change="selectStudents"></Table>
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
        name: "StudentSelect",
      components: {
      },
      props:['multiple'],
      data() {
        let that=this
        return {
          readOnly:false,
          search:{
            areaId:'',
            grade:'',
            inClass:'',
            name:'',
            phone:'',
            studentNo:'',
          },
          page:{
            current:1,
            size:20,
            total:0,
          },

          gradeList:[],
          areaList:[],
          tableDataList:[],
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
              minWidth:80,
            },
            {
              title: '年级',
              key: 'gradeName',
              align: 'center',
              width: 50,
            },
            {
              title: '班级',
              key: 'inClass',
              align: 'center',
              width: 50,
            },
            {
              title: '学号',
              key: 'studentNo',
              align: 'center',
              minWidth:60,
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
              title: '手机号码',
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
        onChangeGrade(val){
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
          if(!this.$Filters.isEmpty(this.search.grade)){
            params.grade = this.search.grade
          }
          if(!this.$Filters.isEmpty(this.search.inClass)){
            params.inClass = this.search.inClass
          }
          if(!this.$Filters.isEmpty(this.search.name)){
            params.name = this.search.name
          }
          if(!this.$Filters.isEmpty(this.search.phone)){
            params.phone = this.search.phone
          }
          if(!this.$Filters.isEmpty(this.search.studentNo)){
            params.studentNo = this.search.studentNo
          }
          this.$fetch(this.$api.platform.PLATFORM_STUDENT_LIST, params).then((res)=> {

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
                if(that.hasStudent(item)){
                  that.$refs.table.objData[j]._isChecked= true;
                }else{
                  that.$refs.table.objData[j]._isChecked= false;
                }
            }
          }
        },

        hasStudent(stu){
          for(let i=0;i<this.selList.length;i++){
            let sel=this.selList[i];
            if(sel==stu.id){
              return true;
            }
          }
          return false;
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

        selectStudents(selection){
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

        emitSelectStudent(){
          this.$emit('selectStudentsItem',this.selection)
        }
      },
      created() {

      },
      mounted() {
        this.gradeList = util.getLocal("grades")
        this.getAreaList()
      },
    }
</script>

<style scoped>

</style>
