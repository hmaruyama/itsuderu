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
  return response;
}

// 設定経路の表示
function showViaList() {
  var dp_ar_stations = ls.dp.name + " => " + ls.ar.name;
  return ls.via.name ? dp_ar_stations + " " + ls.via.name + "経由" : dp_ar_stations;
}

// lsの初期化
function setLs() {
  var ls = {
    dp: {code: {}, name: {}},
    ar: {code: {}, name: {}},
    via: {code: {}, name: {}},
  };
  ls = {
    dp: firstStoreLocalStorage('dp'),
    ar: firstStoreLocalStorage('ar'),
    via: firstStoreLocalStorage('via')
  };
  return ls;

  // localStrageへの代入
  function firstStoreLocalStorage(local_storage) {
    return ls[local_storage] = localStorage[local_storage] ? JSON.parse(localStorage[local_storage]) : {};
  }
}