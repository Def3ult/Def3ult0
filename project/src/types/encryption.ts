export type EncryptionMethod = 'caesar' | 'playfair' | 'vigenere' | 'transposition';

export interface EncryptionResult {
  originalText: string;
  encryptedText: string;
  method: EncryptionMethod;
  key?: string | number;
}