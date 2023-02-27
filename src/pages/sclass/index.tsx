import { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import Step1 from './components/Step1';
import Step2 from './components/Step2';

import { querySclass } from '@/services/teacher/clazz/sclass'
import { queryOwnCourse } from '@/services/teacher/course/course'
import { API } from '@/common/entity/typings';
const defaultState = {
  id: -1,
  className: '',
  classDesc: '',
  classStart: '',
  classEnd: ''
}

const StepForm = (props: any) => {
  const [sclass, setSclass] = useState<API.SclassRecord>(defaultState);
  const [course, setCourse] = useState<API.CourseDetailRecord[]>([]);

  useEffect(() => {
    querySclass(props.match.params.sclassId).then((result) => {
      setSclass(result.obj)
    })

    queryOwnCourse({ current: 1, pageSize: 100 }).then((result) => {
      setCourse(result.data)
    })
  }, []);


  return (
    <>
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" type="card"
          items={[
            {
              key: "1",
              label: '手动添加',
              children:
                <Step1 sclass={sclass} course={course} />
            }, {
              key: "2",
              label: '学生信息',
              children:
                <Step2 sclass={sclass} />
            }
          ]}
        />
      </Card>
    </>
  );
};

export default StepForm;
