first create ENV for Docker compose secret
then create image 
the up your image

https://medium.com/@leonfeng/set-up-a-secured-mongodb-container-e895807054bd


mongosh -u dvs -p dvs
use dvs
db.createUser({ user: "dvs", pwd: "dvs123", roles: [{ role: "dbOwner", db: "dvs" }] })
 