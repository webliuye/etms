import { gettwoThemeTree, getoneSectionTree, gettwoSectionTree, getListTree, addSource, getSourceDetail, getThemeGuide, getLocalSourceId } from 'api/source';
import { addTestProblem, getTestInfo, reviseTestInfo } from 'api/test';
export default {
	data() {
		return {
			formData:{
        standardAnswer:'',
        standardAnswerArray:[],
        questionScore:0,
        questionType:'singleSelect',
        analysis:'',
        content:'',
        contentObj:{
          stem:'',
          stemContent:'',
          items:[
            {value:''},
            {value:''},
            {value:''},
            {value:''}
          ]
        },
        name:'',
        level:0,
        url:'',
        intro:'',
        tag:'',
        tagArray:[],
        tags:'',
        id:''
      },
      inputVisible: false,
      isEdit:false,
      letters:['A','B','C','D','E','F','G','H'],
			showHighSelect:true,
				config: {
        initialFrameWidth: null,
        initialFrameHeight: 80,
        elementPathEnabled : false,　
        toolbars: [[
		        'fullscreen', 'source', '|',
		        'bold', 'italic', 'underline','forecolor', '|','formatmatch', 'fontsize', '|', 'insertimage','kityformula', 'preview'
		    ]]
      },
			loading:true,
      rules: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        intro:[
          { required: true,  message: '请输入资源简介',trigger: 'blur' }
        ],
        catalogueId:[
          { required: true,trigger: 'blur', message: '请选择版本目录' }
        ],
        url:[
          { required: true,trigger: 'blur',message: '请填写资源地址'}
        ]
      }
		};
	},
	created() {
		var vm = this;
    this.formData.questionType = this.$route.params.type;
	},
	methods: {
		getUEContent() {
      var reg = new RegExp("<p><br/></p>","g"); 
      this.formData.contentObj.stem = this.$refs.stem.getUEContent().replace(reg,'');
      this.formData.contentObj.stemContent = this.$refs.stem.getUEContentTxt();
      this.formData.analysis = this.$refs.analysis.getUEContent().replace(reg,'');
      for(let i = 0; i < this.formData.contentObj.items.length; i++){
        let val = 'item' + this.letters[i];
        var trims = this.$refs[val][0].getUEContentTxt();
        if(!trims.trim()){
          return true;
        }
        this.formData.contentObj.items[i].value = this.$refs[val][0].getUEContent().replace(reg,'');
      }
      return false;
    },
    deleteItem(index) {
      if(this.formData.contentObj.items.length < 3){
        this.$message({
          message: '不能少于两个选项',
          type: 'warning'
        });
        return
      }else{
        this.formData.contentObj.items.splice(index,1);
      }
    },
    addItems() {
      if(this.formData.contentObj.items.length > 7){
        this.$message({
          message: '不能多于八个选项',
          type: 'warning'
        });
        return;
      }else{
        this.formData.contentObj.items.push({
          value:''
        });
      }
    },
    handleClose(tag) {   //标签
      this.formData.tagArray.splice(this.formData.tagArray.indexOf(tag), 1);
    },
    handleInputConfirm() {
      let inputValue = this.formData.tags;
      if(this.formData.tagArray && this.formData.tagArray.length > 9){
        this.$message({
          message: '最多只能添加10个标签',
          type: 'warning'
        });
        this.inputVisible = false;
        this.formData.tags = '';
        return;
      }
      if (inputValue) {
        this.formData.tagArray.push(inputValue);
      }
      this.inputVisible = false;
      this.formData.tags = '';
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    cancel() {
      this.$router.push({ name: 'QuestionBank' });
    },
    resetForm() {
      //this.$refs['formData'].resetFields();
      this.formData.tagArray = [];
      this.formData.tag = '';
      this.formData.tags = '';
      this.formData.level = 0;
      this.formData.standardAnswer = '';
      this.formData.standardAnswerArray = [];
      this.formData.questionScore = 0;
      this.formData.analysis = '';
      this.formData.contentObj.stem = '';
      this.formData.contentObj.items.forEach(function(item){
        item.value = '';
      });
    }
	}
}

