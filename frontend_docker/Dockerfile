# Use a basic Nginx image
FROM nginx:alpine

# Copy the front-end build files to the default Nginx web directory
COPY ./build /usr/share/nginx/html

# Expose the port for the Nginx server
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
