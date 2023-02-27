// @ts-ignore
/* eslint-disable */
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';

declare namespace CHAPTER {

  //教师端-课程-查询目录树--api_getCatalogueByClass
  type CatalogueByClass = {
    catalogueTreeList: CourseCatalog[];
    classId: number;
  };

  // 教师-课程-章节列表--apiSaveCatalogue/api_delCatalogue/apiUpdateCatalogue/api_moveUp/api_moveDown/api_getCatalogueAuth/apiSaveCatalogueAuth
  type CourseCatalog = {
    id: number;//目录id
    courseId: number;//课程id
    parentId: number;//父id
    catalogueName: string;//目录名称
    createTime: string;//创建时间
    createUser: string;//创建人
    childrens: CourseCatalog[];
    publishStatus: number; // 是否发布 0:未发布 1:已发布
    catalogueLevel: number;//层级序号
    catalogueTaskNum: number;//任务点总数
    catalogueScale: number;//任务点进度
    model: number;//发布状态，0发布模式，2隐藏模式
    classes: ChapterClszz[];//绑定班级
    serialNum: string;//序号
    classId: number;//班级id

    //非接口字段
    title?: any//显示内容
    sortName?: string; // 层级序号  ----是否可以删除
  };

  // 教师-课程-目录班级关系表--CourseCatalog子属性
  type ChapterClszz = {
    id: number;//目录id
    courseId: number;//课程id
    catalogueId: number;//章节id
    catalogueName: string;//章节name
    classId: number;//班级id
    authType: number;//预留字段
    flag: number;//0：未选中1：已选中
    className: string;//班级名称
    stus: string;//预留字段
  }

  // 教师-课程-章节-统计概览列表--api_getCatalogueProgress
  type CourseChapterStat = {
    id: number;//目录id
    courseId: number;//课程id
    parentId: number;//父id
    catalogueName: string;//目录名称
    childrens: CourseChapterStat[];
    catalogueLevel: number;//层级序号
    catalogueTaskNum: number;//任务点总数
    catalogueScale: number;//任务点进度
    serialNum: string;//序号

    //章节统计字段
    isleaf: boolean;//未知
    catalogueStatistics: ChapterTask[];//任务点列表
    studentCatalogueStatistics: CourseChapterStatStudentProcessResource[];//学生统计完成情况列表
  };

  //教师-课程-章节-任务点详情--CourseChapterStat子属性
  type ChapterTask = {
    resourcesId: number;//资源id
    resourcesName: string;//资源名称
    resourcesType: string;//类型
    resourcesTime: number;//视频总时长
    totalNum: number;//总学生数
    completeNum: number;//完成数

    //临时字段，用于表格查询章节id
    chapterId?: number;//章节id
  }
  //教师-课程-章节-任务点完成情况列表--api_getCatalogueInfo
  type ChapterTaskDetail = {
    id: number;
    courseId: number;//课程id
    catalogueId: number;//章节id
    contentsId: number;//内容id
    classId: number;//班级id
    resourcesId: number;//资源id
    userId: number;//用户id
    studyStatus: number;//学习状态，1：未学完 2：已学完
    progress: string;//播放进度，预留
    duration: number;//观看时长(秒)
    userName: number;//学生姓名
    code: string;//学号
    proportion: number;//学习进度 已*100
    resourcesTime: number;//视频时长 秒
    resourcesName: string;//资源名称
    completeTime: number;//完成时间(秒)
  }
  //教师-课程-章节-详情标题--api_getCatalogueInfoTitle
  type ChapterTaskDetailTitle = {
    CatalogueInfoTitle
    catalogueName: string;//章节名称
    resourcesName: string;//资源名称
    resourcesTime: number;//资源时长 
  }
  //教师-课程-章节统计-学生统计概览--api_getStudentProgress
  type ChapterStatStudent = {
    userName: string;//学生姓名
    userId: string;//学生id
    code: number;//学号
    countNum: number;//任务点总数
    completeNum: number;//已完成任务点总数 
    proportion: number;//学习进度 
  }
  // 教师-课程-章节-学生统计-学生任务点详情--api_getStudentInfo
  type CourseChapterStatStudentProcess = {
    className: string;//班级名称
    countNum: number;//任务点总数
    completeNum: number;//完成任务点数
    code: number;//学生学号
    userName: string;//学生姓名;
    courseCatalogueTree: CourseChapterStat[];//任务点列表
  };
  //教师-课程-章节-学生统计-学生任务点详情--统计分析列表--CourseChapterStat子属性
  type CourseChapterStatStudentProcessResource = {
    resourcesId: string;//资源id
    resourcesName: string;//资源名称
    resourcesType: string;//类型
    duration: number;//观看时长(秒)
    studyStatus: number;//学习状态，1：未学完 2：已学完
    proportion: number;//观看进度
    completeTime: string;//完成时间
  };

