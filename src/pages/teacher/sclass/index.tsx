import { useState, useEffect } from 'react';
import { getMyCourseList } from '@/services/teacher/course/course';
import { getStartingSclassByTeacher, getEndedSclassByTeacher, deleteSclassById, updateClass } from '@/services/teacher/clazz/sclass';
import { Button, message, Modal } from 'antd';
import Sclass from '@/pages/components/sclass-components/teacherSclass';
import { history } from 'umi';
import SclassForm from '@/pages/home/components/SclassForm'
import '@/pages/home.less';
import './index.less'

const TeacherSclass = (props: any) => {
  const [classModalVisible, handleClassModalVisible] = useState<boolean>(false);//新建班级
  const [myCourseList, setMyCourseList] = useState<API.CourseListItem[]>([]); //我的课程
  const [myStartingSclassList, setMyStartingSclassList] = useState<API.SclassRecord[]>([]); //我的未开始和进行中的班级
  const [myEndSclassList, setMyEndSclassList] = useState<API.SclassRecord[]>([]); //我的已结束的班级

  useEffect(() => {
    getMyCourseList().then((result) => {
      if (result.success) setMyCourseList(result.obj);
    });

    getMyStartingSclass();

    getEndedSclassByTeacher().then((result) => {
      if (result.success) setMyEndSclassList(result.obj);
    });
  }, []);

  const getMyStartingSclass = () => {
    getStartingSclassByTeacher().then((result) => {
      if (result.success) setMyStartingSclassList(result.obj);
    });
  }

  //删除班级
  const delSclass = async (sclass: API.SclassRecord) => {
    Modal.confirm({
      title: `删除`,
      content: `确定删除班级【${sclass.className}】吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await deleteSclassById(sclass.id);
          if (result.success) {
            message.success('删除成功');
            getMyStartingSclass();
          } else {
            message.error(result.message)
          }
        } catch (error) {
          message.error('删除失败，请重试');
          console.log('error ', error)
        }
      },
    });
  };

  return (
    <div className="home">
      <div className="flex title-button-div">
        <div className="title-5">我的班级</div>
        <div className="buttons-div">
          <Button type="primary" onClick={() => handleClassModalVisible(true)}>
            <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-add-1.svg')} />
            新开班级
          </Button>
        </div>
      </div>
      <div>
        <Sclass
          sclassList={myStartingSclassList}
          handleDelSclass={(value: API.SclassRecord) => {
            delSclass(value);
          }}
        />
      </div>
      <div className="title-3 end-title-div">已结课</div>
      <div>
        <Sclass
          sclassList={myEndSclassList}
        />
      </div>

      <SclassForm
        onSubmit={async (value: API.SclassRecord) => {
          const success = await updateClass(value);
          if (success) {
            handleClassModalVisible(false);
            history.push(`/teacher/class/${success.obj.id}/info`)
          }
        }}
        onCancel={() => {
          handleClassModalVisible(false);
        }}
        createModalVisible={classModalVisible}
        course={myCourseList}
      />
    </div>
  );
};

export default TeacherSclass;
