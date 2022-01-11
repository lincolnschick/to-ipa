//Global variables
const langInput = document.getElementById("language-input");
const langSelection = document.getElementById("lang-select");
const ipaSelection = document.getElementById("ipa-select");

//API functions
let cleanWord = (word) => {
    const punctuation = [".", "?", '"', ",", "!", ":", "(", ")", "[", "]"];
    for (let i = 0; i < punctuation.length; i++) {
        word = word.replace(punctuation[i], "");
    }
    return word.toLowerCase();
}

let fetchData = async (word) => {
    let output = "";
    try {
        const ipaAPI = ipaSelection.value === "broad" ? "broad-ipa-api" : "narrow-ipa-api";

        const response = await fetch(`http://127.0.0.1:8000/${ipaAPI}/${cleanWord(word)}`);
        const transcriptions = await response.json();
        output = transcriptions["transcription1"];
        const list_of_transcriptions = [
            transcriptions["transcription2"],
            transcriptions["transcription3"],
            transcriptions["transcription4"],
        ];
        
        for (let transcription of list_of_transcriptions) {
            if (transcription.length > 0) {
                output += "/" + transcription;
            }
        }
        return output;
    } catch (error) {
        return '("' + word + '")';
    }
}

let convert = async (text) => {
    const words = text.split(" ");
    let ipaOutput = "";
    if (langSelection.value === "english") {
        for (let i = 0; i < words.length; i++) {
            if (words[i].length > 0) {
                ipaOutput += await fetchData(words[i])
                if (i < words.length - 1) {
                    ipaOutput += " ";
                }
            }
        }
    } else if (langSelection.value === "spanish") {

    } else {

    }
    if (langInput.value !== "") {
        document.getElementById('ipa-output').value = "[" + ipaOutput + "]";
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