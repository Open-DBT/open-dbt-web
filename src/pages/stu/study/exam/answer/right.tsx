import { useEffect, useState } from 'react';
import { Button, Typography, message } from 'antd';
import AceEditor from "react-ace";
import formateTime from '../utils/formateTime';
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-language_tools";
import React from 'react';

const { Paragraph } = Typography;

const areEqual = (prevProps, nextProps) => {
    if (prevProps.exerciseId === nextProps.exerciseId
        && prevProps.executeResult === nextProps.executeResult) {
        return true
    } else {
        return false
    }
}

const RightColumn = (props: any) => {
    const {
        exerciseId,
        stuAnswer,
        testRunAnswer,
        onFinish,
        submitType,
        executeResult,
        isCanAnswer
    } = props;
    const [answer, setAnswer] = useState<string>('');
    useEffect(() => {
        console.log('RightColumn useEffect exerciseId .....', exerciseId,stuAnswer);
        setAnswer(stuAnswer)
    }, [exerciseId])    

    useEffect(() => {
        console.log('RightColumn useEffect stuAnswer .....', stuAnswer);
        setAnswer(stuAnswer)
    }, [stuAnswer])

    const setVal = (newValue: string) => {
        setAnswer(newValue)
    }
    /**
     * 测试运行
     * @returns 
     */
    const testRun = () => {
        if (answer.length === 0) {
            message.info('请输入答案')
            return;
        }
        testRunAnswer({ answer: answer, usageTime: 0 })
    }
    /**
     * 提交答案
     * @returns 
     */
    const submit = () => {
        if (answer.length === 0) {
            message.info('请输入答案')
            return;
        }
        onFinish({ answer: answer, usageTime: 0 })
    }
    return (
        <div className="right">
            <div className="flex right-title-div">
                <div className="tab"><img src={require('@/img/student/icon-code-active.svg')} width="17px" height="9px" />&nbsp;我的代码</div>
            </div>
            <div style={{ background: '#fff' }}>
                <div className="flex right-title-div">
                    {
                        answer.length === 0 || !isCanAnswer ?
                            <Button type="primary" className="right-title-button" disabled={true} style={{ marginRight: 12 }} size="small">测试运行</Button>
                            :
                            <Button type="primary" size="small"
                                style={{
                                    marginRight: 12,
                                    background: '#EEEEEE',
                                    borderColor: '#EEEEEE',
                                    color: '#333333',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                }}
                                onClick={() => testRun()}
                            >
                                测试运行
                            </Button>
                    }
                    {
                        answer.length === 0 || !isCanAnswer ?
                            <Button type="primary" className="right-title-button" disabled={true} size="small">提交答案</Button>
                            :
                            <Button type="primary" size="small"
                                className="right-title-button"
                                onClick={() => submit()}
                            >
                                提交答案
                            </Button>
                    }
                    <div style={{ color: '#2db7f5', fontWeight: 700, fontSize: 16, marginLeft: 'auto' }}>
                        {/* <span>用时：{formateTime(usageTime)}</span> */}
                    </div>
                </div>
                <div>
                    <AceEditor
                        value={answer}
                        style={{ width: '100%', height: 'calc(100vh - 20rem)', fontSize: '1rem' }}
                        mode="mysql"
                        theme="github"
                        name="stu-answer"
                        onChange={(newValue) => setVal(newValue)}
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
                </div>
            </div>
            <div style={{ background: '#fff', borderTop: '1px solid #ddd' }}>
                {executeResult && Object.keys(executeResult).length ? (
                    <div style={{ padding: "30px" }}>
                        {
                            submitType === 0 ?
                                //提交答案
                                <div>
                                    {/* <Title level={5} style={{ color: 'orange' }}>运行结果：</Title> */}
                                    <div className="title-3">运行结果: </div>
                                    <Paragraph>
                                        SQL语法{executeResult.executeRs ? '正确' : '错误'}，结果{executeResult.scoreRs ? '正确' : '错误'}
                                        {executeResult.log ? <span><br />JDBC日志：{executeResult.log}</span> : null}
                                        {executeResult.errorMessage && !executeResult.scoreRs ? <span style={{ color: '#FF6B6B' }}><br />错误提示：{executeResult.errorMessage}</span> : null}
                                    </Paragraph>
                                    {/* <Title level={5}>练习总用时：</Title>
                                    <Paragraph>执行时间：{formateTime(executeResult.usageTime)}</Paragraph> */}
                                    <div>
                                        <span className="title-3">执行时间: </span>
                                        <span className="right-answer-execute-div">{executeResult.answerExecuteTime}ms</span>
                                    </div>
                                    {/* <div>
                                        {
                                            executeResult.list.map((ele: API.KnowledgeListRecord, index: number) => {
                                                return <Tag key={index} color={getKnowledgeColor()[index]}>{ele.name}</Tag>
                                            })
                                        }
                                    </div> */}
                                </div> :
                                //测试运行
                                <div>
                                    <div className="title-3">运行结果: </div>
                                    <Paragraph className="right-answer-execute-div">
                                        SQL语法{executeResult.executeRs ? '正确' : '错误'}
                                        {executeResult.log ? <span><br />JDBC日志：{executeResult.log}</span> : null}
                                    </Paragraph>
                                    <div>
                                        <span className="title-3">执行时间: </span>
                                        <span className="right-answer-execute-div">{executeResult.answerExecuteTime}ms</span>
                                    </div>
                                    {/* <Title level={5} >运行结果: </Title>
                                    <Paragraph className="right-answer-execute-div">
                                        SQL语法{executeResult.executeRs ? '正确' : '错误'}
                                        {executeResult.log ? <span><br />JDBC日志：{executeResult.log}</span> : null}
                                    </Paragraph>
                                    <Title level={5} >执行时间: <span className="right-answer-execute-div">10ms</span></Title>
                                    {/* <Paragraph>
                                        SQL语法{executeResult.executeRs ? '正确' : '错误'}
                                        {executeResult.log ? <span><br />JDBC日志：{executeResult.log}</span> : null}
                                    </Paragraph> */}
                                </div>
                        }
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default React.memo(RightColumn, areEqual)