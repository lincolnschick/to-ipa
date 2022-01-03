vowels = ["e", "i", "a", "ɛ", "ʊ", "ə", "ɚ", "u", "ɪ", "o", "ɑ", "æ", "ɔ"]

with open("english_ipa_lists/ipa_list.txt", "r") as orig_list:
    with open("english_ipa_lists/updated_ipa_list.txt", "a") as updated_list:
        for line in orig_list:
            word, ipa = line.split(":")
            
            updated_ipa = ""
            for i, char in enumerate(ipa):
                if char == "ə":
                    j = i - 1
                    replaced = False
                    while ipa[j] != "/":
                        if ipa[j] == "ˈ" or ipa[j] == "ˌ":
                            updated_ipa += "ʌ"
                            replaced = True
                            break
                        if ipa[j] in vowels:
                            break
                        j -= 1
                    if not replaced:
                        updated_ipa += "ə"
                
                else:
                    updated_ipa += char
            
            updated_list.write(word + ":" + updated_ipa)
        
