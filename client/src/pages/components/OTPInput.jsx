import React, { useState, useEffect, useRef } from "react";

const OTPInput = ({isDisabled, setIsDisabled,showToast,setShowToast,successChange,setSuccessChange,code,}) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    useEffect(() => {
        const filled = otp.every((digit) => digit !== "");
        console.log(filled);
        if (!filled) setIsDisabled(true);
        else setIsDisabled(false);
    }, [otp]);

    const handleChange = (index, value) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isDisabled) {
            setShowToast(true);
            return;
        }

        const finalOTP = otp.join("");

        if (otp.every((digit) => digit !== "" && finalOTP == code)) {
            setSuccessChange(1);
        } else {
            setSuccessChange(2);
        }
    };

    return (
        <div className="otp-container">
            <div className="form-header">
                <h2>Email Verification</h2>
            </div>
            <form onSubmit={handleSubmit} className="otp-form">
                <div className="otp-inputs">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                        />
                    ))}
                </div>
                <button type="button" onClick={handleSubmit} className="otp-submit-btn">
                    Verify OTP
                </button>
            </form>
        </div>
    );
};

export default OTPInput;