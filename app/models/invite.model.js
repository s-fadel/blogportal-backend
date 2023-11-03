module.exports = (sequelize, Sequelize) => {
  const Invite = sequelize.define("invite", {
    token: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
  });

  return Invite;
};
