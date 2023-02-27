import { getChinaMonth, getEnglishMonth } from '@/utils/utils'

export const getlearnTimeYYMMDD = (value: string): string => {
  if (value)
    return value.split(" ")[0];
  return '';
}

export const learnTimeMonth = (value: string): string => {
  if (!value) {
    return '';
  }
  const time1 = value.split(" ")[0];
  const month = time1.split("-")[1];
  const index = getChinaMonth().findIndex((item) => item === month);
  return getEnglishMonth()[index];
}
export const learnTimeDay = (value: string): string => {
  if (!value) {
    return '';
  }
  const time1 = value.split(" ")[0];
  return time1.split("-")[2];
}
