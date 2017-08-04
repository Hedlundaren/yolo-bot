"use strict";

function start(){
    console.log("Welcome.");

    var fadeTime = 100;

    // mouse over
    $(".cool-buttons").mouseover(function(){
      $(this).fadeTo(fadeTime, 0.8);
    });

    // mouse out
    $(".cool-buttons").mouseleave(function(){
      $(this).fadeTo(fadeTime, 1.0);
    });

    // click
    $(".cool-buttons").click(function(){
      $(this).slideToggle();
    });
}

// When window has loaded
window.onload = function () {

    start();
};
