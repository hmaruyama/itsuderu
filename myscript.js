var request = new XMLHttpRequest();
var total_time;
var dp_datetime;
var ar_datetime;
var courseList;

request.open("GET", "http://latest.api.ekispert.com/v1/json/search/course/extreme?key=wC4SR9ETBhBcJ3Bv&viaList=高円寺:池袋&answerCount=3", false)
request.send();

var response = (new Function("return " + request.responseText))();
// console.log(response['ResultSet']['apiVersion'])
courseList = createCourseList(response);
// console.log(courseList.toString());

onload = function() {
  // var show = document.getElementById('show');
  var courseList = document.createElement('p');
  for (var i = 0; i < courseList.length; i++) {
  var text = document.createTextNode(courseList[i].toString());
  // console.log(courseList[i].toString());
  document.body.appendChild(show).appendChild(text);
  };
  // show.textContent = result.toString();
};
// onload = function() {
//   var show = document.getElementById('show');
//   show.textContent = 'bbb';
// }


function createCourseList(response) {
  var course = new Array();

  if (response['ResultSet']['Course'] instanceof Array) {
    console.log(response['ResultSet']['Course'][0]['Route']['Line'][0]['DepartureState']['Datetime']['text']);
    for (var i = 0; i < 3; i++) {
      // console.log(response['ResultSet']['Course']);
      var length = response['ResultSet']['Course'][i]['Route']['Line'].length;
      course[i] = {
        total_time: response['ResultSet']['Course'][i]['Route']['timeOnBoard'],
        dp_datetime: response['ResultSet']['Course'][i]['Route']['Line'][0]['DepartureState']['Datetime']['text'],
        ar_datetime: response['ResultSet']['Course'][i]['Route']['Line'][length-1]['ArrivalState']['Datetime']['text']
      }
    };
  } else if (response['ResultSet']['Course'] instanceof Object) {
    course[0] = {
        total_time: response['ResultSet']['Course']['Route']['timeOnBoard'],
        dp_datetime: response['ResultSet']['Course']['Route']['Line']['DepartureState']['Datetime']['text'],
        ar_datetime: response['ResultSet']['Course']['Route']['Line'][length-1]['ArrivalState']['Datetime']['text']
    }
  } else {
    console.log('経路は見つかりませんでした');
  };
  return course;
}



  // if (response['ResultSet']['Course'] instanceof Array) {
  //   total_time = response['ResultSet']['Course'][0]['Route']['timeOnBoard'];
  //   // Lineが配列かどうかの判定
  //   if (response['ResultSet']['Course'][0]['Route']['Line'] instanceof Array) {
  //     dp_datetime = response['ResultSet']['Course'][0]['Route']['Line'][0]['DepartureState']['Datetime']['text']
  //     var length = response['ResultSet']['Course'][0]['Route']['Line'].length;
  //     ar_datetime = response['ResultSet']['Course'][0]['Route']['Line'][length-1]['ArrivalState']['Datetime']['text'];
  //   } else {
  //     dp_datetime = response['ResultSet']['Course']['Route']['Line']['DepartureState']['Datetime']['text']
  //     ar_datetime = response['ResultSet']['Course']['Route']['Line']['ArrivalState']['Datetime']['text'];

  //   };
  // } else {
  //   total_time = response['ResultSet']['Course']['Route']['timeOnBoard'];
  // };
  // dp_datetime = new Date(dp_datetime);
  // ar_datetime = new Date(ar_datetime);

  // result = "所要時間" + total_time + "分 " + dp_datetime.getHours() + ":" + dp_datetime.getMinutes() + " 〜 " + ar_datetime.getHours() + ":" + ar_datetime.getMinutes();
  // console.log(result);










// var xhr = new XMLHttpRequest();
// xhr.open('GET', "http://latest.api.ekispert.com/v1/json/search/course/extreme?key=wC4SR9ETBhBcJ3Bv&viaList=高円寺:池袋");
// xhr.responseType = 'json';
// xhr.send();

// var total_time;
// var dp_datetime;
// var ar_datetime;
// var result;

// onload = function() {
//   xhr.onload = function(ev) {
//     //Courseが配列かどうか判定
//     if (xhr.response['ResultSet']['Course'] instanceof Array) {
//       total_time = xhr.response['ResultSet']['Course'][0]['Route']['timeOnBoard'];
//       // Lineが配列かどうかの判定
//       if (xhr.response['ResultSet']['Course'][0]['Route']['Line'] instanceof Array) {
//         dp_datetime = xhr.response['ResultSet']['Course'][0]['Route']['Line'][0]['DepartureState']['Datetime']['text']
//         var length = xhr.response['ResultSet']['Course'][0]['Route']['Line'].length;
//         ar_datetime = xhr.response['ResultSet']['Course'][0]['Route']['Line'][length-1]['ArrivalState']['Datetime']['text'];
//       } else {
//         dp_datetime = xhr.response['ResultSet']['Course']['Route']['Line']['DepartureState']['Datetime']['text']
//         ar_datetime = xhr.response['ResultSet']['Course']['Route']['Line']['ArrivalState']['Datetime']['text'];

//       };
//     } else {
//       total_time = xhr.response['ResultSet']['Course']['Route']['timeOnBoard'];
//     };

//     dp_datetime = new Date(dp_datetime);
//     ar_datetime = new Date(ar_datetime);

//     result = "所要時間：" + total_time + "分 " + dp_datetime.getHours() + ":" + dp_datetime.getMinutes() + " 〜 " + ar_datetime.getHours() + ":" + ar_datetime.getMinutes();

//     console.log(result);
//   };
//   console.log(result);
// };
