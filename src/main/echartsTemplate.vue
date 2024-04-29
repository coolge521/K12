<template>
    <div>
      <div v-if="according == true">
        <div class="myChart" :style="{width: '100%', height: '300px'}"></div>
      </div>
      <div v-else class="styleDiv">
        暂无数据
      </div>
    </div>
</template>

<script>
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require("echarts/lib/component/legend")
  require('echarts/lib/chart/pie')
    export default {
        name: "echartsTemplate",
        components: {},
        props: ['arr1','name','type'],
        data() {
            return {
              according:false,
            }
        },
        computed: {},
        watch: {
          arr1:{
            deep:true,
            handler:function(){
              // 基于准备好的dom，初始化echarts实例
              if(this.arr1.length != 0){
                this.according = true;
                this.$nextTick(()=>{
                  let myChart = echarts.init(document.getElementsByClassName('myChart')[this.type]);

                  let option = {
                    color:['#37a2da','#67e0e3','#ffdb5c','#ff9f7f','#e062ae','#ea6a6a','#97c979','#fb8d34','#feebae','#fdcf84','#48b788','#9f4ef4','#7894ea',],
                    title: {
                      text: this.name,
                      x: "center"
                    },
                    tooltip: {
                      trigger: 'item',
                      formatter: '{b} : {c} ({d}%)'
                    },
                    legend:{
                      orient: 'vertical',
                      right: 10,
                      bottom:10,
                      icon:'circle',
                      textStyle:{
                        color:"#999999",
                        fontSize:12,
                      }
                    },
                    series: [
                      {
                        name:'',
                        type: 'pie',
                        radius: ['30%', '60%'],
                        center:['50%', '50%'],
                        selectedMode: 'single',
                        data: this.arr1,
                        emphasis: {
                          itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                        },
                        label:{
                          formatter: '{d}%',
                          color:"#666666",
                        }
                      }
                    ]
                  };
                  myChart.setOption(option);

                })
              }else{
                this.according = false;
              }
            }
          }
        },
        methods: {
          echart(){

          }
        },
        created() {

        },
        mounted() {

        },
    }
</script>

<style scoped lang="less">
  .styleDiv{
    width: 100%;
    height: 300px;
    text-align: center;
    line-height: 300px;
  }
</style>
