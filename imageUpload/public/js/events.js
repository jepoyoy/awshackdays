/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var url_string = window.location.href;
var url = new URL(url_string);
var apiurl = url.searchParams.get("apiurl");

$("#finalizeForm").submit(function(e){
  e.preventDefault();

  $.post( "/upload", 
    { 
      customerFace: document.querySelector("#customerFace").value, 
      customerId: document.querySelector("#customerId").value
    })
  .done(function( data ) {
    alert( "User Saved!" );
  });

});

$("#searchForm").submit(function(e){
  e.preventDefault();

  $.post( "http://"+apiurl+"/acsp-facematch/searchfacebydetails", 
    { 
      id: document.querySelector("#userid").value,
      name: document.querySelector("#username").value
    })
  .done(function( data ) {
    alert( "Data Loaded: " + data );
    document.querySelector('#inputImage2').value = "";
    document.querySelector('#inputImage2').value = data.customerFace;
    document.querySelector('#inputImage2Prev').src = data.customerFace;
  });

});

$("#matchImages").click(function(e){
  $("#loading").show();
  $("#resultPanel").hide();
  $.post( "http://"+apiurl+"/acsp-facematch/validatefacetoface", 
    { 
      inputFace: document.querySelector("#inputImage1").value,
      customerFace: document.querySelector("#inputImage2").value,
      requestSrc: "TEST"
    })
  .done(function( data ) {
    var resultP = document.querySelector('#resultPanel');
    if(data.matchResult == true){
      resultP.style.color = "green";
      resultP.innerHTML = "MATCH"
    }else{
      resultP.style.color = "red";
      resultP.innerHTML = "NOT MATCH"
    }
    $("#loading").hide();
    $("#resultPanel").show();
  }).error(function( data ) {
    console.log( "One or both inputs do not have detectable faces");
    var resultP = document.querySelector('#resultPanel');
    resultP.style.color = "red";
    resultP.innerHTML = "INPUT ERROR"
    $("#loading").hide();
    $("#resultPanel").show();
  });
});