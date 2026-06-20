FROM libretranslate/libretranslate:latest

CMD ["--load-only", "fr,en,pt,zh,id", "--host", "0.0.0.0", "--port", "5000"]