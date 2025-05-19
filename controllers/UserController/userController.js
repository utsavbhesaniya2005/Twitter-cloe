const User = require("../../models/UserModel/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");

const signUp = (req, res) => {
  res.render("register", {
    isSuccess: "",
    activeForm: req.flash("activeForm")[0],
    registerSuc: req.flash("registerSuc")[0],
    registerSucIcon: req.flash("registerSucIcon")[0],
    registerSucMsg: req.flash("registerSucMsg")[0],
  });
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      console.log("User already Exists try Again...");
      res.render("register", {
        isSuccess: "false",
        activeForm: "login",
        registerSuc: "User Already Exists.",
        registerSucIcon: "🚫",
        registerSucMsg:
          "Looks like you've already signed up. Try logging in instead!",
      });
    } else {
      const user = await User.create({
        username,
        email,
        password: await bcrypt.hash(password, 12),
        avatar: "",
      });

      if (user) {
        console.log("User Registerd Successfully...", user);
        res.render("register", {
          isSuccess: "true",
          activeForm: "login",
          registerSuc: "Register Successfull.",
          registerSucIcon: "✅",
          registerSucMsg: "Woohoo! You're officially part of the family! 🎉",
        });
      } else {
        console.log("Error Occur during user registration.");
        res.render("register", {
          isSuccess: "false",
          activeForm: "register",
          registerSuc: "Registration Failed.",
          registerSucIcon: "❌",
          registerSucMsg: "Something went wrong. Please try again later.",
        });
      }
    }
  } catch (err) {
    console.log("Internal Server Error :- ", err);
    res.render("register", {
      isSuccess: "false",
      activeForm: "register",
      registerSuc: "Server Error.",
      registerSucIcon: "⚠️",
      registerSucMsg: "Oops! We hit a bump. Please try again shortly.",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User Not Exists Please Register...");
      req.flash("activeForm", "register");
      req.flash("registerSuc", "User Not Found.");
      req.flash("registerSucIcon", "🔍");
      req.flash(
        "registerSucMsg",
        "No account found with this email. Please sign up!"
      );
      res.redirect("/twitter-clone/user/register");
    } else {
      const checkPass = await bcrypt.compare(password, user.password);

      if (checkPass) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JSONPRIVATEKEY
        );

        req.session.token = token;

        console.log("User Login Successfully...", user);
        req.flash("loginSuc", "Login Successfull.");
        req.flash("loginSucIcon", "🔑");
        req.flash(
          "loginSucMsg",
          "You're in! Surprised you remembered your password this time."
        );
        res.redirect("/twitter-clone/home");
      } else {
        console.log("Email or Password must be wrong...");
        res.render("register", {
          isSuccess: "true",
          activeForm: "login",
          registerSuc: "Invalid Credentials.",
          registerSucIcon: "❌",
          registerSucMsg: "Your email or password seems off. Try again!",
        });
      }
    }
  } catch (err) {
    console.log("Internal Server ", err);
    res.render("register", {
      isSuccess: "false",
      activeForm: "login",
      registerSuc: "Server Error.",
      registerSucIcon: "⚠️",
      registerSucMsg: "Something went wrong. Please try again.",
    });
  }
};

const logout = (req, res) => {

  req.session.destroy((err) => {
    if (err) console.log(err);
    if (!err) console.log("Logout Successfully...");

    res.redirect("/twitter-clone/user/register");
  });
};

module.exports = { signUp, register, login, logout };
