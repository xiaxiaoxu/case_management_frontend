<template>
  <a-card title="筛选配置">
    <div class="clplatform">
      <div class="clpanlelable">
        <label class="cllable">系统:</label>
      </div>
      <div class="clform">
        <a-form :label-col="{ span: 5 }" v-for="(item) in platformData" :key="item.id" :wrapper-col="{ span: 8 }" class="clformchirld">
          <a-tag closable @close="deleteParm(item, $event)">
            {{ item.parameter }}
          </a-tag>
        </a-form>
        <a-button type="dashed" @click="openAddDialog('platform')">
          + 添加
        </a-button>
      </div>
    </div>
    <div class="clplatform">
      <div class="clpanlelable">
        <label class="cllable">品牌:</label>
      </div>
      <div class="clform">
        <a-form :label-col="{ span: 5 }" v-for="(item) in brandData" :key="item.id" :wrapper-col="{ span: 8 }" class="clformchirld">
          <a-tag closable @close="deleteParm(item, $event)">
            {{ item.parameter }}
          </a-tag>
        </a-form>
        <a-button type="dashed" @click="openAddDialog('brand')">
          + 添加
        </a-button>
      </div>
    </div>
    <div class="clplatform">
      <div class="clpanlelable">
        <label class="cllable">版本:</label>
      </div>
      <div class="clform">
        <a-form :label-col="{ span: 5 }" v-for="(item) in versionData" :key="item.id" :wrapper-col="{ span: 8 }" class="clformchirld">
          <a-tag closable @close="deleteParm(item, $event)">
            {{ item.parameter }}
          </a-tag>
        </a-form>
        <a-button type="dashed" @click="openAddDialog('version')">
          + 添加
        </a-button>
      </div>
    </div>
    <div class="clplatform">
      <div class="clpanlelable">
        <label class="cllable">分辨率:</label>
      </div>
      <div class="clform">
        <a-form :label-col="{ span: 5 }" v-for="(item) in resolutionData" :key="item.id" :wrapper-col="{ span: 8 }" class="clformchirld">
          <a-tag closable @close="deleteParm(item, $event)">
            {{ item.parameter }}
          </a-tag>
        </a-form>
        <a-button type="dashed" @click="openAddDialog('resolution')">
          + 添加
        </a-button>
      </div>
    </div>
    <a-modal
      title="添加配置"
      okText="保存"
      :visible="addVisible"
      @ok="addSubmit"
      @cancel="closeAddForm"
    >
      <a-form-model :model="addParm">
        <a-form-model-item label="类型" style="display: flex;">
          <span v-text="categoryList[addParm.category]"></span>
        </a-form-model-item>
        <a-form-model-item label="参数" prop="parameter" style="display: flex;">
          <a-input type="text" v-model="addParm.parameter"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>
<script>
import * as parmConfigApi from '@/api/common/parmconfig'
export default {
  name: 'ParmConfig',
  components: {
  },
  data () {
    return {
      platformData: [],
      brandData: [],
      versionData: [],
      resolutionData: [],
      addVisible: false,
      addParm: {
        parameter: '',
        category: ''
      },
      categoryList: {
        platform: '平台',
        brand: '品牌',
        version: '版本',
        resolution: '分辨率'
      },
      rules: {
        parameter: [{ required: true, message: '请填写参数', trigger: 'blur' }]
      }
    };
  },
  created () {
    this.getConfigList();
  },
  methods: {
    // 获取配置信息
    getConfigList () {
      parmConfigApi
        .getParmConfigList()
        .then(res => {
          if (res.code === 0) {
            this.platformData = res.data.platform;
            this.brandData = res.data.brand;
            this.versionData = res.data.version;
            this.resolutionData = res.data.resolution;
          }
        })
        .catch(err => {
          this.$message.error(`数据获取失败：${err.message}`);
        });
    },

    deleteParm (row, e) {
      e.preventDefault();
      this.$confirm({
        title: '确定要删除?',
        onOk: () => {
          console.log('点击确定')
          parmConfigApi
            .deleteParm(row)
            .then(res => {
              this.$message.success('删除成功!');
              this.getConfigList();
            })
            .catch(err => {
              this.$message.error(err);
            });
        },
        onCancel: () => {
          this.$message.info('已取消删除!')
        }
      })
    },

    // 关闭弹框
    closeAddForm () {
      this.addVisible = false;
    },
    openAddDialog (category) {
      this.addParm.category = category;
      this.addParm.parameter = '';
      this.addVisible = true;
    },
    addSubmit () {
      console.log('提交')
      parmConfigApi.addParm(this.addParm).then(
        res => {
          this.$message.success('添加成功！');
          this.closeAddForm();
          // 刷新列表
          this.getConfigList();
        },
        error => {
          console.log('提交添加失败')
          this.$message.error(`添加失败:${error.message}`);
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
  .clplatform{
    display: flex;
    margin-top: 32px;
    margin-bottom: 32px;
  }
  .clpanlelable{
    width: 70px;
    height: 22px;
    text-align: right;
    float: left;
    display: inline-flex;
    margin-top:8px;
  }
  .cllable{
    font-family: PingFangSC-Regular;
    color:  rgba(0,0,0,0.85);
  }
  .clform{
    float: left;
    width: 90%;
  }
  .clformchirld{
    display: inline-flex;
    margin-top:8px;
  }
  /deep/ .ant-btn-dashed {
    height: 22px;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 2px;
    border-radius: 2px;
    margin-top: 1px;
  }
</style>
