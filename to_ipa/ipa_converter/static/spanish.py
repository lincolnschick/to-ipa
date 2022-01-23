vowels = ["a", "e", "i", "o", "u", "y", "á", "é", "í", "ó", "ú"]
consonants = [
    "b", "c", "h", "d", "f", "g", "j", "k", "l", "m", "n", "ñ", "p", "q", "r", "s", "t", "v", "w", "x", "z", "ʝ", "ʃ"
]
accents = {"á":"a", "é": "e", "í": "i", "ó": "o", "ú": "u"}
strong = ["a", "e", "o", "á", "é", "ó"]
weak = ["i", "u", "í", "ú"]
unbreakable = ["pr", "br", "pl", "bl", "fr", "fl", "gr", "gl", "kr", "kl", "pɾ", "bɾ", "fɾ", "gɾ", "kɾ", "tl", "dr", "tr", "dɾ", "tɾ", "gw"]

def syllabify(word):
    i = 0
    length = len(word)
    while i < length:
        changed_length = False
        if word[i] in vowels:
            
            #2 vowels
            if i != length - 1 and word[i + 1] in vowels:
                if (word[i] in strong or word[i] in accents) and (word[i + 1] in strong or word[i + 1] in accents):
                    word = word[:i + 1] + "." + word[i + 1:]
                    changed_length = True
                    i += 2
        
        elif i != 0:
            
            if i != length - 1 and word[i + 1] in consonants:
                
                if i != length - 2 and word[i + 2] in consonants:
                    
                    #4 consonants
                    if i != length - 3 and word[i + 3] in consonants:
                        
                        if word[i + 2: i + 4] in unbreakable:
                            word = word[:i + 2] + "." + word[i + 2:]
                            changed_length = True
                        
                        elif word[i:i + 2] in ["bs", "ns"]:
                            word = word[:i + 2] + "." + word[i + 2:]
                            changed_length = True
                        
                        i += 4
                    
                    #3 consonants
                    else:
                        
                        if word[i + 1: i + 3] in unbreakable:
                            word = word[:i + 1] + "." + word[i + 1:]
                            changed_length = True
                        
                        elif word[i:i + 2] in ["bs", "ns"]:
                            word = word[:i + 2] + "." + word[i + 2:]
                            changed_length = True
                        
                        i += 3
                
                #2 consonants
                else:
                    if word[i:i + 2] in unbreakable:
                        word = word[:i] + "." + word[i:]
                        
                    else:
                        word = word[:i + 1] + "." + word[i + 1:]
                        
                    changed_length = True
                    i += 2
            
            #1 consonant
            elif i != length - 1:
                word = word[:i] + "." + word[i:]
                changed_length = True
                i += 1
        else:
            #Skip initial consonant (cluster)
            while i + 1 < length and word[i + 1] in consonants:
                i += 1
            
        if changed_length:
            length += 1
        i += 1
    return word


print(syllabify("miɾaɾon"))
print(syllabify("ablando"))
print(syllabify("afloxaɾ"))
print(syllabify("akrobata"))
print(syllabify("atlalilko"))
print(syllabify("kuenta"))
print(syllabify("insepaɾable"))
print(syllabify("obteneɾ"))
print(syllabify("empleados"))
print(syllabify("kontraeɾ"))
print(syllabify("konstitusion"))
print(syllabify("instauɾaɾ"))
print(syllabify("euɾopa"))
print(syllabify("kuidado"))
print(syllabify("pelear"))
print(syllabify("aeɾeo"))
print(syllabify("asia"))
print(syllabify("aire"))
print(syllabify("prueba"))