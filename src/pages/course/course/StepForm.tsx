import React, { useState, useEffect, useRef } from 'react';
import { Card, Steps } from 'antd';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import styles from './style.less';
import { getCourseDetail } from '@/services/teacher/course/course';
import { API } from '@/common/entity/typings';

const { Step } = Steps;

interface IRef extends React.RefObject<HTMLDivElement> {
  toSubmitData: () => void;
}

const StepForm = (props: any) => {
  const [stepComponent, setStepComponent] = useState(<div />);
  const [currentStep, setCurrentStep] = useState(0);
  const [course, setCourse] = useState<API.CourseDetailRecord>();
  const formRef:any = useRef<IRef>();

  useEffect(() => {
    getCourseDetail(props.match.params.courseId).then((result) => {
      setCourse(result.obj)
    })
  }, []);

  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent(currentStep);
    setCurrentStep(step);
    setStepComponent(component);
  }, [course]);

  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent(currentStep);
    setCurrentStep(step);
    setStepComponent(component);
  }, [currentStep]);

  /**
   * 切换tab
   * @param current 选中tab
   */
  const handleChange = async (current: number) => {
    //保存当前页面数据
    await formRef?.current?.toSubmitData()
    //切换tab
    setCurrentStep(current)
  }

  // 切换组件
  const getCurrentStepAndComponent = (current: number) => {
    switch (current) {
      case 1:
        return {
          step: 1,
          component: <Step2 ref={formRef} course={course!} />,//知识树,此处需要优化
        };
      case 2:
        return {
          step: 2,
          component: <Step3 course={course} />,//场景
        };
      case 3:
        return {
          step: 3,
          component: <Step4 course={course} />,//习题
        };
      case 4:
        return {
          step: 4,
          component: <Step5 course={course!} />,//确认信息
        };
      case 0:
      default:
        return {
          step: 0,
          component:
            <Step1 ref={formRef} course={course!} setCourse={(v) => setCourse(v)} />,//课程简介
        };
    }
  };

  return (
    <>
      <Card bordered={false}>
        <>
          <Steps current={currentStep} className={styles.steps} onChange={(current) => handleChange(current)}>
            <Step title="课程信息" description="设置课程简介和大纲，点击 [保存设置] 进行下一步" />
            <Step title="认知知识树" description="这里是设置认知知识树，点击 [保存修改] 继续下一步" />
            <Step title="场景" description="这里是设置场景，用于设置习题" />
            <Step title="习题" description="这里是设置习题" />
            <Step title="确认" description="完成创建操作，切换到学生端查看" />
          </Steps>
          {stepComponent}
        </>
      </Card>
    </>
  );
};

export default StepForm;
