const { check } = require('express-validator');

module.exports = {
  // Methods for validating data
  addData: [
    check('temperature')
      .not()
      .isEmpty()
      .withMessage('Please input zipcode')
      .isDecimal(),
    check('date').not().isEmpty().withMessage('Date must not be empty'),
    check('userResponse')
      .not()
      .isEmpty()
      .withMessage('Please provide a status'),
  ],
  urlData: [
    check('zipCode')
      .not()
      .isEmpty()
      .withMessage('Zipcode must not be empty')
      .isNumeric(),
  ],
};
