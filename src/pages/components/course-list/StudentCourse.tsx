import { history } from 'umi';
import '@/pages/home.less';
import '@/pages/home/less/student.less'
import * as APP from '@/app';
import { API } from '@/common/entity/typings';

const startTo = (clazz: API.SclassRecord) => {
    history.push(`/stu/course/info/${clazz.course?.courseId}/${clazz.id}`);
};
export default (props: { sclassList: API.SclassRecord[] }) => {
    return (
        <>
            <div className="title-4 home-title">我的课程</div>
            <div className="flex wrap course-list">
                {props.sclassList.map((sclass, index) => {
                    return (
                        <div className="course-card" key={index} onClick={() => startTo(sclass)}>
                            {sclass.isEnd === 1 ? <div className="course-state">课程已结束</div> : null}
                            {sclass.isEnd === -1 ? <div className="course-state">课程未开始</div> : null}
                            <div className="course-photo">
                                <img src={APP.request.prefix + sclass.course?.coverImage!}></img>
                            </div>
                            <div className="card-text">
                                <p className="course-name">{sclass.course?.courseName}</p>
                                <p className="course-time">
                                    {/* <img
                                        src={require('@/img/student/icon-time.svg')}
                                        style={{ margin: '-3px 10px 0px 0px' }}
                                    /> */}
                                    时间：
                                    {sclass.classStart}~{sclass.classEnd}
                                </p>
                                <p className="course-creator">
                                    {/* <img
                                        src={require('@/img/student/icon-teacher.svg')}
                                        style={{ margin: '-3px 10px 0px 0px' }}
                                    /> */}
                                    老师：
                                    {sclass.course?.creatorName}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
