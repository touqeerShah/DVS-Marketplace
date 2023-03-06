const rsasign = require('jsrsasign');
const crypto = require('crypto');
import { X509 } from 'jsrsasign';
const x509 = require('@ampretia/x509');

export class Cryptography {
  /**
   * check that if certificate is in PEM format
   * @param certificateStr certificate that must be check
   * @param type certificate type: User, CA,...
   */
  public static verifyCertificateFormat(certificateString: string): X509 {
    const normalizedCertificate = this.normalizeCert(certificateString);

    // verify Certificate format
    const certificate = new rsasign.X509();
    try {
      certificate.readCertPEM(normalizedCertificate);

      // Verify certificate expiration date
      if (Date.now() < rsasign.zulutodate(certificate.getNotBefore()) ||
          Date.now() > rsasign.zulutodate(certificate.getNotAfter())) {
        throw new Error(`Certificate Expired`);
      }
    } catch (ex) {
      throw new Error(ex.message);
    }

    return certificate;
  }

  /**
   * checks whether user certificate issued ans signed by CA or not?
   * @param userCertificate User cetificate in PEM Format
   * @param CACertificate CA certificate in PEM format
   */
  public static verifyCertificate(userCertificate: string, caCertificate: string): void {
    let certificate;
    try {
      certificate = this.verifyCertificateFormat(userCertificate);
    } catch (ex) {
      throw new Error(`User Certificate Error: ${ex.message}`);
    }

    try {
      this.verifyCertificateFormat(caCertificate);
    } catch (ex) {
      throw new Error(`CA Certificate Error: ${ex.message}`);
    }

    const hTbsCert = rsasign.ASN1HEX.getTLVbyList(certificate.hex, 0, [0]);
    const alg = certificate.getSignatureAlgorithmField();
    const signature = certificate.getSignatureValueHex();

    const sig = new rsasign.crypto.Signature({ alg });
    sig.init(caCertificate);
    sig.updateHex(hTbsCert);
    if (!sig.verify(signature)) {
      throw new Error(`Certificate Not Signed By CA`);
    }
  }

  public static getCertificateSubject(certificate: string): ICertificateSubject {
    const normalizedCert = this.normalizeCert(certificate);
    const issuerSubject = x509.getSubject(normalizedCert);
    return issuerSubject;
  }

  public static getIssuerSubject(certificate: string): ICertificateSubject {
    const normalizedCert = this.normalizeCert(certificate);
    const issuerSubject = x509.getIssuer(normalizedCert);
    return issuerSubject;
  }

  /**
   * checks whether user signed data by private key?
   * @param certificate user cetificate in PEM Format
   * @param clearData Data in clear format
   * @param signedData Data signed by user private key
   * @param algorithm sign algorithm
   */
  public static verifySignature(certificate: string,
                                clearData: string,
                                signedData: string,
                                algorithm: string): boolean {
    certificate = this.normalizeCert(certificate);
    algorithm = this.convertSignAlgorithm(algorithm);
    const buffer = Buffer.from(clearData, 'utf8');
    let verifier;
    try {
      verifier = crypto.createVerify(algorithm);
    } catch (error) {
      throw new Error(`Invalid Signature Algorithm`);
    }
    verifier.update(buffer);
    return verifier.verify(certificate, signedData, 'base64');
  }

  /**
   * check if certificate has not BEGIN & END then add them
   * @param certificate input certicate in PEM format
   */
  private static normalizeCert(certificate: string): string {
    if (!certificate.startsWith('-----BEGIN CERTIFICATE-----')) {
      certificate =
        '-----BEGIN CERTIFICATE-----\n' +
        certificate +
        '\n-----END CERTIFICATE-----';
    }
    return certificate;
  }

  /**
   * convert sign algorithm name to crypto module format
   * @param algorithm algorithm name
   */
  private static convertSignAlgorithm(algorithm: string): string {
    if (algorithm === 'SHA1withRSA') {
      return 'RSA-SHA1';
    }
    if (algorithm === 'SHA224withRSA') {
      return 'RSA-SHA224';
    }
    if (algorithm === 'SHA256withRSA') {
      return 'RSA-SHA256';
    }
    if (algorithm === 'SHA384withRSA') {
      return 'RSA-SHA384';
    }
    if (algorithm === 'SHA512withRSA') {
      return 'RSA-SHA512';
    }
    if (algorithm === 'MD5withRSA') {
      return 'RSA-MD5';
    }
    return algorithm;
  }

}

export interface ICertificateSubject {
  businessCategory: string;
  jurisdictionCountryName: string;
  jurisdictionStateOrProvinceName: string;
  serialNumber: string;
  streetAddress: string;
  postalCode: string;
  countryName: string;
  stateOrProvinceName: string;
  localityName: string;
  organizationName: string;
  commonName: string;
}
