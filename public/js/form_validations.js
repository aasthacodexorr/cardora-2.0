const ALLOWED_IFRAME_ORIGIN = "https://cardora.zopsoftware.com";

$(document).ready(function () {

    function wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    alert = Swal.mixin({
        showConfirmButton: false,
        timerProgressBar: true,
        confirmButtonText: "",
        title: "Sending your request...",
        onBeforeOpen: () => {
            alert.showLoading();
        },
    });

    window.addEventListener("message", function (event) {

        if (typeof global_properties != "undefined") {
            if (event.origin !== ALLOWED_IFRAME_ORIGIN) {
                return;
            }
        }

        console.log(event);

        switch (event.data) {
            case "alertFire":
                alert.fire();
                console.log("alertFire");
                break;

            case "alertSuccessUpdate":
                console.log("alertSuccessUpdate");
                alert.update({
                    title: "Thank You! \n Your request has been sent.",
                    icon: "success",
                });
                break;

            case "redirectToThankYouPage":
                console.log("redirectToThankYouPage");
                window.location.href =
                    window.location.origin + "/thank-you";
                break;

            case "alertErrorUpdate":
                console.log("alertErrorUpdate");
                alert.update({
                    title: "There were errors in submitting the form.",
                    icon: "error",
                });
                break;

            case "alertClose":
                console.log("alertClose");
                wait(1500);
                alert.close();
                break;

            case "singleCreditApplicationHeight":
                console.log("singleCreditApplicationHeight");
                break;

            case "redirectToDocumentPage":
                window.location.href =
                    window.location.origin + "/thank-you/info";
                break;

            case "redirectToAppointmentPage":
                window.location.href =
                    window.location.origin + "/thank-you/appointment";
                break;

            case "redirectToAlternateThankYouPage":
                window.location.href =
                    window.location.origin + "/thank-you/complete-verification";
                break;

            case "redirectToCompleteTradeInMyCarByVehiclePage":
                window.location.href =
                    window.location.origin + "/trade-in-my-car/vehicle";
                break;

            case "redirectToCompleteTradeInMyCarByVINPage":
                window.location.href =
                    window.location.origin + "/trade-in-my-car/vin";
                break;

            case "redirectToThankYouPageForFinance":
                window.location.href =
                    window.location.origin + "/thank-you-finance";
                break;

            case "redirectToBookAnAppointment":
            case "redirectToBookAnAppointmentPage":
                window.location.href =
                    window.location.origin +
                    "/schedule-an-appointment-with-expert/";
                break;

            case "redirectToTradeInPage":
                window.location.href =
                    window.location.origin + "/trade-in-my-car/";
                break;

            case "redirectToThankYouPageForTradeInPage":
                window.location.href =
                    window.location.origin + "/thank-you-trade-in/";
                break;

            default:
                break;
        }

        if (
            event.data &&
            typeof event.data === "object" &&
            event.data.hasOwnProperty("type")
        ) {
            if (event.data.type === "css") {
                $(`#${event.data.element_id}`).css(
                    "min-height",
                    parseInt(event.data.value) + 180
                );
            }
        }
    });
});


/*
 * ------------------------------------------------------------
 * Forward parent page query parameters to all iframes
 * ------------------------------------------------------------
 *
 * Example:
 *
 * Parent page:
 * /finance?inventory_id=3003
 *
 * Iframe:
 * https://cardora.zopsoftware.com/...?
 *
 * Becomes:
 * https://cardora.zopsoftware.com/...?
 * inventory_id=3003
 *
 * This works for:
 * 1. Iframes already present when the script loads
 * 2. Iframes added later by React / Next.js
 * 3. Iframes rendered after DOMContentLoaded
 */

(function () {

    function updateIframe(iframe) {

        if (!iframe) {
            return;
        }

        const pageParams = new URLSearchParams(
            window.location.search
        );

        if (!pageParams.toString()) {
            return;
        }

        const iframeSrc = iframe.getAttribute("src");

        if (!iframeSrc) {
            return;
        }

        const iframeUrl = new URL(
            iframeSrc,
            window.location.origin
        );

        let changed = false;

        pageParams.forEach(function (value, key) {

            /*
             * Use set() instead of append().
             *
             * This prevents duplicate parameters and makes the
             * parent page parameter the source of truth.
             */
            if (iframeUrl.searchParams.get(key) !== value) {
                iframeUrl.searchParams.set(key, value);
                changed = true;
            }
        });

        if (changed) {

            const newSrc = iframeUrl.toString();

            /*
             * Only update the iframe if the URL actually changed.
             */
            if (newSrc !== iframe.src) {
                iframe.src = newSrc;
            }
        }
    }
    function processExistingIframes() {

        document
            .querySelectorAll("iframe")
            .forEach(function (iframe) {
                updateIframe(iframe);
            });
    }
    function initIframeQueryParams() {
        /*
         * Process iframes that already exist.
         */
        processExistingIframes();
        /*
         * Watch for iframes that React / Next.js adds later.
         */
        const observer = new MutationObserver(
            function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {

                        if (
                            node.nodeType !==
                            Node.ELEMENT_NODE
                        ) {
                            return;
                        }

                        const element = node;
                        /*
                         * The added element itself is an iframe.
                         */
                        if (
                            element.tagName ===
                            "IFRAME"
                        ) {
                            updateIframe(element);
                        }


                        /*
                         * The added element contains one or
                         * more iframes.
                         */
                        if (
                            element.querySelectorAll
                        ) {
                            element
                                .querySelectorAll("iframe")
                                .forEach(function (iframe) {
                                    updateIframe(iframe);
                                });
                        }

                    });

                });

            }
        );
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }


    /*
     * If DOM is still loading, wait for it.
     *
     * Otherwise initialize immediately.
     */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initIframeQueryParams
        );

    } else {

        initIframeQueryParams();

    }

})();
