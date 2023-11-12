const db = require("../models");
const { authJwt } = require("../middleware");

const {
  user: User,
  role: Role,
  refreshToken: RefreshToken,
  invite: Invite,
} = db;
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

    // Ändra användarens roll till "admin" (eller annan roll)
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
      // Om du inte har ett roles-fält i din request, kan du använda en standardroll (t.ex. "user")
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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: Role, // Detta kommer att inkludera användarrollerna
    });

    const usersWithRoles = users.map((user) => {
      const roles = user.roles.map((role) => role.name);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: roles,
      };
    });

    res.status(200).json(usersWithRoles);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getInvitedUsers = async (req, res) => {
  try {
    const invitedUsers = await Invite.findAll();

    res.status(200).json(invitedUsers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};