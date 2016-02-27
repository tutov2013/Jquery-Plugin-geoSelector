(function($){
  
  jQuery.fn.geoSelector = function(ctrl,setName,setValue){
      var gs=$(this);
      var timewait;
      var html_code="<label class='region_input'>\n\
      <span>Начните вводить регион:</span><input type='text' name='region'>\n\
      </label>\n\
<div class='region_list' class='rg_list' ></div>\n\
<div class='city_list'  class='city_list' ></div>";
      
    
    
    if (typeof window.geoSelector!='object') window.geoSelector={};
    if (typeof window.geoSelector[gs.attr('id')]!='object') {
            window.geoSelector[gs.attr('id')]={};
            gs.addClass('gsBlock').append(html_code);
        }
    
    
      if (typeof ctrl!='object') {
        switch(ctrl){
    case 'set':
            return window.geoSelector[gs.attr('id')][setName]=setValue;
        break;
    case 'get':
            return window.geoSelector[gs.attr('id')][setName];
        break;
    default:
          window.geoSelector[gs.attr('id')].regionID=ctrl;
        break;
        }
    } else {
        window.geoSelector[gs.attr('id')]=ctrl;
    }
      
      window.geoSelector[gs.attr('id')].bindEvent=window.geoSelector[gs.attr('id')].bindEvent ? window.geoSelector[gs.attr('id')].bindEvent : 'keyup';
      window.geoSelector[gs.attr('id')].minInputChar=window.geoSelector[gs.attr('id')].minInputChar ? window.geoSelector[gs.attr('id')].minInputChar : 1;
      window.geoSelector[gs.attr('id')].events=window.geoSelector[gs.attr('id')].events ? window.geoSelector[gs.attr('id')].events : {};     

      
      $('input',gs).on(window.geoSelector[gs.attr('id')].bindEvent,function(){
          var input=$(this);
          clearTimeout(timewait);
          if (!input.val()) $( '.region_list,.city_list', gs ).html(''); 
          if (input.val().length>=window.geoSelector[gs.attr('id')].minInputChar) timewait=setTimeout(function(){getData(input.val())},500);
      });
      
      if (window.geoSelector[gs.attr('id')].regionID) {
          getData(window.geoSelector[gs.attr('id')].regionID,1);
      }
      
      function getData($code,$isRegion){
            if ($isRegion) {
                if (typeof window.geoSelector[gs.attr('id')].events.onGsCityStart=='function') window.geoSelector[gs.attr('id')].events.onGsCityStart();
                $.getJSON( "http://evildevel.com/Test/City?region="+$code,function( data ) {
                    if (typeof window.geoSelector[gs.attr('id')].events.onGsCityData=='function') window.geoSelector[gs.attr('id')].events.onGsCityData(data);
                    if (typeof window.geoSelector[gs.attr('id')].events.onGsData=='function' && $.isEmptyObject(data)) {
                        window.geoSelector[gs.attr('id')].events.onGsError('Empty');
                    }
                    var items = [];
                    $.each( data, function( key, val ) {
                        items.push(val[1]);
                    });
                    $( '.city_list',gs ).html(items.join(', '));
                }).fail(function(XHR, status, error){
                               if (typeof window.geoSelector[gs.attr('id')].events.onGsData=='function') window.geoSelector[gs.attr('id')].events.onGsError(error);
                            });
            }else{ 
                $.getJSON( "http://evildevel.com/Test/Region?name="+$code,function( data ) {
                    if (typeof window.geoSelector[gs.attr('id')].events.onGsData=='function') window.geoSelector[gs.attr('id')].events.onGsData(data);
                    if (typeof window.geoSelector[gs.attr('id')].events.onGsError=='function' && $.isEmptyObject(data)) {
                        window.geoSelector[gs.attr('id')].events.onGsError('Empty');
                    }
                    var items = [];
                    $.each( data, function( key, val ) {
                        items.push( "<a href='#' data-regionID='"+val[0]+"'>" + val[1] + "</a>" );
                    });
                    $( '.city_list',gs ).html('');
                    $( '.region_list', gs ).html(items.join(''));
                    $( '.region_list a', gs ).click(function(){
                        getData($(this).attr('data-regionID'),1);return false;
                    });
                }).fail(function(XHR, status, error){
                               if (typeof window.geoSelector[gs.attr('id')].events.onGsData=='function') window.geoSelector[gs.attr('id')].events.onGsError(error);
                            });
            }
      }
  }
  
  
  
})(jQuery);

