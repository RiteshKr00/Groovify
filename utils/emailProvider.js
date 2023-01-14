const resetPasswordOption = (email, token) => {
  return (data = {
    to: email,
    from: process.env.USER_EMAIL,
    subject: "Reset Password",
    htmlBody: `
            <p>You requested for password reset</p>
            <h5>Click on this <a href="${process.env.Base_Url}/resetpassword/${token}">link</a> to reset password</h5>
            `,
  });
};
module.exports = resetPasswordOption;
