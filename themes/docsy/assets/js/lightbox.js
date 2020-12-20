/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(function () {
  var $popup = $('#popup');
  if(!$popup.length){
    return;
  }
  $('.td-main img').on('click', function (event) {
    if($(this).data('nolightbox')){
      return;
    }
    event = event || window.event;
    var target = document.elementFromPoint(event.clientX, event.clientY);
    showBig(target.src);
  });
  $popup.on('click', function () {
    $(this).hide()
  });
  function showBig(src) {
    $popup.find('img').attr('src', src);
    $popup.show()
  }
})
