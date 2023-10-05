const User = require("../model/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const cookies = req.cookies;
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Usernama and password are requireed" });
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorised

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWT
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: "30s" }
    );
    // Saving refreshToken with current user
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt)
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: false,
      }); // secure:true - only serves on http

    const result = await User.findOneAndUpdate(foundUser, {
      refreshToken: [...newRefreshTokenArray,newRefreshToken]
    });

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    }); // secure: true kad se radi na sajtu
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
