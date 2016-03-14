var UrlModule={
    'config': {
        'get_array_type': true  //если параметр GET может преобразовываться в массив
    },
    /*РАЗБИРАЕМ URL НА ЧАСТИ
     * {protocol host hostname port pathname search hash}*/
    'parseUrl': function(href){
        if (href==undefined || !href) href=window.location.href;
        var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
        res=match && {
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            search: match[6],
            hash: match[7].substr(1)
        }
        if (res.hash!=undefined && res.hash.indexOf('?')!=-1){
            var tmp=res.hash.split('?');
            res.hash=tmp[0];
            res.get=tmp[1];
        }
        return(res);
    },
    /*РАЗБИРАЕМ GET ЗАПРОС*/
    'parseGet': function(get){
        if (get=='' || get=='?') return({});
        if (get==undefined || !get) get=this.parseUrl().search;
        get=get.substr(1);
        var tmp=get.split('&');
        var parse={};
        for(var i=0; i < tmp.length; i++) {
            parse[tmp[i].split('=')[0]]= tmp[i].split('=')[1];
        }
        return(parse);
    },
    /*УДАЛЯЕМ ПАРАМЕТРЫ ИЗ GET
     * params = string - удаляем единичный параметр,object - множество параметров, undefined - все параметры*/
    'removeGet': function(params,href){
        var parseUrl=this.parseUrl(href);
        var parseGet=this.parseGet(parseUrl.search);
        if (params==undefined || !params) parseUrl.search='';
        else if (typeof params=='string') {
            if (parseGet[params]!=undefined) delete(parseGet[params]);
            else parseGet=this.removeGetArray(parseGet,params);
        }
        else if (typeof params=='object'){
            var keyDel;
            for (var key in params){
                keyDel=params[key];
                if (parseGet[keyDel]!=undefined)  delete(parseGet[keyDel]);
                else parseGet=this.removeGetArray(parseGet,keyDel);
            }
        }
        parseUrl.search=parseGet;
        return this.collectUrl(parseUrl);
    },
    /*УДАЛЯЕМ МАССИВ ИЗ GET*/
    'removeGetArray': function(parseGet,params){
        if (!this.config.get_array_type) return parseGet;
        for (var key in parseGet) if (key.indexOf(params+'%5B')==0) delete parseGet[key];
        return parseGet;
    },
    /*ДОБАВЛЯЕМ ПАРАМЕТР В GET
     * href=false - текущий url
     * param = string|object
     * */
    'addGet': function(href,param,value){
        var parseUrl=this.parseUrl(href);
        var parseGet=this.parseGet(parseUrl.search);
        if (param==undefined && href==undefined) return window.location.href;
        if (param==undefined) return href;
        if (value==undefined) value='';
        if (typeof param=='string') parseGet[param]=value;
        else if (typeof param=='object'){
            for (var key in param) parseGet[key]=param[key];
        }
        parseUrl.search=parseGet;
        return this.collectUrl(parseUrl);
    },
    /*СОБИРАЕМ URL ОБРАТНО*/
    'collectUrl': function(parse){
        if (parse==undefined || parse.host==undefined) return window.location.href;
        if (parse.protocol==undefined || !parse.protocol || parse.protocol=='') parse.protocol='http:';
        if (parse.pathname==undefined || !parse.pathname) parse.pathname='/';
        if (parse['search']==undefined || !parse['search']) parse.search='';
        if (parse.hash==undefined || !parse.hash) parse.hash='';
        var get=this.collectGet(parse.search);
        var res=parse.protocol+'//'+parse.host+parse.pathname+get+parse.hash;
        return(res);
    },
    /*СОБИРАЕМ GET ОБРАТНО*/
    'collectGet': function(get){
        if (get==undefined || get=='' || !get) return '';
        if (typeof get=='string') return get;
        else if (typeof get=='object'){
            var res='?';
            for (var key in get) res+=key+'='+get[key]+'&';
            res=res.substr(0,(res.length-1));
            return(res);
        }
        else return('');
    }
};