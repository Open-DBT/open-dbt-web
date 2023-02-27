import { history } from 'umi';
import '@/pages/home.less';
import '@/pages/home/less/teacher.less'
import { API } from '@/common/entity/typings';

export default (props: {
  sclassList: API.SclassRecord[],
  handleDelSclass?: (values: API.SclassRecord) => void
}) => {

  return (
    <div className="flex wrap sclass-list">
      {props.sclassList.map((sclass, index) => {
        //未开始
        let divCss = 'border-not-start';
        let stateName = '未开始';
        let labelCss = 'label-not-start';
        if (sclass.isEnd === 0) {
          divCss = 'border-starting';
          stateName = '进行中';
          labelCss = 'label-starting';
        } else if (sclass.isEnd === 1) {
          divCss = 'border-finished';
          stateName = '已结课';
          labelCss = 'label-finished';
        }
        return (
          <div className={`tea-sclass-card ${divCss}`} style={{ marginRight: index >= 2 && index % 3 === 2 ? '0px' : '20px' }}
            onClick={() => history.push(`/teacher/class/${sclass.id}/info`)} key={index}
          >
            <div className="sclass-card-content">
              <div className={`sclass-state ${labelCss}`}>{stateName}</div>
              <div className="sclass-name">{sclass.className}</div>
              <div className="sclass-course-name">
                {/* <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-class-name-2.svg')} /> */}
                课程：
                {sclass.course?.courseName}
              </div>
              <div className="sclass-start-end-time">
                {/* <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-time.svg')} /> */}
                时间：
                {sclass.classStart}~{sclass.classEnd}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

// {
//   sclass.isEnd === -1 ?
//     <div className="tea-sclass-card border-not-start" style={{ marginRight: index >= 2 && index % 3 === 2 ? '0px' : '20px' }}
//       onClick={() => history.push(`/teacher/class/${sclass.id}/info`)} key={sclass.id}
//     >
//       <div className="sclass-card-content">
//         <div className="sclass-state label-not-start">未开始</div>
//         <div className="sclass-name">{sclass.className}</div>
//         <div className="sclass-course-name">
//           <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-class-name-2.svg')} />
//           {sclass.course?.courseName}
//         </div>
//         <div className="sclass-start-end-time">
//           <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-time.svg')} />
//           {sclass.classStart}~{sclass.classEnd}
//         </div>
//       </div>
//     </div> : null
// }
// {
//   sclass.isEnd === 0 ?
//     <div className="tea-sclass-card border-starting" style={{ marginRight: index >= 2 && index % 3 === 2 ? '0px' : '20px' }}
//       onClick={() => history.push(`/teacher/class/${sclass.id}/info`)} key={sclass.id}
//     >
//       <div className="sclass-card-content">
//         <div className="sclass-state label-starting">进行中</div>
//         <div className="sclass-name">{sclass.className}</div>
//         <div className="sclass-course-name">
//           <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-class-name-2.svg')} />
//           {sclass.course?.courseName}
//         </div>
//         <div className="sclass-start-end-time">
//           <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-time.svg')} />
//           {sclass.classStart}~{sclass.classEnd}
//         </div>
//       </div>
//     </div> : null
// }
// {
//   sclass.isEnd === 1 ?
//     <div className="tea-sclass-card border-finished" style={{ marginRight: index >= 2 && index % 3 === 2 ? '0px' : '20px' }}
//       onClick={() => history.push(`/teacher/class/${sclass.id}/info`)} key={index}
//     >
//       <div className="sclass-card-content">
//         <div className="sclass-state label-finished">已结课</div>
//         <div className="sclass-name">{sclass.className}</div>
//         <div className="sclass-course-name">
//           <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-class-name-2.svg')} />
//           {sclass.course?.courseName}
//         </div>
//         <div className="sclass-start-end-time">
//           <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-time.svg')} />
//           {sclass.classStart}~{sclass.classEnd}
//         </div>
//       </div>
//     </div> : null
// }