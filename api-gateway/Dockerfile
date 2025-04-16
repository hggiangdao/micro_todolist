# Base image Node.js
FROM node:18

# Tạo thư mục app trong container
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Expose port (ví dụ api gateway chạy cổng 3000)
EXPOSE 3000

# Lệnh chạy app
CMD ["node", "apigateway.js"]
