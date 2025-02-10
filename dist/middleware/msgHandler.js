"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnMsg = void 0;
/**
 * This method is use to format and structure response data
* @author - Dafe Stanley- <dafestaneleydafe@gmail.com>
 * @param {Object} data - data to return back to the consumer if any
 * @param {string} message - descriptive message for the consumer
 * @param {string} status - message type <success or failed>
 * @param {string} status_code - response code if request failed
 * @returns Object
 */
const returnMsg = (retData, message, status = "success", status_code = 200) => {
    let msg;
    msg = {
        status: status,
        status_code: status_code,
        data: retData,
        message: message
    };
    return msg;
};
exports.returnMsg = returnMsg;
