import { API } from '@/common/entity/typings';
export const getGroup = (roleList: API.RoleListItem[]): string => {
  const kczj = roleList.filter(item => item.roleId === 2)[0];
  const js = roleList.filter(item => item.roleId === 3)[0];
  const xs = roleList.filter(item => item.roleId === 4)[0];

  if (kczj && js) {
    return "0";
  } else if (js && xs) {
    return "1"; //教师角色
  } else {
    return "2";//学生角色
  }
}

export const getRoleIds = (group: string): number[] => {
  if (group === "0") {
    return [2, 3];
  } else if (group === "1") {
    return [3, 4]
  } else {
    return [4]
  }
}
