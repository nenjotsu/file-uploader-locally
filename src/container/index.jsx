import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { post } from "axios";
import fs from "fs";
import path from "path";
import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import Divider from "antd/lib/divider";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import message from "antd/lib/message";
import {
  multipartFormData,
  defaultUploadConfig,
  uploadFileUrl,
  generateKey,
  liskOfFileNames
} from "../helpers";
import { checkFileName } from "../helpers";
import "./styles.css";

const colConfig = {
  xs: 24,
  sm: 24,
  md: 6,
  lg: 6,
  xl: 6
};

const propTypes = {
  setLookupUploaded: PropTypes.func.isRequired,
  isLookupUploaded: PropTypes.bool.isRequired
};

class SelectLookup extends Component {
  state = {
    auctionListRecords: [],
    sfListRecords: [],
    auctionTRRecords: [],
    sfTRRecords: [],
    uploading: false
  };

  componentDidMount() {
    this.checkIfhasCsv();
  }

  checkIfhasCsv = () => {
    liskOfFileNames.forEach(fileName => {
      const filepath = path.join(__dirname, `uploads/${fileName}.csv`);
      if (fs.existsSync(filepath)) {
        this.props.setLookupUploaded(true);
      }
    });
  };

  requestUpload = file => {
    const formData = new FormData();
    formData.append("file", file);
    post(uploadFileUrl, formData, multipartFormData)
      .then(result => console.log(result.response))
      .catch(err => {
        console.log(err);
        message.error("upload failed.", err);
      });
  };

  handleUpload = () => {
    const { sampleListRecords } = this.state;

    this.setState({ uploading: true }, () => {
      sampleListRecords.forEach(file => {
        this.requestUpload(file);
      });
      setTimeout(() => {
        this.setState({ uploading: false });
        this.props.setLookupUploaded(true);
        message.success("Files uploaded");
      }, 3000);
    });
  };

  beforeUploadFunc = type => file => {
    liskOfFileNames.forEach(fileName => {
      if (type === fileName) {
        console.log(fileName, file.name);
        const isValid = checkFileName(`${fileName}.csv`, file.name);
        if (!isValid) {
          return;
        }
        this.setState(() => ({ [`${fileName}Records`]: [].concat([file]) }));
      }
    });
    return false;
  };

  deleteFile = fileName => {
    const filepath = path.join(__dirname, `uploads/${fileName}.csv`);

    if (fs.existsSync(filepath)) {
      fs.unlink(filepath, err => {
        if (err) {
          message.error(`An error ocurred updating the file ${err.message}`);
          console.log(err);
          return;
        }
        message.success(`File ${fileName}.csv succesfully deleted`);
      });
    } else {
      message.error(`This file ${fileName}.csv doesn't exist, cannot delete`);
    }
  };

  deleteFiles = () => {
    liskOfFileNames.forEach(file => {
      this.deleteFile(file);
    });
  };

  clearAll = () => {
    this.setState(
      {
        auctionListRecords: [],
        sfListRecords: [],
        auctionTRRecords: [],
        uploading: false
      },
      () => {
        this.deleteFiles();
        this.props.setLookupUploaded(false);
      }
    );
  };

  pClass = array => {
    const toString = array.toString().replace(/,/g, " ");
    return toString.trim();
  };

  getTypeIcon = (listName, isLookupUploaded) => {
    const stateRecords = this.state[`${listName}Records`];

    if (stateRecords === undefined) {
      return "upload";
    }

    if (stateRecords.length > 0 || isLookupUploaded) {
      return "check";
    }
    return "upload";
  };
  getTypeColor = (listName, isLookupUploaded) => {
    const stateRecords = this.state[`${listName}Records`];

    if (stateRecords === undefined) {
      return "";
    }

    if (stateRecords.length > 0 || isLookupUploaded) {
      return "iconSuccess";
    }
    return "";
  };

  isDisabled = () => {
    const {
      auctionTRRecords,
      auctionListRecords,
      sfListRecords,
      sfTRRecords
    } = this.state;
    const { isLookupUploaded } = this.props;
    return (
      auctionTRRecords.length === 0 ||
      auctionListRecords.length === 0 ||
      sfListRecords.length === 0 ||
      sfTRRecords.length === 0 ||
      isLookupUploaded
    );
  };
  isDoneUploaded = () => {
    const {
      auctionTRRecords,
      auctionListRecords,
      sfListRecords,
      sfTRRecords
    } = this.state;
    return (
      auctionTRRecords.length > 0 &&
      auctionListRecords.length > 0 &&
      sfListRecords.length > 0 &&
      sfTRRecords.length > 0
    );
  };

  render() {
    const { uploading } = this.state;
    const { isLookupUploaded } = this.props;

    const uploadProps = {};

    liskOfFileNames.forEach(fileName => {
      uploadProps[`${fileName}Config`] = {
        ...defaultUploadConfig,
        beforeUpload: this.beforeUploadFunc(fileName)
      };
    });

    return (
      <Fragment>
        <Divider key={generateKey()} dashed>
          <h3>Select a CSV with filename of `sample-csv-file`</h3>
        </Divider>
        <Row>
          {liskOfFileNames.map(fileName => (
            <Col key={generateKey()} {...colConfig}>
              <div>
                <Icon
                  className={[
                    "iconLarge",
                    this.getTypeColor(fileName, isLookupUploaded)
                  ]}
                  type={this.getTypeIcon(fileName, isLookupUploaded)}
                />
                <Upload
                  key={generateKey()}
                  {...uploadProps[`${fileName}Config`]}
                >
                  <Button size="default" disabled={isLookupUploaded}>
                    {`Select ${fileName}`}
                  </Button>
                </Upload>
              </div>
            </Col>
          ))}
        </Row>

        <Divider key={generateKey()}>...</Divider>
        <div>
          <Button
            key={generateKey()}
            style={{ marginBottom: 10, marginRight: 10 }}
            size="large"
            type="default"
            onClick={this.clearAll}
          >
            <Icon type="close-circle" />
            Clear All
          </Button>
          <Button
            key={generateKey()}
            style={{ marginBottom: 10 }}
            size="large"
            type="primary"
            onClick={this.handleUpload}
            loading={uploading}
          >
            {uploading ? "Uploading" : "Start Upload"}
            {this.isDoneUploaded() && <Icon type="right-square" />}
          </Button>
        </div>
      </Fragment>
    );
  }
}

SelectLookup.propTypes = propTypes;
export default SelectLookup;
