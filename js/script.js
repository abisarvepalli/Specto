// Variables
var video, button, mobile_input, number_field, spinner;
var attempts_avail = 3;

var times = 0;

var creditcardnumber, month, year, first_name, last_name;

function verifyIdentity() {                        
    // VERIFY
    var cardnumber = document.getElementById("number_field").value;  
    if (!(cardnumber === "")) {
        if(attempts_avail > 0) {     
            // alert("Attempting to Take Picture");        

            var canvas = document.createElement("canvas");                

            canvas.setAttribute('width', video.offsetWidth);
            canvas.setAttribute('height', video.offsetHeight);            
            
            var context = canvas.getContext('2d');

            var image = video;
            var data, base64;
            
            context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
            data = canvas.toDataURL();
            base64 = data.substring(data.indexOf(",")+1, data.length);       

            button.style.display = "none";
            spinner.style.display = "block";           

            // alert(number_field.value);

            var verified = verifyId(base64, creditcardnumber);      
            if(!verified) {
                attempts_avail--;
                console.log(attempts_avail);       

                if (attempts_avail == 0) {
                    button.disabled = true;
                    button.src = "img/error_icon.png";
                }

                number_field.value = "";
            } else {
                attempts_avail = 3;                
            }
        } else { // ran out of attempts
            alert("Please consult cash register.");

            /* SEND TEXT TO INDIVIDUAL */
            var twilio = require('twilio');
            var cliet = twilio('AC83417804762ea12e0846e4b821066844', '74a8e8571a5a7d9857969ebf9d423084');
            
            client.sendMessage({
                to: '14084580997',
                from: '14085604220',
                body: 'Alert on credit account ' + creditNum
            });
        }
    } else { // Card number not entered
        alert("Please swipe credit card");
    }
}

// document.addEventListener('keypress', function(e) {
//     if (e.which == 32) {
//         location.reload();
//     }
// });

document.addEventListener( "DOMContentLoaded", startup, false );
function startup() {
    video = document.getElementById("video_element");
    button = document.getElementById("camera_button");

    number_field = document.getElementById("number_field");  

    number_field.addEventListener('keypress', function(e) { // Event Listener
        if(e.which == 13) {
            times++;
            if (times!=0 && times%2==0) {
                creditcardnumber = number_field.value.substr(2, 15);
                number_field.value = creditcardnumber;  
                
                verifyIdentity();          
            }
        }               
    });

    spinner = document.getElementById("spinner");

    navigator.getUserMedia = (navigator.getUserMedia || 
        navigator.webkitGetUserMedia || 
        navigator.mozGetUserMedia || 
        navigator.msGetUserMedia || 
        navigator.oGetUserMedia ||
        navigator.mediaDevices.getUserMedia);

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, handleVideo,
         function(error) {
            window.alert(error.message);
         });    
    }
}

function handleVideo(stream) {             
    video.src = window.URL.createObjectURL(stream); 
    
    // Check In Button ActionListener
    button.onclick = verifyIdentity();
}