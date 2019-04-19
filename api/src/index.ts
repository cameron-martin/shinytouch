import express from "express";
import cors from "cors";
import aws from "aws-sdk";
import uuid from "uuid/v4";
import Busboy from "busboy";
import util from "util";

const app = express();

app.use(cors());

app.get("/status", (request, response) => {
  response.sendStatus(200);
});

const credentials =
  process.env.NODE_ENV === "production"
    ? undefined
    : {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: "foo",
          secretAccessKey: "foo"
        },
        // Necessary for localstack
        s3ForcePathStyle: true
      };

const s3 = new aws.S3(credentials);

const s3Upload = util.promisify(s3.upload.bind(s3));

function findFrame(
  busboy: busboy.Busboy,
  handle: (stream: NodeJS.ReadableStream) => Promise<void>
): Promise<void> {
  let found = false;

  return new Promise((resolve, reject) => {
    busboy.on("file", (fieldname, file) => {
      if (fieldname === "frame") {
        found = true;

        resolve(handle(file));
      }
    });

    busboy.on("end", () => {
      if (!found) {
        reject(new Error("Cannot find frame field"));
      }
    });
  });
}

function findMetadata(busboy: busboy.Busboy): Promise<string> {
  let found = false;

  return new Promise((resolve, reject) => {
    busboy.on("field", (fieldname, value) => {
      if (fieldname === "metadata") {
        found = true;

        resolve(value);
      }
    });

    busboy.on("end", () => {
      if (!found) {
        reject(new Error("Cannot find metadata field"));
      }
    });
  });
}

app.post("/add-example", (request, response) => {
  const { calibrationSessionId } = request.query;

  if (typeof calibrationSessionId !== "string" || !calibrationSessionId) {
    response.status(400).send("Expecting calibration session id");
    return;
  }

  const exampleId = uuid();

  const busboy = new Busboy({ headers: request.headers });

  const handleMetadata = async () => {
    const metadata = await findMetadata(busboy);

    return s3Upload({
      Body: metadata,
      Bucket: "calibration-examples",
      Key: `${calibrationSessionId}/${exampleId}.json`,
      ContentType: "application/json"
    });
  };

  const handleFrame = async () => {
    return findFrame(busboy, async stream => {
      await s3Upload({
        Body: stream,
        Bucket: "calibration-examples",
        Key: `${calibrationSessionId}/${exampleId}.jpeg`,
        ContentType: "image/jpeg"
      });
    });
  };

  Promise.all([handleMetadata(), handleFrame()])
    .then(() => {
      response.sendStatus(201);
    })
    .catch(err => {
      response.status(500).send(err.message);
    });

  request.pipe(busboy);
});

app.listen(8080);
