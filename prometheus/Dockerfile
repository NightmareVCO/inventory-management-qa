FROM prom/prometheus AS dev

COPY prometheus.development.yml /etc/prometheus/prometheus.yml

FROM prom/prometheus AS prod

COPY prometheus.production.yml /etc/prometheus/prometheus.yml