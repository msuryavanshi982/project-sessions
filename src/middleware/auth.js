const jwt = require("jsonwebtoken");

//_Authentication_

let authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res
        .status(400)
        .send({ status: false, message: "token must be present" });

    jwt.verify(token, "book-management", (err, user) => {
      if (err) {
        return res.status(401).send("invalid token");
      }

      req.userLoggedIn = user;
      next();
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

  
module.exports = { authentication }