const randomIntArr = (size, from, to) => {
  return Array(size)
    .fill()
    .map(() => Math.floor(to * Math.random()) + from);
};

module.exports = { randomIntArr };
