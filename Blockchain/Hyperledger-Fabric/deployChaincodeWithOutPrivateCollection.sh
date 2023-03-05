. ./envVar.sh
export PATH=./bin:${PWD}:$PATH
fileName=$1
presetup(){
    echo Vendoring Go dependencies ...
    pushd ./artifacts/src/github.com/$fileName/
    GO111MODULE=on go mod vendor
    popd
    echo Finished vendoring Go dependencies
}
presetup

CHANNEL_NAME="mychannel"
CC_RUNTIME_LANGUAGE="golang"
VERSION="1"
CC_SRC_PATH="./artifacts/src/github.com/${fileName}/"
CC_NAME=$fileName

# packageChaincode(){
#     rm -rf ${CC_NAME}.tar.gz
#     setGlobalsForPeer0Org1
#     peer lifecycle chaincode package ${CC_NAME}.tar.gz \
#     --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} \
#     --label ${CC_NAME}_${VERSION}
#     echo "===================== Chaincode is packaged on peer0.org1 ===================== "
# }
 # packageChaincode

installChaincode(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode install ./artifacts/src/github.com/chaincode-external/asset-transfer-basic-external.tgz

    echo "===================== Chaincode is installed on peer0.org1 ===================== "

    setGlobalsForPeer1Org1
    peer lifecycle chaincode install ./artifacts/src/github.com/chaincode-external/asset-transfer-basic-external.tgz
    echo "===================== Chaincode is installed on peer1.org1 ===================== "

    setGlobalsForPeer0Org2
    peer lifecycle chaincode install ./artifacts/src/github.com/chaincode-external/asset-transfer-basic-external.tgz
    echo "===================== Chaincode is installed on peer0.org2 ===================== "

    setGlobalsForPeer1Org2
    peer lifecycle chaincode install ./artifacts/src/github.com/chaincode-external/asset-transfer-basic-external.tgz
    echo "===================== Chaincode is installed on peer1.org2 ===================== "
}

# installChaincode

function cp_packageid {
    sed -e "s/\${PACKAGEID}/$1/" \
        chaincode-template.env
}

queryInstalled(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
     PACKAGE_ID=$(sed -n "/basic_1.0/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${PACKAGE_ID}
    export PACKAGE_ID
    
    echo "===================== Query installed successful on peer0.org1 on channel ===================== "
}

externalchaincode(){
     pushd ./artifacts/src/github.com/$fileName/
        echo "$(cp_packageid $PACKAGE_ID)" > chaincode.env
        docker build -t hyperledger/asset-transfer-basic .
        docker-compose -f docker-compose-chaincode.yaml up -d  asset-transfer-basic.org1.example.com
        # docker run -it --rm --name asset-transfer-basic.org1.example.com --hostname asset-transfer-basic.org1.example.com --env-file chaincode.env --network=artifacts_test hyperledger/asset-transfer-basic

    popd
}
# queryInstalled

approveForMyOrg1(){
    setGlobalsForPeer0Org1
    export $PACKAGE_ID
    peer lifecycle chaincode approveformyorg -o localhost:7050  \
    --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED \
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
    --isInit -c '{"function":"InitLedger","Args":[]}'

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

# packageChaincode
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
