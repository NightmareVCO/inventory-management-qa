FROM gradle:8.14-jdk-21-and-24-corretto AS build

WORKDIR /home/gradle/app

COPY --chown=gradle:gradle . .

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runner

ENV PORT=8080

VOLUME /app/logs

WORKDIR /app
RUN mkdir /app/logs

RUN addgroup --system spring && adduser --system --ingroup spring spring

COPY --from=build /home/gradle/app/build/libs/*.jar /app/app.jar

USER spring

ENTRYPOINT ["java", "-jar", "/app/app.jar"]