const cloudinary=require("cloudinary").v2
cloudinary.config({
    cloud_name: "docm03ean",  // your cloud name
    api_key: "872263481627173",
    api_secret: "NgH7mIEMX5rABe5hhcKqb4ZofyU",
    secure: true,
    cdn_subdomain: true,
})

const uploadImg = async (fileBuffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: "auto" },
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

module.exports={uploadImg}