<template>
    <div class="upload-container">
        <el-button icon='upload' :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
        </el-button>
        <el-dialog v-model="dialogVisible">
            <el-upload
                    class="editor-slide-upload"
                    :headers="urlHeaders"
                    :action="urlAjax"
                    :multiple="true"
                    :file-list="fileList"
                    :show-file-list="true"
                    list-type="picture-card"
                    :on-remove="handleRemove"
                    :on-success="handleImageScucess">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-dialog>
    </div>
</template>
<script>
    //import { getToken } from 'api/qiniu';

    import store from 'store';
    export default {
      name: 'editorSlideUpload',
      props: {
        color: {
          type: String,
          default: '#20a0ff'
        }
      },
      data() {
        return {
          dialogVisible: false,
          urlAjax: this.$store.getters.objApi.BASE_API + '/api/file/upload',
          urlHeaders:{ 'Authorization': 'bearer ' + store.getters.token },
          list: [],
          fileList: []
        };
      },
      methods: {
        handleSubmit() {
          const arr = this.list.map(v => v.url);
          this.$emit('successCBK', arr);
          this.list = [];
          this.fileList = [];
          this.dialogVisible = false;
        },
        handleRemove(file) {
          const key = file.response.key;
          for (let i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i].key === key) {
              this.list.splice(i, 1);
              return
            }
          }
        },
        handleImageScucess(file) {
          this.list.push({ url: file.url });
        },
        beforeUpload() {
          const isLt2M = file.size / 1024 / 1024 < 2;
          let isJPG = false;
          if( file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' ){
            isJPG = true;
          }
          if (!isJPG) {
            this.$message.error('上传头像图片只能是jpg、png、gif格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
          /*const _self = this;
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              this.list.push({ key, url: response.data.qiniu_url });
              resolve(true);
            }).catch(err => {
              console.log(err);
              reject(false)
            });
          });*/
        }
      }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .upload-container {
        .editor-slide-upload {
            margin-bottom: 20px;
        }
    }
</style>
