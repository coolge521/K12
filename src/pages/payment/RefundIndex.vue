<template>
  <div style="padding: 20px;background: #f5f5f5">
    <Row style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;background: #ffffff;padding: 20px;">

      <div style="display: flex;flex-direction: column;align-items: center;justify-content: space-between;width: 100%">
        <div style="display: flex;justify-content: space-between;align-items: center;width: 100%">
          <Select v-model="search.areaId" placeholder="选择校区"    style="width: 8.5%;">
            <Option v-for="(item,index) in areaList"
                    :value="item.id"
                    :label="item.name"
                    :key="item.id">
            </Option>
          </Select>
          <DatePicker type="daterange" size="small" v-model='search.dateRange' split-panels placeholder="开始日期至结束日期" style="width: 8.5%;"></DatePicker>

          <Select v-model="search.itemId" placeholder="请选择退款项目"  clearable style="width: 8.5%;">
            <Option v-for="(item,index) in payItems"
                    :value="item.id"
                    :label="item.name"
                    :key="item.id">
            </Option>
          </Select>

          <Select v-model="search.grade" placeholder="请选择年级"  clearable style="width: 8.5%;">
            <Option v-for="(item,index) in gradeList"
                    :value="item.code"
                    :label="item.name"
                    :key="item.code">
            </Option>
          </Select>
          <Input clearable v-model="search.class" placeholder="请输入班级"   style="width: 8.5%;"></Input>
          <Input clearable v-model="search.stuName" placeholder="请输入姓名"   style="width: 8.5%;"></Input>

          <Input clearable v-model="search.stuNo" placeholder="请输入学号"   style="width: 8.5%;"></Input>
          <Input clearable v-model="search.stuPhone" placeholder="请输入电话"   style="width: 8.5%;"></Input>

          <Input clearable v-model="search.refundBillNo" placeholder="退费单号"    style="width: 8.5%;"></Input>

          <Input clearable v-model="search.billNo" placeholder="缴费单号"   style="width: 8.5%;display: none"></Input>

          <div style="display: flex;width: 8.5%;justify-content: flex-end;align-items: center">
            <Button type="primary" style="width: 80px;margin-right: 5px;"  @click="doSearch">查询</Button>
            <Button type="primary" style="width: 100px;"  @click="showRefundModal">退款登记</Button>
          </div>
        </div>



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
    <div style="width:100%;height:65px!important;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
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
      id="print"
      v-if="printItem!=null"
      title="打印单据"
      v-model="printModal"
      :width='950'>
      <vue-easy-print tableShow ref="easyPrint">
        <div style="display: flex;flex-direction: column;padding: 10px 10px;width:24cm;">
          <Row style="display: flex;justify-content: center;width: 100%!important;">
            <h2 v-html="">{{printItem.printTitle}}</h2>
          </Row>
          <Row style="display: flex;justify-content:space-around;width: 100%;line-height: 2">
            <Col span="8" style="padding-left: 50px"><span>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span><span>{{printItem.stuNo}}</span></Col>
            <Col span="8" ><span>学生姓名：</span><span>{{printItem.stuName}}</span></Col>
            <Col span="8" ><span>学生性别：</span><span>{{printItem.stuSex}}</span></Col>
          </Row>
          <Row style="display: flex;justify-content: center;width: 100%!important;line-height: 2">
            <Col span="8" style="padding-left: 50px"><span>班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：</span><span>{{printItem.stuGradeName}}{{printItem.stuClass}}班</span></Col>
            <Col span="8" ><span>家长姓名：</span><span>{{printItem.stuParentName}}</span></Col>
            <Col span="8" ><span>家长电话：</span><span>{{printItem.stuPhone}}</span></Col>
          </Row>
          <Row style="display: flex;justify-content: center;width: 100%!important;line-height: 2">
            <Col span="12" style="padding-left: 50px"><span>开票日期：</span><span>{{printItem.printDate}}</span></Col>
            <Col span="4"></Col>
            <Col span="8" ><span>发票编号：</span><span>{{printItem.printNo}}</span></Col>
          </Row>
          <Row style="display: flex;justify-content: center;width: calc(100% - 0px);line-height: 2;border: 1px solid #333">
            <Col span="4" style="text-align: center;border-right: 1px solid #333"><span>项目编号</span></Col>
            <Col span="5" style="text-align: center;border-right: 1px solid #333"><span>项目名称</span></Col>
            <Col span="5" style="text-align: center;border-right: 1px solid #333"><span>项目金额</span></Col>
            <Col span="5" style="text-align: center;border-right: 1px solid #333"><span>实收金额</span></Col>
            <Col span="5" style="text-align: center;border-right: 1px solid #333"><span>退费金额</span></Col>
          </Row>
          <Row style="display: flex;flex-direction: column;justify-content: flex-start;width: calc(100% - 0px);height: 180px;border: 1px solid #333;border-top: none">
            <Row v-if="printItem.details.length>0" v-for="(item,index) in printItem.details" v-bind:key="index" style="display: flex;justify-content: center;line-height: 2;align-items: center;width: 100%!important;">
              <Col span="4" style="text-align: center"><span>{{(index+1).toString()}}</span></Col>
              <Col span="5" style="text-align: center"><span>{{item.itemName}}</span></Col>
              <Col span="5" style="text-align: center"><span>{{item.strReceivables}}</span></Col>
              <Col span="5" style="text-align: center"><span>{{item.strAmount}}</span></Col>
              <Col span="5" style="text-align: center"><span>{{item.strRefund}}</span></Col>
            </Row>
          </Row>
          <Row style="display: flex;justify-content: center;width: calc(100% - 0px);line-height: 2;border: 1px solid #333;border-top: none">
            <Col span="4" style="text-align: center;border-right: 1px solid #333"><span>单据备注</span></Col>
            <Col span="20" style="text-align: left;padding-left: 10px"><span>{{printItem.reason}}</span></Col>
          </Row>
          <Row style="display: flex;justify-content: center;width: calc(100% - 0px);line-height: 2;border: 1px solid #333;border-top: none">
            <Col span="24" style="text-align: right;padding-right: 10px;font-size: 20px"><span>本次退费金额：</span><span>{{$util.convertCurrency((printItem.refund/100).toFixed(2))}}</span><span>(￥{{printItem.strRefund}})</span></Col>
          </Row>
          <Row style="display: flex;justify-content: center;width: 100%!important;line-height: 2">
            <Col span="8" style="padding-left: 50px"><span>开票人：</span><span>{{$util.getSession('user').name}}</span></Col>
            <Col span="8" ></Col>   <!--<span>收款人：</span><span>{{printItem.payee}}</span>-->
            <Col span="8" ><span>本票据手写无效</span></Col>
          </Row>
          <Row style="display: flex;justify-content: center;width: 100%!important;line-height: 2">
            <Col span="12" style="padding-left: 50px"><span>学校地址：</span><span>{{printItem.printAddress}}</span></Col>
            <Col span="4"></Col>
            <Col span="8" ><span>学校电话：</span><span>{{printItem.printPhone}}</span></Col>
          </Row>
        </div>
      </vue-easy-print>
      <div slot="footer" >
        <!--        <Button type="primary" size="large" @click="exportPrintData" >导出</Button>-->
        <Button type="primary" size="large" @click="printModal=false" >取消</Button>
        <Button type="primary" size="large" @click="printPage" >打印</Button>
      </div>
    </Modal>

    <Modal
      title="退费登记"
      v-model="refundModal"
      :footer-hide="true"
      :width='75'>

      <div style="display: flex;flex-wrap: wrap;justify-content: space-between;align-items: center;width: 100%">

        <Select v-model="modalSearch.term" placeholder="请选择所属学期"  clearable style="width: 33%;">
          <Option v-for="(item,index) in termList"
                  :value="item"
                  :label="item"
                  :key="index">
          </Option>
        </Select>

        <Select v-model="modalSearch.grade" placeholder="请选择年级"  clearable style="width: 33%;">
          <Option v-for="(item,index) in gradeList"
                  :value="item.code"
                  :label="item.name"
                  :key="item.code">
          </Option>
        </Select>
        <Select v-model="modalSearch.itemId" placeholder="请选择退费项目"  clearable style="width: 33%;">
          <Option v-for="(item,index) in searchPayItems"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <Input clearable v-model="modalSearch.class" placeholder="请输入班级"   style="width: 33%;margin-top: 10px"></Input>
        <Input clearable v-model="modalSearch.stuName" placeholder="请输入姓名"   style="width: 33%;margin-top: 10px"></Input>

        <Input clearable v-model="modalSearch.stuNo" placeholder="请输入学号"   style="width: 33%;margin-top: 10px"></Input>
      </div>

      <div style="display: flex;width: 100%;justify-content: space-between;align-items: center;margin-top: 10px;margin-bottom: 10px">
        <Button type="primary" style="width: 80px;margin-right: 5px;"  @click="bathRefund">批量退款</Button>
        <Button type="primary" style="width: 100px;"  @click="searchModalList">筛选</Button>
      </div>
      <div class="table">
        <i-table border :columns="modalColumns" :data="modalList" :stripe="true" v-show="!($Filters.isShowNoDataView(modalList,this))"  @on-row-click='' @on-selection-change="selectItems"></i-table>
        <i-table border :columns="modalColumns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(modalList,this)"></i-table>
      </div>
      <div style="width:100%;height:65px!important;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
        <div style="position: absolute;left: 120px;bottom: 30px;z-index: 99">
          <span>总计费用</span>
          <span style="color: red">{{modalPage.strTotalAmount}}</span>
          <span>元</span>
        </div>
        <Page
          :total="modalPage.total"
          show-total
          size="small"
          :page-size="modalPage.size"
          :current="modalPage.current"
          show-elevator
          @on-change='modalPageChanged'>
        </Page>
      </div>
    </Modal>

    <Modal
      title="退费操作"
      v-model="refundOptModal"
      :width='80'
      @on-ok="submitRefund"
      :loading="submitRefundLoading"
    >
      <span style="font-size: 18px;padding: 5px 0">退款清单:</span>
      <div class="table">
        <i-table border :columns="optColumns" :data="selectList" :stripe="true" v-show="!($Filters.isShowNoDataView(optColumns,this))"></i-table>
        <i-table border :columns="optColumns" ref="noDataTableRef" v-show="$Filters.isShowNoDataView(optColumns,this)"></i-table>
      </div>
      <div style="display: flex;justify-content: space-between;align-items: flex-start;padding: 10px">
        <span style="width: 90px;font-size: 18px;padding: 5px 0 ">退款说明:</span>
        <Input
          v-model="refundRemark"
          type="textarea"
          :autosize="{minRows: 5,maxRows: 5}"
          maxlength="200"
          placeholder="请输入备注" />
      </div>
    </Modal>


  </div>
