import { NextFunction } from "express";

const passport = require("passport");
const { UnauthorizedError } = require("../utils/errors");

const isAuthenticated = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate("bearer", {
    session: false,
    failureRedirect: "/auth/login",
    failWithError: true,
  })(req, res, (e: Error) => {
    if (e) {
      next(new UnauthorizedError("Unauthenticated"));
    }
    next();
  });

module.exports = isAuthenticated;
