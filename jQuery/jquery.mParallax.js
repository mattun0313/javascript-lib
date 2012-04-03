//================================================
//  jquery.mParallax.js
//
//  スクロールで視差効果のアニメーションを処理するjQueryプラグイン。
//
//  使用方法
//  ※jquery.jsを先に読み込む必要があります。
//	・背景画像をアニメーションする場合
//  	<div id="hoge"></div>に背景を設定
//  	$(function(){
//    	$('#hoge').mParallaxBg(option);
//  	});で実行
//		[option]
//			speed:{x:speed x, y:speed y}
//			startPos:{x:positon x, y:position y}
//			endPos:{x:positon x, y:position y}
//			※startPosはフレームインしたタイミングの位置、
//			 endPosはストップ位置です。
//
//	・ボックスをアニメーションする場合
//  	<div id="hoge">
//			<div id="huga"></div>
//		</div>
//  	$(function(){
//    	$('#huga').mParallaxBox(option);
//  	});で実行
//		[option]
//			speed:{x:speed x, y:speed y}
//			startPos:{x:positon x, y:position y}
//			endPos:{x:positon x, y:position y}
//			※startPosは親要素がフレームインしたタイミングの位置、
//			 endPosはストップ位置です。
//
//  version 1.0.0
//　MIT license.
//
//  2012.03.29  masanori.matsumoto  新規作成
//================================================

(function($){
	$.fn.extend({
		mParallaxBg: function(opt){
			//初期設定
			opt = $.extend({
				speed:{
					x:0,
					y:0.2
				},
				startPos:{
					x:0,
					y:0
				},
				endPos:{
					x:0,
					y:0
				}
			}, opt);
			if(opt.startPos.x - opt.endPos.x > 0){
				opt.speed.x *= -1;
			}
			if(opt.startPos.y - opt.endPos.y > 0){
				opt.speed.y *= -1;
			}
			return this.each(function(){
				var target = $(this);
				var setBgPos = function(){
					var chk = chkFrameIn(target);
					if(chk.inFlg){
						//表示領域にいる場合
						var dispPos = chk.obj.sy + chk.obj.wh - chk.obj.iti.top;
						var bgPosX = opt.startPos.x + dispPos * opt.speed.x;
						var bgPosY = opt.startPos.y + dispPos * opt.speed.y;
						if((opt.speed.x>0 && bgPosX>opt.endPos.x) || (opt.speed.x<0 && bgPosX<opt.endPos.x)){
							bgPosX = opt.endPos.x;
						}
						if((opt.speed.y>0 && bgPosY>opt.endPos.y) || (opt.speed.y<0 && bgPosY<opt.endPos.y)){
							bgPosY = opt.endPos.y;
						}
						target.css({backgroundPositionX:bgPosX+'px', backgroundPositionY:bgPosY+'px'});
					}
				}
				setBgPos();
				$(window).bind('scroll resize', setBgPos);
			})
		},
		mParallaxBox: function(opt){
			//初期設定
			opt = $.extend({
				speed:{
					x:0,
					y:0.2
				},
				startPos:{
					x:0,
					y:0
				},
				endPos:{
					x:0,
					y:0
				}
			}, opt);
			if(opt.startPos.x - opt.endPos.x > 0){
				opt.speed.x *= -1;
			}
			if(opt.startPos.y - opt.endPos.y > 0){
				opt.speed.y *= -1;
			}
			return this.each(function(){
				var target = $(this);
				var parent = $(this).parent();
				target.css('position','absolute');
				if(parent.css('position') == 'static'){
					parent.css('position','relative');
				}
				var setBoxPos = function(){
					var chk = chkFrameIn(parent);
					if(chk.inFlg){
						//表示領域にいる場合
						var dispPos = chk.obj.sy + chk.obj.wh - chk.obj.iti.top;
						var boxPosX = opt.startPos.x + dispPos * opt.speed.x;
						var boxPosY = opt.startPos.y + dispPos * opt.speed.y;
						if((opt.speed.x>0 && boxPosX>opt.endPos.x) || (opt.speed.x<0 && boxPosX<opt.endPos.x)){
							boxPosX = opt.endPos.x;
						}
						if((opt.speed.y>0 && boxPosY>opt.endPos.y) || (opt.speed.y<0 && boxPosY<opt.endPos.y)){
							boxPosY = opt.endPos.y;
						}
						target.css({left:boxPosX+'px', top:boxPosY+'px'});
					}
				}
				setBoxPos();
				$(window).bind('scroll resize', setBoxPos);
			})
		}		
	})
	
	function chkFrameIn(target){
		var obj = {
			/*ww:$(window).width(),*/
			wh:$(window).height(),
			/*sx:$(window).scrollLeft(),*/
			sy:$(window).scrollTop(),
			iti:target.offset(),
			/*tw:target.width(),*/
			th:target.height()
		}		
		/*return {inFlg:(obj.sy + obj.wh >= obj.iti.top && obj.sy <= obj.iti.top + obj.th) && (obj.sx + obj.ww >= obj.iti.left && obj.sx <= obj.iti.left + obj.tw),obj:obj};*/
		return {inFlg:(obj.sy + obj.wh >= obj.iti.top && obj.sy <= obj.iti.top + obj.th),obj:obj};
	}
})(jQuery);