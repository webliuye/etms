import { getTableList, addStand, eidtStand, addNewStand, currentStand, getDetail, addCataloguesApi, editCataloguesApi, getEditList, addStandApi, getCataloguesApi } from 'api/guides';

const guide = {
    state: {
        subject: {},
        grade: {},
        term: {},
        material: {},
        course: {},
        dirtectDetail: {}
    },
    mutations: {
        SET_DIRECT_DETAIL: (state, detail) => {
            state.dirtectDetail = detail;
        },
    },
    actions: {
        //标准目录
        getTable({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                getTableList(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 添加标准  addStandApi
        addStandard({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                addStand(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 复制标准  addStandApi
        addNewStandard({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                addNewStand(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 设置默认标准  currentStand
        setCurrentStand({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                currentStand(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        //修改标准 eidtStand
        eidtStandard({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                eidtStand(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        //获取目录详细 
        getDirectDetail({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                getDetail(listQuery).then(response => {
                    const data = response;
                    commit('SET_DIRECT_DETAIL', data);
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        //addCataloguesApi
        addCatalogues({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                addCataloguesApi(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        //addCataloguesApi
        editCatalogues({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                editCataloguesApi(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        ///getEditList
        getEdit({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                getEditList(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 添加目录  addStandApi
        addStand({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                addStandApi(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        //编辑 查询目录 getCataloguesApi
        getCatalogues({ commit }, listQuery) {
            return new Promise((resolve, reject) => {
                getCataloguesApi(listQuery).then(response => {
                    const data = response;
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        //编辑目录删除 deleteCataloguesApi
        // deleteCatalogues({ commit }, listQuery) {
        //     return new Promise((resolve, reject) => {
        //         deleteCataloguesApi(listQuery).then(response => {
        //             const data = response;
        //             resolve(data);
        //         }).catch(error => {
        //             reject(error);
        //         });
        //     });
        // },
    }
};

export default guide;