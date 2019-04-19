# ShinyTouch

[![CircleCI](https://circleci.com/gh/cameron-martin/shinytouch/tree/master.svg?style=svg)](https://circleci.com/gh/cameron-martin/shinytouch/tree/master)

Turns your screen into a touchscreen using a webcam.

[Go to app](https://shinytouch.app/)

## Local development

### Frontend

```sh
cd frontend
yarn install
yarn start
```

### API Server

```sh
cd api
docker-compose up
```

On first run, you must create the necessary s3 buckets. In future this will be handled by cloudformation (#7).

```sh
./ls3.sh mb s3://calibration-examples
```