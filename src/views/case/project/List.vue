<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="工程">
                <a-select v-model="projectName" placeholder="请选择项目" allowClear>
                  <a-select-option v-for="item in projectList" :key="item.project_name">{{ item.project_name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24">
              <a-button type="primary" @click="getSubProject">查询</a-button>
              <a-button style="margin-left: 8px" @click="addProject">添加工程</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card title="项目展示" :bordered="false" style="margin-top:16px">
      <div class="card-list" ref="content">
        <a-list
          rowKey="id"
          :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
          :dataSource="subProjectList"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card :hoverable="true">
              <a-card-meta>
                <a slot="title" @click="subProjectDetail(item.project_name,item.absPath)">{{ item.project_name }}</a>
                <a-avatar class="card-avatar" shape="square" slot="avatar" :src="photo" />
              </a-card-meta>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </a-card>
    <a-modal
      title="添加工程"
      okText="创建工程"
      :width="600"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-form-item
          label="gitlab地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          type="url"
        >
          <a-input v-decorator="['gitlabUrl', {rules:[{required: true, message: '请输入正确gitlab地址', type:'url'}]}]" />
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { projectList, addProject, subProject } from '@/api/case/project'
import projectPhoto from '@/assets/case/project.png';
import * as statisticsApi from '@/api/common/statistics'
export default {
  name: 'ProjectList',
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
      projectName: undefined,
      projectList: [],
      visible: false,
      confirmLoading: false,
      gitlabUrl: '',
      subProjectList: [],
      photo: projectPhoto,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created () {
    this.getSubProject()
    this.getProjectList()
    this.addStatOverview()
  },
  methods: {
    getProjectList () {
      projectList().then(res => {
        this.projectList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSubProject () {
      let projectName = this.projectName
      if (!this.projectName) {
        projectName = 'all'
      }
      subProject(projectName).then(res => {
        this.subProjectList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    subProjectDetail (name, path) {
      this.$router.push({
        name: 'caseDetail',
        query: { parentName: this.projectName, projectName: name, projectPath: path }
      })
    },
    addProject () {
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          addProject({ url: values.gitlabUrl }).then(res => {
            this.$message.success('同步代码需要比较长时间，请耐心等待。使用前记得刷新页面')
            // this.visible = false
          }).catch(err => {
            this.$message.error(err.message)
          })
          this.visible = false
          this.form.resetFields();
        }
      });
    },
    handleCancel () {
      this.visible = false;
      this.form.resetFields();
    },
    addStatOverview () {
      const data = {
        'platform': 'case',
        'func': 'case_project'
      };
      statisticsApi.statOerviewAdd(data)
      .then(
        res => {
          console.log('add overview success')
        },
        error => {
          this.$message.error(`添加总览数据失败: ${error.message}`);
        }
      );
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .ant-card-head-title {
    padding: 20px 0;
  }
  /deep/ .ant-form-item {
    margin-bottom: 0px;
  }
  .card-list {
    /deep/ .ant-card-body:hover {
      .ant-card-meta-title>a {
        color: @primary-color;
      }
    }

    /deep/ .ant-card-meta-title {
      padding: 20px 0;
      &>a {
        display: inline-block;
        max-width: 100%;
        color: rgba(0,0,0,.85);
      }
    }
    /deep/ .ant-card-body {
      height: 97px;
    }
     /deep/ .ant-card-meta{
      margin: -10px 0;
    }
    /deep/ .ant-col {
      width: 270px !important;
    }
  }
  .card-avatar {
    width: 64px;
    height: 68px;
  }
</style>



