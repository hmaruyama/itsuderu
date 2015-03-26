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

function firstStoreLocalStorage(local_storage) {
  return ls[local_storage] = localStorage[local_storage] ? JSON.parse(localStorage[local_storage]) : {};
}
var courseList = createCourseList(httpRequest());


onload = function() {
  if (localStorage['dp'] && localStorage['ar']) {
    document.getElementById('station').textContent = showViaList();
    var now = new Date();
    var diff = [];
    for (var i = 0; i < courseList.length; i++) {
      diff[i] = courseList[i].dp_datetime.getMinutes() - now.getMinutes();
      if (diff[i] < 0) {
        diff[i] = 60 + diff[i];
      };
      var result = "所要時間"+ courseList[i].total_time + "分 " + " あと" + diff[i] + "分 " + doubleDigits(courseList[i].dp_datetime.getHours()) + ":" + doubleDigits(courseList[i].dp_datetime.getMinutes()) + "〜" + doubleDigits(courseList[i].ar_datetime.getHours()) + ":" + doubleDigits(courseList[i].ar_datetime.getMinutes());
      var p = document.createElement('p');
      var a = document.createElement('a');
      var target = a.setAttribute('target', 'blank');
      var minute1 = Number(courseList[i].dp_datetime.getMinutes() - (Math.floor(courseList[i].dp_datetime.getMinutes() / 10) * 10));
      var roote = "http://roote.ekispert.net/result?dep_code=" + ls['dp']['code'] + "&arr_code=" + ls['ar']['code'] + "&submit.x=108&submit.y=16&dep=" + ls['dp']['name'] + "&arr=" + ls['ar']['name'] + "&via1=" + ls['via']['name'] + "&yyyymm=" + courseList[i].dp_datetime.getFullYear().toString() + doubleDigits((courseList[i].dp_datetime.getMonth() + 1)) + "&day=" + courseList[i].dp_datetime.getDate() + "&hour=" + courseList[i].dp_datetime.getHours() + "&minute10=" + Math.floor(courseList[i].dp_datetime.getMinutes() / 10) + "&minute1=" + minute1 + "&type=dep&sort=time&transfer=2&surcharge=3&shinkansen=true&express=true&local=true&highway=true&plane=true&connect=true&liner=true&sleep=true&ship=true";

      var href = a.setAttribute('href', roote)
      var text = document.createTextNode(result.toString());
      document.getElementById('course_list').appendChild(p).appendChild(a).appendChild(text);
    };
  };
};


// 頭に0を入れる
function doubleDigits(num) {
  return Number(num) < 10 ? "0" + num.toString() : num;
}

// 設定経路の表示
function showViaList() {
  var dp_ar_stations = ls['dp']['name'] + " => " + ls['ar']['name'];
  return ls['via']['name'] ? dp_ar_stations + "  " + ls['via']['name'] + "経由 " : dp_ar_stations;
}

// webAPIの呼び出し
function httpRequest() {
  var request = new XMLHttpRequest();
  var request_url = localStorage['vla'] ? "http://latest.api.ekispert.com/v1/json/search/course/extreme?key=" + key + "&viaList=" + ls['dp']['code'] + ":" + ls['via']['code'] + ":" +  ls['ar']['code'] + "&answerCount=3" : "http://latest.api.ekispert.com/v1/json/search/course/extreme?key=" + key + "&viaList=" + ls['dp']['code'] + ":" +  ls['ar']['code'] + "&answerCount=3";
  request.open("GET", request_url, false)
  request.send();
  return (new Function("return " + request.responseText))();
}

// コースリストの作成
function createCourseList(response) {
  var course = new Array();
  response = response['ResultSet']['Course'];
  if (response instanceof Array) {
    for (var i = 0; i < 3; i++) {
      if (response[i]['Route']['Line'] instanceof Array) {
        var length = response[i]['Route']['Line'].length;
        course[i] = {
          total_time: Number(response[i]['Route']['timeOnBoard']) + Number(response[i]['Route']['timeOther']) + Number(response[i]['Route']['timeWalk']),
          dp_datetime: new Date(response[i]['Route']['Line'][0]['DepartureState']['Datetime']['text']),
          ar_datetime: new Date(response[i]['Route']['Line'][length-1]['ArrivalState']['Datetime']['text'])
        };
      } else {
        course[i] = {
          total_time: Number(response[i]['Route']['timeOnBoard']) + Number(response[i]['Route']['timeOther']) + Number(response[i]['Route']['timeWalk']),
          dp_datetime: new Date(response[i]['Route']['Line']['DepartureState']['Datetime']['text']),
          ar_datetime: new Date(response[i]['Route']['Line']['ArrivalState']['Datetime']['text'])
        };
      };
    };
  } else if (response instanceof Object) {
    if (response['Route']['Line'] instanceof Array) {
      var length = response['Route']['Line'].length;
      course[0] = {
        total_time: Number(response['Route']['timeOnBoard']) + Number(response['Route']['timeOther']) + Number(response['Route']['timeWalk']),
        dp_datetime: new Date(response['Route']['Line'][0]['DepartureState']['Datetime']['text']),
        ar_datetime: new Date(response['Route']['Line'][length-1]['ArrivalState']['Datetime']['text'])
      };
    } else {
      course[0] = {
        total_time: Number(response['Route']['timeOnBoard']) + Number(response['Route']['timeOther']) + Number(response['Route']['timeWalk']),
        dp_datetime: new Date(response['Route']['Line']['DepartureState']['Datetime']['text']),
        ar_datetime: new Date(response['Route']['Line'][length-1]['ArrivalState']['Datetime']['text'])
      };
    };
  } else {
    console.log('経路は見つかりませんでした');
  };
  return course;
}
