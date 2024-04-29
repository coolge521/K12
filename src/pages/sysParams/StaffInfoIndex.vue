<template>
  <div class="v-clock" style="padding: 20px;background: #f5f6f7;">
    <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 10px;background: #ffffff;padding: 20px;">
      <Button type="primary" style="width:97px;margin: 0px 5px 0px 0px"  @click="addData">+添加</Button>
      <div style="width: 100%;display: flex;justify-content: flex-end;background: #ffffff;">
        <Select v-model="search.areaId" placeholder="请选择校区"  @on-change="onChangeArea" clearable style="margin-right: 5px;width: 120px;">
          <Option v-for="(item,index) in areaList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id">
          </Option>
        </Select>
        <div @click="chooseTree(1)" style="width: 120px;margin-right: 5px;">
          <Input v-model="search.depName" placeholder="请选择部门" :clearable="false" readonly ></Input>
        </div>
        <Input clearable v-model="search.searchOrg" placeholder="请输入部门关键字"   style="width: 130px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.name" placeholder="请输入姓名"   style="width: 120px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.phone" placeholder="请输入手机号"   style="width: 120px;margin-right: 5px;"></Input>
        <Input clearable v-model="search.empNo" placeholder="请输入工号"   style="width: 120px;margin-right: 5px;"></Input>
        <Button type="primary" style="width:90px;margin: 0px 10px 0px 0px"  @click="doSearch">查询</Button>
      </div>
    </div>

    <Row>
