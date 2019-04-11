$(document).ready(function(){
  $('#menu_btn').on('click', function () {
    $('#header_nav').toggleClass('is_selected');
    $(this).toggleClass('is_menu_opened');
    $('#header').toggleClass('is_menu_opened');
    $('#body_wrapper_smp').toggleClass('is_menu_opened');
  });
  $('#body_wrapper_smp').on('click', function () {
    reset_header_menu();
  });
  function reset_header_menu(){
    $('#header_nav').removeClass('is_selected');
    $('#menu_btn').removeClass('is_menu_opened');
    $('#header').removeClass('is_menu_opened');
    $('#body_wrapper_smp').removeClass('is_menu_opened');
  }
  $('.home_top_container').css({"opacity": '1'});
  // $('.home_top_container').css({"background-position": i+'% 0%'});


  // var IntervarID;
  // var timer = false;
  // var is_set_move = false;
  // set_move_img();
  // $(window).resize(function() {
  //     if (timer !== false) {
  //         clearTimeout(timer);
  //     }
  //     timer = setTimeout(function() {
  //         set_move_img();
  //     }, 100);
  // });
   
  // var i = 100;
  // $('.home_top_container').css({"background-position": -i+'px 0px'});
  // i+=100;
  // function move_img(){
  //   $('.home_top_container').css({"background-position": -i+'px 0px'});
    
  //   if(i>=10000){
  //     clearInterval(IntervarID);
  //   }
  //   else if(i>=0){
  //     i+=100;
  //   }
  // }
  // function set_move_img(){
  //   if($(window).width()<=700){
  //     clearInterval(IntervarID);
  //     is_set_move = false;
  //   }else if(is_set_move === false){
  //     IntervarID = setInterval(move_img,2000);
  //     is_set_move = true;
  //   }
  // }

});

