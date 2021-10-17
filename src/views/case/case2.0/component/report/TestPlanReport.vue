<template>
  <div class="test-report-background">
    <div class="test-plan-report-page">
      <a-row :gutter="12" style="margin-top: 10px">
        <a-col :md="48" :lg="24">
          <span style="margin-left: 20px">报告基本信息</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-top: 15px">
        <a-col :md="16" :lg="6">
          <a-card
            style="
              width: 93%;
              margin-left: 20px;
              height: 140px;
              background-color: rgba(255, 205, 93, 0.05);
            "
          >
            <div style="margin-left: 10%; margin-top: 25px">
              <p style="margin-bottom: 5px">
                <span style="color: #e86452; font-size: 25px">{{ this.plan_associated_case_num }}</span>
              </p>
              <span>包含用例数</span>
            </div>
          </a-card>
        </a-col>
        <a-col :md="16" :lg="6">
          <a-card
            style="
              width: 93%;
              margin-left: 15px;
              height: 140px;
              background-color: rgba(93, 207, 255, 0.05);
            "
          >
            <div style="margin-left: 10%; margin-top: 25px">
              <p style="margin-bottom: 5px">
                <span style="color: #5b8ff9; font-size: 25px">{{ this.case_pass_rate }}</span>
              </p>
              <span>用例通过率</span>
            </div>
          </a-card>
        </a-col>
        <a-col :md="16" :lg="6">
          <a-card
            style="
              width: 93%;
              margin-left: 10px;
              height: 140px;
              background-color: rgba(115,216,151,.05);
            "
          >
            <div style="margin-left: 10%; margin-top: 25px">
              <p style="margin-bottom: 5px">
                <span style="color: #73d897; font-size: 25px">{{ this.auto_case_cover_rate }}</span>
              </p>
              <span>自动化用例覆盖率</span>
            </div>
          </a-card>
        </a-col>
        <a-col :md="16" :lg="6">
          <a-card
            style="
              width: 93%;
              margin-left: 10px;
              height: 140px;
              background-color: rgba(255, 117, 117, 0.05);
            "
          >
            <div style="margin-left: 10%; margin-top: 25px">
              <p style="margin-bottom: 5px">
                <span style="color: #e86452; font-size: 25px">{{ this.total_bug_num }}</span>
              </p>
              <span>缺陷数</span>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-top: 25px">
        <a-col :md="24" :lg="12">
          <span style="margin-left: 20px">项目名称：</span><span>{{ this.project_name }}</span>
        </a-col>
        <a-col :md="24" :lg="12">
          <span style="margin-left: 20px">测试版本：</span><span>{{ this.testVersionName }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-top: 25px">
        <a-col :md="24" :lg="12">
          <span style="margin-left: 20px">story名称：</span><span>{{ this.plan_name }}</span>
        </a-col>
        <a-col :md="24" :lg="12">
          <span style="margin-left: 20px">状态：</span>
          <a-tag
            v-if="this.plan_status === '0'"
            color="red"
            style="margin-left: 15px"
          >{{ this.plan_status | stateFilter }}</a-tag>
          <a-tag
            v-if="this.plan_status === '1'"
            color="orange"
            style="margin-left: 15px"
          >{{ this.plan_status | stateFilter }}</a-tag>
          <a-tag
            v-if="this.plan_status === '2'"
            color="green"
            style="margin-left: 15px"
          >{{ this.plan_status | stateFilter }}</a-tag>
          <!-- <span>{{ this.plan_status | stateFilter }}</span> -->
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-top: 25px">
        <a-col :md="24" :lg="12">
          <span style="margin-left: 20px">开始时间：</span
          ><span>{{ this.plan_start_time }}</span>
        </a-col>
        <a-col :md="24" :lg="12">
          <span style="margin-left: 20px">结束时间：</span
          ><span>{{ this.plan_end_time }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-top: 25px">
        <a-col :md="24" :lg="12">
          <span style="margin-left: 20px">关联需求：</span
          ><span>{{ this.associated_requirement }}</span>
        </a-col>
        <a-col :md="24" :lg="12">
          <span style="margin-left: 20px">负责人：</span
          ><span>{{ this.plan_owner }}</span>
        </a-col>
      </a-row>
    </div>
    <div v-if="!this.editTestSummaryVisible" class="test-plan-report-page">
      <a-row :gutter="12" style="margin-left: 10px">
        <a-col :md="42" :lg="21">
          <p>测试总结</p>
        </a-col>
        <a-col :md="6" :lg="3">
          <a-button
            type="primary"
            style="margin-left: 20px"
            @click="editTestSummary()"
          >编辑</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-left: 10px">
        <a-col :md="48" :lg="24">
          <span>测试策略:</span>
          <span style="margin-left: 10px">{{ this.test_summary_data.test_strategy }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-left: 10px; margin-top: 20px">
        <a-col :md="48" :lg="24">
          <span>测试类型:</span>
          <span style="margin-left: 10px">{{ this.test_classification_manual_case_desc }}</span>
          <span style="margin-left: 70px; display: block">{{ this.test_classification_automated_case_desc }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-left: 10px; margin-top: 20px">
        <a-col :md="48" :lg="24">
          <span>迭代轮次:</span>
          <span style="margin-left: 10px">{{ this.test_summary_data.iteration_info }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-left: 10px; margin-top: 20px">
        <a-col :md="48" :lg="24">
          <span>缺陷统计:</span>
          <span style="margin-left: 10px">{{ this.new_bug_desc }}</span>
          <span style="margin-left: 70px; display: block">{{ this.unsolved_bug_desc }}</span>
          <span style="margin-left: 70px">{{ this.reopen_bug_desc }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-left: 10px; margin-top: 20px">
        <a-col :md="48" :lg="24">
          <span>遗留问题:</span>
          <span style="margin-left: 10px">{{ this.test_summary_data.unsolved_bugs ? this.test_summary_data.unsolved_bugs : '无' }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-left: 10px; margin-top: 20px">
        <a-col :md="48" :lg="24">
          <span>开发质量:</span>
          <div style="margin-top: 10px">
            <span style="margin-left: 30px">自测报告:</span
            ><span style="margin-left: 10px">{{ this.test_summary_data.selftest_report | yesNoFilter }}</span>
          </div>
          <div style="margin-top: 10px">
            <span style="margin-left: 30px">提测延期:</span
            ><span style="margin-left: 10px">{{ this.test_summary_data.submit_to_test_delay | yesNoFilter }}</span>
          </div>
          <div style="margin-top: 10px">
            <span style="margin-left: 30px">提测驳回:</span
            ><span style="margin-left: 10px">{{ this.test_summary_data.submit_to_test_reject | yesNoFilter }}</span>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-left: 10px; margin-top: 20px">
        <a-col :md="48" :lg="24">
          <span>测试状态:</span>
          <span style="margin-left: 10px">{{ this.test_summary_data.test_status | testStatusFilter }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-left: 10px; margin-top: 20px">
        <a-col :md="48" :lg="24">
          <span>测试结果:</span>
          <span style="margin-left: 10px">{{ this.test_summary_data.test_result | testResultFilter }}</span>
        </a-col>
      </a-row>
      <a-row
        :gutter="12"
        style="margin-left: 10px; margin-top: 20px; margin-bottom: 20px"
      >
        <a-col :md="48" :lg="24">
          <span>版本地址:</span>
          <span style="margin-left: 10px; color: blue">{{ this.test_summary_data.edition_address }}</span>
        </a-col>
      </a-row>
    </div>
    <div v-if="this.editTestSummaryVisible" class="test-plan-report-page">
      <a-form :form="form">
        <a-row :gutter="12" style="margin-left: 10px">
          <a-col :md="42" :lg="21">
            <p>编辑测试总结</p>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :md="30" :lg="15" style="margin-left: -5.5%">
            <a-form-item
              label="测试策略"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                type="textarea"
                :autoSize="true"
                v-decorator="[
                  'test_strategy',
                  {
                    initialValue: this.test_summary_data.test_strategy,
                    rules: [{ required: true, message: '请输入名称' }]
                  }
                ]"
                placeholder="输入测试策略"
                style="resize: none; overflow-y: hidden; margin-left: 0"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="30" :lg="15" style="margin-left: -5.5%">
            <a-form-item
              label="测试类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <div>
                <span>功能测试用例</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'maual_case_num',
                    {
                      initialValue:
                        this.test_summary_data.test_classification.manual_case.case_num
                    }
                  ]"
                />
                <span>条，</span>
                <span>通过</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'maual_case_pass_num',
                    {
                      initialValue:
                        this.test_summary_data.test_classification.manual_case.pass_num
                    }
                  ]"
                />
                <span>条，通过率</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="['maual_case_pass_rate', { initialValue: '0%' }]"
                />
              </div>
              <div>
                <span>自动化用例</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'automated_case_num',
                    {
                      initialValue:
                        this.test_summary_data.test_classification
                          .automated_case.case_num
                    }
                  ]"
                />
                <span>条，</span>
                <span>通过</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'automated_case_pass_num',
                    {
                      initialValue:
                        this.test_summary_data.test_classification
                          .automated_case.pass_num
                    }
                  ]"
                />
                <span>条，通过率</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'automated_case_pass_rate',
                    { initialValue: '0%' }
                  ]"
                />
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="30" :lg="15" style="margin-left: -5.5%">
            <a-form-item
              label="迭代轮次"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                type="textarea"
                :autoSize="true"
                v-decorator="[
                  'iteration_info',
                  {
                    initialValue: this.test_summary_data.iteration_info,
                    rules: [{ required: true, message: '请输入迭代轮次' }]
                  }
                ]"
                placeholder="迭代轮次"
                style="resize: none; overflow-y: hidden"
              />
            </a-form-item>
            <!-- <span>迭代轮次:</span>
            <span style="margin-left: 10px;">{{ this.test_summary_data.iteration_info }}</span> -->
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="40" :lg="20" style="margin-left: -5.3%">
            <a-form-item
              label="缺陷统计"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="margin-left: -7%"
            >
              <div>
                <span>新增问题</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'new_bug_total',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.new_bug.total
                    }
                  ]"
                />
                <span>个，致命</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'new_bug_fatal',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.new_bug.fatal.length
                    }
                  ]"
                />
                <span>个，严重</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'new_bug_serious',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.new_bug.serious
                          .length
                    }
                  ]"
                />
                <span>个，一般</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'new_bug_normal',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.new_bug.normal.length
                    }
                  ]"
                />
                <span>个，提示</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'new_bug_prompt',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.new_bug.prompt.length
                    }
                  ]"
                />
                <span>个，建议</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'new_bug_advice',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.new_bug.advice.length
                    }
                  ]"
                />
                <span>个</span>
              </div>
              <div>
                <span>遗留问题</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'unsolved_bug_total',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.unsolved_bug.total
                    }
                  ]"
                />
                <span>个，致命</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'unsolved_bug_fatal',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.unsolved_bug.fatal
                          .length
                    }
                  ]"
                />
                <span>个，严重</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'unsolved_bug_serious',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.unsolved_bug.serious
                          .length
                    }
                  ]"
                />
                <span>个，一般</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'unsolved_bug_normal',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.unsolved_bug.normal
                          .length
                    }
                  ]"
                />
                <span>个，提示</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'unsolved_bug_prompt',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.unsolved_bug.prompt
                          .length
                    }
                  ]"
                />
                <span>个，建议</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'unsolved_bug_advice',
                    {
                      initialValue:
                        this.test_summary_data.bug_summary.unsolved_bug.advice
                          .length
                    }
                  ]"
                />
                <span>个</span>
              </div>
              <div>
                <span>reopen问题</span>
                <a-input
                  style="width: 50px; margin-left: 3px; margin-right: 3px"
                  v-decorator="[
                    'reopen_bug_num',
                    { initialValue: this.test_summary_data.bug_summary.reopen }
                  ]"
                />
                <span>个</span>
              </div>
            </a-form-item>
            <!-- <a-form-item
              label="缺陷统计"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="margin-left: -7%"
            >
              <div>
                <span style="margin-left: 10px">{{ this.new_bug_desc }}</span>
                <span style="margin-left: 70px; display: block">{{
                  this.unsolved_bug_desc
                }}</span>
                <span style="margin-left: 70px">{{
                  this.reopen_bug_desc
                }}</span>
              </div>
            </a-form-item> -->
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="30" :lg="15" style="margin-left: -5.5%">
            <a-form-item
              label="遗留问题"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                type="textarea"
                :autoSize="true"
                v-decorator="[
                  'unsolved_bug',
                  {
                    initialValue: this.test_summary_data.unsolved_bugs
                      ? this.test_summary_data.unsolved_bugs
                      : '无',
                    rules: [{ required: true, message: '请输入遗留问题' }]
                  }
                ]"
                placeholder="遗留问题"
                style="resize: none; overflow-y: hidden"
              />
            </a-form-item>
            <!-- <span>遗留问题:</span>
            <span style="margin-left: 10px;">{{ this.test_summary_data.unsolved_bugs ? this.test_summary_data.unsolved_bugs : '无' }}</span> -->
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-left: 15px; margin-top: 10px">
          <a-col :md="24" :lg="12">
            <span>开发质量:</span>
            <div style="margin-left: -6%">
              <a-form-item
                label="自测报告"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-select
                  v-decorator="[
                    'selftest_report',
                    {
                      initialValue:
                        this.test_summary_data.selftest_report === '0'
                          ? '是'
                          : '否',
                      rules: [{ required: true, message: '请选择自测报告' }]
                    }
                  ]"
                  placeholder="自测报告"
                  size="large"
                  @change="handleProjectChange"
                >
                  <a-select-option
                    v-for="item in ['是', '否']"
                    :key="item"
                    :value="item"
                  >
                    <span style="margin-left: 10px">{{ item }}</span>
                  </a-select-option>
                </a-select>
              </a-form-item>
              <!-- <span style="margin-left: 30px;">自测报告:</span><span style="margin-left: 10px;">{{ this.test_summary_data.selftest_report | yesNoFilter }}</span> -->
            </div>
            <div style="margin-left: -6%">
              <a-form-item
                label="提测延期"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-select
                  v-decorator="[
                    'submit_to_test_delay',
                    {
                      initialValue:
                        this.test_summary_data.submit_to_test_delay === '0'
                          ? '是'
                          : '否',
                      rules: [{ required: true, message: '请选择提测延期' }]
                    }
                  ]"
                  placeholder="提测延期"
                  size="large"
                  @change="handleProjectChange"
                >
                  <a-select-option
                    v-for="item in ['是', '否']"
                    :key="item"
                    :value="item"
                  >
                    <span style="margin-left: 10px">{{ item }}</span>
                  </a-select-option>
                </a-select>
              </a-form-item>
              <!-- <span style="margin-left: 30px;">提测延期:</span><span style="margin-left: 10px;">{{ this.test_summary_data.submit_to_test_delay | yesNoFilter }}</span> -->
            </div>
            <div style="margin-left: -6%">
              <a-form-item
                label="提测驳回"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-select
                  v-decorator="[
                    'submit_to_test_reject',
                    {
                      initialValue:
                        this.test_summary_data.submit_to_test_reject === '0'
                          ? '是'
                          : '否',
                      rules: [{ required: true, message: '请选择提测驳回' }]
                    }
                  ]"
                  placeholder="提测驳回"
                  size="large"
                  @change="handleProjectChange"
                >
                  <a-select-option
                    v-for="item in ['是', '否']"
                    :key="item"
                    :value="item"
                  >
                    <span style="margin-left: 10px">{{ item }}</span>
                  </a-select-option>
                </a-select>
              </a-form-item>
              <!-- <span style="margin-left: 30px;">提测驳回:</span><span style="margin-left: 10px;">{{ this.test_summary_data.submit_to_test_reject | yesNoFilter }}</span> -->
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="30" :lg="15" style="margin-left: -5.5%">
            <a-form-item
              label="测试状态"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                v-decorator="[
                  'test_status',
                  {
                    initialValue:
                      this.test_summary_data.test_status === '0' ? '正常' : '异常',
                    rules: [{ required: true, message: '请选择测试状态' }]
                  }
                ]"
                placeholder="测试状态"
                size="large"
                @change="handleProjectChange"
              >
                <a-select-option v-for="item in ['正常', '异常']" :key="item" :value="item">
                  <span style="margin-left: 10px">{{ item }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
            <!-- <span>测试状态:</span>
            <span style="margin-left: 10px;">{{ this.test_summary_data.test_status | testStatusFilter }}</span> -->
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="30" :lg="15" style="margin-left: -5.5%">
            <a-form-item
              label="测试结果"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                v-decorator="[
                  'test_result',
                  {
                    initialValue: this.test_summary_data.test_result === '0' ? '通过' : '不通过',
                    rules: [{ required: true, message: '请选择测试结果' }]
                  }
                ]"
                placeholder="测试结果"
                size="large"
                @change="handleProjectChange"
              >
                <a-select-option
                  v-for="item in ['通过', '不通过']"
                  :key="item"
                  :value="item"
                >
                  <span style="margin-left: 10px">{{ item }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
            <!-- <span>测试结果:</span>
            <span style="margin-left: 10px;">{{ this.test_summary_data.test_result | testResultFilter }}</span> -->
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="30" :lg="15" style="margin-left: -5.5%">
            <a-form-item
              label="版本地址"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                type="textarea"
                :autoSize="true"
                v-decorator="[
                  'edition_address',
                  {
                    initialValue: this.test_summary_data.edition_address,
                    rules: [{ required: true, message: '请输入版本地址' }]
                  }
                ]"
                placeholder="版本地址"
                style="resize: none; overflow-y: hidden"
              />
            </a-form-item>
            <!-- <span>版本地址:</span>
            <span style="margin-left: 10px; color: blue;">{{ this.test_summary_data.edition_address }}</span> -->
          </a-col>
        </a-row>
        <a-row
          :gutter="12"
          style="margin-left: 10px; margin-top: 10px; margin-bottom: 20px"
        >
          <a-col :md="46" :lg="23">
            <a-button
              @click="saveTestSummary()"
              style="float: right"
              type="primary"
            >保存</a-button
            >
            <a-button
              @click="cancelEditTestSummary()"
              style="float: right; margin-right: 20px"
            >取消</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="test-plan-report-page">
      <a-row :gutter="12" style="margin-left: 10px; height: 100px">
        <a-col :md="48" :lg="24">
          <p>用例结果分布</p>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-bottom: 20px">
        <a-col :md="24" :lg="12">
          <v-chart
            :autoresize="true"
            :options="caseResultOptions"
            style="width: 100%; margin-left: -20%; margin-top: -8%"
          ></v-chart>
        </a-col>
        <a-col :md="22" :lg="11" style="margin-top: -20px; margin-left: -10px">
          <a-table
            :columns="caseResultColumns"
            :data-source="case_result_data"
            :pagination="false"
            rowKey="id"
          >
          </a-table>
        </a-col>
      </a-row>
    </div>
    <!-- <div class="test-plan-report-page">
      <a-row :gutter="12" style="margin-left: 10px; height: 100px;">
          <a-col :md="48" :lg="24">
            <p>成员执行情况</p>
          </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-bottom: 20px;">
          <a-col :md="24" :lg="12">
            <v-chart :autoresize="true" :options="caseResultOptions" style="width:100%; margin-left: -20%; margin-top: -8%"></v-chart>
          </a-col>
      </a-row>
    </div> -->
    <div class="test-plan-report-page-bottom">
      <a-row :gutter="12" style="margin-left: 10px; height: 100px">
        <a-col :md="48" :lg="24">
          <p>缺陷统计</p>
        </a-col>
      </a-row>
      <a-row :gutter="12" style="margin-bottom: 50px">
        <a-col :md="24" :lg="12">
          <v-chart
            :autoresize="true"
            :options="bugSummaryOptions"
            style="width: 100%; margin-left: -20%; margin-top: -8%"
          ></v-chart>
        </a-col>
        <a-col :md="22" :lg="11" style="margin-top: -20px; margin-left: -10px">
          <a-table
            :columns="bugSummaryColumns"
            :data-source="bug_summary_data"
            :pagination="false"
            rowKey="id"
          >
          </a-table>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { getPlanReportData, getPlanReportTestSummary, modifyTestSummary } from '@/api/case/plan_two'
