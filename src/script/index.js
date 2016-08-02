!function () {
    $.ajax({
        // url: 'http://cnodejs.org/api/v1/topics?tab=all&page=1&limit=10&mdrender=false',
        url: '/openrest/v1/open/ipp/product/categorys',
        type: 'get',
        success: function (data) {
            console.log(data)
        },
        error: function (err) {
            console.error(err);
        }
    })
} ()