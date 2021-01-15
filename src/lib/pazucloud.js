//暂时不支持https协议，强制转到http协议的地址
/* eslint-disable */
var urlA=window.location.href.split(':');
if (urlA[0].toLowerCase() == 'https') {
    urlA[0] = 'http';
    window.location.href = urlA.join(":");
}

if (!window.PAZU_Config) {
    window.PAZU_Config = {
        prot: "http",
        server: 'localhost',
        port: 6894,
        license: '5892D9CA026B5963809D9852ECCA90A1|刘果果' //PAZU授权许可码，非商业应用或者测试可以免费申请
    }
}

if (!window.PAZU) window.PAZU = {};

/*
 *以下为PAZU对象的原型，包括一个print方法和一个TPrinter的子对象
 */
/*=========================================================================================
 PAZU.print = function (xContent, aryJsRef, aryCssRef, bPreview,bPromptUser，callBack){}
 xContent: 如果类型是字符串，则看第一个字符，如果第一个字符为"{"或者"[" 则为JSON 类型,如果第一个字符为"<" 则看 第二个字符，如果为?则为xml，否则为html, 如果非html/xml/json则为 页面元素的ID
 如果类型是Object（非数组），则看看xContent[0]是否为Object,如果是，则为JQ的对象，否则为原生html元素（这只是简单的容错的处理方式，对于某些特殊情况则无能为力，因此建议大家使用原生html元素传入）
 如果为null,则打印当前页面所有内容

 aryJsRef[Optional]: 如果想把xContent重新整理后再打印，则需要指定整理过程所用的外部javascript文件，如: ["http://cdn.jq.com/jquery.mini.js","myHandler.js","otherJsRef.js"...]
 特别注意：如果你的xContent是JSON/xml时，必须指定一个整理这些数据js,并指定 PAZU.TPrinter.beforePrintFuncName。这时你可以调用真正的pazu（小写）插件，来实现更深的打印控制（如直接使用Windows的Printer进行打印编程等）

 aryCssRef[Optional]: 系统会自动取得当前内容的样式（当xContent为html文本||xml文本||JSON文本||url的时候，不自动获取当前页面样式），但某些情况下可能和显示的有出入（真正的打印排版是遵循PrintServer的IE的CSS），当出现这种问题时，你需要写CSS Hack。或者当你想在打印时的样式和当前页面样式不一样时。也可以这样做。

 bPreview [Optional]: 打印前是否先预览，如果PrintServer非localhost（127.0.0.1），这个参数是无效的，why? PrintServer 是可能是无人值守的（或者是其他人使用的计算机），你总不可能通过你的手机打印的时候，在PrintServer上弹出一个预览界面吧。
 bPromptUser [Optional]: 打印前是否提示用户选择打印机，如果PrintServer非localhost（127.0.0.1），这个参数是无效的，why? 参考bPreview参数说明
 callBack [Optional]: 本参数一般不需要
 =========================================================================================*/
PAZU.print = function (xContent, aryJsRef, aryCssRef,bPreview,bPromptUser,callBack) {}