import moment from 'moment'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
const stateMap = {
  '0': '未开始',
  '1': '运行中',
  '2': '已完成'
}
const yesNoMap = {
  '0': '是',
  '1': '否'
}
const testStatusMap = {
  '0': '正常',
  '1': '延期'
}
const testResultMap = {
  '0': '通过',
  '1': '不通过'
}
const bugLevelMap = {
  'fatal': '致命',
  'serious': '严重',
  'normal': '一般',
  'prompt': '提示',
  'advice': '建议'
}
const bugSummaryColumns = [
  {
    title: '严重程度',
    dataIndex: 'bug_level',
    key: 'bug_level',
    scopedSlots: { customRender: 'bug_level' },
    align: 'center',
    width: '30%'
  },
  {
    title: '缺陷数',
    dataIndex: 'bug_num',
    key: 'bug_num',
    scopedSlots: { customRender: 'bug_num' },
    align: 'center',
    width: '30%'
  },
  {
    title: '占比',
    dataIndex: 'percent',
    key: 'percent',
    scopedSlots: { customRender: 'percent' },
    align: 'center'
  }
]
const caseResultColumns = [
  {
    title: '结果',
    dataIndex: 'result',
    key: 'result',
    scopedSlots: { customRender: 'result' },
    align: 'center',
    width: '30%'
  },
  {
    title: '用例数',
    dataIndex: 'case_num',
    key: 'case_num',
    scopedSlots: { customRender: 'case_num' },
    align: 'center',
    width: '30%'
  },
  {
    title: '占比',
    dataIndex: 'percent',
    key: 'percent',
    scopedSlots: { customRender: 'percent' },
    align: 'center'
  }
]
export default {
  name: 'TestPlanReport',
  props: {
    planId: {
      type: Number,
      default: 0
    },
    testVersionName: {
      type: String,
      default: ''
    }
  },
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      bugSummaryColumns,
      caseResultColumns,
      bugLevelMap,
      visible: this.testReportModalVisible,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'copyProjectForm' }),
      plan_id: 0,
      plan_name: '',
      plan_start_time: '',
      plan_end_time: '',
      plan_status: '',
      plan_owner: '',
      stateMap,
      yesNoMap,
      testStatusMap,
      testResultMap,
      associated_requirement: '',
      dateFormat: 'YYYY/MM/DD',
      startDateValue: moment(),
      endDateValue: moment(),
      project_id: 0,
      project_name: '',
      test_version_name: '',
      test_case_num: 0,
      case_pass_rate: 0,
      auto_case_cover_rate: 0,
      total_bug_num: 0,
      test_summary_data: {},
      test_classification_manual_case_desc: '',
      test_classification_automated_case_desc: '',
      new_bug_desc: '',
      unsolved_bug_desc: '',
      reopen_bug_desc: '',
      editTestSummaryVisible: false,
      plan_associated_case_num: 0,
      bug_summary_data: [],
      case_result_data: [],
      caseResultOptions: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          right: '15%',
          padding: 10,
          icon: 'circle',
          textStyle: { // 图例文字的样式
            fontSize: 16,
            padding: 5
          },
          itemWidth: 20,
          itemHeight: 20,
          itemGap: 20
        },
        color: ['#14C393', '#FAAD14', '#FF4D4F', '#5B8FF9', '#E5E5E5'],
        series: [
          {
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
            ]
          }
        ]
      },
      bugSummaryOptions: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          right: '15%',
          padding: 10,
          icon: 'circle',
          textStyle: { // 图例文字的样式
            fontSize: 16,
            padding: 5
          },
          itemWidth: 20,
          itemHeight: 20,
          itemGap: 20
        },
        color: ['#FF4D4F', '#FAAD14', '#E8E317', '#5B8FF9', '#14C393'],
        series: [
          {
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
            ]
          }
        ]
      }
    }
  },
  filters: {
    stateFilter (state) {
      return stateMap[state]
    },
    yesNoFilter (state) {
      return yesNoMap[state]
    },
    testStatusFilter (state) {
      return testStatusMap[state]
    },
    testResultFilter (state) {
      return testResultMap[state]
    }
  },
  watch: {
    // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
    // 但是不会同步到你刚刚在data对象中创建的 dialog 上
    // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
    // 当props修改后对应data中的副本dialog 也要同步数据。
    testReportModalVisible (val) {
      this.visible = val
    }
  },
  created () {
    console.log('in created of TestPlanReport')
    console.log('this.$store.state.caseTwo.case_two_global_project_name: ', this.$store.state.caseTwo.case_two_global_project_name)
    this.project_name = this.$store.state.caseTwo.case_two_global_project_name
    this.project_id = this.$store.state.caseTwo.case_two_global_project_id
    console.log('this.testVersionName in TestPlanReport: ', this.testVersionName)
    console.log('this.planId in created of TestPlanReport: ', this.planId)
    if (this.planId) {
      getPlanReportData(this.planId).then(res => {
        if (res.data) {
          this.project_id = res.data.project_id
          this.plan_name = res.data.plan_name
          this.plan_status = res.data.plan_status
          this.plan_owner = res.data.owner
          this.plan_start_time = res.data.start_time
          this.plan_end_time = res.data.end_time
          this.plan_associated_case_num = res.data.case_execute_info.case_num
          this.associated_requirement = res.data.iteration
          const caseExecuteInfo = res.data.case_execute_info
          const passRate = caseExecuteInfo.case_num !== 0 ? Math.round(caseExecuteInfo.pass_num / caseExecuteInfo.case_num * 10000) / 100 + "%" : '0%'
          console.log('passRate: ', passRate)
          this.case_pass_rate = passRate
          this.caseResultOptions.series[0].data = [
            { value: caseExecuteInfo.case_num, name: '通过' },
            { value: caseExecuteInfo.block_num, name: '阻塞' },
            { value: caseExecuteInfo.fail_num, name: '失败' },
            { value: caseExecuteInfo.skip_num, name: '跳过' },
            { value: caseExecuteInfo.not_test_num, name: '未测' }]

          // 赋值测试结果数据case_result_data
          // [{"result": "通过", "case_num": 2, "percent": '20%'},..]
          const caseResultMap = {
            'pass_num': '通过',
            'block_num': '阻塞',
            'fail_num': '失败',
            'skip_num': '跳过',
            'not_test_num': '未测'
          }
          var caseResultData = []
          console.log('caseExecuteInfo: ', caseExecuteInfo)
          for (const caseKey in caseExecuteInfo) {
            console.log('caseKey: ', caseKey)
            if (caseKey !== 'case_num') {
              const tmpObj = {}
              tmpObj.result = caseResultMap[`${caseKey}`]
              tmpObj.case_num = caseExecuteInfo[caseKey]
              tmpObj.percent = caseExecuteInfo.case_num !== 0 ? Math.round(caseExecuteInfo[caseKey] / caseExecuteInfo.case_num * 10000) / 100 + "%" : '0%'
              caseResultData.push(tmpObj)
            }
          }
          this.case_result_data = caseResultData
          console.log('caseResultData: ', caseResultData)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
      this.getPlanReportTestSummary()
    }
  },
  methods: {
    getPlanReportTestSummary () {
      console.log('in getPlanReportTestSummary')
      getPlanReportTestSummary(this.planId).then(res => {
        if (res.data) {
          console.log('res.data of getPlanReportTestSummary : ', res.data)
          this.test_summary_data = res.data
          if (res.data.test_classification) {
            const manualCase = res.data.test_classification.manual_case
            const automatedCase = res.data.test_classification.automated_case
            this.test_classification_manual_case_desc = `功能测试用例${manualCase.case_num}条，通过${manualCase.pass_num}条，不通过${parseInt(manualCase.case_num) - parseInt(manualCase.pass_num)}条，通过率${manualCase.case_num !== 0 ? Math.round(manualCase.pass_num / manualCase.case_num * 10000) / 100 + "%" : '0%'}。`
            this.test_classification_automated_case_desc = `自动化用例${automatedCase.case_num}条，通过${automatedCase.pass_num}条，不通过${parseInt(automatedCase.case_num) - parseInt(automatedCase.pass_num)}条，通过率${automatedCase.case_num !== 0 ? Math.round(automatedCase.pass_num / automatedCase.case_num * 10000) / 100 + "%" : '0%'}。`
            const autoCoverRate = automatedCase.need_automated_num !== 0 ? Math.round(automatedCase.case_num / automatedCase.need_automated_num * 10000) / 100 + '%' : '0%'
            this.auto_case_cover_rate = autoCoverRate
          }
          if (res.data.bug_summary) {
            const newBug = res.data.bug_summary.new_bug
            const unsolvedBug = res.data.bug_summary.unsolved_bug
            const reopenBug = res.data.bug_summary.reopen
            this.new_bug_desc = `新增问题${newBug.total}个，致命${newBug.fatal.length}个，严重${newBug.serious.length}个，一般${newBug.normal.length}个，提示${newBug.prompt.length}个，建议${newBug.advice.length}个`
            this.unsolved_bug_desc = `遗留问题${unsolvedBug.total}个，致命${unsolvedBug.fatal.length}个，严重${unsolvedBug.serious.length}个，一般${unsolvedBug.normal.length}个，提示${unsolvedBug.prompt.length}个，建议${unsolvedBug.advice.length}个`
            this.reopen_bug_desc = `reopen问题${reopenBug}个`
            this.total_bug_num = newBug.total
            this.bugSummaryOptions.series[0].data = [
              { value: newBug.fatal.length, name: '致命' },
              { value: newBug.serious.length, name: '严重' },
              { value: newBug.normal.length, name: '一般' },
              { value: newBug.prompt.length, name: '提示' },
              { value: newBug.advice.length, name: '建议' }]
            // 赋值bug_summary_data
            // [{"bug_level": "严重", "bug_num": 2, "percent": '20%'},..]
            var bugSummaryData = []
            console.log('newBug: ', newBug)
            for (const key in newBug) {
              if (key !== 'total') {
                console.log('key: ', key)
                const tmpObj = {}
                tmpObj.bug_level = this.bugLevelMap[`${key}`]
                tmpObj.bug_num = newBug[key].length
                tmpObj.percent = newBug.total !== 0 ? Math.round(newBug[key].length / newBug.total * 10000) / 100 + "%" : '0%'
                bugSummaryData.push(tmpObj)
              }
            }
            this.bug_summary_data = bugSummaryData
            console.log('bugSummaryData: ', bugSummaryData)
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveTestSummary () {
      this.form.validateFields((err, values) => {
        console.log('values in saveTestSummary: ', values)
        console.log('err in saveTestSummary: ', err)
        if (!err) {
          values['plan_id'] = this.planId
          modifyTestSummary(values).then(res => {
            this.$message.success('操作成功')
            this.cancelEditTestSummary()
            this.getPlanReportTestSummary()
          }).catch(err => {
            this.$message.error(err.message)
            this.cancelEditTestSummary()
            this.getPlanReportTestSummary()
          })
        }
      });
    },
    editTestSummary () {
      console.log('in editTestSummary')
      this.editTestSummaryVisible = true
    },
    cancelEditTestSummary () {
      console.log('in cancelEditTestSummary')
      this.editTestSummaryVisible = false
    },
    moment,
    handleProjectChange (value) {
      console.log(`Selected: ${value}`);
      this.project_id = parseInt(`${value}`)
      console.log('this.project_id:', this.project_id)
    },
    handleStartDataChange (value) {
      console.log('value in handleStartDataChange:', value.format('YYYY-MM-DD'))
      this.startDateValue = value
    },
    handleEndDataChange (value) {
      console.log('value in handleEndDataChange:', value.format('YYYY-MM-DD'))
      this.endDateValue = value
    },
    range (start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    disabledDateTime () {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    },
    handleOk () {
      this.$emit('changeTestReportModalVisible')
      // this.form.validateFields((err, values) => {
      console.log('in handle ok')
      // if (!err) {
      //   this.confirmLoading = true
      //   const params = {
      //     plan_id: this.plan_id,
      //     project_id: this.project_id,
      //     plan_name: values.plan_name,
      //     owner: values.owner,
      //     requirements: values.requirements,
      //     start_date_value: this.startDateValue.format('YYYY-MM-DD'),
      //     end_date_value: this.endDateValue.format('YYYY-MM-DD')
      //   }
      //   console.log('params in handle ok:', params)
      //   planCopy(params).then(res => {
      //     console.log('plan_id of copy plan: ', res.data.plan_id)
      //     this.$message.success('操作成功')
      //     this.form.resetFields();
      //     this.$emit('changeCopyVisible')
      //     this.$emit('queryData', res.data.plan_id)
      //   }).catch(err => {
      //     this.$message.error(err.message)
      //   }).finally(() => {
      //     this.confirmLoading = false
      //   })
      // }
      // }
    },
    handleCancel () {
      // this.form.resetFields()
      this.$emit('changeTestReportModalVisible')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../caseList.less';
</style>
