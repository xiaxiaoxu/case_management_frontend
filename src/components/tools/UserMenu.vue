<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a @click="goToolPage" target="_blank">
        <span class="action">
          <img src="~@/assets/header/toolbox.svg" alt="工具箱"/>
        </span>
      </a>
      <a href="http://wiki.jpushoa.com/pages/viewpage.action?pageId=38030446" target="_blank">
        <span class="action">
          <img src="~@/assets/header/readme.svg" alt="帮助文档"/>
        </span>
      </a>
      <!--暂时注释该反馈功能-->
      <!-- <span class="action">
        <img src="~@/assets/header/feedback.svg" @click="openFeedBack" alt="反馈"/>
        <a-modal
          title="反馈"
          :visible="feedbackVisible"
          @ok="feedBackModalOk"
          @cancel="feedBackModalCancel"
          width="400px">
          <a-form-model
            ref="ruleForm"
            :model="feedbackData"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :rules="rules"
            style="width:100%;">
            <a-form-model-item label="描述：" prop="comment">
              <a-input v-model="feedbackData.comment" :rows="3" type="textarea" />
            </a-form-model-item>
            <a-form-model-item label="联系方式：" prop="contact">
              <a-input v-model="feedbackData.contact"/>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </span> -->
      <notice-icon class="action" />
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <!-- <a-avatar class="avatar" size="small" src="~@/assets/header/headPortrait.svg"/> -->
          <img style="padding: 0 16px 0px 2px" src="~@/assets/header/headPortrait.svg"/>
          <span>{{ userNameCn }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import * as feedbackApi from '@/api/common/feedback'
import { mapActions, mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  data () {
    return {
      feedbackData: {
        comment: '',
        contact: ''
      },
      feedbackVisible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      rules: {
        comment: [
          { required: true, message: '请填写反馈描述！', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '请填写联系方式！', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['lastLoginTime', 'userNameCn', 'nickname', 'avatar'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            window.location.href = store.getters.loginUrl
          }).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    goToolPage () {
      this.$router.push({ name: 'tools' })
    },
    openFeedBack () {
      this.feedbackVisible = true
    },
    feedBackModalOk: function () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          feedbackApi
            .createFeedback(this.feedbackData)
            .then(
              res => {
                this.$message.success('提交成功！');
                this.feedbackVisible = false
                this.feedbackData.contact = ''
                this.feedbackData.comment = ''
                this.$refs.ruleForm.resetFields();
              },
              error => {
                this.$message.error(`提交失败，${error.message}`);
                this.feedbackVisible = false
                this.feedbackData.contact = ''
                this.feedbackData.comment = ''
                this.$refs.ruleForm.resetFields();
              })
        } else {
          return false;
        }
      })
    },
    feedBackModalCancel () {
      this.feedbackVisible = false
      this.feedbackData.contact = ''
      this.feedbackData.comment = ''
      this.$refs.ruleForm.resetFields();
    }
  }
}
</script>

<style lang="less" scoped>

</style>
