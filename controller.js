/* eslint-disable prefer-promise-reject-errors */
const Axios = require("axios");
const { url, token } = require("./settings.json");
const messages = require("./messages.json");
const { pickResponse } = require("./helpers");

const getUpdates = offset =>
  new Promise((resolve, reject) =>
    Axios.get(`${url}${token}/getUpdates`, {
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
      const { update_id: updateId } = result;
      if (
        !result.message ||
        !result.message.chat ||
        !result.message.chat.id ||
        !result.message.text
      )
        return resolve(updateId);
      const {
        message: {
          chat: { id: chat_id },
          text
        }
      } = result;
      console.log("[handleResult]", new Date(),  updateId, text);

      const response = pickResponse(messages, text);
      if (!response) return resolve(updateId);

      Axios.post(`${url}${token}/sendMessage`, { chat_id, text: response })
        .then(() => resolve(updateId))
        .catch(error => reject(error));
    } catch (error) {
      reject(error);
    }
  });

module.exports = { getUpdates, handleResult };
