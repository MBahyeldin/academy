FROM node:20-alpine
# Use Sharp's bundled libvips instead of compiling vips-dev from source.
# This avoids installing 214 Alpine packages and cuts build time dramatically.
RUN apk add --no-cache libc6-compat
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 1337
# develop mode: no pre-build step required, admin panel served with hot-reload
CMD ["npm", "run", "develop"]
