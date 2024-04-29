<template>
  <div  style="padding: 20px;background: #f5f6f7;">
    <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:97px;margin: 0px 5px 0px 0px"  @click="addData">+添加</Button>
      <div style="width: 100%;display: flex;flex-wrap: wrap;justify-content: flex-end;background: #ffffff;">
        <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea" clearable style="margin-right: 5px;width: 120px;margin-bottom: 5px;">
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
        <!--      <Input clearable v-model="search.year" placeholder="请输入入学年份"   style="width: 150px;margin-right: 5px;margin-bottom: 5px;"></Input>-->
        <Input clearable v-model="search.name" placeholder="请输入姓名"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
        <Input clearable v-model="search.phone" placeholder="请输入手机号"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
        <Input clearable v-model="search.studentNo" placeholder="请输入学号"   style="width: 120px;margin-right: 5px;margin-bottom: 5px;"></Input>
        <Checkbox v-model="search.derate"  style="width:100px;margin-right: 5px;margin-bottom: 5px;">享政府补助</Checkbox>
        <Checkbox v-model="search.zhuhai"  style="width:90px;margin-right: 5px;margin-bottom: 5px;">珠海户籍</Checkbox>
        <Checkbox v-model="search.purchaseQuota"  style="width:90px;margin-right: 5px;margin-bottom: 5px;">政府学位</Checkbox>

        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="doSearch">查询</Button>
      </div>
    </div>

    <div>
