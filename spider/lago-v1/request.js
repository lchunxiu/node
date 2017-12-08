var https = require("https");
var cheerio = require("cheerio");

// 公共的请求
function req(options,next){
    let data;
    var request = https.get(options,(res)=>{
        res.on("data",(d)=>{
            data+=d;
        });

        res.on("end",()=>{
            next(data);
        });

    });
    request.on("error",(e)=>{
        console.error("request is error!"+e);    
    });
    request.end();
}

let Request = function(){};

// 解析页码
Request.prototype.reqPages = function(options,next){
    req(options,function(data){
        let pages = [],
            max =0;
        try{
            $ = cheerio.load(data);
            $(".page_no").each(function(index, ele){
                pages.push($(ele).data("index"));
            });
            max = Math.max.apply(null,pages);
        }catch(e){
            next(e);
        }
        
        next(null,max);
    });
};


// 解析详情页地址
Request.prototype.reqUrls = function(options,next){
    req(options,function(data){
        let urls = [];
        try{
            $ = cheerio.load(data);
            $(".position_link").each(function(index, ele){
                urls.push($(ele).attr("href"));
            });
        }catch(e){
            next(e);
        }
        
        next(null,urls);
    });
};


// 解析详情页地址
Request.prototype.reqDetail = function(options,next){
    req(options,function(data){
        let jobo = null;
        try{
            $ = cheerio.load(data);
            jobo = {
                url:options.path,
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
        }catch(e){
            next(e);
        }            
        next(null, jobo);
    });
};

module.exports = new Request();