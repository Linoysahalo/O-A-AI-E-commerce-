import pandas as pd
import json

def fetch_details_for_selected(csv_path, summary_json_path, output_json='final_products_details.json'):
    df = pd.read_csv(csv_path)

    try:
        with open(summary_json_path, 'r', encoding='utf-8') as f:
            selected_summary = json.load(f)
    except FileNotFoundError:
        print(f"Error: {summary_json_path} not found.")
        return

    selected_ids = {str(p['ID']) for p in selected_summary}

    df['Price'] = ((df['price_usd'] * 3) / 5).round() * 5
    df['Price'] = df['Price'].astype(int)

    column_mapping = {
        'product_name': 'Name',
        'product_id': 'ID',
        'brand_name': 'Brand Name',
        'ingredients': 'Ingredients',
        'primary_category': 'Category',
        'secondary_category': 'Sub-category',
        'reviews': 'Reviews',
        'rating': 'Rating',
        'highlights': 'Description',
        'Price': 'Price'
    }

    df['product_id_str'] = df['product_id'].astype(str)
    final_df = df[df['product_id_str'].isin(selected_ids)].copy()

    final_df = final_df[list(column_mapping.keys())].rename(columns=column_mapping)
    final_df['pic'] = ''

    final_df.to_json(output_json, orient='records', indent=4, force_ascii=False)

    print(f"Success! Detailed info for {len(final_df)} products saved to {output_json}")

if __name__ == "__main__":
    fetch_details_for_selected('product_info.csv', 'products_list.json')