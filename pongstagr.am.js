/*!
 * Pongstagr.am v2.0 - Instagram Plugin
 * 
 * Original author: @pongstr
 * Further changes, comments: @pongstr
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

  $.fn.pongstgrm = function( options ){
    // Plugin default options
    var options = $.extend({}, $.fn.pongstgrm.defaults, options );

    return this.each( function( i, element ){
      // Begin plugin actions here.
      
      // First off, user authentication needed, validate 'user_id' and 'access_token' options.
      if ( options.user_id === null || options.access_token === null ){
          // !!! Console log error message !!!
          console.log(' \"user_id\"\ & \"access_token\" must be set to access Instagram API.');
        } else {   
               
          // Load Content
          load_content( options.show );
          
      } //*! end user authentication.    



      function load_content( content_type ){
        // Instagram API URL
        var api_url = 'https://api.instagram.com/v1/users/';
        
        // Append Button Function
        function btn(){
          var btn_id   = ( options.show == null ) ? "recent_media-btn" : options.show + "-btn";
              btn_html = "<div class='row pongstgrm-btn'><a href='javascript:void(0);' id='" + btn_id + "' class='four columns centered btn btn-success btn-large'>Load More Photos</a></div>";
          $(element).after( btn_html );
        }
        
        if ( content_type === null || content_type === 'recent_media'){

            // Load Recent Media
            var check_count = ( options.media_count != null ) ? "/media/recent?count=" + options.media_count + "&": "/media/recent?";
                endpoint    = api_url + options.user_id + check_count + "access_token=" + options.access_token;
            
            // Load Request
            ajx( endpoint );
            btn();

            return true;
            
          } else if ( content_type === 'user_profile'){
            
            // Load User Information
            var endpoint = api_url + options.user_id + "/?access_token=" + options.access_token;
            
            // Load Request
            ajx( endpoint );            
            return true;
            
          } else if ( content_type === 'user_feed' ){
            
            // Load User Feed
            var check_count = ( options.media_count != null ) ? "/self/feed?count=" + options.media_count + "&access_token=" + options.access_token: "/self/feed?access_token=" + options.access_token;
                endpoint    = api_url + check_count;

            // Load Request
            ajx( endpoint );
            btn();

            return true;

          } else if ( content_type === 'user_liked_media' ){
            
            // Load User Liked Media
            var check_count = ( options.media_count != null ) ? "/self/media/liked?count=" + options.media_count + "&access_token=" + options.access_token : "/sefl/media/liked?access_token=" + options.access_token;
                endpoint    = api_url + check_count;

            // Load Request
            ajx( endpoint );
            btn();
            
            return true;
        }        
      } //*! end load_content

      function ajx( api_endpoint ){
        $.ajax({
          method       : "GET"          ,
          url          : api_endpoint    ,
          cache        : true           ,
          dataType     : "jsonp"        ,
          jsonp        : "callback"     ,
          jsonCallback : "jsonpcallback",
          success      : function(data){
            
            if ( options.show !== 'user_profile' ){

                // Iterate through api data
                $.each( data.data, function( key, value){

                  // Thumbnail Images and stats
                  var thumb_likes    = ( value.likes.count ) ? "<div class='six columns mobile-two alignleft'><i class='icon-heart'></i> &nbsp;<strong>" + value.likes.count + "</strong></div>" : "<div class='six columns mobile-two alignleft'><i class='icon-heart'></i> &nbsp;<strong>0</strong></div>";
                      thumb_comments = ( value.comments.count ) ? "<div class='six columns mobile-two alignright'><i class='icon-comment'></i> &nbsp;<strong>" + value.comments.count  + "</strong></div>" : "<div class='six columns mobile-two alignright'><i class='icon-comment'></i> &nbsp;<strong>0</strong></div>";
                      thumb_img      = ( value.images.low_resolution.url ) ? "<a href='javascript:void(0);' id='" + value.id + "' class='th'><img src='" + value.images.low_resolution.url + "' alt='' /><div class='stats'>" + thumb_likes + thumb_comments + "</div></a>" : "";
                      

                  // Thumbnail Block
                  var thumblock  = "<div class='three mobile-two columns'>";
                      thumblock += thumb_img;
                      thumblock += "</div><!-- end of .three.columns -->";

                  // Append Thumbnail Block
                  $( element ).append( thumblock );

                });

                // Pagination next url
                var next_page = data.pagination.next_url;
                    next_btn  = ( options.show == null ) ? "recent_media-btn" : options.show + "-btn";
                
                // Load more media when button is clicked
                load_more( next_btn, next_page );

                $('.th').hover(function(){
                  $('.stats', this).animate({ position: 'absolute', left: '0', bottom: '5px'}, 150);
                }, function(){
                  $('.stats', this).animate({ position: 'absolute', left: '0', bottom: '-50px'}, 150);
                });

              } else {
                var user_info = data.data;
                // Load
                console.log( user_info.username + '\'s Profile Information');
            }
          }          
        });
      }
      
      // Load more requests button
      function load_more( button_selector, pagination ){
        // Check if pagination is defined, if not disable button & exit.
        if ( pagination === undefined ){
            $( '#' + button_selector ).addClass('secondary').css({ cursor: 'default', opacity: '0.4' });
          } else { 
            $( '#' + button_selector ).click(function(event){
              ajx( pagination );
              $(this).unbind(event);
            });
        }
      }

        
    });
  };
  
  // Default Options
  $.fn.pongstgrm.defaults = {
    // User Authentication
    user_id        : null,
    access_token   : null,
    
    // Display Option
    show   : null,
    media_count    : 8,
    more_button    : null,

    // Presentation
    clearing: null,
    modal   : null

  }

})( jQuery, window, document );
