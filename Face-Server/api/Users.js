const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserInfo = require("../models/UserModel");

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", (req, res) => {
  UserInfo.find()
    .exec()
    .then((docs) => {
      return res.status(200).json({ datas: docs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

router.post("/", (req, res) => {
  console.log(req.body.nidNo);
  // const newUser = new UserInfo({
  //   nidNo: req.body.nidNo,
  // });
  // newUser.save();
  return res.status(200).json({ datas: "Nothing here..." });
});

router.post("/user-image", upload.single("userImage"), (req, res) => {
  UserInfo.findOne({ nidNo: req.body.nidNo })
    .exec()
    .then((doc) => {
      if (doc === null) {
        return res.status(404).json({ message: "User Not Found" });
      } else {
        if (doc.userImage === "null") {
          // console.log(req.file);
          const file = req.file;
          let imagePath = file.path;
          let pathArray = imagePath.split("public\\");
          UserInfo.updateOne(
            { nidNo: req.body.nidNo },
            { userImage: pathArray[1] }
          ).then((doc) => {
            return res
              .status(200)
              .json({ message: " Image Save Successfully" });
          });
        } else {
          return res.status(409).json({ message: "User Image Already Exist" });
        }
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
  // console.log(req.body.nidNo);
  // const newUser = new UserInfo({
  //   nidNo: req.body.nidNo,
  // });
  // newUser.save();
});

router.post("/user-image-upload", upload.single("userImage"), (req, res) => {
  const file = req.file;
  let imagePath = file.path;
  let pathArray = imagePath.split("public\\");

  UserInfo.findOne({ nidNo: req.body.nidNo })
    .then((user) => {
      if (user !== null) {
        return res.status(409).json({ message: "User Already Exist" });
      } else {
        const nidNo = req.body.nidNo;
        const userName = null;
        const dateOfBirth = null;
        const currentPayPoint = null;
        const pensiontype = null;
        const createdAt = null;

        const userData = new UserInfo({
          nidNo: nidNo,
          userName: userName,
          dateOfBirth: dateOfBirth,
          currentPayPoint: currentPayPoint,
          pensiontype: pensiontype,
          createdAt: createdAt,
          userImage: pathArray[1],
        });
        console.log(userData);

        userData.save().then((doc) => {
          return res
            .status(201)
            .json({ message: " User Created Successfully", user: doc });
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });

  // console.log(req.body.nidNo);
  // const newUser = new UserInfo({
  //   nidNo: req.body.nidNo,
  // });
  // newUser.save();
});

router.post("/checknid", (req, res) => {
  UserInfo.findOne({ nidNo: req.body.nidNo })
    .exec()
    .then((user) => {
      if (user) {
        console.log(user);
        return res.status(200).json({ datas: user });
      } else {
        return res
          .status(404)
          .json({ message: "Please Provide Valid NID Number." });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
