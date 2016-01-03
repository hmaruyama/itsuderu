// WebAPIの呼び出し
function getResponse(path, params) {
  var response;
  $.ajax({
    type: 'GET',
    url: 'https://er2pf9h3ie.execute-api.ap-northeast-1.amazonaws.com/prod' + path,
    data: decodeURIComponent($.param(params)),
    headers: {
      'Content-Type': 'application/json'
    },
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