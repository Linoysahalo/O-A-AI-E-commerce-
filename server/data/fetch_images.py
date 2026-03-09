import json
import requests
import time
import urllib.parse
import re


def get_high_res_google_image(search_query):
    url = f"https://www.google.com/search?q={urllib.parse.quote(search_query)}&tbm=isch"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        actual_images = re.findall(r'\["(http.*?s)",\d+,\d+\]', response.text)

        for img_url in actual_images:
            clean_url = img_url.replace('\\u003d', '=').replace('\\u0026', '&')

            if "gstatic" not in clean_url and "google" not in clean_url:
                if any(ext in clean_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    return clean_url
    except Exception as e:
        print(f"Error searching for {search_query}: {e}")
    return ""


def update_json_with_links(json_path='final_products_details.json'):
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
    except FileNotFoundError:
        print(f"Error: {json_path} not found.")
        return

    print(f"Starting to fetch image links for {len(products)} products...")

    for i, product in enumerate(products):
        name = product.get('Name', '')
        brand = product.get('Brand Name', '')

        query = f"{name} {brand} sephora product"
        print(f"[{i + 1}/{len(products)}] Finding image for: {name}")

        image_url = get_high_res_google_image(query)

        if image_url:
            product['pic'] = image_url
            print(f"   ✓ Found link.")
        else:
            print(f"   ! No direct link found.")
        time.sleep(1.5)

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=4, ensure_ascii=False)

    print(f"\nDone! Updated {json_path} with direct image links.")


if __name__ == "__main__":
    update_json_with_links()