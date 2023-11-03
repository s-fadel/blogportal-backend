const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const app = express();
const db = require("./app/models");
const Op = db.Sequelize.Op;

const Role = db.role;
const User = db.user;

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "admin",
  });
  const password = bcrypt.hashSync("admin", 8);
  const roles = ["admin"];
  User.create({
    username: "admin",
    email: "admin@admin.com",
    password: password,
  })
    .then((user) => {
      if (roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {});
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {});
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to stephanie application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/post.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
