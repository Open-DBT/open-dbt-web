import { TablePaginationConfig, message } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { QUESTION_BANK } from '@/common/entity/questionbank';

/**
 * 查询题库列表
 * @param courseId 
 * @param clazzId 
 * @returns 
 */
// export async function api_getExercise(dates: {
//     current: number;
//     pageSize: number;
//     sorter: Record<string, SortOrder>,
//     param?: {
//         parentId: number,
//         courseId_list: number[],
//         knowledgeId_list: number[],
//         exercise_type_list: number[]
//     }
// }) {
//     let fieldOrder = '';
//     if (dates.sorter) {
//         const str = dates.sorter;
//         for (var key in str) {
//             fieldOrder = `${key} ${str[key] === 'ascend' ? 'asc' : 'desc'}`;
//         }
//     }
//     const data: QUESTION_BANK.QuestionBankListParam = {
//         orderBy: fieldOrder,
//         pageNum: dates.current,
//         pageSize: dates.pageSize,
//         // ...dates
//         param: dates.param!
//     }
//     console.log('data', data)
//     // debugger
//     const rs = await request<API.Result<API.PageHelper<QUESTION_BANK.QuestionBankRecord>>>('/exercise/getExercise', { method: 'POST', data: data });
//     if (rs.success)
//         return {
//             data: rs.obj.pageList.list,
//             total: rs.obj.pageList.total,
//         }
//     else {
//         return {
//             data: [],
//             total: 0
//         }
//     }
// }
export async function api_getExercise(data: any) {
    console.log(data);
    // debugger
    // const data: any = {
    //     orderBy: orderBy,
    //     pageNum: pageNum,
    //     pageSize: pageSize,
    //     param: {
    //         parentId: 0,
    //         courseId_list: [14],
    //         knowledgeId_list: [],
    //         exercise_type_list: []
    //     }
    // }
    const rs = await request<API.Result<QUESTION_BANK.ExerciseRecord>>('/exercise/getExercise', { method: 'POST', data: data });
    if (rs.success)
        return {
            count: rs.obj.exerciseCount,
            list: rs.obj.pageList.list,
            pagination: { current: rs.obj.pageList.pageNum, pageSize: rs.obj.pageList.pageSize, total: rs.obj.pageList.total },
        }
    else {
        return {
            count: 0,
            list: [],
            pagination: { current: 1, total: 0, pageSize: 10 },
        }
    }
}