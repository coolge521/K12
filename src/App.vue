<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    },

  },
  mounted() {

  }
}
</script>


<style lang="less">
  @deep: ~'>>>';
  html, body, #app {
    height: 100%;
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  }
  .ivu-spin-fix {
    background-color: rgba(255, 255, 255, 0.4)!important;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite!important;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px!important;
    position: relative!important;
    border: 1px solid #eee!important;
  }
  .layout-logo{
    width: 300px!important;
  }
  .layout-logo-img{
    width: auto!important;
    height: 50px!important;
  }
  /*#app {*/
  /*!*font-family: 'Avenir', Helvetica, Arial, sans-serif;*!*/
  /*!*-webkit-font-smoothing: antialiased;*!*/
  /*!*-moz-osx-font-smoothing: grayscale;*!*/
  /*!*!*text-align: center;*!*!*/
  /*!*color: #2c3e50;*!*/
  /*!*!*margin-top: 60px;*!*!*/
  /*width: 100%;*/
  /*height: 100%;*/
  /*}*/

  @font-face {
    font-family: 'NormalFont';
    src: url('./libs/ttf/SourceHanSansCN-Light.otf');
  }
  .v-cloak{
    overflow-y: hidden;
  }

  /**
  统一列表样式，需要修改样式在自己页面重写样式即可
   */
  .ivu-table{
    background: #ffffff;
    color: #869dae;
    height: auto!important;
    overflow: auto!important;
    @media screen and (max-height: 1800px) and (orientation: landscape){
      height: 85vh!important;
    }
    @media screen and (max-height: 1200px) and (orientation: landscape){
      height: 78vh!important;
    }
    @media screen and (max-height: 1080px) and (orientation: landscape){
      height: 77vh!important;
    }
    @media screen and (max-height: 1024px) and (orientation: landscape){
      height: 76vh!important;
    }
    @media screen and (max-height: 900px) and (orientation: landscape){
      height: 72vh!important;
    }
    @media screen and (max-height: 768px) and (orientation: landscape){
      height: 68vh!important;
    }
  }
  .ivu-page{
    width: calc(100% - 40px);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    bottom: 30px;
    padding-right: 30px;
    background:transparent;

  }
  .ivu-table-overflowX{
    overflow-x: visible!important;
  }
  .ivu-table:before{
    height: 0px;
  }
  .ivu-table-border:after{
    height: 0px;
  }
  .ivu-table td,.ivu-table th{
    background: transparent!important;
    //border: none!important;
    font-size: 13px!important;
    //font-weight: bold;
    color: rgb(133,133,133)!important;
    border-bottom: 1px dashed #e9eaec!important;
    border-left: 0px solid #e9eaec!important;
  }
  .ivu-table-header{
    overflow: visible!important;
  }
  .ivu-table-header th{
    background-color: rgb(250,250,250)!important;
    //border: none!important;
    font-size: 14px;
    font-weight: bold;
    color: rgb(86,86,86)!important;
    border-top: 1px dashed #e9eaec!important;
  }
  .ivu-table-wrapper{
    overflow: hidden;
  }
  .ivu-table-wrapper-with-border{
    border: none!important;
    //border: 1px solid #dcdee2!important;
    //border-bottom: 1px solid #dcdee2!important;
    //border-right: 1px solid #dcdee2!important;
  }
  .ivu-table-row{
    height: 40px!important;
  }
  .ivu-table-row:hover{
    background-color: #dcdee2!important;
  }
  /*.ivu-table-stripe .ivu-table-body tr:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td{*/
  /*  background-color: #eeeeee!important;*/
  /*}*/

  .ivu-page-total {
    color: #8098ad!important;
  }
  .ivu-page-next {
    background-color: transparent;
    border: 1px solid #8098ad!important;
  }
  .ivu-page-prev {
    background-color: transparent;
    border: 1px solid #8098ad!important;
  }
  .ivu-page-item {
    border-radius: 3px!important;
    border: 1px solid #8098ad!important;
    background: transparent;
    margin: 0px 5px!important;
  }
  .ivu-page-item a{
    color: #8098ad!important;
  }
  .ivu-page-item-active {
    border-color: #3862CF!important;
    background: #3862CF!important;
  }
  .ivu-page-item-active a{
    color: #fff!important;
  }
  div[title^='repair-tag']{
    border: 1px solid #dcdee2!important;margin-top: 5px!important;
    >span{font-size: 12px!important;color:#858585!important;}
  }

  .ivu-btn-primary {
    color: #fff!important;
    background-color: #3862CF!important;
    border-color: #3862CF!important;
  }
  .ivu-switch-checked{
    border-color: #3862CF!important;
    background-color: #3862CF!important;
  }
  .ivu-radio-checked .ivu-radio-inner {
    border-color: #3862CF!important;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: #3862CF!important;
    background-color: #3862CF!important;
  }
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #3862CF!important;
    background: #DBEAFF!important;
  }
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after{
    background: #3862CF!important;
  }
  .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #3862CF!important;
  }
  .ivu-tabs-ink-bar {
    background-color: #3862CF!important;
  }

  .ivu-modal-confirm-footer {
    text-align: center!important;
  }

  /**
  modal中table和分页公共样式，modal中需要指定列表高度的需要在自己页面重写改样式
   */
  .ivu-modal{
    max-width: 80%!important;
    top:10% !important;
    .ivu-modal-body {
      min-height: 10vh!important;
      max-height: 70vh!important;
      overflow-y: auto!important;
      .ivu-table{
        height: auto!important;
      }
      .ivu-table-row{
        border-bottom: 1px solid #eeeeee!important;
      }
      .ivu-page{
        width: 95%!important;
        position: static!important;
        margin-top: 20px!important;
      }
    }
  }
  ::-webkit-scrollbar{
    -webkit-appearance:none!important;
    width:8px!important;height: 8px!important;
  }
  ::-webkit-scrollbar-thumb { border-radius: 5px!important; background-color: #ccd5de!important; }
</style>
