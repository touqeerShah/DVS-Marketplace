!/bin/bash 

set -ex

. ./createChannel.sh



# Bring the test network down
pushd ./artifacts
docker-compose up -d   ca-org1  ca-org2
sleep 5
docker-compose up -d    orderer.example.com   orderer2.example.com   orderer3.example.com
sleep 5
docker-compose up -d couchdb0 couchdb1 couchdb2 couchdb3
sleep 3
docker-compose up -d  peer0.org1.example.com peer0.org2.example.com
sleep 2
docker-compose up -d peer1.org1.example.com peer1.org2.example.com

popd

#
setup_channel
# pushd ./artifacts/src/github.com/supplychain/
# tar cfz code.tar.gz connection.json
# tar cfz supplychain-external.tgz metadata.json code.tar.gz
# echo " Done ---!"
# popd
# https://stackoverflow.com/questions/69314626/why-do-i-get-a-tar-error-opening-archive-unrecognized-archive-format-error-w
# ssh debian@127.0.0.1 -p 22022 -N -L/tmp/docker-on-debian.sock:/var/run/docker.sock ssh://debian@127.0.0.1
# https://www.codeluge.com/post/setting-up-docker-on-macos-m1-arm64-to-use-debian-10.4-docker-engine/
# https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic/chaincode-external