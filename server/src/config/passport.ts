import User from '../models/User';
import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import bcrypt from 'bcrypt';

passport.serializeUser<any, any>((loggedInUser: any, cb: Function): void => {

  cb(null, loggedInUser._id);

});

passport.deserializeUser<any, any>((userIdFromSession: String, cb: Function): void => {

  User.findById(userIdFromSession, (err: Error, userDocument: any): void => {

    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);

  });

});

passport.use(new LocalStrategy((username: String, password: String, next: Function): void => {

  User.findOne({ username }, (err: Error, foundUser: any) => {

    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      next(null, false, { message: 'Incorrect username.' });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect password.' });
      return;
    }

    next(null, foundUser);
    
  });

}));

