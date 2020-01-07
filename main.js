const { getUpdates, handleResult } = require("./controller");

const MAX_LOOP = 5;
const ERROR_OFFSET = 10;
let offset = 0;
let loopTimes = 0;

const updateOffset = offsets => {
  const newOffset = offsets.reduce((a, c) => (c > a ? c : a), 0);
  if (newOffset < offset) {
    if (loopTimes++ > MAX_LOOP) return endIt();
    console.warn("[warning] Looped", loopTimes, "times");
  } else offset = newOffset;
};

const intervalID = setInterval(
  () =>
    getUpdates(offset)
      .then(
        results =>
          results.length &&
          Promise.all(results.map(handleResult))
            .then(updateOffset)
            .catch(({ response: { data: error } }) => {
              console.log("[handling-error] error: ", error);
              updateOffset([offset + ERROR_OFFSET]);
            })
      )
      .catch(error => console.error("[getUpdates-error]: ", error)),
  5000
);

setInterval(() => {
  loopTimes = 0;
}, 30000);

const endIt = () => {
  console.warn("Ended in ", new Date());
  clearInterval(intervalID);
};
