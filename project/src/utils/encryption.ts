export const caesarCipher = (text: string, shift: number, decrypt = false): string => {
  const processShift = decrypt ? (26 - shift) : shift;
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + processShift) % 26) + base);
      }
      return char;
    })
    .join('');
};

export const playfairCipher = (text: string, key: string, decrypt = false): string => {
  // Generate Playfair matrix
  const generateMatrix = (key: string) => {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Note: I and J are combined
    const matrix: string[][] = Array(5).fill(null).map(() => Array(5).fill(''));
    const usedChars = new Set();
    let row = 0, col = 0;

    // Add key characters first
    key.toUpperCase().replace(/J/g, 'I').split('').forEach(char => {
      if (!usedChars.has(char) && char.match(/[A-Z]/)) {
        matrix[row][col] = char;
        usedChars.add(char);
        col++;
        if (col === 5) {
          col = 0;
          row++;
        }
      }
    });

    // Fill remaining with unused alphabet characters
    alphabet.split('').forEach(char => {
      if (!usedChars.has(char)) {
        matrix[row][col] = char;
        col++;
        if (col === 5) {
          col = 0;
          row++;
        }
      }
    });

    return matrix;
  };

  // Find position of a character in matrix
  const findPosition = (matrix: string[][], char: string): [number, number] => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === char) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  };

  const matrix = generateMatrix(key);
  const cleanText = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const pairs: string[][] = [];

  // Prepare text pairs
  for (let i = 0; i < cleanText.length; i += 2) {
    if (i === cleanText.length - 1) {
      pairs.push([cleanText[i], 'X']);
    } else if (cleanText[i] === cleanText[i + 1]) {
      pairs.push([cleanText[i], 'X']);
      i--;
    } else {
      pairs.push([cleanText[i], cleanText[i + 1]]);
    }
  }

  // Process each pair
  return pairs.map(([a, b]) => {
    const [row1, col1] = findPosition(matrix, a);
    const [row2, col2] = findPosition(matrix, b);

    if (row1 === row2) { // Same row
      const newCol1 = decrypt ? (col1 - 1 + 5) % 5 : (col1 + 1) % 5;
      const newCol2 = decrypt ? (col2 - 1 + 5) % 5 : (col2 + 1) % 5;
      return matrix[row1][newCol1] + matrix[row2][newCol2];
    } else if (col1 === col2) { // Same column
      const newRow1 = decrypt ? (row1 - 1 + 5) % 5 : (row1 + 1) % 5;
      const newRow2 = decrypt ? (row2 - 1 + 5) % 5 : (row2 + 1) % 5;
      return matrix[newRow1][col1] + matrix[newRow2][col2];
    } else { // Rectangle
      return matrix[row1][col2] + matrix[row2][col1];
    }
  }).join('');
};

export const vigenereCipher = (text: string, key: string, decrypt = false): string => {
  const keyRepeated = key
    .toLowerCase()
    .repeat(Math.ceil(text.length / key.length))
    .slice(0, text.length);

  return text
    .split('')
    .map((char, i) => {
      if (char.match(/[a-zA-Z]/)) {
        const isUpperCase = char === char.toUpperCase();
        const textChar = char.toLowerCase();
        const keyChar = keyRepeated[i];
        const textCode = textChar.charCodeAt(0) - 97;
        const keyCode = keyChar.charCodeAt(0) - 97;
        
        let result;
        if (decrypt) {
          result = (textCode - keyCode + 26) % 26;
        } else {
          result = (textCode + keyCode) % 26;
        }
        
        const finalChar = String.fromCharCode(result + 97);
        return isUpperCase ? finalChar.toUpperCase() : finalChar;
      }
      return char;
    })
    .join('');
};

export const transpositionCipher = (text: string, key: number, decrypt = false): string => {
  const numCols = key;
  const cleanText = text.replace(/\s/g, '');
  
  if (decrypt) {
    const numRows = Math.ceil(cleanText.length / key);
    const matrix: string[][] = Array(numRows).fill('').map(() => Array(numCols).fill(''));
    const totalSpots = numRows * numCols;
    const padding = totalSpots - cleanText.length;
    
    let pos = 0;
    for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
        if (row === numRows - 1 && col >= numCols - padding) {
          continue;
        }
        matrix[row][col] = cleanText[pos++];
      }
    }
    
    return matrix.map(row => row.join('')).join('');
  } else {
    const numRows = Math.ceil(cleanText.length / numCols);
    const matrix: string[][] = Array(numRows).fill('').map(() => Array(numCols).fill(''));
    
    let pos = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (pos < cleanText.length) {
          matrix[row][col] = cleanText[pos++];
        }
      }
    }
    
    let result = '';
    for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
        if (matrix[row][col]) {
          result += matrix[row][col];
        }
      }
    }
    
    return result;
  }
};