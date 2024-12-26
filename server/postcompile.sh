if [ ! -d "dist/tools" ]; then
    mkdir "dist/tools/"
fi

cp -f tools/asciimg.py dist/tools/asciimg.py
cp -f tools/requirements.txt dist/tools/requirements.txt

python3 -m venv dist/asciimage
dist/asciimage/bin/pip install -r dist/tools/requirements.txt
