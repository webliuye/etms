<template>
          <el-select v-model="year" @change="changeYear" placeholder="请选择">
            <el-option
              v-for="(item,index)  in guideYears"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
</template>

<script>
import { getYears } from "api/sourceIndex";
export default {
  name: "yearSelect",
  data() {
    return {
      year: "",
      guideYears: null
    };
  },
  created() {
    getYears().then(res => {
      this.guideYears = res;
    });
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month > 7) {
      this.year = year + "/" + (year + 1);
      this.changeYear();
    } else {
      this.year = year - 1 + "/" + year;
      this.changeYear();
    }
  },
  methods: {
    changeYear() {
      this.$emit("changeYear", this.year);
    }
  },
  mounted() {}
};
</script>
