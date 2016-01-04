/*
* jQuery flextabs v1
* https://connekthq.com
*
* Copyright 2016 connekthq
* Free to use under the GPLv2 license.
* http://www.gnu.org/licenses/gpl-2.0.html
*
* Author: Darren Cooney

*/

(function ($) {
   "use strict";
   
   $.flextabs = function (el, options) {
      var defaults = { 
          start : 0, // 
          nav : '.flextabs-nav', // Nav wrapper 
          select_wrap_class : '', // Classes added to select wrapepr 
          select_class : '', // Classes added to select 
          urlHash : true, // Rewrite URL hash?
      };      
      var options = $.extend(defaults, options);       
      
      // Create vars		
      var el = $(el), // container element
          current = options.start, // set init tab
          nav = $(options.nav, el),
          select = $('<div class="flextabs-select-wrap '+ options.select_wrap_class +'"><select class="flextabs-select '+ options.select_class +'"></select></div>'),
          urlHash = options.urlHash;

      // Methods	
      var methods = {        
         
         init: function(){
            el.prepend(select);
            
            // Check for hash         
            var hash = window.location.hash;
            if(hash){
               // loop thru select options to locate the correct tab/select val
               $('li a', nav).each(function(e) {
                  var val = $(this).attr('href');
                  if(val === hash){
                     current = e; 
                  }                
               });
            }
            
            
            // Create our <select/> menu
            $('li a', nav).each(function(e) {
               var item = $(this);
               if(e === current){
                  $("<option />", {
                     "value"   : item.attr("href"),
                     'data-id' : e,
                     'selected' : 'selected',
                     "text"    : item.text()
                  }).appendTo('select', el);                  
               }else{
                  $("<option />", {
                     "value"   : item.attr("href"),
                     'data-id' : e,
                     "text"    : item.text()
                  }).appendTo('select', el);
               }
            });            
                        
            var href = $('li', nav).eq(current).find('a').attr('href');
            history.pushState(href, document.title, href);    
                    
            methods.toggle(current, false); // Display current pane
         },

         // Tab Toggle
         toggle: function(index, href, updateURL) {
            $('li', nav).eq(index).addClass('active').siblings().removeClass('active');
            $('.flextabs-pane', el).eq(index).addClass('active').siblings().removeClass('active');
            if(urlHash && updateURL)
               methods.setURL(href);
         },      
         
         // Update the select menu
         update: function(val){
            $('select', select).val(val).trigger('change', [{updateURL:true}]);
         },
         
         // Update URL
         setURL: function(href){
            if (typeof window.history.pushState == 'function' && href) {
		         history.pushState(href, document.title, href);
            }
         },
         
         // Update URL on popstate
         toggleURL: function(href){
            if (typeof window.history.pushState == 'function' && href) {
               // loop thru select options to locate the correct tab/select val
               $('option', select).each(function() {
                  var val = $(this).val();
                  if(val === href)
                     $('select', select).val(val).trigger('change', [{updateURL:false}]);                  
               });
            }
         }
         
      };	
      
      
      // fwd/back btn event
      window.addEventListener('popstate', function(event) {
         methods.toggleURL(event.state);
      });
      
      

      //Tab click
      $('li a', nav).click(function(e){
         e.preventDefault();
         var el = $(this),
             href = el.attr('href');
         
         methods.update(href);
      });
      


      // Select onchange
      $(document).on('change', select, function(e, data){         
         var updateURL = false;
         
         if (data !== undefined) // Change event trigerred from action
            updateURL = data.updateURL;
         else // Change event trigerred from select
            updateURL = true;
            
         var index = $('option:selected', select).data('id'),
             href = $('option:selected', select).val();
             
         methods.toggle(index, href, updateURL);         
      });
      
      
      
      // Let's go!
      methods.init();			

   };
   
   
   
   // Create flextabs Object
   $.fn.flextabs = function(options) {
      new $.flextabs(this, options);
   };     

})(jQuery);