// Variables
var video, button, mobile_input, number_field, spinner;
var attempts_avail = 3;

var creditcardnumber, month, year, first_name, last_name;

document.addEventListener( "DOMContentLoaded", startup, false );
function startup() {
    video = document.getElementById("video_element");
    button = document.getElementById("camera_button");

    number_field = document.getElementById("number_field");

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
    button.onclick = function() {                        
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

                var verified = verifyId(base64, number_field.value);      
                if(!verified) {
                    attempts_avail--;
                    console.log(attempts_avail);       

                    if (attempts_avail == 0) {
                        button.disabled = true;
                        button.src = "img/error_icon.png";
                    }
                }      
            } else { // ran out of attempts
                alert("Please consult cash register.");

                /* SEND TEXT TO INDIVIDUAL */
                
            }
        } else { // Card number not entered
            alert("Please swipe credit card");
        }
    };

    function isValid(creditNum) {
        for(var i = creditNum.length - 1; i >= 0; i -= 2) {
            var num = creditNum[i].parseInt();
            creditNum[i] = (num * 2) + "";		
        }

        var sum = 0;

        for(var x = 0; x < creditNum.length; x++) {
            sum += creditNum[x].parseInt();
        }

        var checkDigit = (sum * 9 + "")[-1];
        sum += checkDigit.parseInt();
        
        if(sum % 10 == 0) {
            return true;
        }
        return false;
    }


    /*
     * Credit Card Parser
     */
    document.onkeydown = function(e) {
        
    }
}