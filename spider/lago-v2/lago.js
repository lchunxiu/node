let Job = require("../model/job");
let date = new Date();
let logger = require("../common/logger").createLogger("./log/"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+".log");

let header = require("./header").createHeader("深圳");
let request = require("./request");

let async = require("async");

async.waterfall([
    function(callback) {
        request.reqPages(header.getDefaultOPtions(),callback);
    },
    function(pages, callback) {
        logger.info("取到页数："+pages+" 页");
        let allurls = [];
        let q = async.queue(request.reqUrls, 2);
        q.drain = function() {
            callback(null,allurls);
        };
        for(let i =1;i<=pages;i++){
            let options = header.getPageOPtions(i);
            q.push(options,function(err, {urls,data}){
                if(err){
                    callback(err);
                }else{
                    logger.info("第"+i+"页取得数据", urls,"\r\n",data);
                    allurls = allurls.concat(urls);
                }
            })
        }
    },
    function(urls, callback) {
        //logger.info("获取到所有urls",urls);
        let q = async.queue(request.reqDetail, 2);
        q.drain = function() {
            callback(null);
        };
        for(let i=0;i<urls.length;i++){
            let options = header.getDetailOPtions(urls[i]);
            q.push(options, function(err,detail){
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
            })
        }
    }
], function (err, result) {
    if(err){
        logger.err("发生错误",err)
    }
    console.log("done");
});

