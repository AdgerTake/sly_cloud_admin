/*
PAZU 客户端js。需要html中引入本文件
*/

/* eslint-disable */
if (!window.PAZU_Config) {
    window.PAZU_Config = {
        prot:"http",
        server: 'localhost',
        port: 6894,
        license: '5892D9CA026B5963809D9852ECCA90A1|刘果果'
    }
}


var _tag = document.createElement('script');
_tag.type = 'text/javascript';
_tag.async = true;
_tag.charset = 'utf-8';
_tag.src = (window.PAZU_Config.prot + "://" + window.PAZU_Config.server + ":" + (window.PAZU_Config.port?window.PAZU_Config.port:6894) + "/js/pazucloud.js?server=" + encodeURIComponent(window.PAZU_Config.server) + "&license=" + encodeURIComponent(window.PAZU_Config.license)+"&_t="+Math.random());

try{
    var _rootE=document.getElementsByTagName('script')[0];
    _rootE.parentNode.insertBefore(_tag,_rootE);
} catch (ex) {
    alert("PAZU add reference error:" + ex.message);
}