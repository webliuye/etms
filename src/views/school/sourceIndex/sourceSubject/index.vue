<template>
	<div class="search-select source-subject" style="width:100%; padding: 0;">
		<el-radio-group v-model="subjectId" @change="changeSubject" style="width:100%;">
	    <el-radio-button label="0"  >
				<span @click="goIndex">首页</span>
			</el-radio-button>
	    <el-radio-button v-for="(item,index)  in sourceSubject" :key="index" :label="item.textbookCode">{{item.nodeName}}</el-radio-button>
	  </el-radio-group>
	</div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import {getInnerSourceSubject} from 'api/source'
	export default {
		name: 'sourceSubject',
		props:{
			subject: {
					type: String,
					default:'0'
				}
		},
		data () {
			return {
				sourceName:''	,
        subjectId:'0',
        sourceSubject:[]
			};
		},
		computed: {
    },
		created() {
      var objTemp = this.$store.state.user.userInfo.orgType=='225'? {groups:'subject',onlyPublic:true,allStage:true} :{groups:'subject'};
      if(objTemp){
        getInnerSourceSubject(objTemp).then(res=>{
            this.sourceSubject=res;
        })
      }
			if(this.subject){
				this.subjectId=this.subject;
			}
		},
		methods: {
			changeSubject() {
					this.$store.commit('SET_SOURCESUBJECTID',this.subjectId);
			  	this.$emit('changeSubject', this.subjectId);
			},
			goIndex(){
				// if(this.$route.path.slice(0,4)=='/src'){
				// 	this.$router.push({path:'/srcIndex',params:{
				// 		subjectId:0
				// 	}});
				// }
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="less" scoped>

</style>
