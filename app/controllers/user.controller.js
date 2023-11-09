//user.controller.js
const { authJwt } = require("../middleware");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const Op = db.Sequelize.Op;
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.updateUserRole = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId).then((user) => {
    if (!user) {
      return res
        .status(404)
        .send({ message: `Kunde inte hitta användaren med id ${userId}.` });
    }
    if (req.body.roles) {
      Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      }).then((roles) => {
        user.setRoles(roles).then(() => {
          res.send({ message: "Användarens roll uppdaterad!" });
        });
      });
    } else {
      user.setRoles([1]).then(() => {
        res.send({ message: "Användarens roll uppdaterad!" });
      });
    }
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  authJwt.verifyToken,
    authJwt.isAdmin,
    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .send({ message: `Kunde inte hitta användaren med id ${userId}.` });
        }

        user
          .destroy()
          .then(() => {
            res.send({ message: "Användaren är borttagen!" });
          })
          .catch((error) => {
            res.status(500).send({ message: error.message });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
};

exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};
