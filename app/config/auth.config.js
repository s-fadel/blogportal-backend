module.exports = {
  secret: process.env.ACCSES_TOKEN_SECRET,
  //jwtExpiration: 3600,           // 1 hour
  //jwtRefreshExpiration: 86400,   // 24 hours

  /* för test */
  jwtExpiration: 60, // 1 minute
  jwtRefreshExpiration: 120, // 2 minutes
};
