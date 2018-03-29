<template>
  <master-page title="任课管理">
      <div>
        <ClassManage></ClassManage>
      </div>
  </master-page>
</template>

<script>
    import MasterPage from 'views/layout/MasterPage';
    import ClassManage from "views/school/classManage/components/classManage";
    export default {
      name: 'classManage',
      components: { MasterPage, ClassManage},
      data() {
        return {
        };
      },
      created() {
      },
      methods: {
      }
      
    }
</script>

