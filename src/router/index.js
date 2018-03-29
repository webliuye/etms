import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import Layout1 from '../views/layout/Layout1';
import Login from '../views/login/'
import authRedirect from '../views/login/authredirect';


/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/

Vue.use(Router);
const routes= [
    { path: '/login', component: Login, hidden: true },
    {path:"/visual",component:_import('visualMap/index'),hidden:true},
    { //资源首页
        path: '/srcIndex',
        component: Layout1,
        children: [
            { path: '', component: _import('sourceIndex/sourceIndex'), name: 'SourceIndex' },
            { path: '/src/sourcePreview/:id', component: _import('sourceIndex/srCount/sourcePre'), name: 'SourcePre', meta: { nav: '资源详情' } },
            { path: '/src/noticeDetail/:id', component: _import('sourceIndex/srCount/noticeDetail'), name: 'NDetail', meta: { nav: '公告详情' } },
            { path: '/src/searchSource/:sourceName', component: _import('sourceIndex/srCount/searchSource'), name:'SearchSrc', meta: { nav: '资源搜索' } }, //资源搜索页面
            { path: '/src/srcRank', component: _import('sourceIndex/srCount/rank/rank'), name:'SrcRank', meta: { nav: '开出排行' } }, //开出排行
            { path: '/src/srcPlan', component: _import('sourceIndex/srCount/testPlan/index'), name:'SrcPlan', meta: { nav: '目录标准管理' } }, //实验目录
            {
                path: '/src/srcRecord',
                meta: { nav: '实验开出记录' } ,
                name: 'SrcRecord',
                component: _import('sourceIndex/srCount/srcRecord/index'),
            },
            { path: '/src/srcRecord/srcRecordDetail/:id', component: _import('sourceIndex/srCount/srcRecord/detail'), name: 'SrcRecordDetail', meta: { nav: '实验详情',scrollToTop: true } },

            {
                path: '/src/srcRankWarn',
                meta: { nav: '实验开出预警' },
                component: _import('sourceIndex/srCount/rankWarn/index'), name: 'SrcRankWarn'},
             { path: '/src/srcRankWarn/srcRankWarnDetail/:id/:name', component:_import('sourceIndex/srCount/rankWarn/detail'), name: 'ConSchool', meta: { nav: '学校开出情况' } },
        ]
    },


    {
        path: '/',
        component: Layout,
        redirect: '/index',
        name: '首页',
        hidden: true,
        children: [
            { path: 'index', component:  _import('dashboard/index') },
            // { path: 'booking', component: booking, name:'我的预约' },
            // { path: 'booking/addBooking', component: addBooking },
            // { path: 'addBooking/preview/:id', component: bookingPreview, name: 'addBookingPreview', meta: { nav: '实验预览' }},
            { path: 'longLat', component: _import('visualMap/setLongLat'), name: 'LongLat', meta: { nav: '经纬度设置' } }, //经纬度设置

            { path: 'dashClassInfo/:planId', component: _import('dashboard/default/classInfo'), name: 'DashClassInfo', meta: { nav: '班级完成度' } }, //教室管理
            { path: 'roomManage', component:_import('school/roomManage/room-manage'), meta: { nav: '教室管理' } }, //教室管理
            { path: 'schoolClassManage', component: _import('school/classManage/manageClassIndex'), name:'SchoolClassManage', meta: { nav: '任课管理' } }, //教室管理

            { path: 'teacherManage', component: _import('school/teacherManage/teacher-manage'), meta: { nav: '教师管理' } }, //教师管理
            // { path: 'fof',name:'Fof', component: _import('error/404'), meta: { nav: '系统报错' } }, //教师管理
            // { path: 'pdfPreview', component: pdfPreview, meta: { nav: 'PDF管理' } }, //PDF管理
            { path: 'classManage', component: _import('school/classManage/class-manage'), meta: { nav: '班级管理' } }, //班级管理
            { path: 'myInformation', component: _import('school/myInformation/my-information'), name: 'MyInformation', meta: { nav: '个人信息' } }, //个人信息
            { path: 'funcCount', component: _import('school/funcCount/func-count'), meta: { nav: '功能室使用统计' } }, //功能室使用统计
            { path: 'sourceCount', component: _import('admin/sourceCount/index'), meta: { nav: '资源使用统计' } }, //资源使用统计
            { path: 'sourceIndex', component: _import('school/sourceIndex/sourceInx'), name:'srcIndex', meta: { nav: '资源首页' } }, //资源推荐
            { path: 'searchSource/:sourceName', component: _import('sourceIndex/srCount/searchSource'), name:'SearchSource', meta: { nav: '资源搜索' } }, //资源推荐
            { path: 'sourceRecommend', component:_import('admin/sourceRecommend/index'), name:'SourceRecommend', meta: { nav: '资源推荐' } }, //资源推荐
            { path: 'funcRoom', component: _import('school/funcRoom/func-room'), meta: { nav: '功能室使用' } }, //功能室预约
            { path: 'staffCount', component: _import('school/staffCount/staff-count'), meta: { nav: '教师开出情况' } }, //教师开出情况
            { path: 'openCount', component: _import('school/openCount/open-count'), name: '实验开出记录', meta: { nav: '实验开出统计' } }, //学校实验开出统计
            { path: 'index/add/:courseId/:isEdit', component: _import('school/log/add'), name: 'LogAdd', meta: { nav: '日志登记' } },
            { path: 'index/addIndex/:planDetailId/:isEdit', component:  _import('school/log/index'), name: 'LogAddIndex', meta: { nav: '日志登记' } },
            { path: 'index/bookingInfo/:id', component: _import('school/booking/bookingInfo'), name: 'BookingInfo', meta: { nav: '预约信息' } },
            { path: 'index/bookingSuccess', component: _import('school/booking/bookingSuccess'), name: 'BookingSuccess', meta: { nav: '预约成功' } },
            { path: 'index/revisebookingInfo/:id', component: _import('school/booking/revisebookingInfo'), name: 'RevisebookingInfo', meta: { nav: '修改信息' } },
            { path: 'index/arrangeInfo/:courseId', component: _import('school/arrange/reviseArrangeDetail'), name: 'ArrangeInfo', meta: { nav: '安排信息' } },
            // { path: 'openRecord', component: openRecord, meta: { nav: '实验开出记录' }},   //管理端教室统计

            { path: 'rank', component: _import('admin/rank/rank'), name: 'rank', meta: { nav: '实验开出率排行' } }, //管理端学校开出情况
            // { path: 'record', component: recordView, meta: { nav: '实验记录' } },   //实验记录

            // { path: 'rankCount', component: rankCount, name: 'RankCount', meta: { nav: '学校开出率统计' } }, //学校开出率统计
            // { path: 'rankCount/rankSchoolDetail/:id', component: rankSchoolDetail, name: 'RankSchoolDetail', meta: { nav: '学校开出率年级统计详情' } }, //学校开出率统计
            { path: 'subjectCount', component: _import('admin/subjectCount/subjectCount'), name: 'SubjectCount', meta: { nav: '开出率按科目统计' } }, //开出率按科目统计
            { path: 'guideCount', component: _import('admin/guideCount/guideCount'), name: 'GuideCount', meta: { nav: '按实验目录统计' } }, //按实验目录统计
            { path: 'gradeCount', component: _import('admin/gradeCount/gradeCount'), name: 'GradeCount', meta: { nav: '按学段统计' } }, //按学段统计

            { path: 'equipment', component: _import('school/equipment/equipment'), name: 'equipment', meta: { nav: '器材使用统计' } }, //仪器使用统计
            { path: 'equipmentGuide', component: _import('admin/equipment/equipment-guide'), name: 'equipmentGuide', meta: { nav: '器材使用统计' } }, //仪器使用统计
            //考核路由
            { path: 'checkIndex', component: _import('school/check/index'), name: 'CheckIndex', meta: { nav: '实验考核' } },
            { path: 'checkIndex/exercise/:id', component: _import('school/check/exercise'), name: 'Exercise', meta: { nav: '开始做题' } },
            { path: 'checkIndex/exercise/:id', component: _import('school/check/exercise'), name: 'ConExercise', meta: { nav: '继续做题' } },
            { path: 'checkIndex/testResult/:id', component:_import('school/check/testResult'), name: 'TestResult', meta: { nav: '测试结果' } },
            { path: 'checkIndex/handExams/:id', component: _import('school/check/handExams'), name: 'HandExams', meta: { nav: '全部解析' } },
            { path: 'checkSheet', component: _import('admin/check/checkSheet'), name: 'CheckSheet', meta: { nav: '考核报表' } },
            { path: 'errBook', component: _import('school/check/errBook'), name: 'ErrBook', meta: { nav: '错题本' } },
            { path: 'learningRecord', component: _import('school/check/learningRecord'), name: 'LearningRecord', meta: { nav: '学习记录' } },
            { path: 'historySave', component: _import('historySave/historySave'), name: 'HistorySave', meta: { nav: '历史存档' } },
            { path: 'cityMap', component: _import('visualMap/cityMap'), name: 'CityMap', meta: { nav: '城市图表' } },
            { path: 'districtMap', component: _import('visualMap/district'), name: 'districtMap', meta: { nav: '县级图表' } },
        ]
    },
    { //实验开出预警
        path: '/rankWarn',
        component: Layout,
        meta: { nav: '实验开出预警' },
        children: [
            { path: '', component: _import('admin/rankWarn/rankWarn'), name: 'RankWarn' },
            { path: 'detail/:id/:name', component: _import('admin/condit/condit-school'), name: 'ConditSchool', meta: { nav: '学校开出情况'},
            }
        ]
    },
    { //实验开出情况
        path: '/condit/rankCount',
        component: Layout,
        meta: { nav: '学校开出率统计' },
        children: [
            { path: '', component: _import('admin/condit/condit'), name: 'RankCount' },
            { path: 'rankSchoolDetail', component: _import('components/commonRouter'), meta: { nav: '学校开出率年级统计详情', paramName: 'RankSchoolDetail', paramKey: ['id']},
              children: [
                { path: 'rankSchoolDetail/:id', component: _import('admin/rankCount/rankSchoolDetail'), name: 'RankSchoolDetail'},
                { path: 'rankSubjectDetail/:id', component: _import('admin/rankCount/rankSubjectDetail'), name: 'RankSubjectDetail', meta: { nav: '班级详情' } }
              ]
             },

        ]
    },
    { //实验开出情况
        path: '/condit',
        component: Layout,
        meta: { nav: '实验开出统计' },
        children: [
            { path: '', component: _import('admin/condit/condit'), name: 'condit' },
            { path: 'guide', component: _import('components/commonRouter'), meta: { nav: '目录开出学校统计', paramName: 'GuideTwoCount', paramKey: ['id']},
              children: [
                { path: 'guide/:id', component: _import('admin/guideCount/guideTwoCount'), name: 'GuideTwoCount'},
                { path: 'guide/:id/:unitId', component: _import('admin/guideCount/guideThreeCount'), name: 'GuideThreeCount', meta: { nav: '目录开出统计' } }
              ]
             },

        ]
    },
    { //学校端标准目录
        path: '/guide1',
        component: Layout,
        meta: { nav: '目录标准查看' },
        children: [
            { path: '', component: _import('guides/view'), name: 'GuidesView' },
            { path: 'preview/:planId', component: _import('guides/guide-item-preview'), name: 'Guide1Preview', meta: { nav: '目录预览' } },
        ]
    },
    { //实验开出记录
        path: '/record',
        component: Layout,
        meta: { nav: '实验开出记录' },
        children: [
            { path: '', component: _import('school/record/index'), name: 'RecordView' },
            { path: 'detail/:id', component: _import('school/record/detail'), name: 'RecordViewDetail', meta: { nav: '日志详情' } },
        ]
    },
    { //管理端教室统计
        path: '/roomCount',
        component: Layout,
        meta: { nav: '功能室使用统计' },
        children: [
            { path: '', component: _import('admin/roomCount/room-count') },
            { path: 'roomDetail/:roomType/:learningType', name: 'roomDetail', component: _import('admin/roomCount/room-detail'), meta: { nav: '统计详情' } },
        ]
    },
    {
        path: '/openRecord',
        component: Layout,
        redirect: 'openRecord',
        meta: { nav: '实验开出记录' },
        children: [
            { path: '', component: _import('admin/openRecord/open-record') },
            { path: 'detail/:id', component: _import('admin/openRecord/detail'), name: 'OpenRecordDetail', meta: { nav: '实验详情' } }
        ]
    },
    {
        path: '/booking',
        component: Layout,
        redirect: 'booking',
        meta: { nav: '我的预约' },
        icon: 'zonghe',
        children: [
            { path: '', component: _import('school/booking/booking'), name: 'Booking' },
            // { path: 'addBooking', component: addBooking, name: 'AddBooking', meta: { nav: '新增预约'}},
            {
                path: 'addBooking',
                component: _import('components/commonRouter'),
                meta: { nav: '新增预约', paramName: 'addBooking' },
                children: [
                    { path: '', component: _import('school/booking/add-booking'), name: 'AddBooking' },
                    { path: 'preview/:id', component: _import('school/booking/bookingPreview'), name: 'addBookingPreview', meta: { nav: '实验预览' } }
                ]
            },
            { path: 'preview/:id', component: _import('school/booking/bookingPreview'), name: 'bookingPreview', meta: { nav: '实验预览' } }

        ]
    },
    {
        path: '/guides',
        component: Layout,
        meta: { nav: '目录标准管理' },
        children: [
            { path: '', component: _import('guides/index'), name: 'Guides' },
            { path: 'version', component: _import('guides/index-version'), name: 'GuidesVersion' },
            {
                path: 'preview/:id/:stageId/:subjectId/:gradeId/:editionId',
                component: _import('components/commonRouter'),
                meta: { nav: '实验目录', paramName: 'GuidesPreview', paramKey: ['id'] },
                children: [
                    { path: '', component: _import('guides/preview'), name: 'GuidesPreview' },
                    { path: 'item/Preview/:planId', component: _import('guides/guide-item-preview'), name: 'GuidesPreviewItem', meta: { nav: '目录预览' } }
                ]
            },
            {
                path: 'edit/:id/:stageId/:subjectId/:gradeId/:editionId',
                component: _import('components/commonRouter'),
                meta: { nav: '编辑标准', paramName: 'GuidesEdit', paramKey: ['id'] },
                children: [
                    { path: '', name: 'GuidesEdit', component: _import('guides/edit')},
                    { path: 'item/add/:isEdit/:twothemeId', component: _import('guides/add'), name: 'GuidesAdd', meta: { nav: '新增目录' } },
                    { path: 'item/edit/:isEdit/:guideId', component:  _import('guides/add'), name: 'GuidesItemEdit', meta: { nav: '编辑目录' } },
                    { path: 'item/preview/:planId', component: _import('guides/guide-item-preview'), name: 'GuidesEditPreview', meta: { nav: '目录预览' } },
                    { path: 'item/preview/:planId', component: _import('guides/editPreview'), name: 'GuidesEditItemPreview', meta: { nav: '目录预览' } },
                    {
                        path: 'item/addmore',
                        component: _import('components/commonRouter'),
                        meta: { nav: '批量新增目录', paramName: 'GuidesItem', paramKey: ['id'] },
                        children: [
                            { path: '', component: _import('guides/item'), name: 'GuidesItem' },
                            { path: 'item/preview/:planId', component: _import('guides/guide-item-preview'), name: 'GuidesItemPreview', meta: { nav: '目录预览' } }
                        ]
                    }
                ]
            }
        ]
    },

    { // 实验计划
        path: '/plan',
        component: Layout,
        meta: { nav: '实验计划' },
        children: [
            { path: '', component: _import('plan/view'), name: 'PlanView' },
            { path: 'add', component: _import('plan/add'), name: 'PlanAdd', meta: { nav: '制定实验计划' } },
            { path: 'preview/:planId', component: _import('plan/preview'), name: 'PlanDetailPreviewId', meta: { nav: '目录预览' } },
            {
                path: 'detail/:id/:name',
                component: _import('components/commonRouter'),
                meta: { nav: '计划详情', paramName: 'PlanDetail', paramKey: ['id', 'name'] },
                children: [
                    { path: '', component: _import('plan/detail'), name: 'PlanDetail' },
                    { path: 'preview/:planId', component: _import('plan/preview'), name: 'PlanDetailPreview', meta: { nav: '目录预览' } }
                ]
            },
            {
                path: 'edit/:id',
                component: _import('components/commonRouter'),
                meta: { nav: '编辑计划', paramName: 'PlanEdit', paramKey: ['id'] },
                children: [
                    { path: '', component: _import('plan/edit'), name: 'PlanEdit' },
                    { path: 'preview/:planId', component: _import('plan/preview'), name: 'PlanPreview', meta: { nav: '目录预览' } },
                    {
                        path: 'addCatalog',
                        component: _import('components/commonRouter'),
                        meta: { nav: '新增校本目录', paramName: 'PlanAddCatalog', paramKey: ['id'] },
                        children: [
                            { path: '', component: _import('plan/addCatalog'), name: 'PlanAddCatalog' },
                            { path: 'preview', component: _import('plan/editPreview'), name: 'PlanAddPreview', meta: { nav: '目录预览' } }
                        ]
                    },
                    {
                        path: 'editCatalog/:planId',
                        component: _import('components/commonRouter'),
                        meta: { nav: '编辑计划目录', paramName: 'PlanEditCatalog', paramKey: ['id', 'planId'] },
                        children: [
                            { path: '', component: _import('plan/editCatalog'), name: 'PlanEditCatalog' },
                            { path: 'preview', component: _import('plan/editPreview'), name: 'PlanEditPreview', meta: { nav: '目录预览' } }
                        ]
                    },
                    {
                        path: 'addMore',
                        component: _import('components/commonRouter'),
                        meta: { nav: '从目录标准添加', paramName: 'PlanAddMore', paramKey: ['id'] },
                        children: [
                            { path: '', component: _import('plan/addMore'), name: 'PlanAddMore' },
                            { path: 'preview/:planId', component: _import('guides/guide-item-preview'), name: 'PlanMorePreview', meta: { nav: '目录预览' } },
                        ]
                    }
                ]
            }
        ]
    },
    { // 实验安排
        path: '/arrange',
        component: Layout,
        meta: { nav: '实验安排' },
        children: [
            { path: '', component: _import('school/arrange/index'), name: 'ArrangeIndex' },
            { path: 'reviseArrange/:planDetailId/:bookingId', component: _import('school/arrange/reviseArrange'), name: 'ReviseArrange', meta: { nav: '安排信息' } },
            { path: 'arrangePreview/:id', component: _import('school/arrange/preview'), name: 'ArrangePreview', meta: { nav: '目录预览' } }
        ]
    },
    { //公告管理
        path: '/notice',
        component: Layout,
        meta: { nav: '公告管理' },
        children: [
            { path: '', component: _import('notice/index'), name: 'Notice' },
            { path: 'details/:id', component: _import('notice/detailAdmin'), name: 'NoticeDetail', meta: { nav: '公告详情' } },
            { path: 'releace', component: _import('notice/releace'), name: 'NoticeReleace', meta: { nav: '发布新公告' } }
        ]
    },
    { //开通记录
        path: '/sourceRecord',
        component: Layout,
        meta: { nav: '开通记录' },
        children: [
            { path: '', component: _import('sourceRecord/index'), name: 'sourceRecord' },
            { path: 'sourceDetail/:id', component: _import('sourceRecord/detail'), name: 'sourceDetail', meta: { nav: '资源包详情' } }
        ]
    },
    //资源查看                { path: 'sourceView', component: sourceView, meta: { nav: '资源查看' } }, //资源查看
    {
        path: '/sourceView',
        component: Layout,
        meta: { nav: '资源查看' },
        children: [
            { path: '', component: _import('school/sourceIndex/sourceInx'), name: 'sourceView' },
            { path: 'sourcePreview/:id', component: _import('admin/sourceView/preview'), name: 'sourcePreview', meta: { nav: '资源详情' } }
        ]
    },
    { //本地资源
        path: '/localSource',
        component: Layout,
        meta: { nav: '本地资源' },
        children: [
            { path: '', component: _import('admin/localSource/index'), name: 'LocalSource' },
            { path: 'addSource/:catalogueId/:isEdit', component: _import('admin/localSource/addSource'), name: 'AddSource', meta: { nav: '新增资源' } },
            { path: 'editSource/:catalogueId/:textbookCode/:resourceId/:isEdit', component: _import('admin/localSource/addSource'), name: 'EditSource', meta: { nav: '编辑资源' } },
            { path: 'sourcePreview/:id', component: _import('admin/sourceView/preview'), name: 'SourcePreview', meta: { nav: '资源详情' } }
        ]
    },
    { //实验题库
        path: '/questionBank',
        component: Layout,
        meta: { nav: '实验题库' },
        children: [
            { path: '', component: _import('admin/check/index'), name: 'QuestionBank' },
            { path: 'addSortSelect/:type/:catalogueId/:isEdit', component: _import('admin/check/addSortSelect'), name: 'AddSortSelect', meta: { nav: '添加排序题' } },
            { path: 'addSortSelect/:type/:catalogueId/:textbookCode/:isEdit', component: _import('admin/check/addSortSelect'), name: 'EditSortSelect', meta: { nav: '编辑试题' } },
            { path: 'addSingleSelect/:type/:catalogueId/:isEdit', component: _import('admin/check/addSingleSelect'), name: 'AddSingleSelect', meta: { nav: '添加单选题' } },
            { path: 'addSingleSelect/:type/:catalogueId/:textbookCode/:isEdit', component: _import('admin/check/addSingleSelect'), name: 'editorSingleSelect', meta: { nav: '编辑试题' } },
            { path: 'addMultiSelect/:type/:catalogueId/:isEdit', component: _import('admin/check/addSingleSelect'), name: 'AddMultiSelect', meta: { nav: '添加多选题' } },
            { path: 'addTrueFalse/:type/:catalogueId/:isEdit', component: _import('admin/check/addSingleSelect'), name: 'AddTrueFalse', meta: { nav: '添加判断题' } }
            // { path: 'editSource/:catalogueId/:resourceId/:isEdit', component: addSource, name: 'EditSource', meta: { nav: '编辑资源' } },
            // { path: 'sourcePreview/:id', component: sourcePreview, name: 'SourcePreview', meta: { nav: '资源详情' } }
        ]
    },

    { //我的收藏
        path: '/myCollect',
        component: Layout,
        meta: { nav: '我的收藏' },
        children: [
            { path: '', component: _import('school/myCollect/index'), name: 'MyCollect' }
        ]
    },

    { //学校端实验资源
        path: '/source',
        component: Layout,
        meta: { nav: '实验资源' },
        children: [
            { path: '', component: _import('school/source/index'), name: 'Source' }
        ]
    },
     { //开通资源
        path: '/openSource',
        component: Layout,
        meta: { nav: '开通资源' },
        children: [
            { path: '', component:  _import('school/openSource/index'),  name: 'OpenSource' }
        ]
    },
    { //学校端公告列表
        path: '/index/notice',
        component: Layout,
        meta: { nav: '公告列表' },
        children: [
            { path: '', component: _import('notice/notice'), name: 'schoolNotice' },
            { path: 'details/:id', component: _import('notice/detailSchool'), name: 'SchoolNoticeDetail', meta: { nav: '公告详情' } }
        ]
    },
    { //错误页面
        path: '/error',
        component: Layout,
        meta: { nav: '操作出错' },
        children: [
            { path: '', component: _import('error/401'), name: 'Error401401' },
            { path: '401', component: _import('error/401'), name: 'Error401' },
            { path: '403', component: _import('error/403'), name: 'Error403' },
            { path: '404', component: _import('error/404'), name: 'Error404' },
            { path: '500', component: _import('error/500'), name: 'Error500' }
        ]
    },
    { path: '/error500', component: _import('error/500')},
    { path: '*', component: _import('error/404')}

]
export default new Router({
    mode:"hash",
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes:routes
});


