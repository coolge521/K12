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
              <Option v-for="(item,index) in searchPayItems"
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
            <Input clearable v-model="search.serialNo" placeholder="缴费单号"   style="width: 13%;"></Input>
            <div style="width: 13%;display: flex;flex-wrap: nowrap;align-items: center">
              <Checkbox v-model="search.onlyReduced" :false-value="0" :true-value="1" style="width:100px;margin: 0px 5px 5px 0px;font-size: 16px">政府补助</Checkbox>
              <Checkbox v-model="search.schoolMasterReduced" :false-value="0" :true-value="1" style="width:120px;margin: 0px 5px 5px 0px;font-size: 16px">有减免</Checkbox>
            </div>


            <div style="display: flex;width: calc(30% - 2.5%);justify-content: flex-end;align-items: center">
              <Button type="primary" style="width: 80px;margin-right: 5px;"  @click="doSearch">查询</Button>
              <Button type="primary" style="width: 80px;margin-right: 5px;"  @click="exportData">导出</Button>
              <Button type="primary" style="width: 100px;"  @click="addOffLine">线下缴费登记</Button>
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
          <Col span="4" style="text-align: center;border-right: 1px solid #333"><span>项目名称</span></Col>
          <Col span="4" style="text-align: center;border-right: 1px solid #333"><span>应收金额</span></Col>
          <Col span="3" style="text-align: center;border-right: 1px solid #333"><span>政府补助金额</span></Col>
          <Col span="3" style="text-align: center;border-right: 1px solid #333"><span>减免金额</span></Col>
          <Col span="3" style="text-align: center;border-right: 1px solid #333"><span>已收金额</span></Col>
          <Col span="3" style="text-align: center"><span>本次实收金额</span></Col>
        </Row>
        <Row style="display: flex;flex-direction: column;justify-content: flex-start;width: calc(100% - 0px);height: 180px;border: 1px solid #333;border-top: none">
          <Row v-if="printItem.details.length>0" v-for="(item,index) in printItem.details" v-bind:key="index" style="display: flex;justify-content: center;line-height: 2;align-items: center;width: 100%!important;">
            <Col span="4" style="text-align: center"><span>{{(index+1).toString()}}</span></Col>
            <Col span="4" style="text-align: center"><span>{{item.itemName}}</span></Col>
            <Col span="4" style="text-align: center"><span>{{item.strReceivables}}</span></Col>
            <Col span="3" style="text-align: center"><span>{{item.strDerate}}</span></Col>
            <Col span="3" style="text-align: center"><span>{{item.strRectorDerate}}</span></Col>
            <Col span="3" style="text-align: center"><span>{{item.strAmount}}</span></Col>
            <Col span="3" style="text-align: center"><span>{{item.strAmount}}</span></Col>
          </Row>
        </Row>
        <Row style="display: flex;justify-content: center;width: calc(100% - 0px);line-height: 2;border: 1px solid #333;border-top: none">
          <Col span="4" style="text-align: center;border-right: 1px solid #333"><span>单据备注</span></Col>
          <Col span="20" style="text-align: left;padding-left: 10px"><span>{{printItem.remark}}</span></Col>
        </Row>
        <Row style="display: flex;justify-content: center;width: calc(100% - 0px);line-height: 2;border: 1px solid #333;border-top: none">
          <Col span="24" style="text-align: right;padding-right: 10px;font-size: 20px"><span>本次收费金额：</span><span>{{$util.convertCurrency((printItem.amount/100).toFixed(2))}}</span><span>(￥{{printItem.strAmount}})</span></Col>
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
      id="modal"
      title="线下缴费登记"
      v-model="offLineModal"
      :width='40'>
      <Form  ref="offLineRef" :model="offLineRecord" :label-width="100" :rules="ruleInline">
        <FormItem label="校区:" prop="stuAreaId">
          <Select v-model="offLineRecord.stuAreaId">
            <Option :value="campus.id" v-for="(campus,index) in campusList" v-bind:key="index">{{campus.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="学生:" prop="stuName">
          <Input type="text" v-model="offLineRecord.stuName" placeholder="" disabled style="width: calc(100% - 80px)"/>
          <Button type="primary" size="small" @click="showStudentDraw" style="width: 75px">搜索</Button>
        </FormItem>
        <FormItem label="缴费方式:" prop="payType">
          <Select v-model="offLineRecord.cashType">
            <Option :value="type.id" v-for="(type,index) in cashTypeList" v-bind:key="index">{{type.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="收款人:" prop="payee">
          <Input type="text" v-model="offLineRecord.payee" placeholder=""/>
        </FormItem>
        <FormItem label="缴费清单:" prop="cashItems">
          <Button type="primary" size="small"  @click="addCashItem" style="width: 95px;position: absolute;right: 5px">新增缴费项目</Button>
        </FormItem>

        <Table stripe border :columns="cashColumns" :data="offLineRecord.cashItems" show-summary :summary-method="handleSummary">
        </Table>
      </Form>
      <div slot="footer" >
        <Button type="primary" size="large" @click="offLineModal=false" >取消</Button>
        <Button type="primary" size="large" @click="commitOffLine" >提交</Button>
      </div>
    </Modal>

    <Modal
      title="录入政府补助额度"
      v-model="reducedModal"
      :width='40'>
      <Table stripe border :columns="reducedColumns" :data="reducedList" show-summary :summary-method="handleReducedSummary" >
      </Table>
      <div slot="footer" >
        <Button type="primary" size="large" @click="reducedModal=false" >取消</Button>
        <Button type="primary" size="large" @click="commitReduced" >提交</Button>
      </div>
    </Modal>

    <Modal
      title="录入减免金额额度"
      v-model="masterReducedModal"
      :width='40'>
      <Table stripe border :columns="masterReducedColumns" :data="masterReducedList" show-summary :summary-method="handleMasterReducedSummary" >
      </Table>
      <div slot="footer" >
        <Button type="primary" size="large" @click="masterReducedModal=false" >取消</Button>
        <Button type="primary" size="large" @click="commitMasterReduced" >提交</Button>
      </div>
    </Modal>

    <Modal
      v-if="remarkCurrent!=null"
      title="单据备注"
      v-model="remarkModal"
      :width='40'>
      <Input
        v-model="remarkCurrent.remark"
        type="textarea"
        :autosize="{minRows: 5,maxRows: 5}"
        maxlength="200"
        placeholder="请输入备注" />
      <div v-if="remarkCurrent.remarkLastTime!=undefined" style="display: flex;justify-content: flex-end;align-items: center;padding-right: 20px;margin-top: 10px">
        <span style="color: #5599e5">最近更新:</span>
        <span style="color: #5599e5">{{remarkCurrent.remarkLastOperatorName}}</span>
        <span style="color: #5599e5;margin-left: 20px">{{remarkCurrent.remarkLastTime}}</span>
      </div>
      <div slot="footer" >
        <Button type="primary" size="large" @click="remarkModal=false" >取消</Button>
        <Button type="primary" size="large" @click="commitRemark" >提交</Button>
      </div>
    </Modal>

    <Modal
      title="选择学生"
      v-model="selectStudentModel"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="selectStudentOk"
      width="1200">
      <StudentSelect
        ref="selStudent" :multiple="false" @selectStudentsItem="selectStudents">
      </StudentSelect>
    </Modal>


    <Modal
      v-if="refundDetail!=null"
      title="退费记录"
      v-model="refundDetailModal"
      :width='80'
      :footer-hide="true"
    >
      <div style="padding:10px;display: flex;flex-direction: column">
        <Row style="line-height: 2">
          <i-col span='24'>
            <span style="font-size: 16px;font-weight: 500">基本信息:</span>
          </i-col>
        </Row>
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
            <span>联系电话：</span>
            <span>{{refundDetail.stuPhone}}</span>
          </i-col>
          <i-col span='6'>
            <span>缴费渠道：</span>
            <span v-if="refundDetail.source==1">已代扣</span>
            <span v-if="refundDetail.source==2">自主缴费</span>
            <span v-if="refundDetail.source==3">等待代扣</span>
            <span v-if="refundDetail.source==4">线下现金缴费</span>
            <span v-if="refundDetail.source==5">线下扫码缴费</span>
          </i-col>
          <i-col span='6'>
            <span>费用金额(元)：</span>
            <span>{{refundDetail.strAmount}}</span>
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
            <span>退费总金额(元)：</span>
            <span>{{refundDetail.strRefund}}</span>
          </i-col>
          <i-col span='6'>
            <span>实收金额(元)：</span>
            <span>{{refundDetail.strAmount}}</span>
          </i-col>
        </Row>
        <Row style="line-height: 2">
          <i-col span='24'>
            <span style="font-size: 16px;font-weight: 500">退款记录:</span>
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
  import vueEasyPrint from "vue-easy-print";
  import StudentSelect from '../sysParams/StudentSelect'
  export default {
    components:{vueEasyPrint,StudentSelect},
    name: "RecorderAuthIndex",
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
          serialNo:'',
        },
        areaList:[],
        channelList:[
          {label:'等待代扣',value:3},{label: '已代扣',value: 1},{label: '自主缴费',value: 2},{label: '线下现金缴费',value: 4},{label: '线下扫码缴费',value: 5}
        ],
        searchPayItems:[],
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
            title: '学生身份证号',
            key: 'stuIdCard',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '绑定手机号',
            key: 'stuPhone',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '缴费单号',
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
            title: '应缴金额(元)',
            key: 'strReceivables',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '政府补助总额(元)',
            key: 'strDerateAmount',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              let that=this;
              return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center'}},[
                h('span',{
                  style:{color:'#5599e5',marginRight:'5px'},
                }, params.row.strDerateAmount),
                h('Icon',{
                  attrs:{type:"ios-create",size:'20',color:'#5599e5',},
                  style:{display:(params.row.containDerateItem && params.row.stuDerate)?'':'none'},//有政府补助项目并且该学生支持政府补助
                  on: {
                    click:e => {
                      e.stopPropagation();
                      that.getRecordDetailPayItems(params.row.id,0);//获取缴费明细
                    }
                  }
                })
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
                h('Icon',{
                  attrs:{type:"ios-create",size:'20',color:'#5599e5'},
                  on: {
                    click:e => {
                      e.stopPropagation();
                      that.getRecordDetailPayItems(params.row.id,1);//获取缴费明细
                    }
                  }
                })
              ])
            }
          },
          {
            title: '单据备注',
            key: 'remark',
            align: 'center',
            minWidth: 80,
            render:(h,params)=>{
              let that=this;
              return h('Icon',{
                attrs:{type:"ios-create",size:'20',color:'#5599e5'},
                on: {
                  click:e => {
                    e.stopPropagation();
                    that.remarkCurrent=params.row;
                    that.remarkCurrent.remark=that.remarkCurrent.remark==undefined?'':that.remarkCurrent.remark;
                    that.remarkModal=true;

                  }
                }
              })
            }
          },
          {
            title: '退费总额(元)',
            key: 'strRefund',
            align: 'center',
            minWidth: 100,
            render:(h,params)=> {
              let that = this;
              return h('span', {
                style: {color: 'red', textDecorationLine: 'underline'},
                on: {
                  click: e => {
                    e.stopPropagation();
                    if (params.row.refund != null && parseInt(params.row.refund)>0) {
                      that.getRefundDetailInfo(params.row.id);
                    } else {
                      this.$Message.error('无退费记录');
                    }
                  }
                }
              }, params.row.strRefund==null?'0':params.row.strRefund)
            }
          },
          {
            title: '实缴金额(元)',
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
            title: '打印次数',
            key: 'printCount',
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
                      that.openPrintModal(params.row);
                    }
                  }
                }, '票据打印'),
              ])
            }
          }
        ],
        ////////////////////////
        printModal:false,
        school:null,
        title:'',
        printItem:null,
        /////////////////////////
        offLineModal:false,
        campusList:[],
        cashTypeList:[{id:'4',name:'现金缴费'},{id:'5',name:'扫码缴费'}],
        offLineRecord:{
          stuAreaId:'',
          studentIdentify:'',
          stuId:'',
          stuName:'',
          cashType:'4',
          payee:util.getSession('user').name,
          stuDerate:false,
          stuDerateAmount:0,
          cashItems:[],
        },
        cashColumns:[
          {
            title: '序号',
            align: 'center',
            type:'index',

          },
          {
            title: '缴费项目',
            align: 'center',
            key:'name',
            render: (h, params) => {
              let that=this;
              return h('Select', {
                  props: {value: params.row.id},
                  on: {
                    'on-change':function (value) {
                      for(let i=0;i<that.payItems.length;i++){
                        if(that.payItems[i].id==value){
                          params.row.id= that.payItems[i].id;
                          params.row.name= that.payItems[i].name;
                          params.row.cost=that.payItems[i].amount;
                          if(that.offLineRecord.stuDerate && that.payItems[i].derate){//如果学生支持政府补助并且收费项目支持政府补助
                            params.row.reduced=(that.offLineRecord.stuDerateAmount>params.row.cost)? params.row.cost:that.offLineRecord.stuDerateAmount
                          }else{
                            params.row.reduced=0;
                          }
                          params.row.masterReduced=0;
                          params.row.derate=that.payItems[i].derate;
                          params.row.totalCost=that.calculateItemTotal(params.row);
                          setTimeout(function () {
                            that.offLineRecord.cashItems[params.index].id= that.payItems[i].id;
                            that.offLineRecord.cashItems[params.index].name= that.payItems[i].name;
                            that.offLineRecord.cashItems[params.index].cost=that.payItems[i].amount;
                            if(that.offLineRecord.stuDerate && that.payItems[i].derate){//如果学生支持政府补助并且收费项目支持政府补助
                              that.offLineRecord.cashItems[params.index].reduced=(that.offLineRecord.stuDerateAmount>params.row.cost)? params.row.cost:that.offLineRecord.stuDerateAmount
                            }else{
                              that.offLineRecord.cashItems[params.index].reduced=0;
                            }
                            that.offLineRecord.cashItems[params.index].masterReduced=0;
                            that.offLineRecord.cashItems[params.index].derate=that.payItems[i].derate;
                            that.offLineRecord.cashItems[params.index].totalCost=that.calculateItemTotal(params.row);
                            //计算该条实收 and 计算总价
                          },200)
                        }
                      }
                    }
                  }
                },
                this.payItems.map((item) => {
                  return h('Option', {props: {value: item.id, label: item.name}})
                }),

              )
            }
          },
          {
            title: '应收金额(元)',
            align: 'center',
            key:'cost',
            render:(h,params)=>{
              let that=this;
              return h('div',[
                h('inputNumber',{
                  props: {
                    //max: 10,
                    min: 0,
                    step: 0.01,
                    precision:2,
                    value: params.row.cost,
                    activeChange:false
                  },
                  on:{
                    'on-change':(event)=>{
                      params.row.cost=event;
                      params.row.totalCost=that.calculateItemTotal(params.row);
                      setTimeout(function () {
                        that.offLineRecord.cashItems[params.index].cost=event;
                        that.offLineRecord.cashItems[params.index].totalCost=that.calculateItemTotal(params.row);
                        //计算该条实收and 计算总价
                      },200)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '政府补助额度(元)',
            align: 'center',
            key:'reduced',
            render:(h,params)=>{
              let that=this;
              return h('div',[
                h('inputNumber',{
                  props: {
                    max: params.row.cost-params.row.masterReduced,
                    min: 0,
                    step: 0.01,
                    precision:2,
                    value: params.row.reduced,
                    activeChange:false,
                    disabled:(!that.offLineRecord.stuDerate || !params.row.derate),
                  },
                  on:{
                    'on-change':(event)=>{
                      params.row.reduced=event;
                      params.row.totalCost=that.calculateItemTotal(params.row);
                      setTimeout(function () {
                        that.offLineRecord.cashItems[params.index].reduced=event;
                        that.offLineRecord.cashItems[params.index].totalCost=that.calculateItemTotal(params.row);
                        //计算该条实收and 计算总价
                      },200)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '减免金额(元)',
            align: 'center',
            key:'masterReduced',
            render:(h,params)=>{
              let that=this;
              return h('div',[
                h('inputNumber',{
                  props: {
                    max: params.row.cost-params.row.reduced,
                    min: 0,
                    step: 0.01,
                    precision:2,
                    value: params.row.masterReduced,
                    activeChange:false
                  },
                  on:{
                    'on-change':(event)=>{
                      params.row.masterReduced=event;
                      params.row.totalCost=that.calculateItemTotal(params.row);
                      setTimeout(function () {
                        that.offLineRecord.cashItems[params.index].masterReduced=event;
                        that.offLineRecord.cashItems[params.index].totalCost=that.calculateItemTotal(params.row);
                        //计算该条实收and 计算总价
                      },200)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '实收(元)',
            align: 'center',
            key:'totalCost'
          },
          {
            title: '操作',
            key: 'action',
            width: 90,
            align: 'center',
            render: (h, params) => {
              let that=this;
              return h('a', [
                h('a', {
                  style: {
                    color: 'red',
                  },
                  on: {
                    click: e => {
                      e.stopPropagation();
                     that.offLineRecord.cashItems.splice(params.index,1);
                    }
                  }
                }, '删除'),
              ])
            }
          },
        ],
        ruleInline:{
          stuAreaId:[{ required: true, message: '请选择校区', trigger: 'change' }],
          stuName:[{ required: true, message: '请选择学生', trigger: 'blur' }],
          cashType:[{ required: true, message: '请选择缴费方式', trigger: 'change' }],
          cashier:[{ required: true, message: '请输入收款人', trigger: 'blur' }],
          cashItems:[{ required: true, message: '请增加缴费项', trigger: 'change' ,type:'array'}],
        },
/////////////////////////////////////////////
        masterReducedModal:false,
        masterReducedList:[],
        masterReducedColumns:[
          {
            title: '序号',
            align: 'center',
            type:'index',

          },
          {
            title: '缴费项目',
            align: 'center',
            key: 'itemName',
          },
          {
            title: '应收金额(元)',
            align: 'center',
            key: 'strReceivables',
          },
          {
            title: '减免金额(元)',
            align: 'center',
            key:'rectorDerate',
            render:(h,params)=>{
              let that=this;
              return h('div',[
                h('inputNumber',{
                  props: {
                    //max: parseFloat(((params.row.receivables)/100).toFixed(2)),
                    min: 0,
                    step: 0.01,
                    precision:2,
                    value: parseFloat((params.row.rectorDerate/100).toFixed(2)),
                    activeChange:false
                  },
                  on:{
                    'on-change':(event)=>{
                      params.row.rectorDerate=event*100;
                      setTimeout(function () {
                        that.masterReducedList[params.index].rectorDerate=event*100;
                      },200)
                    }
                  }
                })
              ])
            }
          },
        ],
 ///////////////////////////////////////
        reducedModal:false,
        reducedList:[],
        reducedColumns:[
          {
            title: '序号',
            align: 'center',
            type:'index',

          },
          {
            title: '缴费项目',
            align: 'center',
            key: 'itemName',
          },
          {
            title: '应收金额(元)',
            align: 'center',
            key: 'strReceivables',
          },
          {
            title: '政府补助额(元)',
            align: 'center',
            key:'derate',
            render:(h,params)=>{
              let that=this;
              return h('div',[
                h('inputNumber',{
                  props: {
                    //max: parseFloat(((params.row.receivables)/100).toFixed(2)),
                    min: 0,
                    step: 0.01,
                    precision:2,
                    value:parseFloat((params.row.derate/100).toFixed(2)),
                    activeChange:false,
                    disabled:!params.row.derateItem,//这个缴费项没有政府补助
                  },
                  on:{
                    'on-change':(event)=>{
                      params.row.derate=event*100;
                      setTimeout(function () {
                        that.reducedList[params.index].derate=event*100;
                      },200)
                    }
                  }
                })
              ])
            }
          },
        ],
        //////////////////////////////
        remarkModal:false,
        remarkCurrent:null,
////////////////////////////////////////
        selectStudentModel:false,
        stuSelectList:[],//选择的学生列表
        //////////////////////////////////
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
      getPayItemNameById(id){
        for(let i=0;i<this.searchPayItems.length;i++){
          let item=this.searchPayItems[i];
          if(item.id==id){
            return item.name;
          }
        }
      },
      getEditPayItems(){
        let params={
          schoolId: util.getLocal("schoolId"),
          tokenId: util.getSession("token").id,
        }
        this.$fetch(ucApi.platform.PLATFORM_GET_PAYMENT_LIST_BY_PAGE, params).then((res)=> {
          if (res.code == 200) {
            let arr=res.body==undefined?[]:res.body.list;
            this.payItems=arr;
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
        if(!this.$Filters.isEmpty(this.search.refund)){
          params.refund = this.search.refund
        }else{
          params.refund =0
        }
        if(!this.$Filters.isEmpty(this.search.serialNo)){
          params.billNo = this.search.serialNo
        }
        if(!this.$Filters.isEmpty(this.search.areaId)){
          params.areaId = this.search.areaId
        }
        if(!this.$Filters.isEmpty(this.search.stuPhone)){
          params.stuPhone = this.search.stuPhone
        }
        this.$fetch(ucApi.payment.GET_PAYMENT_RECORDS, params).then((res)=> {

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
        if(!this.$Filters.isEmpty(this.search.refund)){
          params.refund = this.search.refund
        }else{
          params.refund =0
        }
        if(!this.$Filters.isEmpty(this.search.serialNo)){
          params.billNo = this.search.serialNo
        }
        if(!this.$Filters.isEmpty(this.search.areaId)){
          params.areaId = this.search.areaId
        }
        this.$fetchBlob(ucApi.payment.EXPORT_PAYMENT_RECORD, params).then((res)=> {
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
        this.$fetch(ucApi.payment.GET_PAYMENT_RECORD_PRINT, params).then((res)=> {
          if (res.code == 200) {
            this.printItem=res.body;
            this.printModal=true;
          }
        }).catch((err)=>{

        });
      },
      exportPrintData(){

      },
      printPage(){
        this.$refs.easyPrint.print();
        this.changePrintCount();
      },
      changePrintCount(){
        this.$post(ucApi.payment.CHANGE_PAYMENT_PRINT_COUNT, {
          tokenId: util.getSession("token").id,
          id: this.printItem.id,
        }).then((res)=> {
          if (res.code == 200) {
            this.getListData();
          }else{

          }
        });
      },
      addOffLine(){
        this.offLineModal=true;
        this.offLineRecord.stuId="";
        this.offLineRecord.studentIdentify="";
        this.offLineRecord.stuDerate=false;
        this.offLineRecord.stuName="";
        this.offLineRecord.stuDerateAmount=0;
        this.offLineRecord.stuAreaId="";
        this.offLineRecord.cashItems=[];
        this.stuSelectList=[];
      },
      commitOffLine(){
        let self = this;
        this.$refs.offLineRef.validate((validate) => {
          if (validate) {
            setTimeout(()=>{
              let recordVo={
                stuAreaId:self.offLineRecord.stuAreaId,
                studentIdentify:self.offLineRecord.studentIdentify,
                stuDerate:self.offLineRecord.stuDerate,
                source:self.offLineRecord.cashType,
                payee:self.offLineRecord.payee,
                schoolId:util.getLocal("schoolId"),
              }
              let arr=[];
              let sum=0;
              for(let i=0;i<self.offLineRecord.cashItems.length;i++){
                let item=self.offLineRecord.cashItems[i];
                sum=sum+item.totalCost;
                arr.push({
                  //id:item.id,
                  itemName:item.name,
                  receivables:(item.cost*100),
                  derate:(item.reduced*100),
                  derateItem:item.derate,
                  rectorDerate:(item.masterReduced*100),
                  amount:(item.totalCost*100),
                })
              }
              recordVo.details=arr;

              self.$Modal.confirm({
                title:'请确认',
                content:'本次实际缴费'+sum+'元?',
                width: '400px',
                okText: '确定',
                cancelText: '关闭',
                onOk(){
                  self.$load.show();
                  self.$post(self.$api.payment.SAVE_OFFLINE_PAYMENT_RECORD, {
                    tokenId: util.getSession("token").id,
                    schoolId: util.getLocal("schoolId"),
                  }, recordVo).then(function (res) {
                    self.$load.hide();
                    if (res.code == 200 && res.body!=null) {
                      self.$Message.success('操作成功!');
                      self.offLineModal=false;
                      setTimeout(()=>{
                        self.showPrintModal(res.body);
                      },300)

                    }else{
                      self.$Message.error(res.message);
                    }
                  });
                }
              })
            },200)

          }
        });
      },

      showPrintModal(id){
        let that=this;
        this.$Modal.confirm({
          title: '提示',
          content: '现在要立即打印该缴费单吗?',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk(){
            that.openPrintModal({id:id});
            that.doSearch();
          },
          onCancel(){
            that.doSearch();
          }
        });
      },
      showStudentDraw(){
        let arr=[];
        this.stuSelectList.forEach((stu,index)=>{
          arr.push(stu.id);
        })
        this.$refs.selStudent.selList = arr
        this.$refs.selStudent.getListData()
        this.selectStudentModel=true;
      },
      addCashItem(){
        if(this.$Filters.isEmpty(this.offLineRecord.stuAreaId)){
          this.$Modal.info({
            title:'提示',
            content:'请先选择校区'
          })
          return;
        }
        if(this.$Filters.isEmpty(this.offLineRecord.stuId)){
          this.$Modal.info({
            title:'提示',
            content:'请先选择学生'
          })
          return;
        }
        let arr={
          id:'',
          name:'',
          cost:0,
          reduced:0,
          masterReduced:0,
          totalCost:0,
        }
        this.offLineRecord.cashItems.push(arr);
      },
      calculateItemTotal(item){
        return parseFloat((item.cost-item.reduced-item.masterReduced)<=0?0:(item.cost-item.reduced-item.masterReduced).toFixed(2)) ;
      },
      handleSummary ({ columns, data }) {
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
            sums[key] = {
              key,
              value: ''
            };

          }
          if (index === 1) {
            sums[key] = {
              key,
              value: '应收'
            };

          }
          if(index==2){
            let sum=0;
            for(let i=0;i<this.offLineRecord.cashItems.length;i++){
              let item=this.offLineRecord.cashItems[i];
                sum=sum+item.cost;
            }
            sums[key] = {
              key,
              value: sum+ ' 元'
            };
          }
          if (index === 3) {
            sums[key] = {
              key,
              value: '减免'
            };

          }
          if(index==4){
            let sum=0;
            for(let i=0;i<this.offLineRecord.cashItems.length;i++){
              let item=this.offLineRecord.cashItems[i];
                sum=sum+item.reduced+item.masterReduced;
            }
            sums[key] = {
              key,
              value: sum+ ' 元'
            };
          }
          if (index === 5) {
            sums[key] = {
              key,
              value: '实收'
            };

          }
          if(index==6){
            let sum=0;
            for(let i=0;i<this.offLineRecord.cashItems.length;i++){
              let item=this.offLineRecord.cashItems[i];
                sum=sum+item.totalCost;
            }
            sums[key] = {
              key,
              value:sum+ ' 元'
            };
          }

        });

        return sums;
      },

      handleReducedSummary({ columns, data }){
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
            sums[key] = {
              key,
              value: ''
            };

          }
          if (index === 1) {
            sums[key] = {
              key,
              value: ''
            };

          }
          if (index === 2) {
            sums[key] = {
              key,
              value: '合计减免'
            };

          }
          if(index==3){
            let sum=0;
            for(let i=0;i<this.reducedList.length;i++){
              let item=this.reducedList[i];
              sum=sum+parseFloat(item.derate);
            }
            sum=(sum/100).toFixed(2)
            sums[key] = {
              key,
              value: (sum)+ ' 元'
            };
          }
        });

        return sums;
      },

      handleMasterReducedSummary({ columns, data }){
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
            sums[key] = {
              key,
              value: ''
            };

          }
          if (index === 1) {
            sums[key] = {
              key,
              value: ''
            };

          }
          if (index === 2) {
            sums[key] = {
              key,
              value: '合计减免'
            };

          }
          if(index==3){
            let sum=0;
            for(let i=0;i<this.masterReducedList.length;i++){
              let item=this.masterReducedList[i];
              sum=sum+parseFloat(item.rectorDerate==null?0:item.rectorDerate);
            }
            sum=(sum/100).toFixed(2)
            sums[key] = {
              key,
              value: sum+ ' 元'
            };
          }
        });

        return sums;
      },

      commitReduced(){
        this.$load.show();
        setTimeout(()=>{
          let params={
            tokenId: util.getSession("token").id,
            id:this.reducedList[0].recordId,
          }
          this.$post(this.$api.payment.SAVE_PAYMENT_ITEMS_BY_ID, params,this.reducedList).then((res)=> {
            if (res.code == 200&&res.body==true) {
              this.$load.hide();
              this.reducedModal=false;
              this.$Message.success('保存成功!');
              this.getListData();
            }else{
              this.$load.hide();
              this.$Message.error(res.message);
            }
          });
        },200)
      },
      commitMasterReduced(){
        this.$load.show();
        setTimeout(()=>{
          let params={
            tokenId: util.getSession("token").id,
            id:this.masterReducedList[0].recordId,
          }
          this.$post(this.$api.payment.SAVE_PAYMENT_ITEMS_BY_ID, params,this.masterReducedList).then((res)=> {
            if (res.code == 200&&res.body==true) {
              this.$load.hide();
              this.masterReducedModal=false;
              this.$Message.success('保存成功!');
              this.getListData();
            }else{
              this.$load.hide();
              this.$Message.error(res.message);
            }
          });
        },200)
      },
      commitRemark(){
        let params={
          tokenId: util.getSession("token").id,
          ids:this.remarkCurrent.id,
          remark:this.remarkCurrent.remark,
        }
        this.$load.show();
        this.$post(this.$api.payment.SAVE_PAYMENT_RECORD_REMARK, params,{}).then((res)=> {
          if (res.code == 200&&res.body==true) {
            this.$load.hide();
            this.remarkModal=false;
            this.$Message.success('保存成功!');
            this.getListData();
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },

      getRecordDetailPayItems(id,type){
        let params={
          tokenId: util.getSession("token").id,
          id:id,
        }
        this.$fetch(ucApi.payment.GET_PAYMENT_ITEMS_BY_ID, params).then((res)=> {
          if (res.code == 200) {
            if(type==0){
              this.reducedList=res.body==undefined?[]:res.body;
              this.reducedModal=true;
            }else if(type==1){
              this.masterReducedList=res.body==undefined?[]:res.body;
              this.masterReducedModal=true;
            }
          }
        }).catch((err)=>{

        });
      },

      selectStudentOk(){
        this.$refs.selStudent.emitSelectStudent();
        this.selectStudentModel = false;
      },
      selectStudents(item){
        this.stuSelectList = item;
        this.offLineRecord.studentIdentify=this.stuSelectList[0].studentNo,
        this.offLineRecord.stuId=this.stuSelectList[0].id;
        this.offLineRecord.stuName=this.stuSelectList[0].name;
        this.offLineRecord.stuDerate=this.stuSelectList[0].derate==null?false:this.stuSelectList[0].derate;
        this.offLineRecord.stuDerateAmount=this.stuSelectList[0].derateAmount==null?0:this.stuSelectList[0].derateAmount;
        this.offLineRecord.cashItems=[];
      },
      getRefundDetailInfo(recordId){
        let that=this;
        let params = {
          tokenId: util.getSession("token").id,
          schoolId: this.$util.getLocal("schoolId"),
          recordId:recordId,
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
      this.getSearchPayItems();
      this.getEditPayItems();
      this.getGradeList();
      this.getCampus();
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
