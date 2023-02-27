var CODE_CONSTANT = {
    // 创建题目的列表排序
    questionType: ['单选题', '多选题', '判断题', '填空题', '简答题', 'SQL编程题'],
    exerciseLevel: ['简单', '一般', '困难'],    // 难度显示文字
    //接口对应的题目类型索引名称
    typeName: {
        '1': '单选题',
        '2': '多选题',
        '3': '判断题',
        '4': '填空题',
        '5': '简答题',
        '6': 'SQL编程题'
    },
    // 字母选择题排序
    arrList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    // 难易程度数组
    exerciseLevelList: [
        { name: '简单', value: 1 },
        { name: '一般', value: 2 },
        { name: '困难', value: 3 }
    ]
};

export default CODE_CONSTANT;