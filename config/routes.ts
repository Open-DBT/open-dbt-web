export default [
  { path: '/', redirect: '/home' },
  { path: '/home', component: './home/index' },
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
    ],
  },
  {
    path: '/feedback',
    routes: [
      { path: '/feedback', component: './feedback/index', hideInMenu: true },
      { path: '/feedback/list', component: './feedback/list' },
    ],
  },
  {
    path: '/sys',
    routes: [
      { icon: 'smile', path: '/sys/module', name: '模块管理', component: './sys/module' },
      { icon: 'smile', path: '/sys/role', name: '角色管理', component: './sys/role' },
      { icon: 'smile', path: '/sys/user', name: '用户管理', component: './sys/user' },
    ],
  },
  //自定义界面
  {
    path: '/edit',
    layout: false,
    routes: [
      {
        name: '章节编辑',
        path: '/edit/chapter/:courseId/:clazzId/:chapterId',
        component: './common-course/chapter/detail',
      },
      {
        name: '章节预览',
        path: '/edit/preview/:courseId/:clazzId/:chapterId',
        component: './common-course/chapter/detail/preview',
      },
    ],
  },
  //题库（独立页面）
  {
    path: '/question-bank',
    layout: false,
    routes: [
      {
        name: '题库列表',
        path: '/question-bank/list/:courseId',
        component: './common-course/question',
      },
      {
        name: '创建题目',
        path: '/question-bank/create/courseId/parentId/:courseId/:parentId',
        component: './common-course/question/component/create',
      },
      {
        name: '编辑题目',
        path: '/question-bank/edit/courseId/exerciseId/parentId/:courseId/:exerciseId/:parentId',
        component: './common-course/question/component/edit',
      },
      {
        name: '题目预览',
        path: '/question-bank/preview/courseId/exerciseId/:courseId/:exerciseId',
        component: './common-course/question/component/preview',
      },
    ],
  },
  //课程场景（独立页面）
  {
    path: '/scene',
    layout: false,
    routes: [
      {
        name: '课程列表',
        path: '/scene/list/:courseId',
        component: './common-course/scene_new',
      },
      {
        path: '/scene/create/:courseId',
        component: './common-course/scene_new/create',
        hideInMenu: true, //菜单不显示
      },
      {
        path: '/scene/update/:courseId/:sceneId',
        component: './common-course/scene_new/update',
        hideInMenu: true, //菜单不显示
      },
    ]
  },
  // 作业库
  {
    path: '/task-bank',
    layout: false,
    routes: [
      {
        name: '作业库列表',
        path: '/task-bank/list/:courseId',
        component: './common-course/task/components/library',
      },
      {
        name: '发布作业',
        path: '/task-bank/publishTask/courseId/taskId/:courseId/:taskId',
        component: './common-course/task/components/library/publishTask',
      },
      {
        name: '新建作业',
        path: '/task-bank/addTask/courseId/parentId/:courseId/:parentId',
        component: './common-course/task/components/library/addTask',
      },
      {
        name: '题库导入题目',
        path: '/task-bank/addQuestion/courseId/parentId/:courseId/:parentId',
        component: './common-course/task/components/library/component/question',
      },
      {
        name: '作业详情',
        path: '/task-bank/taskDetail/taskId/:taskId',
        component: './common-course/task/components/library/component/detail',
      },
      {
        name: '查看作业',
        path: '/task-bank/task/detail/studentId/homeworkId/:studentId/:homeworkId',
        component: './common-course/task/components/reviewList/components/detail',
      },
      {
        name: '作业批阅',
        path: '/task-bank/task/review/studentId/homeworkId/:studentId/:homeworkId',
        component: './common-course/task/components/reviewList/components/review',
      },
    ],
  },
   // 学生作业单独页面
   {
    path: '/task-stu',
    layout: false,
    routes: [
      {
        name: '作业答题',
        path: '/task-stu/answser/studentId/homeworkId/:studentId/:homeworkId',
        component: './stu/study/task/component/answser',
      },
      {
        name: '作业详情',
        path: '/task-stu/detail/studentId/homeworkId/:studentId/:homeworkId',
        component: './stu/study/task/component/detail',
      },
    ],
  },
  //课程专家
  {
    // name: '课程',
    path: '/expert',
    routes: [
      { name: '课程列表', path: '/expert/list', component: './expert' },
      { name: '课程编辑', path: '/expert/course/info/:courseId', component: './common-course/forwordPage' },
      { name: '课程章节', path: '/expert/course/chapter/:courseId', component: './common-course/forwordPage' },
      { name: '课程统计', path: '/expert/course/:courseId/statistics', component: './common-course/forwordPage' },
      {
        // name: '课程知识点',
        path: '/expert/course/:courseId/knowledge',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '课程场景',
        path: '/expert/course/scene/:courseId',
        // component: './common-course/forwordPage',
        component: './common-course/scene_new',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '课程-场景-创建',
        path: '/expert/course/:courseId/scene/create',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '课程-场景-更新',
        path: '/expert/course/:courseId/scene/:sceneId/update',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '课程习题列表',
        path: '/expert/course/:courseId/exercise',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '课程-习题-创建',
        path: '/expert/course/:courseId/exercise/create',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '课程-习题-更新',
        path: '/expert/course/:courseId/exercise/:exerciseId/update',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '课程-确认',
        path: '/expert/course/:courseId/confirm',
        component: './common-course/confirm',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '公共库-场景',
        path: '/expert/public_library/scene',
        component: './publicLib/scene',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '公共库-场景-新建',
        path: '/expert/public_library/scene/create',
        component: './publicLib/scene/components/create',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '公共库-场景-修改',
        path: '/expert/public_library/scene/:sceneId/update',
        component: './publicLib/scene/components/update',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '公共库-题库',
        path: '/expert/public_library/exercise',
        component: './publicLib/exercise',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '公共库-题库-新建',
        path: '/expert/public_library/exercise/create',
        component: './publicLib/exercise/components/create',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '公共库-题库-修改',
        path: '/expert/public_library/exercise/:exerciseId/update',
        component: './publicLib/exercise/components/update',
        hideInMenu: true, //菜单不显示
      },
      {
        // name: '公共场景查看',
        path: '/expert/publicLib/scene/view/:sceneId',
        component: './publicLib/scene/view',
        hideInMenu: true, //菜单不显示
      },
    ],
  },
  // 课程模板--查看课程
  {
    path: '/student',
    hideInMenu: true, //菜单不显示
    routes: [
      {
        name: '课程简介',
        path: '/student/course/info/:courseId',
        component: './course/view/forwordPage',
      },
      {
        name: '课程章节',
        path: '/student/course/chapter/:courseId',
        component: './course/view/forwordPage',
      },
      {
        name: '课程知识点',
        path: '/student/course/knowledge/:courseId',
        component: './course/view/forwordPage',
      },
      {
        name: '课程场景',
        path: '/student/course/scene/:courseId',
        component: './course/view/forwordPage',
      },
      {
        name: '课程习题',
        path: '/student/course/exercise/:courseId',
        component: './course/view/forwordPage',
      }
    ],
  },
  //教师课程(新版)
  {
    path: '/teacher',
    routes: [
      {
        name: '教师课程列表',
        path: '/teacher/list',
        component: './teacher/course',
      },
      {
        name: '教师班级列表',
        path: '/teacher/sclassList',
        component: './teacher/sclass',
      },
      // 班级入口-班级首页菜单
      {
        path: '/teacher/class/:sclassId/info',
        component: './teacher/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 班级入口-班级学生菜单
      {
        path: '/teacher/class/:sclassId/student',
        component: './teacher/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 班级入口-班级统计菜单
      {
        path: '/teacher/class/:sclassId/statis',
        component: './teacher/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 班级入口-班级作业菜单
      {
        path: '/teacher/class/:sclassId/exam',
        component: './teacher/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 班级作业菜单-info
      {
        path: '/teacher/course/:courseId/exam/:examId/info',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 班级作业菜单-习题
      {
        path: '/teacher/course/:courseId/exam/:examId/exercise',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 班级作业班级-成绩单(课程入口)
      {
        path: '/teacher/course/:courseId/exam/report/:examClassId',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 教师查看作业学生答案新版页面(课程入口)
      {
        path: '/teacher/course/:courseId/stuExamAnswerView/score/:scoreId',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 教师查看学生答案
      {
        path: '/teacher/stuAnswerView/score/:scoreId',
        component: './statis/sclass/answerView',
        hideInMenu: true, //菜单不显示
      },
      // 教师查看学生答案新版页面
      {
        path: '/teacher/stuAnswerView/class/:sclassId/score/:scoreId',
        component: './teacher/statis/answerView',
        hideInMenu: true, //菜单不显示
      },
      // 班级作业班级-成绩单(班级入口)
      {
        path: '/teacher/sclass/:sclassId/course/:courseId/exam/report/:examClassId',
        component: './teacher/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      // 教师查看作业学生答案新版页面(班级入口)
      {
        path: '/teacher/sclass/:sclassId/stuExamAnswerView/score/:scoreId',
        component: './teacher/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-课程章节-章节统计
        name: '章节统计',
        path: '/teacher/course/chapter/statis/list/:courseId/:chapterId/:clazzId/:serialNum',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-课程章节-章节统计-任务点详情
        name: '章节统计',
        path: '/teacher/course/chapter/statis/detail/:courseId/:chapterId/:clazzId/:serialNum/:resourcesId',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-课程章节-章节统计-学生统计-学生详情
        name: '章节统计',
        path: '/teacher/course/chapter/statis/student/process/:courseId/:chapterId/:clazzId/:serialNum/:userId',
        component: './common-course/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      { name: '题库列表', path: '/teacher/course/question/:courseId', component: './common-course/forwordPage' },
      { name: '作业', path: '/teacher/course/task/:courseId', component: './common-course/forwordPage' },
      { name: '批阅列表', path: '/teacher/course/task/review/courseId/classId/homeworkId/:courseId/:classId/:homeworkId', component: './common-course/forwordPage' },
    ],
  },
  // 教师
  {
    path: '/course',
    routes: [
      {
        name: '课程编辑',
        path: '/course/course/edit/:courseId',
        component: './course/course/StepForm',
        hideInMenu: true, //菜单不显示
      },
      {
        name: '课程查看',
        path: '/course/view/:courseId',
        component: './course/course/view',
        hideInMenu: true, //菜单不显示
      },
      // 查看场景使用老版本页面，需要迁移
      {
        name: '场景查看',
        path: '/course/scene/view/:sceneId',
        component: './course/scene/view',
        hideInMenu: true, //菜单不显示
      },
    ],
  },
  // 班级
  {
    path: '/sclass',
    hideInMenu: true, //菜单不显示
    routes: [
      {
        name: '班级编辑',
        path: '/sclass/edit/:sclassId',
        component: './sclass',
        hideInMenu: true, //菜单不显示
      },
      {
        name: '班级查看',
        path: '/sclass/view/:sclassId',
        component: './sclass/components/view',
        hideInMenu: true, //菜单不显示
      },
    ],
  },
  // 统计
  {
    path: '/statis',
    routes: [
      {
        name: 'sclass-stat',
        path: '/statis/sclassStat',
        component: './statis/sclass',
        hideInMenu: true, //菜单不显示
      },
      {
        name: 'stu-stat',
        path: '/statis/stuStat',
        component: './statis/stu',
        hideInMenu: true, //菜单不显示
      },
    ],
  },
  // 学生
  {
    path: '/stu',
    hideInMenu: true, //菜单不显示
    routes: [
      {
        name: '课程首页',
        path: '/stu/course/info/:courseId/:clazzId',
        component: './stu/study',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-课程章节
        name: '课程章节',
        path: '/stu/course/chapter/list/:courseId/:clazzId',
        component: './stu/study/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-课程章节-学习进度
        name: '课程章节进度',
        path: '/stu/course/chapter/process/:courseId/:clazzId',
        component: './stu/study/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-课程章节-章节详情
        name: '课程章节',
        path: '/stu/course/chapter/detail/:courseId/:clazzId/:chapterId',
        component: './stu/study/chapter/detail',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-知识点
        name: '课程知识点列表',
        path: '/stu/course/knowledge/list/:courseId/:clazzId',
        component: './stu/study/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-习题
        name: '课程习题列表',
        path: '/stu/course/knowledge/exercise/:courseId/:clazzId/:knowId',
        component: './stu/study/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        name: '开始答题',
        path: '/stu/course/exercise/:courseId/:clazzId/:knowId/:exerciseId',
        component: './stu/answer',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-统计
        name: '个人统计',
        path: '/stu/course/statis/:courseId/:clazzId',
        component: './stu/study/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-作业列表
        name: '作业列表',
        path: '/stu/course/exam/:courseId/:clazzId',
        component: './stu/study/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-作业详情
        name: '作业明细',
        path: '/stu/course/exam/examClass/detail/:courseId/:clazzId/:examId/:examClassId',
        component: './stu/study/forwordPage',
        hideInMenu: true, //菜单不显示
      },
      {
        // 课程入口-作业详情-开始答题
        name: '开始答题',
        path: '/stu/course/exam/exercise/:courseId/:clazzId/:examId/:examClassId/:exerciseId',
        component: './stu/study/exam/answer',
        hideInMenu: true, //菜单不显示
      },
      {
        name: '课程列表',
        icon: 'smile',
        path: '/stu/course',
        component: './stu/study/course',
      },
      {
        // 课程入口-作业列表(new)
        name: '作业列表',
        path: '/stu/course/task/:courseId/:clazzId',
        component: './stu/study/forwordPage',
        hideInMenu: true, //菜单不显示
      },
    ],
  },
  // 个人中心
  {
    path: '/center',
    component: './center/',
    routes: [
      {
        path: '/',
        redirect: '/result/success',
      },
    ],
  },
  {
    component: './404',
  },
];
