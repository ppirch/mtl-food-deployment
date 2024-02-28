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

def calculate_nutrients(results):
    nutrients = []
    for result in results:
        weight = result['regression']
        food_nutrient = result["classification"]
        food_name = food_nutrient[0] if food_nutrient[0] is not None else "Unknown"
        ref_weight = food_nutrient[1] if food_nutrient[1] is not None else 0
        calories = food_nutrient[2] if food_nutrient[2] is not None else 0
        protein = food_nutrient[3] if food_nutrient[3] is not None else 0
        nutrients.append({
            'food': food_name,
            'calories': calories * weight / ref_weight if ref_weight else 0,
            'weight': weight,
            'protein': protein * weight / ref_weight if ref_weight else 0,
        })
    return nutrients


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
n_classes = 39
segment_model = torch.hub.load("ultralytics/yolov5", 'custom',  path="./model/yolo-model.pt")
predict_model = SharedNet(backbone=backbone, n_classes=n_classes)
predict_model.load_state_dict(torch.load("./model/mtl-model.pt", map_location=torch.device('cpu')))
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
    before_nutrients = calculate_nutrients(before_results)
    after_nutrients = calculate_nutrients(after_results)
    consume = sum([nutrient['calories'] for nutrient in before_nutrients]) - sum([nutrient['calories'] for nutrient in after_nutrients])
    return {
            "before": calculate_nutrients(before_results), 
            "after": calculate_nutrients(after_results),
            "consume": consume
        }