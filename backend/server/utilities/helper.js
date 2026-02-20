const cloudinary = require("cloudinary").v2
cloudinary.config({
    cloud_name: "do2ccjsdi",  // your cloud name
    api_key: "594497365838797",
    api_secret: "ydND1xK9YHgWnkekSXTSTFaJCSQ",
    secure: true,
    cdn_subdomain: true,
})

const uploadImg = async (fileBuffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(fileBuffer);
    });
};
module.exports = { uploadImg }