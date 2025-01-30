const express = require("express");
const router = express.Router();
const { connection } = require("../../middleware/db");
const crypto = require("../../middleware/crypto");
const log = require("../../middleware/log");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const config = require("config");
const CryptoJS = require("crypto-js");
// const socketpush = require("../../middleware/socketpush");
// ===Type Bagts End Point's===
const getRandomInt = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};

const saveImage = (res,desgin) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let day = date_ob.getDate();
  var randName = Date.now();
  var base64Data22 = desgin;
  var base64Data = base64Data22.replace(/^data:image\/png;base64,/, "");
  var ner = randName + "-" + getRandomInt(10000, 100000);
  var imageTemp = "./uploads/geree/" + ner + ".webp";
  var newImageLink =
    "/file/geree/" +
    year +
    "/" +
    month +
    "/" +
    day +
    "/" +
    ner +
    ".webp";
  fs.writeFile(imageTemp, base64Data, "base64", async function (err) {
    if (err) {
      return res
        .status(400)
        .json({ statusText: "zurag huulah aldaa : " + err });
    } else {
      var dir = "./uploads/geree/" + year + "/" + month + "/" + day;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      var newImage = dir + "/" + ner + ".webp";
      await sharp(imageTemp)
        .resize(500, 500, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toFile(newImage);
      unlinkAsync(imageTemp);
    }
  });
  return new Promise((resolve, reject) => {
    resolve(newImageLink);
  });
};

router.post("/add", async (req, res) => {
  var { geree } = req.body;
  // ---validation---
  if (!geree) {
    return res.status(400).json({ statusText: __("geree.reqInfo") });
  }
  try {
    const SignatureLink = await saveImage(res,geree.signature);

    var insertData = {
      org_id: geree.org_id,     
      org_rd: geree.org_rd,
      invoice_id: geree.invoice_id,
      firstname: geree.firstname,
      lastname: geree.lastname,
      albantushaal: geree.albantushaal,
      phone: geree.phone,
      address: geree.address,
      signature: SignatureLink,
      uid: geree.uid,
      created_at: new Date(),
    };
    connection.query(
      "INSERT INTO geree SET ?",
      insertData,
      function (error, results, fields) {
        if (error) log.logWriteError(req, res, error);
        crypto(results, res, false);
      }
    );
  } catch (e) {
    console.log("e:", e);
    log.logWriteError(req, res, e);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    connection.query(
      "SELECT m.* FROM geree as m where m.id=?",
      req.params.id,
      async function (error, results, fields) {
        if (error) {
          log.logWriteError(req, res, error);
        } else {
          var dtemplate = results[0];
          var newName = dtemplate.signature.split(".");
          var nn = newName[0].replace("/file/", "./uploads/");
          if (fs.existsSync(nn + "." + newName[1])) {
            await unlinkAsync(nn + "." + newName[1]);
          }         

          connection.query(
            "DELETE FROM geree WHERE id = ?",
            req.params.id,
            function (error2, results2, fields) {
              if (error2) log.logWriteError(req, res, error2);
              crypto(results2, res, true);
            }
          );
        }
      }
    );
  } catch (e) {
    log.logWriteError(req, res, e);
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    var sqlMain =
      "SELECT g.*,i.org_name FROM geree as g left join invoice as i on i.id=g.invoice_id where g.id=?";
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
    if (filter.org_id) {
      conditions += " and m.org_id = ?";
      values.push(filter.org_id);
    }
    if (filter.invoice_id) {
      conditions += " and m.invoice_id = ?";
      values.push(filter.invoice_id);
    }
    var sqlCount =
      "select count(m.id) as numRows from geree as m where (1=1) " +
      conditions;
    var selectFields = "m.*";
    var sqlMain =
      "SELECT " +
      selectFields +
      " FROM geree as m " +
      "where (1=1) " +
      conditions +
      " order by m.created_at desc limit " +
      (pid - 1) * pSize +
      " , " +
      pSize;
    connection.query(sqlCount, values, function (errC, resultsC) {
      if (errC) log.logWriteError(req, res, errC);
      allRows = resultsC[0].numRows;
      numPages = Math.ceil(allRows / pSize);
      var responsePayload = {};
      connection.query(sqlMain, values, function (errM, resultsM) {
        if (errM) log.logWriteError(req, res, errM);
        responsePayload.data = resultsM;
        if (pid - 1 < numPages) {
          responsePayload.pagination = {
            current: pid,
            ptotal: allRows,
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
module.exports = router;