  // 教师-课程-章节-编辑器显示内容
  type ChapterEditorContext = {
    id: number,
    courseId: number;  // 课程id
    catalogueId: number; // 目录id
    contents: string, // 章节内容
    tabNum: number, // tab页序号
    tabNum: number, // tab页序号
    attachments: EditorResource[],
  }
  //  教师-课程-章节-编辑器内容资源数据
  type EditorResource = {
    id: number,
    courseId: number,  // 课程id
    catalogueId: number, // 目录id
    resourcesId: number,
    pageNum: number, // ppt总页数
    downloadAuth: number,  // 能否下载 1：否 0: 是
    processSet?: number,  // 视频完成阈值设置
    isSpeed: number, // 是否倍数 1：否 0: 是
    isTask: number,  // 是否是任务点 1：否 0: 是
    fastForward: number, // 是否快进 1：否 0: 是
    deleteFlag: number,  // 是否删除 1：否 0: 是
    url?: string; // url地址
  }
  //学生端-课程-章节目录首页--api_getCatalogueByClass
  type ChapterStudent = {
    catalogueTreeList: CourseCatalog[];
    taskNum: number;//备用（校验数据准确性
    stuCompleteTaskNum: number;//当前学生该课程下的完成任务数
    stuAllTaskNum: number;//当前学生该课程下的总任务数
  };
  //学生端-课程-章节详情-提交任务点观看进度
  type ChapterStudentTaskProcessParm = {
    courseId: number;//课程id
    catalogueId: number;//章节id
    resourcesId: number;//资源id
    duration: number;//观看时长
    resourcesTime: number;//资源时间
    progress?: number;//进度 非必填
  };

  //课程章节编辑-上传视频-打开历史视频列表
  interface HistoryResource extends DataNode {
    id: number;//资源id
    resourcesName: string; //上传资源名称"q.mp4"
    resourcesRename: string;//资源存储真实名称 "q_1030176922052591616.mp4"
    resourcesType: string;//资源格式 "video/mp4"
    resourcesUrl: string;//资源存储位置 "/opt/resourcesStore/video/q_1030176922052591616.mp4"
    resourcesTime: number;//资源时长 29
    resourcesSuffix: string;//资源后缀 "mp4"
    screenshot: string; //缩略图 "/opt/resourcesStore/video/pic/fc40d927f6d64e6b9fbfaba5dba23739.png"
    parentId: number;//父类id 0
    sortNum: number;//排序 1
    createTime: string;// "2022-10-13 17:55:17"
    createUser: string;// "2"
    resourcesTypeName: string;//资源类型名称 "视频"
    resourcesPdfUrl: string;//null
    resourcesSize: number; //资源大小 2001983
    resourcesRetype: number; //资源类型 9视频、11图片、1表格、2文档、3幻灯片、10pdf 
    resourcesAdditional: number;//2 是否其他资源1：是 2：否
    childrens?: HistoryResource[];
    isleaf: boolean;

    //临时变量
    url?:string;//用于可以直接播放地址，添加了local路径
  }

}

