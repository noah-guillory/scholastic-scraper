const delay = interval => new Promise(resolve => setTimeout(resolve, interval));

module.exports = {
  delay,
}