. ./envVar.sh
. ./helperFunction.sh

export PATH=./bin:${PWD}:$PATH
fileName=$1
CHANNEL_NAME="mychannel"
VERSION=$2
SEQUENCE=$2'.0'
ORG=$3
DOMAIN=$4
PORT=$5
CC_SRC_PATH="./artifacts/src/github.com/${fileName}/"
CC_NAME=$fileName
CONTRACTADDRESS=$CC_NAME'.'$ORG'.'$DOMAIN
CONTRACTTAR=$CC_NAME'-external.tgz'

presetup(){
    echo Vendoring Go dependencies ...
    pushd ./artifacts/src/github.com/$fileName/
        echo "$(cp_connection_json $CC_NAME $ORG $DOMAIN $PORT)" > connection.json
        echo "$(cp_metadata_json $CC_NAME $SEQUENCE)" > metadata.json
        tar cfz code.tar.gz connection.json
        tar cfz $CONTRACTTAR metadata.json code.tar.gz
        echo " Done ---!"
    popd
    echo Finished vendoring Go dependencies
}




installChaincode(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode install ./artifacts/src/github.com/$CC_NAME/$CONTRACTTAR

    echo "===================== Chaincode is installed on peer0.org1 ===================== "

    setGlobalsForPeer1Org1
    peer lifecycle chaincode install ./artifacts/src/github.com/$CC_NAME/$CONTRACTTAR
    echo "===================== Chaincode is installed on peer1.org1 ===================== "

    setGlobalsForPeer0Org2
    peer lifecycle chaincode install ./artifacts/src/github.com/$CC_NAME/$CONTRACTTAR
    echo "===================== Chaincode is installed on peer0.org2 ===================== "

    setGlobalsForPeer1Org2
    peer lifecycle chaincode install ./artifacts/src/github.com/$CC_NAME/$CONTRACTTAR
    echo "===================== Chaincode is installed on peer1.org2 ===================== "
}

# installChaincode



queryInstalled(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${PACKAGE_ID}
    export PACKAGE_ID=${PACKAGE_ID}

    echo "===================== Query installed successful on peer0.org1 on channel ===================== "
}

externalchaincode(){
     pushd ./artifacts/src/github.com/$fileName/
        echo "$(cp_packageid $PACKAGE_ID)" > chaincode.env
        echo "$(cp_package_json $PACKAGE_ID $CONTRACTADDRESS $PORT)" > package.json

        docker build -t hyperledger/$CC_NAME .
        docker-compose -f docker-compose-chaincode.yaml up -d  $CC_NAME.org1.example.com
        # docker run -it --rm --name usermanagement.org1.example.com --hostname usermanagement.org1.example.com --env-file chaincode.env --network=artifacts_test hyperledger/usermanagement

    popd
}
# queryInstalled

approveForMyOrg1(){
    setGlobalsForPeer0Org1

    peer lifecycle chaincode approveformyorg -o localhost:7050  \
    --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED \
    --collections-config ${CC_SRC_PATH}collections_config.json --signature-policy "OR('Org1MSP.member','Org2MSP.member')" \
    --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
    --init-required --package-id ${PACKAGE_ID} --sequence ${VERSION} --waitForEvent

# peer lifecycle chaincode approveformyorg -o orderer0.dxb.com:7050 --ordererTLSHostnameOverride orderer0.dxb.com
#     --channelID avanzachannel --name signing_certificates --version 5
#     --collections-config ./signing_certificates2/collections_config.json
#     --signature-policy "AND('org1MSP.member','org2MSP.member')" -
#     -init-required --package-id signing_certificates:61a0c22310cfcc6c90f855fc54053730b32e268dead2923f47cec01bb0df5834
#      --sequence 5 --tls true
#      --cafile /go/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/dxb.com/orderers/orderer0.dxb.com/msp/tlsintermediatecerts/tlsca.dxb.com-cert.pem
#      --waitForEvent;


    echo "===================== chaincode approved from org 1 ===================== "

}

# approveForMyOrg1

# --signature-policy "OR ('Org1MSP.member')"
# --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA
# --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles $PEER0_ORG2_CA
#--channel-config-policy Channel/Application/Admins
# --signature-policy "OR ('Org1MSP.peer','Org2MSP.peer')"


checkCommitReadyness(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode checkcommitreadiness \
    --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
    --sequence ${VERSION} --output json --init-required
    echo "===================== checking commit readyness from org 1 ===================== "
}

# checkCommitReadyness

approveForMyOrg2(){
   setGlobalsForPeer0Org2

    peer lifecycle chaincode approveformyorg -o localhost:7050  \
    --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED \
    --collections-config ${CC_SRC_PATH}collections_config.json --signature-policy "OR('Org1MSP.member','Org2MSP.member')" \
    --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
    --init-required --package-id ${PACKAGE_ID} --sequence ${VERSION} --waitForEvent

    echo "===================== chaincode approved from org 2 ===================== "
}

# approveForMyOrg2

checkCommitReadyness(){

    setGlobalsForPeer0Org1
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA --name ${CC_NAME} \
    --version ${VERSION} --sequence ${VERSION} --output json --init-required
    echo "===================== checking commit readyness from org 1 ===================== "
}

# checkCommitReadyness

commitChaincodeDefination(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    --tls $CORE_PEER_TLS_ENABLED  --cafile $ORDERER_CA \
    --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --collections-config ${CC_SRC_PATH}collections_config.json --signature-policy "OR('Org1MSP.member','Org2MSP.member')" \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --version ${VERSION} --sequence ${VERSION} --init-required

}

# commitChaincodeDefination

queryCommitted(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

}

# queryCommitted

chaincodeInvokeInit(){
    setGlobalsForPeer0Org1
    peer chaincode invoke -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --isInit -c '{"function":"","Args":[]}'

}

# chaincodeInvokeInit

chaincodeInvoke(){
    # setGlobalsForPeer0Org1
    # peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    # --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} \
    # --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    # --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA  \
    # -c '{"function":"initLedger","Args":[]}'

    setGlobalsForPeer0Org1

    ## Create Car
    # peer chaincode invoke -o localhost:7050 \
    #     --ordererTLSHostnameOverride orderer.example.com \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --cafile $ORDERER_CA \
    #     -C $CHANNEL_NAME -n ${CC_NAME}  \
    #     --peerAddresses localhost:7051 \
    #     --tlsRootCertFiles $PEER0_ORG1_CA \
    #     --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA $PEER_CONN_PARMS  \
    #     -c '{"function": "CreateCar","Args":["Car-ABCDEEE", "Audi", "R8", "Red", "Pavan"]}'

    ## Change car owner
    peer chaincode invoke -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME}  \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA  \
    -c '{"function": "","Args":[]}'
}

# chaincodeInvoke

chaincodeQuery(){
      setGlobalsForPeer0Org1

      # Query all cars
      # peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["queryAllCars"]}'

      # Query Car by Id
      peer chaincode query -C mychannel -n users -c '{"function": "QueryAllBossId","Args":[""]}'
    #'{"Args":["GetSampleData","Key1"]}'
}

# chaincodeQuery

# Run this function if you add any new dependency in chaincode
# presetup

presetup
installChaincode
queryInstalled
externalchaincode
approveForMyOrg1
checkCommitReadyness
approveForMyOrg2
checkCommitReadyness
commitChaincodeDefination
queryCommitted
chaincodeInvokeInit
# sleep 5
# chaincodeInvoke
# sleep 3
# chaincodeQuery




