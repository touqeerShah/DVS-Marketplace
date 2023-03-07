## TLS Enable

https://medium.com/@pouyashojaei85/enabling-ssl-for-docker-couchdb-container-127388eca1a8

## Certificate Generation

https://github.com/aldredb/external-ca

openssl ecparam -name prime256v1 -genkey -noout -out rca.identity.org1.example.com.key

openssl req -config openssl_root-identity.cnf -new -x509 -sha256 -extensions v3_ca -key rca.identity.org1.example.com.key -out rca.identity.org1.example.com.cert -days 3650 -subj "/C=SG/ST=Singapore/L=Singapore/O=org1.example.com/OU=/CN=rca.identity.org1.example.com" -CAcreateserial
