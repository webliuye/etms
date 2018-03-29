import { getSourceSubject } from 'api/source';
const source = {
	state: {
		localTreeData:[],
		nodeId:'',
    expandTreeData:[],
    sourceSubject:[],
    currentSource:null
  },
  mutations: {
    SET_EXPANDTREEDATA: (state, data) => {
      state.expandTreeData = data;
    },
  	SET_LOCALTREEDATA: (state, data) => {
      state.localTreeData = data;
    },
    SET_NODEID: (state, data) => {
      state.nodeId = data;
    },
    SET_SOURCESUBJECT: (state, data) => {
      state.sourceSubject = data;
    },
    SET_CURRENTSOURCE: (state, data) => {
      state.currentSource = data;
    }
  },
  actions: {
    GetSourceSubject({ commit, state }) {
      return state.sourceSubject.length > 0 ?
      Promise.resolve(state.sourceSubject) :
      new Promise((resolve, reject) => {
        getSourceSubject().then(response => {
          commit('SET_SOURCESUBJECT', response);
          resolve(response);
        });
      });
    }
  }
}

export default source;