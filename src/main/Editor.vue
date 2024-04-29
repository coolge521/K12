<template>
    <div>
      <div class="tinymce-editor">
        <EditorDemon
          v-model="myValueE"
          :init="init">
        </EditorDemon>
      </div>
    </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import EditorDemon from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'

    export default {
        name: "Editor",
        components: {
          EditorDemon,
        },
        props: ['myValue'],
        data() {
            return {
              init: {
                language_url: 'static/tinymce/langs/zh_CN.js',//语言包的路径
                language: 'zh_CN',//语言
                skin_url: 'static/tinymce/skins/ui/oxide',// skin路径
                // skin_url: '/static/tinymce/skins/ui/oxide',//暗色系
                height: 300,
                forced_root_block:'',
                branding: false,//是否禁用“Powered by TinyMCE”
                menubar: false,//顶部菜单栏显示
              },
              myValueE:this.myValue,
            }
        },
        computed: {},
        watch: {
          myValue(){
            this.myValueE = this.myValue
          },
          myValueE(){
            this.$emit('onChange',this.myValueE.replace(/<[^>]+>/g, ""))
          },
        },
        methods: {
          onChange () {

          },
        },
        created() {

        },
        mounted() {
        },
    }
</script>

<style scoped lang="less">

</style>
