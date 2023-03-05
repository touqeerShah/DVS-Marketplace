function cp_packageid {
    sed -e "s/\${PACKAGEID}/$1/" \
        chaincode-template.env
}

function cp_connection_json {
    sed -e "s/\${CC_NAME}/$1/" \
        -e "s/\${ORG}/$2/" \
        -e "s/\${DOMAIN}/$3/" \
        -e "s/\${PORT}/$4/" \
        connection-template.json
}
function cp_metadata_json {
    sed -e "s/\${CC_NAME}/$1/" \
        -e "s/\${SEQUENCE}/$2/" \
        metadata-template.json
}


function cp_package_json {
    sed -e "s/\${PACKAGEID}/$1/" \
        -e "s/\${CONTRACTADDRESS}/$2/" \
        -e "s/\${PORT}/$3/" \
        package-template.json
}