$(function() {

  var $activeMainMenu = null;
  var $activeSubMenu = null;

  $('a').click( function( e ) {
    e.preventDefault();
  } );

  $('.main-menu li').click( function( e ) {
    if( $activeMainMenu == $(this).attr('id') ) {
      $activeMainMenu = null;
      $activeSubMenu.toggle();
      $activeSubMenu = null;
      return;
    }
    if( $activeSubMenu )
      $activeSubMenu.toggle();
    $activeSubMenu = $(this).children('.sub-menu');
    $activeMainMenu = $(this).attr('id');
    $activeSubMenu.toggle();
  } );

});