const vowels = ["a", "e", "i", "o", "u", "y", "á", "é", "í", "ó", "ú"];
const consonants = [
    "b", "c", "h", "d", "f", "g", "j", "k", "l", "m", "n", "ñ", "p", "q", "r", "s", "t", "v", "w", "x", "z", "ʝ", "ʃ", "ɾ"
];
const accents = {"á":"a", "é": "e", "í": "i", "ó": "o", "ú": "u"};
const addAccent = {"a": "á", "e": "é", "i": "í", "o": "ó", "u": "ú"};
const replacements = {"ñ": "ɲ", "j": "x", "v": "b", "ü": "w", "z": "s"};
const strong = ["a", "e", "o", "á", "é", "ó"];
const unbreakable = [
    "pr", "br", "pl", "bl", "fr", "fl", "gr", "gl", "kr", "kl", "pɾ", "bɾ", "fɾ", "gɾ", "kɾ", "tl", "dr", "tr", "dɾ", "tɾ", "gw", "tʃ"
];
const voiced_cons = ["b", "d", "g", "l", "m", "n", "r", "ʝ", "ɾ"];


//Helper functions
let isInitial = (ipa, i) => {
    if (i === 0 || i === 1 && [".", "ˈ"].includes(ipa[0])) {
        return true;
    }
    return false;
}

let lastIndex = (word) => {
    return (word.length - 1);
}

let precedesCharInList = (ipa, i, characters) => {
    if (i !== ipa.length - 1 && characters.includes(ipa[i + 1])) {
        return true;
    }
    if (i < ipa.length - 2 && [".", "ˈ"].includes(ipa[i + 1])) {
        if (characters.includes(ipa[i + 2])) {
            return true;
        }
    }
    return false;
}

let followsCharInList = (ipa, i, characters) => {
    if (i !== 0 && characters.includes(ipa[i - 1])) {
        return true;
    }
    if (i > 1 && [".", "ˈ"].includes(ipa[i - 1])) {
        if (characters.includes(ipa[i - 2])) {
            return true;
        }
    }
    return false;
}

let isAlpha = (char) => {
    return ((/[a-zA-Z]/).test(char) || ["ñ", "á", "é", "í", "ó", "ú", "ü"].includes(char));
}

//Functions modifying Spanish characters

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

let modZ = (word) => {
    let length = word.length;
    if (word.slice(-1) === "z" && length > 1 && vowels.includes(word[length - 2])) {
        return (word.slice(0, length - 2) + addAccent[word[length - 2]] + "s");
    }
    return word;
}

let getAllophonesB = (ipa, i) => {
    if (isInitial(ipa, i) || followsCharInList(ipa, i, ["m", "n"])) {
        return "b";
    }
    return "β̞";
}

let getAllophonesD = (ipa, i) => {
    if (isInitial(ipa, i) || followsCharInList(ipa, i, ["m", "n"])) {
        return "d̪";
    }
    return "ð̞";
}

let getAllophonesG = (ipa, i) => {
    if (isInitial(ipa, i) || followsCharInList(ipa, i, ["m", "n"])) {
        return "g";
    }
    return "ɣ̞";
}

let getAllophonesCrosstailJ = (ipa, i) => {
    if (isInitial(ipa, i)) {
        return "ɟʝ";
    }
    return "ʝ";
}

let getAllophonesS = (ipa, i) => {
    if (precedesCharInList(ipa, i, ["d"])) {
        return "z̪";
    }
    if (precedesCharInList(ipa, i, voiced_cons)) {
        return "z";
    }
    if (precedesCharInList(ipa, i, ["t"])) {
        return "s̪";
    }
    return "s";
}

let getAllophonesN = (ipa, i) => {
    if (precedesCharInList(ipa, i, ["t", "d"])) {
        return "n̪";
    }
    if (precedesCharInList(ipa, i, ["g", "k"])) {
        return "ŋ";
    }
    return "n";
}

let getAllophonesI = (ipa, i) => {
    if (precedesCharInList(ipa, i, [".", "ˈ"]) && precedesCharInList(ipa, i, vowels)) {
        return "i";
    }
    if (followsCharInList(ipa, i, [".", "ˈ"]) && followsCharInList(ipa, i, vowels)) {
        return "i";
    }
    if (precedesCharInList(ipa, i, vowels)) {
        return "j";
    }
    return "i";
}

