const express = require("express");

const app = express();
const router = express.Router();
const middleware = require("./middleware");

router.route("/").get([
  middleware.addSession,
  middleware.counter,
  (req,res,next)=> {
    res.send({
      counter: req.counter,
      sessId: req.sessValue,
      data: {
        message:"Hello"
      }
    })
  }
]);

app.use("/",router);

app.listen(3000,() => {
  console.log("Ready to go...");
})