<!--      <div style="width: 100%;display: flex;justify-content: flex-end;margin-bottom: 5px;background: #ffffff;padding: 10px;">-->
<!--        <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" disabled @click="">导入</Button>-->
<!--        <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" disabled @click="">导出</Button>-->
<!--      </div>-->
      <div  >
        <Table row-key="id" border :columns="columns" :data="tableDataList" :stripe="true"></Table>
      </div>
      <div >
        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page.total" :current="page.current" :page-size="page.size" show-elevator   @on-change='pageChanged'  class="footclass"/>
      </div>
    </div>

    <!-- 添加或编辑-->
    <Modal
      v-model="showModal"
      ref="modal"
      :title="title"
      :loading="submitLoading"
      :mask-closable="false"
      @on-ok="submit"
      @on-cancel="cancelModal"
      width="700"
      height="800"
      ok-text = '保存'
      cancel-text = '取消'>
      <Tabs @on-click="clickTabs" v-model="curTab">
        <TabPane label="基本信息" name="1">
          <Form :model="obj"   label-position="top" :rules="ruleInline">

            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="照片">
                  <div style="display: flex;justify-content: flex-start;align-items: center;">
                    <img v-if="picUrl != '' && head.uploadList.length == 0"  style="width: 96px;height: 96px;" :src="picUrl" alt="" @click="handleView(picUrl)">
                    <div class="demo-upload-list" v-for="item in head.uploadList">
                      <img :src="item.url" >
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                      </div>
                    </div>
                    <Upload
                      ref="upload"
                      :show-upload-list="false"
                      :before-upload="handleBeforeUpload"
                      type="drag"
                      :action="head.url"
                      style="display: inline-block;width:110px;height: 96px;margin-left: 10px;">
                      <div style="width: 110px;height:96px;display: flex;flex-direction: column;align-items: center;justify-content: center;">
                        <div style="width: 80%;border: 1px solid #dcdee2;border-radius: 4px;">
                          <Icon type="ios-share-outline" size="15"></Icon>
                          <span style="font-size: 12px;color:#666666;">上传照片</span>
                        </div>
                        <span style="width: 100%;font-size: 6px;color:#999999;">上传个人照片/头像</span>
                      </div>
                    </Upload>
                    <Modal title="查看图片" v-model="head.visible">
                      <img :src="head.imgName" v-if="head.visible" style="width: 100%" >
                    </Modal>
                  </div>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="姓名" prop="name">
                  <Input v-model="obj.name" placeholder="请输入姓名" maxlength="50"></Input>
                </FormItem>
              </Col>
            </Row>

            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="性别" prop="sex">
                  <Select v-model="obj.sex" placeholder="请选择性别"   clearable style="margin-right: 5px;">
                    <Option v-for="(item,index) in sexArr"
                            :value="item.value"
                            :label="item.label"
                            :key="index">
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="民族">
                  <Select v-model="obj.nationality" placeholder="请选择民族"   clearable style="margin-right: 5px;">
                    <Option v-for="(item,index) in nationArr"
                            :value="item.dictValue"
                            :label="item.dictValue"
                            :key="index">
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>

        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="所属校区" prop="areaId">
              <Select v-model="obj.areaId" placeholder="请选择所属校区"   clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in areaList"
                        :value="item.id"
                        :label="item.name"
                        :key="item.id">
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="学号" prop="studentNo">
              <Input v-model="obj.studentNo" placeholder="请输入学号"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="出生日期" >
              <DatePicker
                v-model="obj.birthday"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择出生日期"
                style="width: 100%;"
                :options="options"
                @on-change="onBirthdayChange"
              >
              </DatePicker>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="身份证号" >
              <Input v-model="obj.idCard" placeholder="请输入身份证号" maxlength="18"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="籍贯">
              <Input v-model="obj.nativePlace" placeholder="请输入籍贯"  maxlength="100"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="手机号码" prop="phone">
              <Input v-model="obj.phone" placeholder="请输入手机号码" maxlength="11"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="年级" prop="grade">
              <Select v-model="obj.grade" placeholder="请选择年级"  label-in-value  @on-change="onSelectGrade" clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in gradeList"
                        :value="item.code"
                        :label="item.name"
                        :key="item.code">
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="班级 (请输入编号，如01代表1班)" prop="inClass">
              <Input v-model="obj.inClass" placeholder="请输入班级" type="number" maxlength="10" id="classInput"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="入学日期" >
              <DatePicker
                v-model="obj.enterDate"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择日期"
                style="width: 100%;"
                :options="options"
                @on-change="onEnterDateChange"
              >
              </DatePicker>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="是否走读生" >
              <Select v-model="obj.dayStudent" placeholder="请选择是否走读生"   clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in boolArr"
                        :value="item.value"
                        :label="item.label"
                        :key="index">
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="是否珠海户籍学生" >
              <Select v-model="obj.zhuhai" placeholder="请选择珠海户籍学生"   clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in boolArr"
                        :value="item.value"
                        :label="item.label"
                        :key="index">
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11" >
            <FormItem label="是否政府购买学位学生" >
              <Select v-model="obj.purchaseQuota" placeholder="请选择是否政府购买学位学生"   clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in boolArr"
                        :value="item.value"
                        :label="item.label"
                        :key="index">
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="居住地址" >
              <Input v-model="obj.address" placeholder="请输入居住地址"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="状态">
              <Select v-model="obj.state" placeholder="请选择状态"   clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in statusArr"
                        :value="item.value"
                        :label="item.label"
                        :key="index">
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="全国学籍" >
              <Input v-model="obj.schoolRoll" placeholder="请输入全国学籍"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="户口类型">
              <Select v-model="obj.hkType" placeholder="请选择户口类型"   clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in hkArr"
                        :value="item.value"
                        :label="item.label"
                        :key="index">
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="是否在校用餐" >
              <Select v-model="obj.dining" placeholder="请选择是否在校用餐"   clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in boolArr"
                        :value="item.value"
                        :label="item.label"
                        :key="index">
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="是否乘坐校车" >
              <Select v-model="obj.bus" placeholder="请选择是否乘坐校车"   clearable style="margin-right: 5px;">
                <Option v-for="(item,index) in boolArr"
                        :value="item.value"
                        :label="item.label"
                        :key="index">
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="是否享政府补助" >
                  <Select v-model="obj.derate" placeholder="请选择是否享政府补助"  style="margin-right: 5px;">
                    <Option v-for="(item,index) in boolArr"
                            :value="item.value"
                            :label="item.label"
                            :key="index">
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="政府补助额度" >
                  <InputNumber :max="99999" :min="0" :disabled="obj.derate==0" v-model="obj.derateAmount" placeholder="请输入政府补助额度(精确到小数点后两位)" style="width: 100%" @on-blur="fomartMoney"></InputNumber>
                </FormItem>
              </Col>
            </Row>

        <Row style="justify-content: space-between;margin-top: 15px;">
          <Col span="24">
            <FormItem label="银行卡卡号" >
              <Input v-model="obj.bankCard" placeholder="请输入银行卡卡号"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="家长姓名" prop="parentName">
              <Input v-model="obj.parentName" placeholder="请输入家长姓名" maxlength="50"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="银行卡关联身份证号" prop="parentIdCard">
              <Input v-model="obj.parentIdCard" placeholder="请输入银行卡关联身份证号" maxlength="18"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row style="justify-content: space-between;">
          <Col span="11">
            <FormItem label="账户名" >
              <Input v-model="obj.bankAccount" placeholder="请输入账户名"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="开户行" >
              <Input v-model="obj.bankName" placeholder="请输入开户行"></Input>
            </FormItem>
          </Col>
        </Row>


      </Form>
        </TabPane>
        <TabPane v-if="extraInfos" label="家长信息" name="2">
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;padding: 10px;margin-bottom: 10px;"
               v-for="(item,index) in parentData" v-bind:key="index">
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;width: 95%;">
              <div style="display: flex;justify-content: space-between;align-items: center;">
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">家长姓名:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <Input style="width: 260px;margin-top: 5px;margin-right: 10px;" placeholder="请输入亲属姓名" v-model="item.name"></Input>
                </div>
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">与学生关系:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <Select v-model="item.relation" placeholder="请选择关系"   clearable style="width: 260px;margin-top: 5px;">
                    <Option v-for="(item,index) in relationArr"
                            :value="item.value"
                            :label="item.label"
                            :key="index">
                    </Option>
                  </Select>
                </div>
              </div>
              <div style="display: flex;justify-content: space-between;align-items: center;margin-top: 10px;">
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">家长身份证:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <Input style="width: 260px;margin-top: 5px;margin-right: 10px;" placeholder="请输入身份证" v-model="item.idCard" maxlength="18"></Input>
                </div>
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">家长联系电话:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <Input style="width: 260px;margin-top: 5px;margin-right: 10px;" placeholder="请输入联系电话" v-model="item.phone" maxlength="11"></Input>
                </div>
              </div>
            </div>

            <div style="display: flex;flex-direction: column;">
              <div>
                <span style="color: #ff0000;text-align: center;font-size: 14px;" @click="deleteParent(index)">删除</span>
              </div>
            </div>
          </div>
          <div v-if="parentData.length > 0" style="width: 100%;height: 35px;border: 1px solid #3867CC;background: #3867CC;display: flex;display: flex;justify-content: center;align-items: center;color:#ffffff;margin-bottom: 5px;" @click="saveParent">保存家长信息</div>
          <div style="width: 100%;height: 35px;border: 1px dashed #666666;padding: 10px;display: flex;display: flex;justify-content: center;align-items: center;" @click="addParent">+添加家长信息</div>
        </TabPane>
        <TabPane v-if="extraInfos" label="乘坐校车信息" name="3">
          敬请期待
        </TabPane>
      </Tabs>
    </Modal>


    <Modal
      v-model="showAccountModal"
      :title="accountTitle"
      :loading="accountLoading"
      width="500"
      :footer-hide = "true"
      :mask-closable="false">
      <AccountConfig
        ref="acc"
        @closeAccount="closeAccount">
      </AccountConfig>
    </Modal>
  </div>
