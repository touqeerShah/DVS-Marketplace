/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "connection",
      "connection-org2.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities["ca.org2.example.com"].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system1 based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get("system1");
    if (userIdentity) {
      console.log(
        'An identity for the user "system1" already exists in the wallet'
      );
      return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get("admin2");
    if (!adminIdentity) {
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet'
      );
      console.log("Run the enrollAdmin.js application before retrying");
      return;
    }

    // build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: "org2.department1",
        enrollmentID: "system1",
        role: "client",
        attrs: [
          {
            name: "userid",
            value: "system1",
            ecert: true,
          },
          {
            name: "creator",
            value: "true",
            ecert: true,
          },
          {
            name: "mint",
            value: "true",
            ecert: true,
          },
          {
            name: "companyId",
            value: "evonik",
            ecert: true,
          },
        ],
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID: "system1",
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org2MSP",
      type: "X.509",
    };
    await wallet.put("system1", x509Identity);
    console.log(
      'Successfully registered and enrolled admin user "system1" and imported it into the wallet'
    );
  } catch (error) {
    console.error(`Failed to register user "system1": ${error}`);
    process.exit(1);
  }
}

main();
