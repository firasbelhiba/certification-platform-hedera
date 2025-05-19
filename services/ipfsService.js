require("dotenv").config();
const axios = require("axios");

const PINATA_JWT = process.env.PINATA_JWT;

exports.uploadMetadataToIPFS = async ({ studentName, courseTitle, date }) => {
    const metadata = {
        name: "Certificate of Completion",
        description: `${studentName} completed ${courseTitle}`,
        attributes: [
            { trait_type: "Course", value: courseTitle },
            { trait_type: "Student", value: studentName },
            { trait_type: "Issued At", value: date }
        ]
    };

    try {
        console.log("⏳ Uploading to Pinata...");

        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            metadata,
            {
                headers: {
                    Authorization: `Bearer ${PINATA_JWT}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const cid = res.data.IpfsHash;
        console.log("✅ Upload successful:", `ipfs://${cid}`);
        return `ipfs://${cid}`;
    } catch (err) {
        console.error("❌ Pinata upload failed:", err.message);
        throw err;
    }
};
