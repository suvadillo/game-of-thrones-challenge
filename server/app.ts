import dotenv from 'dotenv';
dotenv.config();

import createError from 'http-errors';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors'
import passport from 'passport';
import './src/config/passport';

const { npm_package_name: app_name, DBURL, SECRET_SESSION = 'session-secret' } = process.env;
const whitelistCors = [`http://localhost:3000`];

mongoose
  .connect(`${DBURL}${app_name}`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: SECRET_SESSION,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  credentials: true,
  origin: whitelistCors
}));

import indexRoutes from './src/routes/index';
app.use('/', indexRoutes);

import authRoutes from './src/routes/auth-routes';
app.use('/auth', authRoutes);

app.use(function (error, req, res, next) {
  console.error(error);

  res.status(error.status || 500);

  const data: any = {}

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400);
    Object.keys(error.errors).forEach( item => error.errors[item] = error.errors[item].message )
    // for (field of Object.keys(error.errors)) {
    //   error.errors[field] = error.errors[field].message
    // }
    data.errors = error.errors
  } else if (error instanceof mongoose.Error.CastError) {
    error = createError(404, 'Resource not found')
  }

  data.message = error.message;
  res.json(data);
});

export default app;