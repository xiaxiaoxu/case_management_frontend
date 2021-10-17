<template>
  <div>
    <ReportList v-if="listStatus" @reportDetail="reportDetail"></ReportList>
    <ReportDetail v-if="detailStatus" @reportList="reportList" :reportId="reportId"></ReportDetail>
  </div>
</template>

<script>
  import ReportList from './List'
  import ReportDetail from './Detail'
  export default {
    data () {
      return {
        listStatus: true,
        detailStatus: false,
        reportId: 0
      }
    },
    components: {
      ReportList,
      ReportDetail
    },
    methods: {
      reportDetail (data) {
        this.reportId = data.id
        this.listStatus = false
        this.detailStatus = true
      },
      reportList () {
        this.listStatus = true
        this.detailStatus = false
      }
    }
  }
</script>
