$(function(){
  var showTourMapDiv = document.getElementById('show-tour-map');
  var tourPointMapDiv = document.getElementById('tourpointmap');
  var editPointMapDiv = document.getElementById('edit-tourpoints-map');
  var editTourDiv = document.getElementById('edittour');
  var newTourMapDiv = $('#rendezvous-map')[0];
  // var newTourMapDiv = document.getElementById('rendezvous-map');
  var tourMapDiv;
  var tourId;
  var mapPage = 1;
  var currentUrl = window.location.href;

  if ($.contains(document,showTourMapDiv)) {
    tourId = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    tourMapDiv = showTourMapDiv;
  } else if ( $.contains(document, tourPointMapDiv)) {
    tourId = $("#new_tour_form").attr("tour_id");
    tourMapDiv = tourPointMapDiv;
  } else if ( $.contains(document,editPointMapDiv) ) {
    tourMapDiv = editPointMapDiv;
    tourId = $("#tourpoint_edit").attr("tour_id");
  } else if ( $.contains(document,editTourDiv) ) {
    tourMapDiv = newTourMapDiv;
    tourId = currentUrl.substring(currentUrl.indexOf('/tours/') + 7,currentUrl.lastIndexOf('/'));
  } else {
    mapPage = 0;
  }

  if (mapPage === 1) {
    console.log("!!!!!!!!!!!!!!");
    var tourPageUrl = "/tours/"+tourId;
    var tour;
    var tourpoints = [];

    $.ajax({
      method:"GET",
      url: tourPageUrl,
      dataType:'json'
    }).done(function(reponseData){
      tour = reponseData;
      tour.tourpoints = tour.tourpoints.sort(function (a, b) {return a.id - b.id;});
      var tourMap = createMap(tourMapDiv);
      var rendezvousPoint = tour.rendezvous_point;
      var country = tour.country_name;
      var latlng;
      var latP;
      var lagP;
      var markerPosition;
      var tourPointInfoWindow = new google.maps.InfoWindow();
      var marker;
      var markers = {};
      var markerPlaced = false;
      var newMarker;
      var editMarker;
      var markerEdited = false;
      var i = 0;

      geocodeAddress(rendezvousGeocoder(), tourMap, country, rendezvousPoint, markerDisplay);

      function markerDisplay(rmarker) {
        var bounds = new google.maps.LatLngBounds();
        if (tour.tourpoints.length > 0) {
          bounds.extend(rmarker.position);
          for (i = 0; i<tour.tourpoints.length;i++) {
            laglng = tour.tourpoints[i].tour_point_laglng;
            latP = Number(laglng.substring(laglng.indexOf("(")+1,laglng.indexOf(",")-1));
            lagP = Number(laglng.substring(laglng.indexOf(",")+1,laglng.indexOf(")")-1));
            markerPosition = {lat:latP,lng:lagP};
            marker = markerMaker(markerPosition,tourMap,(i+1).toString(),false);
            markers[marker.label] = tour.tourpoints[i];
            bounds.extend(marker.position);

            // if ($("#edit-button").attr("clicked")===true) {
            //   $("#edit-tour-point-form").show();
            // }

            marker.addListener('click', function(event) {
              if ( tourMapDiv === editPointMapDiv && markerEdited === false ) {
                var editTourpointData;
                var form = document.getElementById('edit-tour-point-form');

                $("#edit-tour-point-form").show();

                editTourpointData = markers[this.label];

                $("#edit_tourpoint_tour_point_name").val(editTourpointData.tour_point_name);
                $("#edit_tourpoint_tour_point_description").val(editTourpointData.tour_point_description);
                $("#edit_tourpoint_tour_point_laglng").val(editTourpointData.tour_point_laglng);
                $("#edit_tourpoint_tour_point_img").val(editTourpointData.tour_point_img);
                $(form).attr("action", "/tours/" + tourId + "/tourpoints/" + markers[this.label].id );

                // editSubmit.click(function(){
                //   $("#edit-button").attr("clicked",true);
                // });

                this.draggable = true;
                markerEdited = true;
                this.setMap(null);
                this.setMap(tourMap);
                // this.setAnimation(google.maps.Animation.BOUNCE);
                // editMarker = markerMaker(event.latLng, tourMap, this.label,true);

                google.maps.event.addListener(this, 'dragend', function (event) {
                  $("#edit_tourpoint_tour_point_laglng").val(event.latLng.toString());
                });

              } else {
                populateInfoWindow(this,markers[this.label],tourPointInfoWindow,tourMap);
              }
            });

          }
          tourMap.fitBounds(bounds);
        }

        google.maps.event.addListener(this, 'dragend', function (event) {
          $("#edit_tourpoint_tour_point_laglng").val(event.latLng.toString());
        });

        if (tourMapDiv === tourPointMapDiv) {
          tourMap.addListener('click', function(event) {
            if (markerPlaced === false) {
              $("#tourpoint_tour_point_laglng").val(event.latLng.toString());
              newMarker = markerMaker(event.latLng, tourMap, (i+1).toString(),true);
              // newMarker.setAnimation(google.maps.Animation.BOUNCE);
              google.maps.event.addListener(newMarker, 'dragend', function (event) {
                $("#tourpoint_tour_point_laglng").val(event.latLng.toString());
              });

            }
            markerPlaced = true;
          });
        }
      }

    }).fail(function(a,b,c){
      console.log(a +" "+b+" "+c);
    });
  }


  // var newTourMapDiv = document.getElementById('rendezvous-map');
  //  $('#rendezvous-map') has more than document.getElementById('rendezvous-map'), such as properties, attributes
  if ($.contains(document,newTourMapDiv)) {
    createMap(newTourMapDiv);
    $("#rendezvous-point-input").on("input",function(){
      var rendezvousPointInput = $("#rendezvous-point-input").val();
      var tourCountry = $("#tour_country_id option:selected").text();
      geocodeAddress(rendezvousGeocoder(), createMap(newTourMapDiv), tourCountry, rendezvousPointInput);
    });
  }

// Show icon in front of category for index and show --------------------------

  function tourIcons(catName) {
    catName.each(function(){
      var tourCategory = $(this).html();
      if (tourCategory === ' Nature') {
        var leaf = ("<span class='fa fa-leaf'>");
        $(this).prepend(leaf);
      } else if (tourCategory === ' Social') {
        var users = ("<span class='fa fa-users'>");
        $(this).prepend(users);
      } else if (tourCategory === ' City tour') {
        var building = ("<span class='fa fa-building-o'>");
        $(this).prepend(building);
      } else if (tourCategory === ' Recreation') {
        var puzzle = ("<span class='fa fa-puzzle-piece'>");
        $(this).prepend(puzzle);
      } else if (tourCategory === ' Other') {
        var mapIcon = ("<span class='fa fa-map'>");
        $(this).prepend(mapIcon);
      } else if (tourCategory === ' Food &amp; drinks') {
        var cutlery = ("<span class='fa fa-cutlery'>");
        $(this).prepend(cutlery);
      }
    });
  }

  //call function for each page ----------------------------------------------

  var tourShowPageCat  = $('#tour-details-category');
  var tourIndexPageCat = $('.tour_index_cat');


  tourIcons(tourShowPageCat);
  tourIcons(tourIndexPageCat);

  //show star rating insteaf of number ---------------------------------------


  $('#tour-details-rating').each(function(){
    var starRatingCount = parseInt($(this).html());
      $(this).html("");
    for (var i = 0; i < starRatingCount; i++) {
      $(this).append("<span class='fa fa-star'>");
      // ("<span class='fa fa-star'>");
      // span.addClass("fa-star");
    }
  });




  //
  // BOOKING FORM MODAL FROM SCHEDULES modal

  $('.booking-button-modal').on('click', function(e){
    e.stopPropagation();
    e.preventDefault();
    $('.schedules-modal-window').fadeOut();
    $('.booking-modal-window').fadeIn();
  });

  $('.booking-modal-window').on('click', function(e){
    e.preventDefault();
    $('.booking-modal-window').fadeOut();
  });

  $('.booking-modal-form').on('click', function(e){
    e.stopPropagation();
    e.preventDefault();
  });

  $('.booking-modal-form input').on('click', function(e){
    e.stopPropagation();
  });


});
