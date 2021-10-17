<template>
  <div class="user-list">
    <div class="table-operations">
      <p>角色授权</p>
    </div>
    <a-table rowKey="userid" :columns="columns" :data-source="dataSource" :pagination="pagination" class="table-info">
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="c => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          Search
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          Reset
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="creationTime" slot-scope="text, record">
        {{ record.creationTime | formatTime }}
      </template>
      <template slot="lastLoginTime" slot-scope="text, record">
        {{ record.lastLoginTime | formatTime }}
      </template>
      <template slot="part" slot-scope="text, record">
        {{ partList[record.part] }}
      </template>
      <template slot="status" slot-scope="text, record">
        <a-switch :checked="record.status===0 ? true : false" :disabled="true" />
      </template>
      <template slot="onJob" slot-scope="text, record">
        <a-switch :checked="record.onJob==='1' ? true : false" :disabled="true" />
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="() => editApplication(record)">编辑</a>
      </template>
    </a-table>
    <a-modal
      title="编辑"
      :visible="modalVisible"
      @ok="modalOk"
      @cancel="modalCancel"
      width="400px"
    >
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="用户名">
          {{ form.username }}
        </a-form-model-item>
        <a-form-model-item label="角色">
          {{ partList[form.part] }}
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-switch v-model="form.status" />
        </a-form-model-item>
        <a-form-model-item label="在职状态">
          <a-switch v-model="form.onJob" />
        </a-form-model-item>
        <a-form-model-item label="描述">
          <a-textarea v-model="form.desc" :maxLength="50"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import * as userApi from '@/api/common/user'
  export default {
    name: 'Permission',
    data () {
      return {
        partList: {
          '1': '管理员',
          '2': '高级用户',
          '3': '普通用户'
        },
        pagination: {
          defaultCurrent: 1, // 默认当前页数
          defaultPageSize: 10, // 默认当前页显示数据的大小
          total: 0, // 总数，必须先有
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '15', '20'],
          showTotal: (total) => `共 ${total} 条`, // 显示总数
          onShowSizeChange: (current, pageSize) => {
            this.pagination.defaultCurrent = 1
            this.pagination.defaultPageSize = pageSize
          },
          // 改变每页数量时更新显示
          onChange: (current) => {
            this.pagination.defaultCurrent = current
          }
        },
        dataSource: [],
        columns: [
          {
            title: 'ID',
            dataIndex: 'userid',
            width: '8%'
          },
          {
            title: '用户名',
            dataIndex: 'username',
            width: '12%',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon'
            },
            onFilter: (value, record) =>
              record.username
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus();
                }, 0);
              }
            }
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            width: '15%',
            ellipsis: true
          },
          {
            title: '添加日期',
            dataIndex: 'creationTime',
            scopedSlots: { customRender: 'creationTime' },
            width: '10%'
          },
          {
            title: '最后登录时间',
            dataIndex: 'lastLoginTime',
            scopedSlots: { customRender: 'lastLoginTime' },
            width: '12%'
          },
          {
            title: '角色',
            dataIndex: 'part',
            scopedSlots: { customRender: 'part' },
            width: '10%'
          },
          {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            width: '8%'
          },
          {
            title: '在职状态',
            dataIndex: 'onJob',
            scopedSlots: { customRender: 'onJob' },
            width: '10%'
          },
          {
            title: '描述',
            dataIndex: 'desc',
            scopedSlots: { customRender: 'desc' },
            ellipsis: true,
            width: '10%'
          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        modalVisible: false,
        form: {
          id: '',
          username: '',
          part: '1',
          status: false,
          onJob: '0',
          desc: ''
        },
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
    },
    filters: {
      formatTime (value) {
        if (value === '') {
          return ''
        }
        const t = moment(value)
        return t.format('YYYY-M-D HH:mm:ss')
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      // 获取所有的用户列表
      getUserList () {
        userApi
          .getUserInfoList()
          .then(res => {
            this.dataSource = res.data.sort((a, b) => a.userid > b.userid);
          })
          .catch(err => {
            this.$message.error(`数据获取失败：${err.message}`);
          });
      },
      editApplication (record) {
        this.modalVisible = true
        this.form.id = record.userid
        this.form.username = record.username
        this.form.status = record.status === 0
        this.form.part = record.part
        this.form.onJob = record.onJob === '1'
        this.form.desc = record.desc
      },
      handleSearch (selectedKeys, confirm, dataIndex) {
        confirm();
        this.searchText = selectedKeys[0];
        this.searchedColumn = dataIndex;
      },
      handleReset (clearFilters) {
        clearFilters();
        this.searchText = '';
      },
      modalOk () {
        const updateInfo = {
          id: this.form.id,
          username: this.form.username,
          part: this.form.part,
          status: this.form.status === true ? 0 : 1,
          onJob: this.form.onJob === true ? '1' : '0',
          desc: this.form.desc
        }
        userApi
          .updateUserInfo(updateInfo)
          .then(res => {
            this.modalVisible = false
            this.$message.success('编辑成功!')
            this.getUserList()
          }).catch(err => {
          this.$message.error(err.message)
        })
      },
      modalCancel () {
        this.modalVisible = false
      },
      roleChange (selectedItem) {
        this.form.part = selectedItem
      }
    }
  }
</script>

<style lang="less" scoped>
  .user-list {
    background: #FFFFFF;
    border-radius: 2px;
    .table-operations {
      border-radius: 2px 2px 0 0;
      height: 64px;
      > p {
        opacity: 0.85;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
        text-align: justify;
        line-height: 24px;
        margin-top: 23px;
        margin-left: 27px;
        margin-bottom: 17px;
        float: left;
        font-weight: bold;
      }
    }
    .table-info {
      margin-left: 24px;
      margin-right: 24px;
      .table-edit {
        line-height: 22px;
        color: #14C393;
        font-size: 14px;
      }
      /deep/ .ant-switch-disabled {
        opacity: 1;
      }
    }
  }
</style>
