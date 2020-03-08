"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
const salt = bcrypt_1.default.genSaltSync(10);
const encryptPass = (pass) => bcrypt_1.default.hashSync(pass, salt);
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    User_1.default.findOne({ username })
        .then(user => {
        if (user) {
            throw http_errors_1.default(409, 'Username taken. Choose another one');
            // res.status(409).json({ message: 'Username taken. Choose another one' });
            // return;
        }
        else {
            const hasPass = encryptPass(password);
            return new User_1.default({ username, password: hasPass }).save()
                .then(newUser => {
                req.login(newUser, (err) => {
                    if (err) {
                        throw http_errors_1.default(500, 'LogIn after SignUp went wrong');
                        // res.status(500).json({message: 'LogIn after SignUp went wrong'});
                        // return;
                    }
                    res.status(200).json(newUser);
                });
            });
        }
    })
        .catch(next);
});
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'User authentication went wrong' });
            return;
        }
        if (!theUser) {
            res.status(401).json(failureDetails);
            return;
        }
        req.login(theUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save didnt work' });
                return;
            }
            res.status(200).json(theUser);
        });
    })(req, res, next);
});
router.post('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({ message: 'Log out successful' });
});
router.get('/loggedin', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' });
});
// router.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
//   console.log('entra')
//   res.status(500).json({error: true, message: err.message})
// });
exports.default = router;
