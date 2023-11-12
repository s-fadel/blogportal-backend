const jwt = require("jsonwebtoken");
const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(req.body.password)) {
    return res.status(400).send({
      message:
        "Password should be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character (@$!%*?&).",
    });
  }

};

exports.signin = (req, res) => {
  console.log("signin endpoint called1");
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      user.getRoles().then((roles) => {
        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: config.jwtExpiration,
        });

        let refreshToken = RefreshToken.createToken(user);

        let authorities = [];
        roles.forEach((role) => {
          authorities.push("ROLE_" + role.name.toUpperCase());
        });

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    if (!refreshToken) {
      res
        .status(403)
        .json({ message: "Refresh token is not in the database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
exports.createUserWithPassword = async (req, res) => {
  const { token, password, username } = req.body;

  try {
    const userToken = jwt.verify(token, config.secret);
    const userEmail = userToken.email;

    // Skapa användaren i databasen
    User.create({
      email: userEmail,
      username: username,
      password: bcrypt.hashSync(password, 8),
    })
      .then((user) => {
        if (req.body.roles) {
          Role.findAll({
            where: {
              name: {
                [Op.or]: req.body.roles,
              },
            },
          }).then((roles) => {
            user.setRoles(roles).then(() => {
              res.send({ message: "User was registered successfully!" });
            });
          });
        } else {
          user.setRoles([1]).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
