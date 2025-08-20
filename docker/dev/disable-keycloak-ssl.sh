docker exec -it dev-keycloak-auth-1 bash -c "
  cd /opt/keycloak/bin && \
  ./kcadm.sh config credentials --server http://localhost:7080 --realm master --user admin --password admin && \
  ./kcadm.sh update realms/master -s sslRequired=NONE && \
  ./kcadm.sh config credentials --server http://localhost:7080 --realm inventory-realm --user admin --password admin && \
  ./kcadm.sh update realms/inventory-realm -s sslRequired=NONE
"