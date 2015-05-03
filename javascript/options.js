var dp_station = document.getElementsByName('dp_station')[0];
var ar_station = document.getElementsByName('ar_station')[0];
var via_station = document.getElementsByName('via_station')[0];

var ls = {
  dp: {},
  ar: {},
  via: {},
};

ls = {
  dp: firstStoreLocalStorage('dp'),
  ar: firstStoreLocalStorage('ar'),
  via: firstStoreLocalStorage('via')
};


document.getElementById('station_check').onclick = function() {
  if (dp_station.value && ar_station.value) {
    var h2 = document.createElement('h2');
    document.getElementById('step2').appendChild(h2).textContent = 'Step2. 駅を選択しよう';
    showStationList(dp_station, "出発地", 'dp_station');
    showStationList(ar_station, "到着地", 'ar_station');
    console.log(via_station.value + "は、ありますか？");
    via_station.value ? showStationList(via_station, "経由地", 'via_station') : 0;
    var button = document.createElement('button');
    button.setAttribute('id', 'save');
    document.getElementById('step2').appendChild(button).textContent = 'save!';

  };
  document.getElementById('save').onclick = function() {
    secondStoreLocalStorage('dp_station_select', 'dp');
    secondStoreLocalStorage('ar_station_select', 'ar');
    via_station.value ? secondStoreLocalStorage('via_station_select', 'via') : 0;
    showSavedStations();

  }
};

function firstStoreLocalStorage(local_storage) {
  return ls[local_storage] = localStorage[local_storage] ? JSON.parse(localStorage[local_storage]) : {};
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


function showStationList(elementbyid, text, name) {
  var station_list = stationList(httpRequest(elementbyid.value));
  var form = document.createElement('form');
  form.setAttribute('name', name);
  form.setAttribute('id', name + '_form');
  var select = document.createElement('select');
  for (var i = 0; i < station_list.length; i++) {
    var option = document.createElement('option');
    select.setAttribute('name', name);
    select.setAttribute('id', name + '_select');
    select.setAttribute('size', '1');
    option.setAttribute('value', station_list[i].code);
    i == 0 ? option.setAttribute('selected', 'selected') : 0;
    var station_name = document.createTextNode(station_list[i].name);
    form.textContent = text;
    document.getElementById('step2').appendChild(form).appendChild(select).appendChild(option).appendChild(station_name);
  };
}

// function secondShowStationList(elementbyid) {
//   var station_list = stationList(httpRequest(elementbyid.value));
//   for (var i = 0; i < station_list.length; i++) {
//     var option = document.getElementById('dp_station_select');
//     // document.getElementById('step2').form.select.
//   };
// }

onload = function() {
  showSavedStations();
}


// 設定した設定を表示
function showSavedStations() {
  if (localStorage['dp'] && localStorage['ar']) {
    console.log(ls['dp']);
    document.getElementById('save_succeed').textContent = '現在の設定';
    document.getElementById('saved_stations').textContent = showViaList();
  };
}

// 設定経路の表示
function showViaList() {
  var dp_ar_stations = ls['dp']['name'] + " => " + ls['ar']['name'];
  return via_station.value ? dp_ar_stations + " " + ls['via']['name'] + "経由" : dp_ar_stations;
}

// webAPIの呼び出し
function httpRequest(station) {
  var request = new XMLHttpRequest();
  console.log(station);
  request.open("GET", "http://latest.api.ekispert.com/v1/json/station/light?key=" + key() + "&name=" + station, false);
  request.send();
  return (new Function("return " + request.responseText))();
}

function stationList(response) {
  var stations = new Array();
  if (response['ResultSet']['Point'] instanceof Array) {
    for (var i = 0; i < response['ResultSet']['Point'].length; i++) {
      stations[i] = {
        name: response['ResultSet']['Point'][i]['Station']['Name'],
        code: response['ResultSet']['Point'][i]['Station']['code']
      };
    };
  } else if (response['ResultSet']['Point'] instanceof Object) {
      stations[0] = {
        name: response['ResultSet']['Point']['Station']['Name'],
        code: response['ResultSet']['Point']['Station']['code']
      };
  } else {
  };
  return stations;
}
