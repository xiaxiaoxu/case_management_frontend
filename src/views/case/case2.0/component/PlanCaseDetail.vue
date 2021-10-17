<template>
  <div ref="caseDetailModal">
    <a-modal
      :width="'90%'"
      :getContainer="() => $refs.caseDetailModal"
      style="top: 20px;"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div slot="title">
        <a-icon :style="{ color: '#14C393' }" type="solution" />
        <span style="margin-left: 5px;">用例详情</span>
        <a-divider type="vertical"/>
        <span>项目：{{ this.project_name }}</span>
      </div>
      <a-row :gutter="24" style="margin-top: 5px;">
        <a-col :md="34" :lg="17">
          <div style="height: 550px; overflow-x: hidden">
            <a-row :gutter="24">
              <a-col :md="24" :lg="12">
                <a-icon type="folder" />
                <span style="margin-left: 5px">模块：{{ this.module_name }}</span>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="margin-top: 5px;">
              <a-col :md="24" :lg="12">
                <span style="font-size: 25px; color: #000000">
                  {{ this.case_name }}
                </span>
              </a-col>
            </a-row>
            <div style="margin-top: 20px; margin-left: 10px;">
              <a-row :gutter="24">
                <a-col :md="17" :lg="7">
                  <span v-if="this.execute_person !== ''">
                    <a-icon type="user-add" style="font-size: 40px;"/>
                    <span style="margin-left: 5px; position: absolute; top: 0px;">{{ this.execute_person }}</span>
                    <span style="margin-left: 46px; position: absolute; top: 22px; display: block; color: #A9AAAC;">执行人</span>
                  </span>
                  <span v-if="this.execute_person === ''" class="execute_title">
                    <a-icon type="user-add" style="font-size: 40px;"/>
                    <span style="margin-left: 46px; position: absolute; top: 13px; display: block;">执行人</span>
                  </span>
                </a-col>
                <a-col :md="17" :lg="7">
                  <span v-if="this.case_priority ===''" class="execute_title">
                    <a-icon type="up-circle" style="font-size: 40px;"/>
                    <span style="margin-left: 5px; position: absolute; top: 10px;">优先级</span>
                  </span>
                  <span v-if="this.case_priority ==='0'">
                    <a-icon type="up-circle" style="font-size: 40px; color: #E86452;"/>
                    <span style="margin-left: 5px; position: absolute; top: 0px;">高</span>
                  </span>
                  <span v-if="this.case_priority ==='1'">
                    <a-icon type="up-circle" style="font-size: 40px; color: #F6BD16;"/>
                    <span style="margin-left: 5px; position: absolute; top: 0px;">中</span>
                  </span>
                  <span v-if="this.case_priority ==='2'">
                    <a-icon type="up-circle" style="font-size: 40px; color: #5AD8A6;"/>
                    <span style="margin-left: 5px; position: absolute; top: 0px;">低</span>
                  </span>
                  <span v-if="this.case_priority !==''" style="margin-left: 45px; position: absolute; top: 22px; display: block; color: #A9AAAC;">优先级</span>
                </a-col>
                <a-col :md="17" :lg="7">
                  <div>
                    <span v-if="this.case_execute_result === '0'">
                      <a-icon type="check-circle"  :style="{ color: 'green', marginLeft: '15px', fontSize: '40px' }"/>
                      <span style="margin-left: 5px; position: absolute; top: 0px;">通过</span>
                    </span>
                    <span v-if="this.case_execute_result === '1'">
                      <a-icon type="minus-circle"  :style="{ color: 'orange', marginLeft: '15px', fontSize: '40px' }"/>
                      <span style="margin-left: 5px; position: absolute; top: 0px;">阻塞</span>
                    </span>
                    <span v-if="this.case_execute_result === '2'">
                      <a-icon type="close-circle"  :style="{ color: 'red', marginLeft: '15px', fontSize: '40px' }"/>
                      <span style="margin-left: 5px; position: absolute; top: 0px;">失败</span>
                    </span>
                    <span v-if="this.case_execute_result === '3'">
                      <a-icon type="right-circle"  :style="{ color: 'blue', marginLeft: '15px', fontSize: '40px' }"/>
                      <span style="margin-left: 5px; position: absolute; top: 0px;">跳过</span>
                    </span>
                    <div>
                      <span v-if="this.case_execute_result !== ''" style="position: absolute; top: 22px; left: 70px; display: block; color: #A9AAAC;">执行结果</span>
                      <span v-if="this.case_execute_result === ''">
                        <a-icon type="question-circle" style="font-size: 40px; margin-left: 15px;"/>
                        <span style="margin-left: 5px; position: absolute; top: 0px;">未测</span>
                        <span style="position: absolute; left: 72px; display: block; top: 22px;">执行结果</span>
                      </span>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div style="margin-top: 20px;">
              <a-card style="width: 90%; margin-left: 5px;">
                <a-row :gutter="24">
                  <a-col :md="16" :lg="8">
                    <span>创建人：{{ this.maintainer }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 5px;">用例等级：
                      <a-tag v-if="this.case_level === 'Level 1'" color="#E86452"><div class="title_tag">{{ this.case_level }}</div></a-tag>
                      <a-tag v-if="this.case_level === 'Level 2'" color="#FF9845"><div class="title_tag">{{ this.case_level }}</div></a-tag>
                      <a-tag v-if="this.case_level === 'Level 3'" color="#F6BD16"><div class="title_tag">{{ this.case_level }}</div></a-tag>
                    </span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 5px;">是否关联自动化：{{ this.if_need_automated === 'Y' ? '是' : '否' }}</span>
                  </a-col>
                </a-row>
                <a-row :gutter="24" style="margin-top: 20px;">
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 0px;">创建时间：{{ this.created_time }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 5px;">更新时间：{{ this.modified_time }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 5px;">是否冒烟测试：{{ this.if_smoke_test === 'Y' ? '是' : '否' }}</span>
                  </a-col>
                </a-row>
              </a-card>
            </div>
            <a-row :gutter="24" style="margin-top: 20px;">
              <a-col :md="48" :lg="24">
                <span style="color: #000000">前置条件：</span>
                <a-card style="width: 90%; margin-top: 5px; margin-left: 5px;">
                  <p v-if="this.pre_condition" v-html="this.pre_condition">{{ this.pre_condition }}</p>
                  <p v-else style="margin-top: 5px;">无</p>
                </a-card>
              </a-col>
            </a-row>
            <a-row :gutter="4" style="margin-top: 15px">
              <a-col :span="5">
                <span style="color: #000000">用例步骤：</span>
              </a-col>
            </a-row>
            <a-row :gutter="4" style="margin-top: 10px; margin-bottom: 20px;">
              <a-col :md="4" :lg="2">
                <span>序号</span>
              </a-col>
              <a-col :md="32" :lg="16">
                <span>步骤</span>
              </a-col>
              <a-col :md="10" :lg="5" style="margin-left: -12px;">
                <span>步骤结果</span>
              </a-col>
            </a-row>
            <a-row
              v-for="item in stepInfo"
              :key="stepInfo.indexOf(item)"
              :gutter="4"
              style="margin-top: 20px;"
            >
              <a-col :md="4" :lg="2">
                <div style="margin-top: 5px; margin-left: 2px;">
                  <a-badge
                    :count="stepInfo.indexOf(item) + 1"
                    :number-style="{ backgroundColor: '#14C393' }"
                    :overflowCount="100000"
                    :showZero="true"
                  />
                </div>
              </a-col>
              <a-col :md="42" :lg="21">
                <a-row :gutter="4">
                  <a-col :md="34" :lg="17" style="margin-left: -10px">
                    <a-input
                      type="textarea"
                      v-model="item.step_desc"
                      readOnly
                      :autoSize="true"
                      style="resize: none; border: none; overflow-y: hidden;"
                    />
                  </a-col>
                  <a-col :md="14" :lg="7" style="margin-top: 5px; margin-left: 10px;">
                    <span v-if="item.step_execute_result === '0'">
                      <a-icon type="check-circle" :style="{ color: 'green', marginLeft: '15px', fontSize: '20px' }"/>
                      <span style="margin-left: 5px;">通过</span>
                    </span>
                    <span v-if="item.step_execute_result === '1'">
                      <a-icon type="minus-circle" :style="{ color: 'orange', marginLeft: '15px', fontSize: '20px' }"/>
                      <span style="margin-left: 5px;">阻塞</span>
                    </span>
                    <span v-if="item.step_execute_result === '2'">
                      <a-icon type="close-circle" :style="{ color: 'red', marginLeft: '15px', fontSize: '20px' }"/>
                      <span style="margin-left: 5px;">失败</span>
                    </span>
                    <span v-if="item.step_execute_result === '3'">
                      <a-icon type="right-circle" :style="{ color: 'blue', marginLeft: '15px', fontSize: '20px' }"/>
                      <span style="margin-left: 5px;">跳过</span>
                    </span>
                    <a-icon v-if="item.step_execute_result === ''" type="check-circle" :style="{ color: 'grey', marginLeft: '15px', fontSize: '20px' }"/>
                    <a-icon v-if="item.step_execute_result === ''" type="close-circle" :style="{ color: 'grey', marginLeft: '15px', fontSize: '20px' }"/>
                    <a-divider type="vertical" style="margin-left: 15px; font-size: 20px;"/>
                    <a-popover v-model="item.set_step_execute_result_visible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                      <template slot="content">
                        <div class="executeResultOption" @click="()=> setCaseStepExecuteResult(item, '0')">
                          <a-icon type="check-circle" :style="{ fontSize: '16px', color: 'green', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">通过</span>
                          <a-icon v-if="item.step_execute_result === '0'" type="check"  :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setCaseStepExecuteResult(item, '1')">
                          <a-icon type="minus-circle" :style="{ fontSize: '16px', color: 'orange', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">阻塞</span>
                          <a-icon v-if="item.step_execute_result === '1'" type="check"  :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setCaseStepExecuteResult(item, '2')">
                          <a-icon type="close-circle" :style="{ fontSize: '16px', color: 'red', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">失败</span>
                          <a-icon v-if="item.step_execute_result === '2'" type="check"  :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setCaseStepExecuteResult(item, '3')">
                          <a-icon type="right-circle" :style="{ fontSize: '16px', color: 'blue', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">跳过</span>
                          <a-icon v-if="item.step_execute_result === '3'" type="check"  :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                      </template>
                      <a-icon v-show="plan_status !== '2'" type="down" :style="{ marginLeft: '15px', fontSize: '20px' }"/>
                    </a-popover>
                  </a-col>
                </a-row>
                <a-row :gutter="4" style="margin-top: 5px;">
                  <a-col :md="18" :lg="9">
                    <a-row :gutter="4">
                      <a-col :md="8" :lg="4">
                        <span style="">预期：</span>
                      </a-col>
                      <a-col :md="40" :lg="20" style="margin-left: -6%; margin-top: -1%">
                        <a-input
                          type="textarea"
                          v-model="item.expect_result"
                          readOnly
                          :autoSize="true"
                          style="resize: none; border: none; overflow-y: hidden;"
                        />
                      </a-col>
                    </a-row>
                  </a-col>
                  <a-col :md="22" :lg="11" style="margin-left: -6px;">
                    <a-row :gutter="4">
                      <a-col :md="8" :lg="4">
                        <span style="">实际：</span>
                      </a-col>
                      <a-col :md="30" :lg="15" style="margin-left: -7%; margin-top: -1.2%">
                        <a-input
                          v-model="item.actual_result"
                          type="textarea"
                          :disabled="plan_status === '2'"
                          :autoSize="true"
                          :placeholder="plan_status !== '2' ? '请输入实际结果': ''"
                          style="resize: none; overflow-y: hidden; border: 0px; border-bottom: 1px solid #14C393; "
                        />
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="48" :lg="24">
                <span style="color: #000000">备注：</span>
                <a-card style="width: 90%; margin-top: 5px; margin-left: 5px;">
                  <p v-if="this.remark" v-html="this.remark">{{ this.remark }}</p>
                  <p v-else style="margin-top: 5px;">无</p>
                </a-card>
              </a-col>
            </a-row>
            <a-row v-if="this.case_execute_result !== ''" :gutter="24" style="margin-top: 20px;">
              <a-col :md="48" :lg="24" style="margin-left: 5px;">
                <a-icon type="user" style="font-size: 16px;"/>
                <span style="margin-left: 4px">{{ this.execute_person }}</span>
                <span style="margin-left: 5px">执行于</span>
                <span style="margin-left: 4px">{{ this.case_execute_time }}</span>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="margin-top: 50px;">
              <a-col :md="48" :lg="24">
                <div style="height: 50px;">
                </div>
              </a-col>
            </a-row>
            <a-card style="height: 60px; position: absolute; bottom: 0; left: -1%; width: 98%;">
              <div v-show="this.plan_status !== '2'" style="margin-top: -25px;">
                <a-row :gutter="4" style="margin-top: 10px;">
                  <a-col :md="26" :lg="13" style="margin-top: 10px;">
                    <a-checkbox @change="onChangeCheckbox">
                      继续执行下一条
                    </a-checkbox>
                  </a-col>
                  <a-col :md="12" :lg="6">
                    <a-tag style="height: 40px; width: 120px; margin-left: 30px; margin-right: 1px;" color="#14C393" @click="setTestCaseExecuteResult('0')">
                      <a-icon :style="{ fontSize: '20px', marginLeft: '17px', marginTop: '9px' }" type="check-circle"/>
                      <span style="margin-left: 10px; font-size: 16px; position: relative; bottom: 1px;">通过</span>
                    </a-tag>
                    <a-popover v-model="setExecuteResultPopOverVisible" trigger="click" placement="topRight" :auto-adjust-overflow="true">
                      <template slot="content">
                        <div class="executeResultOption" @click="()=> setTestCaseExecuteResult('0')">
                          <a-icon type="check-circle" :style="{ fontSize: '16px', color: 'green', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">通过</span>
                          <a-icon v-if="this.case_execute_result === '0'" type="check"  :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setTestCaseExecuteResult('1')">
                          <a-icon type="minus-circle" :style="{ fontSize: '16px', color: 'orange', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">阻塞</span>
                          <a-icon v-if="this.case_execute_result === '1'" type="check"  :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setTestCaseExecuteResult('2')">
                          <a-icon type="close-circle" :style="{ fontSize: '16px', color: 'red', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">失败</span>
                          <a-icon v-if="this.case_execute_result === '2'" type="check"  :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setTestCaseExecuteResult('3')">
                          <a-icon type="right-circle" :style="{ fontSize: '16px', color: 'blue', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">跳过</span>
                          <a-icon v-if="this.case_execute_result === '3'" type="check"  :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                      </template>
                      <a-tag style="height: 40px; width: 40px;  position: absolute;" color="#14C393">
                        <a-icon :style="{ fontSize: '16px', marginLeft: '3px', marginTop: '12px' }" type="down"/>
                      </a-tag>
                    </a-popover>
                  </a-col>
                  <a-col :md="8" :lg="4" style="margin-left: -10px; margin-top: 2px;">
                    <a-tag
                      @click="goToPreviousCase()"
                      v-if="this.testCaseList.indexOf(this.current_case) > 0"
                      :color="this.leftTagColor"
                      style="height: 35px; width: 35px;"
                      @mouseenter="mouseenterLeftTag"
                      @mouseleave="mouseleaveLeftTag"
                    >
                      <a-icon :style="{ marginLeft: '3px', marginRight: '5px', marginTop: '10px' }" type="left"/>
                    </a-tag>
                    <a-tag v-if="this.testCaseList.indexOf(this.current_case) === 0" style="height: 35px; width: 35px;">
                      <a-icon :style="{ marginLeft: '3px', marginRight: '5px', marginTop: '10px' }" type="left"/>
                    </a-tag>
                    <span>{{ this.testCaseList.indexOf(this.current_case) + 1 }}</span><span style="margin-left: 4px;">/</span><span style="margin-left: 4px;">{{ this.testCaseList.length }}</span>
                    <a-tag
                      @click="goToNextCase()"
                      v-if="this.testCaseList.indexOf(this.current_case) + 1 < this.testCaseList.length"
                      :color="this.rightTagColor"
                      style="height: 35px; width: 35px; margin-left: 8px;"
                      @mouseenter="mouseenterRightTag"
                      @mouseleave="mouseleaveRightTag"
                    >
                      <a-icon :style="{ marginLeft: '3px', marginRight: '5px', marginTop: '10px' }" type="right"/>
                    </a-tag>
                    <a-tag v-if="this.testCaseList.indexOf(this.current_case) + 1 === this.testCaseList.length" style="height: 35px; width: 35px; margin-left: 8px;">
                      <a-icon :style="{ marginLeft: '3px', marginRight: '5px', marginTop: '10px' }" type="right"/>
                    </a-tag>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </div>
        </a-col>
        <a-col :md="14" :lg="7">
          <div>
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" style="height: 500px;">
                <span slot="tab">
                  评论 {{ this.comment_data ? this.comment_data.length : undefined }}
                </span>
                <div :style="'overflow-x:' + 'hidden;' + 'margin-left:' + '10px;' + 'height:' + `${this.commentHeight}`">
                  <!-- <div style="overflow-x: hidden; margin-left: 10px; height: 84%"> -->
                  <div
                    v-for="item in comment_data"
                    :key="comment_data.indexOf(item)"
                    style="margin-top: 15px;"
                    @mouseenter="onMouseEnter(item)"
                    @mouseleave="onMouseOut(item)"
                  >
                    <a-row :gutter="24">
                      <a-col :md="26" :lg="13">
                        <span :style="{ color: '#5B8FF9' }">
                          {{ item.name }}
                        </span>
                        <span style="margin-left: 5px;">
                          {{ item.time }}
                        </span>
                      </a-col>
                      <a-col :md="18" :lg="9">
                        <span>
                          <a-tooltip placement="top" v-model="item.tooltipVisible">
                            <template slot="title">
                              <span>删除</span>
                            </template>
                            <a-icon
                              v-if="item.deleteSeen"
                              a-icon
                              type="delete"
                              @click="(e)=> openDeleteConfirm(item)"
                              style="margin-left: 100%"
                            />
                          </a-tooltip>
                          <a-modal
                            v-model="deleteCommentConfirmvisible"
                            title="确认删除"
                            @ok="handleDeleteComment"
                            :width="700"
                          >
                            <p>确定要删除该评论吗？</p>
                          </a-modal>
                        </span>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :md="48" :lg="24">
                        <p v-html="item.comment_content" style="margin-top: 5px; margin-left: 5px;">
                          {{ item.comment_content }}
                        </p>
                      </a-col>
                    </a-row>
                  </div>
                  <a-empty v-if="comment_data.length == 0" description="暂无评论" :image="simpleImage" class="empty-info"/>
                </div>
                <div>
                  <CaseExecuteCommentEditor
                    v-if="commentEditorVisible"
                    :editorContent="this.commentEditorContent"
                    @commentEditorChange="commentEditorChange"
                    @changeCommentEditorVisible="changeCommentEditorVisible"
                    style="margin-left: -5px; width: 105%; position: absolute; bottom: 10px; z-index: 1"
                  />
                  <a-button
                    v-if="commentEditorVisible"
                    style="position: absolute; bottom: 30px; right: 25px; z-index: 2"
                    type="primary"
                    @click="addCaseExecuteComment()"
                  >
                    发送
                  </a-button>
                  <a-card v-show="!commentEditorVisible" @click="handleOpenCommentEditor()" style="position: absolute; bottom: 10px; width: 105%; margin-left: -5px;">
                    <span style="color: #A9AAAC;">发表评论</span>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" style="height: 500px;">
                <span slot="tab">
                  操作记录
                </span>
                <div style="overflow-x: hidden; margin-left: 10px; height: 98%">
                  <div
                    v-for="item in case_execute_operation_record_data"
                    :key="case_execute_operation_record_data.indexOf(item)"
                    style="margin-top: 15px;"
                  >
                    <a-row :gutter="24">
                      <a-col :md="26" :lg="13">
                        <span :style="{ color: '#5B8FF9' }">
                          {{ item.operation_person }}
                        </span>
                        <span style="margin-left: 5px;">
                          {{ item.operation_time }}
                        </span>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :md="48" :lg="24">
                        <div style="margin-top: 5px; margin-left: 5px;">
                          {{ item.operation_type|opertionTypeFilter }}
                          <!-- 类型为修改执行人 -->
                          <div style="margin-top: 5px;" v-if="item.operation_type === '2'">
                            <span>
                              <span v-if="item.original_value === ''">无</span>
                              {{ item.original_value }}
                              <a-icon style="margin-left:6px; margin-right: 6px;" type="arrow-right" />
                              {{ item.present_value }}
                              <span v-if="item.present_value === ''">无</span>
                            </span>
                          </div>
                          <!-- 类型为修改优先级 -->
                          <div style="margin-top: 5px;" v-if="item.operation_type === '3'">
                            <span>
                              <span v-if="!item.original_value">无</span>
                              <a-tag v-if="item.original_value === '0'" color="#E86452"><div class="class_tag">{{ item.original_value | priorityFilter }}</div></a-tag>
                              <a-tag v-if="item.original_value === '1'" color="#F6BD16"><div class="class_tag">{{ item.original_value | priorityFilter }}</div></a-tag>
                              <a-tag v-if="item.original_value === '2'" color="#5AD8A6"><div class="class_tag">{{ item.original_value | priorityFilter }}</div></a-tag>
                              <a-icon style="margin-left:6px; margin-right: 6px;" type="arrow-right" />
                              <span v-if="!item.present_value">无</span>
                              <a-tag v-if="item.present_value === '0'" color="#E86452"><div class="class_tag">{{ item.present_value | priorityFilter }}</div></a-tag>
                              <a-tag v-if="item.present_value === '1'" color="#F6BD16"><div class="class_tag">{{ item.present_value | priorityFilter }}</div></a-tag>
                              <a-tag v-if="item.present_value === '2'" color="#5AD8A6"><div class="class_tag">{{ item.present_value | priorityFilter }}</div></a-tag>
                            </span>
                          </div>
                          <!-- 类型为修改用例步骤结果 -->
                          <span v-if="item.operation_type === '4'">
                            <a style="margin-left: 5px;" @click="handleCompareCaseStepResult(item)">对比</a>
                          </span>
                          <!-- 类型为修改用例执行结果 -->
                          <div style="margin-top: 5px;" v-if="item.operation_type === '5'">
                            <span>
                              <span v-if="item.original_value === '0'">
                                <a-icon type="check-circle" :style="{ color: 'green'}"/>
                                <span style="margin-left: 5px;">{{ item.original_value | executeResultFilter }}</span>
                              </span>
                              <span v-if="item.original_value === '1'">
                                <a-icon type="minus-circle" :style="{ color: 'orange' }"/>
                                <span style="margin-left: 5px;">{{ item.original_value | executeResultFilter }}</span>
                              </span>
                              <span v-if="item.original_value === '2'">
                                <a-icon type="close-circle" :style="{ color: 'red'}"/>
                                <span style="margin-left: 5px;">{{ item.original_value | executeResultFilter }}</span>
                              </span>
                              <span v-if="item.original_value === '3'">
                                <a-icon type="right-circle" :style="{ color: 'blue' }"/>
                                <span style="margin-left: 5x;">{{ item.original_value | executeResultFilter }}</span>
                              </span>
                              <a-icon style="margin-left:6px; margin-right: 6px;" type="arrow-right" />
                              <span v-if="item.present_value === '0'">
                                <a-icon type="check-circle" :style="{ color: 'green'}"/>
                                <span style="margin-left: 5px;">{{ item.present_value | executeResultFilter }}</span>
                              </span>
                              <span v-if="item.present_value === '1'">
                                <a-icon type="minus-circle" :style="{ color: 'orange' }"/>
                                <span style="margin-left: 5px;">{{ item.present_value | executeResultFilter }}</span>
                              </span>
                              <span v-if="item.present_value === '2'">
                                <a-icon type="close-circle" :style="{ color: 'red'}"/>
                                <span style="margin-left: 5px;">{{ item.present_value | executeResultFilter }}</span>
                              </span>
                              <span v-if="item.present_value === '3'">
                                <a-icon type="right-circle" :style="{ color: 'blue' }"/>
                                <span style="margin-left: 5px;">{{ item.present_value | executeResultFilter }}</span>
                              </span>
                            </span>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                  <a-empty v-if="case_execute_operation_record_data.length == 0" description="暂无操作记录" :image="simpleImage" class="empty-info"/>
                </div>
              </a-tab-pane>
            </a-tabs>
            <CaseExecuteOperationRecordCompare
              :caseExecuteOperationRecordCompareVisible="this.caseExecuteOperationRecordCompareVisible"
              ref="caseExecuteOperationRecordCompare"
              @changeCaseExecuteOperationRecordCompareVisible="changeCaseExecuteOperationRecordCompareVisible"
            />
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { Empty } from 'ant-design-vue';
import { planCaseDetailSetExecuteResult, getPlanCaseDetail, getCaseExecuteComments, addCaseExecuteComment, deleteCaseExecuteComment, getCaseExecuteOperationRecords } from '@/api/case/case_two'
import CaseExecuteCommentEditor from './CaseExecuteCommentEditor'
import CaseExecuteOperationRecordCompare from './CaseExecuteOperationRecordCompare'
const operationTypeMap = {
  '1': '移入计划',
  '2': '修改了执行人',
  '3': '修改了优先级',
  '4': '修改了用例步骤结果',
  '5': '修改了执行结果'
}
const priorityMap = {
  '0': '高',
  '1': '中',
  '2': '低'
}
const executeResultMap = {
  '0': '通过',
  '1': '阻塞',
  '2': '失败',
  '3': '跳过'
}
const commentColumns = [
  {
    dataIndex: 'name',
    key: 'name',
    width: 470,
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  }
]
export default {
  props: {
    caseDetailVisible: {
      type: Boolean,
      default: false
    },
    testCaseList: {
      type: Array,
        default: () => {
          return []
        }
    }
  },
  components: { CaseExecuteCommentEditor, CaseExecuteOperationRecordCompare },
  data () {
    return {
      id: 0,
      keysList: [1],
      isClear: false,
      detail: '',
      arr: [],
      stepData: [],
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      stepTitle: '',
      visible: this.caseDetailVisible,
      form: this.$form.createForm(this, {
        name: 'stepExecuteSubmitForm'
      }),
      setExecuteResultPopOverVisible: false,
      confirmLoading: false,
      commentColumns,
      projectList: [],
      memberList: [],
      test_data: [],
      plan_id: 0,
      plan_status: '',
      case_execute_result: '',
      case_priority: '',
      execute_person: '',
      case_execute_time: '',
      stepInfo: [],
      enableChecked: true,
      module_list: [],
      module_value: '',
      project_name: '',
      module_name: '',
      comment_num: 1,
      leftTagColor: 'blue',
      rightTagColor: 'blue',
      commentLoading: false,
      deleteCommentConfirmvisible: false,
      commentEditorVisible: false,
      commentEditorContent: '',
      commentHeight: '',
      delete_comment_id: 0,
      project_members: [],
      project_desc: '',
      project_id: 0,
      module_id: 0,
      case_id: 0,
      case_name: '',
      case_level: '',
      if_need_automated: '',
      pre_condition: '',
      remark: '',
      created_time: '',
      modified_time: '',
      if_smoke_test: '',
      iteration_id: '',
      remarkEditorContent: '',
      preConditionEditorContent: '',
      remarkShowEditor: true,
      preConditionShowEditor: true,
      belong_project: '',
      belong_module: '',
      maintainer: '',
      case_level_list: ['leve1', 'level2', 'level3'],
      case_type_list: ['功能测试', '性能测试', '配置相关', '安装部署', '接口测试', '安全相关', '兼容性测试', 'UI测试', '其他'],
      case_type: '',
      treeDataList: [],
      comment_data: [],
      simpleImage: '',
      caseExecuteOperationRecordCompareVisible: false,
      case_execute_operation_record_data: [],
      current_case: {},
      executeNext: false
    }
  },
  watch: {
    // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
    // 但是不会同步到你刚刚在data对象中创建的 dialog 上
    // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
    // 当props修改后对应data中的副本dialog 也要同步数据。
    caseDetailVisible (val) {
      console.log('in caseDetailVisible')
      this.visible = val
    }

  },
  beforecreate () {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
  created () {
    console.log('in created function')
  },
  filters: {
    opertionTypeFilter (type) {
      return operationTypeMap[type]
    },
    priorityFilter (state) {
      return priorityMap[state]
    },
    executeResultFilter (state) {
      return executeResultMap[state]
    }
  },
  methods: {
    onChangeCheckbox (e) {
      console.log(`checked = ${e.target.checked}`)
      this.executeNext = e.target.checked
      console.log('this.executeNext: ', this.executeNext)
    },
    mouseenterLeftTag () {
      console.log('in mouseenterLeftTag')
      this.leftTagColor = '#5B8FF9'
      if (this.testCaseList.indexOf(this.current_case) + 1 === this.testCaseList.length) {
        this.rightTagColor = 'blue'
      }
    },
    mouseleaveLeftTag () {
      console.log('in mouseleaveLeftTag')
      this.leftTagColor = 'blue'
    },
    mouseenterRightTag () {
      console.log('in mouseenterRightTag')
      this.rightTagColor = '#5B8FF9'
      if (this.testCaseList.indexOf(this.current_case) === 0) {
        this.leftTagColor = 'blue'
      }
    },
    mouseleaveRightTag () {
      console.log('in mouseleaveRightTag')
      this.rightTagColor = 'blue'
    },
    goToPreviousCase () {
      console.log('in goToPreviouscase')
      console.log('this.testCaseList in goToPreviousCase: ', this.testCaseList)
      const currentCaseIndexInCaseList = this.testCaseList.indexOf(this.current_case)
      console.log('currentCaseIndexInCaseList in goToPreviousCase: ', currentCaseIndexInCaseList)
      var previouseCase = this.testCaseList[currentCaseIndexInCaseList - 1]
      console.log('previouseCase in goToPreviousCase: ', previouseCase)
      this.init(previouseCase, this.iteration_id, this.project_name, this.plan_status) // planCaseInfo, iterationId, projectName, planStatus
    },
    goToNextCase () {
      console.log('in goToNextCase')
      console.log('this.testCaseList in goToNextCase: ', this.testCaseList)
      const currentCaseIndexInCaseList = this.testCaseList.indexOf(this.current_case)
      console.log('currentCaseIndexInCaseList in goToNextCase: ', currentCaseIndexInCaseList)
      var nextCase = this.testCaseList[currentCaseIndexInCaseList + 1]
      console.log('nextCase in goToNextCase: ', nextCase)
      this.init(nextCase, this.iteration_id, this.project_name, this.plan_status) // planCaseInfo, iterationId, projectName, planStatus
    },
    setCaseStepExecuteResult (data, resultCode) {
      console.log('data, resultCode in setCaseStepExecuteResult: ', data, resultCode)
      data.set_step_execute_result_visible = false
      data.step_execute_result = resultCode
    },
    setTestCaseExecuteResult (resultCode) {
      console.log('resultCode in setTestCaseExecuteResult: ', resultCode)
      this.setExecuteResultPopOverVisible = false
      this.case_execute_result = resultCode
      this.case_execute_time = moment().format('YYYY-MM-DD HH:mm:ss')
      console.log('this.case_execute_time: ', this.case_execute_time)
      this.handleExecuteResult()
      // // 切换页面数据为下一条数据
      // if (this.executeNext) {
      //   if (this.testCaseList.indexOf(this.current_case) + 1 <= this.testCaseList.length) {
      //     console.log('执行下一条')
      //     console.log('this.testCaseList in goToNextCase: ', this.testCaseList)
      //     const currentCaseIndexInCaseList = this.testCaseList.indexOf(this.current_case)
      //     console.log('currentCaseIndexInCaseList in goToNextCase: ', currentCaseIndexInCaseList)
      //     var nextCase = this.testCaseList[currentCaseIndexInCaseList + 1]
      //     console.log('nextCase in goToNextCase: ', nextCase)
      //     this.init(nextCase, this.project_name)
      //   } else {
      //     this.handleOk()
      //   }
      // }
    },
    mouseenterExecutor () {
      console.log('in mouseenterExecutor')
    },
    changeCaseExecuteOperationRecordCompareVisible () {
      console.log('in changeCaseExecuteOperationRecordCompareVisible')
      this.caseExecuteOperationRecordCompareVisible = false
    },
    handleCompareCaseStepResult (operationData) {
      console.log('operationData in handleCompareCaseStepResult: ', operationData)
      this.caseExecuteOperationRecordCompareVisible = true
      this.$refs.caseExecuteOperationRecordCompare.init('caseStep', operationData)
    },
    onMouseEnter (data) {
      console.log('data in onMouseEnter:', data)
      data.deleteSeen = true
      // console.log('data.ellipsisSeen:', data.ellipsisSeen)
    },
    onMouseOut (data) {
      console.log('in onMouseOut')
      data.deleteSeen = false
      // console.log('data.ellipsisSeen:', data.ellipsisSeen)
    },
    openDeleteConfirm (data) {
        console.log('in openDeleteConfirm');
        this.deleteCommentConfirmvisible = true;
        this.delete_comment_id = data.id
    },
    handleDeleteComment () {
      console.log('in handleDeleteComment')
      console.log('this.delete_comment_id: ', this.delete_comment_id)
      this.deleteCommentConfirmvisible = false
      const params = {
        comment_id: this.delete_comment_id
      }
      deleteCaseExecuteComment(params).then(res => {
        console.log('params in deleteCaseExecuteComment: ', params)
        this.getCaseExecuteComments()
      }).catch(err => {
          this.$message.info(err.message)
        })
    },
    commentEditorChange (val) {
      console.log('val in commentEditorChange: ', val)
      this.commentEditorContent = val
      console.log('this.commentEditorContent:', this.commentEditorContent)
    },
    changeCommentEditorVisible () {
      console.log('in changeCommentEditorVisible')
       this.commentEditorVisible = false
       this.commentHeight = '84%'
    },
    handleOpenCommentEditor () {
      console.log('in handleOpenCommentEditor')
      this.commentEditorContent = ''
      this.commentEditorVisible = true
      console.log('this.commentEditorVisible: ', this.commentEditorVisible)
      this.commentHeight = '70%'
    },
    addCaseExecuteComment () {
      console.log('in addCaseExecuteComment')
      console.log('this.commentEditorContent in addCaseExecuteComment: ', this.commentEditorContent)
      this.commentEditorVisible = false
      this.commentHeight = '84%'
      const params = {
        plan_associated_case_id: this.plan_associated_case_id,
        comment_content: this.commentEditorContent
      }
      addCaseExecuteComment(params).then(res => {
        console.log('params in addCaseExecuteComment: ', params)
        this.getCaseExecuteComments()
      }).catch(err => {
          this.$message.error(err.message)
        })
    },
    init (planCaseInfo, iterationId, projectName, planStatus) {
      this.current_case = planCaseInfo
      console.log('in init function of PlanCaseDetail.vue ')
      console.log('planCaseInfo in init of PlanCaseDetail.vue：', planCaseInfo)
      console.log('iterationId in init of PlanCaseDetail.vue：', iterationId)
      console.log('planStatus in init of PlanCaseDetail.vue：', planStatus)
      console.log('case_id:', planCaseInfo.case_id)
      this.plan_associated_case_id = planCaseInfo.id
      this.iteration_id = iterationId
      this.stepInfo = []
      this.case_execute_result = ''
      this.plan_id = planCaseInfo.plan_id
      this.plan_status = planStatus
      this.case_id = planCaseInfo.case_id || 0
      this.case_name = planCaseInfo.case_name
      this.project_name = projectName
      this.project_id = planCaseInfo.project_id
      this.module_id = planCaseInfo.module_id
      this.case_priority = planCaseInfo.priority
      this.case_type = planCaseInfo.case_type
      this.case_level = planCaseInfo.case_level
      this.if_need_automated = planCaseInfo.if_need_automated
      this.if_smoke_test = planCaseInfo.if_smoke_test
      this.maintainer = planCaseInfo.maintainer
      this.remark = planCaseInfo.remark
      this.created_time = planCaseInfo.case_created_time
      this.modified_time = planCaseInfo.case_modified_time
      this.pre_condition = planCaseInfo.pre_condition
      this.commentEditorVisible = false
      this.commentHeight = '84%'
      this.comment_data = []
      this.case_execute_operation_record_data = []
      if (planCaseInfo) {
        this.loading = true
        const params = {
          plan_associated_case_id: planCaseInfo.id,
          plan_id: planCaseInfo.plan_id,
          iteration_id: iterationId,
          plan_case_id: planCaseInfo.case_id

        }
        console.log('params to getPlanCaseDetail in init of PlanCaseDetail: ', params)
        getPlanCaseDetail(params).then(res => {
          this.test_case = res.data
          console.log('res.data in init: ', res.data)
          if (res.data) {
            this.execute_person = res.data.execute_person
            this.case_execute_result = res.data.execute_result
            this.module_name = res.data.module_name
            this.stepInfo = res.data.step_info
            this.case_execute_time = res.data.case_execute_time
            // 重新渲染富文本组件
            this.remarkShowEditor = false
            this.preConditionShowEditor = false
            this.$nextTick(() => {
              this.remarkShowEditor = true
              this.preConditionShowEditor = true
            })
            console.log('this.project_id in init:', this.project_id)
            console.log('this.module_id in init:', this.module_id)
            // 根据查询用例信息，赋值this.project_id, this.module_id
            console.log('this.stepInfo in init: ', this.stepInfo)
            console.log('this.case_type in init: ', this.case_type)
            console.log('this.remarkEditorContent in init: ', this.remarkEditorContent)
            console.log('this.preConditionEditorContent in init:', this.preConditionEditorContent)
          }
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
        this.getCaseExecuteComments()
        this.getCaseExecuteOperationRecords()
      }
    },
    getCaseExecuteComments () {
      const params = {
          plan_associated_case_id: this.plan_associated_case_id
        }
      getCaseExecuteComments(params).then(res => {
        if (res.data) {
          this.comment_data = res.data
        }
        console.log('in getCaseExecuteComments')
      }).catch(err => {
          this.$message.error(err.message)
        })
    },
    getCaseExecuteOperationRecords () {
      console.log('in getCaseExecuteOperationRecords')
      const params = {
          plan_associated_case_id: this.plan_associated_case_id
        }
      getCaseExecuteOperationRecords(params).then(res => {
        console.log('res.data in getCaseExecuteOperationRecords: ', res.data)
        if (res.data) {
          this.case_execute_operation_record_data = res.data
        }
      }).catch(err => {
          this.$message.info(err.message)
        })
    },
    handleOk () {
      this.$emit('changeCaseDetailVisible')
      this.$emit('queryData')
    },
    handleExecuteResult () {
      console.log('this.stepInfo: ', this.stepInfo)
      // this.$emit('changeCaseDetailVisible')
      const params = {
        plan_associated_case_id: this.plan_associated_case_id,
        plan_id: this.plan_id,
        case_id: this.case_id,
        case_execute_result: this.case_execute_result,
        step_result_info: this.stepInfo,
        case_execute_time: this.case_execute_time
      }
      console.log('params in handle ok:')
      console.log(params)
      planCaseDetailSetExecuteResult(params).then(res => {
        this.$message.success('操作成功')
        // 切换页面数据为下一条数据
        if (this.executeNext) {
          if (this.testCaseList.indexOf(this.current_case) + 1 < this.testCaseList.length) {
            console.log('执行下一条')
            console.log('this.testCaseList in goToNextCase: ', this.testCaseList)
            const currentCaseIndexInCaseList = this.testCaseList.indexOf(this.current_case)
            console.log('currentCaseIndexInCaseList in goToNextCase: ', currentCaseIndexInCaseList)
            var nextCase = this.testCaseList[currentCaseIndexInCaseList + 1]
            console.log('nextCase in goToNextCase: ', nextCase)
            this.init(nextCase, this.iteration_id, this.project_name, this.plan_status) // planCaseInfo, iterationId, projectName, planStatus
          } else {
            this.handleOk()
          }
        }
      }).catch(err => {
        this.$message.info(err.message)
      })
    },
    handleCancel () {
      this.$emit('changeCaseDetailVisible')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../caseList.less';

.class_tag {
  font-weight: bold;
  color: white;
  font-size: 5px;
}
.execute_title {
  color: grey;
  cursor: pointer;
}
.execute_title:hover {
  color: #14C393;
}

.executeResultOption{
  width: 160px;
  height: 30px;
  cursor: pointer;
  margin-bottom: 10px;
}
.executeResultOption:hover{
  background-color: #D3EEF9;
}

.empty-info {
  padding-bottom: 40px;
  padding-top: 40px;
  // border:1px solid #e8e8e8;
}

.title_tag {
  font-weight: bold;
  color: white;
  font-size: 5px;
}

.scirpt-tip {
  margin-left: 20px;
  font-size: 12px;
}

.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.dynamic-wrap {
  padding-top: 10px;
  background-color: white;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
}
.minusRowBtn {
  color: #f5222d;
  background: #fff1f0;
  border-color: #ffa39e;
  padding-right: 7px;
  padding-left: 7px;
  height: 29px;
  margin-left: 10px;
}
.addRowBtn {
  width: 70%;
  color: #1890ff;
  border-color: #91d5ff;
  margin: 0px 0px 20px 70px;
}
</style>
