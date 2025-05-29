import { hashString, decryptString } from './hashing';

describe('hashString & decryptString', () => {
  const salt = 'abc123';
  const shift = 3;

  beforeAll(() => {
    process.env.SALT = salt;
  });

  it('should hash and decrypt correctly for a simple string', () => {
    const input = 'hello';
    const hashed = hashString(input, salt, shift);
    const decrypted = decryptString(hashed, salt, shift);
    expect(decrypted).toBe(input);
  });

  it('should throw error if input is empty', () => {
    expect(() => hashString('', salt)).toThrow("Input și salt sunt obligatorii");
  });

  it('should throw error if salt is missing', () => {
    expect(() => hashString('data', '')).toThrow("Input și salt sunt obligatorii");
  });

  it('should throw error if hashedInput is empty during decryption', () => {
    expect(() => decryptString('', salt)).toThrow("Hash-ul si salt-ul sunt obligatorii pentru decriptare");
  });

  it('should throw error if salt does not match in decryption', () => {
    const input = 'text';
    const hashed = hashString(input, salt, shift);
    expect(() => decryptString(hashed, 'wrong-salt', shift)).toThrow("Salt-ul nu corespunde - decriptarea a esuat");
  });

  it('should produce different hashes for different salts', () => {
    const input = 'securedata';
    const hash1 = hashString(input, 'salt1', shift);
    const hash2 = hashString(input, 'salt2', shift);
    expect(hash1).not.toBe(hash2);
  });
});
