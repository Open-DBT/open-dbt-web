import React, { useState } from 'react'
import CODE_CONSTANT from '@/common/code'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { QUESTION_BANK } from '@/common/entity/questionbank'
import { Button, Divider, Form, Input, message, Modal, Space } from 'antd';
import { TASK } from '@/common/entity/task';
import BraftEditor from '../../braft/braft';
import { API } from '@/common/entity/typings';
import ViewModal from '@/pages/common-course/scene/components/ViewModal';
import { stuTestRunAnswer } from '@/services/teacher/course/score';
import ResultSetModal from '@/pages/course/exercise/components/ResultSetModal';
import { LoadingOutlined } from '@ant-design/icons';
interface IProps {
    taskList: TASK.ReviewSortExercises[];
    subExamList: TASK.TaskSumbitExerciseParam[]
}
const AnswserBySort = (props: IProps) => {
    const taskList = props.taskList
    const [resultSetModalVisible, setResultSetModalVisible] = useState<boolean>(false);
    const [examList, setExamList] = useState<TASK.TaskSumbitExerciseParam[]>(props.subExamList);  // 作业的习题参数列表
    const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
    const [stepFormValues, setStepFormValues] = useState<API.SceneListRecord>();
    const [columnList, setColumnList] = useState([]);
    const [datatype, setDatatype] = useState([]);
    const [resultSet, setResultSet] = useState([]);
    const [executeResult, setExecuteResult] = useState<API.SubmitResult>();
    const [isWaitModalVisible, setIsWaitModalVisible] = useState<boolean>(false);
    // 单选题内容修改
    const onChangeSingle = (val: string, index: number) => {
        let arr = examList;
        arr[index].exerciseResult = val
        setExamList([...arr])
    }
    // 多选题内容修改
    const onChangeMultiple = (val: string, index: number) => {
        let arr = examList;
        let arrStr = arr[index].exerciseResult
        let multArr = arrStr != '' ? arrStr.split(',') : []
        if (multArr.includes(val)) {
            multArr = multArr.filter(item => item != val)
        }
        else {
            multArr.push(val);
        }
        arr[index].exerciseResult = multArr != null ? multArr.join(',') : ''
        setExamList([...arr])
    }
    // 判断题内容修改
    const onChangeJudge = (val: string, index: number) => {
        let arr = examList;
        arr[index].exerciseResult = val
        setExamList([...arr])
    }
    // 编辑器内容修改
    const onChangeBraft = (val: any, index: number) => {
        let valueStr = val.toHTML()
        let arr = examList;
        arr[index].exerciseResult = valueStr
        setExamList([...arr])
    }
    // sql内容修改
    const onChangeSql = (value: string, index: number) => {
        let valueStr = value
        let arr = examList;
        arr[index].exerciseResult = valueStr
        setExamList([...arr])
    }
    // 空格内容修改
    const onChangeSpace = (e: any, index: number, currentIndex: number) => {
        let arr = examList;
        let arrStr = arr[index].exerciseResult
        let multArr: string []= []
        if (arrStr != '') {
            multArr = arrStr.split('@_@')
            multArr[currentIndex] = e.target.value
        }
        arr[index].exerciseResult = multArr != null ? multArr.join('@_@') : ''
        setExamList([...arr])
    }
    /**
     * 测试运行
     * @returns 
     */
    const testRun = (answer: string, item: TASK.ReviewSortExercises) => {
        if (answer.length == 0) {
            message.info('请输入答案')
            return;
        }
        testRunAnswer({ answer: answer, usageTime: 0 }, item)
    }
    // 测试运行
    const testRunAnswer = async (value: { answer: string; usageTime: number }, item: TASK.ReviewSortExercises) => {
        setIsWaitModalVisible(true);

        //测试提交答案
        stuTestRunAnswer({ ...value, exerciseId: item.exerciseId }).then((result: any) => {
            setIsWaitModalVisible(false);
            if (result.success) {
                if (result.obj) {
                    setExecuteResult(result.obj);
                    if (!result.obj.executeRs) {
                        message.error(result.obj.log);
                        return
                    }
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
        });
    };

    return (
        <div>
            {
                taskList && taskList.map((item: TASK.ReviewSortExercises, index: number) => {
                    return <div key={"list-sort" + index} id={"id-sort" + index}>
                        <div>
                            <span className='card-list-title task-title'>
                                {index + 1}. {item.exercise.exerciseName}
                            </span>
                            <span className='card-list-desc desc'>（{CODE_CONSTANT.questionType[item.exerciseType - 1]}，{item.exerciseActualScore}分）</span>
                        </div>
                        <div className='card-label'>
                            <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.exercise.stem }}></div>
                        </div>
                        {/* 判断题 */}
                        {
                            item.exerciseType == 3 &&
                            <>
                                <div className='card-select'>
                                    <Button shape="circle" className={examList[index].exerciseResult == '1' ? 'clcikAnswserClass' : ''} onClick={() => { onChangeJudge('1', index) }}>
                                        A
                                    </Button>
                                    <span style={{ marginLeft: '20px' }}>正确</span>
                                </div>
                                <div className='card-select'>
                                    <Button shape="circle" className={examList[index].exerciseResult == '2' ? 'clcikAnswserClass' : ''} onClick={() => { onChangeJudge('2', index) }}>
                                        B
                                    </Button>
                                    <span style={{ marginLeft: '20px' }}>错误</span>
                                </div>
                            </>
                        }
                        {/* 单选题 */}
                        {
                            item.exerciseType == 1 && item.exercise.exerciseInfos.map((eItem: QUESTION_BANK.QuestionExerciseOption, eIndex: number) => {
                                return <div key={'single' + eIndex} style={{ display: 'flex' }}>
                                    <Button shape="circle" className={eItem.prefix == examList[index].exerciseResult ? 'clcikAnswserClass' : ''} onClick={() => { onChangeSingle(eItem.prefix, index) }}>
                                        {eItem.prefix}
                                    </Button>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: eItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                                </div>
                            })
                        }
                        {/* 多选题 */}
                        {
                            item.exerciseType == 2 &&
                            item.exercise && item.exercise.exerciseInfos.map((sItem: QUESTION_BANK.QuestionExerciseOption, sIndex: number) => {
                                return <div key={'multiple' + sIndex} style={{ display: 'flex' }}>
                                    <Button onClick={() => { onChangeMultiple(sItem.prefix, index) }} className={examList[index].exerciseResult?.split(',').includes(sItem.prefix) ? 'clcikAnswserClass' : ''}>
                                        {sItem.prefix}
                                    </Button>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: sItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                                </div>
                            })
                        }
                        {/* 填空题 */}
                        {
                            item.exerciseType == 4 &&
                            <>
                                {item.exercise.exerciseInfos.map((tItem: any, tIndex: number) => (
                                    <div style={{ display: 'flex' }} key={'field' + tIndex}>
                                        <Form.Item label={`空格 ${tIndex + 1}`} style={{ width: '100%' }}>
                                            <Input style={{ width: '100%' }} value={examList[index].exerciseResult.split('@_@')[tIndex]} onChange={(e) => onChangeSpace(e, index, tIndex)} />
                                        </Form.Item>
                                    </div>
                                ))}
                            </>
                        }
                        {/* 简答题或者sql编程题 */}
                        {
                            item.exerciseType == 5 && <BraftEditor className="border" placeholder="请输入正文内容" value={examList[index].exerciseResult} onChange={(val) => onChangeBraft(val, index)} />
                        }
                        {
                            item.exerciseType == 6 && <>
                                <Button style={{ marginRight: 8, marginBottom: 10 }} className="gray-button button-radius continue-button" onClick={() => { setViewModalVisible(true); setStepFormValues(item.exercise.scene) }}>场景查看</Button>
                                <Button style={{ marginRight: 8 }} type="primary" className="gray-button button-radius" onClick={() => { testRun(examList[index].exerciseResult, item) }}>测试运行</Button>
                                <AceEditor
                                    value={examList[index].exerciseResult}
                                    style={{ width: '100%', height: '100px', fontSize: '1rem' }}
                                    // placeholder="Placeholder Text1"
                                    mode="mysql"
                                    theme="github"
                                    name="stu-answer"
                                    onChange={(val) => onChangeSql(val, index)}
                                    fontSize={18}
                                    showPrintMargin={true} //打印边距
                                    showGutter={true}//行号
                                    highlightActiveLine={true}//突出显示活动线
                                    editorProps={{ $blockScrolling: true }} //自动补全
                                    setOptions={{
                                        enableBasicAutocompletion: true,//自动补全
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 2,
                                        useWorker: false //自动补全
                                    }} />
                            </>
                        }
                        <Divider />
                    </div>
                })
            }
            {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
                <ViewModal
                    onCancel={() => {
                        setViewModalVisible(false);
                    }}
                    viewModalVisible={viewModalVisible}
                    scene={stepFormValues}
                />
            ) : null}
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
        </div>
    )
}

export default AnswserBySort