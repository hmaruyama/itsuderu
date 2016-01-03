var ls = setLs();

// テキストボックスの初期値設定
$('#dp_station').val(ls.dp.name);
$('#ar_station').val(ls.ar.name);
$('#via_station').val(ls.via.name);


document.getElementById('station_check').onclick = function() {
  var dp_station = $('#dp_station').val();
  var ar_station = $('#ar_station').val();
  var via_station = $('#via_station').val();

  if (dp_station && ar_station) {
    $('div#step2').empty();
    $('div#step2').append('<h2>Step2. 駅を選択しよう</h2>');
    showStationList(dp_station, "出発地", 'dp_station');
    showStationList(ar_station, "到着地", 'ar_station');
    via_station ? showStationList(via_station, "経由地", 'via_station') : 0;
    $('div#step2').append('<button id="save">save!</button>');

  };
  document.getElementById('save').onclick = function() {
    secondStoreLocalStorage('dp_station_select', 'dp');
    secondStoreLocalStorage('ar_station_select', 'ar');
    via_station ? secondStoreLocalStorage('via_station_select', 'via') : removeLocalStrage('via');
    showSavedStations();

  }
};

showSavedStations();

function removeLocalStrage(local_storage) {
  localStorage.removeItem(local_storage);
  ls[local_storage] = {};
}

function secondStoreLocalStorage(id, local_storage) {
  var select = document.getElementById(id);
  var selected_index = select.selectedIndex;
  localStorage[local_storage] = JSON.stringify({
    code: select.options[selected_index].value.toString(),
    name: select.options[selected_index].text
  });
  ls[local_storage] = JSON.parse(localStorage[local_storage]);
}

function showStationList(station_name, text, name) {
  var params = {
    name: station_name
  };
  var station_list = stationList(getResponse('/station/light', params));
  $('div#step2').append('<form name="' + name + '" id="' + name + '_form">' + text + '</form>');
  $('form[name=' + name + ']').append('<select name="' + name + '" id="' + name + '_select" size="1"/>')
  for (var i = 0; i < station_list.length; i++) {
    $('select[name=' + name + ']').append('<option value="' + station_list[i].code + '">' + station_list[i].name + '</option>');
  };
}

// 設定した設定を表示
function showSavedStations() {
  // 出発駅または到着駅が設定されていなければ表示しない
  if (ls.dp.code != undefined && ls.ar.code != undefined) {
    $('h2#save_succeed').text('現在の設定');
    $('p#saved_stations').text(showViaList());
  };
}

function stationList(response) {
  var stations = new Array();
  if (response.ResultSet.Point instanceof Array) {
    for (var i = 0; i < response.ResultSet.Point.length; i++) {
      stations[i] = {
        name: response.ResultSet.Point[i].Station.Name,
        code: response.ResultSet.Point[i].Station.code
      };
    };
  } else if (response.ResultSet.Point instanceof Object) {
      stations[0] = {
        name: response.ResultSet.Point.Station.Name,
        code: response.ResultSet.Point.Station.code
      };
  } else {
  };
  return stations;
}
