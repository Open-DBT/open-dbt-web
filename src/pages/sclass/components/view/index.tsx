import { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import Step1 from './step1';
import Step2 from './step2';
import { querySclass } from '@/services/teacher/clazz/sclass'
import { getCourseDetail } from '@/services/teacher/course/course'

const defaultState = {
  id: -1,
  className: '',
  classDesc: '',
  classStart: '',
  classEnd: ''
}

const sclassView = (props: any) => {
  const [sclass, setSclass] = useState<API.SclassRecord>(defaultState);
  const [courseName, setCourseName] = useState<string>();

  useEffect(() => {
    querySclass(props.match.params.sclassId).then((result) => {
      getCourseDetail(result.obj.courseId).then((courseDetailResult) => {
        setCourseName(courseDetailResult.obj.courseName);
      });
      setSclass(result.obj);
    });
  }, []);


  return (
    <>
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" type="card"
          items={[
            {
              key: "1",
              label: '班级信息',
              children:
                <Step1 sclass={sclass} courseName={courseName!} />
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

export default sclassView;
