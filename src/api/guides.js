import { fetch } from 'utils/fetch';

//目录标准列表
export function getTableList(query) {
  return fetch({
    url: '/api/guides',
    method: 'get',
    params: query
  });
}
//编辑目录标准列表
export function getEditList(query) {
  return fetch({
    url: '/api/guides/'+ query.guidesId +'/catalogues',
    method: 'get',
    params: query
  });
}

//获取目录的详细
export function getDetail(query) {
  return fetch({
    url: '/api/catalogues/'+ query.id,
    method: 'get'
  });
}

//获取目录的详细
export function addStand(query) {
  return fetch({    
    url: '/api/guides',
    method: 'POST',    
    data: query
  });
}

//编辑目录名称
export function eidtStand(query) {
  return fetch({    
    url: '/api/guides/' + query.id ,
    method: 'PATCH',    
    data: query
  });
}

//编辑目录名称
export function addNewStand(query) {
  return fetch({    
    url: "/api/guides/"+ query.id +"/copies",
    method: 'POST',    
    data: query
  });
}


//设置当前标准
export function currentStand(query) {
  return fetch({    
    url: "/api/guides/"+ query.id+"/active",
    method: 'PATCH'
  });
}

//编辑目录

export function getCataloguesApi(query) {
  return fetch({    
    url: "/api/guides/"+ query.id +"/catalogues",
    method: 'get',
    params:query
  });
}

//新增目录
export function addCataloguesApi(query) {
  return fetch({    
    url: "/api/guides/"+ query.id +"/catalogues",
    method: 'POST',
    data:query.data
  });
}

//修改目录
export function editCataloguesApi(query) {
  return fetch({    
    url: "/api/catalogues/"+query.id,
    method: 'PATCH',    
    data: query
  });
}


//目录加入标准

export function addStandApi(query) {
  return fetch({    
    url: "/api/guides/"+query.guidesId+"/catalogues/batch-create",
    method: 'POST',
    data: {ids: query.ids}
  });
}


export function downloadExcel(query) {
  return fetch({    
    url: "/api/proxy/download",
    method: 'get',
    params:query
  });
}

//获取目录标准空白页版本
export function getGuidesVersion() {
  return fetch({    
    url: "/api/guides/get-standard",
    method: 'get'
  });
}

//传递目录标准版本数据
export function postGuidesVersion(data) {
  return fetch({    
    url: "/api/guides/rscatalogue",
    method: 'post',
    data:data
  });
}

//获取标准是否允许下级单位删除
export function getSwitchVersion() {
  return fetch({    
    url: "/api/guides/removable",
    method: 'get'
  });
}

//修改标准是否允许下级单位删除
export function changeSwitchVersion(data) {
  return fetch({    
    url: "/api/guides/removable/" + data,
    method: 'put'
  });
}

//发布目录标准
export function publishVersion(data) {
  return fetch({    
    url: "/api/guides/release",
    method: 'post',
    params:data
  });
}

//查询标准目录下面的树节点 
export function getGuideNode(data) {
  return fetch({    
    url: "/api/guides/guidenode",
    method: 'post',
    params:data
  });
}

//查询主题下面的标准目录 
export function getTitleGuide(data) {
  return fetch({    
    url: "/api/catalogues/themecatalogues",
    method: 'get',
    params:data
  });
}



//新增目录
export function addGuidesItems(data) {
  return fetch({    
    url: "/api/catalogues",
    method: 'post',
    data:data
  });
}


//根据ID查询目录信息
export function getGuidesItemsInfo(data) {
  return fetch({    
    url: "/api/catalogues/select-catalogue",
    method: 'get',
    params:data
  });
}

//根据ID查询目录信息
export function getGuidesItemsInfoDetal(data) {
  return fetch({    
    url: "/api/catalogues/select-cataloguedetail",
    method: 'get',
    params:data
  });
}

//修改目录信息-本级
export function reviseMineGuidesItems(data) {
  return fetch({    
    url: "/api/catalogues/" + data.id,
    method: 'put',
    data:data
  });
}


//修改目录信息-非本级
export function reviseTheirGuidesItems(data) {
  return fetch({    
    url: "/api/catalogues/update-noncatalogue",
    method: 'post',
    data:data
  });
}

//查询当前单位是否是部署节点
export function getGuidesNode(data) {
  return fetch({    
    url: "api/guides/unitnode",
    method: 'get'
  });
}

//删除目录实验
export function deleteGuidesItem(query) {
  return fetch({    
    url: "/api/catalogues/delete-catalogues",
    method: 'POST',
    data:query
  });
}


//获取版本
export function getVersion() {
  return fetch({    
    url: "/api/editionSetting",
    method: 'get'
  });
}

//设置版本
export function setVersion(data) {
  return fetch({    
    url: "/api/editionSetting",
    method: 'put',
    data:data
  });
}


//获取树结构
export function getVolumesOfTree(data) {
  return fetch({    
    url: "/api/guides/volumes",
    method: 'get',
    params:data
  });
}


//获取表格
export function getCatalogueTable(data) {
  return fetch({    
    url: "/api/catalogues",
    method: 'get',
    params:data
  });
}


//获取实验详情
export function getCatalogueDetail(data) {
  return fetch({    
    url: "/api/catalogues/" + data.id,
    method: 'get'
  });
}

//获取发布状态
export function getEditionPublish() {
  return fetch({    
    url: "/api/editionSetting/publish",
    method: 'get'
  });
}

//改变发布状态
export function putEditionPublish(data) {
  return fetch({    
    url: "/api/editionSetting/publish/" + data.status,
    method: 'put'
  });
}