</template>

<script>
  import vueEasyPrint from "vue-easy-print";
  import ucApi from "@/libs/ucApi.js";
  import util from "@/libs/util.js";

  export default {
    components:{vueEasyPrint},
    name: "RefundIndex",
    data() {
      return {
        search:{
          areaId:this.$util.getSession('user').areaId,
          itemId:'',
          grade:'',
          dateRange:['',''],
          class:'',
          stuName:'',
          stuPhone:'',
          stuNo:'',
          refundBillNo:'',
          billNo:''
        },
        areaList:[],
        payItems:[],
        gradeList:[],
        termList:[],
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
            key: 'stuAreaName',
            align: 'center',
            minWidth: 150,
          },
          // {
          //   title: '所属缴费单号',
          //   key: 'paidBillNo',
          //   align: 'center',
          //   minWidth: 150,
          // },
          {
            title: '退费单号',
            key: 'billNo',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '年级',
            minWidth: 100,
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
            title: '退款项目',
            key: 'itemName',
            align: 'center',
            minWidth: 150,
          },

          // {
          //   title: '项目金额(元)',
          //   key: '',
          //   align: 'center',
          //   minWidth: 100,
          //   render:(h, params) => {
          //     return h('span',{
          //       'style':{
          //         'color':'#5599e5',
          //         'margin-left':'5px',
          //         'margin-right':'5px',
          //         'font-size':'14px!important',
          //       }
          //     },params.row.strReceivables)
          //   }
          // },
          // {
          //   title: '实收金额(元)',
          //   key: '',
          //   align: 'center',
          //   minWidth: 100,
          //   render:(h,params)=>{
          //     let that=this;
          //     return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center'}},[
          //       h('span',{
          //         style:{color:'#5599e5',marginRight:'5px'},
          //       }, params.row.strAmount),
          //
          //     ])
          //   }
          // },
          {
            title: '退款金额(元)',
            key: '',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let that=this;
              return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center'}},[
                h('span',{
                  style:{color:'#5599e5',marginRight:'5px'},
                }, params.row.strRefund),
              ])
            }
          },
          {
            title: '退费登记时间',
            key: 'createTime',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '退费登记人',
            key: 'operatorName',
            align: 'center',
            minWidth: 120,
            render:(h,params)=>{
              return h('div',params.row.operatorName+'('+params.row.operatorPhone+')')
            }
          },

          {
            title: '操作',
            key: 'action',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              let that=this;
              return h('div', [
                h('a',{
                  style:{color:'#5599e5'},
                  on: {
                    click:e => {
                      e.stopPropagation();
                      that.openPrintModal(params.row);
                    }
                  }
                }, '打印退费单'),
              ])
            }
          }
        ],
        /////////////////////////
        printModal:false,
        school:null,
        title:'',
        printItem:null,
        ////////////////////////
        refundModal:false,
        refundItem:null,
        searchPayItems:[],
        modalSearch:{
          term:'',
          grade:'',
          class:'',
          itemId:'',
          stuName:'',
          stuNo:'',
        },
        modalList:[],
        modalColumns:[
          {
            title: '序号',
            key: 'id',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '所属校区',
            key: 'stuAreaName',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '缴费时间',
            key: 'payTime',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '票据单号',
            key: 'billNo',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '年级',
            minWidth: 100,
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
            minWidth: 150,
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
            title: '项目金额(元)',
            key: 'strAmount',
            align: 'center',
            minWidth: 100,
            render:(h, params) => {
              return h('span',{
                'style':{
                  'color':'#5599e5',
                  'margin-left':'5px',
                  'margin-right':'5px',
                  'font-size':'14px!important',
                }
              },params.row.strReceivables)//params.row.strAmount
            }
          },
          {
            title: '政府补助金额(元)',
            key: 'strDerateAmount',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let that=this;
              return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center'}},[
                h('span',{
                  style:{color:'#5599e5',marginRight:'5px'},
                }, params.row.strDerateAmount),
              ])
            }
          },
          {
            title: '减免金额(元)',
            key: 'strRectorDerate',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let that=this;
              return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center'}},[
                h('span',{
                  style:{color:'#5599e5',marginRight:'5px'},
                }, params.row.strRectorDerate),
              ])
            }
          },
          {
            title: '已退款总额(元)',
            key: 'remark',
            align: 'center',
            minWidth: 80,
            render:(h,params)=>{
              let that=this;
              return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center'}},[
                h('span',{
                  style:{color:'#5599e5',marginRight:'5px'},
                }, params.row.strRefund),
              ])
            }
          },
          {
            title: '实际缴费金额(元)',
            key: 'strAmount',
            align: 'center',
            minWidth: 100,
          },

          {
            title: '操作',
            key: 'action',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              let that=this;
              return h('div', [
                h('a',{
                  style:{color:'#5599e5'},
                  on: {
                    click:e => {
                      e.stopPropagation();
                      that.selectList=[params.row];
                      that.selectList.forEach(item=>{
                        item.editRefund=parseInt(item.amount);
                      })
                      that.refundOptModal=true;
                    }
                  }
                }, '退款'),
              ])
            }
          }
        ],
        modalPage:{
          current:1,
          size:20,
          total:0,
          totalAmount:0,
          strTotalAmount:'',
        },
        selectList:[],
        /////////////////////////

        refundOptModal:false,
        submitRefundLoading:true,
        refundRemark:'',
        optColumns:[
          {
            title: '序号',
            key: 'id',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '所属缴费单号',
            key: 'billNo',
            align: 'center',
            minWidth: 150,
          },

          {
            title: '缴费时间',
            key: 'payTime',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '学生姓名',
            key: 'stuName',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '所在年级',
            minWidth: 100,
            key: 'stuGradeName',
            align: 'center'
          },
          {
            title: '所在班级',
            key: 'stuClass',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '联系电话',
            key: 'stuPhone',
            align: 'center',
            minWidth: 100,
          },

          {
            title: '退款项目',
            key: 'itemName',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '项目金额(元)',
            key: 'strAmount',
            align: 'center',
            minWidth: 100,
            render:(h, params) => {
              return h('span',{
                'style':{
                  'color':'#5599e5',
                  'margin-left':'5px',
                  'margin-right':'5px',
                  'font-size':'14px!important',
                }
              },params.row.strReceivables)//params.row.strAmount
            }
          },
          {
            title: '已退款金额(元)',
            key: 'strDerateAmount',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let that=this;
              return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center'}},[
                h('span',{
                  style:{color:'#5599e5',marginRight:'5px'},
                }, params.row.strRefund),
              ])
            }
          },
          {
            title: '实收金额(元)',
            key: 'strRectorDerate',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let that=this;
              return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center'}},[
                h('span',{
                  style:{color:'#5599e5',marginRight:'5px'},
                }, params.row.strAmount),
              ])
            }
          },
          {
            title: '退款金额(元)',
            key: 'remark',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let that=this;
              return h('div',[
                h('inputNumber',{
                  props: {
                    max: (params.row.amount/100),//最大实收金额
                    min: 0,
                    step: 0.01,
                    precision:2,
                    value: (params.row.editRefund/100),//默认实收金额
                    activeChange:false
                  },
                  style:{
                    width:'90%',
                  },
                  on:{
                    'on-change':(event)=>{
                      params.row.editRefund=event*100;
                      setTimeout(function () {
                        that.selectList[params.index].editRefund=event*100;
                      },200)
                    }
                  }
                })
              ])
            }
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
        this.$fetch(ucApi.payment.GET_REFUND_ITEM_NAME_LIST, params).then((res)=> {
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
      getSearchItemNameById(id){
        for(let i=0;i<this.searchPayItems.length;i++){
          let item=this.searchPayItems[i];
          if(item.id==id){
            return item.name;
          }
        }
      },

      getSearchPayItems(){
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
            this.searchPayItems=result;
          }
        }).catch((err)=>{

        });
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
      getCampus(){
        let params = {
          tokenId: util.getSession("token").id,
          schoolId: util.getLocal("schoolId"),
          enable:1,
        }

        this.$fetch(this.$api.platform.PLATFORM_AREA_LIST, params).then((res)=> {
          if (res.code == 200) {
            console.log(res);
            if(undefined != res.body){
              this.campusList=res.body;
            }else{
              this.campusList=[];
            }
          }

        }).catch((err)=>{
        });
      },
      getTerms(){
        let params = {
          tokenId: util.getSession("token").id,
          schoolId: util.getLocal("schoolId"),
        }

        this.$fetch(this.$api.payment.GET_TERM_LIST, params).then((res)=> {
          if (res.code == 200) {
            console.log(res);
            if(undefined != res.body){
              this.termList=res.body;
            }else{
              this.termList=[];
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
        if(!this.$Filters.isEmpty(this.search.refundBillNo)){
          params.refundBillNo = this.search.refundBillNo
        }
        if(!this.$Filters.isEmpty(this.search.billNo)){
          params.paidBillNo = this.search.billNo
        }
        if(!this.$Filters.isEmpty(this.search.areaId)){
          params.areaId = this.search.areaId
        }
        if(!this.$Filters.isEmpty(this.search.stuPhone)){
          params.stuPhone = this.search.stuPhone
        }
        this.$fetch(ucApi.payment.GET_REFUND_RECORD_LIST, params).then((res)=> {

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

      showRefundModal(){
        this.refundModal=true;
        this.modalSearch.term='';
        this.modalSearch.grade='';
        this.modalSearch.class='';
        this.modalSearch.itemId='';
        this.modalSearch.stuName='';
        this.modalSearch.stuNo='';
        this.selectList=[];
        this.refundRemark='';
        this.searchModalList();
        this.getSearchPayItems();
      },
      searchModalList(){
        this.modalPage.current = 1
        this.modalPage.total=0;
        this.modalList=[];
        this.getModalListData();
      },
      getModalListData() {
        this.$load.show();
        let params = {
          tokenId: util.getSession("token").id,
          //userId: util.getSession("user").id,
          schoolId: this.$util.getLocal("schoolId"),
          curPage:this.page.current,
        }
        if(!this.$Filters.isEmpty(this.modalSearch.term)){
          params.term = this.modalSearch.term;
        }
        if(!this.$Filters.isEmpty(this.modalSearch.itemId)){
          params.itemName = this.getSearchItemNameById(this.modalSearch.itemId)
        }

        if(!this.$Filters.isEmpty(this.modalSearch.grade)){
          params.grade = this.modalSearch.grade
        }
        if(!this.$Filters.isEmpty(this.modalSearch.class)){
          params.inClass = this.modalSearch.class
        }
        if(!this.$Filters.isEmpty(this.modalSearch.stuName)){
          params.stuName = this.modalSearch.stuName
        }
        if(!this.$Filters.isEmpty(this.modalSearch.stuNo)){
          params.stuNo = this.modalSearch.stuNo
        }
        if(!this.$Filters.isEmpty(this.search.areaId)){
          params.areaId = this.search.areaId
        }
        this.$fetch(ucApi.payment.GET_PAYMENT_COLLECT_INCOME_DETAIL, params).then((res)=> {

          if (res.code == 200) {
            console.log(res);
            this.$Message.success("请求完成！");
            let bodyData=res.body;
            this.modalPage.current=parseInt(bodyData.curPage);
            this.modalPage.total=parseInt(bodyData.totalCount);
            this.modalPage.size=parseInt(bodyData.pageSize) ;
            this.modalPage.totalAmount=bodyData.totalAmount;
            this.modalPage.strTotalAmount=bodyData.strTotalAmount;
            this.modalList=bodyData.list;
            this.modalList.forEach(item=>{
              item.editRefund=parseInt(item.amount);
            })
          } else{
            this.$Message.error(res.message);
          }
          this.$load.hide();
        }).catch((err)=>{
          this.modalList = [];
          this.$Message.error(err);
          this.$load.hide();
        });
      },
      modalPageChanged(page){
        this.getModalListData();
      },
      selectItems(selection){
        this.selectList=selection;
      },
      bathRefund(){
        if(this.selectList.length==0){
          this.$Modal.info({
            title:'提示',
            content:'请选择要退款的单据',
          })
          return;
        }
        this.selectList.forEach(item=>{
          item.editRefund=parseInt(item.amount);
        })
        this.refundOptModal=true;
      },
      submitRefund(){
        if(this.$Filters.isEmpty(this.refundRemark)){
          this.$Message.error("请填写退费说明")
          this.submitRefundLoading=false;
          this.$nextTick(()=>{
            this.submitRefundLoading=true;
          })
          return;
        }
        let that=this;
        this.$Modal.confirm({
          title:'提示',
          content:'是否确认对所选订单操作退款？退款提交后后，将不可撤销！',
          onOk(){
            setTimeout(()=>{
              let params={
                tokenId: util.getSession("token").id,
                schoolId: that.$util.getLocal("schoolId"),
                reason:that.refundRemark,
              }
              let arr=[];
              that.selectList.forEach((item,index)=>{
                arr.push({
                  itemName:item.itemName,
                  recordId:item.recordId,
                  refund:item.editRefund,
                })
              })
              this.$post(this.$api.payment.SAVE_REFUND_ITEMS, params,arr).then((res)=> {
                if (res.code == 200) {
                  that.submitRefundLoading=false;
                  that.$nextTick(()=>{
                    that.submitRefundLoading=true;
                  })
                  that.refundModal=false;
                  that.refundOptModal=false;
                  that.$Message.success('保存成功!');
                  that.doSearch();
                }else{
                  that.submitRefundLoading=false;
                  that.$nextTick(()=>{
                    that.submitRefundLoading=true;
                  })
                  this.$Message.error(res.message);
                }
              });
            },200)
          },
          onCancel(){
            that.submitRefundLoading=false;
            that.$nextTick(()=>{
              that.submitRefundLoading=true;
            })
          }
        })
      },





      openPrintModal(row){

        this.school=util.getLocal('school');
        //const   seasonStr=this.$moment().month()>7?'春季学期':'秋季学期';
        //this.title=this.school.name+this.$moment().year()+seasonStr+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp收费清单'

        this.getPrintDetail(row.id);
      },
      getPrintDetail(id){
        let params={
          schoolId: util.getLocal("schoolId"),
          tokenId: util.getSession("token").id,
          id:id,
        }
        this.$fetch(ucApi.payment.GET_REFUND_RECORD_PRINT, params).then((res)=> {
          if (res.code == 200) {
            this.printItem=res.body;
            this.printModal=true;
          }
        }).catch((err)=>{

        });
      },
      printPage(){
        this.$refs.easyPrint.print();
      },
    },
    created() {

    },
    mounted() {
      this.getAreaList();
      this.getPayItems();
      this.getGradeList();
      this.getCampus();
      this.getTerms();
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
      overflow-x: auto!important;
      height: 50vh!important;
    }
  }
  #print @{deep}.ivu-modal-body{
    overflow-x: hidden!important;
  }
</style>
