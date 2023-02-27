import { API } from '@/common/entity/typings';
type IProp = {
  sclass: API.SclassRecord | undefined;
  sclassId: string;
  navProps: any;
};
const Index = (props: IProp) => {
  return (
    <>
      {
          <div className="card-header-title">
            <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-class-name1.svg')} />
            {props.sclass?.className}  &nbsp;&nbsp;
            <img style={{ margin: '-3px 10px 0px 20px' }} src={require('@/img/teacher/icon-lesson-name.svg')} />
            {props.sclass?.course?.courseName}      
          </div>
      }
    </>
  );
};
export default Index;