let getAllophonesU = (ipa, i) => {
    if (followsCharInList(ipa, i, [".", "ˈ"]) && followsCharInList(ipa, i, vowels)) {
        return "u";
    }
    if (precedesCharInList(ipa, i, [".", "ˈ"]) && precedesCharInList(ipa, i, vowels)) {
        return "u";
    }
    if (precedesCharInList(ipa, i, vowels)) {
        return "w";
    }
    return "u";
}

let getAllophonesL = (ipa, i) => {
    if (precedesCharInList(ipa, i, ["t", "d"])) {
        return "l̪";
    }
    return "l";
}

let getAllophonesT = (ipa, i) => {
    if (i !== lastIndex(ipa) && ipa[i + 1] === "ʃ") {
        return "t";
    }
    return "t̪";
}

let isNonSyllabic = (ipa, i) => {
    if (!followsCharInList(ipa, i, [".", "ˈ"]) && followsCharInList(ipa, i, vowels)) {
        return true;
    }
    return false;
}

let checkDiphthongs = (ipa) => {
    let ipaOutput = "";
    for (let i = 0; i < ipa.length; i++) {
        if (ipa[i] === "i" && isNonSyllabic(ipa, i)) {
            ipaOutput += "i̯";
        } else if (ipa[i] === "u" && isNonSyllabic(ipa, i)) {
            ipaOutput += "u̯";
        } else {
            ipaOutput += ipa[i];
        }
    }
    return ipaOutput;
}

const allophones = {
    "b": getAllophonesB, 
    "d": getAllophonesD, 
    "g": getAllophonesG, 
    "ʝ": getAllophonesCrosstailJ, 
    "s": getAllophonesS,
    "n": getAllophonesN,
    "i": getAllophonesI,
    "u": getAllophonesU,
    "l": getAllophonesL,
    "t": getAllophonesT
};
const replaceFuncs = {
    "g": modG, 
    "n": modN, 
    "x": modX
};

let addNasals = (ipa) => {
    let ipaOutput = "";
    for (let i = 0; i < ipa.length; i++) {
        if (precedesCharInList(ipa, i, ["m", "n", "ŋ"]) && vowels.includes(ipa[i])) {
            ipaOutput += ipa[i] + "\u0303";
        } else if (i < ipa.length - 3 && vowels.includes(ipa[i]) && ipa[i + 2] === "\u032F" && precedesCharInList(ipa, i + 2, ["m", "n", "ŋ"])) {
            ipaOutput += ipa[i] + "\u0360";
        } else {
            ipaOutput += ipa[i];
        }
    }
    return ipaOutput;
}

