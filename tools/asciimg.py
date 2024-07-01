import cv2
import os
import math
import time

TEXTURE = {
    0: "  ",
    1: " .",
    2: " ▫",
    3: " □",
    4: " ░",
    5: " ▒",
    6: " ▪",
    7: " ■",
    8: " ◙",
    9: " ◘",
    10: " █",
}

VALID_TYPES = [".jpg", ".jpeg", ".png"]

OUTPUT_HEIGHT = 120
OUTPUT_WIDTH = 160

output_path = None


def main():
    start = time.time()
    try:
        img_path = os.environ["IMG_PATH"]
        if img_path in ("", None):
            raise ValueError("File path not specified.")
        global output_path 
        output_path = os.environ["OUTPUT_PATH"]
        if output_path in ("", None):
            raise ValueError("Output path is not specified.")
        files = []
        if not os.path.exists(img_path):
            raise FileNotFoundError(f"{img_path} is not a valid path.")
        elif os.path.isdir(img_path):
            for dir_path, _, file_names in os.walk(img_path):
                files.extend([os.path.join(dir_path, file) for file in file_names])
        elif os.path.isfile(img_path):
            files.append(img_path)
        for file in files:
            generate_acsii_file(file)
        end = time.time()
        time_taken = end - start
        print(f"Time taken to convert {len(files)} files : {time_taken:.2f} seconds.")
    except Exception as e:
        print(e)


def generate_acsii_file(file):
    full_name, file_ext = os.path.splitext(file)
    file_name = os.path.basename(full_name)
    if not file_ext in VALID_TYPES:
        print(f"{file_name}.{file_ext} is not valid.")
        return
    img = cv2.imread(file)
    img_height, img_width = img.shape[:2]
    ds_scale = max(img_width / OUTPUT_WIDTH, img_height / OUTPUT_HEIGHT)
    ds_height, ds_width = int(img_height / ds_scale), int(img_width / ds_scale)
    ds_img = cv2.resize(img, (ds_width, ds_height))
    hsv_img = cv2.cvtColor(ds_img, cv2.COLOR_BGR2HSV)
    _, _, v = cv2.split(hsv_img)
    if not os.path.exists(output_path):
        os.mkdir(output_path)
    output_file_path = os.path.join(output_path, f"{file_name}")
    ascii_img = ""
    for i in range(ds_height):
        for j in range(ds_width):
            value = int(v[i, j]) / 255
            quantized_value = int(math.floor(value * 100) / 10)
            ascii_img += TEXTURE[quantized_value]
        ascii_img += "\n"
    save_ascii_img(output_file_path, ascii_img)

def save_ascii_img(output_file_path, ascii_img):
    fs = open(output_file_path, "w")
    fs.write(ascii_img)
    fs.close()


if __name__ == "__main__":
    main()
