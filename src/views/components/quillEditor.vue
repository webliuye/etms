<template> 
	<div>
		<quill-editor v-model='formData.content' :options="options" ref="newEditor" @ready="onEditorReady($event)"    ></quill-editor>  
     <el-upload 
        :file-list="fileListData"
        :action="urlAjax"
        :headers="urlHeaders"
        :on-success="upLoadSuccess"
        clearFiles 
        :before-upload="beforeAvatarUpload"
        style="display:none"
        >
          <i class="el-icon-plus" id="getFile"></i>
     </el-upload>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				fileListData:[],
				urlHeaders:'',
				urlAjax:'',
				options:{
          // modules: {
          //     toolbar: [
          //           ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          //           ['blockquote', 'code-block'],

          //           [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          //           [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          //           [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          //           [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          //           [{ 'direction': 'rtl' }],                         // text direction

          //           [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          //           [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          //           [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          //           [{ 'font': [] }],
          //           [{ 'align': [] }],

          //           ['clean']  ,
          //           ['image']
          //     ]   
          //   },
        },
			};
		}
	}
</script>