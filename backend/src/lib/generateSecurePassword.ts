export function generateSecurePassword(): string {
  const uppercase : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase : string = "abcdefghijklmnopqrstuvwxyz";
  const numbers : string = "0123456789";
  // const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
  const symbols : string = "!@#$%^*-_=+";

  const all = uppercase + lowercase + numbers + symbols;

  const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];

  const password: string[] = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(numbers),
    getRandom(symbols),
  ];

  while (password.length < 9) {
    password.push(getRandom(all));
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  // return password.sort(() => Math.random() - 0.5).join("");
  return password.join("");
}

// const passwordCreated = generateSecurePassword();
// console.log("Generated password:", passwordCreated);