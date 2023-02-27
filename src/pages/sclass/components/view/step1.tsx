import { Typography, Divider } from 'antd';
const { Title, Paragraph } = Typography;

type IProps = {
  sclass: API.SclassRecord,
  courseName: string;
}

const step1: React.FC<IProps> = (props) => {

  const { sclass, courseName } = props;

  return (
    <Typography>
      <Title level={4}>班级名称</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {sclass.className}
      </Paragraph>

      <Title level={4}>班级简介</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {(sclass.classDesc && sclass.classDesc.trim().length > 0) ? (sclass.classDesc) : ('无')}
      </Paragraph>

      <Title level={4}>开班课程</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {courseName}
      </Paragraph>

      {/* <Title level={4}>开课时间</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {(sclass.classStart && sclass.classStart.trim().length > 0) ? (sclass.classStart) : ('无')}——
      </Paragraph>

      <Title level={4}>结课时间</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {(sclass.classEnd && sclass.classEnd.trim().length > 0) ? (sclass.classEnd) : ('无')}
      </Paragraph> */}
      <Title level={4}>开课时间</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {sclass.classStart && sclass.classStart.trim().length > 0 ? sclass.classStart+'—'+sclass.classEnd : '无'}
      </Paragraph>      
    </Typography>
  );
};

export default step1;
