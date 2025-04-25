import { generateSecurePassword } from '../../src/lib/generateSecurePassword';

describe('generateSecurePassword', () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const all = uppercase + lowercase + numbers + symbols;

    const hasCharFrom = (str: string, charSet: string) =>
        [...str].some(char => charSet.includes(char));

    it('should generate a password with minimum length of 9', () => {
        const password = generateSecurePassword();
        expect(password.length).toBeGreaterThanOrEqual(9);
    });

    it('should include at least one uppercase letter', () => {
        const password = generateSecurePassword();
        expect(hasCharFrom(password, uppercase)).toBe(true);
    });

    it('should include at least one lowercase letter', () => {
        const password = generateSecurePassword();
        expect(hasCharFrom(password, lowercase)).toBe(true);
    });

    it('should include at least one number', () => {
        const password = generateSecurePassword();
        expect(hasCharFrom(password, numbers)).toBe(true);
    });

    it('should include at least one symbol', () => {
        const password = generateSecurePassword();
        expect(hasCharFrom(password, symbols)).toBe(true);
    });

    it('should generate different passwords on multiple calls', () => {
        const pwd1 = generateSecurePassword();
        const pwd2 = generateSecurePassword();
        expect(pwd1).not.toBe(pwd2);
    });

    it('should only contain characters from the allowed set', () => {
        const password = generateSecurePassword();
        for (const char of password) {
        expect(all.includes(char)).toBe(true);
        }
    });
    it('should always include required character types over multiple generations', () => {
        for (let i = 0; i < 100; i++) {
            const password = generateSecurePassword();
            expect(password.length).toBeGreaterThanOrEqual(9);
            expect(hasCharFrom(password, uppercase)).toBe(true);
            expect(hasCharFrom(password, lowercase)).toBe(true);
            expect(hasCharFrom(password, numbers)).toBe(true);
            expect(hasCharFrom(password, symbols)).toBe(true);
            for (const char of password) {
            expect(all.includes(char)).toBe(true);
            }
        }
    });

    it('should generate passwords with some variability in characters used', () => {
        const passwords = new Set<string>();
        for (let i = 0; i < 50; i++) {
            passwords.add(generateSecurePassword());
        }
        expect(passwords.size).toBeGreaterThan(45);
    });

    it('should generate passwords of exactly 9 characters', () => {
        const password = generateSecurePassword();
        expect(password.length).toBe(9);
    });

    it('should not contain whitespace or invisible characters', () => {
        const password = generateSecurePassword();
        expect(/\s/.test(password)).toBe(false);
    });
    
    it('should not have a single character repeated excessively', () => {
        const password = generateSecurePassword();
        const counts = password.split('').reduce((acc, char) => {
            acc[char] = (acc[char] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const maxAllowedRepeat = 4; // seuil arbitraire
        for (const count of Object.values(counts)) {
            expect(count).toBeLessThanOrEqual(maxAllowedRepeat);
        }
    });
});