import { useEffect, useState } from 'react';
import { getAllSclassByStuIdExpectCourse } from '@/services/teacher/clazz/sclass';
import Course from '@/pages/components/course-list/StudentCourse';
import { API } from '@/common/entity/typings';
const course = (props: any) => {
  const [sclassList, setSclassList] = useState<API.SclassRecord[]>([]); //新建

  useEffect(() => {
    getAllSclassByStuIdExpectCourse().then((result) => {
      if (result.obj) setSclassList(result.obj);
    });
  }, []);

  return (
    <div className="home">
      <Course sclassList={sclassList} />
    </div>
  );

};
export default course;
