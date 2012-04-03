//================================================
//  jquery.mParallax.js
//
//  スクロールで視差効果のアニメーションを処理するjQueryプラグイン。
//	※jquery.jsを先に読み込む必要があります。
//	使用方法は、簡単に「mParallax-doc.txt」に記述してあります。
//
//  version 1.0.0
//　MIT license.
//
//  2012.03.29  masanori.matsumoto  新規作成
//================================================
(function($){
	$.fn.extend({
		mPrlx: function(opt){
			//初期設定
			opt = $.extend({
				box:false,
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
			if(opt.startPos.x - opt.endPos.x > 0) opt.speed.x *= -1;
			if(opt.startPos.y - opt.endPos.y > 0) opt.speed.y *= -1;
			return this.each(function(){
				var target = $(this);
				if(opt.box){
					var targetP = $(this).parent();
					//box指定の場合は念のためスタイルを設定
					target.css('position','absolute');
					if(targetP.css('position') == 'static'){
						targetP.css('position','relative');
					}
				}
				var setPos = function(){
					var chkTarget;
					if(opt.box) chkTarget = targetP;
					else chkTarget = target;
					var chk = chkFrameIn(chkTarget);
					if(chk.inFlg){
						//表示領域にいる場合
						var dispPos = chk.obj.sy + chk.obj.wh - chk.obj.iti.top;
						var posX = opt.startPos.x + dispPos * opt.speed.x;
						var posY = opt.startPos.y + dispPos * opt.speed.y;
						if((opt.speed.x>0 && posX>opt.endPos.x) || (opt.speed.x<0 && posX<opt.endPos.x)){
							posX = opt.endPos.x;
						}
						if((opt.speed.y>0 && posY>opt.endPos.y) || (opt.speed.y<0 && posY<opt.endPos.y)){
							posY = opt.endPos.y;
						}
						if(opt.box){
							target.css({left:posX+'px', top:posY+'px'});
						}else{
							target.css({backgroundPositionX:posX+'px', backgroundPositionY:posY+'px'});
						}
					}
				}
				setPos();
				$(window).bind('scroll resize', setPos);
			})
		},
		mPrlxAnime: function(opt){
			//初期設定
			opt = $.extend({
				speed:0.1,
				maxNum:20
			}, opt);
			return this.each(function(){
				var target = $(this);
				var setImage = function(){
					var chk = chkFrameIn(target);
					if(chk.inFlg){
						//表示領域にいる場合
						var dispPos = chk.obj.sy + chk.obj.wh - chk.obj.iti.top;
						var imgNum = Math.ceil(dispPos*opt.speed);
						if(!imgNum) imgNum = 1;
						if(imgNum > opt.maxNum) imgNum = opt.maxNum;
						//target.attr('src','hoge'+imgNum+'.jpg');
					}
				}
				setImage();
				$(window).bind('scroll resize', setImage);
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