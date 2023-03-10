const db = require("../models");
var jwt = require("jsonwebtoken");
const {validator, validateBody} = require('../helper/validate');
const Reservation = db.reservation;

const Op = db.Sequelize.Op;

/**
 * Provides all the reservations stored in the db 
 */
exports.readReservations = async (req, res) => {
    Reservation.findAll(
        {
            where: {
                userId: jwt.decode(req.headers["x-access-token"]).id
            }
        }
    )
    .then(reservations => {
            const responseJson = {
                elements:reservations
            }
            res.send(JSON.stringify(responseJson, null, 2))
        }
    );
};

/**
 * Create a new reservation and stores it in the db 
 */
exports.addReservation = async (req, res) => {
    const validationRule = {
        "locationId": "required|integer",
        "date_start": "required|date",
        "date_end": "required|date"
    };

    await validateBody(req.body, res, validationRule,() => {
        Reservation.create({
            locationId: req.body.locationId,
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            userId: jwt.decode(req.headers["x-access-token"]).id,
          })
            .then(reservation => {
                res.send({ message: "Reservation created successfully!" });
            })
            .catch(err => {
              res.status(500).send({ message: err.message });
            });
    });  
};

/**
 * Provides the info of a specifice reservation, by the give id 
 */
exports.readReservation = async (req, res) => {
    const validationRule = {
        "reservationId": "required|integer"
    };

    await validateBody(req.params, res, validationRule,() => {
        Reservation.findOne({
            where: {
                id: req.params.reservationId,
                userId: jwt.decode(req.headers["x-access-token"]).id
            }
        }
        )
        .then(reservation => {
            res.send(JSON.stringify(reservation, null, 2))
        }
        );
    });
    
};

/**
 * Removes a specified reservation from the db, by his id 
 */
exports.deleteReservation = async (req, res) => {
    const validationRule = {
        "reservationId": "required|integer"
    };

    await validateBody(req.params, res, validationRule,() => {
        Reservation.destroy({
            where: {
                id: req.params.reservationId,
                userId: jwt.decode(req.headers["x-access-token"]).id
            }
        }
        )
        .then(reservation => {
            res.send({ message: "Reservation deleted successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    });
};