const projects = require('./projects')

const DIMA_PROBABILITY = 100;

const normalizeText = input =>
  input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Replaces the value of `template` with that of `insert` function.
const replace = (accum, { template, insert }) => accum.replace(template, insert());

const getRandom = ({ length }) => Math.floor(Math.random() * length)

/* Replaces the values of `template` values with certain params.
 * For example, `@username` is replaced by the username passed.
 */
const replaceTemplate = (text, { username = "" }) =>
  [
    { template: "@username", insert: () => username },
    { template: "@projectname", insert: getProject}
  ].reduce(
    replace,
    text
  );

/** Picks a random response from the provided list.
 * Returns its message.
 * @param { Array } r - The list of responses.
 */
const chooseFromResponses = r => r[getRandom(r)].message;

const pickResponse = (messages, input, username) => {
  if (!getRandom({ length: DIMA_PROBABILITY })) return input;
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

/** Converts an obfuscated string to a legible one.
 * Returns the legible string.
 * @param { String } obfuscated - The string obfuscated with +1 to each char code.
 */
const obfuscatedToLegible = obfuscated => String.fromCharCode(...obfuscated.split("").map(e => e.charCodeAt() - 1));

// Returns a project
const getProject = () => {
  const obfuscatedProject = projects[getRandom(projects)];
  return obfuscatedToLegible(obfuscatedProject);
};

module.exports = { obfuscatedToLegible, pickResponse };
