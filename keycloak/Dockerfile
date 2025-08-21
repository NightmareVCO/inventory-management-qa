FROM quay.io/keycloak/keycloak:26.2.5 AS dev

COPY inventory-realm-development.json /opt/keycloak/data/import/realm.json

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

FROM quay.io/keycloak/keycloak:26.2.5 AS prod

COPY inventory-realm-production.json /opt/keycloak/data/import/realm.json

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]