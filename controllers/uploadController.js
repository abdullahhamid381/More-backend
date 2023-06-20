import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import path from "path";
import crypto from "crypto";

//error imports
import BadRequest from "../errors/badRequest.js";
import NotFound from "../errors/notFound.js";

// Setting up the storage element
let gfs, gridFsBucket;
mongoose.connection.once("open", () => {
  gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      console.log("here I am in file", file);
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const fileName = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          fileName: fileName,
          bucketName: "uploads",
        };
        return resolve(fileInfo);
      });
    });
  },
});

export const upload = multer({ storage });

/**
 *
 * * This method is used to upload the image and file
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns
 */
const uploadFiles = async (req, res, next) => {
  try {
    console.log("here I am in uploadFiles");
    console.log("This: ", req.files);
    const files = req.files;
    if (!files) {
      throw new BadRequest("Please upload a file");
    }
    res.send(files);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * * This method is used to get the image for the given imageName
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns
 */

const getImageFile = async (req, res, next) => {
  try {
    gfs.files
      .findOne({ filename: req.params.filename })
      .then((file) => {
        //check if file exists
        if (!file || file.length === 0) {
          throw new NotFound("No file exists");
        }
        //check if it is an image file
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          //send image file
          res.set("Content-Type", file.contentType);

          const readStream = gridFsBucket.openDownloadStreamByName(
            file.filename
          );
          readStream.pipe(res);
        } else {
          throw new BadRequest("Not an image file");
        }
      })
      .catch((err) => console.log(err));
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * * This method is used to get the file for the given filename
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns
 */

const getFile = async (req, res, next) => {
  try {
    gfs.files
      .findOne({ filename: req.params.filename })
      .then((file) => {
        //check if file exists
        if (!file || file.length === 0) {
          throw new NotFound("No file exists");
        }

        //check if it is a pdf or docx file
        if (
          file.contentType === "application/pdf" ||
          file.contentType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          //send file
          res.set("Content-Type", "attachment");
          const readStream = gridFsBucket.openDownloadStreamByName(
            file.filename
          );
          readStream.pipe(res);
        } else {
          throw new BadRequest("Not a pdf or docx file");
        }
      })
      .catch((err) => console.log(err));
  } catch (err) {
    return next(err);
  }
};

export default { uploadFiles, getImageFile, getFile };
