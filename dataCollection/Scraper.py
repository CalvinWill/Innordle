import requests
import re
from bs4 import BeautifulSoup
import csv

def fetch_character_info(input_csv, output_csv):
    base_url = "https://wiki.wanderinginn.com/"
    
    # Read names from input CSV
    with open(input_csv, 'r') as file:
        reader = csv.reader(file)
        names = [row[0].strip() for row in reader]  # Assumes names are in the first column

    results = []

    for name in names:
        print(f"Searching for '{name}'...")
        search_url = f"{base_url}index.php?search={name}"
        try:
            response = requests.get(search_url, allow_redirects=True, timeout=10)
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch data for {name}. Error: {e}")
            continue

        if response.status_code != 200:
            print(f"Failed to fetch data for {name}. Status code: {response.status_code}")
            continue

        # Check if redirected directly to the character page
        redirected_name = None
        if response.url != search_url:
            character_url = response.url
            redirected_name = character_url.split('/')[-1]
            print(f"Redirected to: {character_url} (New Name: {redirected_name})")
        else:
            response.encoding = 'utf-8'
            soup = BeautifulSoup(response.content, 'html.parser')
            result_link = soup.find('a', class_='mw-search-result-heading')

            if not result_link:
                print(f"No direct match found for {name}.")
                continue

            character_url = base_url + result_link['href']
            redirected_name = character_url.split('/')[-1]
            print(f"Found potential match: {character_url} (New Name: {redirected_name})")

        # Fetch character page
        try:
            char_response = requests.get(character_url, timeout=10)
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch character page for {name}. Error: {e}")
            continue

        if char_response.status_code != 200:
            print(f"Failed to fetch character page for {name}. Status code: {char_response.status_code}")
            continue

        char_soup = BeautifulSoup(char_response.content, 'html.parser')

        # Extract the info table
        infobox_table = char_soup.select_one('.char-infobox-container table')

        if not infobox_table:
            print(f"No info table found for {name}.")
            continue

        # Extract required fields
        info = {key: '' for key in ["Name", "Gender", "Age", "Species", "Status", "Affiliation", "Residence", "Occupation"]}
        info["Name"] = name  # Original name
        rows = infobox_table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) == 2:
                key = cells[0].get_text(strip=True)
                value = cells[1].get_text(strip=False).split('\n')[1:]  # Trim at first newline
                # Only apply the '|' transformation to the 'Affiliation' column
                if key == "Affiliation":
                    value = ' | '.join(value)  # Replace '\n' with '|'
                    value = re.sub(r'(\s*\|\s*){2,}', ' | ', value)  # Remove consecutive pipes
                    value = re.sub(r'\[\d+\]', '', value)  # Remove footnotes [number]
                    value = re.sub(r'\(.*?\)', '', value)
                    info[key] = value
                elif key == "Aliases":
                    value = ' | '.join(value) 
                    value = re.sub(r'(\s*\|\s*){2,}', ' | ', value)  # Remove consecutive pipes
                    value = re.sub(r'\[\d+\]', '', value)  # Remove footnotes [number]
                    value = re.sub(r'\(.*?\)', '', value)
                    infobox_title = char_soup.select_one('.infobox-title')
                    if infobox_title:
                        # Combine the aliases with the infobox title
                        info["Name"] = f"{infobox_title.get_text(strip=True)} | {value}"
                elif key == "Residence":
                    value = ' | '.join(value)  # Replace '\n' with '|'
                    value = re.sub(r'(\s*\|\s*){2,}', ' | ', value)  # Remove consecutive pipes
                    value = re.sub(r'\[\d+\]', '', value)  # Remove footnotes [number]
                    value = re.sub(r'\(.*?\)', '', value)
                    info[key] = value
                elif key in info:
                    value = ' | '.join(value)  # Replace '\n' with '|'
                    value = re.sub(r'(\s*\|\s*){2,}', ' | ', value)  # Remove consecutive pipes
                    value = re.sub(r'\[\d+\]', '', value)  # Remove footnotes [number]
                    value = re.sub(r'\(.*?\)', '', value)
                    info[key] = value
        
        print(f"Info for {name}: {info}")
        results.append(info)

    # Save results to output CSV
    with open(output_csv, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Name", "Gender", "Age", "Species", "Status", "Affiliation", "Residence", "Occupation"])
        writer.writeheader()
        writer.writerows(results)

    print(f"Results saved to {output_csv}")

if __name__ == "__main__":
    input_csv = input("Enter the input CSV file name: ").strip()
    output_csv = input("Enter the output CSV file name: ").strip()
    fetch_character_info(input_csv, output_csv)