//PAZU.TPrinter
//和IE插件版本兼容的对象，用于页面设置
//某些属性或方法会有变动，具体见以下的详细说明
PAZU.TPrinter = {
    marginTop: 10,                  //属性 上边距   数据类型：数字   单位：毫米
    marginBottom: 10,               //属性 下边距   数据类型：数字   单位：毫米
    marginLeft: 10,                 //属性 左边距   数据类型：数字   单位：毫米
    marginRight: 10,                //属性 右边距   数据类型：数字   单位：毫米
    /*
     例子：把上边距设置为10mm
     PAZU.TPrinter. marginTop=10
     */

    footer: "",                      //属性  页脚   数据类型：字符串
    header: "",                       //属性  页眉   数据类型：字符串
    /*
     例子：设置页眉
     PAZU.TPrinter.header=”这是新的页眉”
     要取消页眉和页脚，只要赋给它们一个空字符串就行了，例如不要页眉：
     PAZU.TPrinter.header=””
     同时页眉和页脚也支持左中右的对齐方式和自动用日期、URL、页码等的填充。这方面的信息可以参考IE这方面的相关文档
     */

    fontCSS: "",                        //字符串,设置页面页脚的字体的CSS（2017年增加）注意字体大小要用pt做单位
    //如果不设置 ，PAZU默认使用 8pt 字体大小，即fontCSS的默认值为"font-size:8pt;color:rgb(0,0,0)"

    orientation: 1,                     //属性纸张方向  数据类型：整数1或者2 ， 1=纵向  2=横向

    /*
     例子：设置纸张方向为横向
     pazu.TPrinter. orientation=2
     */


    paperName: "A4",                   //属性   纸张大小名称  数据类型：字符串
    printerName: "",                   //属性   打印机名称    数据类型：字符串

    /*这两个属性我们都不要求完全匹配，可以采用左匹配的方式，举例：
     假设您有两台打印机，一台是 Epson 1600K III ，一台是 HP Deskjet 300。如果你要制定打印机为 HP Deskjet 300 你有两种方式：
     方式一：全匹配 PAZU.TPrinter.printerName="HP Deskjet 300"
     方式二：左匹配 PAZU.TPrinter.printerName="HP"
     纸张的大小也是一样的道理，例如，指定用B5纸:
     PAZU.TPrinter.paperName="B5"
     提示：所有纸张格式和所有打印机的列表都可以通过PAZU的相应方法取得，你还可以自定义纸张的大小。请看本文相应的章节。
     */


    isPrintBackground: false,        //属性 是否打印背景 数据类型：Boolean  true / false
    isZoomOutToFit: false,            //属性   是否缩放以适应大小打印 数据类型：Boolean true / false

    printTemplate: "",                //属性   打印模板的URL -- （本属性 非高手莫用 ^_^）
    /*
     特别说明：打印模板是指利用微软的printTemplate技术时，你自己定义的符合微软的printTemplate技术规范的打印模板的URL。
     您不需要设置这个属性，控件会自动使用默认的打印模板（微软自带的），当你需要对打印进行更深层次的控制的时候，您才需要设置这个URL以指向你自己设计的printTemplate。
     当您设置了这个属性的时候，如果该URL的页面存在，控件就会载入这个页面作为打印模板，那么你就必须自己在你自己的打印模板页面里面对所有的打印相关内容进行控制（如分页、边距、打印机选择等）。
     如果该URL无效，控件会自动调用微软自带的默认的打印模板
     微软的printTemplate相关技术 请参考 微软的MSDN。里面有详细的说明。本文档的最后一节也有关于这个技术的应用的一些例程和说明。在“特殊应用”章节里面也有部分说明
     **printTemplate属性是打印模板的URL，详细的内容请参考微软的printTemplate技术的说明。
     */
    copies: 1,                           //属性   打印份数 数据类型：整数，默认为1
    range: "",                           //属性   页面范围 数据类型：字符串
    isCopyByCopy: false,                  //属性    是否整份打印结束后再打印下一份   数据类型：Boolean  true / false
    /*说明：
     copies属性允许你当前内容打印多份拷贝
     range 你可以指定打印的页面，例如：
     只打印1到5页：PAZU.TPrinter.range="1-5"
     只打印1,3,5,7页：PAZU.TPrinter.range="1,3,5,7"
     提示：利用range属性可以实现双面打印功能
     */

    onlyPrintElementID: "",           // 属性（2012-1-2新增加） 用于指定打印或者预览页面内的某个ID的元素，可以是任意元素（IFRAME也可以），除此外的页面上的其他内容将不会被打印。
    /*
     如果是IFRAME，请注意：
     A。请务必注意必须是用一个域内的网页，因为IE不允许跨域访问。
     B。IFrame内的网页和父页面最好是同一个相对目录，如果不是同一个目录，则Iframe内的图片引用请使用绝对路径（或相对于跟目录）的引用，否则可能无法正确打印该图片
     C。本属性只在http:// 和 https:// 协议中有效，如果您是双击打开本地的网页文件（File:///协议）本属性是无效的
     D。使用完成后请最好重置本属性值为空字符，以释放资源。
     }
     */

    getPrinters: function (callBack) { },            //方法    返回一个打印机列表，返回以一个回车换行符分隔的字符串,异步返回到callBack函数
    /*
     //例如：获得所有的打印机
     PAZU.TPrinter.getPrinters(function(ps){
     alert(ps);
     //获得是一个以回车换行分隔的字符串
     var pa=ps.split("\r\n");
     for(var i=0;i<pa.length;i++){
     alert(pa[i]);
     }
     });
     */


    getPaperForms: function (thePrinterName, callBack) { },              //方法    返回所有纸张格式的列表，返回以一个回车换行符分隔的字符串
    /*
     和getPrinters类似，不同的是getPaperForms是带参数的，你可以指定获得那个打印机的纸张类别，没有参数或者参数为空字符表示获得当前默认打印机的纸张列表

     例如：PAZU.TPrinter.getPaperForms("HP deskjet 300",function(pp){
     alert(pp);
     });
     */


    //getDefaultPrinter : function(){},            // 方法 获得默认打印机的对象，返回一个Printer Object  ( 详解>>)
    //通过返回的对象，你可以控制该打印机，调用该打印机的EndDoc等方法，来实现直接输出内容到打印机
    /*云版本不支持getDefaultPrinter方法,但是可以通过PAZU.print方法 的 aryJsRef参数中注入自己的自己的JS来调用IE版本原生的getDefaultPrinter来实现，具体看PAZU.print方法*/

    setDefaultPrinter: function (strPrinterName,callBack) { },     //方法  设置某台指定的打印机为默认打印机，注意：(PAZU 2012.6.25以后版本支持，同时需要IE在非保护模式下运行（信任域）)

    printToDefaultPrinter: function (txt,callBack) { },      //方法    把要打印的字符串输送到默认打印机（配合getDefaultPrinter 使用），参数：字符串,因为云PAZU是异步的，不建议使用本方法，因为DefaultPrinter有可能已经再设置后被其他进程改变



    createPaper: function (paperWidth, paperHeight,callBack,strPrinterName) { }, //                    方法    按指定的宽度和高度创建自定义纸张
    /*
     前两个参数，paperWidth 和 paperHeight ，参数类型都是数字，单位是厘米。如果你指定的大小的纸张存在，则返回该纸张的名称，如果不存在，就先创建新的纸张格式并返回新的格式名称
     strPrinterName是可以选的 ，strPrinterName(在指定的打印机上创建纸张格式，如果不指定则为系统默认的打印机)
     例如：PAZU.TPrinter.createPaper(20,14,function(paper){
     alert('成功创建纸张格式：'+paper);
     }); //创建20cm*14cm的纸张格式,PAZU用的是厘米
     */

    doPrint: function (bPromptUser,callBack) { },                         //执行打印(打印当前页面或者onlyPrintElementID)，相当于调用PAZU.print(document||onlyPrintElementID);一般不需要callBack参数

    /*有一个boolean的参数，该参数表示是否要弹出打印机选择对话框，如果PrintServer非localhost（127.0.0.1），这个参数是无效的

     例如：不提示用户直接打印：

     PAZU.TPrinter.doPrint(false)
     */

    // doPrint_: function () { },                       //   方法    执行打印但是不进行页面参数设置
    /*和doPrint类似，但是没有参数，而且执行打印前不去进行页面参数的设置，也不提示用户
     云版本不支持本方法，但是可以通过PAZU.print方法 的 aryJsRef参数中注入自己的自己的JS来调用IE版本原生的getDefaultPrinter来实现，具体看PAZU.print方法
     */

    doPreview: function () { },                     //  方法    打印预览，没有参数, 如果PrintServer非localhost（127.0.0.1），这个方法是无效的
    //doPageSetup: function () { }                  // 方法    执行页面参数的设置，一般不需要callBack参数
    /*云版本不支持doPageSetup方法(云版本执行print或者预览的时候会先执行页面设置，因此不需要独立的doPageSetup),但是可以通过PAZU.print方法 的 aryJsRef参数中注入自己的自己的JS来调用IE版本原生的getDefaultPrinter来实现，具体看PAZU.print方法*/
    //showPageSetup :  function(bPromptUser){},     //         方法    弹出页面设置窗口没有参数
    /*云版本不支持showPageSetup方法,但是可以通过PAZU.print方法 的 aryJsRef参数中注入自己的自己的JS来调用IE版本原生的getDefaultPrinter来实现，具体看PAZU.print方法*/

}

