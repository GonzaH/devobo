const normalizeText = input =>
  input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const pickResponse = (messages, input) => {
  const normalizedInput = normalizeText(input);
  const responses = messages.filter(
    m => m.tags.filter(t => normalizedInput.includes(t)).length
  );
  if (!responses.length) return null;
  return responses[Math.floor(Math.random() * responses.length)].message;
};

module.exports = { pickResponse };
