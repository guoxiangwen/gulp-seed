!function () {
    $.ajax({
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