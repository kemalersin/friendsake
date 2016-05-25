(function () {
  var init = function (ctx, next) {
    WebFont.load({
      google: {
        families: [
          'Fira+Sans::latin,latin-ext',
          'Lora:700italic:latin,latin-ext'
        ]
      }
    });

    $('.spinner').hide();
    $('.content').show();

    $('img.lazy').lazyload({effect : 'fadeIn'});
    $('[data-toggle="tooltip"]').tooltip({ container: 'body' });

    next();
  }

  var friends = function (ctx, next) {
    $.get(ctx.path + '/list', function (data) {
      if (data) {
        var image = new Image();
        image.src = data.info.image;

        image.onload = function () {
          var $share = $('#share');

          $share.find('img').attr('src', this.src);
          $share.modal('show');
        }

        $('.btn-share').click(function () {
          switch (ctx.params.provider.toLowerCase()) {
            case 'facebook':
              FB.ui({
                method: 'share',
                href: encodeURI(data.url)
              });
              break;
          }
        });

        data.friends.forEach(function (friends) {
          var $grouped = $(
            '<div class="row well grouped"><div class="col-md-12"><h3>' +
            friends.name + ' (' + friends.users.length + ')' +
            '</h3></div></div>'
          ).appendTo($('.friend-list'));

          friends.users.forEach(function (user) {
            $grouped.append(
              '<div class="col-xs-3 col-sm-2 col-md-1 text-center">' +
              ' <img class="avatar lazy img-circle"' +
              '   src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"' +
              '   data-original="' + user.picture + '"' +
              '   data-toggle="tooltip" data-placement="top" title="' + user.name + '"' +
              ' />' +
              '</div>'
            );
          });
        });
      }

      next();
    }).fail(function() {
      page.redirect('/');
    });
  }

  if (window.location.hash == '#_=_') {
    history.replaceState
      ? history.replaceState(null, null, window.location.href.split('#')[0])
      : window.location.hash = '';
  }

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];

    if (d.getElementById(id)) return;

    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/tr_TR/sdk.js#xfbml=1&version=v2.6&appId=629385867209094";

    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  page('/:provider/friends', friends);
  page('*', init);
  page();
})();
