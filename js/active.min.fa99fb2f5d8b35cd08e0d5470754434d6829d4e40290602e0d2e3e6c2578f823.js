$(function(){init();function init(){bindClick();setActive();}
function bindClick(){$('.title-box a').on('click',function(){var hash=$(this).attr('href')
scrollTop(hash);$('.card-wrapper .card').removeClass('active');$(hash).parents('.card').addClass('active');});$('.link-type').on('click',function(){var hash=$(this).attr('href')
scrollTop(hash,120);})}
function scrollTop(hash,offset){if(!$(hash).length){return;}
$('html,body').animate({scrollTop:$(hash).offset().top-(offset||160)})}
function setActive(){var hash=location.hash;if(!location.hash||!$(hash).length){return;}
$(hash).parents('.card').addClass('active');scrollTop(hash)}})