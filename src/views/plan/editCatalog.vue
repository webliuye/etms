<template>
  <master-page title="编辑目录">
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
        isEdit:true
      }
    }
  }
</script>
