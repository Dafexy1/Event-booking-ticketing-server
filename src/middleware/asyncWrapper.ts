/**
 * This method helps to catch any error related to any routes to avoid server breakdown error
 */
export default (wrapFunction: any) => async (request: any, response: any, next: any) => {
    try {
      await wrapFunction(request, response, next);
    } catch (error) {
      return next(error);
    }
  };
  