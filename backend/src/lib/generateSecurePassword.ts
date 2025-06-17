export function generateSecurePassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  // const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
  const symbols = "!@#$%^*-_=+";

  const all = uppercase + lowercase + numbers + symbols;

  const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];

  let password = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(numbers),
    getRandom(symbols),
  ];

  while (password.length < 9) {
    password.push(getRandom(all));
  }

  return password.sort(() => Math.random() - 0.5).join("");
}

// const passwordCreated = generateSecurePassword();
// console.log("Generated password:", passwordCreated);