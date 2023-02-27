// @ts-ignore
/* eslint-disable */
import { API } from '@/common/entity/typings';
import moment from 'moment';

declare namespace TASK {
  // 批阅列表查询——参数对象
  type TaskReviewListParam = {
    orderBy: string,
    pageNum: number,
    pageSize: number,
    param: {
      classId: number,
      homeworkId: number,
      homeworkStatus: number,
      studentName: string
    }
  }
  // 批阅列表查询——列表数据
  type TaskReviewListData = {
      id: number,
      homeworkId: number,
      studentId: number,			//学生id
      studentName: string,		//学生名称
      classId: number,
      className: string,
      score: number,				 //总分数
      homeworkStatus: number,					// 1：已提交2：未提交
      checkStatus: number,						// 批阅状态1:已批阅2:待批阅
      submitTime: string,					//提交时间
      approvalTime: string,				// 批阅时间
      createTime: string,
      createUser: string,
      updateTime: string,					// 保存更新时间
      updateUser: string,
      deleteFlag: number,
      deleteTime: string,
      deleteUser: string,
      courseId: number,
      studentCode: string,					// 学号
      approvalUser: string,						// 批阅人姓名
      endTime: string,			// 加时后时间
      homeworkStartTime: string, // 作业开始时间
      homeworkEndTime: stirng // 作业结束时间
  }
  // 批阅列表查询——加时参数
  type TaskReviewOverTimeParam = {
    endTime: string | null;
    homeworkId: number;
    studentId: number;
  }
    // 批阅列表查询——数量统计参数
    type TaskReviewCountParam = {
      homeworkStatus: number;
      homeworkId: number;
      classId: number;
      studentName: string;
    }
    type TaskReviewCount = {
      totalNum: number;
      submitNum: number;
      unsubmitNum: number;
      className: string;
      homeworkName: string;
    }
  // 作业批阅——提交参数
  type TaskReviewParam = {
    comments: string,
    homeworkId: number,
    stuScore: string,
    studentId: number,
    stuHomeworkInfos: T[]
  }
  // 作业移动目录树
  type TaskMenuTree = {
    authType: number;
    childrens: T [];
    // [{ createTime: null, createUser: null, updateTime: null, updateUser: null, deleteFlag: null,… },…]
    classify: number;
    courseId: number;
    id: number;
    modelName: string; // 模板名称
    parentId: number;
    publishStatus: number;
    updateTime: string;
    updateUser: string;
    userName: string
  }
  // 作业库作业模板左侧模板数据
  type TaskLeftListByModel = {
    id: number;
    courseId: number; // 课程id
    parentId: number; // 父类id
    elementType: number; // 0: 试题 1：文件夹
    modelName: string; // 模板名称
    authType: number; // 1.私有 2.共享
    grandingStandard: number // 评分机制 1:百分制 2:自定义
    classify: number; // 题型归类 1:是 2:否
    createTime: string;

  }
  type TaskListParam = {
    orderBy?: string;
    pageNum: number;
    pageSize: number;
    param: {
      courseId: number;//课程id
      classId?: string;//班级id
      status: number;//作业状态，0：全部  1：未开始 2：进行中  3：已结束
      homeworkName: string;
    }
  };
  // 作业库-发布班级列表查询-tree数据
  type TASKPublishListTree = {
    key: number;
    title: string;
    children: TASKPublishListTree[]
  }
  // 教师端作业列表-作业数据
  type TaskList = {
    id: number; // 作业id
    courseId: number; // 课程id
    homeworkName: string; // 作业名称
    modelId: number; // 作业模板id
    modelName: string; // 模板名称
    startTime: string | moment; // 作业开始时间
    endTime: string | moment; // 作业结束时间
    score: number;  // 成绩
    classId: number; // 班级id
    className: string; // 班级名称
    uncompleteNum: number; // 未批改完成份数
    totalNum: number;  // 作业总份数
    ignoreCase: number | boolean; // 是否填空题不区分大小写 1:是 2: 否 (表单中用boolean表示)
    unselectedGiven: number | boolean; // 多选题未选全给一半分 1: 是 2：否 (表单中用boolean表示)
    // 发布设置查询
    viewTime: string;
    allowAfter: unknown;
  }
  // 批阅列表-批阅列表数据
  type ReviewListData = {
    id: number; // id
    key?: React.Key;
    homeworkId: number;  // 作业id
    homeworkName: string; // 作业名称
    studentId: number; // 学生id
    studentName: string; // 学生名称
    classId: number; // 班级id
    className: string; // 班级名称
    homeworkStatus: number; // 状态 1.已提交 2.未提交
    checkStatus: number; // 批阅状态 1.已批阅 2.未批阅
    submitTime: string; // 提交时间
    approvalTime: string; // 批阅时间
    updateTime: string; // 保存更新时间
    studentCode: number;  // 学号
    approvalUser: number; // 批阅者姓名
    totalNum: number;  // 作业总份数
  }
  // 完成选择习题
  type TaskSelectFinshParam = {
    parentId: number;  // 父类id
    classify: number;   // 题型归类
    courseId: number;  // 课程id
    modelName: string; // 作业模板名称
    modelId?: number;   // 模板id
    modelExerciseDTOS?: TaskSelectQuestionParam[];
  }
  type TaskSelectQuestionParam = {
    exerciseId: [];
    exerciseType: [];
  }
  // 新建作业题型分类数据
  type TaskClassifyParam = {
    typeName: string;
    typeCode: number;
    sortNum: number;
    score: string;
    exerciseCount: number;
    collect: QUESTION_BANK.QuestionExercise[];
  }
  // 学生作业列表查询
  type TaskListParamByStu = {
    classId: number;
    courseId: number;
    homeworkStatus?: number;
    studentId: number | string;
  }
  // 学生作业提交
  type TaskSumbitParamByStu = {
    homeworkId: number;  // 作业id
    homeworkInfos: TaskSumbitExerciseParam[]; // 习题列表
  }
  // 提交作业的习题数据类型
  type TaskSumbitExerciseParam = {
    exerciseId: number;  // 习题id
    exerciseResult: string;  // 习题作答答案
  }
  // 老师提交作业的习题数据类型
  type TaskTeacherSumbitExerciseParam = {
    exerciseId: number;  // 习题id
    exerciseResult: string;  // 习题作答答案
    exerciseScore: number;
    isCorrect: number;
    exerciseActualScore: number;
  }
  // 学生端作业列表-作业数据
  type TaskDataByStu = {
    classId: number; // 班级id
    courseId: number; // 课程id
    className: string; // 班级名称
    homeworkId: number; // 作业id
    homeworkName: string; // 作业名称
    startTime: string; // 作业开始时间
    endTime: string; // 作业结束时间
    homeworkStatus: number;  // 作业状态
    intervalTime: string; // 剩余时间
    studentId: number; // 学生id
    allowAfter: number;
    checkStatus: number;
    viewTime: number;
  }
  // 作业-作业详情数据
  type HomeWorkDetailData = {
    allowAfter: number;
    avatar: string; // 头像
    classId: number; // 班级id
    className: string; // 班级名称
    classify: number; //题型归类 1: 是 2：否
    classifyExercises: HomewWorkListByType[];
    startTime: string;  // 开始时间
    endTime: string;   // 结束时间
    score: string;      // 作业满分
    mark: string;   // 作业学生得分
    exerciseCount: number; // 习题数量
    homeworkName: string;  // 作业名称
  }
  type HomewWorkListByType = {
    typeName: string;
    typeCode: number;
    sortNum: number;
    score: string;
    exerciseCount: number;
    collect: HomeWorkAnswserByDetail[];
  }
  type HomeWorkAnswserByDetail = {
    modelId: number;
    isCorrect: number;
    exerciseType: number;
    exerciseScore: string;
    exerciseResult: string;  // 作答答案
    exerciseOrder: number;
    exerciseId: number;
    exerciseActualScore: number; // 满分
    exercise: ExerciseByDetail;
  }
  type ExerciseByDetail = {
    id: number;
    courseId: number;  // 课程id
    bandingModel: boolean;
    exerciseType: string;  // 题目类型
    exerciseScore: string;
    exerciseName: string;
    exerciseInfos: T[];
  }
  // 发布参数
  type PublishDataParam = {
    allowAfter: number | boolean; // 是否允许补交 1.允许补交 2.不允许补交
    courseId: number; // 课程id
    modelId: number;
    startTime: string | moment;
    endTime: string | moment;
    ignoreCase: boolean | number; // 是否填空题不区分大小写 1.是 2.否
    unselectedGiven: boolean | number; // 多选题未选全给一半分 1.是 2.否
    modelName: string;  // 模板名称
    homeworkName: string; // 作业名称
    viewTime: number; // 答案查看时间 1:批阅后 2:提交后
    distributions: PublishSelectObj[];  // 选择的对象数据
    id?: number;
  }
  // 发布选择对象参数
  type PublishSelectObj = {
    classId: number;  // 班级id
    className: string; // 班级名称
    targetType: number; // 类型 1.班级 2.学生
    distributionStudents?: PublishSelectByStu[]
  }
  type PublishSelectByStu = {
    studentId: number; // 学生id
    studentName: string;  // 学生名称
  }
  // 教师端-批阅查看接口参数
  type ReviewDataParamByTeach = {
    homeworkId: number; // 作业id
    studentId: number;  // 学生id
    flag: number; // 1.教师端 2.学生端
  }
  // 批阅查看数据
  type ReviewData = {
    allowAfter: number; 
    avatar: string; // 头像路径
    classId: number;  // 班级id
    className: string;  // 班级名称
    classify: number; // 是否按题型分类 1.是 2.否
    classifyExercises: ReviewClassifyExercises [];  // 按题目分类题目
    code: string; // 学生编号
    comments: string; // 教学评论
    endTime: string;  // 结束时间
    exerciseCount: number;  // 题目数量
    exercises: ReviewSortExercises [] // 不按题型分类题目
    homeworkName: string; // 作业名称
    homeworkStatus: number; // 作业状态
    mark: string; // 分数
    objectiveScore: string; // 客观题得分
    score: string;  // 满分
    startTime: string;  //  开始时间 
    studentName: string;  // 学生名称
    unselectedGiven: number;
    whetherAnswer: number;
  }
  // 按类型分类作业数据
  type ReviewClassifyExercises = {
    typeName: string; // 类型名称
    typeCode: number; // 类型编号
    sortNum: number;  
    score: string;  // 分数
    exerciseCount: number;  // 题目个数
    collect: ReviewCollectData[]; // 选项数组
  }
  type ReviewCollectData = {
    exerciseActualScore: number;
    exerciseId: number;
    exerciseOrder: number;
    exerciseResult: string;
    exerciseScore: number;
    exerciseType: number;
    isCorrect: number;
    modelId: number;
    exercise: QUESTION_BANK.QuestionExercise;
  }
  // 不按题型分类作业数据
  type ReviewSortExercises = {
    exercise: T;
    exerciseActualScore: number;
    exerciseId: number;
    exerciseOrder: number;
    exerciseResult: string;
    exerciseScore: number;
    exerciseType: number;
    isCorrect: number;
    modelId: number;
  }
}

