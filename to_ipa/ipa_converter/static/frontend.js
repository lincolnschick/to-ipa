//Global variables
const langInput = document.getElementById("language-input");
const langSelection = document.getElementById("lang-select");
const ipaSelection = document.getElementById("ipa-select");

//API functions

let convert = async (text) => {
    const words = text.split(" ");
    let ipaOutput = "";
    if (langSelection.value === "english") {
        const ipaAPI = ipaSelection.value === "broad" ? "broad-ipa-api" : "narrow-ipa-api";
        const response = await fetch(`http://127.0.0.1:8000/${ipaAPI}?text=${text}`);
        const transcription = await response.json();
        ipaOutput = transcription["transcription"];
    } else if (langSelection.value === "spanish") {

    } else {

    }
    if (langInput.value !== "") {
        document.getElementById('ipa-output').value = ipaOutput;
    } else {
        document.getElementById('ipa-output').value = "";
    }
}

var watch = function() {
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    }  
}();


//Events 
langInput.onkeyup = (event) => {
    if (event.code === "Space") {
        
        convert(langInput.value);
    }
    else if (langInput.value === "") {
        document.getElementById('ipa-output').value = "";
    }
    else {
        watch(function () {
            convert(langInput.value);
        }, 300);
    }
};

ipaSelection.onchange = () => {
    if (langInput.value !== "") {
        convert(langInput.value);
    }
}