import { Card, Button, Tag, Space } from 'antd';
import { isNotEmptyBraft } from '@/utils/utils';
import { getKnowledgeColor } from '@/utils/utils';
import Highlight from 'react-highlight';
//import 'highlight.js/styles/foundation.css'
import 'highlight.js/styles/magula.css'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import { API } from '@/common/entity/typings';
import { history } from 'umi';

interface IProp {
    changeExercise: (value: boolean) => void;
    exam:API.ExamClassListRecord;
    exercise: API.StudentExamExercise;
    topButtonDisabled: boolean;
    nextButtonDisabled: boolean;
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.exercise === nextProps.exercise
        && prevProps.topButtonDisabled === nextProps.topButtonDisabled
        && prevProps.nextButtonDisabled === nextProps.nextButtonDisabled
    ) {
        return true
    } else {
        return false
    }
}

const LeftColumn = (props: IProp) => {
    const {
        changeExercise,
        exam,
        exercise,
        topButtonDisabled,
        nextButtonDisabled,
    } = props;
    console.log('LeftColumn props', props)
    return (
        <div className="left">
            <div className="flex content-title">
                <div className="title-3">{exam?.course?.courseName}</div>
                <div className="tools">
                    <Button
                        style={{ marginRight: 12 }}
                        size="small"
                        className={topButtonDisabled ? 'disabled' : ''}
                        disabled={topButtonDisabled}
                        onClick={() => changeExercise(false)}
                    >
                        <LeftOutlined style={{ marginRight: -8 }} />上一题
                    </Button>
                    <Button
                        size="small"
                        className={nextButtonDisabled ? 'disabled' : ''}
                        disabled={nextButtonDisabled}
                        onClick={() => changeExercise(true)}
                    >
                        下一题<RightOutlined style={{ marginLeft: 3 }} />
                    </Button>
                </div>
            </div>
            <div className="markdown-body">
                <Card bordered={false}>
                    <Space size="middle">
                        <div className="exercise-id">#{exercise?.exerciseId}</div>
                        <div className="title-5">{exercise?.exerciseName}</div>
                    </Space>
                    <div className="title-3" style={{ marginTop: 20 }}>习题描述</div>
                    {
                        isNotEmptyBraft(exercise?.exerciseDesc) ?
                            <div className="exercise-desc" dangerouslySetInnerHTML={{ __html: exercise?.exerciseDesc! }} />
                            : <div className="exercise-desc">无</div>
                    }
                    <div style={{ clear: 'both' }}></div>
                    {
                        isNotEmptyBraft(exercise?.sceneDesc) ?
                            <div dangerouslySetInnerHTML={{ __html: exercise?.sceneDesc! }} />
                            : '无'
                    }
                    <div style={{ clear: 'both' }} />
                    <div className="shell">
                        {
                            exercise?.initShell === '' ? '无' :
                                <Highlight language="sql">
                                    {exercise?.initShell}
                                </Highlight>

                        }
                    </div>
                    <div style={{ clear: 'both' }} />
                </Card>
            </div>
        </div>
    )
}

export default React.memo(LeftColumn, areEqual)