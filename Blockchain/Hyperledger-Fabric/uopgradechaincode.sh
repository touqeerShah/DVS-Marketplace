pushd ./artifacts/src/github.com/supplychain/
tar cfz code.tar.gz connection.json
tar cfz supplychain-external.tgz metadata.json code.tar.gz
echo " Done ---!"
popd
./installchaincode.sh
