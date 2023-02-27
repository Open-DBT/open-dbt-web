// @ts-ignore
/* eslint-disable */
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';

declare namespace API {

  interface ActionType {
    reload: (resetPageIndex?: boolean) => void;
    reloadAndRest: () => void;
    reset: () => void;
    clearSelected?: () => void;
    startEditable: (rowKey: Key) => boolean;
    cancelEditable: (rowKey: Key) => boolean;
  }
  type LoginResult = {
    success: boolean;
    message: string;
  };
  // 后台返回结果
  type Result<T> = {
    success?: boolean;
    message: string;
    token: string;
    code: number;
    obj: T;
    type: string;//只限于登录账户类型使用
  };
  // 当前用户信息
  type CurrentUser = {
    userId: number;
    userName?: string;
    code?: string; //学号
    avatar?: string; //头像
    englishName?: string; //英文名
    isStop?: string; //是否禁用
    mobile?: string; //手机号
    nickName?: string; //昵称
    password?: string; //密码
    sex?: number; //性别
    roleList?: API.RoleListItem[];
    roleIds?: number[];
    roleType?: number;
  };

  type PageParams = {
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
  };

  type PageHelper<T> = {
    total: number;//总数
    list: T[];
    pageNum: number;//当前页
    pageSize: number;//每页数量
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    total?: number; // 列表的内容总数
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    code: string;
    password: string;
    remember: boolean;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    total?: number; // 列表的内容总数
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type NoticesListTO = {
    noticeList: NotificationItem[];
    upcomList: EventItem[];
    count: number; // 列表的内容总数
  };

  type NotificationItem = {
    id: number;
    userId: number;
    userName: string;
    avatar: string;
    createTime: string;
    noticeContent: string;
    roleType: number;
    read: boolean;
  };

  type EventItem = {
    id: number;
    taskName: string;
    taskDesc: string;
    read: boolean;
  };
  // 模块管理
  type ModuleListItem = {
    resourceId: number; //模块id
    parentId: number; //模块上级id
    parentName: string; //模块上级名
    resourceName: string; //模块名
    resourceKey: string; //模块关键字
    resourceDesc: string; //模块描述
    resourceType: number; //模块类型
    resourcePath: string; //模块路径
    isDelete: number; //是否删除
    icon: string; //模块图标
  };

  // 模块管理请求参数
  type ModuleListParams = {
    parentName?: string; //模块上级名
    resourceName?: string; //模块名
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
  };

  // 角色
  type RoleListItem = {
    roleId: number; //角色id
    roleName: string; //角色名
    roleDesc: string; //角色描述
    isDelete: string; //是否已删除
    resourceIds: number[]; //模块id数组
    isPredefined: number; //是否是默认角色
    creator: number; //创建人id
    createTime: string; //创建时间
    operator: number; //修改人id
    updateTime: string; //修改时间
  };

  // 角色请求参数
  type RoleListParams = {
    roleId?: number; //角色id
    roleName?: string; //角色名
    roleDesc?: string; //角色描述
    isDelete?: string; //是否已删除
    resourceIds?: string[]; //模块id数组
    isPredefined?: number; //是否是默认角色
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
  };

  // 用户
  type UserListItem = {
    userId: number; //用户id
    code: string; //学号
    userName: string; //用户名
    sex: number; //性别
    isStop: number; //是否停用
    avatar: string; //头像
    englishName: string; //英文名
    nickName: string; //昵称
    mobile: string;//用户电话
    password: string; //密码
    roleList: API.RoleListItem[]; //角色信息list
    roleIds: number[]; //角色id数组
    creator: number; //创建人id
    createTime: string; //创建时间
    operator: number; //修改人
    updateTime: string; //修改时间
    roleType: number; //用户默认角色
  };

  // 用户请求参数
  type UserListParams = {
    userId?: number; //用户id
    code?: string; //学号
    userName?: string; //用户名
    sex?: number; //性别
    isStop?: number; //是否停用
    roleList?: API.RoleListItem[]; //角色信息list
    roleIds?: number[]; //角色id数组
    password?: string; //密码
    englishName?: string; //英文名
    nickName?: string; //昵称
    roleType?: number; //用户默认角色
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
  };

  // 场景信息model
  type SceneListRecord = {
    sceneId: number; //场景id
    courseId: number; //课程id
    sceneName: string; //场景名
    sceneDesc: string | BraftEditor; //场景描述
    initShell: string; //初始化脚本
    sceneDetailList?: API.SceneListRecord[]; //场景明细list
  };

  // 场景表格请求参数
  type SceneParams = {
    courseId?: number;
    initShell?: string; //初始化脚本
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
  };

  // 课程信息
  type CourseListItem = {
    courseId: number; //课程id
    courseName: string; //课程名
    courseDesc: string; //课程描述
    courseOutline: string; //课程大纲
    createTime: string; //创建时间
    creator: number; //创建人id
    creatorName: string; //创建人名
    isOpen: number; //是否发布  0未发布，1已发布
    knowledgeTree: string; //知识树json串
    coverImage: string;//课程封面
    teachers: number[];//助教id
  };

  // 课程信息参数
  type CourseDetailRecord = {
    courseId: number; //课程id
    courseName?: string; //课程名
    courseDesc?: string; //课程描述
    courseOutline?: string; //课程大纲
    createTime?: string; //创建时间
    creator?: number; //创建人id
    creatorName?: string; //创建人名
    isOpen?: number; //是否发布
    coverImage?: string;//课程封面
    knowledgeTree?: string; //知识树json串
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
  };

  //课程知识点
  type KnowledgeListRecord = {
    knowledgeId: number; //知识点id
    parentId: string; //知识点父节点id
    courseId: number; //课程id
    name: string; //知识点名
    keyword: string; //知识点关键字
    knowledgeDesc: string //知识点描述
  };
  //每个知识点习题总数
  type KnowledgeItemExerciseCount = {
    knowledgeId: number; //知识点id
    progress: int; //知识点习题总数
  };

  //习题列表
  type ExerciseRecord = {
    exerciseId: number; //习题id
    courseId: number; //课程id
    courseName: string; //课程名
    sceneId: number; //场景id
    sceneName: string; //场景名
    exerciseName: string; //习题名
    exerciseDesc: string | BraftEditor; //习题描述
    answer: string; //答案
    knowledgeIds: number[]; //关联知识点id
    knowledgeNames: string[]; //关联知识点name
    scene: API.SceneListRecord; //关联的场景
  };

  //习题列表参数
  type ExerciseListParams = {
    exerciseId?: number; //习题id
    courseId?: number; //课程id
    courseName?: string; //课程名
    sceneId?: number; //场景id
    sceneName?: string; //场景名
    exerciseName?: string; //习题名
    exerciseDesc?: string; //习题描述
    knowledgeId?: number; //
    knowledgeIds?: number[]; //关联知识点id
    scene?: API.SceneListRecord; //关联的场景
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
  };
  //习题列表参数
  type ExerciseParams = {
    courseId: number; //课程id
    sceneId?: number; //场景id
    exerciseDesc?: string; //习题描述
    knowledgeId?: number; //知识点id
  };

  //班级info
  type SclassListRecord = {
    id: number;
    className: string;
    classDesc: string;
    classStart: string;
    classEnd: string;
    creator?: number;
    creatorName?: string;
    courseId?: number;
    course: API.CourseDetailRecord
    progress: number;
    stuStartTime: string;
  };

  //班级info
  type SclassRecord = {
    id: number;
    className: string;
    classDesc: string;
    classStart: string;
    classEnd: string;
    creator?: number;
    courseId: number;
    course?: API.CourseDetailRecord;
    progress: number;//进度
    stuStartTime: string;//开始学习时间
    isEnd: number;//是否结束 //0未结束，1已结束
    classIsOpen: number;//是否开放给学生，0不开放，1开放
    stuNewLearnTime: string;//最后学习时间
    stuNumber: number;//学生数量
    knowledgeNumber: number;//知识点数量
    exerciseNumber: number;//习题数量 
    overPercentage: number;//超过百分比

    //时间控件临时变量
    startMoment?: Moment;
    endMoment?: Moment;
  };
  //学生学习课程-知识点列表
  type stuSclassKnowRecord = {
    knowledgeId: number;
    name: string
    exerciseNumber: number;
    progress: number
  }
  //学生-习题列表
  type stuExerciseInfo = {
    exerciseNumber: number;//习题总数
    doneExerciseNumber: number;//做过的习题数
    course: API.CourseListItem;
    knowledge: API.KnowledgeListRecord;
    exerciseList: API.StuExerciseListRecord[];
  }
  //学生答题-查询当前知识点全部习题
  type StuAnswerExerciseInfo = {
    exerciseId: number; //习题id
    courseId: number; //课程id
    courseName: string; //课程名
    sceneId: number; //场景id
    sceneName: string; //场景名
    exerciseName: string; //习题名
    exerciseDesc: string; //习题描述
    answer: string; //答案
    knowledgeIds: number[]; //关联知识点id
    knowledgeNames: string[]; //关联知识点name
    scene: API.SceneListRecord; //关联的场景
    stuAnswer: string;//上次提交答案
    ct: string;//答题时间
  }
  //逐条更新开班学生
  type SclassStuParam = {
    sclassId: number;
    code: string,
    userName: string;
  }
  //答题成绩
  type Score = {
    scoreId: number;
    userId: number,
    exerciseId: number;
    exerciseName: string;
    createTime: string;
    usageTime: number;
    answer: string;
    score: number;
    answerExecuteTime: number;
    answerLength: number;
  }
  //学生习题列表
  type StuExerciseListRecord = {
    exerciseId: number;
    courseId: number;
    courseName?: string;
    sceneId?: number;
    sceneName?: string;
    exerciseName?: string;
    exerciseDesc?: string;
    answer?: string;
    score: string;
    ct: string;
  };
  //学生答题提交答案
  type SubmitResult = {
    executeRs: boolean;//执行
    scoreRs: boolean;//结果集
    log: string;
    usageTime: int;
    list: API.KnowledgeListRecord[];
    coverage: number;//覆盖率
  }

  //班级统计--正确率
  type SclassCorrect = {
    id: number;//习题id
    exerciseName: number;//习题名称
    correctCount: number;//答对次数
    answerCount: number;//答题次数
    stuCount: number;//学生人数
    allCorrectCount: number;//答对人数
    allAnswerCount: number;// 答题人数
  }
  //班级统计--覆盖率
  type SclassCoverage = {
    id: number;//学生id
    userName: string;//学生姓名
    code: string;//学号
    correctCount: number;//答对次数
    answerCount: number;//答题次数 
    submitAnswerCount: number;//提交总数
    exerciseCount: number;//总题目数
  }
  //学生统计--正确率
  type StudentCorrect = {
    id: number;//习题id
    exerciseName: string;//学生姓名
    correctCount: number;//当前学生本题答对
    answerCount: number;//当前学生本题答题总数
    allCorrectCount: number;//全部学生本题答对
    allAnswerCount: number;//全部学生本题答题总数
    stuCount: number;//全班人数
  }
  //学生统计--覆盖率
  type StudentCoverage = {
    id: number;//习题id
    userName: string;//学生姓名
    code: string;//学号
    correctCount: number;//答对次数
    answerCount: number;//答题次数  
    exerciseCount: number;//总题目数
    avgCorrectCount: number;//答对平均数
    avgAnswerCount: number;//做题平均数
  }

  //意见反馈
  type FeedbackForm = {
    content: string;
  }
  //意见反馈列表
  type FeedbackListRecord = {
    id: number,
    content: string;
    mobile: string;
    createTime: string;
    user: API.UserListItem;
  }
  //作业列表
  type ExamListRecord = {
    id: number,
    testName: string;
    testDesc: string;
    exerciseSource: number;// 题目来源，1=>公共题库，0=>当前课程
    creator: number;
    courseId: number;
    course: CourseListItem;
    selectedClassList?: SclassListRecord[];
    exerciseCount: number;//多少道题
    testStart: string;
    testEnd: string;
    isEnd: number;
    examClassId: number;
  }
  //作业习题关联表
  type ExamExerciseListRecord = {
    id: number;
    examId: number;
    exerciseId: number;
    exercise: API.ExerciseRecord;
    ordinal: number;
    score: number;
  }
  //作业列表
  type ExamClassListRecord = {
    id: number,
    examId: number;
    exam?: API.ExamListRecord;
    course?: API.CourseListItem;
    courseId: number;
    classId: number;
    sclass?: API.SclassListRecord;
    testStart: string;
    testEnd: string;
    testIsOpen: boolean;//是否可见，false不开放，true开放
  }
  //作业课程，学生得分列表
  type ExamStudentReportCard = {
    studentId: number; // 学生用户id
    studentName: string; // 学生姓名
    studentCode: string; // 学生学号
    studentGrossScore: number; // 学生总分
    isFinish: number;
  }
  //作业课程，学生得分列表
  type ExamStudentAnswerHistoryRecord = {
    exerciseId: number; // 习题id
    exerciseName: number; // 习题名
    exerciseScore: number; // 习题分值
    exerciseGoal: number; // 习题得分
    exerciseSituation: number; // 习题做题情况，-1为未做，0为做错，100为做对
    answerTime: string;//提交时间
    answerExecuteTime: string;//执行时间
    scoreId: number;
  }


  type PublicSceneRecord = {
    sceneId: number;
    sceneName: string;
    sceneDesc: string | BraftEditor;
    initShell: string;
    creator: number;
    createTime: string;
  }
  //习题列表参数
  type PublicExerciseList = {
    exerciseId?: number; //习题id
    sceneId?: number; //场景id
    sceneName?: string; //场景名
    exerciseName?: string; //习题名
    exerciseDesc?: string; //习题描述
    exerciseAnalysis?: string;
    answer?: string;
    creator?: number;
    creatorName?: string;
    createTime?: string;
    scene?: API.SceneListRecord; //关联的场景
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
  };

  // 学生作业习题列表
  type StudentExamExercise = {
    exerciseId: number; //习题id
    exerciseName: string; //习题名
    exerciseDesc?: string; //习题描述
    exerciseScore: number; //习题分值
    exerciseGoal: number; //习题得分
    exerciseSituation: number; //习题做题情况，-1为未做，0为做错，100为做对
    sceneId?: number; //场景id
    sceneName?: string; //场景名
    sceneDesc?: string; //场景描述
    initShell?: string; //场景初始化脚本
    studentAnswer?: string; //学生答题最新一次答案
  };

  // 学生作业习题列表成绩
  type StudentReportCard = {
    studentId: number;
    studentName?: string;
    studentCode?: string;
    exerciseCount?: number;
    answerExerciseCount?: number;
    exerciseGrossScore?: number;
    studentGrossScore?: number;
    exerciseReportCardList?: API.StudentExamExercise[];
    courseName?: string; // 课程名
    examName?: string; // 作业名
    examStatus?: number; // 作业状态
    examStart?: string; // 作业开始时间
    examEnd?: string; // 作业结束时间
  };
}

