const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

//_Create User_//

const createUser = async function (req, res) {
  try {
    let requestBody = req.body;
    let { title, name, phone, email, password, address } = requestBody;

    //-checks the duplicacy value from db--email,phone->>>
    const isUnique = await userModel.find({
      $or: [{ email: email }, { phone: phone }],
    });
    if (isUnique.length >= 1) {
      if (isUnique.length == 1) {
        if (isUnique[0].phone == phone) {
          return res
            .status(400)
            .send({ status: false, message: "phone already exist" });
        }
        if (isUnique[0].email == email) {
          return res
            .status(400)
            .send({ status: false, message: "Email already exist" });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, message: "phone and email already exist" });
      }
    }

    let userData = await userModel.create(requestBody);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: userData });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

//-Login User-//

const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    let userData = await userModel.findOne({
      email: email,
      password: password,
    });
    if (!userData)
      return res
        .status(404)
        .send({ status: false, message: "user or password is incorrect" });

    //token creation
    let token = jwt.sign(
      {
        userId: userData._id.toString(),
        iat: Math.floor(Date.now() / 1000),
      },
      "book-management",
      { expiresIn: "200m" }
    );

    res.setHeader("x-api-key", token);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: token });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { createUser, login };
