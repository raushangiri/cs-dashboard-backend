const useridValidation = (req, res, next) => {
  // console.log(req.query.userid)
  let userid = req.query.userid;
  // console.log("hi")
  if (!userid) {
    return res.status(400).send({ message: "user id not inserted" });
  }
  next();
};

module.exports = useridValidation;
