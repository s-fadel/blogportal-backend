const jwt = require("jsonwebtoken");

const db = require("../models");
const Invite = db.invite;
const nodemailer = require("nodemailer");
const config = require("../config/auth.config");

exports.inviteUser = async (req, res) => {
  const { email } = req.body;

  try {
    const invitationToken = jwt.sign({ email: email }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    // Spara JWT-token i din databas
    Invite.create({
      token: invitationToken,
      email: email,
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
