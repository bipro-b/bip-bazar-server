const axios = require("axios");

exports.sendSMS = async (phoneNumber: string, message: string) => {

    console.log("sendsms")
    // 1. FOR DEVELOPMENT: Just log it to the console
    // if (process.env.NODE_ENV === 'development') {
    //     console.log(`--- [MOCK SMS] ---`);
    //     console.log(`To: ${phoneNumber}`);
    //     console.log(`Message: ${message}`);
    //     console.log(`------------------`);
    //     return true;
    // }

    // 2. FOR PRODUCTION: Example using a Bangladeshi Gateway (e.g., SSLWireless)
    try {
        
        const response = await axios.get('https://smsplus.sslwireless.com/api/v3/send-sms', {
            params: {
                api_token: process.env.SMS_API_TOKEN,
                sid: process.env.SMS_SID,
                msisdn: phoneNumber,
                sms: message,
                csms_id: Date.now()
            }
        });
        return response.data;
        
    } catch (error) {
        console.error("SMS Gateway Error:", error);
        return false;
    }
};