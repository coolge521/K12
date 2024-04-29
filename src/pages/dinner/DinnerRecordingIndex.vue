<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <div style="display: flex;justify-content: flex-start;align-items: center;">
        共<span style="color:#5599e5">{{peopleCount}}</span>人，<span style="color:#5599e5">{{checkedCount}}</span>人已登记，<span style="color:#ff0000">{{notCheckedCount}}</span>人未登记
      </div>
      <div style="float: right;display: flex;flex-direction: row;align-items: center;justify-content: flex-end;">
        <Select v-model="search.grade" placeholder="请选择年级"  @on-change="onChangeGrade" clearable style="margin-right: 5px;width: 120px;">
          <Option v-for="(item,index) in gradeList"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
          </Option>
        </Select>
        <Input clearable v-model="search.inClass" placeholder="请输入班级"   style="width: 100px;margin-right: 5px;"></Input>
        <DatePicker v-model="search.date"  :editable="false" type="date"   split-panels :options="options"
                    :clearable='false' format="yyyy-MM-dd" style="width: 150px;margin-right: 5px;"
                    placeholder="请选择用餐日期"  @on-change="dateChange"></DatePicker>

        <Select v-model="search.timeZoneId" placeholder="请选择用餐时段"  @on-change="onChangeTimeZone" clearable style="margin-right: 5px;width: 140px;">
          <Option v-for="(item,index) in timeZoneList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>

        <Input clearable v-model="search.content" placeholder="请输入学生姓名"   style="width: 120px;margin-right: 5px;"></Input>

        <Button type="primary" style="width: 90px;margin-right: 5px;"  @click="doSearch">查询</Button>
        <Button v-if="!isMultiEdit" type="primary" style="width: 90px;"  @click="multiEdit">批量编辑</Button>
        <Button v-else type="primary" style="width: 90px;"  @click="multiEditSave">一键保存</Button>

      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div>
          <i-table border :columns="columns" :data="tableList" :stripe="true" v-show="!($Filters.isShowNoDataView(tableList,this))" @on-row-click=""></i-table>
          <i-table border :columns="columns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(tableList,this)"></i-table>
        </div>
      </i-col>
    </Row>

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
      height="800"
      ok-text = '保存'
      cancel-text = '取消'>
      <Form  :label-width="100" label-position="left">
        <FormItem label="用餐情况：">
          <RadioGroup v-model="obj.eat" style="font-size: 14px;"  @change="rgChanged">
            <Radio :label=0 style="font-size: 14px;" ><span>未用餐</span></Radio>
            <Radio :label=1 style="font-size: 14px;" ><span>已用餐</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="情况说明：">
          <Input v-model="obj.mark" placeholder="请输入说明"></Input>
        </FormItem>
      </Form>

    </Modal>

  </div>
</template>

