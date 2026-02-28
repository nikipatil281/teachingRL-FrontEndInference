import random
import urllib.parse

icons = [
    # Formal Coffee Cup / Mug
    '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>',
    # Correct Coffee Bean
    '<path d="M10.5 2c-3.5 0-6.5 3-6.5 7.5S6.5 19 10 20.5 18 18.5 19.5 15 20 5.5 16.5 3 13.5 2 10.5 2z"/><path d="M7.5 16.5c1-1 2-2 1.5-4s-1-2.5-1-4.5 1-3.5 2-4.5" fill="none" stroke-width="2"/>',
    # Coffee Maker
    '<path d="M8 2h8a2 2 0 0 1 2 2v2H6V4a2 2 0 0 1 2-2z"/><path d="M6 6h12v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6z"/><path d="M10 12h4v8a2 2 0 0 1-2 2h-0a2 2 0 0 1-2-2v-8z"/><path d="M4 12v6a2 2 0 0 0 2 2h2"/><path d="M18 12v6a2 2 0 0 1-2 2h-2"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/>',
    # To-go Cup
    '<path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/><path d="M18 2v2"/><path d="M4 6h16"/><path d="M5 6l1.3 12.2A2 2 0 0 0 8.3 20h7.4a2 2 0 0 0 2-1.8L19 6"/>',
    # Cookie
    '<circle cx="12" cy="12" r="10"/><path d="M7 10v.01"/><path d="M11 14v.01"/><path d="M15 9v.01"/><path d="M8 15v.01"/><path d="M16 15v.01"/><path d="M11 7v.01"/>',
    # Donut
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
    # Storefront
    '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>',
    # Small Coffee Bag
    '<path d="M6 3v4"/><path d="M18 3v4"/><path d="M4 7h16l-2 15H6L4 7z"/>'
]

# Grid Configuration
WIDTH = 800
HEIGHT = 800
CELL_SIZE = 80 # 10x10 grid -> 100 icons

# Filler small elements (WhatsApp has lots of scattered dots / small stars)
filler_icons = [
    '<circle cx="12" cy="12" r="2" fill="currentColor"/>',
    '<circle cx="12" cy="12" r="3" fill="currentColor"/>',
    '<path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" transform="scale(0.5) translate(12,12)" fill="currentColor"/>'
]

random.seed(42)  # For deterministic output

output = []
output.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">')

for row in range(10):
    for col in range(10):
        # Base position
        x_c = col * CELL_SIZE + (CELL_SIZE / 2)
        y_c = row * CELL_SIZE + (CELL_SIZE / 2)
        
        # Wiggle
        dx = random.uniform(-20, 20)
        dy = random.uniform(-20, 20)
        
        # We need continuous wrapping so the pattern tiles seamlessly.
        # But for CSS mask repeat, we can just allow the boundary items to clip OR constrain them.
        # Actually, if we translate(x, y), things that bleed over the edge won\'t show up on the other side unless we specifically duplicate them.
        # To make a seamless repeating pattern, checking boundaries is needed. But an 800x800 tile with 10x10 margin padding is totally fine without seamless wrapping at the edges, 
        # because the icons are packed tightly, but let\'s make it as tileable as possible by duplicating items that fall near edges.
        
        x = x_c + dx
        y = y_c + dy
        rot = random.uniform(-30, 30)
        scale = random.uniform(1.2, 1.8)
        
        icon = random.choice(icons)
        
        group = f'<g transform="translate({x}, {y}) rotate({rot}) scale({scale}) translate(-12, -12)">{icon}</g>'
        output.append(group)
        
        # Edge wrapping
        wrap_x = x - WIDTH if x > WIDTH - 40 else (x + WIDTH if x < 40 else None)
        wrap_y = y - HEIGHT if y > HEIGHT - 40 else (y + HEIGHT if y < 40 else None)
        
        if wrap_x is not None:
            output.append(f'<g transform="translate({wrap_x}, {y}) rotate({rot}) scale({scale}) translate(-12, -12)">{icon}</g>')
        if wrap_y is not None:
            output.append(f'<g transform="translate({x}, {wrap_y}) rotate({rot}) scale({scale}) translate(-12, -12)">{icon}</g>')
        if wrap_x is not None and wrap_y is not None:
            output.append(f'<g transform="translate({wrap_x}, {wrap_y}) rotate({rot}) scale({scale}) translate(-12, -12)">{icon}</g>')

# Sprinkle some fillers
for i in range(50):
    x = random.uniform(0, WIDTH)
    y = random.uniform(0, HEIGHT)
    rot = random.uniform(0, 360)
    scale = random.uniform(0.5, 1.0)
    icon = random.choice(filler_icons)
    group = f'<g transform="translate({x}, {y}) rotate({rot}) scale({scale}) translate(-12, -12)">{icon}</g>'
    output.append(group)

output.append('</svg>')

svg_str = "".join(output)

# Percent encode for data URI
# Reference for safe characters in CSS data URI: we must encode < > # and % 
# Using urllib.parse.quote will encode properly.
escaped = urllib.parse.quote(svg_str)

result = f"url(\"data:image/svg+xml,{escaped}\")"

with open("doodle_css.txt", "w") as f:
    f.write(result)
