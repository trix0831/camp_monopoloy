docker build . -t goldbeauty
docker tag goldbeauty asia-east1-docker.pkg.dev/summer26-goldbeauty/goldbeauty/goldbeauty-v2
docker push asia-east1-docker.pkg.dev/summer26-goldbeauty/goldbeauty/goldbeauty-v2

gcloud run deploy goldbeauty \
  --image asia-east1-docker.pkg.dev/summer26-goldbeauty/goldbeauty/goldbeauty-v2 \
  --region asia-east1 \
  --platform managed \
  --allow-unauthenticated \
  --port 4000 \
  --project summer26-goldbeauty
