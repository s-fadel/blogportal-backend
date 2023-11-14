module.exports = {
  secret: process.env.ACCSES_TOKEN_SECRET,

  jwtExpiration: "15m",
  jwtRefreshExpiration: 680,
};
