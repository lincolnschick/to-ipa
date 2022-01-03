#Global lists
voiceless_stops = ["p", "t", "k"]
stops = ["t", "d", "k", "g", "p", "b"]
vowels = ["e", "i", "a", "ɛ", "ʊ", "ə", "ɚ", "u", "ɪ", "o", "ɑ", "æ", "ɔ", "ʌ"]
dentals = ["θ", "ð"]
syllabics = ["m", "n", "l", "ɹ"]

def create_narrow_ipa():
    in_file = open("broad_ipa_list.txt", "r")
    ipa_list = in_file.read()
    in_file.close()
    new_ipa_list = ""
    i = 0
    while i < len(ipa_list):
        if ipa_list[i] == "/":
            j = i + 1
            new_ipa_list += ipa_list[i]
            word = ""
            while ipa_list[j] != "/":
                word += ipa_list[j]
                j += 1
            new_ipa_list += narrow_ipa(word)
            i += len(word) + 1
            new_ipa_list += ipa_list[i]
        else:
            new_ipa_list += ipa_list[i]
        i += 1
    out_file = open("narrow_ipa_list.txt", "a")
    out_file.write(new_ipa_list)


def narrow_ipa(broad_ipa):
    narrow_ipa = ""
    for i in range(len(broad_ipa)):
        character = broad_ipa[i]
        if character in char_modifiers:
            narrow_ipa += char_modifiers[character](broad_ipa, i)
        elif character == "ɚ":
            narrow_ipa += "ɹ̩"
        else:
            narrow_ipa += broad_ipa[i]
    return narrow_ipa

def modify_l(broad_ipa, i):
    new_l = "l"
    #If l is in syllable coda, make it a dark l
    if i == len(broad_ipa) - 1 or broad_ipa[i + 1] not in vowels:
        new_l = "ɫ"
    new_l += add_dental(broad_ipa, i)
    new_l += add_syllabic(broad_ipa, i)
    new_l += add_devoiced(broad_ipa, i)
    return new_l

def modify_n(broad_ipa, i):
    new_n = "n"
    if i == 0:
        return new_n
    if i != 0 and i != len(broad_ipa) - 1:
        #If n is between two vowels, make it a nasal alveolar flap
        if broad_ipa[i - 1] in vowels and broad_ipa[i + 1] in vowels:
            new_n = "ɾ̃"
    new_n += add_syllabic(broad_ipa, i)
    new_n += add_dental(broad_ipa, i)
    new_n += add_devoiced(broad_ipa, i)
    return new_n
    
def modify_gb(broad_ipa, i):
    return broad_ipa[i] + add_unreleased(broad_ipa, i)

def modify_schwa(broad_ipa, i):
    #If the next sound is possible syllabic, remove the schwa
    if i != len(broad_ipa) - 1 and broad_ipa[i + 1] in syllabics:
        return ""
    return broad_ipa[i]

def modify_jw(broad_ipa, i):
    return broad_ipa[i] + add_devoiced(broad_ipa, i)

def modify_mr(broad_ipa, i):
    return broad_ipa[i] + add_syllabic(broad_ipa, i) + add_devoiced(broad_ipa, i)

def modify_kp(broad_ipa, i):
    return broad_ipa[i] + add_aspiration(broad_ipa, i) + add_unreleased(broad_ipa, i)

def modify_t(broad_ipa, i):
    #If the t precedes a syllabic n, it becomes a glottal stop
    if i < len(broad_ipa) - 2 and i != 0:
        if broad_ipa[i - 1] in vowels and broad_ipa[i + 1] == "ə" and broad_ipa[i + 2] == "n":
            return "ʔ"
    #If the t is between vowels, it becomes an alveolar tap/flap
    if i != 0 and i != len(broad_ipa) - 1:
        if broad_ipa[i - 1] in vowels and broad_ipa[i + 1] in vowels:
            return "ɾ"
        if broad_ipa[i - 1] != "s" and (broad_ipa[i + 1] == "n" or broad_ipa[i + 1] == "m"):
            return "ʔ"
    return broad_ipa[i] + add_aspiration(broad_ipa, i) + add_dental(broad_ipa, i) + add_unreleased(broad_ipa, i)
    
def modify_d(broad_ipa, i):
    #If the d is between vowels, it becomes an alveolar tap/flap
    if i != 0 and i != len(broad_ipa) - 1:
        if broad_ipa[i - 1] in vowels and broad_ipa[i + 1] in vowels:
            return "ɾ"
    return broad_ipa[i] + add_dental(broad_ipa, i) + add_unreleased(broad_ipa, i)

def add_dental(broad_ipa, i):
    #If next sound is a dental, make mark it as dental as well
    if i != len(broad_ipa) - 1 and broad_ipa[i + 1] in dentals:
        return "\u032A"
    return ""

def add_syllabic(broad_ipa, i):
    #If the previous sound is a schwa, mark it as syllabic
    if i != 0 and broad_ipa[i - 1] == "ə":
        return "\u0329"
    return ""

def is_aspirated(broad_ipa, i):
    #If it begins the word, add aspiration
    if i == 0:
        if broad_ipa[i + 1] != "ʃ":
            return True
        else:
            return False
    #If it's a t, run through specific cases before continuing
    if broad_ipa[i] == "t":
        if i < len(broad_ipa) - 2:
            if broad_ipa[i + 1] == "ə" and broad_ipa[i + 2] == "n":
                return False
        if i != len(broad_ipa) - 1:
            if broad_ipa[i - 1] in vowels and broad_ipa[i + 1] in vowels:
                return False
            if i != len(broad_ipa) - 1 and (broad_ipa[i + 1] == "n" or broad_ipa[i + 1] == "m"):
                return False
    #If it begins a stressed syllable, add aspiration
    if (broad_ipa[i - 1] == "ˈ" or broad_ipa[i - 1] == "ˌ") and broad_ipa[i + 1] != "ʃ":
        return True
    else:
        return False

def add_aspiration(broad_ipa, i):
    if is_aspirated(broad_ipa, i):
        return "\u02B0"
    return ""
    
def add_devoiced(broad_ipa, i):
    if i != 0 and broad_ipa[i - 1] in voiceless_stops:
        if is_aspirated(broad_ipa, i - 1):
            return "\u0325"
    return ""

def add_unreleased(broad_ipa, i):
    if i != len(broad_ipa) - 1 and broad_ipa[i + 1] in stops:
        return "\u031A"
    return ""

char_modifiers = {
    "l": modify_l, 
    "ə": modify_schwa, 
    "n": modify_n, 
    "m": modify_mr, 
    "ɹ": modify_mr, 
    "k": modify_kp, 
    "p": modify_kp, 
    "t": modify_t,
    "d": modify_d,
    "j": modify_jw,
    "w": modify_jw,
    "g": modify_gb,
    "b": modify_gb
    }

def main():
    create_narrow_ipa()

if __name__ == "__main__":
    main()
