const express = require('express');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
const { ReservationInfo, Product } = require('../models');

router.get('/:productId', isLoggedIn, async (req, res, next) => {
  const exReservations = await ReservationInfo.findAll({
    where: {
      reservation_email_id: req.user.id,
      product_id: req.params.productId,
      cancel_flag: 0,
    },
  });
  if (!exReservations) {
    return res.status(400).redirect('/');
  }
  for (const reservation of exReservations) {
    // 정확한걸 집어야 함
    if (new Date(reservation.reservation_date) < new Date()) {
      const toReviewProduct = await Product.findOne({
        where: {
          id: reservation.product_id,
        },
      });
      // reservationId없이
      return res.render('reviewWrite', {
        description: toReviewProduct.description,
        reservationId: reservation.id,
      });
    }
  }
  res.status(400).redirect('/');
});

module.exports = router;
