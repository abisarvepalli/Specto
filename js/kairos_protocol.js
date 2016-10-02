const vappid = "ae47a948", 
    vappkey = "6a9aa59710e71363632f66eac6ce5fa1";

const default_number = "4231567890";

// Kairos Protocol
function enrollId(base64_string, number) {
    /* CHANGE UPON DEPLOYMENT */    
    if (number == undefined) {
        number = default_number;
    }    

    var request = new XMLHttpRequest();  
    request.open('POST', 'https://api.kairos.com/enroll', true);
    request.setRequestHeader("app_id", vappid);
    request.setRequestHeader("app_key", vappkey);

    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes; 
    var dateString = (date.getMonth()+1)+"l"+date.getDate()+"l"+date.getYear()+"j"+hours+"oo"+minutes+"oo"+date.getMilliseconds()+ampm;

    var params = "{\"image\":\"" + base64_string + "\",\"subject_id\":\"" + dateString + "\",\"gallery_name\":\""+number+"\"}";

    // ActionListener
    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        console.log('Status:', this.status);
        console.log('Headers:', this.getAllResponseHeaders());
        console.log('Body:', (this.responseText));

        var button = document.getElementById("camera_button");
        button.className = "center";
        button.src = "img/success_icon.png";        
      }
    }; 

    request.send(params); // Call POST Method on HTTP Request
}

function verifyId(base64_string, number) {
    /*CHANGE TO CONNECT TO MCONNECT DB*/
    if (number == undefined) {
        number = default_number;
    } else {
        alert(number);
    }
    
    var request = new XMLHttpRequest();
    request.open('POST', 'https://api.kairos.com/recognize', true);
    request.setRequestHeader('app_id', vappid);
    request.setRequestHeader('app_key', vappkey);    

    var params = "{ \"image\":\""+base64_string+"\", \"gallery_name\":\""+number+"\" }";

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);                    

            var json = JSON.parse(this.responseText); 

            // Reset Loader Graphics
            document.getElementById("spinner").style.display = "none";                  
            
            if(json["Errors"] == null) {
                var trans_status = JSON.parse(this.responseText)["images"][0]["transaction"]["status"];
                if (trans_status == "success") {                
                    console.log(JSON.parse(this.responseText)["images"][0]["transaction"]["confidence"]);                    
                    
                    var confidence = Math.round(parseFloat(JSON.parse(this.responseText)["images"][0]["transaction"]["confidence"])*100*100)/100;                
                    if (confidence > 75) {
                        // Success Graphics
                        document.getElementById("camera_button").src = "img/success_icon.png";
                        document.getElementById("camera_button").disabled = true;
                        document.getElementById("camera_button").style.display = '';
                        document.getElementById("camera_button").className = "center";                        

                        alert("Verified your identity with " + confidence + "% confidence");                        
                        if (confidence < 90) {
                            enrollId(base64_string, number);
                        }                        
                        return true;
                    } else {
                        alert("Cannot verify your identity.");

                        // Unsuccessful Graphics
                        document.getElementById("camera_button").src = "img/camera_icon.png";
                        document.getElementById("camera_button").disabled = false;
                        document.getElementById("camera_button").style.display = '';
                        document.getElementById("button_frame").className = "center";                    

                        /* SEND UNSUCCESSFUL MESSAGE */                    
                        return false;
                    }         
                } else {                                
                    document.getElementById("camera_button").className = "center";
                    document.getElementById("camera_button").src = "img/error_icon.png";
                    document.getElementById("camera_button").disabled = false;
                    document.getElementById("camera_button").style.display = '';
                    document.getElementById("button_frame").className = "center";

                    alert("Cannot verify your identity");   

                    document.getElementById("camera_button").src = "img/camera_icon.png";

                    /* REDIRECT TO UNSUCCESSFUL PAGE */
                    return false;
                }
            } else { // faces not found
                document.getElementById("camera_button").src = "img/error_icon.png";
                document.getElementById("camera_button").disabled = false;
                document.getElementById("camera_button").style.display = '';
                document.getElementById("button_frame").className = "center";

                alert("Please try again, making sure your face is clear of any obstructions");

                document.getElementById("camera_button").src = "img/camera_icon.png";
            }
        }
    }
    request.send(params);
}