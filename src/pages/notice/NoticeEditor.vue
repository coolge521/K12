<template>
    <div style="border: 1px solid #ccc;">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
</template>

<script>
  import Vue from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { DomEditor } from '@wangeditor/editor'

  export default Vue.extend({
    components: { Editor, Toolbar, DomEditor},
    data() {
      return {
        editor: null,
        html: '',
        toolbarConfig: {

        },
        editorConfig: {
          placeholder: '请输入公告内容...',
          MENU_CONF: {}
        },
        mode: 'default', // or 'simple',
      }

    },
    methods: {
      onCreated(editor) {
        let that = this
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        this.editor.getConfig().MENU_CONF['uploadImage'] = {
          // 服务地址
          server: this.$ucconfig.API_HOST+this.$api.uploadImage.UPLOAD_IMAGE,
          // server: this.$api.uploadImage.UPLOAD_IMAGE,

          // form-data fieldName ，默认值 'wangeditor-uploaded-image'
          fieldName: 'images',

          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 2 * 1024 * 1024, // 2M

          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 10,

          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],

          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          meta: {
            tokenId: this.$util.getSession("token").id,
            userId: this.$util.getSession("user").id,
          },

          // 将 meta 拼接到 url 参数中，默认 false
          metaWithUrl: false,

          // 自定义增加 http  header
          headers: {
            Accept: '*/*',
            license:'d68beaf2798b995797362051ab25b246',
          },

          // 跨域是否传递 cookie ，默认为 false
          withCredentials: false,

          // 超时时间，默认为 10 秒
          timeout: 50 * 1000, // 5 秒


          // 自定义插入图片
          customInsert(res, insertFn) {                  // JS 语法
            // res 即服务端的返回结果
            //⾃⾏处理各种情况
            const code = res && parseInt(res.code, 10);
            if (code === 200) {
              //成功
              // 从 res 中找到 url alt href ，然后插图图片
              let body = res.body
              let url = body[0].large.url
              let href = body[0].large.url
              let alt = ''
              insertFn(url, alt, href)
            } else {
              //失败
              this.$Message.error('图片上传失败')
            }


          },


          // 上传之前触发
          onBeforeUpload(file) {    // JS 语法
            // file 选中的文件，格式如 { key: file }
            return file

            // 可以 return
            // 1. return file 或者 new 一个 file ，接下来将上传
            // 2. return false ，不上传这个 file
          },

          // 上传进度的回调函数
          onProgress(progress) {       // JS 语法
            // progress 是 0-100 的数字
            console.log('progress', progress)
          },

          // 单个文件上传成功之后
          onSuccess(file, res) {          // JS 语法
            console.log(`${file.name} 上传成功`, res)
          },

          // 单个文件上传失败
          onFailed(file, res) {           // JS 语法
            that.$Message.error("上传图⽚失败"+res);
            console.log(`${file.name} 上传失败`, res)
          },

          // 上传错误，或者触发 timeout 超时
          onError(file, err, res) {               // JS 语法
            that.$Message.error("上传图⽚失败"+err);
            console.log(`${file.name} 上传出错`, err, res)
          },
        }

        this.toolbarConfig.excludeKeys = [
          'todo',
          'group-video',
          'insertTable',
          'codeBlock',
          'fullScreen'// 排除菜单组，写菜单组 key 的值即可
        ]


      },
    },
    mounted() {
      // 模拟 ajax 请求，异步渲染编辑器
      // setTimeout(() => {
      //   this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
      // }, 1500)

    },
    beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy() // 组件销毁时，及时销毁编辑器
    }
  })
</script>


<style src="@wangeditor/editor/dist/css/style.css"></style>
