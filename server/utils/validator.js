module.exports = { validateParam };

function validateParam(param) {
  return function (req, res, next) {
    const value = req.params[param];

    if (!value) {
      return res.status(400).send(`Param ${param} is required`);
    }

    next();
  }
}