<!--      <div style="width: 100%;display: flex;justify-content: flex-end;margin-bottom: 5px;background: #ffffff;padding: 10px;">-->
<!--        <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" disabled @click="">导入</Button>-->
<!--        <Button type="primary" style="width:90px;margin: 0px 5px 0px 0px" disabled @click="">导出</Button>-->
<!--      </div>-->
      <i-col span='24'>
        <div>
          <i-table border :columns="columns" :data="tableDataList" :stripe="true" ></i-table>
        </div>
      </i-col>
      <div class="right">
        <Page slot='footer' size="small" :show-total=true :transfer=true :total="page.total" :current="page.current" :page-size="page.size" show-elevator   @on-change='pageChanged'  class="footclass"/>
      </div>
    </Row>

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
                  <Input v-model="obj.name" placeholder="请输入姓名" ></Input>
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
                  <Select v-model="obj.areaId" placeholder="请选择所属校区" label-in-value @on-change="onSelectArea" clearable style="margin-right: 5px;">
                    <Option v-for="(item,index) in areaList"
                            :value="item.id"
                            :key="item.id">
                      {{item.name}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="所属部门">
                  <div @click="chooseTree(2)">
                    <Input v-model="obj.orgName" placeholder="请选择所属部门" :clearable="false" readonly ></Input>
                  </div>
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
                    @on-change="birthdayChange"
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
                <FormItem label="工号" >
                  <Input v-model="obj.employeeNo" placeholder="请输入工号"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="E-mail" >
                  <Input v-model="obj.email" placeholder="请输入E-mail"></Input>
                </FormItem>
              </Col>
            </Row>
            <!--        <Row style="justify-content: space-between;">-->
            <!--          <Col span="11" style="visibility: hidden;">-->
            <!--            <FormItem label="教学科目" >-->
            <!--              <Input  ></Input>-->
            <!--            </FormItem>-->
            <!--          </Col>-->
            <!--        </Row>-->
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="老家固定电话" >
                  <Input v-model="obj.nativeTelephone" placeholder="请输入老家固定电话"></Input>
                </FormItem>
              </Col>
              <Col span="11" >
                <FormItem label="老家详细地址" >
                  <Input v-model="obj.nativeAddress" placeholder="请输入老家详细地址"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="婚否">
                  <Select v-model="obj.maritalStatus" placeholder="请选择婚否"   clearable style="margin-right: 5px;">
                    <Option v-for="(item,index) in marryArr"
                            :value="item.value"
                            :label="item.label"
                            :key="index">
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="政治面貌">
                  <Select v-model="obj.politicsStatus" placeholder="请选择政治面貌"   clearable style="margin-right: 5px;">
                    <Option v-for="(item,index) in politicalArr"
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
                <FormItem label="暂住地址" >
                  <Input v-model="obj.address" placeholder="请输入暂住地址"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="毕业院校" >
                  <Input v-model="obj.graduateInstitution" placeholder="请输入毕业院校"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="最高学历" >
                  <Input v-model="obj.highestEducation" placeholder="请输入最高学历"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="所学专业" >
                  <Input v-model="obj.major" placeholder="请输入所学专业"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="毕业证号" >
                  <Input v-model="obj.graduationNo" placeholder="请输入毕业证号"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="资格证号" >
                  <Input v-model="obj.qualificationNo" placeholder="请输入资格证号"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="普通话等级证号" >
                  <Input v-model="obj.mandarinNo" placeholder="请输入普通话登记证号"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="职称及证号" >
                  <Input v-model="obj.titleNo" placeholder="请输入职称及证号"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="心理健康C证" >
                  <Input v-model="obj.healthC" placeholder="请输入心理健康C证"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="计算机等级或模块" >
                  <Input v-model="obj.computerRank" placeholder="请输入计算机等级或模块"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="特长" >
                  <Input v-model="obj.specialty" placeholder="请输入特长"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="合同有效期" >
                  <DatePicker
                    v-model="obj.contractLife"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 100%;"
                    @on-change="contractLifeChange"
                  >
                  </DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="首次工作日期" >
                  <DatePicker
                    v-model="obj.startDate"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 100%;"
                    @on-change="workDateChange"
                    :options="options"
                  >
                  </DatePicker>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="工龄" >
                  <Input v-model="obj.workingAge" type="number" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="入校时间" >
                  <DatePicker
                    v-model="obj.enterDate"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 100%;"
                    @on-change="schoolDateChange"
                    :options="options"
                  >
                  </DatePicker>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="校龄" >
                  <Input v-model="obj.schoolAge" type="number" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row style="justify-content: space-between;">
              <Col span="11">
                <FormItem label="有无先天性疾病或其它病史" >
                  <Input v-model="obj.medicalHistory" placeholder="请输入" maxlength="200"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="因病有何禁忌" >
                  <Input v-model="obj.taboo" placeholder="请输入" maxlength="200"></Input>
                </FormItem>
              </Col>
            </Row>

            <div>
              <FormItem label="自我评价">
                <Input
                  v-model="obj.selfEvaluation"
                  type="textarea"
                  :autosize="{minRows: 5,maxRows: 5}"
                  maxlength="500"
                  placeholder="请输入自我评价（500字）" />
              </FormItem>
            </div>
            <div>
              <FormItem label="获奖描述">
                <Input
                  v-model="obj.awards"
                  type="textarea"
                  :autosize="{minRows: 5,maxRows: 5}"
                  maxlength="500"
                  placeholder="请输入获奖描述（500字）" />
              </FormItem>
            </div>

          </Form>
        </TabPane>
        <TabPane v-if="extraInfos" label="亲属信息" name="2">
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;padding: 10px;margin-bottom: 10px;"
               v-for="(item,index) in kinsfolkData" v-bind:key="index">
            <div style="display: flex;flex-direction: column;">
              <div>
                <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                <span style="color: #333333;text-align: center;font-size: 14px;">亲属姓名:</span>
                <span style="color: #999999;text-align: center;font-size: 14px;"></span>
              </div>
              <Input style="width: 130px;margin-top: 5px;margin-right: 10px;" placeholder="请输入亲属姓名" v-model="item.name"></Input>
            </div>
            <div style="display: flex;flex-direction: column;">
              <div>
                <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                <span style="color: #333333;text-align: center;font-size: 14px;">关系:</span>
                <span style="color: #999999;text-align: center;font-size: 14px;"></span>
              </div>
              <Input style="width: 130px;margin-top: 5px;margin-right: 10px;" placeholder="请输入关系" v-model="item.relation"></Input>
            </div>
            <div style="display: flex;flex-direction: column;">
              <div>
                <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                <span style="color: #333333;text-align: center;font-size: 14px;">现工作单位:</span>
                <span style="color: #999999;text-align: center;font-size: 14px;"></span>
              </div>
              <Input style="width: 130px;margin-top: 5px;" placeholder="请输入现工作单位" v-model="item.unit"></Input>
            </div>
            <div style="display: flex;flex-direction: column;">
              <div>
                <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                <span style="color: #333333;text-align: center;font-size: 14px;">联系电话:</span>
                <span style="color: #999999;text-align: center;font-size: 14px;"></span>
              </div>
              <Input style="width: 130px;margin-top: 5px;margin-right: 10px;" placeholder="请输入联系电话" v-model="item.phone" maxlength="11"></Input>
            </div>
            <div style="display: flex;flex-direction: column;">
              <div>
                <span style="color: #ff0000;text-align: center;font-size: 14px;" @click="deleteKinsfolk(index)">删除</span>
              </div>
            </div>
          </div>
          <div v-if="kinsfolkData.length > 0" style="width: 100%;height: 35px;border: 1px solid #3867CC;background: #3867CC;display: flex;display: flex;justify-content: center;align-items: center;color:#ffffff;margin-bottom: 5px;" @click="saveKinsfolk">保存亲属信息</div>
          <div style="width: 100%;height: 35px;border: 1px dashed #666666;padding: 10px;display: flex;display: flex;justify-content: center;align-items: center;" @click="addKinsfolk">+添加亲属信息</div>
        </TabPane>
        <TabPane v-if="extraInfos" label="教育经历" name="3">
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;padding: 10px;margin-bottom: 10px;"
               v-for="(item,index) in educationData" v-bind:key="index">
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;width: 95%;">
              <div style="display: flex;justify-content: space-between;align-items: center;">
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">开始日期:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <DatePicker  type="date" format="yyyy-MM-dd" :options="options" v-model="item.startDate"  placeholder="请选择开始日期" style="width: 180px;margin-top: 5px;margin-right: 10px;"></DatePicker>
                </div>
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">结束日期:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <DatePicker  type="date" format="yyyy-MM-dd" :options="options" v-model="item.endDate"  placeholder="请选择开始日期" style="width: 180px;margin-top: 5px;margin-right: 10px;"></DatePicker>
                </div>
              </div>
              <div style="display: flex;justify-content: space-between;align-items: center;margin-top: 10px;width: 100%;">
                <div style="display: flex;flex-direction: column;width: 100%;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">受教育描述:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <Input style="width: 95%;margin-top: 5px;margin-right: 10px;" placeholder="请输入受教育描述"
                         type="textarea"   :autosize="{minRows: 2,maxRows: 5}" v-model="item.remark" maxlength="2000"></Input>
                </div>
              </div>
            </div>

            <div style="display: flex;flex-direction: column;">
              <div>
                <span style="color: #ff0000;text-align: center;font-size: 14px;" @click="deleteEdu(index)">删除</span>
              </div>
            </div>
          </div>
          <div v-if="educationData.length > 0" style="width: 100%;height: 35px;border: 1px solid #3867CC;background: #3867CC;display: flex;display: flex;justify-content: center;align-items: center;color:#ffffff;margin-bottom: 5px;" @click="saveEdu">保存教育经历</div>
          <div style="width: 100%;height: 35px;border: 1px dashed #666666;padding: 10px;display: flex;display: flex;justify-content: center;align-items: center;" @click="addEdu">+添加教育经历</div>
        </TabPane>
        <TabPane v-if="extraInfos" label="工作经历" name="4">
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;padding: 10px;margin-bottom: 20px;"
               v-for="(item,index) in workData" v-bind:key="index">
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;width: 95%;">
              <div style="display: flex;justify-content: space-between;align-items: center;">
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">开始日期:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <DatePicker  type="date" format="yyyy-MM-dd" :options="options" v-model="item.startDate"  placeholder="请选择开始日期" style="width: 180px;margin-top: 5px;margin-right: 10px;"></DatePicker>
                </div>
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">结束日期:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <DatePicker  type="date" format="yyyy-MM-dd" :options="options" v-model="item.endDate"  placeholder="请选择开始日期" style="width: 180px;margin-top: 5px;margin-right: 10px;"></DatePicker>
                </div>
              </div>
              <div style="display: flex;justify-content: flex-start;align-items: center;margin-top: 10px;width: 100%;">
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">工作单位:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <Input style="width: 180px;margin-top: 5px;margin-right: 10px;" placeholder="请输入工作单位" v-model="item.unit"></Input>
                </div>
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">所在学科:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <Select v-model="item.subject" placeholder="请选择所在学科"  style="width: 180px;margin-top: 5px;margin-right: 10px;">
                    <Option v-for="(item,index) in subjectList"
                            :value="item.name"
                            :label="item.name"
                            :key="item.id">
                    </Option>
                  </Select>
                </div>
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="color: #ff0000;text-align: center;font-size: 14px;">*</span>
                    <span style="color: #333333;text-align: center;font-size: 14px;">职务:</span>
                    <span style="color: #999999;text-align: center;font-size: 14px;"></span>
                  </div>
                  <Input style="width: 180px;margin-top: 5px;" placeholder="请输入职务" v-model="item.title"></Input>
                </div>
              </div>
            </div>

            <div style="display: flex;flex-direction: column;">
              <div>
                <span style="color: #ff0000;text-align: center;font-size: 14px;" @click="deleteWork(index)">删除</span>
              </div>
            </div>
          </div>
          <div v-if="workData.length > 0" style="width: 100%;height: 35px;border: 1px solid #3867CC;background: #3867CC;display: flex;display: flex;justify-content: center;align-items: center;color:#ffffff;margin-bottom: 5px;" @click="saveWork">保存工作经历</div>
          <div style="width: 100%;height: 35px;border: 1px dashed #666666;padding: 10px;display: flex;display: flex;justify-content: center;align-items: center;" @click="addWork">+添加工作经历</div>
        </TabPane>
      </Tabs>

    </Modal>

    <Modal
      v-model="treeModal"
      :title="treeTitle"
      :loading="treeLoading"
      :mask-closable="false"
      @on-ok="treeOk"
      @on-cancel="treeCancel"
      ok-text = '确定'
      cancel-text = '重置'>
      <treeTemplate
        ref="treeTemplate"
        :tableList="treeList"
        :childrenKey="'children'"
        :attribute="attribute"
        @changeTree="changeTree">
      </treeTemplate>
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
  import treeTemplate from '@/main/treeTemplate'
  import AccountConfig from './AccountConfig'
  export default {
    name: "StaffInfoIndex",
    components: {
      treeTemplate,
      AccountConfig,
    },
    props:[''],
    data() {
      let that=this
      return {
        search:{
          areaId:'',
          depId:'',
          depName:'',
          searchOrg:'',
          name:'',
          phone:'',
          empNo:'',
        },
        page:{
          current:1,
          size:20,
          total:0,
        },
        tableDataList:[],
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
        marryArr:[
          {
            value:'是',
            label:'是',
          },
          {
            value:'否',
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



        statusArr:[
          {
            value:'true',
            label:'有效',
          },
          {
            value:'false',
            label:'注销',
          },
        ],
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
            minWidth:100,
          },
          {
            title: '部门',
            key: 'orgName',
            align: 'center',
            minWidth:100,
          },
          {
            title: '工号',
            key: 'employeeNo',
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
            title: '性别',
            key: 'sex',
            width: 50,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.sex)
            }
          },
          {
            title: '民族',
            key: 'nationality',
            width: 50,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.nationality)
            }
          },
          {
            title: '婚否',
            key: 'maritalStatus',
            width: 50,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.maritalStatus)
            }
          },
          {
            title: '政治面貌',
            key: 'politicsStatus',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.politicsStatus)
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 180,
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
            { required: true, message: '请输入办公电话', trigger: 'blur' }
          ],
          areaId:[
            {required: true, message: '请选择所属校区', trigger: 'change'},
          ],
          orgId:[
            {required: true, message: '请选择所属部门', trigger: 'change'},
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
        kinsfolkData:[],//亲属信息
        educationData:[],//教育经历
        workData:[],//工作经历
        subjectList:[],//学科

        treeModal:false,
        treeTitle:'',
        treeLoading:true,
        treeItem:{},
        treeSelectType:1,//1搜索   2设置

        item:[],
        treeList:[],
        attribute:{
          showCheckbox:false,
        },

        showAccountModal:false,
        accountTitle:'',
        accountLoading:true,
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
        if(!this.$Filters.isEmpty(this.search.depId)){
          params.orgId = this.search.depId
        }
        if(!this.$Filters.isEmpty(this.search.searchOrg)){
          params.searchOrg = this.search.searchOrg
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
        this.$fetch(this.$api.platform.PLATFORM_EMPLOYEE_LIST, params).then((res)=> {

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


      getTreeListForUse() {
        this.$load.show();
        let params = {
          tokenId: util.getSession("token").id,
          schoolId: util.getLocal("schoolId"),
          enable:1,
        }

        if(this.treeSelectType == 1){
          if(!this.$Filters.isEmpty(this.search.areaId)){
            params.areaId = this.search.areaId
          }
        }else if(this.treeSelectType == 2){
          if(!this.$Filters.isEmpty(this.obj.areaId)){
            params.areaId = this.obj.areaId
          }
        }

        this.$fetch(this.$api.platform.PLATFORM_DEP_LIST, params).then((res)=> {

          if (res.code == 200) {
            console.log(res);
            this.$Message.success("请求完成！");
            let body=JSON.parse(JSON.stringify(res.body))
            body.forEach((item)=>{
              item._showChildren = true
              if(item.children != null && item.children.length > 0){
                item.children.forEach((chi)=>{
                  chi._showChildren = true
                })
              }
            })
            this.treeList = JSON.parse(JSON.stringify(body))

          } else{
            this.$Message.error(res.message);
          }
          this.$load.hide();
        }).catch((err)=>{
          this.treeList = [];
          this.$Message.error(err);
          this.$load.hide();
        });
      },

      onChangeArea(val){
        this.search.depId = ''
        this.doSearch();
      },
      onSelectArea(item){
        if(item != undefined){
          this.obj.areaId = item.value;
          this.obj.areaName = item.label;
        }else{
          this.obj.areaId = '';
          this.obj.areaName = '';
        }
        this.obj.orgId = ''
        this.obj.orgName = ''
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
      workDateChange(date){
        console.log('workdate=='+date);
        this.obj.startDate = date
        if(!this.$Filters.isEmpty(date)){
           let arr = date.split('-')
           let da = new Date();
           let age = da.getFullYear()-arr[0];
           console.log('age=='+age);
           this.obj.workingAge = age
           this.$forceUpdate()
        }else{
           this.obj.workingAge = null
          this.$forceUpdate()
        }
      },
      schoolDateChange(date){
        this.obj.enterDate = date
        if(!this.$Filters.isEmpty(date)){
           let arr = date.split('-')
           let da = new Date();
           let age = da.getFullYear()-arr[0];
           this.obj.schoolAge = age
           this.$forceUpdate()
        }else{
           this.obj.schoolAge = null
          this.$forceUpdate()
        }
      },
      contractLifeChange(date){
        this.obj.contractLife = date
      },
      birthdayChange(date){
        this.obj.birthday = date
      },

      delete(idd){
        this.$delete(this.$api.platform.PLATFORM_EMPLOYEE_DELETE, {
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

        let Item = {
          id: this.obj.id,
          userId: this.obj.userId,
          schoolId: this.obj.schoolId,
          name:this.obj.name,
          sex:this.obj.sex,
          areaId:this.obj.areaId,
          areaName:this.obj.areaName,
          orgId:this.obj.orgId,
          orgName:this.obj.orgName,
          birthday: !this.$Filters.isEmpty(this.obj.birthday)?this.$moment(this.obj.birthday).format('YYYY-MM-DD'):null,
          nationality:this.obj.nationality,
          nativePlace:this.obj.nativePlace,
          phone:this.obj.phone,
          employeeNo:this.obj.employeeNo,
          email:this.obj.email,
          nativeTelephone:this.obj.nativeTelephone,
          nativeAddress:this.obj.nativeAddress,
          maritalStatus:this.obj.maritalStatus,
          politicsStatus:this.obj.politicsStatus,
          idCard:this.obj.idCard,
          graduateInstitution:this.obj.graduateInstitution,
          highestEducation:this.obj.highestEducation,
          major:this.obj.major,
          graduationNo:this.obj.graduationNo,
          qualificationNo:this.obj.qualificationNo,
          mandarinNo:this.obj.mandarinNo,
          titleNo:this.obj.titleNo,
          healthC:this.obj.healthC,
          computerRank:this.obj.computerRank,
          specialty:this.obj.specialty,
          address:this.obj.address,
          startDate: !this.$Filters.isEmpty(this.obj.startDate)?this.$moment(this.obj.startDate).format('YYYY-MM-DD'):null,
          workingAge:this.obj.workingAge,
          enterDate: !this.$Filters.isEmpty(this.obj.enterDate)?this.$moment(this.obj.enterDate).format('YYYY-MM-DD'):null,
          schoolAge:this.obj.schoolAge,
          contractLife: !this.$Filters.isEmpty(this.obj.contractLife)?this.$moment(this.obj.contractLife).format('YYYY-MM-DD'):null,
          medicalHistory:this.obj.medicalHistory,
          taboo:this.obj.taboo,
          selfEvaluation:this.obj.selfEvaluation,
          awards:this.obj.awards,

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
        this.$post(this.$api.platform.PLATFORM_EMPLOYEE_SAVE, {
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
        this.$fetch(this.$api.platform.PLATFORM_EMPLOYEE_GET_BY_ID, {
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
            if(that.obj.imageContainer != undefined){
                that.picUrl = that.obj.imageContainer.large.url
            }else{
              that.picUrl = ''
            }
            that.extraInfos = true
            that.curTab = '1'
            that.title = '编辑教工信息'
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
        this.obj = {}
        this.picUrl = ''
        this.obj.schoolId = this.$util.getLocal("schoolId")
        this.extraInfos = false
        this.curTab = '1'
        this.title = '新增教工信息'
        this.showModal = true;
      },

      EditItem(item){
        this.getDetailById(item.id)
        this.currentObjId = item.id
      },


      setAccount(item){
        if(!this.$Filters.isEmpty(item.userId)){
          this.$refs.acc.getUserById(item.userId)
        }else{
          this.$refs.acc.name = item.name
          this.$refs.acc.username = item.phone
        }
        this.$refs.acc.bindStatus = item.bindStatus
        this.$refs.acc.type = 1
        this.$refs.acc.memberId = item.id

        this.accountTitle = '账号管理  /  教工信息'
        this.showAccountModal = true;
      },

      closeAccount(){
        this.getListData();
        this.showAccountModal = false;
      },


      treeOk(){
        if(this.item.length != 0){
          if(this.treeSelectType == 1){
            this.search.depId = this.item[0].id
            this.search.depName = this.item[0].name
          }else{
            this.obj.orgId = this.item[0].id
            this.obj.orgName = this.item[0].name
          }
        }
        this.treeModal = false;
      },

      treeCancel(){
        if(this.treeSelectType == 1){
          this.search.depId = ''
          this.search.depName = ''
        }else{
          this.obj.orgId = ''
          this.obj.orgName = ''
        }
        this.treeModal = false;
      },

      chooseTree(type){
        this.treeSelectType = type
        this.treeItem = {}
        this.getTreeListForUse()
        this.treeTitle = '选择部门'
        this.treeModal = true;
      },
      changeTree(item){
        this.item = item;
      },


      clickTabs(item){
        switch (item) {
          case '1':

            console.log('1')
            return
          case '2':
            this.kinsfolkData = []
            this.getKinsfolkList(this.currentObjId);
            return
          case '3':
            this.educationData = []
            this.getEduList(this.currentObjId);
            return
          case '4':
            this.workData = []
            this.getWorkList(this.currentObjId);
            return
        }
      },

      addKinsfolk(){
        this.kinsfolkData.push({
          name:'',
          relation:'',
          unit:'',
          phone:'',
        })
      },

      deleteKinsfolk(pos){
        let that = this
        this.$Modal.confirm({
          title: '删除',
          content: '确定删除吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            if(!that.$Filters.isEmpty(that.kinsfolkData[pos].id)){
              that.doDeleteKinsfolk(that.kinsfolkData[pos].id)
            }else{
              that.kinsfolkData.splice(pos,1);
            }
          }
        })
      },

      getKinsfolkList(idd){
        let that = this
        this.$load.show();
        this.$fetch(this.$api.platform.PLATFORM_EMPLOYEE_KINSFOLK_LIST, {
          tokenId: this.$util.getSession("token").id,
          employeeId:idd,
        })
          .then((res) => {
            this.$load.hide();
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            if(undefined != res.body){
              that.kinsfolkData=res.body;
            }else{
              that.kinsfolkData=[];
            }
          })
          .catch((err) => {
            this.$Message.error(err.message);
            this.$load.hide();
          })
      },

      doDeleteKinsfolk(idd){
        let that = this
        this.$delete(this.$api.platform.PLATFORM_EMPLOYEE_KINSFOLK_DELETE, {
          tokenId: util.getSession("token").id,
          id: idd
        }).then((res)=> {
          if (res.code == 200) {
            this.$Message.success('删除成功');
            that.kinsfolkData = []
            that.getKinsfolkList(that.currentObjId);
          }else{
            this.$Message.error(res.message);
          }
        });
      },

      saveKinsfolk(){
        let that = this
        for(let i = 0;i <this.kinsfolkData.length; i++){
          let item = that.kinsfolkData[i]
          if(this.$Filters.isEmpty(item.name)){
            this.$Message.error("亲属姓名不能为空");
            return;
          }
          if(this.$Filters.isEmpty(item.relation)){
            this.$Message.error("关系不能为空");
            return;
          }
          if(this.$Filters.isEmpty(item.unit)){
            this.$Message.error("现工作单位不能为空");
            return;
          }
          if(this.$Filters.isEmpty(item.phone)){
            this.$Message.error("联系电话不能为空");
            return;
          }
          if(!this.$Filters.isEmpty(item.phone)&& !this.$Filters.checkPhone(item.phone)){
            this.$Message.error("联系电话格式不正确");
            return;
          }
        }

        let list = []
        this.kinsfolkData.forEach(item => {
          item.schoolId = util.getLocal("schoolId")
          item.operatorId = util.getSession("user").id,
          item.operatorName = util.getSession("user").name,
          item.operatorPhone = util.getSession("user").username,
          list.push(item.name)
        })
        let temp = this.isRepeat(list) // 如果有重复则返回true，否则为false
        if (temp) {
          this.$Message.error("亲属姓名存在重复")
          return;
        }

        let item = this.kinsfolkData
        this.$load.show();
        this.$post(this.$api.platform.PLATFORM_EMPLOYEE_KINSFOLK_SAVE, {
          tokenId: util.getSession("token").id,
          employeeId:this.currentObjId,
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');
            that.kinsfolkData = []
            that.getKinsfolkList(that.currentObjId);
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },


      addEdu(){
        this.educationData.push({
          startDate:null,
          endDate:null,
          remark:'',
        })
      },

      deleteEdu(pos){
        let that = this
        this.$Modal.confirm({
          title: '删除',
          content: '确定删除吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            if(!that.$Filters.isEmpty(that.educationData[pos].id)){
              that.doDeleteEdu(that.educationData[pos].id)
            }else{
              that.educationData.splice(pos,1);
            }
          }
        })
      },

      getEduList(idd){
        let that = this
        this.$load.show();
        this.$fetch(this.$api.platform.PLATFORM_EMPLOYEE_EDUCATION_LIST, {
          tokenId: this.$util.getSession("token").id,
          employeeId:idd,
        })
          .then((res) => {
            this.$load.hide();
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            if(undefined != res.body){
              that.educationData=res.body;
            }else{
              that.educationData=[];
            }
          })
          .catch((err) => {
            this.$Message.error(err.message);
            this.$load.hide();
          })
      },

      doDeleteEdu(idd){
        let that = this
        this.$delete(this.$api.platform.PLATFORM_EMPLOYEE_EDUCATION_DELETE, {
          tokenId: util.getSession("token").id,
          id: idd
        }).then((res)=> {
          if (res.code == 200) {
            this.$Message.success('删除成功');
            that.educationData = []
            that.getEduList(that.currentObjId);
          }else{
            this.$Message.error(res.message);
          }
        });
      },

      saveEdu(){
        let that = this
        for(let i = 0;i <this.educationData.length; i++){
          let item = that.educationData[i]
          if(this.$Filters.isEmpty(item.startDate)){
            this.$Message.error("开始日期不能为空");
            return;
          }
          if(this.$Filters.isEmpty(item.endDate)){
            this.$Message.error("结束日期不能为空");
            return;
          }
          if(this.$moment(item.startDate).valueOf()>this.$moment(item.endDate).valueOf()){
            this.$Message.error("开始日期不能晚于结束日期");
            return;
          }
          if(this.$Filters.isEmpty(item.remark)){
            this.$Message.error("受教育描述不能为空");
            return;
          }

        }

        let list = []
        this.educationData.forEach(item => {
          item.startDate = that.$moment(item.startDate).format('YYYY-MM-DD')
          item.endDate = that.$moment(item.endDate).format('YYYY-MM-DD')
          item.schoolId = util.getLocal("schoolId")
          item.operatorId = util.getSession("user").id,
          item.operatorName = util.getSession("user").name,
          item.operatorPhone = util.getSession("user").username,
          list.push(item.name)
        })


        let item = this.educationData
        this.$load.show();
        this.$post(this.$api.platform.PLATFORM_EMPLOYEE_EDUCATION_SAVE, {
          tokenId: util.getSession("token").id,
          employeeId:this.currentObjId,
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');
            that.educationData = []
            that.getEduList(that.currentObjId);
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
      },


      addWork(){
        this.workData.push({
          startDate:null,
          endDate:null,
          subject:'',
          unit:'',
          title:'',
        })
      },

      deleteWork(pos){
        let that = this
        this.$Modal.confirm({
          title: '删除',
          content: '确定删除吗？',
          width: '400px',
          okText: '确定',
          cancelText: '关闭',
          onOk() {
            if(!that.$Filters.isEmpty(that.workData[pos].id)){
              that.doDeleteWork(that.workData[pos].id)
            }else{
              that.workData.splice(pos,1);
            }
          }
        })
      },

      getWorkList(idd){
        let that = this
        this.$load.show();
        this.$fetch(this.$api.platform.PLATFORM_EMPLOYEE_WORK_LIST, {
          tokenId: this.$util.getSession("token").id,
          employeeId:idd,
        })
          .then((res) => {
            this.$load.hide();
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            if(undefined != res.body){
              that.workData=res.body;
            }else{
              that.workData=[];
            }
          })
          .catch((err) => {
            this.$Message.error(err.message);
            this.$load.hide();
          })
      },

      doDeleteWork(idd){
        let that = this
        this.$delete(this.$api.platform.PLATFORM_EMPLOYEE_WORK_DELETE, {
          tokenId: util.getSession("token").id,
          id: idd
        }).then((res)=> {
          if (res.code == 200) {
            this.$Message.success('删除成功');
            that.workData = []
            that.getWorkList(that.currentObjId);
          }else{
            this.$Message.error(res.message);
          }
        });
      },

      saveWork(){
        let that = this
        for(let i = 0;i <this.workData.length; i++){
          let item = that.workData[i]
          if(this.$Filters.isEmpty(item.startDate)){
            this.$Message.error("开始日期不能为空");
            return;
          }
          if(this.$Filters.isEmpty(item.endDate)){
            this.$Message.error("结束日期不能为空");
            return;
          }
          if(this.$moment(item.startDate).valueOf()>this.$moment(item.endDate).valueOf()){
            this.$Message.error("开始日期不能晚于结束日期");
            return;
          }
          if(this.$Filters.isEmpty(item.unit)){
            this.$Message.error("工作单位不能为空");
            return;
          }
          if(this.$Filters.isEmpty(item.subject)){
            this.$Message.error("所在学科不能为空");
            return;
          }
          if(this.$Filters.isEmpty(item.title)){
            this.$Message.error("职务不能为空");
            return;
          }

        }

        let list = []
        this.workData.forEach(item => {
          item.startDate = that.$moment(item.startDate).format('YYYY-MM-DD')
          item.endDate = that.$moment(item.endDate).format('YYYY-MM-DD')
          item.schoolId = util.getLocal("schoolId")
          item.operatorId = util.getSession("user").id,
          item.operatorName = util.getSession("user").name,
          item.operatorPhone = util.getSession("user").username,
          list.push(item.name)
        })


        let item = this.workData
        this.$load.show();
        this.$post(this.$api.platform.PLATFORM_EMPLOYEE_WORK_SAVE, {
          tokenId: util.getSession("token").id,
          employeeId:this.currentObjId,
        },item).then((res)=> {
          if (res.code == 200) {
            this.$load.hide();
            this.$Message.success('保存成功!');
            that.workData = []
            that.getWorkList(that.currentObjId);
          }else{
            this.$load.hide();
            this.$Message.error(res.message);
          }
        });
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

      //判重方法
      isRepeat(arr) {
        var hash = {}
        for (var i in arr) {
          if (hash[arr[i]]) { return true }
          hash[arr[i]] = true
        }
        return false
      },
    },
    created() {

    },
    mounted() {
      this.getListData()
      this.getAreaList()
      this.getNationList()
      this.getPoliticalList()
      this.getSubjectList()
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
  @{deep}
  .ivu-tabs-bar{
    margin-bottom: 30px;
  }
  @{deep}.ivu-upload-drag {
    border: none;
  }


</style>
