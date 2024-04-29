<template>
  <div style="padding: 20px;background: #f5f5f5">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">

      <div style="display: flex;flex-direction: column;align-items: center;justify-content: space-between;width: 100%">
        <div style="display: flex;justify-content: space-between;align-items: center;width: 100%">
          <Select v-model="search.areaId" placeholder="选择校区"    style="width: 13%;">
            <Option v-for="(item,index) in areaList"
                    :value="item.id"
                    :label="item.name"
                    :key="item.id">
            </Option>
          </Select>
          <Select v-model="search.channel" placeholder="缴费渠道"  multiple clearable  style="width: 13%;">
            <Option v-for="(item,index) in channelList"
                    :value="item.value"
                    :label="item.label"
                    :key="item.value">
            </Option>
          </Select>
          <Select v-model="search.itemId" placeholder="缴费项目"  clearable style="width: 13%;">
            <Option v-for="(item,index) in payItems"
                    :value="item.id"
                    :label="item.name"
                    :key="item.id">
            </Option>
          </Select>
          <DatePicker type="daterange" size="small" v-model='search.dateRange' split-panels placeholder="开始时间和结束时间" style="width: 13%;"></DatePicker>



          <Select v-model="search.grade" placeholder="请选择年级"  clearable style="width: 13%;">
            <Option v-for="(item,index) in gradeList"
                    :value="item.code"
                    :label="item.name"
                    :key="item.code">
            </Option>
          </Select>
          <!--        <Select v-model="search.class" placeholder="请选择班级"  clearable style="margin-left: 5px;margin-right: 10px;width: 120px;">-->
          <!--          <Option v-for="(item,index) in classList"-->
          <!--                  :value="item.code"-->
          <!--                  :label="item.name"-->
          <!--                  :key="item.code">-->
          <!--          </Option>-->
          <!--        </Select>-->
          <Input clearable v-model="search.class" placeholder="请输入班级"   style="width: 13%;"></Input>
          <Input clearable v-model="search.stuName" placeholder="请输入姓名"   style="width: 13%;"></Input>
        </div>
        <div style="display: flex;justify-content: space-between;align-items: center;width: 100%;padding-top: 5px">

          <Input clearable v-model="search.stuPhone" placeholder="请输入电话"   style="width: 13%;"></Input>
          <Input clearable v-model="search.stuNo" placeholder="请输入学号"   style="width: 13%;"></Input>

          <Select v-model="search.refund" placeholder="是否有退费"  clearable style="width: 13%;">
            <Option :value="2" label="未退费"></Option>
            <Option :value="1" label="有退费"></Option>
          </Select>
          <Input clearable v-model="search.payNum" placeholder="缴费单号"   style="width: 13%;"></Input>


          <div style="width: 13%;display: flex;flex-wrap: nowrap;align-items: center">
            <Checkbox v-model="search.onlyReduced" :false-value="0" :true-value="1" style="width:100px;margin: 0px 5px 5px 0px;font-size: 16px">政府补助</Checkbox>
            <Checkbox v-model="search.schoolMasterReduced" :false-value="0" :true-value="1" style="width:120px;margin: 0px 5px 5px 0px;font-size: 16px">有减免</Checkbox>
          </div>
          <div style="display: flex;width: calc(30% - 2.5%);justify-content: flex-end;align-items: center">
            <Button type="primary" style="width: 80px;margin-right: 5px;"  @click="doSearch">查询</Button>
            <Button type="primary" style="width: 80px;margin-right: 5px;"  @click="exportData">导出</Button>
          </div>

        </div>


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
    <div style="width: 100%;margin-top: 10px!important;padding-right: 10px;display: flex;flex-direction: row;justify-content: space-between">
      <div style="position: absolute;left: 120px;bottom: 40px;z-index: 99">
        <span>总计费用</span>
        <span style="color: red">{{page.strTotalAmount}}</span>
        <span>元</span>
      </div>
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


    <Modal
      v-if="refundDetail!=null"
      title="退费记录"
      v-model="refundDetailModal"
      :width='80'
      :footer-hide="true"
    >
      <div style="padding:10px;display: flex;flex-direction: column">
        <Row>
          <i-col span='6'>
            <span>学生姓名：</span>
            <span>{{refundDetail.stuName}}</span>
          </i-col>
          <i-col span='6'>
            <span>学生学号：</span>
            <span>{{refundDetail.stuNo}}</span>
          </i-col>
          <i-col span='6'>
            <span>年级：</span>
            <span>{{refundDetail.stuGradeName}}</span>
          </i-col>
          <i-col span='6'>
            <span>班级：</span>
            <span>{{refundDetail.stuClass}}</span>
          </i-col>
        </Row>
        <Row>
          <i-col span='6'>
            <span>票据单号：</span>
            <span>{{refundDetail.paidBillNo}}</span>
          </i-col>
          <i-col span='6'>
            <span>缴费项目：</span>
            <span>{{refundDetail.itemName}}</span>
          </i-col>
          <i-col span='6'>
            <span>项目金额(元)：</span>
            <span>{{refundDetail.strReceivables}}</span>
          </i-col>
          <i-col span='6'>
            <span>联系电话：</span>
            <span>{{refundDetail.stuPhone}}</span>
          </i-col>
        </Row>
        <Row>
          <i-col span='6'>
            <span>减免金额(元)：</span>
            <span>{{refundDetail.strRectorDerate}}</span>
          </i-col>
          <i-col span='6'>
            <span>政府补贴(元)：</span>
            <span>{{refundDetail.strDerateAmount}}</span>
          </i-col>
          <i-col span='6'>
            <span>实收金额(元)：</span>
            <span>{{refundDetail.strAmount}}</span>
          </i-col>
          <i-col span='6'>
            <span>退费总金额(元)：</span>
            <span>{{refundDetail.strRefund}}</span>
          </i-col>
        </Row>

        <div class="table">
          <i-table border :columns="refundColumns" :data="refundDetail.details" :stripe="true" v-show="!($Filters.isShowNoDataView(refundDetail.details,this))"></i-table>
          <i-table border :columns="refundColumns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(refundDetail.details,this)"></i-table>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>

  import ucApi from "@/libs/ucApi.js";
  import util from "@/libs/util.js";

  export default {
    components:{},
    name: "RecorderDetail",
    data() {
      return {
        search:{
          areaId:this.$util.getSession('user').areaId,
          channel:[],
          itemId:'',
          grade:'',
          dateRange:['',''],
          class:'',
          stuName:'',
          stuPhone:'',
          stuNo:'',
          onlyReduced:false,
          schoolMasterReduced:false,
          refund:'',
          payNum:'',
        },
        areaList:[],
        channelList:[
          {label:'等待代扣',value:3},{label: '已代扣',value: 1},{label: '自主缴费',value: 2},{label: '线下现金缴费',value: 4},{label: '线下扫码缴费',value: 5}
        ],
        payItems:[],
        gradeList:[],

        page:{
          current:1,
          size:20,
          total:0,
          totalAmount:0,
          strTotalAmount:'',
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
            title: '所属校区',
            minWidth: 150,
            key: 'stuAreaName',
            align: 'center'
          },
          {
            title: '缴费时间',
            minWidth: 150,
            key: 'payTime',
            align: 'center'
          },
          {
            title: '缴费单号',
            minWidth: 220,
            key: 'billNo',
            align: 'center'
          },
          {
            title: '年级',
            minWidth: 90,
            key: 'stuGradeName',
            align: 'center'
          },
          {
            title: '班级',
            key: 'stuClass',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '学生姓名',
            key: 'stuName',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '学生学号',
            key: 'stuNo',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '缴费项目',
            key: 'itemName',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '缴费渠道',
            key: 'source',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let source=params.row.source;
              switch (source) {
                case 1:
                  return h('span',{
                    'style':{
                      'color':'rgb(119,180,38)',
                      'margin-left':'5px',
                      'margin-right':'5px',
                    }
                  },"已代扣" )
                  break;
                case 2:
                  return h('span',{
                    'style':{
                      'color':'rgb(25,128,127)',
                      'margin-left':'5px',
                      'margin-right':'5px',
                    }
                  },"自主缴费" )
                  break;
                case 3:
                  return h('span',{
                    'style':{
                      'color':'rgb(217,38,53)',
                      'margin-left':'5px',
                      'margin-right':'5px',
                    }
                  },"等待代扣" )
                  break;
                case 4:
                  return h('span',{
                    'style':{
                      'color':'rgb(217,38,53)',
                      'margin-left':'5px',
                      'margin-right':'5px',
                    }
                  },"线下现金" )
                  break;
                case 5:
                  return h('span',{
                    'style':{
                      'color':'rgb(217,38,53)',
                      'margin-left':'5px',
                      'margin-right':'5px',
                    }
                  },"线下扫码" )
                  break;
              }
            }
          },
          {
            title: '费用金额(元)',
            key: 'strAmount',
            align: 'center',
            minWidth: 100,
            render:(h, params) => {
              let source=params.row.source;
              if(source==3){
                return h('div',[
                  h('span',{
                    'style':{
                      'color':'#5599e5',
                      'margin-left':'5px',
                      'margin-right':'5px',
                      'font-size':'14px!important',
                    }
                  }, params.row.strFrozen),
                  h('span', {
                    'style':{
                      'color':'rgb(217,38,53)',
                      'margin-left':'5px',
                      'margin-right':'5px',
                      'font-size':'10px!important',
                    }
                  },'(已冻结)'),
                ])
              }else {
                return h('span',{
                  'style':{
                    'color':'#5599e5',
                    'margin-left':'5px',
                    'margin-right':'5px',
                    'font-size':'14px!important',
                  }
                },params.row.strAmount)
              }
            }
          },
          {
            title: '政府补助金额(元)',
            key: 'strDerateAmount',
            align: 'center',
            minWidth: 100,

          },
          {
            title: '减免金额(元)',
            key: 'strRectorDerate',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '退费总额(元)',
            key: 'strRefund',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '实缴金额(元)',
            key: 'strReceivables',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '退费记录',
            key: '',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let that=this;
              return h('span',{
                style:{color:'red',textDecorationLine:'underline'},
                on: {
                  click:e => {
                    e.stopPropagation();
                    if(params.row.refundCount!=null && params.row.refundCount>0){
                      that.getRefundDetailInfo(params.row.recordId,params.row.itemName);
                    }else{
                      this.$Message.error('无退费记录');
                    }
                  }
                }
              },params.row.refundCount==null?'0条':params.row.refundCount+'条')
            }
          },

        ],


        refundDetailModal:false,
        refundDetail:null,
        refundColumns:[
          {
            title: '序号',
            key: 'id',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '退款单号',
            minWidth: 150,
            key: 'billNo',
            align: 'center'
          },
          {
            title: '退费登记时间',
            minWidth: 150,
            key: 'refundTime',
            align: 'center'
          },
          {
            title: '退款金额(元)',
            minWidth: 90,
            key: 'strRefund',
            align: 'center',

          },
          {
            title: '退费操作人',
            minWidth: 220,
            key: 'stuGradeName',
            align: 'center',
            render:(h,params)=>{
              return h('div',params.row.operatorName+'('+params.row.operatorPhone+')')
            }
          },
          {
            title: '退费说明',
            minWidth: 90,
            key: 'reason',
            align: 'center'
          },
        ],
      }
    },
    watch:{

    },
    methods: {
      getAreaList(){
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
        });
      },
      getPayItems(){
        let params={
          schoolId: util.getLocal("schoolId"),
          tokenId: util.getSession("token").id,
        }
        this.$fetch(ucApi.payment.GET_PAYMENT_ITEMS, params).then((res)=> {
          if (res.code == 200) {
            let arr=res.body==undefined?[]:res.body;
            let result=[];
            arr.forEach((name,index)=>{
              result.push({id:name,name:name});
            })
            this.payItems=result;
          }
        }).catch((err)=>{

        });
      },
      getPayItemNameById(id){
        for(let i=0;i<this.payItems.length;i++){
          let item=this.payItems[i];
          if(item.id==id){
            return item.name;
          }
        }
      },
      getGradeList(){
        let that=this;
        let params={
          type:1,
        }
        this.$fetch(ucApi.payment.GET_GRADE_LIST, params).then((res)=> {
          if (res.code == 200 && res.body!=undefined) {
            let body=res.body;
            for(let i=0;i<body.length;i++){
              let item=body[i]
              if(item.code==1){
                that.gradeList=item.grades;
              }
            }

          }
        }).catch((err)=>{

        });
      },

      doSearch(){
        this.page.current = 1
        this.page.total=0;
        this.tableList=[];
        this.getListData()
      },
      pageChanged(page){
        this.page.current = page
        this.getListData()
      },

      getListData() {
        this.$load.show();
        let params = {
          tokenId: util.getSession("token").id,
          //userId: util.getSession("user").id,
          schoolId: this.$util.getLocal("schoolId"),
          curPage:this.page.current,
        }
        if(this.search.channel.length>0){
          params.source = this.search.channel.join();
        }else{
          params.source=0;
        }
        if(!this.$Filters.isEmpty(this.search.itemId)){
          params.itemName = this.getPayItemNameById(this.search.itemId)
        }
        if(!this.$Filters.isEmpty(this.search.dateRange[0]) && !this.$Filters.isEmpty(this.search.dateRange[1])){
          params.startDate = this.$moment(this.search.dateRange[0]).format("YYYY-MM-DD")
          params.endDate = this.$moment(this.search.dateRange[1]).format("YYYY-MM-DD")
        }
        if(!this.$Filters.isEmpty(this.search.grade)){
          params.grade = this.search.grade
        }
        if(!this.$Filters.isEmpty(this.search.class)){
          params.inClass = this.search.class
        }
        if(!this.$Filters.isEmpty(this.search.stuName)){
          params.stuName = this.search.stuName
        }
        if(!this.$Filters.isEmpty(this.search.stuNo)){
          params.stuNo = this.search.stuNo
        }
        if(!this.$Filters.isEmpty(this.search.refund)){
          params.refund = this.search.refund
        }else{
          params.refund =0
        }
        if(!this.$Filters.isEmpty(this.search.payNum)){
          params.billNo = this.search.payNum
        }
        if(this.search.onlyReduced){
          params.derate = 1
        }else{
          params.derate = 0
        }
        if(this.search.schoolMasterReduced){
          params.rectorDerate = 1
        }else{
          params.rectorDerate = 0
        }
        if(!this.$Filters.isEmpty(this.search.areaId)){
          params.areaId = this.search.areaId
        }
        if(!this.$Filters.isEmpty(this.search.stuPhone)){
          params.stuPhone = this.search.stuPhone
        }
        this.$fetch(ucApi.payment.GET_PAYMENT_COLLECT_INCOME_DETAIL, params).then((res)=> {

          if (res.code == 200) {
            console.log(res);
            this.$Message.success("请求完成！");
            let bodyData=res.body;
            this.page.current=parseInt(bodyData.curPage);
            this.page.total=parseInt(bodyData.totalCount);
            this.page.size=parseInt(bodyData.pageSize) ;
            this.page.totalAmount=bodyData.totalAmount;
            this.page.strTotalAmount=bodyData.strTotalAmount;
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
      exportData(){
        this.$load.show();
        let params = {
          tokenId: util.getSession("token").id,
          //userId: util.getSession("user").id,
          schoolId: this.$util.getLocal("schoolId"),
        }
        if(this.search.channel.length>0){
          params.source = this.search.channel.join();
        }else{
          params.source=0;
        }
        if(!this.$Filters.isEmpty(this.search.itemId)){
          params.itemName = this.getPayItemNameById(this.search.itemId)
        }
        if(!this.$Filters.isEmpty(this.search.dateRange[0]) && !this.$Filters.isEmpty(this.search.dateRange[1])){
          params.startDate = this.$moment(this.search.dateRange[0]).format("YYYY-MM-DD")
          params.endDate = this.$moment(this.search.dateRange[1]).format("YYYY-MM-DD")
        }
        if(!this.$Filters.isEmpty(this.search.grade)){
          params.grade = this.search.grade
        }
        if(!this.$Filters.isEmpty(this.search.class)){
          params.inClass = this.search.class
        }
        if(!this.$Filters.isEmpty(this.search.stuName)){
          params.stuName = this.search.stuName
        }
        if(!this.$Filters.isEmpty(this.search.stuNo)){
          params.stuNo = this.search.stuNo
        }
        if(!this.$Filters.isEmpty(this.search.refund)){
          params.refund = this.search.refund
        }else{
          params.refund =0
        }
        if(!this.$Filters.isEmpty(this.search.payNum)){
          params.billNo = this.search.payNum
        }
        if(this.search.onlyReduced){
          params.derate = 1
        }else{
          params.derate = 0
        }
        if(this.search.schoolMasterReduced){
          params.rectorDerate = 1
        }else{
          params.rectorDerate = 0
        }
        if(!this.$Filters.isEmpty(this.search.areaId)){
          params.areaId = this.search.areaId
        }
        if(!this.$Filters.isEmpty(this.search.stuPhone)){
          params.stuPhone = this.search.stuPhone
        }
        this.$fetchBlob(ucApi.payment.EXPORT_PAYMENT_RECORD_DETAIL, params).then((res)=> {
          if (res.status == 200) {
            console.log(res);
            // const fileName = res.headers["content-disposition"].split('=')[1];
            const fileName = '缴费记录导出.xlsx';
            const aLink = document.createElement('a');
            const blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
            const _href = URL.createObjectURL(blob);
            aLink.style.display = 'none';
            aLink.href = _href;
            document.body.appendChild(aLink);
            aLink.setAttribute('download', decodeURI(fileName));
            aLink.click();
            document.body.removeChild(aLink);
            URL.revokeObjectURL(_href);
          } else{
            this.$Message.error(res.message);
          }
          this.$load.hide();
        }).catch((err)=>{
          this.$Message.error(err);
          this.$load.hide();
        });

      },

      getRefundDetailInfo(recordId,itemName){
        let that=this;
        let params = {
          tokenId: util.getSession("token").id,
          schoolId: this.$util.getLocal("schoolId"),
          recordId:recordId,
          itemName:itemName,
        }
        this.$fetch(ucApi.payment.GET_REFUND_DETAIL_INFO, params).then((res)=> {
          if (res.code == 200 && res.body!=undefined) {
            let body=res.body;
            that.refundDetail=body;
            that.refundDetailModal=true;
          }
        }).catch((err)=>{

        });
      },
    },
    created() {

    },
    mounted() {
      this.getAreaList();
      this.getPayItems();
      this.getGradeList();
      this.doSearch();
    },
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';

  @{deep}.ivu-table{
    @media screen and (max-height: 1800px) and (orientation: landscape){
      height: calc(85vh - 20px )!important;
    }
    @media screen and (max-height: 1200px) and (orientation: landscape){
      height: calc(80vh - 35px )!important;
    }
    @media screen and (max-height: 1080px) and (orientation: landscape){
      height: calc(78vh - 40px)!important;
    }
    @media screen and (max-height: 1024px) and (orientation: landscape){
      height: calc(76vh - 56px )!important;
    }
    @media screen and (max-height: 900px) and (orientation: landscape){
      height: calc(74vh - 45px )!important;
    }
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: calc(70vh - 50px )!important;
    }
  }

  @{deep}.ivu-modal-body{
    .ivu-table{
      border: 1px solid #eeeeee!important;
      overflow-x: hidden!important;
    }
  }
  #print @{deep}.ivu-modal-body{
    overflow-x: hidden!important;
  }
</style>
