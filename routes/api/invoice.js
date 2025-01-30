const express = require("express");
const router = express.Router();
const { connection } = require("../../middleware/db");
const crypto = require("../../middleware/crypto");
const log = require("../../middleware/log");

// ===Type invoice End Point's===
router.post("/add", async (req, res) => {
  var { invoice } = req.body;
  // ---validation---
  if (!invoice) {
    return res.status(400).json({ statusText: __("invoice.reqInfo") });
  }
  try {
    var insertData = {
      org_rd: invoice.org_rd,
      org_name: invoice.org_name,
      uid: invoice.uid,
      email: invoice.email,
      subscription: invoice.subscription,
      month: invoice.month,
      disctount: invoice.disctount,
      price: invoice.price,
      total_price: invoice.total_price,
      status: invoice.status,
      skey: invoice.skey,
      created_at: new Date(),
    };
    connection.query(
      "INSERT INTO invoice SET ?",
      insertData,
      function (error, results, fields) {
        console.log(error);
        if (error) log.logWriteError(req, res, error);
        crypto(results, res, false);
      }
    );
  } catch (e) {
    console.log(e);
    log.logWriteError(req, res, e);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    connection.query(
      "DELETE FROM invoice WHERE id = ?",
      [req.params.id],
      function (error1, results1, fields) {
        if (error1) log.logWriteError(req, res, error1);
        crypto({ status: "ok" }, res, true);
      }
    );
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.post("/list", async (req, res) => {
  const { pid, pSize, filter } = req.body;
  var conditions = "";
  var values = [];
  try {
    if (filter.uid) {
      conditions += " and m.uid = ?";
      values.push(filter.uid);
    }
    if (filter.org_rd) {
      conditions += " and m.org_rd = ?";
      values.push(filter.org_rd);
    }
    if (filter.status) {
      conditions += " and m.status = ?";
      values.push(filter.status);
    }
    if (filter.org_rd) {
      conditions += " and m.org_rd = ?";
      values.push(filter.org_rd);
    }
    if (filter.subscription) {
      conditions += " and m.subscription = ?";
      values.push(filter.subscription);
    }
    if (filter.skey) {
      conditions += " and m.skey = ?";
      values.push(filter.skey);
    }
    var sqlCount =
      "select count(m.id) as numRows from invoice as m where (1=1) " +
      conditions;
    var sqlMain =
      "SELECT m.*,g.id as gereeid  FROM invoice as m left join geree as g on g.invoice_id=m.id " +
      "where (1=1) " +
      conditions +
      " order by m.id desc limit " +
      (pid - 1) * pSize +
      " , " +
      pSize;
    connection.query(sqlCount, values, function (errC, resultsC) {
      if (errC) log.logWriteError(req, res, errC);
      allRows = resultsC[0].numRows;
      niit = resultsC[0].niit;
      numPages = Math.ceil(allRows / pSize);
      var responsePayload = {};
      connection.query(sqlMain, values, function (errM, resultsM) {
        if (errM) log.logWriteError(req, res, errM);
        responsePayload.data = resultsM;
        if (pid - 1 < numPages) {
          responsePayload.pagination = {
            current: pid,
            ptotal: allRows,
            niit: niit,
            psize: pSize,
          };
        } else
          responsePayload.pagination = {
            err:
              "queried page " +
              (pid - 1) +
              " is >= to maximum page number " +
              numPages,
          };
        crypto(responsePayload, res);
      });
    });
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.post("/my_invoice", async (req, res) => {
  const { filter } = req.body;
  var conditions = "";
  var values = [];
  try {
    if (filter.uid) {
      conditions += " and m.uid = ?";
      values.push(filter.uid);
    }
    if (filter.skey) {
      conditions += " and m.skey = ?";
      values.push(filter.skey);
    }
    var sqlMain =
      "SELECT m.*  FROM invoice as m " +
      "where (1=1) " +
      conditions +
      " order by m.id desc";

    var responsePayload = {};
    connection.query(sqlMain, values, function (errM, resultsM) {
      if (errM) log.logWriteError(req, res, errM);
      responsePayload.data = resultsM;
      crypto(responsePayload, res);
    });
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    var sqlMain = "SELECT m.* FROM invoice as m where m.id=?";
    var responsePayload = {};
    connection.query(
      sqlMain,
      [req.params.id],
      function (error, results, fields) {
        if (error) log.logWriteError(req, res, error);
        responsePayload.data = results[0];
        crypto(responsePayload, res);
      }
    );
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.put("/changestatus",  async (req, res) => {
  var { invoice } = req.body;
  // ---validation---
  if (!invoice) {
    return res.status(400).json({ statusText: __("invoice.reqInfo") });
  }
  try {
    var updateData = [invoice.status, invoice.id];

    connection.query(
      "update invoice SET status=? where id = ? ",
      updateData,
      function (error, result, fields) {
        if (error) log.logWriteError(req, res, error);
        if (result.affectedRows > 0) {
          crypto(result, res, true);
        } else {
          return res.status(400).json({ statusText: __("invoice.notFound") });
        }
      }
    );
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

module.exports = router;
