<template>
  <master-page title="新增校本目录">
    <form-catalog v-bind:isEdit="isEdit" ></form-catalog>
  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import formCatalog from './../components/formCatalog';
  export default {
    components: { MasterPage, formCatalog },
    data() {
      return {
        isEdit:false
      }
    }
  }
</script>