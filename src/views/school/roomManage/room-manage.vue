<template>
  <master-page title="教室管理">
    <div>
      <RoomManage></RoomManage>
    </div>
  </master-page>
</template>

<script>
    import MasterPage from 'views/layout/MasterPage';
    import RoomManage from "views/school/roomManage/components/roomManage";
    export default {
      name: 'roomManage',
      components: { MasterPage, RoomManage},
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

