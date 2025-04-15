FROM node:20 AS builder

ARG VITE_API_URI
ENV VITE_API_URI=$VITE_API_URI

WORKDIR /app

COPY . ./

RUN npm install

RUN npm run build

FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx","-g","daemon off;"]
