const {
    Client,
    TokenMintTransaction,
    TransferTransaction,
    PrivateKey,
    AccountId
} = require('@hashgraph/sdk');

const {
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType
} = require("@hashgraph/sdk");

require('dotenv').config();

const client = Client.forTestnet();
client.setOperator(process.env.MY_ACCOUNT_ID, PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY));
const tokenId = process.env.TOKEN_ID; // You can mint a base course token once and reuse it

exports.mintCertificateNFT = async (tokenId, metadataUrl, studentAccountId) => {
    console.log("🟡 Minting NFT from token:", tokenId);

    // Mint NFT metadata
    const mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([Buffer.from(metadataUrl)])
        .freezeWith(client)
        .sign(PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY));

    const mintSubmit = await mintTx.execute(client);
    const mintRx = await mintSubmit.getReceipt(client);
    const serialNumber = mintRx.serials[0].low;

    console.log(`✅ NFT minted: ${tokenId} with serial ${serialNumber}`);
    console.log("➡️ Transferring NFT to student:", studentAccountId);

    // NFT Transfer — split the steps
    const transferTx = new TransferTransaction()
        .addNftTransfer(tokenId, serialNumber, process.env.MY_ACCOUNT_ID, studentAccountId)
        .freezeWith(client);

    const signedTx = await transferTx.sign(
        PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY)
    );

    const transferSubmit = await signedTx.execute(client);
    await transferSubmit.getReceipt(client);

    console.log("✅ NFT transferred to student:", studentAccountId);

    return { tokenId, serialNumber };
};

exports.createCourseNFTCollection = async (courseTitle) => {
    const tx = await new TokenCreateTransaction()
        .setTokenName(`Certificate for ${courseTitle}`)
        .setTokenSymbol(courseTitle.substring(0, 4).toUpperCase())
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(1000)
        .setInitialSupply(0)
        .setTreasuryAccountId(process.env.MY_ACCOUNT_ID)
        .setSupplyKey(PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY))
        .freezeWith(client)
        .sign(PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY));

    const response = await tx.execute(client);
    const receipt = await response.getReceipt(client);
    return receipt.tokenId.toString(); // return the token ID
};