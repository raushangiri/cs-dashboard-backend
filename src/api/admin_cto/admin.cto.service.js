const ctogetresponse = (representative, assign, agent) => {
  let data = [];
  representative.forEach((i) => {
    let representativObj = {};
    // representativObj = { ...i };
    assign.map((j) => {
      agent.map((k) => {
        if (i._id.toString() === j.representative_request_id) {
          if ((j.cto_user_id = k._id.toString())) {
            // console.log("if");
            representativObj["_id"] = i._id;
            representativObj["representativerole_id"] = j._id;
            representativObj["company_name"] = i.companyName;
            representativObj["business_email"] = i.old_business_email;
            representativObj["request_date"] = j.request_date;
            representativObj["request_status"] = j.request_status;
            representativObj["agent_name"] = k.name;
            representativObj["cto_cac_docurl_status"] = j.cto_cac_docurl_status;
            representativObj["cto_other_docurl_status"] =
              j.cto_other_docurl_status;
            representativObj["cto_details_status"] = j.cto_details_status;

            // console.log(representativObj, "if");
          } else {
            representativObj["_id"] = i._id;
            representativObj["representativerole_id"] = j._id;
            representativObj["company_name"] = i.companyName;
            representativObj["business_email"] = i.old_business_email;
            representativObj["request_date"] = j.request_date;
            representativObj["request_status"] = j.request_status;
            representativObj["agent_name"] = "";
            representativObj["cto_cac_docurl_status"] = j.cto_cac_docurl_status;
            representativObj["cto_other_docurl_status"] =
              j.cto_other_docurl_status;
            representativObj["cto_details_status"] = j.cto_details_status;

            // console.log(representativObj, "if");
          }
        }
        return representativObj;
      });
      // console.log(representativObj, "out");
      return representativObj;
    });

    data.push(representativObj);
  });
  return data;
};

const ctogetalldata = async (req, res) => {
  try {
    const assigndata = await managementrole.find({
      $or: [{ request_status: "ASSIGN" }, { request_status: "APPROVED" }],
    });
    const representativeData = await representative
      .find(
        { request_status: false },
        {
          password: 0,
          security_question1: 0,
          security_answer1: 0,
          security_question2: 0,
          security_answer2: 0,
          security_question3: 0,
          security_answer3: 0,
        }
      )
      .lean();
    const agentname = await adminusers.find({}).lean();

    let data = [];
    representativeData.forEach((i) => {
      let representativObj = {};
      assigndata.forEach((j) => {
        agentname.forEach((k) => {
          if (i._id.toString() === j.representative_request_id) {
            representativObj["_id"] = i._id;
            representativObj["representativerole_id"] = j._id;
            representativObj["company_name"] = i.companyName;
            representativObj["business_email"] = i.old_business_email;
            representativObj["request_date"] = j.request_date;
            representativObj["request_status"] = j.request_status;
            representativObj["management_cac_docurl_status"] =
              j.management_cac_docurl_status;
            representativObj["management_other_docurl_status"] =
              j.management_other_docurl_status;
            representativObj["management_details_status"] =
              j.management_details_status;
            data.push(representativObj); // Push inside the loop
          }
        });
      });
    });

    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
module.exports = { ctogetresponse };
