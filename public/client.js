// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  var controller = {
    init: function(){
      view.init();
      this.iconList = { 'clear sky' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Network/shared-100.png',
                        'few clouds' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/partly_cloudy_day-100.png',
                        'mostly cloudy' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/partly_cloudy_day-100.png',
                        'broken clouds' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/partly_cloudy_day-100.png',
                        'drizzle' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/light_rain_2-100.png',
                        'rain' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/light_rain_2-100.png',
                        'thunderstorm' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/storm-100.png',
                        'snow' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/light_snow-100.png',
                        'mist' : 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/fog_day-100.png'
                      }
      this.url = 'https://api.darksky.net/forecast';
      this.apikey = '82d5924addd70c17e9de4eac071482d6';
      $.ajax({
        url: "http://ipinfo.io/json",
        jsonp: "callback",
        dataType: "jsonp", 
        // Work with the response
        success: function(data){controller.success( data ) }
      }); 
     },
      success : function(data) {
        var crd = { 'latitude' :data.loc.split(",")[0], 'longitude' :data.loc.split(",")[1]};
        var baseurl = controller.url;
        var apikey = controller.apikey;

        console.log('Your current position is:' + data.city);
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        console.log('More or less ' + crd.accuracy + 'meters.');
        var promise = new Promise(function(resolve, reject) { 
          $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+ crd.latitude + "," + crd.longitude)
            .success(function(data){ 
              controller.locale = ((data.results[0].address_components[2].long_name))
              resolve();
            }) 
        }).then(function(){
              $.ajax({
               url: baseurl + "/" + apikey + "/" + crd.latitude + "," + crd.longitude,
               jsonp: "callback",
               dataType: "jsonp", 

              // Work with the response
              success: function( data ) {
              console.log(data.currently);
              controller.F = Math.ceil(data.currently.temperature);
              controller.C = Math.ceil(controller.tempConvertFtoC(data.currently.temperature))
              controller.weather = data.currently.summary
              view.updateWeather({name: controller.locale, weather: controller.weather, 
                                  temp: {'C':controller.C + '°C',
                                         'F':controller.F + '°F'},
                                  icon:controller.lookupIcon(controller.weather)
                                 }) 
                  }
              }); 
        }).then(function(){
          $(view.format).on('click', function(){
            if($(this).hasClass('C')){ 
               $('#temp .deg').html(controller.F + '°F').removeClass('C').addClass('F');
            }else if($(this).hasClass('F')){ 
               $('#temp .deg').html(controller.C + '°C').removeClass('F').addClass('C');
            }

          })
        }); 
      },
      tempConvertCtoF: function(C){
       if (C){
        return Math.ceil( (C * 9/5) + 32) ;
       }
      },
      tempConvertFtoC: function(F){
       if (F){
        return Math.ceil( (F - 32) / (9/5) )  ;
       }
      },
      lookupIcon: function(key){
        return this.iconList[key.toLowerCase()];
      },
      error : function(err) {
        console.warn('ERROR', err.code + ' : ' + err.message);
      },
      options : function() {
          return {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
      }
    
  }
  var view = {
    init : function(){
      this.mainView = "panel"
      this.format = "#temp .deg"
    },
    
    updateWeather: function(data){
      $(this.mainView + ' #city').html(data.name);
      $(this.mainView + ' #desc').html(data.weather.description);
      $(this.mainView + ' #temp .desc').html(data.weather + ',' );
      $(this.mainView + ' #temp .deg').html(data.temp.C);
      $(this.mainView + ' #icon img').attr('src', data.icon);
    },
  };
controller.init();
});
