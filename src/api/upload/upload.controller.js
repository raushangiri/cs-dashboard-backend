const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const company = require("../../model/company.model");
const serverUI = process.env.pdf_uri;
const fileid = require("./upload.validation");
const employee = require("../../model/employee.model");
const dependent = require("../../model/dependant");

const fileuploadcomapny = async (req, res) => {
  try {
    // console.log(req.file, "hi");
    const userid = req.query.userid;
    // const response = fileid.validate(req.query)
    if (userid) {
      // console.log("in");
      comapnyUuid = uuidv4();
      let data = await comapnyUuid.concat("-", req.file.path);
      // console.log(data);
      return res
        .status(200)
        .send({ message: "file uploaded successfully", data, comapnyUuid });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const uploadfilearray = async (req, res) => {
  try {
    // console.log(req, "hi")
    const userid = req.query.userid;
    // const response = fileid.validate(req.query)
    if (userid) {
      // console.log("in")
      // console.log(req.file, "hi1")

      comapnyUuid = uuidv4();
      // console.log(req.file, "hi2")
      let urls = req.files.map((i) => {
        return i.path;
      });
      // console.log(urls, "hi2")
      let data = [];
      data.push(await comapnyUuid.concat("-", urls));
      // console.log(data)
      return res.status(200).send({
        message: "file uploaded successfully",
        data,
        comapnyUuid,
        status: 200,
      });
    }
  } catch (error) {
    return res.status(200).send({ message: error.message });
  }
};

const fileuploademployee = async (req, res) => {
  try {
    // console.log(req.file, "hi")
    const userid = req.query.userid;
    // const response = fileid.validate(req.query)
    // console.log(userid);
    if (userid) {
      let uuid = uuidv4();
      // console.log(uuid,"in")
      let data = await uuid.concat("-", req.file.path);
      empUuid = uuid;
      // console.log(data);
      // return res.status(200).send({ message: "file uploaded successfully", data ,empUuid})
    }
    return res.status(200).send({ message: "put query params" });
    // }else{
    //     if(response.error){
    //         return res.status(401).send({ message: response.error.details })
    //     }
    // }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const fileuploaddependant = async (req, res) => {
  try {
    // console.log(req.file, "hi")
    const userid = req.query.userid;
    // const response = fileid.validate(req.query)
    // console.log(userid);
    if (userid) {
      // console.log("in");
      let uuid = uuidv4();
      // console.log(uuid,"in")
      let data = await uuid.concat("-", req.file.path);
      dependantUuid = uuid;
      // console.log(data);
      return res
        .status(200)
        .send({ message: "file uploaded successfully", data, dependantUuid });
    }
    return res.status(200).send({ message: "put query params" });
    // }else{
    //     if(response.error){
    //         return res.status(401).send({ message: response.error.details })
    //     }
    // }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getcompanydoc = async (req, res) => {
  try {
    const companyData = await company.findOne({ userid: req.body.userid });
    // console.log(companyData.expatriate_quota_position)
    const expatriate_quota_positionURI =
      companyData.expatriate_quota_position.split("/")[2];
    // console.log(userURI,"uri")
    const expatriate_quota_positionstring = serverUI.concat(
      "/",
      req.body.userid,
      "/",
      expatriate_quota_positionURI
    );
    // console.log(companyData.cac)

    const cacURI = companyData.cac.split("/")[2];
    // console.log(cacURI, "uri");
    const cac_string = serverUI.concat("/", req.body.userid, "/", cacURI);

    const tccURI = companyData.tcc.split("/")[2];
    // console.log(tccURI,"uri")
    const tcc_string = serverUI.concat("/", req.body.userid, "/", tccURI);
    return res.status(200).send({
      cacDocument: cac_string,
      tccdocument: tcc_string,
      expatriate_quota_positionstringDocument: expatriate_quota_positionstring,
    });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getemployeedoc = async (req, res) => {
  try {
    const employeeData = await employee.findOne({ userid: req.body.userid });
    // console.log(companyData.expatriate_quota_position)
    const uploadpassportURI = companyData.uploadpassport.split("/")[2];
    // console.log(userURI,"uri")
    const uploadpassportstring = serverUI.concat(
      "/",
      req.body.userid,
      "/",
      uploadpassportURI
    );
    // console.log(companyData.cac)
    const cerpac_frontURI = companyData.cerpac_front.split("/")[2];
    // console.log(cacURI,"uri")
    const cerpac_frontstring = serverUI.concat(
      "/",
      req.body.userid,
      "/",
      cerpac_frontURI
    );
    const cerpac_backURI = companyData.tcc.split("/")[2];
    // console.log(tccURI,"uri")
    const cerpac_backstring = serverUI.concat(
      "/",
      req.body.userid,
      "/",
      cerpac_backURI
    );
    return res.status(200).send({
      uploadpassportDocument: uploadpassportstring,
      cerpac_frontdocument: cerpac_frontstring,
      cerpac_backDocument: cerpac_backstring,
    });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getemployeephoto = async (req, res) => {
  try {
    const employeeData = await employee.findOne({
      _id: req.body._id,
      userid: req.body.userid,
    });
    // console.log(employeeData);
    const photoURI = employeeData.employee_profile_photo.split("/")[2];
    // console.log(photoURI, "uri");
    const photo_string = serverUI.concat("/", req.body.userid, "/", photoURI);
    // console.log(photo_string);
    return res.status(200).send({ photo: photo_string });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getdependentphoto = async (req, res) => {
  try {
    const employeeData = await dependent.findOne({
      _id: req.body._id,
      employee_id: req.body.employee_id,
    });
    // console.log(employeeData);
    const photoURI = employeeData.dependant_profile_photo.split("/")[2];
    // console.log(photoURI,"uri")
    const photo_string = serverUI.concat(
      "/",
      employeeData.userid,
      "/",
      photoURI
    );
    // console.log(photo_string)
    return res.status(200).send({ photo: photo_string });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getarraydocs = async (req, res) => {
  try {
    const employeeData = await employee.findOne({
      _id: req.body._id,
      userid: req.body.userid,
    });
    // console.log(employeeData);
    const photoURI = employeeData.employee_profile_photo.split("\\")[2];
    // console.log(photoURI,"uri")
    const photo_string = serverUI.concat("/", req.body.userid, "/", photoURI);
    // console.log(photo_string)
    return res.status(200).send({ photo: photo_string });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

module.exports = {
  fileuploadcomapny,
  uploadfilearray,
  fileuploademployee,
  fileuploaddependant,
  getcompanydoc,
  getemployeedoc,
  getemployeephoto,
  getdependentphoto,
  getarraydocs,
};
