const base64Img = require('base64-img');
const express = require('express');
const router = new express.Router();

router.post('/upload', (req, res) => {
  base64Img.img(req.body.base, `${__dirname}/../../imgs`, req.body.name, function(err, file) {
    if (err) {
      res.error(err);
    }
    const pieces = file.split('/');
    res.json({
      data: pieces.pop()
    });
  });
});

module.exports = router;
