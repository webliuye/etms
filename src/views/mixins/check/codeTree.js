export default {
	data() {
		return {};
			
	},
	created() {
	},
	methods: {
    populate(_this, obj) {
      for (let k in _this){
        if (obj.hasOwnProperty(k)){
          _this[k] = obj[k];
        }   
      }
      return _this; 
    },
    pad(num, size) {
      let s = String(num);
      while (s.length < (size || 2)) {
          s = "0" + s;
      }
      return s;
    },
    mergeCode(opt) {
      opt = this.populate({
        edition: null,
        stage: null,
        subject: null,
        grade: null,
        term: null,
        volume: null,
        chapter: null,
        section: null
      }, opt);
      let code = '0000';
      for (let k in opt) {
        code += opt[k] ? this.pad(opt[k], 2) : '00';
      }
      return code;
    },
    filterCode(code, properties) {
      var pos = {
        //edition: 4,
        stage: 6,
        subject: 8,
        grade: 10,
        term: 12,
        volume: 14,
        chapter: 16,
        section: 18
      };
      code = (code || '00000000000000000000') && this.pad(code, 20);
      let opt = {};
      for(let k in properties){
        opt[properties[k]] = code[pos[properties[k]]] + code[pos[properties[k]]+1];
      }
      return this.mergeCode(opt);
    }
	}
}