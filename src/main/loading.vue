<template>
  <div v-if="show" class="lds-spinner">
<!--    <div class="spinner">-->
<!--      <div class="double-bounce1"></div>-->
<!--      <div class="double-bounce2"></div>-->
<!--      <div class="double-bounce3">正在加载中...</div>-->
<!--    </div>-->
    <div class="loader">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    <div class="loading-txt">正在加载中...</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'loading',
    props: {
      show: Boolean
    },
    data() {
      return {
      }
    }
  }
</script>
<style lang="less" scoped>
  .lds-spinner{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index: 999999;
  }
  .spinner {
    width: 25px;
    height: 25px;
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%);
    .double-bounce1, .double-bounce2 {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-color: #FF000F;
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;
      -webkit-animation: bounce 2.0s infinite ease-in-out;
      animation: bounce 2.0s infinite ease-in-out;
    }
    .double-bounce3 {
      width: 120px;
      height: 25px;
      position: absolute;
      top: 25px;
      left: calc(50% - 60px);
      font-size: 20px;
      color: #949c9a82;
    }
    .double-bounce2 {
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }
  }

  @-webkit-keyframes bounce {
    0%, 100% { -webkit-transform: scale(0.0) }
    50% { -webkit-transform: scale(1.0) }
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 50% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
      }
  }

  body {
    margin: 0;
  }
  .loading-txt {
    width: 150px;
    height: 25px;
    position: absolute;
    top: 40px;
    left: calc(50% - 60px);
    font-size: 22px;
    color: #949c9a82;
  }
  .loader {
    position: absolute;
    top: 50%;
    left: calc(50% + 105px);
    margin-left: 5px;
    transform: translate3d(-50%, -50%, 0);
  }
  .dot {
    width: 24px;
    height: 24px;
    background: #3ac;
    border-radius: 100%;
    display: inline-block;
    animation: slide 1s infinite;
  }
  .dot:nth-child(1) {
    animation-delay: 0.1s;
    background: #32aacc;
  }
  .dot:nth-child(2) {
    animation-delay: 0.2s;
    background: #64aacc;
  }
  .dot:nth-child(3) {
    animation-delay: 0.3s;
    background: #96aacc;
  }
  .dot:nth-child(4) {
    animation-delay: 0.4s;
    background: #c8aacc;
  }
  .dot:nth-child(5) {
    animation-delay: 0.5s;
    background: #faaacc;
  }
  @-moz-keyframes slide {
    0% {
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(2);
    }
    100% {
      transform: scale(1);
    }
  }
  @-webkit-keyframes slide {
    0% {
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(2);
    }
    100% {
      transform: scale(1);
    }
  }
  @-o-keyframes slide {
    0% {
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(2);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes slide {
    0% {
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(2);
    }
    100% {
      transform: scale(1);
    }
  }

</style>
