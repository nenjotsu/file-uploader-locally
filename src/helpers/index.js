import shortid from "shortid";
import message from "antd/lib/message";

export const multipartFormData = {
  headers: { "content-type": "multipart/form-data" }
};

export const uploadFileUrl = "http://localhost:3344/upload-file";

export const defaultUploadConfig = {
  name: "file",
  accept: ".csv",
  multiple: false,
  showUploadList: false
};

export const generateKey = () => shortid.generate();

export const liskOfFileNames = ["sample-csv-file"];

export const checkFileName = (expected, actual) => {
  const isEqual = expected === actual;
  console.log(expected, actual);
  if (!isEqual) {
    message.warning(`Please upload ${expected} filename`, 7);
    return false;
  }
  return true;
};
