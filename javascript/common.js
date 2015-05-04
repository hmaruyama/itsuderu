// WebAPIの呼び出し
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

// 設定経路の表示
function showViaList(via) {
  var dp_ar_stations = ls.dp.name + " => " + ls.ar.name;
  return via ? dp_ar_stations + " " + ls.via.name + "経由" : dp_ar_stations;
}