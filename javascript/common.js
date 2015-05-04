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

// lsの初期化
function setLs() {
  var ls = {
    dp: {code: {}, name: {}},
    ar: {code: {}, name: {}},
    via: {code: {}, name: {}},
  };
  console.log(ls);
  ls = {
    dp: firstStoreLocalStorage('dp'),
    ar: firstStoreLocalStorage('ar'),
    via: firstStoreLocalStorage('via')
  };
  return ls;

  // localStrageへの代入
  function firstStoreLocalStorage(local_storage) {
    console.log(ls);
    return ls[local_storage] = localStorage[local_storage] ? JSON.parse(localStorage[local_storage]) : {};
  }
}