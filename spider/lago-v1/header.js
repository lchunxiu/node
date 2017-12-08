
let defaultoptions = {
    hostname:"www.lagou.com",
    port:443,
    path:"/zhaopin/webqianduan/",
    method:"GET",
    headers:{
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding':'text/html;charset=GBK',
        'Accept-Language':'zh-CN,zh;q=0.8',
        'Cache-Control':'max-age=0',
        'Connection':'keep-alive',
        'Cookie':'',
        'Host':'www.lagou.com',
        'Referer':'https://www.lagou.com/zhaopin/webqianduan/',
        'Upgrade-Insecure-Requests':1,
        'User-Agent':'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }
};

let Header  = function(location){
    this.location = location;
};
// 获取城市的默认地址
Header.prototype.getDefaultOPtions = function(){
    let options = JSON.parse(JSON.stringify(defaultoptions));
    options.headers.Cookie = "index_location_city="+encodeURIComponent(this.location)+";";
    return options;
};

// 根据页码获取具体页的数据
Header.prototype.getPageOPtions = function(page){
    let options = JSON.parse(JSON.stringify(defaultoptions));
    options.path =options.path+page+"/";
    options.headers.Cookie = "index_location_city="+encodeURIComponent(this.location)+";";
    return options;
};


// 具体详情页http头
Header.prototype.getDetailOPtions = function(url){
    let options = JSON.parse(JSON.stringify(defaultoptions));
    options.path = url;
    options.headers.Cookie = "user_trace_token=20171012170730-c6a1dc34-af2c-11e7-8f6e-525400f775ce; LGUID=20171012170730-c6a1e2d5-af2c-11e7-8f6e-525400f775ce; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=72; TG-TRACK-CODE=jobs_code; JSESSIONID=ABAAABAACBHABBI9DC9AEC5376914445E9F99EADBFB767D; SEARCH_ID=1aba40b4eee547499d4d67fdf0bff331; _gid=GA1.2.756515603.1509974815; _ga=GA1.2.211059121.1507799248; LGRID=20171107200405-c0d24b33-c3b3-11e7-983f-5254005c3644; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1509696947,1509974815,1510044299,1510053594; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1510056246"; 
    return options;
};


module.exports.Header = Header;
module.exports.createHeader = function(location){
    return new Header(location);
};


