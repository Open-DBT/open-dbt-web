import { useState, useEffect } from 'react'
import './common.less';
import { forwardRef, useImperativeHandle } from 'react'
import BraftEditor from './components/editor/braft/braft';
import { Button, Form, Input, Select, Tooltip, message, Divider, Modal } from 'antd';
import { useParams } from 'umi'
import { saveExercise } from '@/services/teacher/course/question-create';
import { saveExerciseInfoByModel } from '@/services/teacher/task/task';
import CODE_CONSTANT from '@/common/code'
import { QUESTION_BANK } from '@/common/entity/questionbank'
import BraftPanel from './components/editor/braft/index';
const { Option } = Select;
const arrList = CODE_CONSTANT.arrList   // 选择题排序数组
import { EditorState } from 'braft-editor';
import SuperIcon from "@/pages/components/icons";
import KnowledgeModal from '../knowledge'

interface IProps {
    onInit: QUESTION_BANK.QuestionExercise | null;
    compType?: string;
    clickTaskQuestion?: () => void;
    resetClick?: () => void;
}
const Multiple = forwardRef((props: IProps, ref) => {
    const { onInit, compType, clickTaskQuestion, resetClick } = props;

    // 将父组件的方法暴露出来
    useImperativeHandle(ref, () => ({
        clickSave: sumbitClick,
        continueAnswer: sumbitFlash
    }))
    const [form] = Form.useForm();
    const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
    const [selectIndex, setSelectIndex] = useState<number>(-1)  // 编辑器显示的位置序列
    const [prefixList, setPrefixList] = useState<number[]>([])
    const courseId = Number(params.courseId);
    const exerciseId = params.exerciseId ? Number(params.exerciseId) : (compType == 'task-edit' ? Number(onInit?.id) : -1);
    let parentId = params.parentId ? Number(params.parentId) : (compType == 'task-edit' ? Number(onInit?.parentId) : 0);
    const modelId = Number(onInit?.modelId);
    const [knowList, setKnowList] = useState<QUESTION_BANK.Knowledge[]>([]);
    const [knowListId, setKnowListId] = useState<number[]>([]);
    const [knowModelVisible, setKnowModelVisible] = useState<boolean>(false)
    const initialValues = getOptions(onInit);
    const [score, setScore] = useState(onInit?.exerciseScore);

    useEffect(() => {
        if (onInit && onInit.standardAnswser) {
            const num = convertToNum(onInit.standardAnswser);
            setPrefixList(num)
        }
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
    }, [])

    /**
     * 获取answer转成num数组
     */
    const convertToNum = (standardAnswser: string): number[] => {
        //standardAnswser =>  [A,B,C]
        const Str = standardAnswser.split(',');
        const _num = Str.map((element) => arrList.indexOf(element));
        return _num;
    }
    const onFinish = (values: QUESTION_BANK.QuestionExercise) => {
        if (!onValidateData(values)) return
        let isExit = false;
        values.exerciseInfos = [];
        for (let index = 0; index < values.options.length; index++) {
            const element = values.options[index];
            if (element == undefined) {
                //用于新建选项
                message.info('请移除没有输入的选项！')
                isExit = true;
                break;
            } else if ((element as QUESTION_BANK.QuestionExerciseOption).content) {
                //选项没有做过任何修改
                values.exerciseInfos.push({
                    id: -1,  // 自增id
                    exerciseId: -1,//习题id
                    prefix: arrList[index],
                    content: (element as QUESTION_BANK.QuestionExerciseOption).content
                })
            } else {
                //用于编辑选项，返回的是editor对象                
                if ((element as EditorState).toHTML() == '<p></p>') {
                    message.info('请移除没有输入的选项！')
                    isExit = true;
                    break;
                }
                values.exerciseInfos.push({
                    id: -1,  // 自增id
                    exerciseId: -1,//习题id
                    prefix: arrList[index],
                    content: (element as EditorState).toHTML()
                })
            }
        }
        //判断是否有无效的选项
        if (isExit) return;
        if (prefixList.length == 0) {
            message.info('请选择正确答案！')
            return;
        }
        //添加答案
        const selected: string[] = []
        values.exerciseInfos.map((item, index) => {
            if (prefixList.indexOf(index) > -1) {
                selected.push(item.prefix)
            }
        })
        values.standardAnswser = selected.join(',');

        //题干描述
        if (typeof (values.stemEditor) != 'string') {
            values.stem = values.stemEditor.toHTML();
        }
        //答案解析
        if (typeof (values.exerciseAnalysisEditor) != 'string' && values.exerciseAnalysisEditor != null) {
            values.exerciseAnalysis = values.exerciseAnalysisEditor.toHTML();
        } else values.exerciseAnalysis = values.exerciseAnalysisEditor
        values.id = exerciseId
        values.parentId = Number(parentId);
        values.courseId = courseId
        values.elementType = 0;
        values.exerciseType = 2;
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
        if (initialValues.bandingModel) {
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
                    if (localStorage.getItem('refresh-question')) localStorage.removeItem('refresh-question')
                    else localStorage.setItem('refresh-question', '1')
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
        form.validateFields()
            .then(values => {
                const data = onFinish(values)
                if (data) bolUseSave(data, bol)
            }).catch(errorInfo => { return false })
    }

    /**
     * 选中/取消选中答案
     */
    const bolListPefix = (name: number) => {
        if (initialValues.bandingModel) return
        if (prefixList.includes(name)) {
            setPrefixList(prefixList.filter(item => item != name))
        }
        else {
            setPrefixList([...prefixList, name]);
        }
    }
    /**
     * 设置当前选项为焦点
     * @param value 
     */
    const setCurrent = (value: number) => {
        setSelectIndex(value)
    }
    /**
     * 对选项值进行处理
     * @param init 
     * @returns 
     */
    function getOptions(values: QUESTION_BANK.QuestionExercise | null) {
        if (values) {
            parentId = values.parentId
            const exerciseInfos = values.exerciseInfos;
            const options = exerciseInfos.map((item, index) => item);
            values.stemEditor = values.stem;
            values.exerciseAnalysisEditor = values.exerciseAnalysis;
            return { ...values, options };
        } else {
            return {
                options: Array(4).fill(undefined),
                exerciseLevel: 1,
                knowledges: [] as QUESTION_BANK.Knowledge[],
                bandingModel: false
            };
        }
    }
    /**
     * 移除选项
     * @param name 下表，非唯一键
     */
    const removeOption = (name: number) => {
        const newList = prefixList.map(element => {
            if (element > name) return element - 1;
            return element;
        })
        setPrefixList(newList);
    }
    /**
     * 自定义验证表单数据
     * @param value 表单数据 
     */
    const onValidateData = (value: QUESTION_BANK.QuestionExercise) => {
        if (!value.stemEditor || value.stemEditor == '<p></p>' || (typeof value.stemEditor != 'string' && value.stemEditor.isEmpty())) {
            message.warning('请填写题目描述')
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
                    多选题
                    {
                        compType == 'task-edit' && <> <Input placeholder="" value={score} style={{ width: '50px', margin: '0 10px' }} onChange={onChangeScore} />分</>
                    }
                </div>
                <div className='card-content'>
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
                        <Form.Item name="stem" hidden={true}><Input /></Form.Item>
                        <Form.Item name="exerciseAnalysis" hidden={true}><Input /></Form.Item>
                        <Form.Item name="standardAnswser" hidden={true}><Input /></Form.Item>

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
                        <Form.List name="options">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => {
                                        // console.log(key, name, restField)
                                        return (
                                            <div style={{ display: 'flex', padding: '5px 0' }} key={'field' + key}>
                                                <Tooltip placement="leftTop" title="设为答案">
                                                    <Button style={{ marginRight: '20px' }} className={prefixList.includes(name) ? 'answserClass' : ''} onClick={() => { bolListPefix(name) }}>
                                                        {arrList[name]}
                                                    </Button>
                                                </Tooltip>
                                                <div style={{ width: '100%' }}>
                                                    <BraftPanel flag={selectIndex == key} form={form} formName="options" setCurrent={() => setCurrent(key)} optionNumber={name} />
                                                </div>
                                                {
                                                    initialValues.bandingModel != true && <img style={{ marginLeft: '10px' }} onClick={() => { remove(name); removeOption(name) }} src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>
                                                }

                                            </div>
                                        )
                                    }
                                    )}
                                    {
                                        initialValues.bandingModel != true &&
                                        <Form.Item>
                                            <div onClick={() => { add() }} style={{ color: '#00CE9B', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' }}>
                                                <SuperIcon type="icon-jiahao" style={{ marginRight: '5px' }} />添加选项
                                            </div>
                                        </Form.Item>

                                    }

                                </>
                            )}
                        </Form.List>
                        <Divider />
                        <Form.Item
                            label="答案解析"
                            name="exerciseAnalysisEditor"
                        >
                            {
                                // analysisNumber !== 0 ? <Input placeholder="输入答案解析" readOnly onClick={() => setAnalysisNumber(0)} /> :
                                <BraftEditor className="border" placeholder="请输入正文内容" />
                            }
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
                            <Select placeholder="请选择" style={{ maxWidth: '200px' }}>
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

export default Multiple