import { Typography, Divider } from 'antd';
const { Title, Paragraph } = Typography;
import { isNotEmptyBraft } from '@/utils/utils';
import { API } from '@/common/entity/typings';


interface IProps {
  course: API.CourseDetailRecord;
};

const CourseInfo: React.FC<IProps> = (props) => {

  const { course } = props;

  return (
    <Typography>
      <Title level={4}>课程名称</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {course.courseName}
      </Paragraph>

      <Title level={4}>课程简介</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {course.courseDesc && course.courseDesc.trim().length > 0 ? course.courseDesc : '无'}
      </Paragraph>

      <Title level={4}>课程大纲</Title>
      <Divider />
      <Paragraph>
        {isNotEmptyBraft(course.courseOutline) ?
          <div dangerouslySetInnerHTML={{ __html: course.courseOutline! }} />
          : '无'}
      </Paragraph>
    </Typography>
  );
}

export default CourseInfo;