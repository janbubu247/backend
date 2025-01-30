const uniqid = require("uniqid");

async function logWriteError(req, res, err) {
  try {
    var insertData = {
      ErrorID: uniqid("errorid-"),
      ControllerName: req.controller == undefined ? "aa" : req.controller,
      ActionName: req.action == undefined ? "bb" : req.action,
      ErrorType: err.errno == undefined ? "" : err.errno,
      ErrorDesc: err.code == undefined ? "" : err.code,
      CreatedAt: new Date(),
    };
    console.log(err)
  } catch (e) {
    console.log("Write catch error: " + e);
  } 
}

async function logWrite(req) {
  try {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    var insertData = {
      LogID: uniqid("actionid-"),
      ControllerName: req.controller,
      ActionName: req.action,
      CreatedAt: new Date(),
      UserID: req.user.EmployeeID,
      remoteAddress: ip,
    };
    
  } catch (e) {
    console.log("Log write catch error: " + e);
  }
}

module.exports = {
  logWriteError,
  logWrite,
};
