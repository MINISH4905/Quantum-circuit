# Build context must be the repo root (not backend/) — knowledge_base/ lives
# one level above backend/ and there is no docker-compose-style host bind
# mount available in production, so it has to be baked into the image here.
# See render.yaml's dockerContext.
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"

COPY backend/ .
COPY knowledge_base /kb

# Matches the paths docker-compose.yml uses locally, so RAG behaves
# identically whether it's reading a bind mount or a baked-in copy.
ENV RAG_KB_DIR=/kb
ENV RAG_CHROMA_DIR=/rag_data/chroma_db

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
