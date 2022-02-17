import {getSpanishIPA} from "./spanish.js";


const langInput = document.getElementById("language-input");
const langSelection = document.getElementById("lang-select");
const ipaSelection = document.getElementById("ipa-select");
const narrowSelect = document.getElementById("narrow");
const textboxes = document.getElementById("textboxes");
const outputBox = document.getElementById("ipa-output");

let adjustDisplay = () => {
    //If large screen
    if (window.matchMedia("(min-width: 1025px)").matches) {
        textboxes.className = "input-group";
        langInput.setAttribute("rows", "6");
        outputBox.setAttribute("rows", "6");
    } else {
        textboxes.className = "";
        langInput.setAttribute("rows", "4");
        outputBox.setAttribute("rows", "4");
    }
}

window.addEventListener("resize", adjustDisplay);
//Call initially
adjustDisplay();

let convertToIPA = async (text) => {
    let ipaOutput = "";
    if (langSelection.value === "english") {
        const ipaAPI = ipaSelection.value === "broad" ? "broad-ipa-api" : "narrow-ipa-api";
        const response = await fetch(`http://127.0.0.1:8000/${ipaAPI}?text=${text}`);
        const transcription = await response.json();
        ipaOutput = transcription["transcription"];
    } else {
        ipaOutput = convertSpanishToIPA(text, (ipaSelection.value === "narrow"));
    }
    if (langInput.value !== "") {
        outputBox.value = ipaOutput;
    } else {
        outputBox.value = "";
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

let convertSpanishToIPA = (text, isNarrow) => {
    const words = text.split(" ");
    let ipaOutput = "";
    for (let i = 0; i < words.length; i++) {
        ipaOutput += getSpanishIPA(cleanWord(words[i]), isNarrow);
        if (i !== words.length - 1) {
            ipaOutput += " ";
        }
    }
    return "[" + ipaOutput + "]";
}

//Events 
langInput.onkeyup = (event) => {
    if (event.code === "Space") {
        convertToIPA(langInput.value);
    } else if (langInput.value === "") {
        outputBox.value = "";
    } else {
        watch(function () {
            convertToIPA(langInput.value);
        }, 300);
    }
};

ipaSelection.onchange = () => {
    if (langInput.value !== "") {
        convertToIPA(langInput.value);
    }
}

langSelection.onchange = () => {
    narrowSelect.setAttribute("disabled", "disabled");
    if (langSelection.value === "english" || langSelection.value === "spanish") {
        narrowSelect.removeAttribute("disabled");
    }
    convertToIPA(langInput.value)
}