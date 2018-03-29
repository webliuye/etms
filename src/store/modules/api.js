const api = {
	state: {
		objApi:JSON.parse(localStorage.getItem('ObjAPI'))
	},
	mutations: {
		SET_OBJAPI: (state, value) => {
      state.objApi = value;
    }
	},
	actions: {

	}
}

export default api