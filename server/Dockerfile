FROM gradle:8.14-jdk-21-and-24-corretto AS dev

WORKDIR /app

EXPOSE 8080

CMD ["gradle", "bootRun", "--no-daemon"]

FROM gradle:8.14-jdk-21-and-24-corretto AS build

WORKDIR /home/gradle/app

COPY --chown=gradle:gradle . .

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine

ENV PORT=8080

VOLUME /app/logs

WORKDIR /app
RUN mkdir /app/logs

COPY --from=build /home/gradle/src/build/libs/*.jar /app/app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]