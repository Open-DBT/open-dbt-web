import { Icon } from "antd";
import { createFromIconfontCN } from '@ant-design/icons';
import icon from "./iconfont"; // 引入的inconfont文件
const SuperIcon = createFromIconfontCN({
  scriptUrl: icon, // 关键
});

export default SuperIcon;
