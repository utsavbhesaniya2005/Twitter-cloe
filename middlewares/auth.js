const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.session.token;

  if (token) {

    try {

      const decodeToken = jwt.verify(token, process.env.JSONPRIVATEKEY);

      if (decodeToken) {

        req.session.sessionUser = decodeToken;
        req.user = decodeToken;
        next();

      } else {

        console.log("Invalid token. Authentication is required...");
        req.flash("activeForm", "login");
        req.flash("registerSuc", "Invalid Token.");
        req.flash("registerSucIcon", "🚫");
        req.flash(
          "registerSucMsg",
          "Your session has expired. Please log in again."
        );
        res.redirect("/twitter-clone/user/register");
      }
    } catch (err) {

      console.log("Error verifying token:", error);
      req.flash("activeForm", "login");
      req.flash("registerSuc", "Authentication Failed.");
      req.flash("registerSucIcon", "⚠️");
      req.flash(
        "registerSucMsg",
        "Oops! Something went wrong with your session. Please log in again."
      );
      return res.redirect("/twitter-clone/user/register");
    }
  } else {
    console.log("No token found. Authentication is required...");
    req.flash("activeForm", "login");
      req.flash("registerSuc", "User Authentication is required.");
      req.flash("registerSucIcon", "⚠️");
      req.flash(
        "registerSucMsg",
        "You need to log in to continue. Please try again shortly."
      );
    res.redirect("/twitter-clone/user/register");
  }
};

module.exports = { auth };
