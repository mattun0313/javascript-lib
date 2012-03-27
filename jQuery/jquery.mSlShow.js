//================================================
//  jquery.js
//
//  指定されたタグ内のそれぞれの子div要素をスライドショーさせるjQueryプラグインです。
//
//  使用方法
//  ※jquery.jsを先に読み込む必要があります。
//  <div id="AAAAA">
//    <div><img /><div>
//    <div><img /><div>
//    ・
//    ・
//    ・
//  </div>を記述
//  $(function(){
//    $('#AAAAA').mSlShow(opt);
//  });で実行
//	option
//		easing:fadeout easing
//		time:show time
//		du:fadeout time
//
//  version 1.0.0
//　MIT license.
//
//  2012.03.09  masanori.matsumoto  新規作成
//================================================

(function($){
  $.fn.mSlShow = function(opt){
    var cnt = 1;
    var timId = 0;

    //初期設定
    var defaultOpt = {
      easing:'linear',
      time:5000,
      du:3000
    }
    //
    opt = $.extend(defaultOpt, opt);

    var target = this;
    var targetChild = $(target).children('div');
    var max_cnt = targetChild.length;
    var curImg = 0;
    
    targetChild.each(
      function(){
        $(this).css({zIndex:max_cnt-cnt,position:'absolute'});
        cnt++;
      }
    );
    
	  var mSlShowFade = (function (){
	  	return function(){
	  		if(timId){
			    targetChild.eq(curImg).animate(
			      {opacity: 0},
			      {duration: opt.du, easing: opt.easing,
			        complete: function(){
			          $(this).css({zIndex:0,opacity:1});
			          $(this).siblings().each(
			            function(){
			              var zi = parseInt($(this).css('z-index'))+1;
			              $(this).css('z-index',zi);
			            }
			          );
			          curImg++;
			          if(curImg>=max_cnt) curImg=0;
						    timId = setTimeout(mSlShowFade, opt.time);
			        }
			      }
			    );
			  }else{
			    timId = setTimeout(arguments.callee,opt.time);
			  }
		  }
  	})();

    mSlShowFade();
    return target;
  };
})(jQuery);