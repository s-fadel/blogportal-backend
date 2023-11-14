const jwt = require("jsonwebtoken");
const db = require("../models");
const Invite = db.invite;
const nodemailer = require("nodemailer");
const config = require("../config/auth.config");
const { authJwt } = require("../middleware");

exports.inviteUser = async (req, res) => {
  const { email, selectedRole } = req.body;

  try {
    const invitationToken = jwt.sign(
      { email: email, selectedRole },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    Invite.create({
      token: invitationToken,
      email: email,
      selectedRole,
    });

    const invitationLink = `http://localhost:3000/set-password/?invitationToken=${invitationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Inbjudan att skapa lösenord",
      html: `
        <p>Du har blivit inbjuden att skapa ditt lösenord på vår webbplats.</p>
        <p>Klicka på denna länk för att skapa ditt lösenord: ${invitationLink}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Något gick fel vid sändningen av inbjudan via e-post.",
        });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).send({
          message: "Inbjudan skickad framgångsrikt via e-post!",
        });
      }
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }

  return res.status(200).send({
    message: "Inbjudan skickad framgångsrikt via e-post!",
  });
};

/* exports.removeInvitedUser = async (req, res) => {
     authJwt.verifyToken,
    authJwt.isAdmin,
  const { token } = req.body;

  try {
    const userToken = jwt.verify(token, config.secret);
    const userEmail = userToken.email;
    const removedUser = await Invite.destroy({
      where: { email: userEmail },
    });

    if (removedUser) {
      return res.status(200).send({
        message: "Invited user removed successfully!",
      });
    } else {
      return res.status(404).send({
        message: "Invited user not found.",
      });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}; */

exports.removeInvitedUser = (req, res) => {
  const { token } = req.body;
  authJwt.verifyToken,
    authJwt.isAdmin,
    Invite.findOne({ where: { token: token } })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "Invited user not found." });
        }

        user
          .destroy()
          .then(() => {
            res.send({ message: " Invited user removed successfully!" });
          })
          .catch((error) => {
            res.status(500).send({ message: error.message });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
};
