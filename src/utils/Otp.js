export const generateOTP = (length) => {
    const RandomNumber = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        const number = Math.floor(Math.random() * RandomNumber.length);
        const randomNumber = number;
        otp += RandomNumber[randomNumber];
    }
    return otp;
}