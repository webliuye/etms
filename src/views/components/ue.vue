<template>
  <div>
    <div :id="id"></div>
  </div>
</template>
<script>
  //UE编辑器
import 'static/UE/ueditor.config.js';
import 'static/UE/ueditor.all.js';
// import 'static/UE/ueditor.all.min.js';
import 'static/UE/lang/zh-cn/zh-cn.js';
import 'static/UE/ueditor.parse.min.js';
import 'static/UE/kityformula-plugin/addKityFormulaDialog.js';
import 'static/UE/kityformula-plugin/getKfContent.js';
import 'static/UE/kityformula-plugin/defaultFilterFix.js';
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      id: {
        type: String,
        default:'editor'
      }
    },
    watch: {
      defaultMsg() {
        if(this.defaultMsg){
          this.editor.setContent(this.defaultMsg);
        }else{
          this.editor.setContent(' ');
        }
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id, this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent();
      },
      getUEContentTxt() { // 获取内容方法
        return this.editor.getContentTxt();
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
<style lang="less" scoped>
    #ue{
       height: 300px;
    }
</style>