<script>

  import ucApi from "@/libs/ucApi.js";
  import util from "@/libs/util.js";
    export default {
      name: "DinnerRecordingIndex",
      data() {
        let that = this
        return {
          search:{
            grade:'',
            inClass:'',
            date:'',
            timeZoneId:'',
            content:'',
          },
          options: {
            disabledDate (date) {
              return date && date.valueOf() > that.$moment(that.$moment().format('YYYY-MM-DD')).valueOf();
            }
          },
          isMultiEdit: false,

          peopleCount:0,
          checkedCount:0,
          notCheckedCount:0,

          gradeList:[],
          timeZoneList:[],
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
              title: '年级',
              key: 'userGradeName',
              align: 'center',
              minWidth: 100,
            },
            {
              title: '班级',
              key: 'userClass',
              align: 'center',
              minWidth: 100,
            },
            {
              title: '学号',
              key: 'studentNo',
              align: 'center',
              minWidth: 100,
            },
            {
              title: '人员姓名',
              key: 'userName',
              align: 'center',
              minWidth: 100,
            },
            {
              title: '用餐时段',
              key: 'timeZoneName',
              align: 'center',
              minWidth: 100,
            },
            {
              title: '用餐情况',
              key: 'eat',
              align: 'center',
              minWidth: 140,
              render: (h, params) => {
                let that=this;
                if(this.isMultiEdit){
                  return h('div', [
                    h('RadioGroup', {
                      style: {
                        color:"#333333"
                      },
                      props:{
                        value:params.row.eat,
                        required:false,
                      },
                      on: {
                        'on-change': (status) => {
                          //备注：  不要用params。row来修改数据
                          //table根据data来变更。当前行数据的修改不会反馈到后台script里的数据
                          //使用$set能够动态监测
                          // if (status === 'false') {
                            //params.row._expanded = true
                            // this.$set(this.tableList[params.row._index], 'phone', status)
                          // } else {
                            //params.row._expanded = false
                            // this.$set(this.tableList.data[params.row._index], 'phone', false)
                          // }

                          setTimeout(function () {
                            that.tableList[params.index].eat=status;
                          },200)
                        }
                      }
                      },[
                        h('Radio',{
                          style: {
                            color:"#86BC3D"
                          },
                          props:{
                            label: 1,
                          }
                        },'已用餐'),
                        h('Radio',{
                          style: {
                            color:"#DC3849"
                          },
                          props:{
                            label: 0,
                          }
                        },'未用餐')
                      ]
                    )

                    // })
                  ])
                }else{
                  let sta = ''
                  let color = ''
                  if(params.row.eat == 0){
                    sta = '未用餐'
                    color = '#DC3849'
                  }else if(params.row.eat == 1){
                    sta = '已用餐'
                    color = '#86BC3D'
                  }else{
                    sta = '未登记'
                    color = '#999999'
                  }
                  return h('div', [
                    h('span', {
                      'style':{
                        'color':color
                      }
                    }, sta)
                  ]);
                }
              }
            },
            {
              title: '情况说明',
              key: 'mark',
              minWidth: 180,
              tooltip:true,
              align: 'center',
              render: (h, params) => {
                let that=this;
                if(this.isMultiEdit){
                  return h('div', [
                    h('Input', {
                      style: {
                        color:"#333333"
                      },
                      props:{
                        value:params.row.mark,
                        required:false,
                        placeholder:'请输入内容',
                      },
                      on: {
                        input:function (value) {
                          params.row.mark=value;
                          setTimeout(function () {
                            that.tableList[params.index].mark=params.row.mark;
                          },200)
                        }
                      }
                    })
                  ])
                }else{
                  return h('div', [
                    h('span', {
                      'style':{
                        // 'color':'#5599e5'
                      }
                    }, params.row.mark)
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
                  }, '编辑录入'),
                ])
              }
            }
          ],

          showModal:false,
          title:'',
          submitLoading:true,
          obj:{},

        }
      },
      methods: {
        dateChange(value){
          this.search.date=this.$moment(value).format("yyyy-MM-DD");
          this.getListData()
          this.getCountByDate()
        },
        multiEdit(){
          this.isMultiEdit = true
        },
        multiEditSave(){
          // console.log(this.tableList)
          this.submitMultiple()
          this.isMultiEdit = false
        },
        onChangeTimeZone(value){
          this.search.timeZoneId = value;
          this.getListData()
          this.getCountByDate()
        },
        onChangeGrade(val){
          this.getListData()
          this.getCountByDate()
        },
        doSearch(){
          this.getListData()
          this.getCountByDate()
        },
        getListData() {
          this.$load.show();
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId") ,
            date:this.$moment(this.search.date).format('YYYY-MM-DD'),
          }
          if(!this.$Filters.isEmpty(this.search.grade)){
            params.userGrade = this.search.grade
          }
          if(!this.$Filters.isEmpty(this.search.inClass)){
            params.userClass = this.search.inClass
          }
          if(!this.$Filters.isEmpty(this.search.timeZoneId)){
            params.timeZoneId = this.search.timeZoneId
          }
          if(!this.$Filters.isEmpty(this.search.content)){
            params.userName = this.search.content
          }
          this.$fetch(this.$api.food.FOOD_DO_RECORD_GET_LIST, params).then((res)=> {

            if (res.code == 200) {
              console.log(res);
              this.$Message.success("请求完成！");
              let bodyData=res.body;
              this.tableList=bodyData;
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
          this.obj = JSON.parse(JSON.stringify(item))
          this.title = '编辑用餐登记'
          this.showModal = true;
        },
        rgChanged(val){
          this.obj.eat = val
        },


        submit(){
          if(this.$Filters.isEmpty(this.obj.eat)){
            this.$Message.error("请选择用餐情况");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          this.$load.show();
          this.submitObj();

        },

        submitObj(){
          delete this.obj._index
          delete this.obj._rowKey
          this.obj.eatDate = this.$moment(this.search.date).format('YYYY-MM-DD')
          let vo = {
            recordList: [this.obj],
          }

          this.Update(vo);
          this.obj= {}
          this.showModal = false;
        },

        submitMultiple(){
          let date = this.$moment(this.search.date).format('YYYY-MM-DD')
          this.tableList.forEach(function (item) {
              item.eatDate = date
          })
          let vo = {
            recordList: this.tableList,
          }
          this.$load.show();
          this.Update(vo);
        },

        Update(item){
          let that = this
          this.$post(this.$api.food.FOOD_DO_RECORD_POST, {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
          },item).then((res)=> {
            if (res.code == 200) {
              this.$load.hide();
              this.$Message.success('保存成功!');
              that.getListData();
              that.getCountByDate()
            }else{
              this.$load.hide();
              this.$Message.error(res.message);
            }
          });
        },

        cancelModal(){
          this.obj= {}
          this.showModal = false;
        },


        getTimeZoneList() {
          let that = this
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("user").id,
            collegeId: this.$util.getLocal("schoolId") ,
            enable:1,
          }
          this.$fetch(this.$api.food.FOOD_TIME_SETTING_GET_ALL, params).then((res)=> {

            if (res.code == 200) {
              let bodyData=res.body;
              that.timeZoneList=bodyData;
              if(that.timeZoneList.length > 0){
                that.search.timeZoneId = that.timeZoneList[0].id
              }
              that.getListData();
              that.getCountByDate();
            }
          }).catch((err)=>{
            that.timeZoneList = [];
          });
        },

        getCountByDate() {
          let that = this
          let params = {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("memberId"),
            collegeId: this.$util.getLocal("schoolId") ,
            date:this.$moment(this.search.date).format('YYYY-MM-DD'),
          }
          if(!this.$Filters.isEmpty(this.search.grade)){
            params.userGrade = this.search.grade
          }
          if(!this.$Filters.isEmpty(this.search.inClass)){
            params.userClass = this.search.inClass
          }
          if(!this.$Filters.isEmpty(this.search.timeZoneId)){
            params.timeZoneId = this.search.timeZoneId
          }
          if(!this.$Filters.isEmpty(this.search.content)){
            params.userName = this.search.content
          }
          this.$fetch(this.$api.food.FOOD_DO_RECORD_GET_COUNTS, params).then((res)=> {

            if (res.code == 200) {
              let bodyData=res.body;
              that.peopleCount=bodyData.peopleCount;
              that.checkedCount=bodyData.checkedCount;
              that.notCheckedCount=bodyData.notCheckedCount;
            }
          }).catch((err)=>{

          });
        },
      },
      created() {

      },
      mounted() {
        this.gradeList = util.getLocal("grades")
        this.search.date = this.$moment(new Date()).format("yyyy-MM-DD");
        this.getTimeZoneList();

      },
    }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-table{
    @media screen and (max-height: 1800px) and (orientation: landscape){
      height: calc(85vh + 90px)!important;
    }
    @media screen and (max-height: 1200px) and (orientation: landscape){
      height: calc(78vh + 80px)!important;
    }
    @media screen and (max-height: 1080px) and (orientation: landscape){
      height: calc(77vh + 70px)!important;
    }
    @media screen and (max-height: 1024px) and (orientation: landscape){
      height: calc(76vh + 45px)!important;
    }
    @media screen and (max-height: 900px) and (orientation: landscape){
      height: calc(72vh + 65px)!important;
    }
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(68vh + 65px)!important;
    }
  }
</style>
