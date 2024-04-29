<template>
  <div style="padding: 20px;background: #f5f5f5;">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width: 90px"  @click="addContent">+添加</Button>
      <span></span>
      <div style="float: right;display: flex;flex-direction: row;">
        <Select  v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea" clearable :disabled="this.$util.getSession('username') != 'admin'" style="margin-right: 5px;width: 120px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <DatePicker type="daterange" size="small" v-model='search.timeRange' split-panels placeholder="开始时间和结束时间" style="width: 220px;margin-right: 5px;"></DatePicker>
        <Input clearable v-model="search.title" placeholder="请输入标题关键字"   style="width: 150px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.content" placeholder="请输入内容关键字"   style="width: 150px;margin-right: 5px;"></Input>

        <Button type="primary" style="width: 90px;"  @click="doSearch">查询</Button>

      </div>
    </Row>
    <Row>
      <i-col span='24'>
        <div class='uc-table'>
          <i-table border :columns="columns" :data="tableList" :stripe="true" v-show="!($Filters.isShowNoDataView(tableList,this))" @on-row-click=""></i-table>
          <i-table border :columns="columns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(tableList,this)"></i-table>
        </div>
      </i-col>
    </Row>
    <div style="width: 100%;margin-top: 10px!important;padding-right: 10px;display: flex;flex-direction: column">
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
      width="850"
      height="800"
      ok-text = '保存'
      cancel-text = '取消'>
      <Form   label-position="top">
        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="标题：">
              <Input v-model="obj.title" placeholder="请输入标题(30汉字以内)" :maxlength='30'></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="类型：">
              <Select v-model="obj.type" placeholder="请选择类型" label-in-value @on-change="">
                <Option v-for="(item,index) in typeArr"
                        :value="item.label"
                        :label="item.label"
                        :key="item.value">
                  {{item.label}}
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <NoticeEditor
          ref="editor"
        >
        </NoticeEditor>

        <div  style="margin-top: 20px;margin-bottom: 24px;display: flex;align-items: flex-start;justify-content: space-between;">
          <span style="width: 100px;">添加附件：</span>
          <Upload
            ref="upload"
            multiple
            :before-upload="uploadAttach"
            action=""
            :default-file-list="attachList"
            :on-remove="removeAttach"
            >
            <Button v-if="attachList.length < 5" type="primary" style="width: 90px;">添加</Button>
          </Upload>
        </div>
        <div  style="margin-top: 20px;margin-bottom: 24px;display: flex;flex-direction: column;">
          <span style="width: 200px;">可见范围：</span>
          <div  style="margin-top: 10px;margin-bottom: 5px;display: flex;align-items: center;justify-content: space-between;">
            <span style="width: 100px;">校区：</span>
            <Select v-model="obj.areaId" placeholder="请选择校区" :disabled="this.$util.getSession('username') != 'admin'"  @on-change="onChangeAreaSelect">
              <Option v-for="(item,index) in areaList"
                      :value="item.id"
                      :label="item.name"
                      :key="item.id">
              </Option>
            </Select>
          </div>
          <div  style="margin-top: 5px;margin-bottom: 5px;display: flex;align-items: center;justify-content: space-between;">
            <span style="width: 100px;">角色：</span>
            <Select v-model="obj.roleId" placeholder="请选择角色"  @on-change="onChangeRole">
              <Option v-for="(item,index) in roleArr"
                      :value="item.value"
                      :label="item.label"
                      :key="item.value">
              </Option>
            </Select>
          </div>
          <div  style="margin-top: 5px;margin-bottom: 5px;display: flex;align-items: center;justify-content: space-between;">
            <span style="width: 100px;">人员分组：</span>
            <Input v-model="haveChooseInfo" placeholder="全部" :readonly="true" >
              <Button  slot="append" icon="md-add" @click="addPersonGroup"></Button>
            </Input>
          </div>
        </div>

        <Row style="justify-content: space-between;margin-top: 20px;margin-bottom: 24px;">
          <Col span="11">
            <FormItem label="是否置顶：">
              <i-switch v-model="obj.top"   size="large" :true-value="true" :false-value="false" @on-change="topChanged">
                <div slot="close"><span>否</span></div>
                <div slot="open"><span>是</span></div>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="要求接收方签字确认：">
              <i-switch v-model="obj.sign"   size="large" :true-value="true" :false-value="false" @on-change="signChanged">
                <div slot="close"><span>否</span></div>
                <div slot="open"><span>是</span></div>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
      </Form>

    </Modal>


    <Modal
      title="公告预览"
      v-model="showPreviewModel"
      :mask-closable="false"
      :footer-hide="true"
      width="850">
      <div v-html="previewHtml">
      </div>

      <div style="display: flex;flex-direction: column;" v-if="attachFiles.length > 0">
        <div style="display: flex;border-bottom: 1px solid #999999;width: 100%;margin-top: 30px;margin-bottom: 20px;"></div>
        <span style="color:#333333;font-size: 20px;font-weight: bold">附件：</span>

        <div style="display: flex;justify-content: flex-start;align-items: center;width: 100%;margin-bottom: 30px;flex-wrap: wrap;">
          <a style="color:#5599e5;font-size: 18px;margin-right: 30px;text-decoration-line:underline" @click="download(item.url,item.name)"  v-for="item in attachFiles"><Icon type="md-attach" />{{item.name}}</a>
        </div>
      </div>
    </Modal>

    <Modal
      title="选择教工"
      v-model="selectStaffModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="selectStaffOk"
      :loading="loading"
      width="800">
      <StaffSelect
        ref="selStaff"
        @selectEmployeeItem="selectItem">
      </StaffSelect>
    </Modal>

    <Modal
      title="选择学生"
      v-model="selectStudentModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="selectStudentOk"
      :loading="loading1"
      width="1200">
      <StudentSelect
        ref="selStudent"
        @selectStudentsItem="selectStudents">
      </StudentSelect>
    </Modal>


    <Modal
      title="人员列表"
      v-model="showReadStatusModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="cancelReadStatusModel"
      width="800">
      <div slot="header" style="display: flex;justify-content: space-between;align-items: center;height: 25px;">
        <span style="color:#333333;font-size: 16px;font-weight: bold">签收情况</span>
        <div style="margin-right: 70px;">
          <span style="color:#0000ff;font-size: 16px;">{{readCnt}}</span>人已读 / <span style="color:#ff0000;font-size: 16px;">{{notReadCnt}}</span>人未读
        </div>
      </div>
      <Row>
        <i-col span='24'>
          <div class='uc-table'>
            <i-table border :columns="columns1" :data="readList" :stripe="true" v-show="!($Filters.isShowNoDataView(readList,this))" @on-row-click=""></i-table>
            <i-table border :columns="columns1" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(readList,this)"></i-table>
          </div>
        </i-col>
      </Row>
      <div style="width: 100%;margin-top: 10px!important;padding-right: 10px;display: flex;flex-direction: column">
        <Page
          :total="page1.total"
          show-total
          size="small"
          :page-size="page1.size"
          :current="page1.current"
          show-elevator
          @on-change='pageChanged1'>
        </Page>
      </div>
    </Modal>

  </div>
