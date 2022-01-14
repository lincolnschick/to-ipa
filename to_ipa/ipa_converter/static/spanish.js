const vowels = ["a", "e", "i", "o", "u", "y", "á", "é", "í", "ó", "ú"];
const consonants = [
    "b", "c", "h", "d", "f", "g", "j", "k", "l", "m", "n", "ñ", "p", "q", "r", "s", "t", "v", "w", "x", "z", "ʝ", "ʃ"
];
const accents = {"á":"a", "é": "e", "í": "i", "ó": "o", "ú": "u"};
const replacements = {"ñ": "ɲ", "j": "x", "v": "b", "ü": "w", "z": "s"};

let modG = (word, index) => {
    if (index !== lastIndex(word) && ["e", "i", "é", "í"].includes(word[index + 1])) {
        return "x";
    }
    return "g";
}

let modN = (word, index) => {
    if (index !== lastIndex(word)) {
        if (word[index + 1] === "v") {
            return "m";
        } else if (word[index + 1] === "m") {
            return "";
        }
    }
    return "n";
}

let modX = (word, index) => {
    if (word.includes("mex") || word.includes("méx")) {
        return "x";
    }
    return "ks";
}

function lastIndex(word) {
    return (word.length - 1);
}

const replaceFuncs = {"g": modG, "n": modN, "x": modX}

function spanishIPA(word) {
    let replacedWord = ""
    for (let i = 0; i < word.length; i++) {
        if (word[i] === "y") {
            if (i !== lastIndex(word) &&  i !== 0 && consonants.includes(word[i + 1]) && vowels.includes(word[i - 1])) {
                replacedWord += "i";
            }
            else if (i === lastIndex(word) && i !== 0 && vowels.includes(word[i - 1])) {
                replacedWord += "i";
            } else if (word === "y") {
                replacedWord += "i";
            } else {
                replacedWord += "ʝ";
            }
        } else if (word[i] === "h") {
            if (i < lastIndex(word) - 1) {
                if (word[i + 1] === "u" || word[i + 1] === "ú") {
                    if (i === 0 && vowels.includes(word[i + 2])) {
                        replacedWord += "w";
                        i++;
                    } else if (i !== 0 && vowels.includes(word[i - 1]) && vowels.includes(word[i + 2])) {
                        replacedWord += "w";
                        i++;
                    }
                }
                if (word[i + 1] === "i" || word[i + 1] === "í") {
                    if (i === 0 && vowels.includes(word[i + 2])) {
                        replacedWord += "ʝ";
                        i++;
                    } else if (i !== 0 && vowels.includes(word[i - 1] && vowels.includes(word[i + 2]))) {
                        replacedWord += "ʝ";
                        i++;
                    }
                }
            }
        } else if (word[i] === "c") {
            if (i !== lastIndex(word) && word[i + 1] === "h") {
                replacedWord += "tʃ";
                i++;
            } else if (i !== lastIndex(word) && ["e", "i", "é", "í"].includes(word[i + 1])) {
                replacedWord += "s";
            } else {
                replacedWord += "k";
            }
        } else if (word[i] === "l") {
            if (i !== lastIndex(word) && word[i + 1] === "l") {
                replacedWord += "ʝ";
                i++;
            } else {
                replacedWord += "l";
            }
        } else if (word[i] === "r") {
            if (i == 0) {
                replacedWord += "r"
            } else if (i !== lastIndex(word) && word[i + 1] === "r") {
                replacedWord += "r"
                i++;
            }
            else if (i !== 0 && consonants.includes(word[i - 1])) {
                let replaced = false;
                for (let j = 0; j < i; j++) {
                    if (vowels.includes(word[j])) {
                        replacedWord += "r";
                        replaced = true;
                    }
                }
                if (!replaced) {
                    replacedWord += "ɾ";
                }
            } else {
                replacedWord += "ɾ";
            }
        } else if (word[i] === "q") {
            replacedWord += "k";
            i++;
        } else {
            replacedWord += word[i];
        }
    }
    let ipaOutput = "";
    word = replacedWord;
    for (const accent in accents) {
        word = word.replace(accent, accents[accent])
    }
    for (let i = 0; i < word.length; i++) {
        if (word[i] in replacements) {
            ipaOutput += replacements[word[i]];
        } else if (word[i] in replaceFuncs) {
            ipaOutput += replaceFuncs[word[i]](word, i);
        } else {
            ipaOutput += word[i];
        }
    }
    return ipaOutput;
}

export {vowels, consonants, accents, replaceFuncs, replacements, spanishIPA, lastIndex, modG, modX, modN};