//import NodeCache from "node-cache";
const rateLimit = require("express-rate-limit");
// const isIp = require("is-ip");
// const requestIP = require("request-ip");

// /**
//  * @constant TIME_FRAME_IN_S - is a constant variable that will determine the period over
//  * which your application will average the user’s timestamps.
//  * Increasing the period will increase the cache size, hence consume more memory
//  */
// const TIME_FRAME_IN_S = 10;
// /**
//  * @constant TIME_FRAME_IN_MS - The TIME_FRAME_IN_MS constant variable will also
//  * determine the period of time your application will average user’s timestamps,
//  * but in milliseconds
//  */
// const TIME_FRAME_IN_MS = TIME_FRAME_IN_S * 1000;

// /**
//  * @constant MS_TO_S - MS_TO_S is the conversion factor you will use to convert
//  * time in milliseconds to seconds.
//  */
// const MS_TO_S = 1 / 1000;

// /**
//  * @constant RPS_LIMIT - The RPS_LIMIT variable is the threshold limit of the
//  * application that will trigger the rate limiter, and change the value as per
//  * your application’s requirements - The value 2 in the RPS_LIMIT variable is
//  * a moderate value that will trigger during the development phase
//  */
// const RPS_LIMIT = 2;

// const ipMiddleware = async function (req: any, res: any, next: any) {
//   let clientIP: any = requestIP.getClientIp(req);
//   if (isIp.v6(clientIP)) {
//     clientIP = clientIP.split(":").splice(0, 4).join(":") + "::/64";
//   }
//   updateCache(clientIP);
//   const IPArray: any = IPCache.get(clientIP);
//   if (IPArray.length > 1) {
//     const rps =
//       IPArray.length / ((IPArray[IPArray.length - 1] - IPArray[0]) * MS_TO_S);
//     if (rps > RPS_LIMIT) {
//       console.log("You are hitting limit", clientIP);
//     }
//   }
//   next();
// };

// /**
//  * @var IPCache -
//  * stdTTL: The interval in seconds after which a key-value pair of cache elements will be
//  * evicted from the cache. TTL stands for Time To Live, and is a measure of time after which cache expires.
//  * deleteOnExpire: Set to false as you will write a custom callback function to handle the expired event.
//  * checkperiod: The interval in seconds after which an automatic check for expired elements is triggered.
//  * The default value is 600, and as your application’s element expiry is set to a lesser value, the check
//  *  for expiry will also happen sooner.
//  */
// const IPCache = new NodeCache({
//   stdTTL: TIME_FRAME_IN_S,
//   deleteOnExpire: false,
//   checkperiod: TIME_FRAME_IN_S,
// });
// IPCache.on("expired", (key, value) => {
//   let newDate: any = new Date();
//   if (newDate - value[value.length - 1] > TIME_FRAME_IN_MS) {
//     IPCache.del(key);
//   } else {
//     const updatedValue = value.filter(function (element: any) {
//       let nDate: any = new Date();
//       return nDate - element < TIME_FRAME_IN_MS;
//     });
//     let nDate: any = new Date();
//     IPCache.set(
//       key,
//       updatedValue,
//       TIME_FRAME_IN_S - (nDate - updatedValue[0]) * MS_TO_S
//     );
//   }
// });

// /**
//  *
//  * @param ip
//  *
//  * The first line in the function gets the array of timestamps for the given IP address, or if null, initializes
//  * with an empty array. In the following line, you are pushing the present timestamp caught by the new Date()
//  * function into the array. The .set() function provided by node-cache takes three arguments: key, value
//  * and the TTL. This TTL will override the standard TTL set by replacing the value of stdTTL from the
//  *  IPCache variable. If the IP address already exists in the cache, you will use the existing TTL; else,
//  * you will set TTL as TIME_FRAME_IN_S.
//  * The TTL for the current key-value pair is calculated by subtracting the present timestamp from the expiry
//  * timestamp. The difference is then converted to seconds and passed as the third argument to the .set()
//  * function. The .getTtl() function takes a key and IP address as an argument and returns the TTL of the
//  * key-value pair as a timestamp. If the IP address does not exist in the cache, it will return undefined
//  * and use the fallback value of TIME_FRAME_IN_S.
//  */
// const updateCache = (ip: any) => {
//   let IPArray: any = IPCache.get(ip) || [];
//   IPArray.push(new Date());
//   let foundIP: any = IPCache.getTtl(ip) || 0;
//   IPCache.set(ip, IPArray, (foundIP - Date.now()) * MS_TO_S || TIME_FRAME_IN_S);
// };

/**
 * source: https://www.digitalocean.com/community/tutorials/how-to-build-a-rate-limiter-with-node-js-on-app-platform
 */

// express rate limiter

// Define your rate limit options
export const limiter = rateLimit({
  windowMs: 0.2 * 60 * 1000, // 30 secs
  max: 15, // Max requests per IP within the windowMs
  handler: (req: any, res: any) => {
    res.status(429).json({
      message: {
        error: "Too many requests, please try again later.",
      },
    });
  },
});
