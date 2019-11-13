const gm = require('gm').subClass({imageMagick: true});

module.exports = (image) => {
  return new Promise((resolve, reject) => {

    gm(image, 'image.png')
      .trim()
      .toBuffer('PNG',function (err, buffer) {
        if (err) reject(err);
        resolve(buffer);
      });

  });
};
