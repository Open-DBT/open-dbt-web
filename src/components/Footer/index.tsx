import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {

  return (
    <DefaultFooter
      copyright="2020 瀚高基础软件股份有限公司"
      links={
        [
          //   {
          //     key: 'Ant Design Pro',
          //     title: 'Ant Design Pro',
          //     href: 'https://pro.ant.design',
          //     blankTarget: true,
          //   },
          //   {
          //     key: 'github',
          //     title: <GithubOutlined />,
          //     href: 'https://github.com/ant-design/ant-design-pro',
          //     blankTarget: true,
          //   },
          //   {
          //     key: 'Ant Design',
          //     title: 'Ant Design',
          //     href: 'https://ant.design',
          //     blankTarget: true,
          //   },
        ]
      }
    />
  );
};

export default Footer;
