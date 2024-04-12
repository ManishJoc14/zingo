const randomChars = Array.from({ length: 10 }, () =>
  String.fromCharCode(Math.floor(Math.random() * 26) + 97)
).join("");

export const encodeName = (name) => {
  return name + randomChars;
};

export const decodeName = (encodedName) => {
  const decodedName = encodedName.slice(0, -10);
  return decodedName;
};