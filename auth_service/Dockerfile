# Sử dụng Node.js image chính thức
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và cài đặt dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Mở port (thay đổi nếu bạn dùng port khác)
EXPOSE 5001

# Lệnh chạy app
CMD ["node", "server.js"]
