module.exports = {
  secret: process.env.ACCSES_TOKEN_SECRET,
  /* för test */
  jwtExpiration: 480, 
  jwtRefreshExpiration: 640, 
};
