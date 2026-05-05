// todos 
// u have to set up a class to capture the error 
// stack and send it to frontend 

// api error par kaam karan hai 
// try and catch sa replace async handler 
// middle ware 

//todos
//u have to setup a class to capture the error stack and send it to frontend
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message); // sets this.message
    this.statusCode = statusCode;
    this.success = false;

    // captures the stack trace excluding the constructor call itself
    // makes stack traces cleaner and easier to debug
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;