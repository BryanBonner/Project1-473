var main = function () {
  'use strict';
  var email,
  username,
  password,
  user_id = '',
  postMaker = '',
  title = '',
  excuseData,
  excuse;

  var displayExcuses = function(sortBy) {
    if (sortBy === '') {
      sortBy = 'datePosted';
    }
    $.get("http://localhost:3000/excuses/getExcuses?sortBy=" + sortBy, function(data, status) {
      var excuseDisplay = '',
          obj = data,
          excuses;

      excuseData = data;

      if (status.toLowerCase() === "success") {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            excuses = obj[key];
            excuseDisplay += '<div class="ui equal width center aligned padded menu">' +
                             '  <a class="ui left item excusePicked" id="a' + String(key) + '">' +
                             '    <h4 class="ui header excusePicked" id="b' + String(key) + '">' + excuses.title + '</h4>' +
                             '  </a>' +
                             '  <ai class="ui right item">Posted by: ' + excuses.postMaker + ' on ' + excuses.datePosted.slice(0,10) + '</a>' +
                             '</div>' +
                             '<div class="content" id="c' + key + '">' +
                             '</div>';
//    '    <p>' + excuses.excuse + '</p>' +

          }
        }
        document.getElementById('excusePosts').innerHTML = '';
        document.getElementById('excusePosts').innerHTML = excuseDisplay;
      }
    });
  };
  
  $('#submitExcuse').click(function() {
    postMaker = $('#postMaker').val();
    title = $('#postTitle').val();
    excuse = $('#postExcuse').val();

    console.log("submitting excuse");

    $.post("http://localhost:3000/excuses/submitExcuse", {
      postMaker: postMaker, title: title, excuse: excuse, user_id: user_id },
      function(data) {
        $('#postMaker').text('');
        $('#postTitle').text('');
        $('#postExcuse').text('');
        displayExcuses('');
      }
    )
  });

  document.body.addEventListener('click', function(evt) {
    if (evt.target.className.includes('excusePicked')) {
      showExcuse(String(evt.target.id).substring(1));
    }
    if (evt.target.className.includes('excuseStatusPick')) {
      rateExcuse(String(evt.target.id).substring(1), String(evt.target.id).substring(0,1));
    }
    if (evt.target.className.includes('navBarSearchPick')) {
      switch(String(evt.target.id)) {
        case "mostPopularSearch":
          displayExcuses('voteCount');
          break;
        case "mostEmbarrassingSearch":
          displayExcuses('embarrassing');
          break;
        case "mostHilariousSearch":
          displayExcuses('hilarious');
          break;
        case "mostCringeWorthySearch":
          displayExcuses('cringeworthy');
          break;
        case "mostLegitSearch":
          displayExcuses('legit');
          break;
      }
    }
  }, false);
  var rateExcuse = function(excuseKey, rating) {
    var d = document.getElementById(rating + excuseKey);

    if (d.className.includes('active') === false) {
      $.post("http://localhost:3000/excuses/increaseExcuseRating", {
        _id: excuseKey, rate: rating },
        function(data) {
          d.className += " active";
        }
      )
    }
  };
  var showExcuse = function(excuseKey) {
    var excuse,
        excuseDisplay;

    for (var key in excuseData) {
      if (excuseData.hasOwnProperty(key)) {
        document.getElementById('c' + key).innerHTML = '';
      }
    }
    
    excuse = excuseData[excuseKey];
    excuseDisplay = '<p>' + excuse.excuse + '</p>' +
                    '<button class="ui button excuseStatusPick" id="L' + excuseKey + '"><i class="thumbs outline up icon"></i>Like</button>' +
                    '<button class="ui button excuseStatusPick" id="G' + excuseKey + '"><i class="legal icon"></i>Legit</button>' +
                    '<button class="ui button excuseStatusPick" id="E' + excuseKey + '"><i class="bomb icon"></i>Embarrassing</button>' +
                    '<button class="ui button excuseStatusPick" id="H' + excuseKey + '"><i class="smile icon"></i>Hilarious</button>' +
                    '<button class="ui button excuseStatusPick" id="W' + excuseKey + '"><i class="thumbs outline down icon"></i>Cringe-Worthy</button>'

    document.getElementById('c' + excuseKey).innerHTML = excuseDisplay;

  };
  displayExcuses('');
}
$(document).ready(main);
