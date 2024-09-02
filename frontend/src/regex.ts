export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;


//Check regex
export const checkRegex = (regex: RegExp, str: string) => {
  return regex.test(str);
};