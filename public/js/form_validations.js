const ALLOWED_IFRAME_ORIGIN = "https://cardora.zopsoftware.com";

$( document ).ready(function() {

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
    
    window.addEventListener("message", function(event) {

        if (typeof global_properties != "undefined") {
            if (event.origin !== ALLOWED_IFRAME_ORIGIN) {
                return;
            }
        }

        console.log(event);

        switch (event.data) {
            case 'alertFire':
                alert.fire();
                console.log('alertFire');
                break;
            case 'alertSuccessUpdate':
                console.log('alertSuccessUpdate');
                 alert.update({
                    title: 'Thank You! \n Your request has been sent.',
                    icon: "success",
                }); 
                break;
            case 'redirectToThankYouPage':
                console.log('redirectToThankYouPage');
                window.location.href = window.location.origin + '/thank-you';
                break;
            case 'alertErrorUpdate':
                console.log('alertErrorUpdate');
                alert.update({
                    title: 'There were errors in submitting the form.',
                    icon: "error",
                });
                break;
            case 'alertClose':
                console.log('alertClose');
                wait(1500);
                alert.close();
                break;
            case 'singleCreditApplicationHeight':
                console.log('singleCreditApplicationHeight')
                break;
			case 'redirectToDocumentPage':
                window.location.href = window.location.origin + '/thank-you/info';
                break;
			case 'redirectToAppointmentPage':
                window.location.href = window.location.origin + '/thank-you/appointment';
                break;
			case 'redirectToAlternateThankYouPage':
                window.location.href = window.location.origin + '/thank-you/complete-verification';
                break;
			case 'redirectToCompleteTradeInMyCarByVehiclePage':
                window.location.href = window.location.origin + '/trade-in-my-car/vehicle';
                break;
				
			case 'redirectToCompleteTradeInMyCarByVINPage':
                window.location.href = window.location.origin + '/trade-in-my-car/vin';
                break;
				
			case 'redirectToThankYouPageForFinance':
                window.location.href = window.location.origin + '/thank-you-finance';
                break;
				
			case 'redirectToBookAnAppointment':
			case 'redirectToBookAnAppointmentPage':
                window.location.href = window.location.origin + '/schedule-an-appointment-with-expert/';
                break;
				
			case 'redirectToTradeInPage':
                window.location.href = window.location.origin + '/trade-in-my-car/';
                break; 
				
			case 'redirectToThankYouPageForTradeInPage':
                window.location.href = window.location.origin + '/thank-you-trade-in/';
                break; 
				
				
            default:
                break;
        }

        if(event.data.hasOwnProperty("type")){
            if(event.data.type == "css"){
                $(`#${event.data.element_id}`).css("min-height", parseInt(event.data.value) + 180);
            }
        }

         
    });


});

document.addEventListener("DOMContentLoaded", function () {
  // Select your iframe
  const iframe = document.querySelector("iframe");

  if (iframe) {
    // Get current page params
    const params = window.location.search;

    // Get current iframe src (base link)
    const iframeSrc = iframe.getAttribute("src");

    // Check if iframe already has parameters
    const separator = iframeSrc.includes("?") ? "&" : "?";

    // Update iframe URL with main page params
    iframe.src = iframeSrc + separator + params.substring(1);
  }
});