</template>

<script>
  import util from "@/libs/util.js";
  // import ContentEditor from  "./ContentEditor";
  import NoticeEditor from  "./NoticeEditor";
  import StaffSelect from '../sysParams/StaffSelect'
  import StudentSelect from '../sysParams/StudentSelect'

  export default {
    name: "NoticeManageIndex",
    components: {
      // ContentEditor,
      NoticeEditor,
      StaffSelect,
      StudentSelect,
    },
    props:[''],
    data() {
      return {
        search:{
          areaId:'',
          title:'',
          content:'',
          timeRange:['',''],
        },
        page:{
          current:1,
          size:20,
          total:0,
        },

        typeArr:[
          {
            value:'6',
            label:'文件签收',
          },
          {
            value:'1',
            label:'校园资讯',
          },
          {
            value:'2',
            label:'通知公告',
          },
          {
            value:'3',
            label:'政策法规',
          },
          {
            value:'4',
            label:'服务标准',
          },
          {
            value:'5',
            label:'教务通知',
          },
        ],
        roleArr:[
          {
            value:'0',
            label:'全部',
          },
          {
            value:'1',
            label:'教职工',
          },
          {
            value:'2',
            label:'学生',
          },
        ],

        areaList:[],
        attachList:[],
        attachItem:[],

        placeTypeList:[],
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
            title: '发布时间',
            minWidth: 100,
            key: 'createTime',
            align: 'center'
          },
          {
            title: '校区',
            key: 'areaName',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '类型',
            key: 'type',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '是否置顶',
            key: 'enable',
            minWidth: 60,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.top == 1 ? '是' : '否')
            }
          },
          {
            title: '标题',
            key: 'title',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '可见范围',
            key: 'visibleRange',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '附件数',
            key: 'attachCnt',
            width: 70,
            align: 'center',
            render: (h, params) => {
              let that=this;
              let attachCnt = params.row.attachments!= null?params.row.attachments.length:0
              return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },attachCnt)
                ]);
              // if(attachCnt == 0){
              //   return h('div', [
              //     h('div',{
              //       // class:'fontColor',
              //     },attachCnt)
              //   ]);
              // }else{
              //   return h('div', [
              //     h('a',{
              //       class:'fontColor',
              //       style:{
              //         textDecoration:'underline'
              //       },
              //       on: {
              //         click:e => {
              //           e.stopPropagation();
              //           that.showStaff(params.row);
              //         }
              //       }
              //     },attachCnt)
              //   ]);
              // }
            }
          },
          {
            title: '已读人数',
            key: 'readCount',
            width: 70,
            align: 'center',
            render: (h, params) => {
              let that=this;
              if(params.row.readCount == 0){
                return h('div', [
                  h('div',{
                    // class:'fontColor',
                  },params.row.readCount)
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
                        that.showReadStatusList(params.row.id);
                      }
                    }
                  },params.row.readCount)
                ]);
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              let that=this;
              return h('a', [
                h('a', {
                  on: {
                    click:e => {
                      e.stopPropagation();
                      that.previewItem(params.index,params.row);
                    }
                  }
                }, '预览'),
                h('Divider', {props: {type: 'vertical'}}),
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
                        content: '确定删除该公告？\n删除后将不再可见，请谨慎操作！',
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

        obj:{},

        showModal:false,
        title:'',
        submitLoading:true,
        showPreviewModel:false,
        previewHtml:'',
        attachFiles:[],

        haveChooseInfo:'全部',

        selectStaffModel:false,
        loading:true,
        empSelectList:[],//选择的教职工列表

        selectStudentModel:false,
        loading1:true,
        stuSelectList:[],//选择的学生列表

        showReadStatusModel:false,
        readList:[],//签收情况列表
        columns1: [
          {
            title: '序号',
            key: 'id',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            minWidth: 80,
            key: 'userName',
            align: 'center'
          },
          {
            title: '手机账号',
            key: 'userPhone',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '阅读时间',
            key: 'readTime',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '手写签字图',
            key: 'signRecord',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return h('img',{
                attrs:{src:(params.row.signRecord)},
                style:{width:'50px',height:'38px',padding:'3px 0px 3px 0px'},
              });
            },
          },
          // {
          //   title: '提醒',
          //   key: 'remind',
          //   minWidth: 100,
          //   align: 'center',
          //   // render: (h, params) => {
          //   //   return h('span', params.row.top == 1 ? '是' : '否')
          //   // }
          // },
        ],
        page1:{
          current:1,
          size:20,
          total:0,
        },
        readCnt:0,
        notReadCnt:0,
        noticeId:'',
      }
    },
    computed: {},
    watch: {},
    methods: {
      doSearch(){
        this.page.current = 1
        this.getListData()
      },
      pageChanged(page){
        this.page.current = page
        this.getListData()
      },
      onChangeArea(value){
        this.search.areaId = value;
        this.doSearch()
      },
      topChanged(value){
        this.obj.top = value;
      },
      signChanged(value){
        this.obj.sign = value;
      },
      uploadAttach(file){
        let reader = new FileReader()
        reader.readAsDataURL(file)
        let that = this;
        reader.onload=((e)=>{
          if(that.attachList.length< 5){
            file.url = reader.result
            that.attachList.push(file)
            console.log(that.attachList)
          }else{
            this.$Message.error('最多上传5个附件')
            return false;
          }
        })
        return false;
      },
      removeAttach(file){
        const fileList = this.attachList;
        this.attachList.splice(fileList.indexOf(file), 1);
      },
      getListData() {
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          identityId: this.$util.getSession("memberId"),
          identityType: this.$util.getSession("userType"),
          collegeId: this.$util.getLocal("schoolId") ,
          pageNum:this.page.current,
          pageSize:this.page.size,
        }
        if(!this.$Filters.isEmpty(this.search.areaId)){
          params.areaId = this.search.areaId
        }
        if(!this.$Filters.isEmpty(this.search.title)){
          params.title = this.search.title
        }
        if(!this.$Filters.isEmpty(this.search.content)){
          params.content = this.search.content
        }
        if(!this.$Filters.isEmpty(this.search.timeRange[0])){
          params.startDate = this.$moment(this.search.timeRange[0]).format('YYYY-MM-DD')
        }
        if(!this.$Filters.isEmpty(this.search.timeRange[1])){
          params.endDate = this.$moment(this.search.timeRange[1]).format('YYYY-MM-DD')
        }
        this.$fetch(this.$api.notice.NOTICE_GET_ALL_LIST, params).then((res)=> {

          if (res.code == 200) {
            console.log(res);
            this.$Message.success("请求完成！");
            let bodyData=res.body;
            this.tableList=bodyData.list;
            this.page.current=Number(bodyData.curPage);
            this.page.total=Number(bodyData.totalCount);
            this.page.size=Number(bodyData.pageSize);
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

      onChangeAreaSelect(value){
        this.obj.areaId = value;
        this.empSelectList = []
        this.stuSelectList = []
        this.haveChooseInfo = '全部'
      },
      onChangeRole(value){
        this.obj.roleId = value;
        this.obj.groupId = ''
        this.empSelectList = []
        this.stuSelectList = []
        this.haveChooseInfo = '全部'
      },
      addPersonGroup(){
        if(this.$Filters.isEmpty(this.obj.roleId) || this.obj.roleId == '0' ){
          this.$Message.info('请先选择角色为教职工或学生');
          return;
        }else if(this.obj.roleId == '1'){
          if(!this.$Filters.isEmpty(this.obj.areaId)){
            this.$refs.selStaff.search.areaId = this.obj.areaId
          }
          let sel = []
          // if(this.empSelectList.length > 0){
          //   this.empSelectList.forEach(function (item) {
          //     sel.push(item.id)
          //   })
          // }
          if(!this.$Filters.isEmpty(this.obj.groupId)){
            sel = this.obj.groupId.split(',')
          }

          this.$refs.selStaff.selList = sel
          this.$refs.selStaff.getListData()
          this.selectStaffModel = true
        }else if(this.obj.roleId == '2'){
          if(!this.$Filters.isEmpty(this.obj.areaId)){
            this.$refs.selStudent.search.areaId = this.obj.areaId
          }
          let sel = []
          // if(this.stuSelectList.length > 0){
          //   this.stuSelectList.forEach(function (item) {
          //     sel.push(item.id)
          //   })
          // }
          if(!this.$Filters.isEmpty(this.obj.groupId)){
            sel = this.obj.groupId.split(',')
          }

          this.$refs.selStudent.selList = sel
          this.$refs.selStudent.getListData()
          this.selectStudentModel = true
        }
      },

      selectStaffOk(){
        this.$refs.selStaff.emitSelectEmployee();
        if(this.empSelectList.length > 0){
          console.log('selemp==='+this.empSelectList.length)
          this.obj.groupId = ''
          for(let i=0;i<this.empSelectList.length;i++){
            this.obj.groupId += this.empSelectList[i].id+','
          }
          if(this.obj.groupId.endsWith(',')){
            this.obj.groupId = this.obj.groupId.slice(0,-1)
          }
          this.haveChooseInfo = '已选择'+this.empSelectList.length+'个教职工'
        }
        this.empSelectList = []
        this.selectStaffModel = false;

      },
      selectItem(item){
        this.empSelectList = item;
      },

      selectStudentOk(){
        this.$refs.selStudent.emitSelectStudent();
        if(this.stuSelectList.length > 0){
          console.log('selStu==='+this.stuSelectList.length)
          this.obj.groupId = ''
          for(let i=0;i<this.stuSelectList.length;i++){
            this.obj.groupId += this.stuSelectList[i].id+','
          }
          if(this.obj.groupId.endsWith(',')){
            this.obj.groupId = this.obj.groupId.slice(0,-1)
          }

          this.haveChooseInfo = '已选择'+this.stuSelectList.length+'个学生'
        }
        this.stuSelectList = []
        this.selectStudentModel = false;
      },
      selectStudents(item){
        this.stuSelectList = item;
      },



      addContent(){
        this.obj = {
        }
        this.attachList = []
        this.obj.groupId = ''
        this.haveChooseInfo = '全部'
        this.$refs.editor.html = ''
        if(this.$util.getSession('username') != 'admin'){
          this.obj.areaId = this.$util.getSession("user").areaId
        }
        this.title = '新增 / 通知公告'
        this.showModal = true;
      },


      previewItem(index,item){
        this.previewHtml = item.text
        this.attachFiles = []
        if(item.attachments != null && item.attachments.length > 0){
          this.attachFiles = item.attachments
        }

        this.showPreviewModel = true;
      },


      download(content, filename) {
        // 创建隐藏的可下载链接
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      },


      EditItem(index,item){
        this.obj = {}
        this.obj.id = item.id
        this.obj.collegeId = item.collegeId
        this.obj.title = item.title
        this.$refs.editor.html = item.text
        this.obj.areaId = item.areaId
        this.obj.type = item.type
        this.obj.roleId = item.roleId+''
        this.obj.groupId = item.groupId
        if(this.obj.groupId.endsWith(',')){
          this.obj.groupId = this.obj.groupId.slice(0,-1)
        }
        this.obj.top = item.top == 1?true:false
        this.obj.sign = item.sign == 1?true:false

        if(this.obj.roleId == '0'){
          this.haveChooseInfo = '全部'
        }else if(this.obj.roleId == '1'){
          if(this.$Filters.isEmpty(this.obj.groupId)){
            this.haveChooseInfo = '全部'
          }else{
            let arr = this.obj.groupId.split(',')
            this.haveChooseInfo = '已选择'+arr.length+'个教职工'
          }
        }else if(this.obj.roleId == '2'){
          if(this.$Filters.isEmpty(this.obj.groupId)){
            this.haveChooseInfo = '全部'
          }else{
            let arr = this.obj.groupId.split(',')
            this.haveChooseInfo = '已选择'+arr.length+'个学生'
          }
        }

        this.attachList = []
        if(null != item.attachments && item.attachments.length > 0){
          let aLi = item.attachments
          let arr = []
          for(let i = 0; i< aLi.length; i++){
            let atta = aLi[i]
            arr.push({
                id:atta.id,
                name:atta.name,
                url:atta.url,
            })
          }
          this.attachList = arr
        }

        this.title = '编辑 / 通知公告'
        this.showModal = true;
      },


      submit(){
        if(this.$Filters.isEmpty(this.obj.title)){
          this.$Message.error("标题不能为空");
          this.$refs.modal.buttonLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.obj.type)){
          this.$Message.error("类型不能为空");
          this.$refs.modal.buttonLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.$refs.editor.html)){
          this.$Message.error("公告内容不能为空");
          this.$refs.modal.buttonLoading=false;
          return;
        }
        if(this.$Filters.isEmpty(this.obj.areaId)){
          this.$Message.error("校区不能为空");
          this.$refs.modal.buttonLoading=false;
          return;
        }

        console.log(this.obj)
        this.$load.show();
        this.attachItem = []
        if(this.attachList.length > 0){
          let count = 0;
          this.postAttach(this.attachList,count);
        }else{
          this.submitConfig();
        }

      },


      postAttach(image,num){
        let that = this
        if(image == undefined){
          this.submitConfig();
          return;
        }
        if(image[num].size == undefined){
          this.attachItem.push({
            id:image[num].id,
          })
          num ++;
          if(num < image.length){
            this.postAttach(this.attachList,num);
          }else{
            this.submitConfig();
          }
          return;
        }
        let imageData=new FormData();
        imageData.append("attachments",image[num]);
        imageData.append("userId",this.$util.getSession("user").id);
        imageData.append("tokenId",this.$util.getSession("token").id);
        this.$post(this.$api.uploadImage.UPLOAD_ATTACHMENT,{},imageData)
          .then((res) => {
            this.$load.hide();
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            num ++;
            that.attachItem.push({
              id:res.body[0].id,
            })
            if(num < image.length){
              that.postAttach(that.attachList,num);
            }else{
              that.submitConfig();
            }
          })
          .catch((err) => {
            this.$Message.error(err.message);
            this.$load.hide();
          })
      },


      submitConfig(){
        let noticeItem = {
          id: this.obj.id,
          collegeId: this.$util.getLocal("schoolId"),
          areaId:this.obj.areaId,
          title: this.obj.title,
          type: this.obj.type,
          text: this.$refs.editor.html,
          roleId:this.obj.roleId,
          groupId:this.obj.groupId,
          top:this.obj.top?1:0,
          sign:this.obj.sign?1:0,
          creator:util.getSession("user").id,
        }

        if(this.attachItem.length != 0){
          let idArr=[];
          for (let i=0;i<this.attachItem.length;i++){
            idArr.push(this.attachItem[i].id)
          }
          noticeItem.attachmentIds = idArr.join(",");
        }

        if(!this.$Filters.isEmpty(noticeItem.id)){
          this.Update(noticeItem);
        }else{
          this.Insert(noticeItem);
        }
        this.obj= {}
        this.showModal = false;
      },

      Insert(item){
        this.$post(this.$api.notice.NOTICE_INSERT, {
          tokenId: util.getSession("token").id,
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');
            this.getListData();
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

      Update(item){
        this.$put(this.$api.notice.NOTICE_UPDATE, {
          tokenId: util.getSession("token").id,
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');
            this.getListData();
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

      delete(id){
        let that = this
        this.$delete(this.$api.notice.NOTICE_DELETE, {
          tokenId: this.$util.getSession("token").id,
          identityId: this.$util.getSession("memberId"),
          identityType: this.$util.getSession("userType"),
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

      showReadStatusList(noticeId){
        this.noticeId = noticeId
        this.getReadListData(noticeId)
        this.getReadListDataCounts(noticeId)
        this.showReadStatusModel = true
      },

      cancelReadStatusModel(){
        this.noticeId = ''
        this.showReadStatusModel = false
      },

      pageChanged1(page){
        this.page1.current = page
        this.getReadListData(this.noticeId)
      },
      getReadListData(noticeId) {
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          identityId: this.$util.getSession("memberId"),
          identityType: this.$util.getSession("userType"),
          noticeId: noticeId ,
          pageNum:this.page1.current,
          pageSize:this.page1.size,
        }
        this.$fetch(this.$api.notice.NOTICE_GET_READ_LIST, params).then((res)=> {

          if (res.code == 200) {
            console.log(res);
            this.$Message.success("请求完成！");
            let bodyData=res.body;
            this.readList=bodyData.list;
            this.page1.current=Number(bodyData.curPage);
            this.page1.total=Number(bodyData.totalCount);
            this.page1.size=Number(bodyData.pageSize);
          } else{
            this.$Message.error(res.message);
          }
          this.$load.hide();
        }).catch((err)=>{
          this.readList = [];
          this.$Message.error(err);
          this.$load.hide();
        });
      },

      getReadListDataCounts(noticeId) {
        this.$load.show();
        let params = {
          tokenId: this.$util.getSession("token").id,
          identityId: this.$util.getSession("memberId"),
          identityType: this.$util.getSession("userType"),
          noticeId: noticeId ,
        }
        this.$fetch(this.$api.notice.NOTICE_GET_READ_LIST_COUNTS, params).then((res)=> {

          if (res.code == 200) {
            console.log(res);
            // this.$Message.success("请求完成！");
            let bodyData=res.body;
            this.readCnt=Number(bodyData.read);
            this.notReadCnt=Number(bodyData.notRead);
          } else{
            this.$Message.error(res.message);
          }
          this.$load.hide();
        }).catch((err)=>{
          this.readCnt = 0
          this.notReadCnt = 0
          this.$Message.error(err);
          this.$load.hide();
        });
      },


      getAreaList() {
        let that = this
        let params = {
          tokenId: util.getSession("token").id,
          schoolId: util.getLocal("schoolId"),
          enable:1,
        }

        this.$fetch(this.$api.platform.PLATFORM_AREA_LIST, params).then((res)=> {
          if (res.code == 200) {
            console.log(res);
            if(undefined != res.body){
              that.areaList.push({
                id:'0',
                name:'全部',
              })
              that.areaList= that.areaList.concat(res.body);
            }else{
              that.areaList=[];
            }
          }

        }).catch((err)=>{
          that.areaList = [];
        });
      },
    },
    created() {

    },
    mounted() {
      this.getAreaList();
      if(this.$util.getSession('username') != 'admin'){
         this.search.areaId = this.$util.getSession("user").areaId
      }
      this.getListData();


    },
  }
</script>


<style scoped lang="less">
  @deep: ~'>>>';
  @{deep}.ivu-card-body {
    padding: 10px !important;
  }
  @{deep}.ivu-table{
    background: #ffffff;
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(72vh - 10px)!important;
    }
  }
  @{deep}.ivu-upload-select {
    float: right;
  }
  @{deep}.ivu-upload-list {
    margin-top: 0px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
</style>
