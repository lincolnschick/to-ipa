import {spanishIPA} from "./spanish.js";

//Global variables
const langInput = document.getElementById("language-input");
const langSelection = document.getElementById("lang-select");
const ipaSelection = document.getElementById("ipa-select");
const narrowSelect = document.getElementById("narrow");

//API functions

let convert = async (text) => {
    let ipaOutput = "";
    if (langSelection.value === "english") {
        const ipaAPI = ipaSelection.value === "broad" ? "broad-ipa-api" : "narrow-ipa-api";
        const response = await fetch(`http://127.0.0.1:8000/${ipaAPI}?text=${text}`);
        const transcription = await response.json();
        ipaOutput = transcription["transcription"];
    } else if (langSelection.value === "spanish") {
        ipaOutput = convertSpanish(text, (ipaSelection.value === "narrow"));
    } else {
        ipaOutput = convertPinyin(text);
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
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    }  
}();

let cleanWord = (word) => {
    const punctuation = [".", "?", '"', ",", "!", ":", "(", ")", "[", "]", "¿", "¡"];
    for (let char of punctuation) {
        word = word.replace(char, "");
    }
    return word.toLowerCase();
}

//Spanish conversion

let convertSpanish = (text, is_narrow) => {
    const words = text.split(" ");
    let ipaOutput = "";
    for (let i = 0; i < words.length; i++) {
        ipaOutput += spanishIPA(cleanWord(words[i]), is_narrow);
        if (i !== words.length - 1) {
            ipaOutput += " ";
        }
    }
    return "[" + ipaOutput + "]";
}

//Pinyin conversion
let convertPinyin = (text) => {
    
}

//Events 
langInput.onkeyup = (event) => {
    if (event.code === "Space") {
        
        convert(langInput.value);
    } else if (langInput.value === "") {
        document.getElementById('ipa-output').value = "";
    } else {
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

langSelection.onchange = () => {
    narrowSelect.setAttribute("disabled", "disabled");
    if (langSelection.value === "english" || langSelection.value === "spanish") {
        narrowSelect.removeAttribute("disabled");
    }
    convert(langInput.value)
}