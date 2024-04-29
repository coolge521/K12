<template>
    <div>
      <Breadcrumb>
        <BreadcrumbItem v-for="(i,index) in list" to="/" :key="index">Home</BreadcrumbItem>
      </Breadcrumb>
    </div>
</template>

<script>
  export default {
    name: "bread",
    components: {},
    data() {
      return {
        list:[]
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created() {
    },
    mounted() {
    },
  }
</script>

<style scoped>

</style>
