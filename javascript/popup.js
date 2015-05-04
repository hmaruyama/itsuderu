var ls = setLs();

var path = '/search/course/extreme'
var via_list = ls.via ? ls.dp.code + ":" + ls.via.code + ":" +  ls.ar.code : ls.dp.code + ":" +  ls.ar.code;
var params = {
  key: key(),
  viaList: via_list,
  answerCount: 3
}

var courseList = createCourseList(getResponse(path, params));
console.log(courseList);

onload = function() {
  if (ls.dp && ls.ar) {
    document.getElementById('station').textContent = showViaList(ls.via.name);
    var now = moment();
    var diff = [];
    for (var i = 0; i < courseList.length; i++) {
      diff[i] = courseList[i].dp_datetime.diff(now, 'minutes');
      var result = "所要時間"+ courseList[i].total_time + "分 " + " あと" + diff[i] + "分 " + doubleDigits(courseList[i].dp_datetime.hours()) + ":" + doubleDigits(courseList[i].dp_datetime.minutes()) + "〜" + doubleDigits(courseList[i].ar_datetime.hours()) + ":" + doubleDigits(courseList[i].ar_datetime.minutes());
      var p = document.createElement('p');
      var a = document.createElement('a');
      var target = a.setAttribute('target', 'blank');
      var path = '/search/course/light';
      var params;
      if (ls.via.code) {
        params = {
          key: key(),
          from: ls.dp.code,
          to: ls.ar.code,
          via: ls.via.code,
          date: courseList[i].dp_datetime.format('YYYYMMDD'),
          time: courseList[i].dp_datetime.format('HHmm')
        };
      } else {
        params = {
          key: key(),
          from: ls.dp.code,
          to: ls.ar.code,
          date: courseList[i].dp_datetime.format('YYYYMMDD'),
          time: courseList[i].dp_datetime.format('HHmm')
        };
      };

      var roote = getResponse(path, params).ResultSet.ResourceURI;

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

// コースリストの作成
function createCourseList(response) {
  var course = new Array();
  response = response.ResultSet.Course;
  if (response instanceof Array) {
    for (var i = 0; i < 3; i++) {
      if (response[i].Route.Line instanceof Array) {
        var length = response[i].Route.Line.length;
        course[i] = {
          total_time: Number(response[i].Route.timeOnBoard) + Number(response[i].Route.timeOther) + Number(response[i].Route.timeWalk),
          dp_datetime: moment(response[i].Route.Line[0].DepartureState.Datetime.text),
          ar_datetime: moment(response[i].Route.Line[length-1].ArrivalState.Datetime.text)
        };
      } else {
        course[i] = {
          total_time: Number(response[i].Route.timeOnBoard) + Number(response[i].Route.timeOther) + Number(response[i].Route.timeWalk),
          dp_datetime: moment(response[i].Route.Line.DepartureState.Datetime.text),
          ar_datetime: moment(response[i].Route.Line.ArrivalState.Datetime.text)
        };
      };
    };
  } else if (response instanceof Object) {
    if (response.Route.Line instanceof Array) {
      var length = response.Route.Line.length;
      course[0] = {
        total_time: Number(response.Route.timeOnBoard) + Number(response.Route.timeOther) + Number(response.Route.timeWalk),
        dp_datetime: moment(response.Route.Line[0].DepartureState.Datetime.text),
        ar_datetime: moment(response.Route.Line[length-1].ArrivalState.Datetime.text)
      };
    } else {
      course[0] = {
        total_time: Number(response.Route.timeOnBoard) + Number(response.Route.timeOther) + Number(response.Route.timeWalk),
        dp_datetime: moment(response.Route.Line.DepartureState.Datetime.text),
        ar_datetime: moment(response.Route.Line[length-1].ArrivalState.Datetime.text)
      };
    };
  } else {
    console.log('経路は見つかりませんでした');
  };
  return course;
}
