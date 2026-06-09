# Usamos la imagen oficial de KrakenD
FROM devopsfaith/krakend:2.6

# Copiamos nuestra configuración dentro de la imagen
COPY krakend.json /etc/krakend/krakend.json

# Exponemos el puerto del BFF
EXPOSE 8080

# El comando de arranque por defecto
CMD ["run", "-c", "/etc/krakend/krakend.json"]