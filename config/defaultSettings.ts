import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#00CE9B',//daybreak'
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  pwa: false,
  //logo和title可以放到app.tsx设置
  title: '',
  logo: '',
  iconfontUrl: '',
  //add
  headerHeight: 56,
  menu: {locale: false},
  splitMenus: false
};

export default Settings;