//=========================================================================================
//PAZU的定义到此结束
//=========================================================================================


//以下为PAZU对象的具体实现（和 PrintServer的交互）
PAZU.getHttp = function () {
    var C = null;

    if (window.XMLHttpRequest) {
        C = new XMLHttpRequest();
    }
    if (!C && window.ActiveXObject) {
        try {
            C = new ActiveXObject("Microsoft.XMLHTTP")
        }
        catch (e) {
            try {
                C = new ActiveXObject("Msxml2.XMLHTTP.4.0")
            }
            catch (e) {
                try {
                    C = new ActiveXObject("Msxml2.XMLHTTP")
                }
                catch (e) {
                    try {
                        C = new ActiveXObject("Msxml2.XMLHTTP.5.0")
                    } catch (e) {
                        try {
                            C = new ActiveXObject("Msxml2.XMLHTTP.6.0")
                        } catch (e) { alert("Error:XMLHTTP NOT FOUND"); }
                    }
                }
            }
        }
    }

    return C;
}

PAZU.ajax = function (url, cb, m,dat) {
    if (!m) m = "GET";
    var request = PAZU.getHttp();
    request.onreadystatechange = function () {
        var DONE = this.DONE || 4;
        if (this.readyState === DONE) {
            var f = (typeof cb == 'function');
            if (this.status === 200) {
                var s;
                try { s =JSON.parse(this.responseText); } catch (ex) { }
                if (s && typeof s == "object")s = s.data;
                if (!s) s = '';
                if(f)cb(s);
            } else {
                if(f)cb("");
            }
        }
    };
    //alert(url);
    request.open(m, url, true);
    //request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (m.toLowerCase() == 'post')request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
    request.send(dat);
}

