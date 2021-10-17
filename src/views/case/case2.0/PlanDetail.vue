<template>
  <div>
    <div class="handle-case_list_menu">
      <a-row :gutter="12" style="margin-left: 10px;">
        <a-col :md="8" :lg="4">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>首页</span>
            </template>
            <a-tag @click="gotoHomePage" color="#14C393" style="margin-top: 15px;">
              <span>T</span>
            </a-tag>
          </a-tooltip>
          <a-icon type="right" style="margin-left: 5px;"/>
        </a-col>
        <a-col :md="20" :lg="10" style="margin-top: 10px; margin-left: -15px;">
          <a-popover v-model="projectListWindowVisible" placement="bottomLeft" trigger="click" :bodyStyle="{padding: 0}">
            <ProjectListWindow
              slot="content"
              ref="projectListWindowRef"
              :projectName="this.initialProjectName"
              :projectId="this.project_id"
              :projectList="this.projectList"
              @handleChangeProject="handleChangeProject"
              @projectListWindowInited="projectListWindowInitedFun"
            />
            <div class="select_option" @click="openPlanListWindow">
              <span style="font-size: 20px;">{{ this.initialProjectName }}</span>
              <a-icon type="down" style="margin-left: 12px; position: absolute; top: 10px;"/>
            </div>
          </a-popover>
        </a-col>
      </a-row>
    </div>
    <!-- <div class="handle-case_list_menu_tab">
      <a-row :gutter="12" style="margin-left: 10px;">
        <a-col :md="20" :lg="10" style="margin-top: 12px;">
          <div style="height: 35px; width: 96px; border-bottom: 2px solid #14C393;">
            <span style="cursor:pointer; margin-left: 20%; color: #14C393;" @click="gotoTestPlan">测试计划</span>
          </div>
        </a-col>
      </a-row>
    </div> -->
    <div class="plan_list_title_div">
      <a-row :gutter="24">
        <a-col :md="30" :lg="15" style="margin-top: 14px;">
          <a-icon type="arrow-left" style="margin-left: 15px; font-size: 20px;" @click="gotoTestPlan"/>
          <a-divider type="vertical" style="margin-left: 15px; font-size: 20px;"/>
          <span style="margin-left: 10px; font-size: 17px;">{{ this.test_version_name }}</span>
          <a-divider type="vertical" style="margin-left: 15px; font-size: 20px;"/>
          <a-popover v-model="planListWindowVisible" placement="bottomLeft" trigger="click" :bodyStyle="{padding: 0}">
            <PlanListWindow
              slot="content"
              ref="planListWindowRef"
              :planName="this.plan_name"
              :planList="this.planList"
              @handleChangePlan="handleChangePlan"
              @planListWindowInited="planListWindowInitedFun"
              @queryData="queryPlanCaseData"
            />
            <span class="select_option" @click="openPlanListWindow">
              <span style="margin-left: 10px; ">{{ this.plan_name }}</span>
              <a-icon type="down" style="margin-left: 10px; font-size: 14px;" />
            </span>
          </a-popover>
          <a-divider type="vertical" style="margin-left: 15px; font-size: 20px;"/>
          <span style="margin-left: 15px;">
            <span
              v-for="(item, index) in iteration_data_list"
              :key="index"
              :style="index === iteration_data_list.length - 1 ? `margin-right: 15px; cursor: pointer; color: ${!plan_code_repository_window_visible && !smoke_case_window_visible ? '#14C393' : '#5D7092'};` : 'margin-right: 15px; cursor: pointer; color: rgba(0, 0, 0, 0.25);'"
            >
              <span v-if="!item.type" @click="handleChangeIteration(item.iteration_id)">
                <span v-if="index === iteration_data_list.length - 1">
                  <a-popover trigger="hover" placement="bottom" :auto-adjust-overflow="true">
                    <template slot="content">
                      <div class="changeNameOption" @click="renameIteration(item)">
                        <span style="margin-left:5px;">重命名</span>
                      </div>
                    </template>
                    <span>
                      {{ item.iteration_name }}
                    </span>
                  </a-popover>
                </span>
                <span v-else>
                  {{ item.iteration_name }}
                </span>
              </span>
              <span v-show="item.type === 'new'">
                <div style="width: 220px; display: inline-block; background-color: rgba(0,0,0,0~1)">
                  <a-input
                    ref="create_iteration_input"
                    v-show="add_show"
                    allowClear
                    v-model="new_iteration_title"
                    @pressEnter="handleCreateIteration()"
                    :placeholder="item.iteration_name"
                    size="small"
                  />
                </div>
              </span>
              <span v-show="item.type === 'modify'">
                <div style="width: 220px; display: inline-block; background-color: rgba(0,0,0,0~1)">
                  <a-input
                    ref="rename_iteration_input"
                    v-show="modify_show"
                    allowClear
                    v-model="modify_iteration_name"
                    @pressEnter="handleRenameIteration(item)"
                    @blur="cancelRenameIteration(item)"
                    :placeholder="item.iteration_name"
                    size="small"
                  />
                </div>
              </span>
            </span>
          </span>
          <span class="create_iteration_button" v-show="!add_show && plan_status !== '2' && !smoke_case_window_visible && !plan_code_repository_window_visible" @click="confirmCreateIteration">+新建迭代</span>
        </a-col>
        <a-col :md="10" :lg="5" style="margin-top: 15px;">
          <span class="automatic_code_repository" @click="openPlanCodeRepository">自动化代码库</span>
          <span class="smoke_case_page_button" @click="openSmokeCase">冒烟用例</span>
        </a-col>
        <a-col :md="6" :lg="3" style="margin-top: 8px;">
          <a-button v-show="this.iteration_status === '0' && this.plan_status !== '2' && !smoke_case_window_visible && !plan_code_repository_window_visible" style="float: right; margin-right: 10px;" type="primary" @click="configPlanTestCase()">
            <a-icon style="margin-left: -2px;" type="file-add" />规划用例
          </a-button>
        </a-col>
        <a-col :md="2" :lg="1" style="margin-top: 8px; margin-left: -5px;">
          <a-popover v-model="planOperationPopoverVisible" trigger="click" placement="bottomLeft" :auto-adjust-overflow="true">
            <template slot="content">
              <div class="planOperationOption" @click="copyTestPlan()">
                <a-icon type="copy" style="margin: 8px 10px 0 0" />
                <span>复制story</span>
              </div>
              <div class="planOperationOption" @click="modifyTestPlan()">
                <a-icon type="edit" style="margin: 8px 10px 0 0" />
                <span>编辑story</span>
              </div>
              <div class="planOperationOption" @click="deleteTestPlan()">
                <a-icon type="delete" style="margin: 8px 10px 0 0" />
                <span>删除story</span>
              </div>
              <div class="planOperationOption" @click="importCase()">
                <a-icon type="export" style="margin: 8px 10px 0 0" />
                <span>导出执行结果</span>
              </div>
            </template>
            <a-tooltip placement="top" v-model="planOperationToolTipVisible">
              <template slot="title">
                <span>更多</span>
              </template>
              <a-icon
                a-icon
                type="menu"
                @click="changeExportToolTipVisible"
                style="fontSize: 30px; margin-top: 1px; color: #14C393;"
              />
            </a-tooltip>
          </a-popover>
        </a-col>
      </a-row>
    </div>
    <div v-show="plan_code_repository_window_visible">
      <div class="plan_list_detail_data">
        <a-row :gutter="24">
          <a-col :md="36" :lg="18" style="margin-top: 14px; margin-left: 20px;">
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">负责人</span>
              <span style="margin-left: 15px; display: inline">{{ this.owner }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">需实现自动化用例数</span>
              <span style="margin-left: 15px; display: inline">{{ this.need_auto_case_num }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">已实现自动化用例数</span>
              <span style="margin-left: 15px; display: inline">{{ this.already_automated_case_num }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">自动化覆盖率</span>
              <span style="margin-left: 15px; display: inline">{{ this.automated_cover_rate }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">执行成功用例数</span>
              <span style="margin-left: 15px; display: inline">{{ this.total_execute_over ? this.auto_case_pass_num : '' }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">自动化通过率</span>
              <span style="margin-left: 15px; display: inline">{{ this.total_execute_over ? this.auto_case_pass_rate : '' }}</span>
            </div>
          </a-col>
          <a-col :md="8" :lg="4" style="margin-top: 14px; margin-right: 10px; float: right">
            <div style="float: right;" @click="runAutoCase()">
              <a-icon :style="{ color: '#14C393', fontSize: '20px' }" type="play-circle"/>
              <!-- <a-icon v-if="this.plan_status === '1'" type="pause-circle" :style="{ color: '#14C393', fontSize: '20px' }"/> -->
              <a class="active" style="margin-left: 5px; margin-right: 5px;">执行自动化用例</a>
              <!-- <a v-if="this.plan_status === '1'" class="active" style="margin-left: 5px; margin-right: 5px;" @click="changeTestPlanStatus()">结束测试</a> -->
              <!-- <a-divider v-if="this.plan_status === '0' || this.plan_status === '1' " type="vertical" style="font-size: 20px;"/>
              <a-icon :style="{ color: '#14C393', fontSize: '20px', marginLeft: '5px' }" type="pie-chart" />
              <a class="active" style="margin-left: 5px; margin-right: 5px;" @click="openTestReportModal()">测试报告</a> -->
            </div>
          </a-col>
        </a-row>
      </div>
      <div style="margin-top: 10px;">
        <a-row :gutter="24">
          <a-col :md="48" :lg="24">
            <div class="case-section">
              <a-table
                bordered
                :columns="autoCodeRepositoryColumns"
                rowKey="index"
                :data-source="autoCodeRepositoryList"
                :loading="loading"
                class="select-table"
                :pagination="pagination"
              >
                <template slot="execute_status" slot-scope="text">
                  <a-tag v-if="text === '0'" color="red">{{ text | stateFilter }}</a-tag>
                  <a-tag v-if="text === '1'" color="orange" style="margin-left: 15px;">{{ text | stateFilter }}</a-tag>
                  <a-tag v-if="text === '2'" color="green" style="margin-left: 15px;">{{ text | stateFilter }}</a-tag>
                </template>
                <template slot="repository_log_address" slot-scope="text, record">
                  <a @click.stop="downloadRepositoryLog(text)" :disabled="record.execute_status !== '2'">下载日志</a>
                </template>
                <template slot="repository_report_address" slot-scope="text, record">
                  <a @click.stop="gotoRepositoryReport(text)" :disabled="record.execute_status !== '2'">查看</a>
                </template>
                <template slot="pass_case_num" slot-scope="text, record">
                  <span v-show="record.execute_status === '2'">{{ text }}</span>
                </template>
              </a-table>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div v-show="!plan_code_repository_window_visible && !smoke_case_window_visible">
      <div class="plan_list_detail_data">
        <a-row :gutter="24">
          <a-col :md="34" :lg="17" style="margin-top: 14px; margin-left: 20px;">
            <div style="float: left; ">
              <span style="margin-left: 0px; display: inline">迭代名称</span>
              <span style="margin-left: 15px;">
                <a-tag :color="iteration_status === '0' ? 'purple' : 'rgba(0, 0, 0, 0.25)'">
                  {{ this.iteration_name }}
                </a-tag>
              </span>
            </div>
            <div style="float: left">
              <span style="margin-left: 20px; display: inline">状态</span>
              <a-tag v-if="this.plan_status === '0'" color="red" style="margin-left: 15px;">{{ this.plan_status | stateFilter }}</a-tag>
              <a-tag v-if="this.plan_status === '1'" color="orange" style="margin-left: 15px;">{{ this.plan_status | stateFilter }}</a-tag>
              <a-tag v-if="this.plan_status === '2'" color="green" style="margin-left: 15px;">{{ this.plan_status | stateFilter }}</a-tag>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">负责人</span>
              <span style="margin-left: 15px; display: inline">{{ this.owner }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="margin-left: 10px; display: inline">通过率</span>
              <span style="margin-left: 15px; display: inline">{{ this.pass_rate }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">已测用例数</span>
              <span style="margin-left: 15px; display: inline">{{ this.already_executed_case_num }}</span>
              <span style="margin-left: 5px; display: inline">/</span>
              <span style="margin-left: 5px; display: inline">{{ this.totalPlanCases }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">自动化覆盖率</span>
              <span style="margin-left: 15px; display: inline">{{ this.automated_cover_rate }}</span>
            </div>
            <div style="float: left; margin-left: 20px;">
              <span style="display: inline">自动化通过率</span>
              <span style="margin-left: 15px; display: inline">{{ this.auto_case_pass_rate }}</span>
            </div>
          </a-col>
          <a-col :md="10" :lg="5" style="margin-top: 14px; margin-right: 10px; float: right">
            <div style="float: right;">
              <a-icon v-if="this.plan_status === '0'" :style="{ color: '#14C393', fontSize: '20px' }" type="play-circle"/>
              <a-icon v-if="this.plan_status === '1'" type="pause-circle" :style="{ color: '#14C393', fontSize: '20px' }"/>
              <a v-if="this.plan_status === '0'" class="active" style="margin-left: 5px; margin-right: 5px;" @click="changeTestPlanStatus()">开始测试</a>
              <a v-if="this.plan_status === '1'" class="active" style="margin-left: 5px; margin-right: 5px;" @click="changeTestPlanStatus()">结束测试</a>
              <a-divider v-if="this.plan_status === '0' || this.plan_status === '1' " type="vertical" style="font-size: 20px;"/>
              <a-icon :style="{ color: '#14C393', fontSize: '20px', marginLeft: '5px' }" type="pie-chart" />
              <a class="active" style="margin-left: 5px; margin-right: 5px;" @click="openTestReportModal()">story测试报告</a>
            </div>
            <ChangePlanStatusModal
              :changePlanStatusVisible="this.changePlanStatusVisible"
              ref="changePlanStatusModal"
              @setChangePlanStatusVisible="setChangePlanStatusVisible"
              @queryData="findPlanData"
              @queryPlanCaseData="queryPlanCaseData"
            />
          </a-col>
        </a-row>
      </div>
      <div style="margin-top: 10px;">
        <div class="plan_dedail_page">
          <a-row :gutter="24">
            <a-col :md="10" :lg="5">
              <div class="plan_detail_module-section">
                <a-card
                  :bordered="false"
                  type="inner"
                  title="模块"
                  :body-style="{padding: '0 10px 0 0'}">
                  <PlanModuleTree
                    v-if="updateTreeComp"
                    ref="ModuleTreeRef"
                    @getTestCase="queryPlanCaseData"
                    @changeHasSelected="changeHasSelected"
                    :projectId="this.project_id"
                    :planId="this.plan_id"
                    :iterationId="this.iteration_id"
                    style="margin-top: 15px;"
                  />
                </a-card>
              </div>
            </a-col>
            <a-col :md="38" :lg="19">
              <a-card :bordered="false">
                <div class="table-page-search-wrapper">
                  <a-form :form="form" layout="inline">
                    <a-row :gutter="12">
                      <a-col :md="10" :lg="5">
                        <a-form-item label="标题">
                          <a-input
                            allowClear
                            placeholder="请输入"
                            v-decorator="[
                              'case_title',
                              { rules: [{ required: false }] },
                            ]"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :md="10" :lg="5">
                        <a-form-item
                          label="优先级"
                        >
                          <a-select
                            allowClear
                            v-decorator="[
                              'case_priority',
                              { rules: [{ required: false, message: '请选择优先级' }] },
                            ]"
                            placeholder="请选择"
                          >
                            <a-select-option v-for="(val, key, index) in priorityMap" :key="index" :value="key">
                              <a-tag v-if="val === '高'" color="#E86452"><div class="class_tag">{{ val }}</div></a-tag>
                              <a-tag v-if="val === '中'" color="#F6BD16"><div class="class_tag">{{ val }}</div></a-tag>
                              <a-tag v-if="val === '低'" color="#5AD8A6"><div class="class_tag">{{ val }}</div></a-tag>
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :md="10" :lg="5">
                        <a-form-item
                          label="执行结果"
                        >
                          <a-select
                            allowClear
                            v-decorator="[
                              'execute_result',
                              { rules: [{ required: false, message: '请选择执行结果' }] },
                            ]"
                            placeholder="请选择"
                          >
                            <a-select-option v-for="(val, key, index) in executeResultMap" :key="index" :value="key">
                              <a-icon v-if="val === '通过'" type="check-circle" :style="{ fontSize: '16px', color: 'green' }"/>
                              <a-icon v-if="val === '阻塞'" type="minus-circle" :style="{ fontSize: '16px', color: 'orange' }"/>
                              <a-icon v-if="val === '失败'" type="close-circle" :style="{ fontSize: '16px', color: 'red' }"/>
                              <a-icon v-if="val === '未测'" type="question-circle" :style="{ fontSize: '16px', color: 'grey' }"/>
                              <a-icon v-if="val === '跳过'" type="right-circle" :style="{ fontSize: '16px', color: 'blue' }"/>
                              <span style="margin-left: 5px;">{{ val }}</span>
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :md="12" :lg="6">
                        <a-form-item
                          label="冒烟测试"
                        >
                          <a-select
                            allowClear
                            v-decorator="[
                              'smoke_test_status',
                              { rules: [{ required: false, message: '请选择' }] },
                            ]"
                            placeholder="请选择"
                          >
                            <a-select-option v-for="item in smoke_test_state_list" :key="item">
                              {{ item | smokeTestFilter }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :md="4" :lg="2">
                        <!-- <a-button style="float: right;" type="primary" html-type="submit" @click=handleSubmit>查询</a-button> -->
                        <a-button style="float: right;" type="primary" @click="queryPlanCases">查询</a-button>
                      </a-col>
                    </a-row>
                    <a-row :gutter="14" style="margin-top: 10px">
                      <a-col :md="10" :lg="5">
                        <a-form-item
                          label="用例等级"
                        >
                          <a-select
                            allowClear
                            v-decorator="[
                              'case_level',
                              { rules: [{ required: false, message: '请选择' }] },
                            ]"
                            placeholder="请选择"
                          >
                            <a-select-option v-for="case_level in case_level_list" :key="case_level">
                              <a-tag v-if="case_level === 'Level 1'" color="#E86452"><div class="title_tag">{{ case_level }}</div></a-tag>
                              <a-tag v-if="case_level === 'Level 2'" color="#FF9845"><div class="title_tag">{{ case_level }}</div></a-tag>
                              <a-tag v-if="case_level === 'Level 3'" color="#F6BD16"><div class="title_tag">{{ case_level }}</div></a-tag>
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :md="10" :lg="5">
                        <a-form-item
                          label="用例类型"
                        >
                          <a-select
                            allowClear
                            v-decorator="[
                              'case_type',
                              { rules: [{ required: false, message: '请选择' }] },
                            ]"
                            placeholder="请选择"
                          >
                            <a-select-option v-for="item in case_type_list" :key="item">
                              {{ item }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :md="10" :lg="5">
                        <a-form-item
                          label="执行人"
                        >
                          <a-select
                            allowClear
                            v-decorator="[
                              'execute_person',
                              { rules: [{ required: false, message: '请选择' }] },
                            ]"
                            placeholder="请选择"
                          >
                            <a-select-option v-for="item in memberList" :key="item">
                              {{ item }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :md="12" :lg="6">
                        <a-form-item
                          label="关联自动化"
                        >
                          <a-select
                            allowClear
                            v-decorator="[
                              'automatic_status',
                              { rules: [{ required: false, message: '请选择' }] },
                            ]"
                            placeholder="请选择"
                          >
                            <a-select-option v-for="item in automatic_state_list" :key="item">
                              {{ item | automaticStateFilter }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
                </div>
              </a-card>
              <div class="case-section">
                <div v-show="hasSelected" class="handle-select">
                  <span style="margin-left: 4px">
                    <template v-if="hasSelected">
                      {{ `已选中 ${selectedRowKeys.length} 项` }}
                    </template>
                  </span>
                  <a-popover v-model="setExecuteResultPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                    <template slot="content">
                      <div class="executeResultOption" @click="()=> setMultiplePlanCaseExecuteResult('0')">
                        <a-icon type="check-circle" :style="{ fontSize: '16px', color: 'green', marginTop: '7px' }"/>
                        <span style="margin-left:5px;">通过</span>
                      </div>
                      <div class="executeResultOption" @click="()=> setMultiplePlanCaseExecuteResult('1')">
                        <a-icon type="minus-circle" :style="{ fontSize: '16px', color: 'orange', marginTop: '7px' }"/>
                        <span style="margin-left:5px;">阻塞</span>
                      </div>
                      <div class="executeResultOption" @click="()=> setMultiplePlanCaseExecuteResult('2')">
                        <a-icon type="close-circle" :style="{ fontSize: '16px', color: 'red', marginTop: '7px' }"/>
                        <span style="margin-left:5px;">失败</span>
                      </div>
                      <div class="executeResultOption" @click="()=> setMultiplePlanCaseExecuteResult('4')">
                        <a-icon type="right-circle" :style="{ fontSize: '16px', color: 'blue', marginTop: '7px' }"/>
                        <span style="margin-left:5px;">跳过</span>
                      </div>
                    </template>
                    <a-button type="link" :loading="loading" @click="openMultiplePlanCaseExecuteResultPopOver(selectedRowKeys)">
                      设置执行结果
                    </a-button>
                  </a-popover>
                  <a-button type="link" :loading="loading" @click="changeExecutePerson(selectedRowKeys)">
                    设置执行人
                  </a-button>
                  <a-popover v-model="setExecutePriorityPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                    <template slot="content">
                      <div class="executePriorityOption" @click="setMultiplePlanCaseExecutePriority('0')">
                        <a-tag color="#E86452" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">高</div></a-tag>
                      </div>
                      <div class="executePriorityOption" @click="setMultiplePlanCaseExecutePriority('1')">
                        <a-tag color="#F6BD16" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">中</div></a-tag>
                      </div>
                      <div class="executePriorityOption" @click="setMultiplePlanCaseExecutePriority('2')">
                        <a-tag color="#5AD8A6" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">低</div></a-tag>
                      </div>
                    </template>
                    <a-button type="link" :loading="loading" @click="openMultiplePlanCaseExecutePriorityPopOver(selectedRowKeys)">
                      设置优先级
                    </a-button>
                  </a-popover>
                  <a-button type="link" :loading="loading" @click="setMultiplePlanCaseSmokeTest(selectedRowKeys)">
                    设为冒烟测试
                  </a-button>
                  <a-button type="link" :loading="loading" @click="cancelMultiplePlanCaseSmokeTest(selectedRowKeys)">
                    取消冒烟测试
                  </a-button>
                  <a-button type="link" :loading="loading" @click.stop="removeMultiplePlanCase(selectedRowKeys)">
                    移除
                  </a-button>
                  <a-button type="link" :loading="loading" @click="cancelSelectKeys()">
                    取消选择
                  </a-button>
                </div>
                <a-table
                  bordered
                  :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: this.iteration_status === '0' && this.plan_status !== '2' ? onSelectChange : '' }"
                  :columns="columns"
                  :customRow="rowclick"
                  rowKey="id"
                  :data-source="testCaseList"
                  :loading="loading"
                  class="select-table"
                  :pagination="pagination"
                >
                  <template slot="operation" slot-scope="text, record">
                    <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="removePlanCase([record.id])">
                      <template slot="title">
                        <p>确认移除该用例么？</p>
                      </template>
                      <a :disabled="iteration_status !== '0' || plan_status === '2' " @click.stop>移除</a>
                    </a-popconfirm>
                  </template>
                  <template slot="case_name" slot-scope="text, record">
                    <a-row :gutter="1">
                      <!-- <a-col :span="2">
                        <a-tag style="padding-left: 2px; padding-right: 2px;" v-if="record.automated" color="#14C393"><span class="class_tag">auto</span></a-tag>
                      </a-col> -->
                      <a-col :span="22">
                        <div style="margin-left: 5px">
                          <span style="cursor: pointer;">{{ text }}</span>
                          <a-tag style="margin-left: 2px; margin-right: 2px; padding-left: 1px; padding-right: 1px;" v-if="record.automated" color="#14C393"><span class="class_tag">auto</span></a-tag>
                          <a-tag style="margin-left: 2px; padding-left: 1px; padding-right: 1px;" v-if="record.if_smoke_test === 'Y'" color="#FAAD14"><span class="title_tag">smoke</span></a-tag>
                        </div>
                      </a-col>
                    </a-row>
                  </template>
                  <template slot="execute_result" slot-scope="text, record">
                    <a-popover v-model="record.setExecuteResultPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                      <template slot="content">
                        <div class="executeResultOption" @click="()=> setPlanCaseExecuteResult(record, '0')">
                          <a-icon type="check-circle" :style="{ fontSize: '16px', color: 'green', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">通过</span>
                          <a-icon v-if="record.execute_result === '0'" type="check" :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setPlanCaseExecuteResult(record, '1')">
                          <a-icon type="minus-circle" :style="{ fontSize: '16px', color: 'orange', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">阻塞</span>
                          <a-icon v-if="record.execute_result === '1'" type="check" :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setPlanCaseExecuteResult(record, '2')">
                          <a-icon type="close-circle" :style="{ fontSize: '16px', color: 'red', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">失败</span>
                          <a-icon v-if="record.execute_result === '2'" type="check" :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                        <div class="executeResultOption" @click="()=> setPlanCaseExecuteResult(record, '3')">
                          <a-icon type="right-circle" :style="{ fontSize: '16px', color: 'blue', marginTop: '7px' }"/>
                          <span style="margin-left:5px;">跳过</span>
                          <a-icon v-if="record.execute_result === '3'" type="check" :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                        </div>
                      </template>
                      <div v-if="iteration_status === '0'">
                        <a-icon v-if="record.execute_result === '0'" type="check-circle" :style="{ fontSize: '16px', color: 'green' }"/>
                        <a-icon v-if="record.execute_result === '1'" type="minus-circle" :style="{ fontSize: '16px', color: 'orange' }"/>
                        <a-icon v-if="record.execute_result === '2'" type="close-circle" :style="{ fontSize: '16px', color: 'red' }"/>
                        <a-icon v-if="record.execute_result === '3'" type="right-circle" :style="{ fontSize: '16px', color: 'blue' }"/>
                        <span style="margin-left: 5px; cursor: default">{{ record.execute_result | executeResultFilter }}</span>
                        <a-icon v-if="record.setExecuteResultVisible" type="down" style="float: right; margin-top: 5px;" />
                      </div>
                    </a-popover>
                    <div v-if="iteration_status !== '0'">
                      <a-icon v-if="record.execute_result === '0'" type="check-circle" :style="{ fontSize: '16px', color: 'green' }"/>
                      <a-icon v-if="record.execute_result === '1'" type="minus-circle" :style="{ fontSize: '16px', color: 'orange' }"/>
                      <a-icon v-if="record.execute_result === '2'" type="close-circle" :style="{ fontSize: '16px', color: 'red' }"/>
                      <a-icon v-if="record.execute_result === '3'" type="right-circle" :style="{ fontSize: '16px', color: 'blue' }"/>
                      <span style="margin-left: 5px; cursor: default">{{ record.execute_result | executeResultFilter }}</span>
                      <a-icon v-if="record.setExecuteResultVisible" type="down" style="float: right; margin-top: 5px;" />
                    </div>
                  </template>
                  <template slot="priority" slot-scope="text, record">
                    <a-popover v-model="record.setExecutePriorityPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                      <template slot="content">
                        <div class="executePriorityOption" @click="setPlanCaseExecutePriority(record, '0')">
                          <a-tag color="#E86452" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">高</div></a-tag>
                        </div>
                        <div class="executePriorityOption" @click="setPlanCaseExecutePriority(record, '1')">
                          <a-tag color="#F6BD16" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">中</div></a-tag>
                        </div>
                        <div class="executePriorityOption" @click="setPlanCaseExecutePriority(record, '2')">
                          <a-tag color="#5AD8A6" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">低</div></a-tag>
                        </div>
                      </template>
                      <div v-if="iteration_status === '0' && plan_status !== '2'">
                        <a-tag v-if="text === '0'" color="#E86452"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                        <a-tag v-if="text === '1'" color="#F6BD16"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                        <a-tag v-if="text === '2'" color="#5AD8A6"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                        <span style="margin-left: 5px; cursor: default"></span>
                        <a-icon v-if="record.setExecutePriorityVisible" type="down" style="float: right; margin-top: 5px;" />
                      </div>
                    </a-popover>
                    <div v-if="iteration_status !== '0'">
                      <a-tag v-if="text === '0'" color="#E86452"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                      <a-tag v-if="text === '1'" color="#F6BD16"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                      <a-tag v-if="text === '2'" color="#5AD8A6"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                      <span style="margin-left: 5px; cursor: default"></span>
                      <a-icon v-if="record.setExecutePriorityVisible" type="down" style="float: right; margin-top: 5px;" />
                    </div>
                  </template>
                  <!-- <div slot="execute_person" slot-scope="text, record" @mouseover="mouseOver(record)" @mouseleave="mouseLeave(record)"> -->
                  <div slot="execute_person" slot-scope="text, record">
                    <div>
                      <a-icon v-if="record.setExecutorVisible" type="user-add" style="float: right;" />
                      <span style="cursor: default;">{{ text }}</span>
                    </div>
                  </div>
                </a-table>
              </div>
            </a-col>
          </a-row>
        </div>
        <SetExecutor
          :setExecutorVisible="this.setExecutorVisible"
          :memberList="memberList"
          ref="setExecutor"
          @setExecutor="setExecutor"
          @queryData="queryPlanCaseData"
          @changeSetExetorVisible="changeSetExetorVisible"
          @changeHasSelected="changeHasSelected"
        />
        <DeleteMultiplePlanCase
          :deleteMultipleCaseVisible="this.deleteMultipleCaseVisible"
          ref="deleteMultipleCase"
          @changeDeleteMultileCaseVisible="changeDeleteMultileCaseVisible"
          @queryData="queryPlanCaseData"
          @changeHasSelected="changeHasSelected"
        />
        <ConfirmCreatePlanIteration
          :confirmCreatePlanIterationVisible="this.confirmCreatePlanIterationVisible"
          ref="confirmCreatePlanIteration"
          @changeConfirmCreatePlanIterationVisible="changeConfirmCreatePlanIterationVisible"
          @addIterationTab="addIterationTab"
        />
        <CopyPlanForm
          :copyFormVisible="this.copyFormVisible"
          ref="copyPlan"
          :projectList="projectList"
          :memberList="memberList"
          @changeCopyVisible="changeCopyVisible"
          @queryData="queryDataAfterCopy"
        />
        <DeletePlan
          :deletePlanVisible="this.deletePlanVisible"
          ref="deletePlan"
          @changeDeletePlanVisible="changeDeletePlanVisible"
          @queryData="gotoTestPlan"
        />
        <ConfigPlanCase
          :configPlanCaseVisible="this.configPlanCaseVisible"
          ref="configPlanCase"
          :projectId="this.project_id"
          @changeConfigPlanCaseVisible="changeConfigPlanCaseVisible"
          @queryData="queryDataAfterConfigPlanCase"
        />
        <PlanCaseDetail
          :caseDetailVisible="this.caseDetailVisible"
          :projectName="this.initialProjectName"
          :projectId="this.project_id"
          :testCaseList="this.testCaseList"
          ref="planCaseDetail"
          @changeCaseDetailVisible="changeCaseDetailVisible"
          @queryData="queryPlanCaseData"
        />
        <TestReportModal
          :testReportModalVisible="this.testReportModalVisible"
          ref="testReportModal"
          @changeTestReportModalVisible="changeTestReportModalVisible"
        />
        <CreatePlanForm
          :createFormVisible="this.createFormVisible"
          :memberList="this.memberList"
          ref="createOrModify"
          :projectList="projectList"
          :testVersionList="testVersionList"
          @changeCreateVisible="changeCreateVisible"
          @queryData="findPlanData"
        />
      </div>
    </div>
    <div v-show="smoke_case_window_visible">
      <SmokeCaseList
        :planId="plan_id"
        ref="smokeCaseWindow"
      />
    </div>
  </div>
</template>

<script>

  import CreateCaseForm from './CreateCaseForm'
  import { getProjectList, deleteProject, getMembers } from '@/api/case/project_two'
  import { getPlanCaseData, exportTestCase, removePlanCase, setPlanCaseExecuteResult, setPlanCaseExecutePriority, setPlanCaseSmokeTest, cancelPlanCaseSmokeTest } from '@/api/case/case_two'
  import { findPlanData, getTestPlanList, createIterationData, modifyIterationName, getPlanCodeRepository, runAutoCase, getPlanRepositoryStatus } from '@/api/case/plan_two'
  import PlanModuleTree from './component/PlanModuleTree'
  import CopyMoveCase from './component/CopyMoveCase'
  import DeleteCase from './component/DeleteCase'
  import ImportCase from './component/ImportCase'
  import PlanCaseDetail from './component/PlanCaseDetail'
  import SetExecutor from './component/SetExecutor'
  import DeleteMultiplePlanCase from './component/DeleteMultiplePlanCase'
  import CopyPlanForm from './component/CopyPlanForm'
  import DeletePlan from './component/DeletePlan'
  import ConfigPlanCase from './component/ConfigPlanCase'
  import TestReportModal from './TestReportModal'
  import ProjectListWindow from './component/ProjectListWindow.vue'
  import PlanListWindow from './component/PlanListWindow.vue'
  import ChangePlanStatusModal from './component/ChangePlanStatusModal.vue'
  import CreatePlanForm from './CreatePlanForm'
  import ConfirmCreatePlanIteration from './component/ConfirmCreatePlanIteration.vue'
  import { findTestVersionById, getTestVersionList } from '@/api/case/test_version'
  import TestVersionListWindow from './component/TestVersionListWindow.vue'
  import SmokeCaseList from './component/SmokeCaseList.vue'
  const stateMap = {
    '0': '未开始',
    '1': '运行中',
    '2': '已完成'
  }
  const automaticStateMap = {
  'need_auto': '需关联自动化',
  'automated': '已关联自动化'
  }
  // case_priority: ['高', '中', '低'],
  //  execute_result: ['通过', '阻塞', '失败', '跳过', '未测'],
  const priorityMap = {
    '0': '高',
    '1': '中',
    '2': '低'
  }
  const executeResultMap = {
    '0': '通过',
    '1': '阻塞',
    '2': '失败',
    '3': '跳过',
    '4': '未测'
  }
  const smokeTestStateMap = {
    'Y': '是',
    'N': '否'
  }
  export default {
    name: 'Index',
    components: {
      CreateCaseForm,
      PlanModuleTree,
      CopyMoveCase,
      DeleteCase,
      ImportCase,
      PlanCaseDetail,
      SetExecutor,
      DeleteMultiplePlanCase,
      CopyPlanForm,
      DeletePlan,
      ConfigPlanCase,
      TestReportModal,
      ProjectListWindow,
      PlanListWindow,
      ChangePlanStatusModal,
      CreatePlanForm,
      ConfirmCreatePlanIteration,
      TestVersionListWindow,
      SmokeCaseList
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        // columns定义到export里，便于访问this
        autoCodeRepositoryColumns: [
          {
            title: '代码库',
            dataIndex: 'code_repository_title',
            key: 'code_repository_title',
            scopedSlots: { customRender: 'code_repository_title' },
            width: 250,
            align: 'center'
          },
          {
            title: '代码库地址',
            dataIndex: 'repository_address',
            key: 'repository_address',
            scopedSlots: { customRender: 'code_repository_address' }
          },
          {
            title: '分支',
            dataIndex: 'branch',
            key: 'branch',
            scopedSlots: { customRender: 'branch' }
          },
          {
            title: '覆盖当前用例数',
            dataIndex: 'cover_manual_case_num',
            key: 'cover_manual_case_num',
            scopedSlots: { customRender: 'cover_manual_case_num' },
            width: 140
          },
          {
            title: '成功用例数',
            dataIndex: 'pass_case_num',
            key: 'pass_case_num',
            scopedSlots: { customRender: 'pass_case_num' },
            width: 120
          },
          {
            title: '测试框架',
            dataIndex: 'framework_type',
            key: 'framework_type',
            scopedSlots: { customRender: 'framework_type' }
          },
          {
            title: '执行状态',
            dataIndex: 'execute_status',
            key: 'execute_status ',
            scopedSlots: { customRender: 'execute_status' },
            align: 'center'
          },
          {
            title: '日志',
            dataIndex: 'repository_log_address',
            key: 'repository_log_address ',
            scopedSlots: { customRender: 'repository_log_address' },
            align: 'center'
          },
          {
            title: '报告',
            dataIndex: 'repository_report_address',
            key: 'repository_report_address ',
            scopedSlots: { customRender: 'repository_report_address' },
            align: 'center'
          }
        ],
        columns: [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            scopedSlots: { customRender: 'id' },
            width: 70,
            align: 'center'
          },
          {
            title: '执行结果',
            dataIndex: 'execute_result',
            key: 'execute_result',
            scopedSlots: { customRender: 'execute_result' },
            width: 140,
            customCell: this.executeResultCustomCell
          },
          {
            title: '标题',
            dataIndex: 'case_name',
            key: 'case_name',
            scopedSlots: { customRender: 'case_name' }
          },
          {
            title: '执行人',
            dataIndex: 'execute_person',
            key: 'execute_person',
            scopedSlots: { customRender: 'execute_person' },
            width: 140,
            customCell: this.executePersonCustomCell
          },
          {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            scopedSlots: { customRender: 'priority' },
            width: 140,
            customCell: this.executePriorityCustomCell
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation ',
            scopedSlots: { customRender: 'operation' },
            align: 'center',
            width: 140
          }
        ],
        smokeColumns: [
          {
            title: '编号',
            dataIndex: 'smoke_id',
            key: 'smoke_id',
            scopedSlots: { customRender: 'smoke_id' },
            width: 70,
            align: 'center'
          },
          {
            title: '执行结果',
            dataIndex: 'smoke_execute_result',
            key: 'smoke_execute_result',
            scopedSlots: { customRender: 'smoke_execute_result' },
            width: 140,
            customCell: this.executeResultCustomCell
          },
          {
            title: '标题',
            dataIndex: 'smoke_case_name',
            key: 'smoke_case_name',
            scopedSlots: { customRender: 'smoke_case_name' }
          },
          {
            title: '执行人',
            dataIndex: 'smoke_execute_person',
            key: 'smoke_execute_person',
            scopedSlots: { customRender: 'smoke_execute_person' },
            width: 140,
            customCell: this.executePersonCustomCell
          },
          {
            title: '优先级',
            dataIndex: 'smoke_priority',
            key: 'smoke_priority',
            scopedSlots: { customRender: 'smoke_priority' },
            width: 140,
            customCell: this.executePriorityCustomCell
          }
        ],
        autoCodeRepositoryList: [],
        total_execute_over: true,
        repository_report_id_list: [],
        selectedRowKeys: [], // Check here to configure the default column
        data: [],
        dateValue: [],
        rangeValues: {},
        categoryList: [],
        project_name: '',
        tree_node_children: [],
        changePlanStatusVisible: false,
        planListWindowVisible: false,
        planListWindowInited: false,
        projectListWindowVisible: false,
        projectListWindowInited: false,
        testReportModalVisible: false,
        recycleBinVisible: false,
        createFormVisible: false,
        copyFormVisible: false,
        copyMoveVisible: false,
        editCaseVisible: false,
        caseDetailVisible: false,
        confirmLoading: false,
        loading: true,
        updateTreeComp: true,
        deleteVisible: true,
        setExecutorVisible: false,
        setExecuteResultPopOverVisible: false,
        setExecutePriorityPopOverVisible: false,
        deleteMultipleCaseVisible: false,
        confirmCreatePlanIterationVisible: false,
        deletePlanVisible: false,
        configPlanCaseVisible: false,
        execute_result_plan_case_id_list: [],
        execute_priority_plan_case_id_list: [],
        icon_visible: false,
        expandedKeys: [],
        checkedKeys: [],
        autoExpandParent: false,
        form: this.$form.createForm(this, { name: 'createCaseForm' }),
        projectForm: this.$form.createForm(this, { name: 'projectForm' }),
        add_title: '',
        span_title: 'hello',
        add_show: false,
        plan_code_repository_window_visible: false,
        smoke_case_window_visible: false,
        createIterationNum: 0,
        modify_show: false,
        modify_iteration_name: '',
        span_show: false,
        defaultExpandedKeys: [],
        case_title: '',
        case_level_list: ['Level 1', 'Level 2', 'Level 3'],
        automatic_state_list: ['need_auto', 'automated'],
        smoke_test_state_list: ['Y', 'N'],
        priorityMap,
        executeResultMap,
        search_case_level: '',
        if_need_automated: '',
        maintainer: '',
        initialProjectName: '',
        selectedKeys: [],
        deleteCaseVisible: false,
        hasSelected: false,
        testCaseList: [],
        iteration_id: 0,
        iteration_data_list: [],
        planOperationToolTipVisible: false,
        planOperationPopoverVisible: false,
        visible: false,
        importCaseVisible: false,
        module_loading: false,
        projectNameList: [],
        caseList: [],
        project_id: 0,
        plan_id: 0,
        test_version_id: 0,
        need_auto_case_num: 0,
        auto_case_pass_num: 0,
        already_automated_case_num: 0,
        plan_name: '',
        test_version_name: '',
        owner: '',
        pass_rate: '',
        automated_cover_rate: '',
        auto_case_pass_rate: '',
        plan_status: '',
        iteration_status: '',
        iteration_name: '',
        new_iteration_title: '',
        already_executed_case_num: '',
        stateMap,
        module_id: 0,
        projectList: [],
        planList: [],
        testVersionList: [],
        treeDataList: [],
        totalPlanCases: 0,
        memberList: [],
        case_type_list: ['功能测试', '性能测试', '配置相关', '安装部署', '接口测试', '安全相关', '兼容性测试', 'UI测试', '其他'],
        pagination: {
          defaultCurrent: 1, // 默认当前页数
          defaultPageSize: 20, // 默认当前页显示数据的大小
          total: 0, // 总数，必须先有
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          showTotal: (total) => `共 ${total} 条`, // 显示总数
          onShowSizeChange: (current, pageSize) => {
            this.pagination.defaultCurrent = 1
            this.pagination.defaultPageSize = pageSize
          },
          // 改变每页数量时更新显示
          onChange: (current) => {
            this.pagination.defaultCurrent = current
          }
        }
      }
    },
    filters: {
      stateFilter (state) {
        return stateMap[state]
      },
      automaticStateFilter (state) {
        return automaticStateMap[state]
      },
      priorityFilter (state) {
        return priorityMap[state]
      },
      executeResultFilter (state) {
        return executeResultMap[state]
      },
      memberFilter (members) {
        if (members) {
          return members.join('、')
        } else {
          return ''
        }
      },
      smokeTestFilter (state) {
        return smokeTestStateMap[state]
      }
    },
    created () {
      console.log('in created:')
      console.log('this.$route in planDetail: ', this.$route)
      console.log('this.$route.query: ', this.$route.query)
      this.project_id = parseInt(this.$route.query.project_id)
      this.plan_id = parseInt(this.$route.query.plan_id)
      this.test_version_id = parseInt(this.$route.query.test_version_id)
      console.log('this.project_id:', this.project_id)
      console.log('this.plan_id:', this.plan_id)
      console.log('this.test_version_id:', this.test_version_id)
      this.totalPlanCases = 0
      this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
      this.getMembersList()
      this.queryData()
    },
    watch: {
      selectedRowKeys () {
        console.log('in watch')
        this.hasSelected = this.selectedRowKeys.length > 0
        console.log('this.hasSelected:', this.hasSelected)
      },
      smoke_case_window_visible () {
        console.log(' in watch of smoke_case_window_visible')
        if (this.smoke_case_window_visible) {
          document.querySelector('.smoke_case_page_button').style.color = '#14C393';
        } else {
          document.querySelector('.smoke_case_page_button').style.color = '#5D7092';
        }
      },
      plan_code_repository_window_visible () {
        console.log(' in watch of plan_code_repository_window_visible')
        if (this.plan_code_repository_window_visible) {
          document.querySelector('.automatic_code_repository').style.color = '#14C393';
        } else {
          document.querySelector('.automatic_code_repository').style.color = '#5D7092';
        }
      }
    },
    methods: {
      setMultiplePlanCaseSmokeTest (caseIdList) {
        console.log('caseIdList in setMultiplePlanCaseSmokeTest: ', caseIdList)
        this.selectedRowKeys = []
        const params = {
          plan_case_id_list: caseIdList
        }
        console.log('params in setMultiplePlanCaseSmokeTest: ', params)
        setPlanCaseSmokeTest(params).then(res => {
          console.log('批量设置冒烟测试ok')
          this.$message.info('设置成功')
          this.queryPlanCaseData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      cancelMultiplePlanCaseSmokeTest (caseIdList) {
        console.log('caseIdList in cancelMultiplePlanCaseSmokeTest: ', caseIdList)
        this.selectedRowKeys = []
        const params = {
          plan_case_id_list: caseIdList
        }
        console.log('params in cancelMultiplePlanCaseSmokeTest: ', params)
        cancelPlanCaseSmokeTest(params).then(res => {
          console.log('批量取消冒烟测试ok')
          this.$message.info('取消操作成功')
          this.queryPlanCaseData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      downloadRepositoryLog (address) {
        console.log('address in downloadRepositoryLog: ', address)
        window.open(address)
      },
      gotoRepositoryReport (address) {
        console.log('address in gotoRepositoryReport: ', address)
        window.open(address, '_blank')
      },
      openSmokeCase () {
        console.log('in openSmokeCase')
        this.smoke_case_window_visible = true
        this.plan_code_repository_window_visible = false
        this.$refs.smokeCaseWindow.init()
        // document.querySelector('.smoke_case_page_button').style.color = '#14C393';
      },
      openPlanCodeRepository () {
        console.log('in openPlanCodeRepository')
        this.plan_code_repository_window_visible = true
        this.smoke_case_window_visible = false
        this.getPlanCodeRepository()
      },
      getPlanCodeRepository () {
        const params = {
          plan_id: this.plan_id
        }
        console.log(' params in getPlanCodeRepository: ', params)
        getPlanCodeRepository(params).then(res => {
          console.log('in getPlanCodeRepository')
          this.autoCodeRepositoryList = res.data.plan_associated_code_repository_list
        })
      },
      runAutoCase () {
        console.log('in runAutoCase')
        this.total_execute_over = false
        this.repository_report_id_list = []
        const params = {
          project_id: this.project_id,
          plan_id: this.plan_id,
          code_repository_info: this.autoCodeRepositoryList
        }
        runAutoCase(params).then(res => {
          console.log('runAutoCase ok')
          const repositoryIdReportInfoObj = res.data.repository_id_report_info_dict
          this.startGetPlanRepositoryResult()// 定时获取日志
          for (var repositoryId in repositoryIdReportInfoObj) {
            const reportInfoObj = repositoryIdReportInfoObj[repositoryId]
            console.log('reportInfoObj: ', reportInfoObj)
            for (var i = 0; i < this.autoCodeRepositoryList.length; i++) {
              if (this.autoCodeRepositoryList[i].code_repository_id === parseInt(repositoryId)) {
                console.log('this.autoCodeRepositoryList[i].code_repository_id === parseInt(repositoryId): ')
                console.log(this.autoCodeRepositoryList[i].code_repository_id === parseInt(repositoryId))
                this.autoCodeRepositoryList[i].execute_status = '1'
                this.autoCodeRepositoryList[i].repository_log_address = reportInfoObj.repository_log_address
                this.autoCodeRepositoryList[i].repository_report_address = reportInfoObj.repository_report_address
                this.repository_report_id_list.push(reportInfoObj.report_id)
              }
            }
          }
          console.log('this.repository_report_id_list: ', this.repository_report_id_list)
          console.log('this.autoCodeRepositoryList: ', this.autoCodeRepositoryList)
        })
      },
      getPlanRepositoryStatus () {
        // this.total_execute_over = false
        const params = {
          repository_report_id_list: this.repository_report_id_list
        }
        console.log('params in getPlanRepositoryStatus: ', params)
        // 获取subprocess上运行日志信息
        getPlanRepositoryStatus(params).then(res => {
          console.log('res.data: ', res.data)
          const resDict = res.data.repository_report_id_repository_status_dict
          for (var repositoryReportId in resDict) {
            const reportInfoObj = resDict[repositoryReportId]
            console.log('reportInfoObj: ', reportInfoObj)
            for (var i = 0; i < this.autoCodeRepositoryList.length; i++) {
              if (this.autoCodeRepositoryList[i].code_repository_id === parseInt(reportInfoObj.code_repository_id)) {
                console.log('this.autoCodeRepositoryList[i].code_repository_id === parseInt(reportInfoObj.code_repository_id): ')
                console.log(this.autoCodeRepositoryList[i].code_repository_id === parseInt(reportInfoObj.code_repository_id))
                this.autoCodeRepositoryList[i].execute_status = reportInfoObj.repository_status
                if (reportInfoObj.repository_status === '2') {
                  // 说明该代码执行完毕,修改标志位
                  this.total_execute_over = true
                }
              }
            }
          }
          console.log('this.total_execute_over: ', this.total_execute_over)
          // 状态是结束，停止获取日志信息
          if (this.total_execute_over) {
            this.stopGetPlanRepositoryResult()
          }
        }).catch(err => {
          this.$message.error(err.message)
          this.stopGetPlanRepositoryResult()
        })
      },
      startGetPlanRepositoryResult () {
        if (this.loginterval != null) { // 判断计时器是否为空
          window.clearInterval(this.timer);
          this.timer = null;
        }
        this.timer = setInterval(this.getPlanRepositoryStatus, 4000);// 启动计时器，
      },
      stopGetPlanRepositoryResult () {
        window.clearInterval(this.timer);
        this.timer = null;
        // 查询代码库信息
        this.getPlanCodeRepository()
        this.findPlanData()
      },
      cancelRenameIteration (iterationData) {
        console.log('in cancelRenameIteration')
        iterationData.type = ''
        this.modify_show = false
        this.modify_iteration_name = ''
      },
      renameIteration (iterationData) {
        console.log('iterationData in renameIteration: ', iterationData)
        iterationData.type = 'modify'
        this.modify_iteration_name = iterationData.iteration_name
        this.modify_show = true
      },
      confirmCreateIteration () {
        console.log('in confirmCreateIteration')
        this.confirmCreatePlanIterationVisible = true
      },
      changeConfirmCreatePlanIterationVisible () {
        console.log('in changeConfirmCreatePlanIterationVisible')
        this.confirmCreatePlanIterationVisible = false
      },
      handleRenameIteration (iterationData) {
        console.log('iterationData in handleRenameIteration: ', iterationData)
        // 修改iterationData的标题为this.modify_iteration_name,待查询数据后覆盖，修改type为''
        this.modify_show = false
        iterationData.iteration_name = this.modify_iteration_name
        iterationData.type = ''
        const params = {
          iteration_id: this.iteration_id,
          modified_iteration_name: this.modify_iteration_name
        }
        modifyIterationName(params).then(res => {
          console.log('params in modifyIterationName: ', params)
          this.findPlanData()
          this.modify_iteration_name = ''
        })
      },
      handleCreateIteration () {
        console.log('in handleCreateIteration')
        this.add_show = false
        // 临时添加一个假数据,后端重新查询后，会进行覆盖
        console.log('前端先展示假数据')
        const newIterationData = {
          iteration_name: this.new_iteration_title,
          iteration_status: '0'
        }
        this.iteration_data_list[this.iteration_data_list.length - 1] = newIterationData
        const params = {
          plan_id: this.plan_id,
          iteration_name: this.new_iteration_title
        }
        createIterationData(params).then(res => {
          console.log('in createIterationData')
          if (res.data) {
            this.iteration_id = res.data.iteration_id
          }
          this.findPlanData()
            // 移除组件
          this.updateTreeComp = false
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          this.$nextTick(() => {
              this.updateTreeComp = true
          })
          this.queryPlanCaseData()
        })
      },
      addIterationTab () {
        this.add_show = true
        console.log('in addIterationTab')
        const newIterationData = {
          iteration_name: '新建迭代（按enter保存）',
          iteration_status: '0',
          type: 'new'
        }
        this.iteration_data_list.push(newIterationData)
        this.new_iteration_title = ''
        // this.$nextTick(function () {
        //   // DOM 更新了
        //   this.$refs.create_iteration_input.focus()
        // })
      },
      handleChangeIteration (iterationId) {
        console.log('iterationId in handleChangeIteration: ', iterationId)
        this.plan_code_repository_window_visible = false
        this.smoke_case_window_visible = false
        this.iteration_id = iterationId
        this.totalPlanCases = 0
        this.module_id = 0
        this.testCaseList = []
        this.findPlanData()
        this.queryPlanCaseData()
        // 移除树形组件
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
      },
      setChangePlanStatusVisible () {
        console.log('in setChangePlanStatusVisible')
        this.changePlanStatusVisible = false
      },
      changeTestPlanStatus () {
        this.changePlanStatusVisible = true
        console.log('this.changePlanStatusVisible: ', this.changePlanStatusVisible)
        console.log('this.plan_id in runTestPlan:', this.plan_id)
        console.log('this.plan_name in runTestPlan:', this.plan_name)
        console.log('this.plan_status in runTestPlan:', this.plan_status)
        this.$refs.changePlanStatusModal.init(this.plan_status, this.plan_id, this.iteration_id, this.plan_name, this.iteration_name)
      },
      planListWindowInitedFun () {
        console.log('in planListWindowInitedFun')
        console.log('this.planListWindowInitedFun: ', this.planListWindowVisible)
        this.planListWindowInited = true
      },
      openPlanListWindow () {
        console.log('in openProjectListWindow')
        console.log('this.planList: ', this.planList)
        if (this.planListWindowInited === true) {
          this.$refs.planListWindowRef.init()
        }
      },
      projectListWindowInitedFun () {
        console.log('in projectListWindowInited')
        console.log('this.projectListWindowVisible: ', this.projectListWindowVisible)
        this.projectListWindowInited = true
      },
      openProjectListWindow () {
        console.log('in openProjectListWindow')
        if (this.projectListWindowInited === true) {
          this.$refs.projectListWindowRef.init()
        }
      },
      openTestReportModal () {
        console.log('in openTestReportModal')
        this.testReportModalVisible = true
        this.$refs.testReportModal.init(this.plan_id, this.test_version_name)
      },
      changeTestReportModalVisible () {
        console.log('in changeTestReportModalVisible')
        this.testReportModalVisible = false
      },
      rowclick (record, index) {
        if (this.iteration_status !== '0') {
          return {}
        }
        return {
          on: {
            click: () => {
              console.log(record, index, 'in rowclick')
              this.testCaseDetail(record)
            }
          }
        }
      },
      testCaseDetail (planCaseInfo) {
        console.log('in testCaseDetail')
        this.caseDetailVisible = true
        this.$refs.planCaseDetail.init(planCaseInfo, this.iteration_id, this.initialProjectName, this.plan_status)
      },
      modifyTestPlan () {
        console.log('this.plan_id in modifyTestPlan:', this.plan_id)
        console.log('this.test_version_name: ', this.test_version_name)
        console.log('this.test_version_id: ', this.test_version_id)
        this.createFormVisible = true
        this.$refs.createOrModify.init(this.plan_id, this.test_version_name, this.test_version_id, this.initialProjectName)
        this.planOperationPopoverVisible = false
      },
      copyTestPlan () {
        console.log('this.plan_id in copyTestPlan:', this.plan_id)
        console.log('this.test_version_id in copyTestPlan:', this.test_version_id)
        console.log('this.test_version_name: ', this.test_version_name)
        this.copyFormVisible = true
        this.$refs.copyPlan.init(this.plan_id, this.test_version_id, this.test_version_name)
        this.planOperationPopoverVisible = false
      },
      deleteTestPlan () {
        console.log('this.plan_id in deleteTestPlan:', this.plan_id)
        console.log('this.plan_name in deleteTestPlan:', this.plan_name)
        this.deletePlanVisible = true
        this.$refs.deletePlan.init(this.plan_id, this.plan_name)
        this.planOperationPopoverVisible = false
      },
      executePriorityCustomCell (record) {
        if (this.iteration_status !== '0' || this.plan_status === '2') {
          return {}
        }
        return {
          on: {
            mouseenter: (event) => {
              console.log('进入鼠标指向的单元格')
              // 通过setExecutePriorityVisible
              record.setExecutePriorityVisible = true
              console.log('record.setExecutePriorityVisible in mouseenter:', record.setExecutePriorityVisible)
            },
            mouseleave: (event) => {
              event.preventDefault()
              console.log('离开当前单元格')
              record.setExecutePriorityVisible = false
              console.log('record.setExecutePriorityVisible in mouseLeave:', record.setExecutePriorityVisible)
            },
            click: (event) => {
              event.stopPropagation()
              console.log('in click')
              // record.setExecutePriorityPopOverVisible = true
              // this.changeExecutePerson([record.id])
            }
          },
          style: record.setExecutePriorityVisible ? {
            'background-color': '#D3EEF9'
          } : {}
        }
      },
      executeResultCustomCell (record) {
        if (this.iteration_status !== '0' || this.plan_status === '2') {
          return {}
        }
        return {
          on: {
            mouseenter: (event) => {
              console.log('进入鼠标指向的单元格')
              record.setExecuteResultVisible = true
              console.log('record.setExecuteResultVisible in mouseenter:', record.setExecuteResultVisible)
            },
            mouseleave: (event) => {
              event.preventDefault()
              console.log('离开当前单元格')
              record.setExecuteResultVisible = false
              console.log('record.setExecuteResultVisible in mouseLeave:', record.setExecuteResultVisible)
            },
            click: (event) => {
              event.stopPropagation()
              console.log('in click')
              // this.changeExecutePerson([record.id])
            }
          },
          style: record.setExecuteResultVisible ? {
            'background-color': '#D3EEF9'
          } : {}
        }
      },
      executePersonCustomCell (record) {
        if (this.iteration_status !== '0' || this.plan_status === '2') {
          return {}
        }
        return {
          on: {
            mouseenter: (event) => {
              console.log('进入鼠标指向的单元格')
              console.log('data in mouseenter:', record)
              record.setExecutorVisible = true
              console.log('record.setExecutorVisible in mouseenter:', record.setExecutorVisible)
            },
            mouseleave: (event) => {
              console.log('离开当前单元格')
              console.log('in mouseLeave')
              record.setExecutorVisible = false || this.setExecutorVisible
              console.log('record.setExecutorVisible in mouseLeave:', record.setExecutorVisible)
            },
            click: (event) => {
              event.stopPropagation()
              console.log('in click')
              console.log('this: ', this)
              this.changeExecutePerson([record.id])
            }
          },
          style: record.setExecutorVisible ? {
            'background-color': '#D3EEF9'
          } : {}
        }
      },
      openSetPriorityPopOver (data) {
        data.setExecutePriorityPopOverVisible = true
        console.log('data after openSetPriorityPopOver: ', data)
      },
      changeDeleteMultileCaseVisible () {
        console.log('in  changeDeleteMultileCaseVisible')
        this.deleteMultipleCaseVisible = false
      },
      removeMultiplePlanCase (planCaseIdList) {
        console.log('planCaseIdList in removeMultiplePlanCase: ', planCaseIdList)
        this.deleteMultipleCaseVisible = true
        this.$refs.deleteMultipleCase.init(planCaseIdList)
      },
      cancelSelectKeys () {
        this.selectedRowKeys = []
      },
      openMultiplePlanCaseExecuteResultPopOver (planCaseIdList) {
        console.log('planCaseIdList in openMultiplePlanCaseExecuteResultPopOver: ', planCaseIdList)
        this.setExecuteResultPopOverVisible = true
        this.execute_result_plan_case_id_list = planCaseIdList
      },
      setMultiplePlanCaseExecuteResult (resultCode) {
        console.log('resultCode in setMultiplePlanCaseExecuteResult: ', resultCode)
        this.setExecuteResultPopOverVisible = false
        this.changeHasSelected()
        const params = {
          plan_case_id_list: this.execute_result_plan_case_id_list,
          result_code: resultCode
        }
        setPlanCaseExecuteResult(params).then(res => {
          console.log('params in setPlanCaseExecuteResult: ', params)
          for (var item = 0; item < this.execute_result_plan_case_id_list.length; item++) {
            console.log('this.execute_result_plan_case_id_list[item]: ', this.execute_result_plan_case_id_list[item])
            for (var i = 0; i < this.testCaseList.length; i++) {
              if (this.testCaseList[i].id === this.execute_result_plan_case_id_list[item]) {
                console.log('找到数据，开始设置执行结果')
                this.testCaseList[i].execute_result = resultCode
              }
            }
          }
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.findPlanData()
          })
      },
      openMultiplePlanCaseExecutePriorityPopOver (planCaseIdList) {
        console.log('planCaseIdList in openMultiplePlanCaseExecutePriorityPopOver: ', planCaseIdList)
        this.setExecutePriorityPopOverVisible = true
        this.execute_priority_plan_case_id_list = planCaseIdList
      },
      setMultiplePlanCaseExecutePriority (priorityCode) {
        console.log('resultCode in setMultiplePlanCaseExecutePriority: ', priorityCode)
        this.setExecutePriorityPopOverVisible = false
        this.changeHasSelected()
        const params = {
          plan_case_id_list: this.execute_priority_plan_case_id_list,
          priority_code: priorityCode
        }
        setPlanCaseExecutePriority(params).then(res => {
          console.log('params in setPlanCaseExecutePriority: ', params)
          for (var item = 0; item < this.execute_priority_plan_case_id_list.length; item++) {
            console.log('this.execute_priority_plan_case_id_list[item]: ', this.execute_priority_plan_case_id_list[item])
            for (var i = 0; i < this.testCaseList.length; i++) {
              if (this.testCaseList[i].id === this.execute_priority_plan_case_id_list[item]) {
                console.log('找到数据，开始设置执行优先级')
                this.testCaseList[i].priority = priorityCode
              }
            }
          }
          }).catch(err => {
            this.$message.error(err.message)
          })
      },
      setPlanCaseExecutePriority (data, priorityCode) {
        console.log('data, priorityCode in setPlanCaseExecutePriority: ', data, priorityCode)
        data.setExecutePriorityPopOverVisible = false
        const params = {
          plan_case_id_list: [data.id],
          priority_code: priorityCode
        }
        setPlanCaseExecutePriority(params).then(res => {
          console.log('params in setPlanCaseExecutePriority: ', params)
          data.priority = priorityCode
          }).catch(err => {
            this.$message.error(err.message)
          })
      },
      setPlanCaseExecuteResult (data, resultCode) {
        console.log('data, resultCode in setPlanCaseExecuteResult: ', data, resultCode)
        data.setExecuteResultPopOverVisible = false
        const params = {
          plan_case_id_list: [data.id],
          result_code: resultCode
        }
        setPlanCaseExecuteResult(params).then(res => {
          console.log('params in setPlanCaseExecuteResult: ', params)
          data.execute_result = resultCode
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.findPlanData()
          })
      },
      openSetResultPopOver (data) {
        data.setExecuteResultPopOverVisible = true
        console.log('data after openSetResultPopOver: ', data)
      },
      removePlanCase (planCaseIdList) {
        this.$message.info('移除中，请稍后')
        this.totalPlanCases = 0
        console.log('planCaseIdList in removePlanCase: ', planCaseIdList)
        const params = {
          plan_case_id_list: planCaseIdList
        }
        removePlanCase(params).then(res => {
          console.log('params in removePlanCase', params)
          this.queryDataAfterRemoveCase()
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      setExecutor (planCaseIdList, executor) {
        console.log('planCaseIdList, executor in setExecutor:', planCaseIdList, executor)
        for (var item = 0; item < planCaseIdList.length; item++) {
          console.log('planCaseIdList[item]: ', planCaseIdList[item])
          for (var i = 0; i < this.testCaseList.length; i++) {
            if (this.testCaseList[i].id === planCaseIdList[item]) {
              console.log('找到数据，开始设置执行人')
              this.testCaseList[i].execute_person = executor
            }
          }
        }
      },
      changeSetExetorVisible () {
        console.log('in changeSetExetorVisible')
        this.setExecutorVisible = false
        for (var i = 0; i < this.testCaseList.length; i++) {
          this.testCaseList[i].setExecutorVisible = false
        }
      },
      changeExecutePerson (planCaseIdList) {
        console.log('planCaseIdList in changeExecutePerson: ', planCaseIdList)
        this.setExecutorVisible = true
        this.$refs.setExecutor.init(planCaseIdList)
        console.log('planCaseIdList in changeMultipleCaseExecutePerson: ', planCaseIdList)
      },
      getMembersList () {
        console.log('in getMembersList function')
        getMembers().then(res => {
        this.memberList = res.data
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      gotoTestPlan () {
        console.log('in gotoTestPlan')
        this.$router.push({
        name: 'caseTwoPlanList',
        query: { project_id: this.$store.state.caseTwo.case_two_global_project_id, test_version_id: this.test_version_id }
        })
        // this.project_id = parseInt(this.$route.query.project_id)
        // console.log('this.project_id:', this.project_id)
        // this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
        // console.log('this.project_id:', this.project_id)
        // this.queryData()
      },
      gotoHomePage () {
        console.log('### in gotoHomePage')
        this.$router.push({
        name: 'caseTwoProjectList'
        })
      },
      openRecycleBin () {
        console.log('in openRecycleBin')
        this.recycleBinVisible = true
        console.log('this.testCaseList in openRecycleBin:', this.testCaseList)
        this.$nextTick(() => {
            this.$refs.recycleBin.init(this.project_id)
        })
      },
      changeRecycleBinVisible () {
        console.log('in changeRecycleBinVisible')
        this.recycleBinVisible = false
      },
      importCase () {
        this.importCaseVisible = true
        this.$nextTick(() => {
          this.$refs.importCase.init(this.project_id)
      })
      },
      exportCase () {
        const params = {
          project_id: this.project_id,
          case_list: this.testCaseList
        }
        exportTestCase(params).then(res => {
          console.log('in exportTestCase')
          console.log('res.data:', res.data)
          const testCaseName = res.data.test_case_name
          if (res.data) {
            // 下载操作
            const apiUrl = `${process.env.VUE_APP_API_BASE_URL}`
            const url = apiUrl + `/case/v2/case/downloadTestCase/${testCaseName}`
            const evt = document.createEvent('HTMLEvents')
            evt.initEvent('click', false, false)
            const link = document.createElement('a');
            link.href = url
            link.target = '_blank'
            link.style.display = 'none'
            link.download = 'test.xlsx';
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href)
            document.body.removeChild(link);
            }
        }).catch(err => {
          console.log('err:', err)
        })
      },
      onSelectChange (selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        if (this.iteration_status !== '0') {
          this.selectedRowKeys = [];
        }
        this.selectedRowKeys = selectedRowKeys;
      },
      queryPlanCases () {
        console.log('in queryPlanCases')
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          console.log('errors: ', errors)
          console.log('values: ', values)
          if (!errors) {
            const params = {
              project_id: this.project_id,
              plan_id: this.plan_id,
              iteration_id: this.iteration_id,
              module_id: this.module_id,
              case_title: values.case_title,
              case_priority: values.case_priority,
              execute_result: values.execute_result,
              case_level: values.case_level,
              case_type: values.case_type,
              execute_person: values.execute_person,
              automatic_status: values.automatic_status,
              smoke_test_status: values.smoke_test_status,
              tree_node_children: this.tree_node_children
            }
            console.log('params in queryPlanCases: ', params)
            getPlanCaseData(params).then(res => {
              this.testCaseList = res.data
              if (this.totalPlanCases < res.data.length) {
                this.totalPlanCases = res.data.length
              }
              // 查询用例后，不刷新module tree结构
              // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
              // this.updateTreeComp = false
              // // 在组件移除后，重新渲染组件
              // // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
              // this.$nextTick(() => {
              //     this.updateTreeComp = true
              // })
            }).catch(err => {
              this.$message.error(err.message)
            })
          }
        })
      },
      handleChangePlan (planId) {
        console.log(`planId: ${planId}`);
        console.log('planId:', planId)
        console.log('this.project_id:', this.project_id)
        this.$router.push({
            name: 'caseTwoPlanDetail',
            query: { project_id: this.project_id, plan_id: planId }
          })
        this.totalPlanCases = 0
        this.planListWindowVisible = false
        // 重置迭代信息
        this.iteration_id = 0
        this.iteration_name = ''
        this.iteration_data_list = []
        this.plan_id = planId
        for (var i = 0; i < this.planList.length; i++) {
          if (this.planList[i].id === planId) {
            console.log('this.planList[i].id === planId: ', this.planList[i].id === planId)
            console.log('this.planList[i].plan_name: ', this.planList[i].plan_name)
            this.plan_name = this.planList[i].plan_name
          }
        }
        // this.module_id重新设为0
        this.module_id = 0
        // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
        // 刷新模块树后，查询一遍项目信息和用例，该项目下所有用例
        this.findPlanData()
        this.queryPlanCaseData()
      },
      handleChangeProject (projectInfo) {
        console.log('projectInfo in handleChangeProject :', projectInfo)
        this.projectListWindowVisible = false
        this.initialProjectName = projectInfo.project_name
        this.project_id = projectInfo.id
        console.log('this.initialProjectName in handleChangeProject: ', this.initialProjectName)
        this.$store.commit('case_two_global_project_name', projectInfo.project_name)
        this.$store.commit('case_two_global_project_id', projectInfo.id)
        console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
        // this.queryData()
        this.$router.push({
          name: 'caseTwoPlanList',
          query: { project_id: this.project_id }
        })
        this.goToTestVersion()
      },
      goToTestVersion () {
        console.log('in goToTestVersion')
        this.$router.push({
        name: 'caseTwoTestVersionList',
        query: { project_id: this.project_id }
        })
      },
      cancelInputAndShowSpan (data) {
        console.log('this.add_title:', this.add_title)
        this.add_show = false
        this.span_show = true
        data.title = this.add_title
      },
      openPopOver (data) {
        console.log('open popover and close tooltip');
        data.popoverVisible = true;
        data.tooltipVisible = false;
      },
      append (data) {
        this.add_show = true
        this.span_show = false
      // 模拟添加
        const newChild = {
          title: 'ceshi1',
          key: 'ceshi1',
          scopedSlots: { title: 'custom_add', icon: 'folder' },
          ellipsisSeen: false,
          popoverVisible: false,
          tooltipVisible: false,
          caseDetailVisible: false,
          children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.scopedSlots.icon = 'folder-open'
        data.children.push(newChild)
        console.log('this.treeDataList after append:', this.treeDataList)
        this.expandedKeys.push(data.key)
        this.autoExpandParent = false
      },
      edit (data) {
        console.log('this.treeDataList when edit:', this.treeDataList)
        // 先请求后端接口，编辑成功后执行
        this.dataHandle(data, this.treeDataList, 'edit')
      },
      onExpand (expandedKeys) {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys.push(expandedKeys);
        console.log('this.expandedKeys:', this.expandedKeys)
        this.autoExpandParent = false;
      },
      onCheck (checkedKeys) {
        console.log('onCheck', checkedKeys);
        this.checkedKeys = checkedKeys;
      },
      changeHasSelected () {
        console.log('in changeHasSelected');
        this.selectedRowKeys = []
        console.log('this.hasSelected:', this.hasSelected)
      },
      changeCreateVisible () {
        this.createFormVisible = false
      },
      changeCopyVisible () {
        this.copyFormVisible = false
      },
      changeConfigPlanCaseVisible () {
        this.configPlanCaseVisible = false
      },
      changeDeletePlanVisible () {
        this.deletePlanVisible = false
      },
      changeCopyMoveVisible () {
        this.copyMoveVisible = false
      },
      changeCaseDetailVisible () {
        this.caseDetailVisible = false
      },
      changeDeleteCaseVisible () {
        console.log('in changeDeleteCaseVisible')
        this.deleteCaseVisible = false
      },
      changeImportCaseVisible () {
        console.log('in changeImportCaseVisible')
        this.importCaseVisible = false
      },
      changeExportToolTipVisible () {
        this.planOperationToolTipVisible = !this.planOperationToolTipVisible
      },
      copyTestCase (caseList) {
        console.log('in copyTestCase')
        console.log('caseList: ', caseList)
        console.log('this.project_id: ', this.project_id)
        const projectId = this.project_id
        this.copyMoveVisible = true
        this.$refs.copyMoveCase.init('copy', projectId, caseList)
      },
      moveTestCase (caseIdList) {
        console.log('in moveTestCase')
        console.log('caseIdList: ', caseIdList)
        console.log('this.project_id: ', this.project_id)
        const projectId = this.project_id
        this.copyMoveVisible = true
        this.$refs.copyMoveCase.init('move', projectId, caseIdList)
      },
      deleteTestCase (caseIdList) {
        console.log('in deleteTestCase')
        console.log('caseIdList: ', caseIdList)
        this.deleteCaseVisible = true
        this.$refs.deleteCase.init(caseIdList)
      },
      queryData () {
        console.log('in queryData of PlanDetail')
        this.totalPlanCases = 0
        this.findPlanData()
        this.findTestVersionById()
        this.getProjectList()
        this.getTestPlanList()
        this.queryPlanCaseData()
      },
      findTestVersionById () {
        findTestVersionById(this.test_version_id).then(res => {
            if (res.data) {
              this.test_version_name = res.data.test_version_name
              console.log('this.test_version_name in findTestVersionById :', this.test_version_name)
            }
          }).catch(err => {
            this.$message.error(err.message)
          })
      },
      getTestVersionList () {
        const params = {
          project_id: this.project_id
        }
        console.log('params in getTestVersionList:', params)
        getTestVersionList(params).then(res => {
          this.testVersionList = res.data
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      queryDataAfterCopy (planId) {
        this.plan_id = planId
        this.iteration_id = 0
        console.log('planId in queryDataAfterCopy: ', planId)
         this.$router.push({
            name: 'caseTwoPlanDetail',
            query: { project_id: this.project_id, plan_id: planId }
          })
        this.totalPlanCases = 0
        this.getCopyPlan(planId)
        this.queryPlanCaseData()
        // 移除组件
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
      },
      queryDataAfterConfigPlanCase () {
        console.log('planId in queryDataAfterCopy')
        this.totalPlanCases = 0
        this.queryPlanCaseData()
        // 规划用例后，需要刷新模块树组件
        // 移除组件
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
      },
      queryDataAfterRemoveCase () {
        this.totalPlanCases = 0
        this.queryPlanCaseData()
        // 规划用例后，需要刷新模块树组件
        // 移除组件
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
      },
      getCopyPlan (planId) {
        console.log('planId in gotoCopyPlan: ', planId)
        this.plan_id = planId
        console.log('this.plan_id in gotoCopyPlan: ', this.plan_id)
        const params = {
          plan_id: planId
        }
        console.log('params in findPlanData: ', params)
        findPlanData(params).then(res => {
          if (res.data.project_id !== this.project_id) {
            this.$message.info('story所属项目已修改，回到story列表页')
            this.$router.push({
              name: 'caseTwoPlanList',
              query: { project_id: this.$store.state.caseTwo.case_two_global_project_id, test_version_id: this.test_version_id }
            })
          }
          this.iteration_data_list = res.data.iteration_data
          this.iteration_name = res.data.iteration_name
          this.iteration_id = res.data.iteration_id
          this.iteration_status = res.data.iteration_status
          console.log('this.iteration_status:', this.iteration_status)
          this.plan_name = res.data.plan_name
          this.owner = res.data.owner
          this.pass_rate = res.data.pass_rate
          this.automated_cover_rate = res.data.automated_cover_rate
          this.auto_case_pass_rate = res.data.auto_case_pass_rate
          this.already_executed_case_num = res.data.already_executed_case_num
          console.log('this.already_executed_case_num: ', this.already_executed_case_num)
          this.plan_status = res.data.plan_iteration_status
          this.iteration_status = res.data.iteration_status
          console.log('this.plan_status:', this.plan_status)
          console.log('this.iteration_status:', this.iteration_status)
          console.log('this.plan_name:', this.plan_name)
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      findPlanData () {
        const params = {
          plan_id: this.plan_id,
          iteration_id: this.iteration_id
        }
        console.log('params in findPlanData: ', params)
        findPlanData(params).then(res => {
          console.log('res.data.project_id in findPlanData: ', res.data.project_id)
          console.log('this.project_id in findPlanData: ', this.project_id)
          if (res.data.project_id !== this.project_id) {
            this.$message.info('story所属项目已修改，回到story列表页')
            this.$router.push({
              name: 'caseTwoPlanList',
              query: { project_id: this.$store.state.caseTwo.case_two_global_project_id }
            })
          }
          this.iteration_data_list = res.data.iteration_data
          this.iteration_name = res.data.iteration_name
          this.iteration_id = res.data.iteration_id
          this.iteration_status = res.data.iteration_status
          console.log('this.iteration_status:', this.iteration_status)
          this.plan_name = res.data.plan_name
          this.owner = res.data.owner
          this.need_auto_case_num = res.data.need_auto_case_num
          this.auto_case_pass_num = res.data.auto_case_pass_num
          this.already_automated_case_num = res.data.already_automated_case_num
          this.pass_rate = res.data.pass_rate
          this.automated_cover_rate = res.data.automated_cover_rate
          this.auto_case_pass_rate = res.data.auto_case_pass_rate
          this.already_executed_case_num = res.data.already_executed_case_num
          console.log('this.iteration_id in findPlanData: ', this.iteration_id)
          console.log('this.already_executed_case_num: ', this.already_executed_case_num)
          this.plan_status = res.data.plan_iteration_status
          console.log('this.plan_status:', this.plan_status)
          console.log('this.plan_name:', this.plan_name)
          this.selectedRowKeys = []
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      getProjectList () {
        const params = {
          project_name: ''
        }
        console.log('params in getProjectList:', params)
        getProjectList(params).then(res => {
          this.projectList = res.data
          console.log('res.data in getProjectList:', res.data)
          if (res.data) {
            for (var i in res.data) {
              // console.log(`res.data[${i}]:`, res.data[i])
              if (res.data[i].id === this.project_id) {
                this.initialProjectName = res.data[i].project_name
                this.$store.commit('case_two_global_project_name', res.data[i].project_name)
                this.$store.commit('case_two_global_project_id', res.data[i].id)
                console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
                console.log('this.initialProjectName:', this.initialProjectName)
                break
              }
            }
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      getTestPlanList () {
        const params = {
          project_id: this.project_id,
          test_version_id: this.test_version_id
        }
        console.log('params in getTestPlanList:', params)
        getTestPlanList(params).then(res => {
          this.planList = res.data
          console.log('this.planList: ', this.planList)
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      queryPlanCaseData (moduleId, treeNodeChildren) {
        // this.$message.info('用例查询中。')
        console.log('moduleId in queryPlanCaseData:', moduleId)
        if (moduleId || (moduleId === 0)) {
          this.module_id = moduleId
        }
        if (treeNodeChildren) {
          this.tree_node_children = treeNodeChildren
        } else {
          this.tree_node_children = []
        }
        const params = {
          module_id: moduleId || this.module_id,
          plan_id: this.plan_id,
          iteration_id: this.iteration_id,
          tree_node_children: treeNodeChildren
        }
        console.log('params in queryPlanCaseData:', params)
        this.loading = true
        getPlanCaseData(params).then(res => {
          this.testCaseList = res.data
          if (this.totalPlanCases < res.data.length) {
            this.totalPlanCases = res.data.length
          }
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
      },
      createOrModifyTestCase (caseId) {
        this.createFormVisible = true
        this.$refs.createTestCase.init(caseId)
      },
      configPlanTestCase () {
        console.log('in configPlanTestCase')
        this.configPlanCaseVisible = true
        this.$refs.configPlanCase.init(this.plan_id, this.plan_name, this.iteration_id)
      },
      createCase () {
        console.log('')
      },
      createModule () {
        console.log('')
      },
      deleteProject (record) {
          const params = {
            project_id: record.id
          }
          console.log('params in deleteProject func:')
          console.log(params)
          deleteProject(params).then(res => {
              const code = res.code
              if (code === 0) {
                this.$message.success('数据已删除')
                this.queryData()
              }
            }).catch(err => {
              this.$message.error(err.message)
            })
        }
    }
  }
</script>

<style lang="less" scoped>
  @import "./caseList.less";

  // 修改tabs滚动条粗细度
  /deep/ .ant-tabs-ink-bar-animated{
    bottom: 0;
  }

  .create_iteration_button{
    margin-left: 50px;
    cursor: pointer;
    color: #5D7092
  }
  .create_iteration_button:hover{
    color: #14C393;
  }

  .automatic_code_repository{
    float: right;
    margin-left: 50px;
    cursor: pointer;
    // color: rgb(52, 143, 228)
    color: #5D7092;
  }
  .automatic_code_repository:hover{
    color: #14C393;
  }

  .smoke_case_page_button{
    float: right;
    margin-left: 50px;
    cursor: pointer;
    // color: rgb(52, 143, 228)
    color: #5D7092;
  }
  .smoke_case_page_button:hover{
    color: #14C393;
  }

  .planOperationOption{
    width: 160px;
    height: 30px;
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .planOperationOption:hover{
    background-color: #D3EEF9;
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

 .changeNameOption{
    width: 100px;
    height: 30px;
    cursor: pointer;
  }
 .changeNameOption:hover{
    background-color: #D3EEF9;
  }

  .executePriorityOption{
  width: 160px;
  height: 35px;
  cursor: pointer;
  margin-bottom: 10px;
  }
  .executePriorityOption:hover{
    background-color: #D3EEF9;
  }
  //直接在style中添加样式
  //这样使用会使得当前页面所有的table表格行样式都会改变
  //如果想要调整表头的行高，可以把下面的td改成th
  //调整body行属性
  /deep/ .ant-table-tbody > tr > td {
    padding: 12px;
  }
  //调整head行属性
  /deep/ .ant-table-thead > tr > th {
    padding: 12px;
  }

  /deep/ .ant-tree li span.ant-tree-switcher{
    width:16px;
    height:16px;
    margin:6px;
    // 修改树结构合起的icon
    &.ant-tree-switcher_close{
      // background:url('../../../assets/case/project.png') no-repeat;
      background-size:contain;
      // i{
      //   display: none;
      // }
    }
    // 修改树结构展开的icon
    &.ant-tree-switcher_open{
      // background:url('../../../assets/case/project_two.png') no-repeat;
      background-size:contain;
      // i{
      //   display: none;
      // }
    }
  }

  .links {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .link {
        font-size: 14px;
        color: #14C393;
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
        border-radius: 5px;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .dashboard-img {
    img {
      width: 100%;
    }
  }
    .ant-card-body .but_type {
      float: right;
      position: absolute;
      right: 20px;
      width: 100px;
      text-align: right;
    }
  // new end
  /deep/ .ant-statistic-content {
    font-size: 19px;

    .active{
      margin-right: 5px;
    }

    .class_tag {
      font-weight: bold;
      color: white;
      font-size: 5px;
    }
  }

  .select_option {
    cursor: pointer;
  }
  .select_option:hover {
    color: #14C393;
  }
</style>
