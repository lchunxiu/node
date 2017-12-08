var https = require("https");
var cheerio = require("cheerio");
var Job = require("../model/job");

var defaultoptions = {
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

start("深圳");

function saveJob(jobo){
    var job = new Job(jobo);
    job.save(function(err,ele){
        if(err){
            console.log(err);
        }
    
        console.log("成功插入："+ ele.url);
    });
}

function start(location){
    var $,
        data,
        pages = [],
        max,
        options = JSON.parse(JSON.stringify(defaultoptions));

    options.headers.Cookie = "index_location_city="+encodeURIComponent(location)+";";
    console.log(options);
    const req = https.get(options,(res)=>{
        res.on("data",(d)=>{
            data+=d;
        });

        res.on("end",()=>{
            $ = cheerio.load(data);
            $(".page_no").each(function(index, ele){
                pages.push($(ele).data("index"));
            });
            max = Math.max.apply(null,pages);
            for(let i = 0;i<max;i++){
                getUrlList(i,location);
            }
        });

    });
    req.on("error",(e)=>{
        console.error("request is error!"+e);    
    });
    req.end();
}

function getUrlList(page, location){
    var $,
        data,
        options = JSON.parse(JSON.stringify(defaultoptions));

    options.path =options.path+page+"/";
    options.headers.Cookie = "index_location_city="+encodeURIComponent(location)+";";
    const req = https.get(options,(res)=>{
        res.on("data",(d)=>{
            data+=d;
        });
    
        res.on("end",()=>{
            $ = cheerio.load(data);
            $(".position_link").each(function(index, ele){
                getJob($(ele).attr("href"));
            });
        });
    
    });
    req.on("error",(e)=>{
        console.error("request is error!"+e);    
    });
    req.end();
}


function getJob(url){
    var $,
    data,
    options = JSON.parse(JSON.stringify(defaultoptions));

    options.path = url;
    options.headers.Cookie = "user_trace_token=20171012170730-c6a1dc34-af2c-11e7-8f6e-525400f775ce; LGUID=20171012170730-c6a1e2d5-af2c-11e7-8f6e-525400f775ce; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=72; TG-TRACK-CODE=jobs_code; JSESSIONID=ABAAABAACBHABBI9DC9AEC5376914445E9F99EADBFB767D; SEARCH_ID=1aba40b4eee547499d4d67fdf0bff331; _gid=GA1.2.756515603.1509974815; _ga=GA1.2.211059121.1507799248; LGRID=20171107200405-c0d24b33-c3b3-11e7-983f-5254005c3644; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1509696947,1509974815,1510044299,1510053594; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1510056246"; 
    const req = https.get(options,(res)=>{
        res.on("data",(d)=>{
            data+=d;
        });

        res.on("end",()=>{
            try{
            $ = cheerio.load(data);
            var jobo = {
                url:url,
                company:$(".job-name .company").text(),
                position:$(".job-name .name").text(),
                tag:$(".position-label .labels").map(function(index,item){
                    return $(item).text();
                }).get(),
                salary:$(".job_request .salary").text(),
                experience:$(".job_request span").length>1?$($(".job_request span")[1]).text().replace(/\//g,""):"",
                education:$(".job_request span").length>2?$($(".job_request span")[2]).text().replace(/\//g,""):"",
                worktime:$(".job_request span").length>3?$($(".job_request span")[3]).text().replace(/\//g,""):"",
                location:{
                    city:$(".work_addr a").length>0?$($(".work_addr a")[0]).text():"",
                    region:$(".work_addr a").length>1?$($(".work_addr a")[1]).text():"",
                    extra:$(".work_addr a").length>3?$($(".work_addr a")[2]).text():"",
                },
                des:$("#job_detail").html(),
                publishtime:Date.now(),
                publisher:"拉勾网" 
            };
            saveJob(jobo);
        }
        catch(e){
            console.log(e);
        }
        });

    });
    req.on("error",(e)=>{
        console.error("request is error!"+e);    
    });
    req.end();
}

process.on("uncaughtException",function(err){
    console.log(err,"uncaughtException");
})