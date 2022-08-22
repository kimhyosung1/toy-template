# FROM node:12
FROM 591362340905.dkr.ecr.ap-northeast-2.amazonaws.com/khs_base:latest as build


LABEL maintainer="stop70899@naver.com"
# 앱 디렉터리 생성
# WORKDIR /hello_docker
WORKDIR /capa
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
COPY ./${NODE_ENV}.env .
COPY package*.json ./


RUN npm install
# 프로덕션을 위한 코드를 빌드하는 경우
# RUN npm ci --only=production

# 앱 소스 추가
COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/main" ]

FROM 591362340905.dkr.ecr.ap-northeast-2.amazonaws.com/khs_base:latest as capa
WORKDIR /capa
COPY --from=build /capa /capa

# docker build --tag nest-deploy:0.0.1 .
# docker build -t --tag nest-deploy:0.0.1 -f . 
# docker run --name nest-deploy -d -p 8080:8080 nest-deploy:0.0.1
