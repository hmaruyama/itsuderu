function getResponse(path, params) {
  var response;
  $.ajax({
    type: 'GET',
    url: 'http://api.ekispert.jp/v1/json' + path,
    data: decodeURIComponent($.param(params)),
    dataType: 'json',
    async: false
  })
  .done(function(data) {
    response = data;
  })
  .fail(function(XHR, textStatus, errorThrown) {
    alert(errorThrown);
  });
  console.log(response);
  return response;
}