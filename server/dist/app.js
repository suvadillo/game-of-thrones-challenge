"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
require("./src/config/passport");
const { npm_package_name: app_name, DBURL, SECRET_SESSION = 'session-secret' } = process.env;
const whitelistCors = [`http://localhost:3000`];
mongoose_1.default
    .connect(`${DBURL}${app_name}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
})
    .catch(err => {
    console.error('Error connecting to mongo', err);
});
const app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_session_1.default({
    secret: SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(cors_1.default({
    credentials: true,
    origin: whitelistCors
}));
const index_1 = __importDefault(require("./src/routes/index"));
app.use('/', index_1.default);
const auth_routes_1 = __importDefault(require("./src/routes/auth-routes"));
app.use('/auth', auth_routes_1.default);
app.use(function (error, req, res, next) {
    console.error(error);
    res.status(error.status || 500);
    const data = {};
    if (error instanceof mongoose_1.default.Error.ValidationError) {
        res.status(400);
        Object.keys(error.errors).forEach(item => error.errors[item] = error.errors[item].message);
        // for (field of Object.keys(error.errors)) {
        //   error.errors[field] = error.errors[field].message
        // }
        data.errors = error.errors;
    }
    else if (error instanceof mongoose_1.default.Error.CastError) {
        error = http_errors_1.default(404, 'Resource not found');
    }
    data.message = error.message;
    res.json(data);
});
exports.default = app;
