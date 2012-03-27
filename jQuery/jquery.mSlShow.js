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
    var par = {};
    var timId = 0;

    //初期設定
    var defaultOpt = {
      easing:'linear',
      time:5000,
      du:3000
    }
    //
    opt = $.extend(defaultOpt, opt);

    par.target = this;
    par.targetChild = $(par.target).children('div');
    par.max_cnt = par.targetChild.length;
    par.curImg = 0;
    par.opt = opt;
    
    par.targetChild.each(
      function(){
        $(this).css({zIndex:par.max_cnt-cnt,position:'absolute'});
        cnt++;
      }
    );
    
	  var mSlShowFade = (function (){
	  	return function(){
	  		if(timId){
			    par.targetChild.eq(par.curImg).animate(
			      {opacity: 0},
			      {duration: par.opt.du, easing: par.opt.easing,
			        complete: function(){
			          $(this).css({zIndex:0,opacity:1});
			          $(this).siblings().each(
			            function(){
			              var zi = parseInt($(this).css('z-index'))+1;
			              $(this).css('z-index',zi);
			            }
			          );
			          par.curImg++;
			          if(par.curImg>=par.max_cnt) par.curImg=0;
						    timId = setTimeout(mSlShowFade,par.opt.time);
			        }
			      }
			    );
			  }else{
			    timId = setTimeout(arguments.callee,par.opt.time);
			  }
		  }
  	})();

    mSlShowFade();
    return par.target;
  };
})(jQuery);