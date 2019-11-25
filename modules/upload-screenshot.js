const cloudinary = require('cloudinary').v2;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config(require("../cloudinary-config"));
} else {
  cloudinary.config(require("../cloudinary-config.secrets"));
}

module.exports = (feature, screenshot, options) => {
  return new Promise((resolve, reject) => {

    options = options || {
      folder: 'caniuse-embed',
      public_id: `${feature}-${new Date().getTime()}`
    };

    cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error)
      else resolve(result);
    }).end(screenshot);
  });
}
