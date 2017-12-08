let db = require("./db");
let jobSchema = require("../schema/job");

module.exports = db.model("job",jobSchema,"jobs")