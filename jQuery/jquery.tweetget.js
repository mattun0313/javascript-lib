//================================================
//	jquery.tweetget.js
//
//	指定したユーザーのtwitter情報を取得し、
//	HTMLコードに展開するプラグインです。
//	使用と修正はフリーですがきっと自分以外使いにくいかも…
//
//	使用方法
// 	<head>内でこのjsファイルを読み込んでください。
//		※jquery.jsを先に読み込む必要があります。
//	HTMLの組み込みたい場所に<div id="AAAAA"></div>を記述
//	$(function(){
//		$('#AAAAA').tweetget("ツイッターID",[{count}]);
//	});で実行
//
//-------- ターゲットのIDの中にHTML展開します
//         HTMLは好きなように編集してください。
//--------
//	デザインはCSSで自由に行ってください。
//
//	参照サイト　http://www.devirtuoso.com/2009/06/how-to-create-a-twitter-jquery-plugin/?dzref=193075
//
// 	2012.03.06 	masanori.matsumoto	新規作成
//================================================

(function($){
	$.fn.tweetget = function(username, options){
		//usernameが設定されているかチェック
		if(username){
			var strHtml = ""; 	//HTMLコード一次退避領域
			var strFoot = ""; 	//HTMLコード一次退避領域
			var SetFlg = false;	//1回でいいやつセット済みかのフラグ
			//初期設定
			var defaultSettings = {
				count: '10'
			}
			//初期設定をオプションのオブジェクトで上書きして新しいオブジェクトを生成
			var settings = $.extend(defaultSettings, options);
			
			// Twitter JSON APIのURL
			var url = "http://twitter.com/status/user_timeline/"+username+".json?count="+settings.count+"&callback=?";
			
			//ターゲット格納変数
			var holder = this;	
						
			//twitterからつぶやき情報取得
			$.getJSON(url, function(data){
				//展開
				strHtml = "<ul>";
			
//console.log(data);
				$.each(data, function(i, item){	
//console.log(item);
					if(SetFlg == false){
						strFoot = '<div id="twFoot" class="clearfix"><div id="twImg"><a href="http://twitter.com/#!/'+username+'" target="_blank"><img src="'+item.user['profile_image_url']+'" width="48" height="48" alt="twitterアイコン" /></a></div>';
						strFoot += '<p id="twName"><a href="http://twitter.com/#!/'+username+'" target="_blank">@'+username+'</a></p></div>';
						SetFlg = true;
					}

					strHtml += '<li><p class="dttm">' + makeTime(item.created_at) + '</p>';
					strHtml += '<p class="twTxt">' + item.text.makeLinks() + '</p></li>';
				});
				strHtml += "</ul>";
				
				
				//HTMLに出力
				holder.append(strHtml);
				holder.append(strFoot);
			});
		}else{
			console.debug("ユーザー名は必須です。パラメータを確認して下さい。");
			holder.empty();
			holder.append("<p>twitter情報を取得できませんでした…</p>");
		}
		
		
		// つぶやきにURLを含む場合はリンクに変更
		String.prototype.makeLinks = function() {
			return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(str) {
				return str.link(str);
			});
		}; 
		
		//つぶやいた時間を編集　Wed Dec 22 17:06:49 +0000 2010
		var makeTime = function(create){
			var date = new Date(create);
			date.setHours(date.getHours()); // UTC -> JST (+9時間)
			var y    = date.getFullYear();         // 月取得
			var mon  = date.getMonth() + 1;     // 月取得
			var day  = date.getDate();          // 日取得
			var h    = date.getHours();
			var min  = date.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			create = y+ '/' + mon + '/' + day +'　' + h + ':' + min ;
			return create;
		}		
		
		return this;
	};
})(jQuery);