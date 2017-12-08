
let date = new Date();
let logger = require("../common/logger").createLogger("./log/"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+".log");

logger.info("title：",{isok:true,msg:"yeah"});