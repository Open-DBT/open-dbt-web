import React, { useState, useEffect } from 'react'
import './common.less';
import { forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Select, message, Divider, Button, Modal } from 'antd';
import { saveExercise } from '@/services/teacher/course/question-create';
import BraftEditor from './components/editor/braft/braft';
const { Option } = Select;
import { useParams } from 'umi'
import CODE_CONSTANT from '@/common/code'
import { QUESTION_BANK } from '@/common/entity/questionbank'
import { saveExerciseInfoByModel } from '@/services/teacher/task/task';
import SuperIcon from "@/pages/components/icons";
import KnowledgeModal from '../knowledge'
interface IProps {
    onInit: QUESTION_BANK.QuestionExercise | null;
    compType?: string;
    clickTaskQuestion?: () => void;
    resetClick?: () => void;
}
const Space = forwardRef((props: IProps, ref) => {
    const { onInit, compType, clickTaskQuestion, resetClick } = props;
    // 将父组件的方法暴露出来
    useImperativeHandle(ref, () => ({
        clickSave: sumbitClick,
        continueAnswer: sumbitFlash
    }))
    // const courseId = props.match.params.courseId;
    const [form] = Form.useForm();
    const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
    const courseId = Number(params.courseId);
    const exerciseId = params.exerciseId ? Number(params.exerciseId) : (compType == 'task-edit' ? Number(onInit?.id) : -1); // 习题id
    let parentId = params.parentId ? Number(params.parentId) : (compType == 'task-edit' ? Number(onInit?.parentId) : 0); // 上级id（所在文件夹id）
    const modelId = Number(onInit?.modelId);
    const [knowList, setKnowList] = useState<QUESTION_BANK.Knowledge[]>([]);
    const [knowListId, setKnowListId] = useState<number[]>([]);
    const [knowModelVisible, setKnowModelVisible] = useState<boolean>(false)
    const initialValues = getOptions(onInit);
    const [score, setScore] = useState(onInit?.exerciseScore);// 分数
    /**
     * 对选项值进行处理
     * @param init 
     * @returns 
     */
    function getOptions(values: QUESTION_BANK.QuestionExercise | null) {
        if (values) {
            parentId = values.parentId
            values.stemEditor = values.stem;
            values.exerciseAnalysisEditor = values.exerciseAnalysis;
            return { ...values };
        } else {
            return {
                knowledges: [] as QUESTION_BANK.Knowledge[],
                exerciseLevel: CODE_CONSTANT?.exerciseLevelList[0].value,
                banding_model: false
            }
        }
    }
    useEffect(() => {
        if (initialValues.knowledges && initialValues.knowledges.length != 0) {
            let knowledges: QUESTION_BANK.Knowledge[] = [];
            let knowledgesId: number[] = [];
            initialValues.knowledges.map((item: QUESTION_BANK.Knowledge, index: number) => {
                knowledges.push({ knowledgeId: item.knowledgeId, progress: item.progress, name: item.name });
                knowledgesId.push(item.knowledgeId)
            })
            setKnowList(knowledges)
            setKnowListId(knowledgesId)
        }
    }, []);
    /**
     * @description 提交表单
     * @param value 表格数据
    */
    const onFinish = (values: QUESTION_BANK.QuestionExercise) => {
        if (!onValidateData(values)) return
        if (values.exerciseInfos.length != 0) {
            values.exerciseInfos.map((item: QUESTION_BANK.QuestionExerciseOption, index: number) => {
                item.prefix = index + 1
            })
        } else {
            message.warning('请添加空格')
            return
        }
        if (typeof (values.stemEditor) != 'string') {
            values.stem = values.stemEditor.toHTML();
        }
        if (typeof (values.exerciseAnalysisEditor) != 'string' && values.exerciseAnalysisEditor != null) {
            values.exerciseAnalysis = values.exerciseAnalysisEditor.toHTML();
        } else values.exerciseAnalysis = values.exerciseAnalysisEditor
        values.id = exerciseId
        values.parentId = Number(parentId)
        values.courseId = courseId
        values.elementType = 0;
        values.exerciseType = 4;
        if (knowListId.length != 0) {
            let arr: QUESTION_BANK.Knowledge[] = []
            knowListId.map((item, index) => {
                arr.push({
                    knowledgeId: item,
                    progress: index
                })
            })
            values.knowledges = arr
        }
        return values
    };
    /**
   * 
   * @param values 表单数据
   * @param continueBol 判断是否继续出题
   */
    const bolUseSave = (values: QUESTION_BANK.QuestionExercise, continueBol: boolean) => {
        if (initialValues.banding_model) {
            Modal.confirm({
                title: '修改确认框',
                content: '已经在使用中，确定要修改吗？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    saveExerciseFun(values, continueBol)
                },
                onCancel() {
                    return
                }
            });
        } else {
            saveExerciseFun(values, continueBol)
        }
    }
    // 调用保存题库接口
    const saveExerciseFun = (values: QUESTION_BANK.QuestionExercise, continueBol: boolean) => {
        if (compType != 'task-edit') {
            saveExercise(values).then((res) => {
                if (res.success) {
                    message.success('保存成功');
                    localStorage.setItem('refresh-question', '1')
                    if (continueBol) {
                        history.go(0)
                    } else {
                        setTimeout(() => window.close(), 1000)
                    }
                } else {
                    return false;
                }
            })
        } else {
            values.exerciseScore = score
            values.modelId = modelId
            console.log("Taskvalues:", values)
            saveExerciseInfoByModel(values).then((res) => {
                if (res.success) {
                    message.success('保存成功');
                    if (clickTaskQuestion)
                        clickTaskQuestion()
                } else {
                    return false;
                }
            })
        }
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    /**
     * 点击取消按钮
     */
    const resetClickButton = () => {
        if (resetClick)
            resetClick()
    }
    /**
  * 
  * 点击继续做题。保存，并刷新表单数据
  */
    const sumbitFlash = () => {
        sumbitClick(true)
    }
    const sumbitClick = (bol: boolean = false) => {
        form
            .validateFields()
            .then(values => {
                const data = onFinish(values)
                if (data) bolUseSave(data, bol)
            })
            .catch(errorInfo => {
                return false
            })
    }
    /**
    * 自定义验证表单数据
    * @param value 表单数据 
    */
    const onValidateData = (value: QUESTION_BANK.QuestionExercise) => {

        if (!value.stemEditor || value.stemEditor == '<p></p>' || (typeof value.stemEditor != 'string' && value.stemEditor.isEmpty())) {
            message.warning('请填写题目描述')
            return
        } if (value.exerciseInfos.filter((item) => item.content == '' || item.content == null).length != 0) {
            message.warning('空格内容不能为空')
            return
        } else if (!value.exerciseLevel) {
            message.warning('请选择难易程度')
            return
        } else if (!value.exerciseName) {
            message.warning('请输入题目名称')
            return
        }
        return true
    }
    /**
     * 修改分数
     */
    const onChangeScore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setScore(e.target.value.trim())
    };
    return (
        <>
            <div className='question-content-card'>
                <div className='title'>
                    {CODE_CONSTANT.questionType[3]}
                    {
                        compType == 'task-edit' && <> <Input placeholder="" value={score} style={{ width: '50px', margin: '0 10px' }} onChange={onChangeScore} />分</>
                    }
                </div>
                <div className='card-content'>
                    <Form.Item name="stem" hidden={true}><Input /></Form.Item>
                    <Form.Item name="exerciseAnalysis" hidden={true}><Input /></Form.Item>
                    <Form
                        name="basic"
                        form={form}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={initialValues}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="题目名称"
                            name="exerciseName"
                        >
                            <Input placeholder="输入题目名称" />
                        </Form.Item>

                        <Form.Item
                            label="题目描述"
                            name="stemEditor"
                        >
                            <BraftEditor className="border" placeholder="请输入正文内容" />
                        </Form.Item>
                        <Form.List name="exerciseInfos" initialValue={[{}]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div style={{ display: 'flex' }} key={'field' + key}>
                                            <Form.Item name={[name, 'content']} label={`空格 ${name + 1}`} style={{ width: '100%' }}>
                                                <Input style={{ width: '100%' }} />
                                            </Form.Item>
                                            {
                                                initialValues.banding_model != true && <img style={{ marginLeft: '10px' }} onClick={() => { remove(name) }} src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>
                                            }

                                        </div>
                                    ))}
                                    {
                                        initialValues.banding_model != true && <div onClick={() => { add() }} style={{ color: '#00CE9B', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' }}><SuperIcon type="icon-jiahao" style={{ marginRight: '5px' }} />添加空格</div>
                                    }

                                </>
                            )}
                        </Form.List>
                        <Form.Item>
                            <div className="remark">
                                1. 一个空有多种答案时请用";"隔开。如：答案一;答案二 <br></br>
                                2. 若试题答案是数字，可设置范围，两个数字之间用"-"。如：1-9，学生填写1到9之间的数字都算正确（包括1和9）
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="答案解析"
                            name="exerciseAnalysisEditor"
                        >
                            <BraftEditor className="border" placeholder="请输入正文内容" />
                        </Form.Item>
                        <Form.Item name="knowledges-edit" label="知识点">
                            <Button type="dashed" style={{ marginBottom: '20px' }} onClick={() => setKnowModelVisible(true)}>
                                <SuperIcon type="icon-icon-add-2" />关联知识点
                            </Button>
                            <div>

                                <div className="flex wrap" style={{ height: 'auto', lineHeight: '30px', marginBottom: 6 }}>
                                    已绑定：
                                    {
                                        knowList.length != 0 && knowList.map((item: QUESTION_BANK.Knowledge, index: number) => {
                                            return <div key={index}
                                                style={{ backgroundColor: '#FDDF66', padding: '0 10px 0 10px', margin: '0 10px 6px 0' }}>
                                                {item.name}</div>
                                        })
                                    }
                                </div>
                            </div>
                        </Form.Item>
                        <Form.Item label="难易程度" name="exerciseLevel">
                            <Select placeholder="请选择" allowClear style={{ maxWidth: '200px' }}>
                                {
                                    CODE_CONSTANT?.exerciseLevelList.map((item, index) => {
                                        return <Option value={item.value} key={index}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        {
                            compType == 'task-edit' &&
                            <div style={{ textAlign: 'right' }}>
                                <Button style={{ borderRadius: '5px', marginRight: '20px' }} onClick={() => { resetClickButton() }}>
                                    <SuperIcon type="icon-chehui" />取消
                                </Button>
                                <Button type="primary" style={{ borderRadius: '5px', marginRight: '40px' }} onClick={() => { sumbitClick() }}>
                                    <SuperIcon type="icon-baocun" />完成
                                </Button>
                            </div>
                        }
                    </Form>
                </div>
            </div>
            <KnowledgeModal
                onCancel={() => {
                    setKnowModelVisible(false);
                }}
                onSubmit={(arr: QUESTION_BANK.Knowledge[], arrId: number[]) => {
                    setKnowList(arr)
                    setKnowListId(arrId)
                    setKnowModelVisible(false);
                }}
                selectIds={knowListId}
                moveModelVisible={knowModelVisible}></KnowledgeModal>
        </>
    )
})

export default Space