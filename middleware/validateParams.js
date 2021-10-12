const { check } = require('express-validator');

module.exports = {
  // Methods for validating data
  setData: [
    check('city').not().isEmpty().withMessage('Please input city').isString(),
    check('cityInfo')
      .not()
      .isEmpty()
      .withMessage('Please input country')
      .isObject(),
    check('temperature')
      .not()
      .isEmpty()
      .withMessage('Please input city')
      .isDecimal(),
    check('startDate').not().isEmpty().withMessage('Date must not be empty'),
    check('endDate').not().isEmpty().withMessage('Date must not be empty'),
    check('tripId')
      .not()
      .isEmpty()
      .withMessage('Trip id must not be empty')
      .isString(),
  ],
  urlData: [
    check('city')
      .not()
      .isEmpty()
      .withMessage('City must not be empty')
      .isString(),
  ],
  tripId: [
    check('tripId')
      .not()
      .isEmpty()
      .withMessage('Trip id must not be empty')
      .isNumeric(),
  ],
};