let changeLetters = (word) => {
    let replacedWord = "";
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
                else if (word[i + 1] === "i" || word[i + 1] === "í") {
                    if (i === 0 && vowels.includes(word[i + 2])) {
                        replacedWord += "ʝ";
                        i++;
                    } else if (i !== 0 && vowels.includes(word[i - 1]) && vowels.includes(word[i + 2])) {
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
            if (i === 0) {
                replacedWord += "r"
            } else if (i !== lastIndex(word) && word[i + 1] === "r") {
                replacedWord += "r"
                i++;
            } else if (i !== 0 && ["l", "n", "s"].includes(word[i - 1])) {
                replacedWord += "r";
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
    return replacedWord;
}

let cleanSpanish = (word) => {
    let cleanedWord = "";
    for (let char of word) {
        if (isAlpha(char)) {
            cleanedWord += char;
        }
    }
    return cleanedWord;
}

//Main functions

let syllabify = (word) => {
    let i = 0;
    let length = word.length;
    while (i < length) {
        let changedLen = false;
        if (vowels.includes(word[i])) {
            //2 vowels
            if (i !== length - 1 && vowels.includes(word[i + 1])) {
                if ((strong.includes(word[i]) || word[i] in accents) && (strong.includes(word[i + 1]) || word[i + 1] in accents)) {
                    word = word.slice(0, i + 1) + "." + word.slice(i + 1);
                    changedLen = true;
                    i += 2;
                }
            }
        } else if (i !== 0) {
            if (i !== length - 1 && consonants.includes(word[i + 1])) {
                if (i !== length - 2 && consonants.includes(word[i + 2])) {
                    //Not word-final
                    if (i < word.length - 4) {
                        //4 consonants
                        if (i !== length - 3 && consonants.includes(word[i + 3])) {
                            if (unbreakable.includes(word.slice(i + 2, i + 4)) || ["bs", "ns"].includes(word.slice(i, i + 2))) {
                                word = word.slice(0, i + 2) + "." + word.slice(i + 2);
                                changedLen = true;
                            }
                            i += 4;
                        } else {
                            //Not word-final
                            if (i < word.length - 3) {
                                //3 consonants
                                if (unbreakable.includes(word.slice(i + 1, i + 3))) {
                                    word = word.slice(0, i + 1) + "." + word.slice(i + 1);
                                } else if (["bs", "ns"].includes(word.slice(i, i + 2))) {
                                    word = word.slice(0, i + 2) + "." + word.slice(i + 2);
                                } else {
                                    word = word.slice(0, i + 2) + "." + word.slice(i + 2);
                                }
                                changedLen = true;
                                i += 3;
                            }
                        }
                    }
                } else {
                    //Not word-final
                    if (i < word.length - 2) {
                        //2 consonants
                        if (unbreakable.includes(word.slice(i, i + 2))) {
                            word = word.slice(0, i) + "." + word.slice(i);
                        } else {
                            word = word.slice(0, i + 1) + "." + word.slice(i + 1);
                        }
                        changedLen = true;
                        i += 2;
                    }
                }
            } else if (i !== length - 1) {
                // 1 consonant
                if (word[i] === "h" && vowels.includes(word[i + 1]) && vowels.includes(word[i - 1])) {
                    word = word.slice(0, i) + "." + word.slice(i + 1);
                } else {
                    word = word.slice(0, i) + "." + word.slice(i);
                    changedLen = true;
                    i += 1;
                }
            }
        } else {
            //Skip initial consonant (cluster)
            while (i < word.length - 1 && !vowels.includes(word[i + 1])) {
                i += 1;
            }
        }
        if (changedLen) {
            length += 1;
        }
        i += 1;
    }
    return word;
}

let addStress = (word) => {
    //if word is polysyllabic
    if (word.includes(".")) {
        let hasAccent = false;
        for (let accent in accents) {
            if (word.includes(accent)) {
                hasAccent = true;
                let start = word.indexOf(accent);
                for (let i = start; i > -1; i--) {
                    if (word[i] === ".") {
                        word = word.slice(0, i) + "ˈ" + word.slice(i + 1);
                        break;
                    } else if (i === 0) {
                        word = "ˈ" + word;
                        break;
                    }
                }
                break;
            }
        }
        if (!hasAccent && (vowels.includes(word.slice(-1)) || ["n", "s"].includes(word.slice(-1)))) {
            let syllableCount = 0;
            for (let i = word.length - 1; i > -1; i--) {
                if (word[i] === "." && ++syllableCount === 2) {
                    word = word.slice(0, i) + "ˈ" + word.slice(i + 1);
                    break;
                } else if (i === 0) {
                    word = "ˈ" + word;
                }
            }
        } else if (!hasAccent) {
            const revWord = word.split("").reverse().join("");
            const index = word.length - revWord.indexOf(".");
            word = word.slice(0, index - 1) + "ˈ" + word.slice(index);
        }
    }
    return word;
}

let getSpanishIPA = (word, isNarrow) => {
    word = cleanSpanish(word);
    word = changeLetters(word);
    word = modZ(word);
    let ipaOutput = "";
    for (let i = 0; i < word.length; i++) {
        if (word[i] in replacements) {
            ipaOutput += replacements[word[i]];
        } else if (word[i] in replaceFuncs) {
            ipaOutput += replaceFuncs[word[i]](word, i);
        } else {
            ipaOutput += word[i];
        }
    }
    ipaOutput = syllabify(ipaOutput);
    ipaOutput = addStress(ipaOutput);
    for (const accent in accents) {
        ipaOutput = ipaOutput.replace(accent, accents[accent]);
    }
    if (isNarrow) {
        ipaOutput = getNarrowSpanishIPA(ipaOutput);
    }
    return ipaOutput;
}

let getNarrowSpanishIPA = (ipa) => {
    let narrowOutput = "";
    for (let i = 0; i < ipa.length; i++) {
        const char = ipa[i];
        if (char in allophones) {
            narrowOutput += allophones[char](ipa, i);
        } else {
            narrowOutput += char;
        }
    }
    //Diphthong check has to be done after 
    narrowOutput = checkDiphthongs(narrowOutput);
    narrowOutput = addNasals(narrowOutput);
    return narrowOutput;
}

export {getSpanishIPA};
