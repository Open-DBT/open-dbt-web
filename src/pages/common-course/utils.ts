
const constant = "course-new:";

export const saveCourseStorage = (courseId: string, step: number): void => {
  const course_status = localStorage.getItem(constant + courseId);
  if (course_status) {
    const strAry = course_status.split('');
    console.log('strAry ', strAry)
    strAry[`${step}`] = '1';
    //全部保存成功，移除缓存，不再显示导航
    if (strAry['1'] === '1' && strAry['2'] === '1' && strAry['3'] === '1' && strAry['4'] === '1'&& strAry['5'] === '1') {
      localStorage.removeItem("course-new:" + courseId);
      return;
    }
    localStorage.setItem("course-new:" + courseId, strAry.join(''))
  }
}
export const getCourseStorage = (courseId: string): string | null => {
  return localStorage.getItem(constant + courseId)
}


