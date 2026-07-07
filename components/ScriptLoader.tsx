"use client";

import Script from "next/script";

/**
 * ScriptLoader Component
 * Loads jQuery, Bootstrap, and form validation scripts
 * Must be a Client Component to use event handlers
 * 
 * Load order is critical:
 * 1. jQuery (required by Bootstrap and form_validations.js)
 * 2. Bootstrap JS (depends on jQuery)
 * 3. SweetAlert2 (for alert management)
 * 4. Form validations (depends on jQuery and SweetAlert2)
 */
export function ScriptLoader() {
  return (
    <>
      {/* jQuery - must load first */}
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("✓ jQuery loaded successfully");
        }}
        onError={() => {
          console.error("✗ Failed to load jQuery");
        }}
      />

      {/* Bootstrap JS - depends on jQuery */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("✓ Bootstrap loaded successfully");
        }}
        onError={() => {
          console.error("✗ Failed to load Bootstrap");
        }}
      />

      {/* SweetAlert2 - for alert management */}
      <Script
        src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("✓ SweetAlert2 loaded successfully");
        }}
        onError={() => {
          console.error("✗ Failed to load SweetAlert2");
        }}
      />

      {/* Form validation script - depends on jQuery, Bootstrap, and SweetAlert2 */}
      <Script
        src="https://www.cardora.ca/wp-content/themes/zopdealer/js/form_validations.js?ver=1.0.6"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("✓ Form validation script loaded successfully");
        }}
        onError={() => {
          console.error("✗ Failed to load form validation script");
        }}
      />
    </>
  );
}
