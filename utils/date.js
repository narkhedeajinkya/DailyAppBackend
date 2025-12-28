const today = () =>
  new Date().toISOString().slice(0, 10);

const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

module.exports = { today, yesterday };
