voiceless_stops = ["p", "t", "k"]
stops = ["t", "d", "k", "g", "p", "b"]
vowels = ["e", "i", "a", "ɛ", "ʊ", "ə", "ɚ", "u", "ɪ", "o", "ɑ", "æ", "ɔ", "ʌ"]
dentals = ["θ", "ð"]
syllabics = ["m", "n", "l", "ɹ"]
alveolar_stops = ["t", "d"]
dentalized = ["d", "t", "l", "n"]
nasals = ["m", "n", "ŋ"]

def main():
    with open("english_ipa_lists/updated_ipa_list.txt", "r") as ipa_list:
        with open("english_ipa_lists/narrow_ipa_list.txt", "a") as narrow_ipa_list:
            for line in ipa_list:
                i = 0
                narrow_ipa = ""
                
                while i < len(line):
                    if line[i] == "/":
                        narrow_ipa += line[i]
                        j = i + 1
                        ipa = ""
                        
                        #Grab IPA to be edited between slashes
                        while line[j] != "/":
                            ipa += line[j]
                            j += 1
                        
                        narrow_ipa += edit_ipa(ipa)
                        i += len(ipa) + 1
                        narrow_ipa += line[i]
                    
                    else:
                        narrow_ipa += ipa_list[i]
                    
                    i += 1

                narrow_ipa_list.write(narrow_ipa)

def edit_ipa(ipa):
    edited_ipa = ""
    for i, char in enumerate(ipa):
        edited_char = char
        if char == "ə":
            edited_char = add_schwa(ipa, i)
        elif is_glottal_stop(ipa, i):
            edited_char = "ʔ"
        else:
            if is_flap(ipa, i):
                edited_char = "ɾ"
            if is_aspirated(ipa, i):
                edited_char += "\u02B0"
            if is_nasalized(ipa, i):
                edited_char += "\u0303"
            if is_dentalized(ipa, i):
                edited_char += "\u032A"
            if is_syllabic(ipa, i):
                edited_char += "\u0329"
            if is_dark_l(ipa, i):
                edited_char += "\u0334"
        edited_ipa += edited_char
    
    return edited_ipa

def is_in_middle(ipa, i):
    return (i != 0 and i != len(ipa) - 1)

def is_not_word_final(ipa, i):
    return i != len(ipa) - 1

def is_not_word_initial(ipa, i):
    return i != 0

def is_word_final(ipa, i):
    return i == len(ipa) - 1

def is_aspirated(ipa, i):
    if ipa[i] not in voiceless_stops:
        return False
    if i == 0:
        return False if ipa[i + 1] == "ʃ" else True
    if ipa[i - 1] == "ˈ" or ipa[i - 1] == "ˌ":
        return True
    return False

def is_flap(ipa, i):
    if ipa[i] not in alveolar_stops:
        return False
    if is_in_middle(ipa, i) and ipa[i + 1] in vowels and ipa[i - 1] in vowels:
        return True
    return False

def is_glottal_stop(ipa, i):
    if ipa[i] != "t":
        return False
    if is_in_middle(ipa, i) and ipa[i - 1] != "s" and ipa[i + 1] in ["m", "n"]:
        return True
    if is_not_word_initial(ipa, i) and i < len(ipa) - 2:
        if ipa[i - 1] in vowels and ipa[i + 1] == "ə" and ipa[i + 2] == "n":
            return True
    return False

def is_syllabic(ipa, i):
    if ipa[i] in syllabics and is_word_final(ipa, i) and ipa[i - 1] == "ə":
        return True
    return False

def is_dark_l(ipa, i):
    if ipa[i] == "l" and (is_word_final(ipa, i) or ipa[i + 1] not in vowels):
        return True
    return False
        
def is_nasalized(ipa, i):
    if ipa[i] in vowels and is_not_word_final(ipa, i) and ipa[i + 1] in nasals:
        return True
    return False

def is_dentalized(ipa, i):
    if ipa[i] in dentalized and is_not_word_final(ipa, i) and ipa[i + 1] in dentals:
        return True
    return False

def add_schwa(ipa, i):
    if ipa[i] == "ə" and is_word_final(ipa, i + 1) and ipa[i + 1] in syllabics:
            return ""
    return "ə" if ipa[i] == "ə" else ""






if "__name__" == "__main__":
    main()