PAZU.getUrl = function (a) {
    return (PAZU_Config.prot + "://" + PAZU_Config.server + ":" + PAZU_Config.port + "/PAZUCloudSrv.js?pa=" + a + "&server=" + encodeURIComponent(PAZU_Config.server) + "&license=" + encodeURIComponent(PAZU_Config.license) + "&_t=" + Math.random());
}

PAZU.TPrinter.getPrinters = function (cb){
    PAZU.ajax(PAZU.getUrl("getPrinters"), cb);
}

PAZU.TPrinter.getPaperForms = function (pn, cb) {
    if (!pn) pn = PAZU.TPrinter.printerName;
    if (!pn) pn = "";
    PAZU.ajax(PAZU.getUrl("getPaperForms&pp=" + encodeURIComponent(pn)), cb);
}

PAZU.TPrinter.setDefaultPrinter = function (pn, cb) {
    if (!pn) pn = "";
    PAZU.ajax(PAZU.getUrl("setDefaultPrinter&pp=" + encodeURIComponent(pn)), cb);
}

PAZU.TPrinter.printToDefaultPrinter= function (txt, cb) {
    if (!txt) txt = "";
    PAZU.ajax(PAZU.getUrl("printToDefaultPrinter"), cb, "POST", "pp=" + encodeURIComponent(txt));
}

PAZU.TPrinter.createPaper = function (paperWidth, paperHeight, cb,strPrinterName, strPaperName) {
    if (parseFloat(paperWidth) < 1 || parseFloat(paperHeight) < 1) {
        if (typeof (cb) == "function") cb("");
        return;
    }
    if (!strPrinterName) strPrinterName = PAZU.TPrinter.printerName;
    PAZU.ajax(PAZU.getUrl("createPaper&pfn=" + encodeURIComponent(strPaperName?strPaperName:"") + "&ptn=" + encodeURIComponent(strPrinterName?strPrinterName:"") + "&pp=" + encodeURIComponent(paperWidth + ":" + paperHeight)), cb);
}

PAZU.isLocalHost = function (){
    var s = PAZU_Config.server.toLowerCase();
    return (s == 'localhost' || s == '127.0.0.1');
}

PAZU.TPrinter.doPrint = function (b,cb) {
    PAZU.print(null, null, null, false, b, cb);
}

PAZU.TPrinter.doPreview = function () {
    PAZU.print(null, null, null,true, false);
}

PAZU.getOuterHTML = function (e, innerHTML, bSelf) {
    if (e.tagName) {
        var sty = e.style.cssText;
        if (!sty) sty = "";
        if (bSelf && e.tagName!='BODY') sty = sty + ";position:absolute;left:0;top:0;"
        if (sty) {
            sty = sty.split('\\').join('\\\\');
            sty = sty.split('"').join('\\"');
            sty = " style=\"" + sty + "\"";
        }
        var c;
        if (e.getAttribute) c = e.getAttribute("class");
        //alert(c);
        if (c) c = " class=\"" + c + "\"";
        return "<" + e.tagName + (sty ? sty : "") + (c?c:"") + (e.id?" id=\""+e.id+"\"":"") + ">" + (innerHTML ? innerHTML : e.innerHTML) + "</" + e.tagName + ">";
    } else {
        return (innerHTML ? innerHTML : e.innerHTML)
    }
}

