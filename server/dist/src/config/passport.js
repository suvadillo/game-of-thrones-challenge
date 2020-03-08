"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const LocalStrategy = passport_local_1.default.Strategy;
const bcrypt_1 = __importDefault(require("bcrypt"));
passport_1.default.serializeUser((loggedInUser, cb) => {
    cb(null, loggedInUser._id);
});
passport_1.default.deserializeUser((userIdFromSession, cb) => {
    User_1.default.findById(userIdFromSession, (err, userDocument) => {
        if (err) {
            cb(err);
            return;
        }
        cb(null, userDocument);
    });
});
passport_1.default.use(new LocalStrategy((username, password, next) => {
    User_1.default.findOne({ username }, (err, foundUser) => {
        if (err) {
            next(err);
            return;
        }
        if (!foundUser) {
            next(null, false, { message: 'Incorrect username.' });
            return;
        }
        if (!bcrypt_1.default.compareSync(password, foundUser.password)) {
            next(null, false, { message: 'Incorrect password.' });
            return;
        }
        next(null, foundUser);
    });
}));
