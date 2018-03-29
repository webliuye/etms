<template>
  <p class="el-button el-button--text">
    <span>当前统计标准: &nbsp;&nbsp;{{guide.name}}</span>
    <el-select v-model="guide" @change="getGuide">
      <el-option
        v-for="(item,index)  in guideData"
        :key="index"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </p> 
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getTableList } from 'api/guides';
    export default {
        name: 'nowGuideSelect',
         data() {
            return {
              guide:'',
              guideData:null
            }
        },
        computed: {
        },
        created() {
          getTableList({'state':1}).then(res => {
            this.guideData = res;
            var len = res.length;
            this.guide = res[len-1].id;
          })
        },       
        methods: {    
          getGuide() {
            this.$emit('changeGuide', this.guide);
          }
        } 
    }
</script>
