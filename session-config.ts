import * as session from "express-session";
import {Handler} from "express";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export default (secret: string, isSecure: boolean): Handler => {
    return session({
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: isSecure,
            maxAge: 2 * HOUR
        }
    });

};
