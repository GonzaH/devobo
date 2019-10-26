const normalizeText = input =>
  input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Replaces the value of `template` with that of `insert`.
const replace = (accum, { template, insert }) => accum.replace(template, insert);

/* Replaces the values of `template` values with certain params.
 * For example, `@username` is replaced by the username passed.
 */
const replaceTemplate = (text, { username = "" }) =>
  [
    { template: "@username", insert: username },
    { template: "@project", insert: "" } // TODO: Add projects structure
  ].reduce(
    replace,
    text
  );

/** Picks a random response from the provided list.
 * Returns its message.
 * @param { Array } r - The list of responses.
 */
const chooseFromResponses = r => r[Math.floor(Math.random() * r.length)].message;

const pickResponse = (messages, input, username) => {
  const normalizedInput = normalizeText(input);
  const responses = messages.filter(
    m => m.tags.filter(t => normalizedInput.includes(t)).length
  );
  if (!responses.length) return null;
  const response = chooseFromResponses(responses);
  return replaceTemplate(
    response,
    { username }
  );
};

module.exports = { pickResponse };
