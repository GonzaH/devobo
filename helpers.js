const normalizeText = input =>
  input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const replaceTemplate = (text, { username = "" }) =>
  [
    { template: "@username", insert: username },
    { template: "@project", insert: "" } // TODO: Add projects structure
  ].reduce(
    (accum, { template, insert }) => accum.replace(template, insert),
    text
  );

const pickResponse = (messages, input, username) => {
  const normalizedInput = normalizeText(input);
  const responses = messages.filter(
    m => m.tags.filter(t => normalizedInput.includes(t)).length
  );
  if (!responses.length) return null;
  return replaceTemplate(
    responses[Math.floor(Math.random() * responses.length)].message,
    { username }
  );
};

module.exports = { pickResponse };
