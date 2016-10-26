var main = function() {
  'use strict';

  var email,
  username,
  password,
  user_id = '',
  postMaker = '',
  title = '',
  excuse;

  var displayExcuses = function() {
    $.get("http://localhost:3000/getExcuses", function(data, status) {
      var excuseDisplay = '',
          obj = data,
          excuses;
      if (status.toLowerCase() === "success") {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            excuses = obj[key];
            excuseDisplay += '<div class="title">' +
                               '<i class="dropdown icon"></i>' +
                               excuses.title +
                             '</div>' +
                             '<div class="content">' +
                               '<p class="transition hidden">Posted by: ' + excuses.postMaker + ' on ' + excuses.datePosted + '</p>' +
                               '<p class="transition hidden">' + excuses.excuse + '</p>' +
                             '</div>';
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

    $.post("http://localhost:3000/submitExcuse", {
      postMaker: postMaker, title: title, excuse: excuse, user_id: user_id },
      function(data) {
        $('#postMaker').text('');
        $('#postTitle').text('');
        $('#postExcuse').text('');
        displayExcuses()
      }
    )
  });
  displayExcuses();
        });
    });
};
$(document).ready(main);
