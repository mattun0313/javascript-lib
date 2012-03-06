//================================================
//	jquery.mCal.js
//
//	CSSで汎用的にデザイン可能なように、素のカレンダーを出力するjQueryプラグインです。
//　クラス名をそれぞれに出力しますので、CSSで自由にデザインしてください。
//
//	使用方法
//	※jquery.jsを先に読み込む必要があります。
//	HTMLの組み込みたい場所に<div id="AAAAA"></div>を記述
//	$(function(){
//		$('#AAAAA').mCal();
//	});で実行
//
//-------- ターゲットのIDの中にHTML展開します
//         HTMLは好きなように編集してください。
//--------
//
//	version 1.0.0
//　MIT license.
//
// 	2012.03.06 	masanori.matsumoto	新規作成
//================================================

(function($){
	$.fn.mCal = function(opt){
		var target = this;	//ターゲット格納変数
		
		//初期設定
		var defaultOpt = {
			day: new Date(),
			weekTl:['日','月','火','水','木','金','土'],
			weekCls:['sun','mon','tue','wed','thu','fri','sat'],
			file:''
		}
		//初期設定をオプションのオブジェクトで上書き
		opt = $.extend(defaultOpt, opt);
		createCal(target,opt);
		
		return target;
	};
	
	function createCal(target,opt){
		var strHtml = ""; 	//HTMLコード一次退避領域
		var stDay = (new Date(opt.day.getFullYear(),opt.day.getMonth(),1)).getDay();
		var lastDate = (new Date(opt.day.getFullYear(),opt.day.getMonth()+1,0)).getDate();
		var row = Math.ceil((stDay + lastDate)/7);
		var cntDay = 1;
		var arrCal = [];
		var today = new Date();
		
		$('.prev',target).unbind();
		$('.next',target).unbind();
		target.empty();
		
		//カレンダー配列作成
		for(var i=0;i<row;i++){
			var arrCalIn = [];
			for(var j=0;j<7;j++){
				if((i==0&&j<stDay)||cntDay>lastDate){
					arrCalIn.push('&nbsp;');
				}else{
					arrCalIn.push(cntDay);
					cntDay++;
				}
			}
			arrCal.push(arrCalIn);
		}
					
		//HTML編成
		strHtml = '<table class="mCal">'
		strHtml += '<caption><a href="#" class="prev">←</a>' + opt.day.getFullYear() + '年' + (opt.day.getMonth()+1) + '月' + '<a href="#" class="next">→</a></caption>'
		strHtml += '<tr>'
		for(var i=0;i<opt.weekTl.length;i++){
			strHtml += '<th class="'+opt.weekCls[i]+'">' + opt.weekTl[i] + '</th>'
		}
		strHtml += '</tr>'
		for(var i=0;i<arrCal.length;i++){
			strHtml += '<tr>'
			for(var j=0;j<7;j++){
				//当日ならクラス名「today」付加
				if(today.getFullYear()==opt.day.getFullYear()&&today.getMonth()==opt.day.getMonth()&&today.getDate()==arrCal[i][j]){
					strHtml += '<th class="'+opt.weekCls[j]+' today'+'">' + arrCal[i][j] + '</th>'				
				}else{
					strHtml += '<th class="'+opt.weekCls[j]+'">' + arrCal[i][j] + '</th>'
				}
			}
			strHtml += '</tr>'
		}
		strHtml += '</table>'
		
		target.append(strHtml);

		$('.prev',target).bind('click',$.extend({},opt),function(e){
			e.data.day = new Date(e.data.day.getFullYear(),e.data.day.getMonth()-1,1);
			createCal(target,e.data);
			return false;
		});
		$('.next',target).bind('click',$.extend({},opt),function(e){
			e.data.day = new Date(e.data.day.getFullYear(),e.data.day.getMonth()+1,1);
			createCal(target,e.data);
			return false;
		});
				
	}
})(jQuery);