import re

with open('doodle_css.txt', 'r') as f:
    doodle_url = f.read().strip()

with open('src/index.css', 'r') as f:
    css = f.read()

# Replace the bg-doodle-mask class definition completely
pattern = r'\.bg-doodle-mask\s*\{[^\}]+\}'
replacement = f'''.bg-doodle-mask {{
    -webkit-mask-image: {doodle_url};
    mask-image: {doodle_url};
    -webkit-mask-size: 800px 800px;
    mask-size: 800px 800px;
    -webkit-mask-repeat: repeat;
    mask-repeat: repeat;
}}'''

new_css = re.sub(pattern, replacement, css)

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(new_css)
