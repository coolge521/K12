<template>
  <div class="vue-quill-editor">
    <Upload
      id="iviewUp"
      :show-upload-list="false"
      :before-upload="uploadImg"
      :format="['jpg','jpeg','png','gif']"
      name="richTextAccessory"
      :max-size="2048"
      :action="uploadRichTextImg"
      multiple
      style="display:none;">
      <Button icon="ios-cloud-upload-outline" ></Button>
    </Upload>
    <quill-editor
      v-model="obj.subContent"
      ref="myQuillEditor"
      class="ql-editor"
      :options="editorOption"
      placeholder="请输入公告内容"
      @change="onEditorChange($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    />

  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import Quill from 'quill'  // 引入编辑器
  import ImageResize  from 'quill-image-resize-module';// 调整大小组件。
  Quill.register('modules/imageResize', ImageResize);
  import { ImageDrop } from 'quill-image-drop-module';// 拖动加载图片组件。
  Quill.register('modules/imageDrop', ImageDrop);


  export default {
    name: 'ContentEditor',
    components: {
      quillEditor
    },
    props: [
      'obj',
    ],
    data () {
      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
        [{ align: [] }], // 对齐方式-----[{ align: [] }]
        // [{ size: fontSizeStyle.whitelist }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
        // [{ font: fonts }], // 字体种类-----[{ font: [] }]
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
        [{ direction: 'ltl' }], // 文本方向-----[{'direction': 'rtl'}]
        [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
        [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
        [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
        // [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
        ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
        ['clean'], // 清除文本格式-----['clean']
        ['image'] // 链接、图片、视频-----['link', 'image', 'video']
      ]
      return {
        uploadRichTextImg: this.$api.uploadImage.UPLOAD_IMAGE, // 上传图片地址接口
        uploadList: [], // 富文本编辑器的图文列表
        content: '', // 富文本里的内容
        editorOption: { // 富文本编辑器的工具栏
          modules: {
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            },
            imageResize: {          //放大缩小
              displayStyles: {
                backgroundColor: "black",
                border: "none",
                color: "white"
              },
              modules: ["Resize", "DisplaySize", "Toolbar"]
            },
            imageDrop: true,      //图片拖拽
            toolbar: {
              container: toolbarOptions, // 工具栏
              handlers: {
                image: function(value) { // 对图片进行改造，默认是通过base64 ,现通过iview 去传。
                  if (value) {
                    document.querySelector('#iviewUp input').click()
                  } else {
                    this.quill.format('image', false)
                  }
                }
              },
            },
          },

          placeholder: '请输入公告内容'
        },

      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      }
    },
    watch: {

    },
    mounted () {

    },
    methods: {
      onEditorBlur(editor) {
        // console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        // console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        // console.log('editor ready!', editor)
      },
      onEditorChange(e) {
        // const _this = this
        // _this.content = e.html // 标签以<p></p> 形式渲染 （重点）
        // _this.contentTxt = e.text.substr(0, 100)

      },
      // 上传图片成功
      handleSuccessQuill(res) {
        // 获取富文本组件实例
        const quill = this.$refs.myQuillEditor.quill
        // 如果上传成功
        if (res != undefined && res.length > 0) {
          // 获取光标所在位置
          const length = quill.selection.savedRange.index
          // 插入图片，res为服务器返回的图片链接地址
          quill.insertEmbed(length, 'image', res[0].small.url)
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          // 提示信息，需引入Message
          this.$Message.error('图片插入失败')
        }
      },
      // 上传图片失败
      uploadError() {
        this.$Message.error('图片上传失败')
      },
      // 上传图片处理过程
      uploadImg(req){
        let that = this
        const file = req,
          fileType = file.type,
          isImage = fileType.indexOf("image") != -1,
          isLt2M = file.size / 1024 / 1024 < 2;
        // 这⾥常规检验，看项⽬需求⽽定
        if (!isImage) {
          this.$Message.error("只能上传图⽚格式png、jpg、gif!");
          return;
        }
        if (!isLt2M) {
          this.$Message.error("只能上传图⽚⼤⼩⼩于2M");
          return;
        }

        let imageData=new FormData();
        imageData.append("images",file);
        imageData.append("userId",this.$util.getSession("user").id);
        imageData.append("tokenId",this.$util.getSession("token").id);
        this.$post(this.$api.uploadImage.UPLOAD_IMAGE,{},imageData)
          .then(res => {
            //⾃⾏处理各种情况
            const code = res && parseInt(res.code, 10);
            if (code === 200) {
              //成功
              that.handleSuccessQuill(res.body)
            } else {
              //失败
              that.uploadError()
            }
          })
          .catch((err) => {
            //异常
            this.$Message.error(err.message);
          });

        return false;
      },


    }
  }
</script>

<style lang="less">
  .vue-quill-editor {
    .quill-editor{
      line-height: normal;
      .ql-container.ql-snow{
        line-height: normal !important;
        height: 550px !important;
        font-size:14px;
      }
      .ql-snow {
        .ql-tooltip[data-mode=link]::before {
          content: "请输入链接地址:";
        }
        .ql-tooltip.ql-editing a.ql-action::after {
          border-right: 0px;
          content: '保存';
          padding-right: 0px;
        }
        .ql-tooltip[data-mode=video]::before {
          content: "请输入视频地址:";
        }
        .ql-picker.ql-size {
          .ql-picker-label[data-value="12px"]::before,
          .ql-picker-item[data-value="12px"]::before {
            content: '12px';
          }
          .ql-picker-label[data-value="14px"]::before,
          .ql-picker-item[data-value="14px"]::before {
            content: '14px';
          }
          .ql-picker-label[data-value="16px"]::before,
          .ql-picker-item[data-value="16px"]::before {
            content: '16px';
          }
          .ql-picker-label[data-value="18px"]::before,
          .ql-picker-item[data-value="18px"]::before {
            content: '18px';
          }
          .ql-picker-label[data-value="20px"]::before,
          .ql-picker-item[data-value="20px"]::before {
            content: '20px';
          }
          .ql-picker-label[data-value="24px"]::before,
          .ql-picker-item[data-value="24px"]::before {
            content: '24px';
          }
          .ql-picker-label[data-value="28px"]::before,
          .ql-picker-item[data-value="28px"]::before {
            content: '28px';
          }
          .ql-picker-label[data-value="32px"]::before,
          .ql-picker-item[data-value="32px"]::before {
            content: '32px';
          }
          .ql-picker-label[data-value="36px"]::before,
          .ql-picker-item[data-value="36px"]::before {
            content: '36px';
          }
        }
        .ql-picker.ql-header {
          .ql-picker-label::before,
          .ql-picker-item::before {
            content: '文本';
          }
          .ql-picker-label[data-value="1"]::before,
          .ql-picker-item[data-value="1"]::before {
            content: '标题1';
          }
          .ql-picker-label[data-value="2"]::before,
          .ql-picker-item[data-value="2"]::before {
            content: '标题2';
          }
          .ql-picker-label[data-value="3"]::before,
          .ql-picker-item[data-value="3"]::before {
            content: '标题3';
          }
          .ql-picker-label[data-value="4"]::before,
          .ql-picker-item[data-value="4"]::before {
            content: '标题4';
          }
          .ql-picker-label[data-value="5"]::before,
          .ql-picker-item[data-value="5"]::before {
            content: '标题5';
          }
          .ql-picker-label[data-value="6"]::before,
          .ql-picker-item[data-value="6"]::before {
            content: '标题6';
          }
        }
        .ql-picker.ql-font{
          .ql-picker-label[data-value="SimSun"]::before,
          .ql-picker-item[data-value="SimSun"]::before {
            content: "宋体";
            font-family: "SimSun" !important;
          }
          .ql-picker-label[data-value="SimHei"]::before,
          .ql-picker-item[data-value="SimHei"]::before {
            content: "黑体";
            font-family: "SimHei";
          }
          .ql-picker-label[data-value="Microsoft-YaHei"]::before,
          .ql-picker-item[data-value="Microsoft-YaHei"]::before {
            content: "微软雅黑";
            font-family: "Microsoft YaHei";
          }
          .ql-picker-label[data-value="KaiTi"]::before,
          .ql-picker-item[data-value="KaiTi"]::before {
            content: "楷体";
            font-family: "KaiTi" !important;
          }
          .ql-picker-label[data-value="FangSong"]::before,
          .ql-picker-item[data-value="FangSong"]::before {
            content: "仿宋";
            font-family: "FangSong";
          }
        }
      }
      .ql-align-center{
        text-align: center;
      }
      .ql-align-right{
        text-align: right;
      }
      .ql-align-left{
        text-align: left;
      }
    }
  }
</style>
