const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // límite de peticiones por IP
  message: "Has excedido el límite de solicitudes.",
});

module.exports = limiter;
