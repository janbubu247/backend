const express = require("express");
const router = express.Router();
const { connection } = require("../../middleware/db");
const crypto = require("../../middleware/crypto");
const log = require("../../middleware/log");

// ===Type Dashboard End Point's===

router.post("/status", async (req, res) => {
  var values = [];
  try {
    var sqlLastWeek =
      "SELECT count(status) as count,status FROM dtemplate where  DATE(created_at) >= (DATE(NOW()) - INTERVAL 7 DAY) group by status";

    var sqlLastMonth =
      "SELECT count(status) as count,status FROM dtemplate where  DATE(created_at) >= (DATE(NOW()) - INTERVAL 30 DAY) group by status";

    var sqlLastDay =
      "SELECT count(status) as count,status FROM dtemplate where DATE(created_at) = CURDATE() group by status";

    var sqlAll =
      "SELECT count(status) as count,status FROM dtemplate group by status";
    var responsePayload = {};
    connection.query(sqlLastWeek, values, function (errA, resultsA) {
      responsePayload.lastweek = resultsA;
      connection.query(sqlLastMonth, values, function (errE, resultsE) {
        responsePayload.lastmonth = resultsE;
        connection.query(sqlAll, values, function (errZ, resultsZ) {
          responsePayload.all = resultsZ;
          connection.query(sqlLastDay, values, function (errZ2, resultsZ2) {
            responsePayload.lastday = resultsZ2;
            crypto(responsePayload, res);
          });
        });
      });
    });
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.post("/user", async (req, res) => {
  var values = [];
  try {
    var sqlLastWeek =
      "SELECT count(is_designer) as count,is_designer FROM designer where  DATE(created_at) >= (DATE(NOW()) - INTERVAL 7 DAY) group by is_designer";

    var sqlLastMonth =
      "SELECT count(is_designer) as count,is_designer FROM designer where  DATE(created_at) >= (DATE(NOW()) - INTERVAL 30 DAY) group by is_designer";

    var sqlLastDay =
      "SELECT count(is_designer) as count,is_designer FROM designer where DATE(created_at) = CURDATE() group by is_designer";

    var sqlAll =
      "SELECT count(is_designer) as count,is_designer FROM designer group by is_designer";
    var responsePayload = {};
    connection.query(sqlLastWeek, values, function (errA, resultsA) {
      responsePayload.lastweek = resultsA;
      connection.query(sqlLastMonth, values, function (errE, resultsE) {
        responsePayload.lastmonth = resultsE;
        connection.query(sqlAll, values, function (errZ, resultsZ) {
          responsePayload.all = resultsZ;
          connection.query(sqlLastDay, values, function (errZ2, resultsZ2) {
            responsePayload.lastday = resultsZ2;
            crypto(responsePayload, res);
          });
        });
      });
    });
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.post("/tracking", async (req, res) => {
  var values = [];
  try {
    var sqlDownload =
      "SELECT t.download,z.name,z.preview FROM grado.dtemplate_tracking as t left join grado.dtemplate as z on t.tid=z.id group by t.tid order by t.download desc limit 0,10";

    var sqlView =
      "SELECT t.view,z.name,z.preview FROM grado.dtemplate_tracking as t left join grado.dtemplate as z on t.tid=z.id group by t.tid order by t.view desc limit 0,10";

    var sqlEdit =
      "SELECT t.edit,z.name,z.preview FROM grado.dtemplate_tracking as t left join grado.dtemplate as z on t.tid=z.id group by t.tid order by t.edit desc limit 0,10";

    var sqlAll =
      "SELECT sum(view) as total_view, sum(edit) as total_edit, sum(download) as total_download FROM grado.dtemplate_tracking";

    var responsePayload = {};
    connection.query(sqlDownload, values, function (errA, resultsA) {
      responsePayload.download = resultsA;
      connection.query(sqlView, values, function (errE, resultsE) {
        responsePayload.view = resultsE;
        connection.query(sqlEdit, values, function (errZ, resultsZ) {
          responsePayload.edit = resultsZ;
          connection.query(sqlAll, values, function (errZ2, resultsZ2) {
            responsePayload.all = resultsZ2;
            crypto(responsePayload, res);
          });
        });
      });
    });
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.post("/order", async (req, res) => {
  var values = [];
  try {
    var sqlLastWeek =
      "SELECT count(id) as count,sum(amount) as niit FROM dtemplate_order where DATE(created_at) >= (DATE(NOW()) - INTERVAL 7 DAY)";

    var sqlLastMonth =
      "SELECT count(id) as count,sum(amount) as niit FROM dtemplate_order where DATE(created_at) >= (DATE(NOW()) - INTERVAL 30 DAY)";

    var sqlLastDay =
      "SELECT count(id) as count,sum(amount) as niit FROM dtemplate_order where DATE(created_at) = CURDATE()";

    var sqlYesterDay =
      "SELECT count(id) as count,sum(amount) as niit FROM dtemplate_order WHERE created_at BETWEEN CURDATE() - INTERVAL 1 DAY AND CURDATE() - INTERVAL 1 SECOND";

    var sqlAll =
      "SELECT count(id) as count,sum(amount) as niit FROM dtemplate_order";

    var responsePayload = {};
    connection.query(sqlLastWeek, values, function (errA, resultsA) {
      responsePayload.lastweek = resultsA[0];
      connection.query(sqlLastMonth, values, function (errE, resultsE) {
        responsePayload.lastmonth = resultsE[0];
        connection.query(sqlLastDay, values, function (errZ2, resultsZ2) {
          responsePayload.lastday = resultsZ2[0];
          connection.query(sqlYesterDay, values, function (errZ3, resultsZ3) {
            responsePayload.yesterday = resultsZ3[0];
            connection.query(sqlAll, values, function (errZ3, resultsZ4) {
              responsePayload.all = resultsZ4[0];
              crypto(responsePayload, res);
            });
          });
        });
      });
    });
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.post("/orderlast", async (req, res) => {
  const { filter } = req.body;
  var values = [];
  try {
    var sqlLastWeek =
      "SELECT o.amount,o.created_at,t.preview,t.id as tid,d.name,d.id as uid FROM dtemplate_order as o left join dtemplate as t on t.id=o.tid left join designer as d on d.id=o.uid order by o.created_at desc limit 0,25";

    var responsePayload = {};
    connection.query(sqlLastWeek, values, function (errA, resultsA) {
      responsePayload.lastweek = resultsA;
      crypto(responsePayload, res);
    });
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

module.exports = router;
