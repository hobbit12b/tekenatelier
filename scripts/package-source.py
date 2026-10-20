from pathlib import Path
import json,base64,zipfile,sys
root=Path(__file__).resolve().parents[1]
paths=[]
for folder in ['src','public','scripts','.github']:
    paths.extend(p for p in (root/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
paths.extend(p for p in root.iterdir() if p.is_file())
if '--json' in sys.argv:
    print(json.dumps([{'path':p.relative_to(root).as_posix(),'encoding':'base64' if p.suffix=='.png' else 'utf-8','content':base64.b64encode(p.read_bytes()).decode() if p.suffix=='.png' else p.read_text(encoding='utf-8')} for p in paths],ensure_ascii=True))
else:
    with zipfile.ZipFile(root.parent/'tekenatelier-broncode.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in paths:z.write(p,'tekenatelier/'+p.relative_to(root).as_posix())
    with zipfile.ZipFile(root.parent/'tekenatelier-website.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in (root/'dist').rglob('*'):
            if p.is_file():z.write(p,p.relative_to(root/'dist').as_posix())
    print('Broncode- en websitearchief gemaakt.')
