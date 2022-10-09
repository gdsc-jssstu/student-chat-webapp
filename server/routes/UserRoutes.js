// Author: GDSC JSSSTU Core-team
// SPDX-License-Identifier: BSD-2-Clause


module.exports = function(Student, passport) {
  const loginRoute = (req,res) => {
      const student = new Student({
        username: req.body.username,
        password: req.body.password
      });

    req.login(student, function(err){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/chat");
        });
      }
    });
  };

  const logoutRoute = (req,res)=>{
    req.logout(()=>{
      console.log("User logged out");
    });
    res.redirect("/");
  }

  const registerRoute = (req, res) => {
    Student.register({username: req.body.username, email: req.body.email}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/chat");
        });
      }
    });
  };

  return { loginRoute, registerRoute, logoutRoute };
}
