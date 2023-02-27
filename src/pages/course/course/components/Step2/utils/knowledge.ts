import { treeObj } from '@/pages/knowledgeTree/Graph/MindMap'



/**
 * 递归根据id查询当前对象
 * @param {*} list 
 * @param {*} id 
 * @returns 
 */
export const getKnowLedgeInfo = (list: treeObj[], id: number) => {
    let result: treeObj | undefined;
    list.map((item: treeObj) => {
        if (result) return;
        if (item.id === id) result = item;
        else result = getKnowLedgeInfo(item.children, id)
    })
    return result
}

/**
 * 获取选中节点父类
 * @param data Knowledge
 * @param id 
 * @returns Knowledge
 */
export const getKnowLedgeParent = (data: treeObj, id: number) => {
    let result: treeObj | undefined;
    data.children.map((element: treeObj, index: number) => {
        if (result) return;
        if (element.id === id) {
            result = data;
            return;
        }
        result = getKnowLedgeParent(element, id);
    })
    return result;
}