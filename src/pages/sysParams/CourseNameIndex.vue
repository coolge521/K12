<template>
  <div style="padding: 20px;background: #f5f6f7;">
    <Row style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" @click="add">+添加</Button>
      <div style="float: right">
        <Select v-model="search.subjectId" placeholder="请选择科目"  @on-change="onChangeSubject" clearable style="margin-right: 5px;width: 150px;">
          <Option v-for="(item,index) in subjectList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <Select v-model="search.grade" placeholder="请选择年级"  @on-change="onChangeGrade" clearable style="margin-right: 5px;width: 150px;">
          <Option v-for="(item,index) in gradeList"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
          </Option>
        </Select>
        <Input clearable v-model="search.courseName" placeholder="请输入课程名称关键字"   style="width: 200px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.textbook" placeholder="请输入教材名称关键字"   style="width: 200px;margin-right: 5px;"></Input>
        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="doSearch">查询</Button>
      </div>
    </Row>
    <Row style="background: #ffffff;">
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
        <FormItem label="课程名称:" prop="name">
          <Input type="text" v-model="obj.name" placeholder="请输入课程名称">
          </Input>
        </FormItem>
        <FormItem label="排序码">
          <InputNumber :max="9999" :min="1" v-model="obj.sort" placeholder="排序码" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem label="所属科目">
          <Select v-model="obj.subjectId" placeholder="请选择所属科目"   clearable style="margin-right: 5px;">
            <Option v-for="(item,index) in subjectList"
                    :value="item.id"
                    :label="item.name"
                    :key="item.id">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="适用年级">
          <Select v-model="obj.grade" placeholder="请选择年级"  label-in-value  @on-change="onSelectGrade" clearable style="margin-right: 5px;">
            <Option v-for="(item,index) in gradeList"
                    :value="item.code"
                    :label="item.name"
                    :key="item.code">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="教材" >
          <Input v-model="obj.textbook" placeholder="请输入教材"></Input>
        </FormItem>
        <FormItem label="教材出版社" >
          <Input v-model="obj.publisher" placeholder="请输入教材出版社"></Input>
        </FormItem>
        <FormItem label="备注说明">
          <Input
            v-model="obj.remark"
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
    name: "CourseNameIndex",
    components: {},
    data() {
      return {
        search:{
          grade:'',
          courseName:'',
          textbook:'',
          subjectId:'',
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
            title: '课程名称',
            key: 'name',
            align: 'center',
            minWidth:100,
          },
          {
            title: '排序码',
            key: 'sort',
            align: 'center',
            width: 60,
          },
          {
            title: '教材',
            key: 'textbook',
            align: 'center',
            minWidth:100,
          },
          {
            title: '教材出版社',
            key: 'publisher',
            align: 'center',
            minWidth:100,
          },
          {
            title: '适用年级',
            key: 'gradeName',
            align: 'center',
            width: 80,
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
          },
          {
            title: '最新维护时间',
            align: 'center',
            minWidth:100,
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
            minWidth:100,
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
            width: 120,
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
        gradeList:[],
        subjectList:[],

        obj: {},
        title:'',
        showModal:false,
        submitLoading:false,
      }
    },
    computed: {},
    watch: {},
    methods: {
      onChangeSubject(val){
        this.doSearch();
      },
      onChangeGrade(val){
        this.doSearch();
      },
      onSelectGrade(item){
        if(item != undefined){
          this.obj.grade = item.value;
          this.obj.gradeName = item.label;
        }else{
          this.obj.grade = '';
          this.obj.gradeName = '';
        }
      },
      doSearch(){
        this.page.current = 1
        this.getListData()
      },
      pageChanged(page){
        this.page.current=page;
        this.getListData();
      },
      getListData(){
        this.$load.show();
        let params = {
          schoolId: util.getLocal("schoolId"),
          tokenId: util.getSession("token").id,
          curPage: this.page.current,
        }
        if(!this.$Filters.isEmpty(this.search.grade)){
          params.grade = this.search.grade
        }
        if(!this.$Filters.isEmpty(this.search.courseName)){
          params.courseName = this.search.courseName
        }
        if(!this.$Filters.isEmpty(this.search.textbook)){
          params.textbook = this.search.textbook
        }
        if(!this.$Filters.isEmpty(this.search.subjectId)){
          params.subjectId = this.search.subjectId
        }
        this.$fetch(this.$api.platform.PLATFORM_COURSE_LIST, params).then((res)=> {
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
            this.list=[];
            this.$Message.error(err);
            this.$load.hide();
          });
      },

      add(){
        this.obj = {}
        this.obj.sort = this.list.length+1,
        this.obj.schoolId = this.$util.getLocal("schoolId")
        this.title="新增课程";
        this.showModal=true;
      },
      save(){
        this.submitLoading=true;
        if(this.$Filters.isEmpty(this.obj.name)){
          this.$Message.error("请输入课程名称");
          this.submitLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.obj.sort)){
          this.$Message.error("请输入排序码");
          this.submitLoading=false;
          return;
        }

        let course = {
          id: this.obj.id,
          name: this.obj.name,
          remark: this.obj.remark,
          sort: this.obj.sort,
          grade: this.obj.grade,
          gradeName: this.obj.gradeName,
          textbook: this.obj.textbook,
          publisher: this.obj.publisher,
          subjectId: this.obj.subjectId,
          schoolId: this.obj.schoolId,
          operatorId:this.$util.getSession("user").id,
        }

        this.$post(this.$api.platform.PLATFORM_COURSE_SAVE, {
          tokenId: util.getSession("token").id,
        },course).then((res)=> {
          if (res.code == 200) {
            console.log(res);
            this.$Message.success("操作成功");
            this.submitLoading=false;
            this.showModal=false;
            this.getListData();
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
          content: '您确定要删除该课程吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          loading:true,
          onOk() {
            this.$delete(this.$api.platform.PLATFORM_COURSE_DELETE, {
              tokenId: this.$util.getSession("token").id,
              userId: this.$util.getSession("user").id,
              id: id
            }).then((res)=> {
              if (res.code == 200) {
                this.$Message.success('成功删除!');
                this.$Modal.remove();
                that.getListData();
              }
            });
          }
        })
      },

      edit(row){
        this.title="编辑课程";
        this.obj=JSON.parse(JSON.stringify(row));
        this.showModal=true;
      },

      getSubjectList() {
        let params = {
          tokenId: util.getSession("token").id,
          schoolId: util.getLocal("schoolId"),
        }

        this.$fetch(this.$api.platform.PLATFORM_SUBJECT_LIST, params).then((res)=> {
          if (res.code == 200) {
            console.log(res);
            if(undefined != res.body){
              this.subjectList=res.body;
            }else{
              this.subjectList=[];
            }
          }

        }).catch((err)=>{
          this.subjectList = [];
        });
      },


    },
    created() {
    },
    mounted() {
      this.gradeList = util.getLocal("grades")
      this.getSubjectList()
      this.getListData();
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
