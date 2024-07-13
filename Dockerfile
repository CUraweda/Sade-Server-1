FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add --no-cache git alpine-sdk python3

COPY package*.json ./

RUN npm install
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD [ "node", "src/index.js" ]

FROM ubuntu:latest

# Install SSH server
RUN apt-get update && \
    apt-get install -y openssh-server && \
    mkdir /var/run/sshd

# Set root password (replace 'password' with your desired password)
RUN echo 'root:Root@123' | chpasswd

# Customize SSH configuration
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Expose SSH port
EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
