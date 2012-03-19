//================================================
//  jquery.mSlShow.js
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
//		du:fadeout time
//
//	注意）
//	timerでは関数や変数のオブジェクトをバインドできない為、
//	global(windowオブジェクト)にmSlShowオブジェクトを追加して対応しています。
//	※他にいい方法があれば教えてください！
//
//  version 1.0.0
//　MIT license.
//
//  2012.03.09  masanori.matsumoto  新規作成
//================================================

(function($){
  window.mSlShow = {};
  $.fn.mSlShow = function(opt){
    var cnt = 1;
    var par = {};

    //初期設定
    var defaultOpt = {
      easing:'linear',
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
    
    window.mSlShow.par = par;
    
    setTimeout('mSlShow.mSlShowFade()',3000);
    
    return par.target;
  };

  window.mSlShow.mSlShowFade = function (){
    mSlShow.par.targetChild.eq(mSlShow.par.curImg).animate(
      {opacity: 0},
      {duration: mSlShow.par.opt.du, easing: mSlShow.par.opt.easing,
        complete: function(){
          $(this).css({zIndex:0,opacity:1});
          $(this).siblings().each(
            function(){
              var zi = parseInt($(this).css('z-index'))+1;
              $(this).css('z-index',zi);
            }
          );
          mSlShow.par.curImg++;
          if(mSlShow.par.curImg>=mSlShow.par.max_cnt) mSlShow.par.curImg=0;
        }
      }
    );
    setTimeout('mSlShow.mSlShowFade()',7000);
  }

})(jQuery);