const { check } = require('express-validator');

module.exports = {
  // Methods for validating data
  setData: [
    check('city').not().isEmpty().withMessage('Please input city').isString(),
    check('temperature')
      .not()
      .isEmpty()
      .withMessage('Please input city')
      .isDecimal(),
    check('date').not().isEmpty().withMessage('Date must not be empty'),
    check('userResponse')
      .not()
      .isEmpty()
      .withMessage('Please provide a status'),
  ],
  urlData: [
    check('city')
      .not()
      .isEmpty()
      .withMessage('City must not be empty')
      .isString(),
  ],
};
