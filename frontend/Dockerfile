FROM node:20-alpine

WORKDIR /app

COPY . .

RUN if [ -f "package.json" ]; then npm install; fi

EXPOSE 5173

CMD if [ -f "package.json" ]; then npm run dev -- --host; else tail -f /dev/null; fi
