(function($){'use strict';$(function(){$('[data-toggle="tooltip"]').tooltip();$('[data-toggle="popover"]').popover();$('.popover-dismiss').popover({trigger:'focus'})});function bottomPos(element){return element.offset().top+element.outerHeight();}
$(function(){var promo=$(".js-td-cover");if(!promo.length){return}
var promoOffset=bottomPos(promo);var navbarOffset=$('.js-navbar-scroll').offset().top;var threshold=Math.ceil($('.js-navbar-scroll').outerHeight());if((promoOffset-navbarOffset)<threshold){$('.js-navbar-scroll').addClass('navbar-bg-onscroll');}
$(window).on('scroll',function(){var navtop=$('.js-navbar-scroll').offset().top-$(window).scrollTop();var promoOffset=bottomPos($('.js-td-cover'));var navbarOffset=$('.js-navbar-scroll').offset().top;if((promoOffset-navbarOffset)<threshold){$('.js-navbar-scroll').addClass('navbar-bg-onscroll');}else{$('.js-navbar-scroll').removeClass('navbar-bg-onscroll');$('.js-navbar-scroll').addClass('navbar-bg-onscroll--fade');}});});}(jQuery));;(function($){'use strict';$(function(){var article=document.getElementsByTagName('main')[0];if(!article){return;}
var headings=article.querySelectorAll('h1, h2, h3, h4, h5, h6');headings.forEach(function(heading){if(heading.id){var a=document.createElement('a');a.style.visibility='hidden';a.setAttribute('aria-hidden','true');a.innerHTML=' <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>';a.href='#'+heading.id;heading.insertAdjacentElement('beforeend',a);heading.addEventListener('mouseenter',function(){a.style.visibility='initial';});heading.addEventListener('mouseleave',function(){a.style.visibility='hidden';});}});});}(jQuery));;(function($){'use strict';var Search={init:function(){$(document).ready(function(){$(document).on('keypress','.td-search-input',function(e){if(e.keyCode!==13){return}
var query=$(this).val();var searchPage="/search/?q="+query;document.location=searchPage;return false;});});},};Search.init();}(jQuery));;$(function(){var $popup=$('#popup');if(!$popup.length){return;}
$('.td-main img').on('click',function(event){if($(this).data('nolightbox')){return;}
event=event||window.event;var target=document.elementFromPoint(event.clientX,event.clientY);showBig(target.src);});$popup.on('click',function(){$(this).hide()});function showBig(src){$popup.find('img').attr('src',src);$popup.show()}});$(function(){$('.dropdown-title').on('click',function(){$(this).next('.nav-dropdown').toggle()})
$('.sidebar-button').on('click',function(){$('.sidebar').toggle()
$('.sidebar-mask').toggle()})
$('.sidebar-mask').on('click',function(){$('.sidebar-button').trigger('click')})});(function(){var reg=/\/docs\/[a-zA-Z\-]+\/([\w|\.]+)\//;var res=reg.exec(location.href);var version=res&&res[1]||"latest";docsearch({apiKey:'a0589fc2fb9cc4876b9443b2911221bc',indexName:'skywalking',inputSelector:'#algolia-search-input',algoliaOptions:{'facetFilters':["version:"+version],hitsPerPage:8},debug:false});})();$(function(){var $popup=$('.sky-event-popup')
var key='SkyWalkingPopupClosedTime';if(!$popup||isShowed(key)){return;}
var $items=$popup.find('.item');var $pic=$popup.find('.pic');init()
function init(){var count=getActiveCount()
if(!count){return;}
showPopover(count)
bindClick()}
function getActiveCount(){var count=0;$.each($items,function(index,item){var startTime=$(item).data('starttime');var endTime=$(item).data('endtime');if(isDuringTime(startTime,endTime)){$(item).show()
count++}})
return count}
function showPopover(count){var src;var posterSrc;var link;var $contentBox=$popup.find('.content-box');if(count===1){$contentBox.addClass('one')
src=$items.eq(0).data('img')
posterSrc=$items.eq(0).data('poster')
link=$items.eq(0).data('link')}else{$items.sort(function(a,b){var aDate=new Date($(a).data('endtime'))
var bDate=new Date($(b).data('endtime'))
return aDate.getTime()-bDate.getTime()})
$.each($items,function(index,item){var img=$(item).data('img')
var poster=$(item).data('poster')
if(poster){posterSrc=poster;link=$(item).data('link');return false}
if(img){src=img;return false}})
$contentBox.html($items)}
if(posterSrc&&document.body.clientWidth>=440){$pic.attr('src',posterSrc);$pic.on('click',function(){window.location.href=link;$popup.find('.fa-window-close').trigger('click')})
$('.pic-wrapper').addClass('poster')
$('.fa-window-close').css('color','#8797ac')
$contentBox.hide()}else{if(!src){src=$pic.data('img')
$pic.css('height','auto')}
$pic.attr('src',src)}
setTimeout(function(){$popup.show()},1000)}
function bindClick(){$popup.find('.fa-window-close').on('click',function(){localStorage.setItem(key,new Date());$popup.hide()})}
function isShowed(key){var storageTime=formatTime(localStorage.getItem(key));var now=formatTime(new Date());return storageTime===now;}
function formatTime(time){var date=new Date(time);return(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());}
function isDuringTime(startTimeStr,endTimeStr){var currTime=new Date();var startTime=new Date(startTimeStr);var endTime=new Date(endTimeStr);return currTime<=endTime&&(currTime>=startTime||!startTimeStr)}})