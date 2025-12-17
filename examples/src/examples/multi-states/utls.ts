export function randomWord() {
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const vowels = "aeiou";
  const len = Math.floor(Math.random() * 3) + 3;

  let word = "";
  for (let i = 0; i < len; i++) {
    const pool = i % 2 === 0 ? consonants : vowels;
    word += pool[Math.floor(Math.random() * pool.length)];
  }
  return word;
}
