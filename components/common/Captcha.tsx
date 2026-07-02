"use client";

import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";
import React, { useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onVerify: (token: string | null) => void;
  resetTrigger?: boolean;
}

/**
 * Reusable reCAPTCHA v2 Checkbox Component
 * 
 * Props:
 * - onVerify: Callback function that receives the reCAPTCHA token when user completes the challenge
 * - resetTrigger: Boolean that when toggled, resets the reCAPTCHA widget (use after successful form submission)
 * 
 * Usage:
 * const [captchaToken, setCaptchaToken] = useState<string | null>(null);
 * const [resetCaptcha, setResetCaptcha] = useState(false);
 * 
 * <Captcha onVerify={setCaptchaToken} resetTrigger={resetCaptcha} />
 * 
 * Then disable submit button if captchaToken is null
 */
export const Captcha: React.FC<CaptchaProps> = ({ onVerify, resetTrigger = false }) => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Reset the reCAPTCHA widget when resetTrigger changes
  useEffect(() => {
    if (resetTrigger && recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [resetTrigger]);

  const handleCaptchaChange = (token: string | null) => {
    onVerify(token);
  };

  return (
    <div className="flex justify-center ">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={SITE_CONFIG?.recaptchaSiteKey}
        onChange={handleCaptchaChange}
        theme="light"
      />
    </div>
  );
};

export default Captcha;
