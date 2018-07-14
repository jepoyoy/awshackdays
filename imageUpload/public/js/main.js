/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

// Put variables in global scope to make them available to the browser console.
var video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');
canvas.width = 300;
canvas.height = 300;

var button = document.querySelector('#snapshot');
if(button){
button.onclick = function() {
  canvas.getContext('2d').
    drawImage(video, 0, 0, video.width, video.height);
  var customerFaceImg = document.querySelector('#customerFaceImg');
  customerFaceImg.src = canvas.toDataURL();
  document.querySelector("#customerFace").value = "";
  document.querySelector("#customerFace").value = canvas.toDataURL();
};
}

var matchBtn = document.querySelector('#snapshotMatch');
if(matchBtn){
matchBtn.onclick = function() {
  canvas.getContext('2d').
    drawImage(video, 0, 0, video.width, video.height);
  var customerFaceImg = document.querySelector('#inputImage1Prev');
  customerFaceImg.src = canvas.toDataURL();
  document.querySelector("#inputImage1").value = "";
  document.querySelector("#inputImage1").value = canvas.toDataURL();
};
}

function previewFile() {
  var preview = document.querySelector('#customerIdImg');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
    document.querySelector("#customerId").value = "";
    document.querySelector("#customerId").value = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function previewFileForMatch() {
  var preview = document.querySelector('#inputImage1Prev');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
    document.querySelector("#inputImage1").value = "";
    document.querySelector("#inputImage1").value = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

var constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
