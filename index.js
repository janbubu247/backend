const express = require("express");
const app = express();

const rateLimit = require("express-rate-limit");
var secureServer = undefined;
secureServer = require("http").createServer(app);

require("events").EventEmitter.defaultMaxListeners = 15;
// io chat end

//log middleware ehlel
const morgan = require("morgan");
var path = require("path");
var rfs = require("rotating-file-stream");
//log middleware haalt

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

i18n = require("i18n");
i18n.configure({
  locales: ["mn", "en"],
  directory: __dirname + "/locales",
  register: global,
  objectNotation: true,
});

const PORT = 8014;
const bodyParser = require("body-parser");
const cors = require("cors");

//odor odroor log file uusgej hadgalah
let ts = Date.now();
let date_ob = new Date(ts);
let hour = date_ob.getHours();
let day = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
var accessLogStream = rfs.createStream(hour + ".log", {
  interval: "1h", // rotate daily d,h,m,s
  path: path.join(__dirname, "log/" + year + "/" + month + "/" + day + "/"),
});

app.use(morgan("combined", { stream: accessLogStream }));
//odor odroor log file uusgej hadgalah haalt
var useragent = require('express-useragent');
app.use(useragent.express());
app.use(i18n.init);
app.use(cors());
app.use("/file", express.static("uploads")); //public zam uusgej bn file upload uid ashigalana
app.use("/uploads", express.static("uploads")); //public zam uusgej bn file upload uid ashigalana
app.use(bodyParser.json({limit: '200mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '200mb', parameterLimit: 150000}))
app.get('/favicon.ico', (req, res) => res.status(204));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5000, // нэг ip хаягнаас хандах тооны хязгаар
  message: {
    statusText:
      "Та 15 минутанд 5000-с их хандаж болохгүй. Түр хүлээгээд дахин хандана уу!",
  },
});
app.use(limiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/invoice", require("./routes/api/invoice"));
app.use("/api/geree", require("./routes/api/geree"));
app.use("/api/dashboard", require("./routes/api/dashboard"));

app.set('trust proxy', true)


secureServer.listen(PORT, () => {
  console.log("Сервер Port : " + PORT + " дээр ажиллаж байна.");
});
