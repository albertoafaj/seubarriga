const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'Segredo!';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, async (payload, done) => {
    try {
      const user = await app.services.user.findOne({ id: payload.id });
      if (user) return done(null, { ...payload });
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use(strategy);

  return { authenticate: () => passport.authenticate('jwt', { session: false }) };
};
