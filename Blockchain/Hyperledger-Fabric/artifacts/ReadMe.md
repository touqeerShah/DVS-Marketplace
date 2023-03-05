Step to deploy chaincoede external 
https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic/chaincode-external

connection.json
    Change name to the new contract name with port and tls certifcate if enable
Dockerfile
    Create image of chaincode image to deploy external
docker-compose-chaincode.yaml
    Docker-compose file for run chaincode image
chaincode.env
  this file export deployed chaincode id which help it to connect
metadata.json
  change the label to the with version and chaincode name
make modification in contract to make server so it will expose as a service 