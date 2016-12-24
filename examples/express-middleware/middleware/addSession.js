module.exports = () => {
  return (req,res,next) => {
    req.sessValue = "casa1234";
    next();
  }
}
