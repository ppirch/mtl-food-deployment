import os
import time
from io import BytesIO

import torch
from PIL import Image
import torchvision.transforms as T

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from foodnet import SharedNet
from food_utilis import food_map

def img_transforms(img):
    transform = T.Compose(
        [
            T.ToPILImage(),
            T.Resize(256),
            T.CenterCrop(224),
            T.ToTensor(),
            T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )
    return transform(img)


def model_predict(img):
    yolo_out = segment_model(img)
    crops = yolo_out.crop(save=False)
    results = []
    for crop in crops:
        crop_img = crop['im']
        crop_img = img_transforms(crop_img)
        crop_img = crop_img.unsqueeze(0)
        outputs = predict_model(crop_img)
        reg_outs, cls_outs = outputs
        reg_outs = reg_outs.squeeze_(1).item()
        cls_outs = torch.argmax(cls_outs, 1).item()
        label = crop['label'].split()[0]
        results.append({"regression": reg_outs, "classification": food_map[label]})
    return results

time_str = time.strftime('%Y%m%d-%H%M%S')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "static")

backbone = "resnet50"
n_classes = 5
segment_model = torch.hub.load("ultralytics/yolov5", 'custom',  path="./model/yolo-model.pt")
predict_model = SharedNet(backbone=backbone, n_classes=n_classes)
predict_model.load_state_dict(torch.load("./model/mtl-model.pt"))
predict_model.eval()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
async def predict(
        before_image:UploadFile = File(...),
        after_image:UploadFile = File(...)):
    before_img = Image.open(BytesIO(await before_image.read()))
    after_img = Image.open(BytesIO(await after_image.read()))
    before_results = model_predict(before_img)
    after_results = model_predict(after_img)
    return {"before": before_results, "after": after_results}