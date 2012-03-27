//================================================
//  jquery.mCal.js
//
//  CSSで汎用的にデザイン可能なように、素のカレンダーを出力するjQueryプラグインです。
//　クラス名をそれぞれに出力しますので、CSSで自由にデザインしてください。
//
//  使用方法
//  ※jquery.jsを先に読み込む必要があります。
//  HTMLの組み込みたい場所に<div id="AAAAA"></div>を記述
//  $(function(){
//    $('#AAAAA').mCal();
//  });で実行
//
//-------- ターゲットのIDの中にHTML展開します
//         HTMLは好きなように編集してください。
//--------
//
//  version 1.0.0
//　MIT license.
//
//  2012.03.06  masanori.matsumoto  新規作成
//  2012.03.07  masanori.matsumoto  祝日判定追加（2012/03/07現在）
//                                  独自休日ファイルを読込で処理追加
//================================================

(function($){
  $.fn.mCal = function(opt){
    var target = this;  //ターゲット格納変数

    //初期設定
    var defaultOpt = {
      day: new Date(),
      weekTl:['日','月','火','水','木','金','土'],
      weekCls:['sun','mon','tue','wed','thu','fri','sat'],
      file:'',/* original holiday(file type「yyyy/mm/dd,yyyy/mm/dd,...」) */
      jHolFlg:false/*japanese holiday*/
    }
    //初期設定をオプションのオブジェクトで上書き
    opt = $.extend(defaultOpt, opt);

    if(opt.file==''){
      createCal(target,opt);
    }else{
      //独自休日ファイルを非同期で読込み後処理
      $.ajax({
        url:opt.file,
        type:'get',
        dataType:'text',
        success:function(data){
          opt.holiData = data;
          createCal(target,opt);
        },
        error:function(obj,sts,errobj){
          createCal(target,opt);
        }
      })
    }

    return target;
  };

  //カレンダー作成実処理
  function createCal(target,opt){
    var strHtml = "";   //HTMLコード一次退避領域
    var stDay = (new Date(opt.day.getFullYear(),opt.day.getMonth(),1)).getDay();
    var lastDate = (new Date(opt.day.getFullYear(),opt.day.getMonth()+1,0)).getDate();
    var row = Math.ceil((stDay + lastDate)/7);
    var cntDay = 1;
    var arrCal = [];
    var today = new Date();
    var curDay;
    var hd=[];

    if('holiData' in opt){
      var hd = opt.holiData.split(',');
    }

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
        var clsName = opt.weekCls[j];
        if(arrCal[i][j]!='&nbsp;'){
          curDay = new Date(opt.day.getFullYear(),opt.day.getMonth(),arrCal[i][j]);
          //当日ならクラス名「today」付加
          if(today.getFullYear()==curDay.getFullYear()&&today.getMonth()==curDay.getMonth()&&today.getDate()==curDay.getDate()){
            clsName += ' today';
          }
          //祝日判定
          if(opt.jHolFlg&&jHoliday(curDay)){
            clsName += ' jHol';
          }
          //opt.fileから読み込んだ休日判定
          for(var k=0;k<hd.length;k++){
            if(curDay.getTime()==(new Date(hd[k])).getTime()){
              clsName += ' orHol';
              break;
            }
          }
        }
        strHtml += '<th class="'+clsName+'">' + arrCal[i][j] + '</th>'        
      }
      strHtml += '</tr>'
    }
    strHtml += '</table>'

    target.append(strHtml);//DOMに出力

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
  //-------------------祝日判定処理
  function jHoliday(curDay){
    var day = curDay.getDay();
    var y = curDay.getFullYear();
    var m = curDay.getMonth()+1;
    var d = curDay.getDate();
    var yesterDay;

    switch(m){
      case 1:
        if(d==1) return '元旦';
        if(y>=2000){
          if(day==1&&Math.ceil(d/7)==2) return '成人の日';
        }else{
          if(d==15) return '成人の日';
        }
        break;
      case 2:
        if(d==11) return '建国記念の日';
        break;
      case 3:
        if(d==ssDay(y,0)) return '春分の日';
        break;
      case 4:
        if(d==29){
          if(y>=2007) return '昭和の日';
          if(y>=1989) return 'みどりの日';
          return '天皇誕生日';
        }
        break;
      case 5:
        if(d==3) return '憲法記念日';
        if(d==4){
          if(y>=2007) return 'みどりの日';
          if(y>=1986&&day>1) return '国民の休日'; //日曜は日曜、月曜だと憲法記念日の振替
        }
        if(d==5) return 'こどもの日';
        if(d==6){
          if(y>=2007){
            if(day==2||day==3) return '振替休日';
          }
        }         
        break;
      case 6:
        break;
      case 7:
        if(y>=2003){
          if(day==1&&Math.ceil(d/7)==3) return '海の日';
        }else{
          if(y>=1996&&d==20) return '海の日';
        }
        break;
      case 8:
        break;
      case 9:
        if(d==ssDay(y,1)) return '秋分の日';
        if(y>=2003){
          if(day==1&&Math.ceil(d/7)==3) return '敬老の日';
          if(day==2&&d==ssDay(y,1)-1) return '国民の休日';
        }else{
          if(y>=1966&&d==15) return '敬老の日';
        }
        break;
      case 10:
        if(y>=2000){
          if(day==1&&Math.ceil(d/7)==2) return '体育の日';
        }else{
          if(y>=1966&&d==10) return '体育の日';
        }
        break;
      case 11:
        if(d==3) return '文化の日';
        if(d==23) return '勤労感謝の日';
        break;
      case 12:
        if(y>=1989&&d==23) return '天皇誕生日';
        break;
    }
    //振替休日判定(月曜だけ)
    if(day==1){
      yesterDay = new Date(y,m-1,d-1);
      return jHoliday(yesterDay);
    }
    return ''
  }
  //春秋分の日計算-1980〜2100-（実際には官報で翌年の春分日を発表するので確定ではない）
  function ssDay(y,kbn){
    var baseNum; 
    if(kbn==0){
      baseNum = 20.8431;
    }else{
      baseNum = 23.2488;
    }
    return Math.floor(baseNum + 0.242194 * (y-1980)) - Math.floor((y-1980)/4);
  }

})(jQuery);