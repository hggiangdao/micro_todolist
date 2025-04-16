# Base image từ Node.js
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json trước để cài dependency
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở port mà service này chạy (ví dụ: 5002)
EXPOSE 5002

# Command để chạy app
CMD ["node", "server.js"]
