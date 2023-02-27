// 通用异步接口
function getAjax(url , type, data, async,callback,...args) {
    let urlLast = 'http://192.168.8.253:8080/open-dbt/'
    $.ajax({
        url: urlLast + url,
        async: async,
        type: type,
        data: data,
        success:function(result){
            callback(result,...args)
        },
        error : function(e){
           console.log('请求失败')
        }
});
}