PAZU.print = function (X, aryJsRef, aryCssRef, bPreview, bPromptUser, callBack) {
    if (!PAZU.isLocalHost()) {
        bPreview = false;
        bPromptUser = false;
    }
    var urlbase = window.location.href.split('?')[0].split("/");
    urlbase[urlbase.length - 1] = '';
    urlbase=urlbase.join("/")

    var S = {};
    var R = {};
    S.url = window.location.href;
    S.bPreview = bPreview;
    S.bPromptUser = bPromptUser;
    var bE = false;
    var bNC = false;//是否“不”获取本页面的cssText，默认获取
    if (X && X[0] && typeof X[0] == 'object') { X = X[0]; bE = true;}
    if (typeof X == 'string' && X.length>0) {
        var a = (/(\S)/.exec(X));
        var c1 = X.substr(0, 1);
        if (a && a[0]) c1 = a[0];
        if (c1 == '[' || c1 == '{') {
            S.json = JSON.parse(X);
            bNC = true;//直接输入的就是JSON因此不获取本页面的cssText
        } else if (c1 == '<') {
            if (X.substr(X.indexOf("<")+1, 1) == '?') {
                S.xml = X;
            } else {
                S.html = X;
            }
            bNC = true;//直接输入的就是html或xml,因此不获取本页面的cssText
        } else if (X.substr(0, 7).toLowerCase() == 'http://' || X.substr(0, 8).toLowerCase() == 'https://') {
            S.url = X;
            bNC = true;//外部的链接,因此不获取本页面的cssText
        } else {
            if (!document.getElementById(X)) {
                S.html = X;
            } else {
                X = document.getElementById(X);
            }
        }
    }
    if (!X||X=="") {
        if (PAZU.TPrinter.onlyPrintElementID) {
            X = document.getElementById(X);
        } else {
            X = document.body || document.getElementsByTagName("BODY")[0];
        }
    }
    if (X && typeof X == 'object') {
        bE = true;
    }
    var s='';
    if(bE && X.innerHTML){
        s = PAZU.getOuterHTML(X,null,true);
        if (X.tagName != "BODY")X = X.parentNode;
        while (X&&X.tagName!="BODY") {
            s = PAZU.getOuterHTML(X, s);
            X = X.parentNode;
        }
        S.html = s;
    }
    var PS = {};
    var TP=PAZU.TPrinter;
    for (var x in TP) {
        if (typeof TP[x] != 'function') {
            PS[x] = TP[x];
        }
    }
    S.PS = PS;
    S.CFG = PAZU_Config;
    //get all css text
    var cs = [];
    var h = document.styleSheets;

 /*   //定义了外部css引用的，不要再获取本页面的cssText
    if (aryCssRef && aryCssRef.length > 0) bNC = true;
    if (!bNC) {
        for (i = 0; i < h.length; i++) {
            var r = h[i].rules
            if (!r) r = h[i].cssRules;
            if (r) {
                for (j = 0; j < r.length; j++) {
                    cs.push(r[j].selectorText + '{' + r[j].style.cssText + '}');
                }
            } else {
                var hr = h[i].href;
                //判断是否同源（同域），如果是则直接取回css文本,否则加入到aryCssRef里面,chrome浏览器是特别的，只能这样做
                var p = hr.indexOf(":/");
                var bS = false;
                if (p > 0 && p < 10) {
                    try {
                        if (hr.split("://")[0].toLowerCase() == urlbase.split("://")[0].toLowerCase()
                            && urlbase.split("://")[0].toLowerCase() != 'file'
                            && hr.split("://")[1].toLowerCase().split("/")[0] == urlbase.split("://")[1].toLowerCase().split("/")[0]
                        ) {
                            bS = true;
                        }
                    } catch (ex) { }
                } else {
                    bS = true;
                }
                //同源的css
                if (bS) {
                    try {
                        var xhttp = PAZU.getHttp();
                        xhttp.open("GET", hr, false);
                        xhttp.send(null);
                        if (xhttp.status === 200) {
                            cs.push("/" + "* " + hr + " *" + "/");
                            cs.push(xhttp.responseText);
                        }
                    } catch (ex) {
                        if (!aryCssRef) aryCssRef = [];
                        aryCssRef.unshift(hr);
                    }
                } else {
                    if (!aryCssRef) aryCssRef = [];
                    aryCssRef.unshift(hr);
                }
            }
        }
    }
*/

    if (aryCssRef && aryCssRef.length > 0) {
        for (var i = 0; i < aryCssRef.length; i++) {
            var p=aryCssRef[i].indexOf(":/");
            if (p > 0 && p < 10) {

            } else {
                //同源的css(相对目录的)
                try{
                    var xhttp = PAZU.getHttp();
                    xhttp.open("GET", aryCssRef[i], false);
                    xhttp.send(null);
                    if (xhttp.status === 200) {
                        cs.push("/" + "* " + aryCssRef[i] + " *" + "/");
                        cs.push(xhttp.responseText);
                        aryCssRef[i] = "";
                    }
                }catch(ex){
                }
            }
        }
    }
    R.css = cs.join('\r\n');
    R.cssRef = aryCssRef;


    var js = [];
    if (aryJsRef && aryJsRef.length > 0) {
        for (var i = 0; i < aryJsRef.length; i++) {
            var p = aryJsRef[i].indexOf(":/");
            if (p > 0 && p < 10) {

            } else {
                //同源的css
                try{
                    var xhttp = PAZU.getHttp();
                    xhttp.open("GET", aryJsRef[i], false);
                    xhttp.send(null);
                    if (xhttp.status === 200) {
                        js.push("/" + "* " + aryJsRef[i] + " *" + "/");
                        js.push(xhttp.responseText);
                        aryJsRef[i] = "";
                    }
                } catch (ex) {
                }
            }
        }
    }
    R.js = js.join('\r\n');
    R.jsRef = aryJsRef;
    PAZU.ajax(PAZU.getUrl("print"), callBack, "POST", "u=" + encodeURIComponent(urlbase) + "&r=" + encodeURIComponent(JSON.stringify(R)) + "&d=" + encodeURIComponent('var PAZUCloudData=' + JSON.stringify(S)));
}

