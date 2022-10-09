const path = require('path');

module.exports = function(){
  const chat = (req, res)=>{
      if(req.isAuthenticated()){
        res.sendFile(path.join(__dirname, "../../views/chat.html"));
      }else{
        res.redirect("/");
      }
  }
  return {chat};
}
