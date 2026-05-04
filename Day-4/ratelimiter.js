import rateLimit from "express-rate-limit";
// console.log(rateLimit);

const message = (action) =>{
    success : false;
    message: `too many ${action} attempts, please try again later`;

}

export const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, //45 days
  max: 2,
  message: message("login"),
});
