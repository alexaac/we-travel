const { check } = require('express-validator');

module.exports = {
  // Methods for validating data
  setData: [
    check('city').not().isEmpty().withMessage('Please input city').isString(),
    check('country')
      .not()
      .isEmpty()
      .withMessage('Please input country')
      .isString(),
    check('temperature')
      .not()
      .isEmpty()
      .withMessage('Please input city')
      .isDecimal(),
    check('date').not().isEmpty().withMessage('Date must not be empty'),
  ],
  urlData: [
    check('city')
      .not()
      .isEmpty()
      .withMessage('City must not be empty')
      .isString(),
  ],
};
