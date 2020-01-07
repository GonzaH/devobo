/* eslint-disable prefer-promise-reject-errors */
const Axios = require("axios");
const { url, token } = require("./settings.json");
const messages = require("./messages.json");
const { pickResponse } = require("./helpers");

const prefix = `${url}${token}`

const getUpdates = offset =>
  new Promise((resolve, reject) =>
    Axios.get(`${prefix}/getUpdates`, {
      params: { offset }
    })
      .then(({ data }) => {
        const { ok, result } = data;
        if (!ok) return reject(data);
        const response = result.filter(({ update_id }) => update_id > offset);
        resolve(response);
      })
      .catch(error => reject(error))
  );

const handleResult = result =>
  new Promise((resolve, reject) => {
    try {
      const { update_id: updateId, message } = result;

      if (
        !message ||
        !message.chat ||
        !message.chat.id ||
        !message.from ||
        !message.text
      )
        return resolve(updateId);

      const {
        message: {
          chat: { id: chat_id },
          text,
          from: { first_name }
        }
      } = result;

      console.log("[handleResult]", new Date(), updateId, text);

      const response = pickResponse(messages, text, first_name);

      if (!response) return resolve(updateId);

      Axios.post(`${prefix}/sendMessage`, { chat_id, text: response })
        .then(() => resolve(updateId))
        .catch(error => reject(error));
    } catch (error) {
      reject(error);
    }
  });

module.exports = { getUpdates, handleResult };
