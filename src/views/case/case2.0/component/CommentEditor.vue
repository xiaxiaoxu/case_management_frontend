<template>
  <div ref="commentEditor"></div>
</template>
<script>
import E from 'wangeditor-antd'
const apiUrl = `${process.env.VUE_APP_API_BASE_URL}`
export default {
  name: 'CommentEditor',
  props: { // 回调方法
    editorContent: {
      type: String,
      default: ''
    },
    commentEditorVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
    // 但是不会同步到你刚刚在data对象中创建的 dialog 上
    // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
    // 当props修改后对应data中的副本dialog 也要同步数据。
    commentEditorVisible (val) {
      console.log('in commentEditorVisible')
      this.commentEditorVisible = val
    }
  },
  mounted () {
    console.log('in commentEditor mounted')
    const editor = new E(this.$refs.commentEditor)
    editor.customConfig.onchange = (html) => {
      this.getFullText(html) // 内容赋值
    }
    editor.customConfig.uploadImgServer = apiUrl + '/case/v2/case/uploadImage'
    editor.customConfig.uploadFileName = 'file'
    // editor.customConfig.uploadImgParams = {
    //   caseid: this.caseId
    // }
    // editor.customConfig.uploadImgParamsWithUrl = true
    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false
    // 使用 base64 保存图片
    // editor.customConfig.uploadImgShowBase64 = true
    // 新增
    editor.customConfig.zIndex = 100
    // 工具条高度 默认 50px small为40px
    editor.customConfig.toolBarSize = 'small'
    // 最小高度 默认 100px
    editor.customConfig.minHeight = '100px'
    // 最大高度 默认 500px
    editor.customConfig.maxHeight = '200px'
    // 菜单项可以像这样指定
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'image' // 插入图片
    ]
    editor.customConfig.uploadImgParams = {
      from: 'editor'
    }
    editor.customConfig.onchange = (html) => {
      this.getFullText(html) // 内容赋值
    }
    editor.customConfig.onblur = (html) => {
      // html 即编辑器中的内容
      console.log('onblur', html)
      this.changeCommentEditorVisible(html)
    }
    editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function (xhr, editor, result) {
        console.log('xhr in success:', xhr)
        console.log('result in success:', result)
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function (xhr, editor, result) {
        console.log('xhr in fail:', xhr)
        console.log('result in fail:', result)
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function (xhr, editor) {
        console.log('xhr in error:', xhr)
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function (xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      }
    }
    editor.create()
    // 如果默认传递content值则渲染默认内容
    if (this.editorContent) {
      editor.txt.html(this.editorContent)
    }
  },
  methods: {
    getFullText (val) {
      console.log('value in getFullText:', val)
      console.log('this.commentEditorVisible: ', this.commentEditorVisible)
      this.$emit('commentEditorChange', val) // 将内容同步到父组件中
    },
    changeCommentEditorVisible () {
      this.$emit('changeCommentEditorVisible')
    }
  }
}
</script>
