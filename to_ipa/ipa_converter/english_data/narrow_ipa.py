voiceless_stops = ["p", "t", "k"]
stops = ["t", "d", "k", "g", "p", "b"]
vowels = ["e", "i", "a", "ɛ", "ʊ", "ə", "ɚ", "u", "ɪ", "o", "ɑ", "æ", "ɔ", "ʌ"]
dentals = ["θ", "ð"]
syllabics = ["m", "n", "l", "ɹ"]

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
        if char in chars_to_edit:
            edited_ipa += chars_to_edit[char](ipa, i)
        else:
            edited_ipa += char

def is_in_middle(ipa, i):
    return (i != 0 and i != len(ipa) - 1)

def is_not_end(ipa, i):
    return i != len(ipa) - 1

def is_not_start(ipa, i):
    return i != 0




chars_to_edit = {
    "l": edit_l, 
    "n": edit_n, 
    "m": edit_mr, 
    "ɹ": edit_mr, 
    "k": edit_kp, 
    "p": edit_kp, 
    "t": edit_t,
    "d": edit_d,
    "j": edit_jw,
    "w": edit_jw,
    "g": edit_gb,
    "b": edit_gb
    }


if "__name__" == "__main__":
    main()