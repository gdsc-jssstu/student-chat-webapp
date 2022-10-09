// Author: GDSC JSSSTU Core-team
// SPDX-License-Identifier: BSD-2-Clause
const passportLocalMongoose = require("passport-local-mongoose");

module.exports = function(mongoose, passport) {
  const studentSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    secret: String
  })

  studentSchema.plugin(passportLocalMongoose);

  const Student = new mongoose.model("Student",studentSchema)

  passport.use(Student.createStrategy());
  passport.serializeUser(Student.serializeUser());
  passport.deserializeUser(Student.deserializeUser());

  return Student;
}
