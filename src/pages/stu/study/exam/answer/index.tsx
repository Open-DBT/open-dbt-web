import { useEffect, useState } from 'react';
import { Modal, message, Space, Row, Col } from 'antd';
import './index.less';
import LeftColumn from './left';
import RightColumn from './right';
import { LoadingOutlined } from '@ant-design/icons';
import StudentMenu from '@/pages/stu/study/menu';
import ResultSetModal from '@/pages/course/exercise/components/ResultSetModal';
import {
  getExamExerciseList,
  getExamExerciseById,
  examStuTestRunAnswer,
  examSubmitAnswer,
} from '@/services/student/student';
import { getExamById } from '@/services/student/student';
import { history } from 'umi';
import Cookies from 'js-cookie';
import { exerciseAnswerNotifiedExcetion, exerciseAnswerNotifiedSucc, exerciseAnswerNotifiedFail } from '@/pages/components/exercise-answer-notification'
import { API } from '@/common/entity/typings';
const Answer = (props: any) => {
  let courseId = -1;
  let clazzId = -1;
  let exerciseId = -1;
  let examId = -1;
  let examClassId = -1;
  try {
    exerciseId = Number(props.match!.params.exerciseId);
    courseId = Number(props.match!.params.courseId);
    clazzId = Number(props.match!.params.clazzId);
    examId = Number(props.match!.params.examId);
    examClassId = Number(props.match!.params.examClassId);
  } catch (error) {
    return;
  }


  const [classIsEndVisible, setClassIsEndVisible] = useState<boolean>(false); //课程结束提示弹窗
  const [isMessageInfoModalVisible, setIsMessageInfoModalVisible] = useState<boolean>(false); //答题提示弹窗
  const [isWaitModalVisible, setIsWaitModalVisible] = useState<boolean>(false);
  const [executeResult, setExecuteResult] = useState<API.SubmitResult>();
  const [submitType, setSubmitType] = useState<number>(0); //0提交；1测试
  const [exam, setExam] = useState<API.ExamClassListRecord>();
  const [exercise, setExercise] = useState<API.StudentExamExercise>();
  const [exerciseList, setExerciseList] = useState<API.StudentExamExercise[]>([]); //全部习题，用于上下题切换不再重复请求
  const [topButtonDisabled, setTopButtonDisabled] = useState<boolean>(true);
  const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(true);
  const [isCanAnswer, setIsCanAnswer] = useState<boolean>(false);

  useEffect(() => {
    //查询班级信息
    getExamById(examClassId).then((result) => {
      if (result && result.success) {
        setExam(result.obj);
        if (result.obj.exam?.isEnd === 1) {
          //isCanAnswer=false 不可以答题
          setIsCanAnswer(false);
          //课程结束，提示不可以答题
          setClassIsEndVisible(true);
        } else {
          //isCanAnswer=true 可以答题
          setIsCanAnswer(true);
          const showMeg = Cookies.get('show-answer');
          console.log('showMeg', showMeg);
          if (showMeg === undefined || showMeg === null) {
            //可以答题，给出答题提示
            setIsMessageInfoModalVisible(true);
            Cookies.set('show-answer', 'yes', { expires: 1 });
          }
        }
      }
    });
    initFun(exerciseId);
  }, []);

  useEffect(() => {
    console.log('exerciseId', exerciseId);
    change(exerciseId);
  }, [exerciseId]);

  const initFun = (exerciseId: number) => {
    //根据作业id、班级id，查询全部习题，用于题目上下切换
    getExamExerciseList(clazzId, examId).then((result) => {
      console.log('initFun', result);
      if (result.obj) {
        setExerciseList(result.obj);
        const index = result.obj.findIndex(
          (item: API.StudentExamExercise) => item.exerciseId === exerciseId,
        );
        console.log('result[index]', result[index]);
        setButtons(index, result.obj.length);
      }
    });
  };

  /**
   * 查询习题详情
   */
  const QueryExercise = () => {
    getExamExerciseById(clazzId, examId, examClassId, exerciseId).then((result: any) => {
      if (result.obj) {
        setExercise(result.obj);
      }
    });
  };

  const change = (exerciseId: number) => {
    QueryExercise();
    const index = exerciseList.findIndex(
      (item: API.StudentExamExercise) => item.exerciseId === exerciseId,
    );
    setButtons(index, exerciseList.length);
    //清空评测结果
    setExecuteResult(undefined);
  };

  /**
   * 切换习题，上一题和下一题
   * @param next 是否下一题
   */
  const changeExercise = (next: boolean) => {
    const index = exerciseList.findIndex(
      (item: API.StudentExamExercise) => item.exerciseId === exerciseId,
    );
    console.log('next index exerciseList', next, index, exerciseList.length);
    //校验题目是否可以上下题切换
    if (index === 0 && !next) {
      //如果是第一题，并且点击的上一题
      message.info('已经到顶了...');
      setButtons(index, exerciseList.length);
      return;
    } else if (exerciseList.length === index + 1 && next) {
      //如果是最后一题，并且点击了下一题
      message.info('已经到底了...');
      setButtons(index, exerciseList.length);
      return;
    }

    if (next) {
      history.push(
        `/stu/course/exam/exercise/${courseId}/${clazzId}/${examId}/${examClassId}/${exerciseList[index + 1].exerciseId
        }`,
      );
    } else {
      history.push(
        `/stu/course/exam/exercise/${courseId}/${clazzId}/${examId}/${examClassId}/${exerciseList[index - 1].exerciseId
        }`,
      );
    }
  };

  /**
   * 上下题目按钮的处理
   */
  const setButtons = (index: number, exerciseListLength: number) => {
    console.log('setButtons index,exerciseList', index, exerciseListLength);
    if (exerciseListLength <= 1) {
      //只有1道题，全部禁用
      setTopButtonDisabled(true);
      setNextButtonDisabled(true);
    } else if (index === 0) {
      setTopButtonDisabled(true);
      setNextButtonDisabled(false);
    } else if (exerciseListLength === index + 1) {
      setTopButtonDisabled(false);
      setNextButtonDisabled(true);
    } else {
      setTopButtonDisabled(false);
      setNextButtonDisabled(false);
    }
  };
  // 测试运行
  const testRunAnswer = async (value: { answer: string; usageTime: number }) => {
    //wait窗口
    setIsWaitModalVisible(true);
    //显示窗口为测试运行
    setSubmitType(1);
    //测试提交答案
    examStuTestRunAnswer({ ...value, exerciseId: exerciseId, examId: examId, examClassId: examClassId }).then(
      (result: any) => {
        setIsWaitModalVisible(false);
        if (result.success) {
          if (result.obj) {
            setExecuteResult(result.obj);
            if (result.obj.executeRs && Object.keys(result.obj.studentResultMap).length == 3) {
              setColumnList(result.obj.studentResultMap.column);
              setDatatype(result.obj.studentResultMap.datatype);
              setResultSet(result.obj.studentResultMap.result);
              setResultSetModalVisible(true);
            }
          }
        } else {
          message.error(result.message);
        }
      },
    );
  };

  /**
   * 答题结果提示
   * @param type 
   * @param scoreRs 
   */
  const openNotification = (type: number, scoreRs: boolean) => {
    // type: -1=>出错,0=>答案错误,1=>答案正确
    if (type == -1) {
      exerciseAnswerNotifiedExcetion(`习题${exercise?.exerciseId} : 提交失败 ! 请稍后重试`);
    } else if (type == 0) {
      exerciseAnswerNotifiedFail(`习题${exercise?.exerciseId} : 评阅完成 , 回答错误`);
    } else {
      exerciseAnswerNotifiedSucc(`习题${exercise?.exerciseId} : 评阅完成 , 回答正确`);
    }
  };

  // 提交答案
  const onFinish = async (value: { answer: string; usageTime: number }) => {
    //wait窗口
    setIsWaitModalVisible(true);
    //显示窗口为测试运行
    setSubmitType(0);
    //提交答案
    examSubmitAnswer({ ...value, exerciseId: exerciseId, sclassId: clazzId, examId: examId, examClassId: examClassId }).then(
      (result: any) => {
        setIsWaitModalVisible(false);
        if (result.success) {
          setExecuteResult(result.obj);
          if (result.obj.scoreRs) {
            openNotification(1, true);
          } else {
            openNotification(0, false);
          }
        } else {
          message.error(result.message);
        }
        initFun(exerciseId);
      },
    );
  };
  const menuProps = { active: 'exam', clazzId: clazzId, courseId: courseId };

  const [resultSetModalVisible, setResultSetModalVisible] = useState<boolean>(false);
  const [columnList, setColumnList] = useState([]);
  const [datatype, setDatatype] = useState([]);
  const [resultSet, setResultSet] = useState([]);

  return (
    <div className="flex stu-answer">
      <StudentMenu {...menuProps} />
      <Row className="content">
        <Col span={12} className="page-container">
          <LeftColumn
            exam={exam!}
            exercise={exercise!}
            changeExercise={(next: boolean) => changeExercise(next)}
            topButtonDisabled={topButtonDisabled}
            nextButtonDisabled={nextButtonDisabled}
          />
        </Col>
        <Col span={12} className="page-container">
          <RightColumn
            testRunAnswer={(value: { answer: string; usageTime: number }) => testRunAnswer(value)}
            onFinish={(value: { answer: string; usageTime: number }) => onFinish(value)}
            submitType={submitType}
            executeResult={executeResult}
            stuAnswer={exercise?.studentAnswer || ''}
            isCanAnswer={isCanAnswer}
            exerciseId={exercise?.exerciseId}
          />
        </Col>
      </Row>

      <Modal
        width={250}
        bodyStyle={{ top: 24, right: 0 }}
        closable={false}
        open={isWaitModalVisible}
        maskClosable={false}
        footer={null}
      >
        <Space>
          <LoadingOutlined />
          验证答案中，请稍后......
        </Space>
      </Modal>

      {/* 结果集 */}
      <ResultSetModal
        onCancel={() => {
          setResultSetModalVisible(false);
        }}
        resultSetModalVisible={resultSetModalVisible}
        columnList={columnList}
        datatype={datatype}
        resultSet={resultSet}
      />

      <Modal
        width={600}
        title="答题注意事项"
        open={isMessageInfoModalVisible}
        onCancel={() => {
          setIsMessageInfoModalVisible(false);
        }}
        footer={null}
      >
        <div>
          <p>在使用平台进行SQL语句评测时请注意以下几点，以减少出现无法通过评测的情况：</p>
          <p>① 请严格按照题目要求提交SQL语句</p>
          <p>② 没有特别说明的，不可随意为结果字段起别名</p>
          <p>③ 严格按照题目中要求的结果字段顺序，不可随意改变结果字段顺序</p>
          <p>④ 没有特别说明的，不可随意为结果集排序</p>
        </div>
      </Modal>

      <Modal
        width={600}
        title="答题注意事项"
        open={classIsEndVisible}
        onCancel={() => {
          setClassIsEndVisible(false);
        }}
        footer={null}
      >
        <div>
          <p>答题时间已截止，不能再进行答题。</p>
        </div>
      </Modal>
    </div>
  );
};

export default Answer;
