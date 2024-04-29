<template>
    <div>
<!--      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">-->
<!--        <Checkbox-->
<!--          :indeterminate="indeterminate"-->
<!--          :value="checkAll"-->
<!--          @click.prevent.native="checkboxAll(item)">全选</Checkbox>-->
<!--      </div>-->
      <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange($event,item)">
        <Checkbox
          v-for="(u,index) in item.projectList"
          :label="u.id"
          :key="u.id">
          {{u.name}}
        </Checkbox>
      </CheckboxGroup>
    </div>
</template>

<script>

    export default {
        name: "checkAll",
        components: {},
        props: ['item','checkAllGroup'],
        data() {
            return {
              indeterminate: false,
              checkAll: false,
            }
        },
        computed: {},
        watch: {
          'item': { // 这是一个数组
            immediate: true, // immediate选项可以开启首次赋值监听
            handler(newVal, oldVal) {
              // for (let i = 0; i < newVal.projectList.length; i++) {
              //   if(this.checkAllGroup.indexOf(newVal.projectList[i].id) == -1){
              //     this.indeterminate = false
              //     this.checkAll = false
              //   }else if(this.checkAllGroup.indexOf(newVal.projectList[i].id) > -1){
              //     this.indeterminate = true
              //     this.checkAll = false
              //   }else if(this.checkAllGroup.length == this.item.projectList.length){
              //     this.indeterminate = false
              //     this.checkAll = true
              //   }
              // }
            }
          }
        },
        methods: {
          // checkboxAll (i) {
          //   this.$emit('checkboxAll',i)
          // },
          // checkAllGroupChange (data,i) {
          //   this.$emit('checkAllGroupChange',data,i)
          // },
          checkboxAll (i) {
            if (this.indeterminate) {
              this.checkAll = false;
            } else {
              this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
              this.checkAllGroup = i.projectList.map(function(value){return value.id;});
              this.premisesId = this.checkAllGroup
            } else {
              this.checkAllGroup = [];
            }
          },
          checkAllGroupChange (data,i) {
            this.premisesId = data
            if (data.length === i.projectList.length) {
              this.indeterminate = false;
              this.checkAll = true;
            } else if (data.length > 0) {
              this.indeterminate = true;
              this.checkAll = false;
            } else {
              this.indeterminate = false;
              this.checkAll = false;
            }
          },
        },
        created() {

        },
        mounted() {

        },
    }
</script>

<style scoped lang="less">
    @deep: ~'>>>';
    @{deep}.ivu-card-body {
        padding: 10px !important;
    }
</style>
