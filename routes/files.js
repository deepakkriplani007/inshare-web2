const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limit: { fileSize: 10000000 },
}).single("myfile");

router.post("/", (req, res) => {
  //store file
  upload(req, res, async (err) => {
    //validate request
    if (!req.file) {
      return res.json({ error: "all fields are required" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //database store
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
    //http://localhost:3000/files/235552gksfsbnnk
  });

  //database store

  //response link to download
});

router.post("/send", async (req, res) => {
  //   console.log(req.body);
  //   return res.send({});
  const { uuid, emailTo, emailFrom } = req.body;
  //   console.log(emailTo);
  // validation of request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "all field are required." });
  }
  // console.log(req.body);

  const file = await File.findOne({ uuid: uuid });
  //   console.log(file);
  if (file.sender) {
    return res.status(422).send({ error: "email already sent." });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  //send email
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "inshare file sharing",
    text: `${emailFrom}shared a file with you`,

    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });
  return res.send({ sucess: true });
});

module.exports = router;
