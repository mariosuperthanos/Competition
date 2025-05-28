export function hashString(input: string, salt=process.env.SALT, shift = 3) {
  // Verificam daca parametrii sunt valizi
  if (!input || !salt) {
    throw new Error("Input și salt sunt obligatorii");
  }

  // Combinam input-ul cu salt-ul
  const combinedString = input + salt;

  // Aplicam o transformare simpla folosind cifrul Caesar
  let hashedString = "";

  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString[i];
    // Obtinem codul ASCII al caracterului
    const charCode = char.charCodeAt(0);

    // Aplicam shift-ul la codul caracterului
    let shiftedCode = charCode + shift;

    // Daca depasim caracterele printabile, revenim la inceput
    if (shiftedCode > 126) {
      shiftedCode = 32 + (shiftedCode - 127);
    }

    hashedString += String.fromCharCode(shiftedCode);
  }

  // Adaugam o transformare suplimentara prin inversarea string-ului
  hashedString = hashedString.split('').reverse().join('');

  // Encodam in Base64 pentru a face rezultatul mai compact și sigur
  return btoa(hashedString);
}

export function decryptString(hashedInput: string, salt=process.env.SALT, shift = 3) {
  try {
    // Verificam daca parametrii sunt valizi
    if (!hashedInput || !salt) {
      throw new Error("Hash-ul si salt-ul sunt obligatorii pentru decriptare");
    }

    // Decodam din Base64
    let decodedString = atob(hashedInput);

    // Inversam string-ul înapoi la forma originala
    decodedString = decodedString.split('').reverse().join('');

    // Aplicam transformarea inversa a cifrului Caesar
    let decryptedString = "";

    for (let i = 0; i < decodedString.length; i++) {
      const char = decodedString[i];
      const charCode = char.charCodeAt(0);

      // Aplicam shift-ul invers
      let originalCode = charCode - shift;

      // Daca scadem sub caracterele printabile, mergem la sfârșit
      if (originalCode < 32) {
        originalCode = 127 - (32 - originalCode);
      }

      decryptedString += String.fromCharCode(originalCode);
    }

    // Eliminam salt-ul de la sfarsitul string-ului
    // Salt-ul a fost adaugat la sfarsitul input-ului original
    if (decryptedString.endsWith(salt)) {
      return decryptedString.slice(0, -salt.length);
    } else {
      throw new Error("Salt-ul nu corespunde - decriptarea a esuat");
    }

  } catch (error) {
    throw new Error("Eroare la decriptare: " + error.message);
  }
}

export function testHashAndDecrypt(originalText, salt) {
  console.log("=== Test Hash și Decrypt ===");
  console.log("Text original:", originalText);
  console.log("Salt folosit:", salt);

  try {
    // Hash-uim textul
    const hashed = hashString(originalText, salt);
    console.log("Text hash-uit:", hashed);

    // Decriptam textul
    const decrypted = decryptString(hashed, salt);
    console.log("Text decriptat:", decrypted);

    // Verificam daca decriptarea a fost reușita
    const isSuccess = originalText === decrypted;
    console.log("Test reușit:", isSuccess ? "DA" : "NU");

    if (!isSuccess) {
      console.log("EROARE: Textul decriptat nu corespunde cu originalul!");
    }

  } catch (error) {
    console.error("Eroare în test:", error.message);
  }

  console.log("============================\n");
}

