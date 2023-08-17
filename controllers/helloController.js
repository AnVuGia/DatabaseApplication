exports.getHello = (req, res) => {
  res.sendFile('hello.html', { root: 'views' });
};
