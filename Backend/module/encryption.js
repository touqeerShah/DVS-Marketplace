//Checking the crypto module
const crypto = require("crypto");
const iv = crypto.randomBytes(16);
const algorithm = "aes-256-ctr";

//Encrypting text
/**
 * This function is used to ecrypt key before store to keys in keystore.
 * @param {*} text  data want to ecrypt
 * @param {*} secretKey  every company have their own secret which uniqe for evert company bucket
 * @returns
 */
module.exports.keyEncrypt = (text, secretKey) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
    };
};

// Decrypting text
/**
 * This function is used to decrypt key get keys from  keystore.
 * @param {*} hash  data want to decrypt
 * @param {*} secretKey  every company have their own secret which uniqe for evert company bucket
 * @returns
 */
module.exports.keyDecrypt = (hash, secretKey) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        Buffer.from(hash.iv, "hex")
    );

    const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(hash.content, "hex")),
        decipher.final(),
    ]);

    return decrpyted.toString();
};



