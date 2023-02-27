import { Button } from 'antd';
import { history } from 'umi';
import * as APP from '@/app';
import { API } from '@/common/entity/typings';
interface IProps {
    clazz: API.SclassRecord;
}

/**
 * 学生端-课程首页
 * @param props 
 * @returns 
 */
const home = (props: IProps) => {
    const { clazz } = props;
    return (
        <>
            <div className="course-info">
                <div className="flex" style={{ justifyContent: 'space-between' }}>
                    <div className="left">
                        <h1 className="title-7">{clazz.course?.courseName}</h1>
                        <div className="flex">
                            <div className="start-time">
                                <p>开课时间</p>
                                <p>
                                    {/* <img
                                        src={require('@/img/student/icon-time.svg')}
                                        style={{ margin: '-3px 10px 0px 0px' }}
                                    /> */}
                                    时间：
                                    {clazz.classStart}~{clazz.classEnd}
                                </p>
                                <p>
                                    {/* <img
                                        src={require('@/img/student/icon-teacher.svg')}
                                        style={{ margin: '-3px 10px 0px 0px' }}
                                    /> */}
                                    老师：
                                    {clazz.course?.creatorName}
                                </p>
                            </div>
                            <div className="info-item student">
                                <p className="title-4">{clazz.stuNumber}</p>
                                <p>学生</p>
                            </div>
                            <div className="info-item knowledge">
                                <p className="title-4">{clazz.knowledgeNumber}</p>
                                <p>知识点</p>
                            </div>
                            <div className="info-item execrise">
                                <p className="title-4">{clazz.exerciseNumber}</p>
                                <p>练习题</p>
                            </div>
                        </div>
                        <div className="desc">{clazz.course?.courseDesc}</div>
                    </div>
                    <div className="right">
                        <img src={APP.request.prefix! + clazz.course?.coverImage!}></img>
                    </div>
                </div>
                <Button
                    className="btn"
                    style={{ margin: '12px 14px 0px 0px' }}
                    onClick={() => {
                        history.push(`/stu/course/knowledge/list/${clazz.courseId}/${clazz.id}`);
                    }}
                >
                    课程练习&nbsp;&nbsp;
                    <img src={require('@/img/student/icon-start-white.svg')} width="11px" height="9px" style={{ marginBottom: 2 }}></img>
                </Button>
                <Button
                    className="btn"
                    onClick={() => {
                        history.push(`/stu/course/statis/${clazz.courseId}/${clazz.id}`);
                    }}
                >
                    学习统计&nbsp;&nbsp;<img src={require('@/img/student/icon-start-white.svg')} width="11px" height="9px" style={{ marginBottom: 2 }}></img>
                </Button>
            </div>
        </>
    )
}

export default home;