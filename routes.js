const router = require('express').Router();
const api = require('./api');
const utils = require('./utils');

router.route('/').get((req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

router.route('/new').get((req, res) => {
  res.json({
    error: 'You need to add an url',
  });
});

router.route('/new/:url(*)').get(async (req, res) => {
  const url = req.params.url;
  if (!utils.isUrlValid(url)) {
    res.json({
      error: `${url} is an invalid url.`,
    });
  } else {
    try {
      const ref = await api.insertRef(req.app.locals.db, url);

      res.json({
        original_url: url,
        short_url: `https://cat-garden.glitch.me/${ref}`,
      });
    } catch (err) {
      res.json({
        error: err,
      });
    }
  }
});

router.route('/:ref').get(async (req, res) => {
  const ref = req.params.ref;
  try {
    const url = await api.getUrl(req.app.locals.db, ref);

    res.redirect(url);
  } catch (err) {
    res.json({
      error: err,
    });
  }
});

// Respond not found to all the wrong routes
router.use((req, res, next) => {
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
router.use((err, req, res, next) => {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }
});

module.exports = router;
