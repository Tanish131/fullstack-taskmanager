FROM node:18

WORKDIR /app

# Copy backend
COPY backend ./backend
RUN cd backend && npm install

# Copy frontend
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Set environment
ENV PORT=5001

EXPOSE 5001

CMD ["node", "backend/src/app.js"]