/*JSON2*/
if (typeof JSON !== 'object') { JSON = {}; } (function () { 'use strict'; function f(n) { return n < 10 ? '0' + n : n; }; function this_value() { return this.valueOf(); }; if (typeof Date.prototype.toJSON !== 'function') { Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null; }; Boolean.prototype.toJSON = this_value; Number.prototype.toJSON = this_value; String.prototype.toJSON = this_value; } var cx, escapable, gap, indent, meta, rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }) + '"' : '"' + string + '"'; }; function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === 'object' && typeof value.toJSON === 'function') { value = value.toJSON(key); } if (typeof rep === 'function') { value = rep.call(holder, key, value); } switch (typeof value) { case 'string': return quote(value); case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) { return 'null'; } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === '[object Array]') { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null'; } v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']'; gap = mind; return v; } if (rep && typeof rep === 'object') { length = rep.length; for (i = 0; i < length; i += 1) { if (typeof rep[i] === 'string') { k = rep[i]; v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } else { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}'; gap = mind; return v; } }; if (typeof JSON.stringify !== 'function') { escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }; JSON.stringify = function (value, replacer, space) { var i; gap = ''; indent = ''; if (typeof space === 'number') { for (i = 0; i < space; i += 1) { indent += ' '; } } else if (typeof space === 'string') { indent = space; } rep = replacer; if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) { throw new Error('JSON.stringify'); } return str('', { '': value }); }; } if (typeof JSON.parse !== 'function') { cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; JSON.parse = function (text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === 'object') { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v; } else { delete value[k]; } } } } return reviver.call(holder, key, value); }; text = String(text); cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function (a) { return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }); } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) { j = eval('(' + text + ')'); return typeof reviver === 'function' ? walk({ '': j }, '') : j; } throw new SyntaxError('JSON.parse'); }; } }());

/*增加载入的通知事件*/
if (window.onPAZUReady && typeof (window.onPAZUReady) == 'function') {
    window.onPAZUReady(window.PAZU_Config);
}

