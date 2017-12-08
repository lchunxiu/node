let Job = require("../model/job");
let date = new Date();
let logger = require("../common/logger").createLogger("./log/"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+".log");

let header = require("./header").createHeader("深圳");
let request = require("./request");

request.reqPages(header.getDefaultOPtions(),pagecountBack);
function pagecountBack(err, pages){
    if(err){
        logger.error(err);
        return;
    }else{
        logger.info("取到页数："+pages+" 页");
        for(let i =1;i<=pages;i++){
            
            let options = header.getPageOPtions(i);
            logger.info("开始获取第"+i+"页数据:",options);
            request.reqUrls(options,listBack);
        }
    }
}


function listBack(err, urls){
    if(err){
        logger.error(err);
        return;
    }else{
        logger.info("取到地址列表：",urls);
        for(let i=0;i<urls.length;i++){
            let options = header.getDetailOPtions(i);
            request.reqDetail(options,detailBack);
        }
    }
}

function detailBack(err,detail){
    if(err){
        logger.error(err);
        return;
    }else{
        var job = new Job(detail);
        job.save().then(function(){
            logger.info("存储数据：",detail);
        }).catch(function(err){
            logger.error(err);
        });
    }
}
