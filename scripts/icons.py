from PIL import Image, ImageDraw
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'public'
im=Image.new('RGBA',(512,512),'#faf5e9')
layer=Image.new('RGBA',(512,512))
d=ImageDraw.Draw(layer)
d.rounded_rectangle((204,112,308,372),radius=15,fill='#e6ae35')
d.polygon([(204,365),(308,365),(256,445)],fill='#dbb58c')
d.polygon([(240,420),(256,445),(272,420)],fill='#344b45')
d.line((230,145,230,350),fill='#f8d577',width=14)
d.line((280,145,280,350),fill='#f8d577',width=14)
d.rounded_rectangle((204,90,308,155),radius=15,fill='#d87973')
im.alpha_composite(layer.rotate(-35,resample=Image.Resampling.BICUBIC))
for size in (192,512): im.resize((size,size),Image.Resampling.LANCZOS).convert('RGB').save(root/f'icon-{size}.png')
