module.exports = () => {
  let counter = 0;
  return (req,res,next) => {
    counter++;
    req.counter = counter;
    next();
  }
}
