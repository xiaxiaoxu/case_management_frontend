<template>
  <div>
    <div class="page-header-content">
      <div class="avatar">
        <img src="~@/assets/header/headPortrait.svg"/>
      </div>
      <div class="content">
        <div class="content-title">
          {{ timeFix }}，{{ userData.user_name_cn }}，
          <span class="welcome-text">欢迎使用测试中台，祝您工作愉快！</span>
        </div>
        <div>最近登录时间 - {{ userData.lastLoginTime }}</div>
      </div>
      <!--<div class="extra-content">
        <div class="stat-item">
          <a @click="goToJira('sum')">
            <a-statistic title="总数" :value="sumCount"/>
          </a>
        </div>
        <div class="stat-item">
          <a @click="goToJira('todo')">
            <a-statistic title="待办" :value="todo"/>
          </a>
        </div>
        <div class="stat-item">
          <a @click="goToJira('doing')">
            <a-statistic title="处理中" :value="doing"/>
          </a>
        </div>
        <div class="stat-item">
          <a @click="goToJira('done')">
            <a-statistic title="已完成" :value="done"/>
          </a>
        </div>
      </div>
      <a-tooltip placement="left">
        <template slot="title">
          <span style="max-width: 400px;font-size: 12px">{{ jiraDesc }}</span>
        </template>
        <a-icon type="question-circle"/>
      </a-tooltip>-->
    </div>
    <div style="margin-top: 120px;">
      <a-row :gutter="24">
        <a-col :xl="18" :lg="24" :md="24" :sm="24" :xs="24">
          <a-carousel autoplay>
            <div class="dashboard-img"><img src="~@/assets/dashboard/stf.jpg"/></div>
            <div class="dashboard-img"><img src="~@/assets/dashboard/quality.jpg"/></div>
            <div class="dashboard-img"><img src="~@/assets/dashboard/case.jpg"/></div>
          </a-carousel>
          <div>
            <div>行业动态</div>
            <div>
              <a-tag color="#14C393" @click="getIndustryDynamicsList()">全部</a-tag>
              <a-tag v-for="tag in tagList" :key="tag" color="green" @click="getIndustryDynamicsList(tag)">{{ tag }}
              </a-tag>
            </div>
            <a-divider/>
            <a-card
              :loading="dynamicLoading"
              :bordered="false"
              :body-style="{padding: '0 24px 0 24px'}">
              <div class="dynamic">
                <a-list>
                  <a-list-item :key="index" v-for="(item, index) in dynamicList.slice(0,showDynamicNum)">
                    <a-list-item-meta>
                      <div slot="title">
                        <a :href="item.address" target="_blank" @click="addIndustryDynamicsViewNum(item.id)">
                          <div class="a-dynamic_title">{{ item.title }}</div>
                          <div>
                            <a-tag v-if="item.is_essence === 'Y'" color="#FAAD14"><div class="a-dynamic_tag">精</div></a-tag>
                            <a-tag v-if="item.is_top === 'Y'" color="#5B8FF9"><div class="a-dynamic_tag">顶</div></a-tag>
                          </div>
                        </a>
                      </div>
                      <div slot="description">
                        <div style="float: left;">
                          <a-tag v-for="tag in item.tags" :key="tag" :color="'green'">{{ tag }}</a-tag>
                        </div>
                        <div>
                          <span style="margin-right: 5px;">{{ item.share_person }}</span>
                          <span style="margin-right: 5px;">{{ item.created_time }}</span>
                          <span style="float: right">
                            <a-badge
                              :count="item.view_number"
                              :number-style="{ backgroundColor: '#5B8FF9' }"
                              :overflowCount="100000"
                              :showZero="true"
                            />
                          </span>
                        </div>
                      </div>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </div>
              <template slot="actions" class="ant-card-actions">
                <a @click="loadDynamicMore">查看更多</a>
              </template>
            </a-card>
          </div>
        </a-col>
        <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :title="todoListTitle" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="todo-list-content">
              <a-list>
                <a-list-item :key="index" v-for="(item, index) in todoList.slice(0,showTodoNum)">
                  <a-list-item-meta>
                    <div slot="title">
                      <a :href="item.link" target="_blank">
                        <div class="a-content">{{ item.content }}</div>
                      </a>
                    </div>
                    <div slot="description"><span>{{ item.created }}</span></div>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </div>
            <template slot="actions" class="ant-card-actions">
              <a @click="loadTodoListMore">查看更多</a>
            </template>
          </a-card>
          <a-card :loading="userLoading" title="活跃用户" style="margin-bottom: 24px" :bordered="false">
            <div style="min-height: 200px;width: 100%" id="activeUser">
              <!--<div class="links">
                <a-row>
                  <a-col :span="8" v-for="(item, index) in activeUserList" :key="index">
                    <a>
                      <a-tag class="link" color="#B3F6E3">{{ item.name_zh }}</a-tag>
                    </a>
                  </a-col>
                </a-row>
              </div>-->
            </div>
          </a-card>
          <a-card title="便捷导航" :bordered="false">
            <div class="links">
              <a-row>
                <a-col :span="12" v-for="(item, index) in linkList" :key="index">
                  <a :href="item.link" target="_blank">
                    <a-tag style="color: #485162;" class="link">{{ item.name }}</a-tag>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import { getInfo } from '@/api/common/login'
  import store from '@/store'
  import * as dashboardApi from '@/api/common/dashboard'
  import { timeFix } from '@/utils/util'
  import * as qualityApi from '@/api/quality/quality'
  import echarts from 'echarts'
  import 'echarts-wordcloud/dist/echarts-wordcloud'
  import 'echarts-wordcloud/dist/echarts-wordcloud.min'

  export default {
    name: 'Index',
    components: {},
    data () {
      return {
        timeFix: timeFix(),
        userData: {},
        avatar: '',
        user: {},
        todoList: [],
        radarLoading: false,
        activities: [],
        todoListTitle: '',
        projectNameList: [],
        sumCount: 0,
        todo: 0,
        doing: 0,
        done: 0,
        tagList: [],
        dynamicList: [],
        isTop: false,
        isEssence: false,
        linkList: [
          { link: 'http://titan.jpushoa.com/', name: 'Titan平台' },
          { link: 'http://bridge.jpushoa.com/', name: 'Bridge平台' },
          { link: 'https://auras.jpushoa.com/', name: '运维工作台' },
          { link: 'http://jenkins.glqa.jpushoa.com/', name: '观澜Jenkins' },
          { link: 'http://szgl-zabbix.jpushoa.com/', name: '观澜zabbix' },
          { link: 'http://dsb-bjdzp8s.jpushoa.com/', name: '观澜Grafana' }
        ],
        activeUserList: [],
        showDynamicNum: 10,
        showTodoNum: 5,
        userLoading: false,
        dynamicLoading: false,
        jiraDesc: '数据来源于JIRA，计算个人名下已完成和未完成的问题数，点击数字可以查看详情'
      }
    },
    created () {
      this.getUserInfo()
      this.getJiraProjectInfo()
      this.getActiveUser()
      this.getIndustryDynamicsList('')
    },
    computed: {
      projectList () {
        return this.$store.state.quality.jiraProjectList
      }
    },
    mounted () {
      setTimeout(() => {
        this.initCharts()
      }, 1000)
    },
    methods: {
      getTodoList (params) {
        dashboardApi.todoList(params).then(res => {
          this.todoList = res.data
          let num = res.data.length
          if (num > 99) {
            num = '99+'
          }
          this.todoListTitle = '我的待办（' + num + '）'
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      getJiraData (params) {
        dashboardApi.getJiraData(params).then(res => {
          this.sumCount = res.data.sum
          this.todo = res.data.todo
          this.doing = res.data.doing
          this.done = res.data.done
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      addIndustryDynamicsViewNum (dynamicId) {
        let params = {}
        params = {
            dynamic_id: dynamicId
          }
        dashboardApi.addIndustryDynamicsViewNum(params).then(res => {
          let code = 1
          code = res.code
          if (code === 0) {
            this.getIndustryDynamicsList()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      getIndustryDynamicsList (tagName) {
        this.dynamicLoading = true
        let params = {}
        if (tagName !== '') {
          params = {
            tags: tagName
          }
        }
        dashboardApi.getIndustryDynamicsList(params).then(res => {
          this.tagList = res.data.all_tags
          this.dynamicList = res.data.info
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.dynamicLoading = false
        })
      },
      getActiveUser () {
        this.userLoading = true
        dashboardApi.getActiveList({}).then(res => {
          res.data.forEach((item) => {
            const userList = {}
            userList['name'] = item.name_zh
            userList['value'] = item.act
            this.activeUserList.push(userList)
          })
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.userLoading = false
        })
      },
      loadDynamicMore () {
        if (this.showDynamicNum > this.dynamicList.length) {
          this.$message.warning('没有更多动态！')
        }
        this.showDynamicNum += 10
      },
      loadTodoListMore () {
        if (this.showTodoNum > this.todoList.length) {
          this.$message.warning('没有更多待办！')
        }
        this.showTodoNum += 5
      },
      getUserInfo () {
        getInfo({ userId: store.getters.userId }).then(res => {
          this.userData = res.data[0]
          const params = {
            'user_key': this.userData.username
          }
          this.getTodoList(params)
          // this.getJiraData(params)
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      getJiraProjectInfo () {
        if (this.projectList && this.projectList.length > 0) {
          return false
        }
        qualityApi.getJiraProjectList().then(
          res => {
            const data = res.data
            this.$store.commit('JIRA_PROJECT_LIST', data)
            data.forEach(item => {
              if (item.label !== '鹰眼') {
                this.projectNameList.push('"' + item.label + '"')
              }
            })
          },
          error => {
            this.$message.error(`获取项目失败${error.message}`)
          }
        )
      },
      goToJira (type) {
        let url = ''
        if (this.projectNameList.length === 0) {
          this.getJiraProjectInfo()
        }
        if (type === 'sum') {
          url = 'http://jira.jpushoa.com/issues/?jql=creator = "' + this.userData.username + '"+or+assignee = "' + this.userData.username + '"'
        } else if (type === 'todo') {
          url = 'http://jira.jpushoa.com/issues/?jql=(creator = "' + this.userData.username + '"+or+assignee = "' + this.userData.username +
            '")+and+status in (10103, 1)'
        } else if (type === 'doing') {
          url = 'http://jira.jpushoa.com/issues/?jql=(creator = "' + this.userData.username + '"+or+assignee = "' + this.userData.username +
            '")+and+status not in(10103, 1, 6)'
        } else if (type === 'done') {
          url = 'http://jira.jpushoa.com/issues/?jql=(creator = "' + this.userData.username + '"+or+assignee = "' + this.userData.username +
            '")+and+status=6'
        }
        window.open(url, '_blank')
      },
      initCharts () {
        this.chart = echarts.init(document.getElementById('activeUser'))
        const option = {
          title: {
            x: 'center'
          },
          backgroundColor: '#fff',
          // tooltip: {
          //   pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
          // },
          series: [
            {
              type: 'wordCloud',
              // 用来调整词之间的距离
              gridSize: 10,
              // 用来调整字的大小范围
              // Text size range which the value in data will be mapped to.
              // Default to have minimum 12px and maximum 60px size.
              sizeRange: [16, 45],
              // Text rotation range and step in degree. Text will be rotated randomly in range [-90,                                                                             90] by rotationStep 45
              // 用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
              // rotationRange: [-45, 0, 45, 90],
              // rotationRange: [ 0,90],
              rotationRange: [0, 0],
              // 随机生成字体颜色
              // maskImage: maskImage,
              textStyle: {
                normal: {
                  // Color can be a callback function or a color string
                  // color: function () {
                  //   // Random color
                  //   return 'rgb(' + [
                  //     Math.round(Math.random() * 160),
                  //     Math.round(Math.random() * 160),
                  //     Math.round(Math.random() * 160)
                  //   ].join(',') + ')'
                  // }
                  color: '#14C393'
                }
              },
              // 位置相关设置
              // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
              // Default to be put in the center and has 75% x 80% size.
              left: 'center',
              top: 'center',
              right: 'center',
              bottom: 'center',
              width: '100%',
              height: '100%',
              // 数据
              data: this.activeUserList
            }
          ]
        }
        this.chart.setOption(option)
        window.addEventListener('resize', () => {
          this.chart.resize()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./dashboard.less";

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

  /deep/ .ant-statistic-content {
    font-size: 19px;
  }
</style>
<style scoped>
  .ant-carousel >>> .slick-slide {
    text-align: center;
    overflow: hidden;
  }

  .ant-carousel >>> .slick-dots-bottom {
    bottom: 20px;
  }

  .ant-carousel >>> .slick-dots-bottom li {
    background: #bdbdbd;
  }

  .ant-carousel >>> .slick-dots li.slick-active button {
    background: #14C393;
  }
</style>
