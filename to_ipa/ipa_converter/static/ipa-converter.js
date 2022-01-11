var langInput = document.getElementById('language-input')

var watch = function() {
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    }  
}();

function cleanWord(word) {
    const punctuation = [".", "?", '"', ",", "!", ":", "(", ")", "[", "]"];
    for (let i = 0; i < punctuation.length; i++) {
        word = word.replace(punctuation[i], "");
    }
    return word.toLowerCase();
}

async function convert(text) {
    const words = text.split(" ");
    let ipaOutput = "";
    for (let i = 0; i < words.length; i++) {
        if (words[i].length > 0) {
            ipaOutput += await fetchData(words[i])
            if (i < words.length - 1) {
                ipaOutput += " ";
            }
        }
    }
    if (langInput.value != "") {
        document.getElementById('ipa-output').value = "[" + ipaOutput + "]";
    } else {
        document.getElementById('ipa-output').value = "";
    }
}

async function fetchData(word) {
    let output = "";
    try {
        const response = await fetch(`http://127.0.0.1:8000/broad-ipa-api/${cleanWord(word)}`);
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

langInput.onkeyup = (event) => {
    if (event.code === "Space") {
        convert(langInput.value);
    }
    else if (langInput.value == "") {
        document.getElementById('ipa-output').value = "";
    }
    else {
        watch(function () {
            convert(langInput.value);
        }, 300);
    }
};

/*Make Narrow IPA disabled when certain languages are selected
Make mobile version
Text resizing
Be able to select one of several transcriptions
*/