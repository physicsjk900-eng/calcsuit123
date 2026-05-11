import os
import glob

base_dir = r"d:\Calculators"
images_dir = "images/favicon.png"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(root, file)
            # Calculate relative path
            rel_path = os.path.relpath(file_path, base_dir)
            depth = rel_path.count(os.sep)
            
            if depth == 0:
                favicon_path = "./images/favicon.png"
            else:
                favicon_path = "../" * depth + "images/favicon.png"
                
            favicon_tag = f'    <link rel="icon" type="image/png" href="{favicon_path}">\n'
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if "favicon.png" not in content and "rel=\"icon\"" not in content:
                # Insert before </head>
                if "</head>" in content:
                    content = content.replace("</head>", favicon_tag + "</head>")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Added to {file_path}")
                else:
                    print(f"Skipped {file_path} (no </head> tag)")
