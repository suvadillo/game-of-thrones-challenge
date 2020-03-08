import createError from 'http-errors';
import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { Response, Request, NextFunction } from "express";

const router = express.Router();

const salt = bcrypt.genSaltSync(10);
const encryptPass = (pass: String): String => bcrypt.hashSync(pass, salt);

router.post('/signup', (req: Request, res: Response, next: NextFunction): void => {

  const { username, password } = req.body;

  User.findOne({ username })
    .then( user => {
      if (user) {
        throw createError(409, 'Username taken. Choose another one')
        // res.status(409).json({ message: 'Username taken. Choose another one' });
        // return;
      }
      else {
        const hasPass = encryptPass(password);
        return new User({ username, password: hasPass }).save()
        .then( newUser => {
          req.login(newUser, (err: Error): void => {
            if (err) {
              throw createError(500, 'LogIn after SignUp went wrong')
              // res.status(500).json({message: 'LogIn after SignUp went wrong'});
              // return;
            }
            res.status(200).json(newUser);
          })
        })
      }
    })    
    .catch(next);
})

router.post('/login', (req: Request, res: Response, next: NextFunction): void => {

  passport.authenticate('local', (err: Error, theUser, failureDetails) => {

    if (err) {
      res.status(500).json({message: 'User authentication went wrong'});
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err: Error) => {
      if (err) {
        res.status(500).json({ message: 'Session save didnt work' });
        return;
      }
      res.status(200).json(theUser);
    })

  })(req, res, next);

})

router.post('/logout', (req: Request, res: Response, next: NextFunction): void => {

  req.logout();
  res.status(200).json({ message: 'Log out successful' })

})

router.get('/loggedin', (req: Request, res: Response, next: NextFunction): void => {

  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' })
  
})

// router.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
//   console.log('entra')
//   res.status(500).json({error: true, message: err.message})
// });

export default router;