</template>

<script>
  import util from "@/libs/util.js";
  import AccountConfig from './AccountConfig'
    export default {
      name: "StudentInfoIndex",
      components: {
        AccountConfig,
      },
      props:[''],
      data() {
        let that=this
        return {
          search:{
            areaId:'',
            grade:'',
            inClass:'',
            name:'',
            phone:'',
            studentNo:'',
            zhuhai:false,
            purchaseQuota:false,
            derate:false,
          },
          page:{
            current:1,
            size:20,
            total:0,
          },
          tableHeight:800,
          tableDataList:[],
          gradeList:[],
          areaList:[],
          nationArr:[],
          politicalArr:[],
          sexArr:[
            {
              value:'男',
              label:'男',
            },
            {
              value:'女',
              label:'女',
            },
          ],
          hkArr:[
            {
              value:'省外非农业、省外农业',
              label:'省外非农业、省外农业',
            },
            {
              value:'省内市外非农业、省内市外农业',
              label:'省内市外非农业、省内市外农业',
            },
            {
              value:'市内香洲区外非农业、市内香洲区外农业',
              label:'市内香洲区外非农业、市内香洲区外农业',
            },
            {
              value:'香洲区内非农业、香洲区内农业',
              label:'香洲区内非农业、香洲区内农业',
            },
          ],
          statusArr:[
            {
              value:'正常',
              label:'正常',
            },
            {
              value:'退学',
              label:'退学',
            },
            {
              value:'休学',
              label:'休学',
            },
            {
              value:'毕业',
              label:'毕业',
            },
          ],
          relationArr:[
            {
              value:'爸爸',
              label:'爸爸',
            },
            {
              value:'妈妈',
              label:'妈妈',
            },
            {
              value:'爷爷',
              label:'爷爷',
            },
            {
              value:'奶奶',
              label:'奶奶',
            },
            {
              value:'外公',
              label:'外公',
            },
            {
              value:'外婆',
              label:'外婆',
            },
          ],
          boolArr:[
            {
              value:1,
              label:'是',
            },
            {
              value:0,
              label:'否',
            },
          ],
          head:{
            checkAllGroup:[],
            imgName: '',
            visible: false,
            uploadList: [],
            url:this.$api.uploadImage.UPLOAD_IMAGE,
            imgItem:[]
          },



          columns: [
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
              title: '入学日期',
              key: 'enterDate',
              align: 'center',
              minWidth:100,
            },
            {
              title: '民族',
              key: 'nationality',
              align: 'center',
              width: 50,
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
            {
              title: '是否政府补助',
              key: 'sex',
              width: 60,
              align: 'center',
              render: (h, params) => {
                return h('span', params.row.derate?'是':'否')
              }
            },
            {
              title: '是否珠海学籍',
              key: 'sex',
              width: 60,
              align: 'center',
              render: (h, params) => {
                return h('span', params.row.zhuhai?'是':'否')
              }
            },
            {
              title: '是否政府学位',
              key: 'sex',
              width: 60,
              align: 'center',
              render: (h, params) => {
                return h('span', params.row.purchaseQuota?'是':'否')
              }
            },
            {
              title: '是否乘坐校车',
              key: 'sex',
              minWidth: 60,
              align: 'center',
              render: (h, params) => {
                return h('span', params.row.bus?'是':'否')
              }
            },
            {
              title: '操作',
              key: 'action',
              align: 'center',
              width: 170,
              render: (h, params) => {
                let that=this;
                let stateName = ''
                let color = '#666666'
                let state = params.row.bindStatus
                switch (state) {
                  case 0:
                    stateName = '账号未激活'
                    color = '#666666'
                    break;
                  case 1:
                    stateName = '账号已激活'
                    color = '#0000ff'
                    break;
                  case 2:
                    stateName = '账号已禁用'
                    color = '#D51024'
                    break;
                  case 3:
                    stateName = '账号已锁定'
                    color = '#ff0000'
                    break;
                }
                return h('a', [
                  h('a', {
                    on: {
                      click:e => {
                        e.stopPropagation();
                        that.EditItem(params.row);
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
                          content: '删除该人员将同时删除对应的系统账号，是否确认删除？',
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
                  h('Divider', {props: {type: 'vertical'}}),
                  h('a', {
                    style: {
                      color: color,
                    },
                    on: {
                      click:e => {
                        e.stopPropagation();
                        that.setAccount(params.row);
                      }
                    }
                  }, stateName),
                ])

              }
            },
          ],
          ruleInline:{
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            sex:[
              {required: true, message: '请选择性别', trigger: 'change'},
            ],
            phone: [
              { required: true, message: '请输入手机号码', trigger: 'blur' }
            ],
            grade: [
              { required: true, message: '请选择年级', trigger: 'blur' },
            ],
            inClass: [
              { required: true, message: '请输入班级', trigger: 'blur' }
            ],
            studentNo: [
              { required: true, message: '请输入学号', trigger: 'blur' }
            ],
            areaId:[
              {required: true, message: '请选择所属校区', trigger: 'change'},
            ],
            orgId:[
              {required: true, message: '请选择所属部门', trigger: 'change'},
            ],
            parentName: [
              { required: true, message: '请输入家长姓名', trigger: 'blur' }
            ],
            parentIdCard: [
              { required: true, message: '请输入银行卡关联身份证号', trigger: 'blur' }
            ],
          },
          obj:{},
          options: {
            disabledDate (date) {
              return date && date.valueOf() > that.$moment(that.$moment().format('YYYY-MM-DD')).valueOf();
            }
          },

          showModal:false,
          title:'',
          submitLoading:true,
          picUrl:'',
          extraInfos:false,//关联信息展示
          curTab:'1',

          currentObjId:'',//当前编辑人员id
          parentData:[],//家长信息

          showAccountModal:false,
          accountTitle:'',
          accountLoading:true,
        }
      },
      computed: {},
      watch: {
        'obj.derate'(value){
          if(value==0){
            this.obj.derateAmount=0;
          }
        }
      },
      methods: {
        onBirthdayChange(val){
          this.obj.birthday = val
        },
        onEnterDateChange(val){
          this.obj.enterDate = val
        },
        doSearch(){
          this.page.current = 1
          this.getListData()
        },
        pageChanged(page){
          this.page.current=page;
          this.getListData();
        },
        getListData() {
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
          if(this.search.zhuhai){
            params.zhuhai = true
          }
          if(this.search.purchaseQuota){
            params.purchaseQuota = true
          }
          if(this.search.derate){
            params.derate = true
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


        onChangeArea(val){
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

        handleView (url) {
          this.head.imgName = url;
          this.head.visible = true;
        },
        handleRemove (file) {
          const fileList = this.head.uploadList;
          this.head.uploadList.splice(fileList.indexOf(file), 1);
        },

        handleBeforeUpload (file) {
          if(this.head.uploadList.length == 1){
            this.$Message.error('不能超过一个！');
            return ;
          }
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload=((e)=>{
            file.url = reader.result
            this.head.uploadList.push(file)
          })
          return false;
        },

        delete(idd){
          this.$delete(this.$api.platform.PLATFORM_STUDENT_DELETE, {
            tokenId: util.getSession("token").id,
            id: idd
          }).then((res)=> {
            if (res.code == 200) {
              this.$Message.success('删除成功');
              this.getListData();
            }else{
              this.$Message.error(res.message);
            }
          });
        },


        uploadImg(Item){
          let that = this
          this.$load.show();
          let imageData=new FormData();
          imageData.append("images",this.head.uploadList[0]);
          imageData.append("userId",this.$util.getSession("user").id);
          imageData.append("tokenId",this.$util.getSession("token").id);
          this.$post(this.head.url,{},imageData)
            .then((res) => {
              this.$load.hide();
              if (res.code != 200) {
                this.$Message.error(res.message);
                return;
              }
              Item.smallImageId = res.body[0].small.id
              Item.largeImageId = res.body[0].large.id
              that.save(Item);
            })

            .catch((err) => {
              this.$Message.error(err.message);
              this.$load.hide();
            })
        },


        submit(){
          let that=this;
          if(this.$Filters.isEmpty(this.obj.name)){
            this.$Message.error("姓名不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.sex)){
            this.$Message.error("性别不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.areaId)){
            this.$Message.error("所属校区不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.studentNo)){
            this.$Message.error("学号不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(!this.$Filters.isEmpty(this.obj.idCard) && !this.$Filters.checkIdcard(this.obj.idCard)){
            this.$Message.error('身份证号格式不正确');
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.phone)){
            this.$Message.error("手机号码不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(!this.$Filters.isEmpty(this.obj.phone) && !this.$Filters.checkPhone(this.obj.phone)){
            this.$Message.error('手机号码格式不正确');
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.grade)){
            this.$Message.error("年级不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.inClass)){
            this.$Message.error("班级不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.obj.derate==1 && this.obj.derateAmount<=0){
            this.$Message.error("请输入惠减补额度");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.parentName)){
            this.$Message.error("家长姓名不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(this.$Filters.isEmpty(this.obj.parentIdCard)){
            this.$Message.error("银行卡关联身份证号不能为空");
            this.$refs.modal.buttonLoading=false;
            return;
          }
          if(!this.$Filters.isEmpty(this.obj.parentIdCard) && !this.$Filters.checkIdcard(this.obj.parentIdCard)){
            this.$Message.error('银行卡关联身份证号格式不正确');
            this.$refs.modal.buttonLoading=false;
            return;
          }

          let Item = {
            id: this.obj.id,
            userId: this.obj.userId,
            schoolId: this.obj.schoolId,
            name:this.obj.name,
            sex:this.obj.sex,
            areaId:this.obj.areaId,
            areaName:this.obj.areaName,
            studentNo:this.obj.studentNo,
            birthday: !this.$Filters.isEmpty(this.obj.birthday)?this.$moment(this.obj.birthday).format('YYYY-MM-DD'):null,
            nationality:this.obj.nationality,
            nativePlace:this.obj.nativePlace,
            phone:this.obj.phone,
            grade:this.obj.grade,
            // gradeName:this.obj.gradeName,
            inClass:this.obj.inClass,
            enterDate: !this.$Filters.isEmpty(this.obj.enterDate)?this.$moment(this.obj.enterDate).format('YYYY-MM-DD'):null,
            dayStudent:this.obj.dayStudent == 1?true:false,
            zhuhai:this.obj.zhuhai == 1?true:false,
            purchaseQuota:this.obj.purchaseQuota == 1?true:false,
            idCard:this.obj.idCard,
            address:this.obj.address,
            schoolRoll:this.obj.schoolRoll,
            hkType:this.obj.hkType,
            state:this.obj.state,
            dining:this.obj.dining == 1?true:false,
            bus:this.obj.bus == 1?true:false,
            parentName:this.obj.parentName,
            parentIdCard:this.obj.parentIdCard,
            bankCard:this.obj.bankCard,
            bankAccount:this.obj.bankAccount,
            bankName:this.obj.bankName,
            derate:this.obj.derate==1?true:false,
            derateAmount:this.obj.derateAmount==undefined?0:this.obj.derateAmount

          }
          if(this.head.uploadList.length != 0){
            this.uploadImg(Item)//上传图片
          }else{
            this.save(Item);
          }
          this.head.uploadList = []
          this.showModal = false;
        },

        save(item){
          this.$load.show();
          this.$post(this.$api.platform.PLATFORM_STUDENT_SAVE, {
            tokenId: this.$util.getSession("token").id,
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

        getDetailById(id){
          let that = this
          this.$load.show();
          this.$fetch(this.$api.platform.PLATFORM_STUDENT_GET_BY_ID, {
            tokenId: this.$util.getSession("token").id,
            id:id,
          })
            .then((res) => {
              this.$load.hide();
              if (res.code != 200) {
                this.$Message.error(res.message);
                return;
              }
              that.obj = res.body;
              if(that.obj.dayStudent){
                that.obj.dayStudent = 1
              }else{
                that.obj.dayStudent = 0
              }
              if(that.obj.zhuhai){
                that.obj.zhuhai = 1
              }else{
                that.obj.zhuhai = 0
              }
              if(that.obj.purchaseQuota){
                that.obj.purchaseQuota = 1
              }else{
                that.obj.purchaseQuota = 0
              }
              if(that.obj.dining){
                that.obj.dining = 1
              }else{
                that.obj.dining = 0
              }
              if(that.obj.bus){
                that.obj.bus = 1
              }else{
                that.obj.bus = 0
              }
              if(that.obj.derate){
                that.obj.derate = 1
              }else{
                that.obj.derate = 0
              }
              if(that.obj.imageContainer != undefined){
                that.picUrl = that.obj.imageContainer.large.url
              }else{
                that.picUrl = ''
              }
              that.extraInfos = true
              that.curTab = '1'
              that.title = '编辑学生信息'
              that.showModal = true;
            })
            .catch((err) => {
              this.$Message.error(err.message);
              this.$load.hide();
            })
        },



        cancelModal(){
          this.obj= {
          }
          this.picUrl = ''
          this.head.uploadList = []
          this.showModal = false;
        },

        addData(){
          this.obj = {
            derate:0,
            derateAmount:0,
          }
          this.picUrl = ''
          this.obj.schoolId = this.$util.getLocal("schoolId")
          this.extraInfos = false
          this.curTab = '1'
          this.title = '新增学生信息'
          this.showModal = true;
        },

        EditItem(item){
          this.getDetailById(item.id)
          this.currentObjId = item.id
        },


        clickTabs(item){
          switch (item) {
            case '1':

              console.log('1')
              return
            case '2':
              this.parentData = []
              this.getParentList(this.currentObjId);
              return
            case '3':

              return
          }
        },

        addParent(){
          this.parentData.push({
            name:'',
            relation:'',
            idCard:'',
            phone:'',
          })
        },

        deleteParent(pos){
          let that = this
          this.$Modal.confirm({
            title: '删除',
            content: '确定删除吗？',
            width: '400px',
            okText: '确定',
            cancelText: '关闭',
            onOk() {
              if(!that.$Filters.isEmpty(that.parentData[pos].id)){
                that.doDeleteParent(that.parentData[pos].id)
              }else{
                that.parentData.splice(pos,1);
              }
            }
          })
        },

        getParentList(idd){
          let that = this
          this.$load.show();
          this.$fetch(this.$api.platform.PLATFORM_STUDENT_PARENT_LIST, {
            tokenId: this.$util.getSession("token").id,
            studentId:idd,
          })
            .then((res) => {
              this.$load.hide();
              if (res.code != 200) {
                this.$Message.error(res.message);
                return;
              }
              if(undefined != res.body){
                that.parentData=res.body;
              }else{
                that.parentData=[];
              }
            })
            .catch((err) => {
              this.$Message.error(err.message);
              this.$load.hide();
            })
        },

        doDeleteParent(idd){
          let that = this
          this.$delete(this.$api.platform.PLATFORM_STUDENT_PARENT_DELETE, {
            tokenId: util.getSession("token").id,
            id: idd
          }).then((res)=> {
            if (res.code == 200) {
              this.$Message.success('删除成功');
              that.parentData = []
              that.getParentList(that.currentObjId);
            }else{
              this.$Message.error(res.message);
            }
          });
        },

        saveParent(){
          let that = this
          for(let i = 0;i <this.parentData.length; i++){
            let item = that.parentData[i]
            if(this.$Filters.isEmpty(item.name)){
              this.$Message.error("家长姓名不能为空");
              return;
            }
            if(this.$Filters.isEmpty(item.relation)){
              this.$Message.error("与学生关系不能为空");
              return;
            }
            if(this.$Filters.isEmpty(item.idCard)){
              this.$Message.error("家长身份证不能为空");
              return;
            }
            if(!this.$Filters.isEmpty(item.idCard)&& !this.$Filters.checkIdcard(item.idCard)){
              this.$Message.error("家长身份证格式不正确");
              return;
            }
            if(this.$Filters.isEmpty(item.phone)){
              this.$Message.error("家长联系电话不能为空");
              return;
            }
            if(!this.$Filters.isEmpty(item.phone)&& !this.$Filters.checkPhone(item.phone)){
              this.$Message.error("家长联系电话格式不正确");
              return;
            }
          }

          let list = []
          this.parentData.forEach(item => {
            item.schoolId = util.getLocal("schoolId")
            item.operatorId = util.getSession("user").id,
            item.operatorName = util.getSession("user").name,
            item.operatorPhone = util.getSession("user").username,
            list.push(item.name)
          })
          let temp = this.isRepeat(list) // 如果有重复则返回true，否则为false
          if (temp) {
            this.$Message.error("家长姓名存在重复")
            return;
          }

          let item = this.parentData
          this.$load.show();
          this.$post(this.$api.platform.PLATFORM_STUDENT_PARENT_SAVE, {
            tokenId: util.getSession("token").id,
            studentId:this.currentObjId,
          },item).then((res)=> {
            if (res.code == 200) {
              this.$load.hide();
              this.$Message.success('保存成功!');
              that.parentData = []
              that.getParentList(that.currentObjId);
            }else{
              this.$load.hide();
              this.$Message.error(res.message);
            }
          });
        },


        setAccount(item){
          if(!this.$Filters.isEmpty(item.userId)){
            this.$refs.acc.getUserById(item.userId)
          }else{
            this.$refs.acc.name = item.name
            this.$refs.acc.username = item.phone
          }
          this.$refs.acc.bindStatus = item.bindStatus
          this.$refs.acc.type = 2
          this.$refs.acc.memberId = item.id

          this.accountTitle = '账号管理  /  学生信息'
          this.showAccountModal = true;
        },

        closeAccount(){
          this.getListData();
          this.showAccountModal = false;
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

        getNationList() {
          let that = this
          this.$fetch(this.$api.platform.getDictionary, {
            type: 2,//获取民族
          }).then((res) => {
            this.$load.hide();
            if (res.code == 200) {
              that.nationArr = res.body;
            }

          }).catch((err) => {

          })
        },
        getPoliticalList() {
          let that = this
          this.$fetch(this.$api.platform.getDictionary, {
            type: 3,//获取政治面貌
          }).then((res) => {
            this.$load.hide();
            if (res.code == 200) {
              that.politicalArr = res.body;
            }

          }).catch((err) => {

          })
        },

        //判重方法
        isRepeat(arr) {
          var hash = {}
          for (var i in arr) {
            if (hash[arr[i]]) { return true }
            hash[arr[i]] = true
          }
          return false
        },
        fomartMoney: function () {
          if (this.obj.derateAmount > 0) {
            this.obj.derateAmount = Number(this.$util.toDecimal2(this.obj.derateAmount));
          }
        }
      },
      created() {

      },
      mounted() {
        this.gradeList = util.getLocal("grades")
        this.getListData()
        this.getAreaList()
        this.getNationList()
        this.getPoliticalList()
        document.getElementById("classInput").addEventListener("input",function(event){
          event.target.value = event.target.value.replace(/[^0-9]/g,'');
        });

      },
    }
</script>

<style scoped lang="less">
  .demo-upload-list{
    display: inline-block;
    width: 96px;
    height: 96px;
    text-align: center;
    line-height: 96px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  @deep: ~'>>>';
  @{deep}.ivu-upload-drag {
    border: none;
  }

  @{deep}.ivu-table{
    @media screen and (max-height: 1800px) and (orientation: landscape){
      height: 85vh!important;
    }
    @media screen and (max-height: 1200px) and (orientation: landscape){
      height: 78vh!important;
    }
    @media screen and (max-height: 1080px) and (orientation: landscape){
      height: 77vh!important;
    }
    @media screen and (max-height: 1024px) and (orientation: landscape){
      height: 73vh!important;
    }
    @media screen and (max-height: 900px) and (orientation: landscape){
      height: 70vh!important;
    }
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: 65vh!important;
    }
  }

</style>
