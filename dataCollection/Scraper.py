import requests
from bs4 import BeautifulSoup
import csv
import re
from tqdm import tqdm  # Import tqdm for progress bar

def fetch_character_info(input_csv, output_csv):
    base_url = "https://wiki.wanderinginn.com/"

    # Read names from input CSV
    with open(input_csv, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        names = [row[0].strip() for row in reader]  # Assumes names are in the first column

    # Open output CSV for writing
    with open(output_csv, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Name", "Gender", "Age", "Species", "Status", "Affiliation", "Residence", "Occupation"])
        writer.writeheader()

        # Set up the progress bar
        with tqdm(total=len(names), unit="char", ncols=80) as progress_bar:
            for name in names:
                tqdm.write(f"\rProcessing: {name}")
                info = {key: '' for key in ["Name", "Gender", "Age", "Species", "Status", "Affiliation", "Residence", "Occupation"]}

                search_url = f"{base_url}index.php?search={name}"
                try:
                    response = requests.get(search_url, allow_redirects=True, timeout=10)
                except requests.exceptions.RequestException as e:
                    tqdm.write(f"Failed to fetch data for {name}. Error: {e}")
                    progress_bar.update(1)
                    continue

                if response.status_code != 200:
                    tqdm.write(f"Failed to fetch data for {name}. Status code: {response.status_code}")
                    progress_bar.update(1)
                    continue

                soup = BeautifulSoup(response.content, 'html.parser')

                # Detect search results
                if soup.find('div', class_='searchresults') or soup.find('h1', class_='firstHeading', string="Search Results"):
                    search_results = soup.select('.mw-search-result-heading > a')
                    if search_results:
                        tqdm.write(f"\nSearch results for {name}:")
                        for i, link in enumerate(search_results, start=1):
                            result_name = link.get_text(strip=True)
                            tqdm.write(f"{i}: {result_name}")
                        tqdm.write("Enter the number of the correct match (or 0 to skip): ")

                        try:
                            choice = int(input())
                        except ValueError:
                            tqdm.write("Invalid input. Skipping...")
                            progress_bar.update(1)
                            continue

                        if choice == 0:
                            tqdm.write(f"Skipping {name}.")
                            progress_bar.update(1)
                            continue

                        try:
                            character_url = base_url + search_results[choice - 1]['href']
                        except IndexError:
                            tqdm.write("Invalid choice. Skipping...")
                            progress_bar.update(1)
                            continue
                    else:
                        tqdm.write(f"No search results found for {name}. Skipping...")
                        progress_bar.update(1)
                        continue

                # Detect disambiguation page
                elif soup.find('div', id='disambig'):
                    disambig_section = soup.find('section', class_='section-collapsible', id='section-collapsible-0')
                    if disambig_section:
                        disambiguation_list = disambig_section.select('ul li a')
                        if disambiguation_list:
                            tqdm.write(f"\nDisambiguation results for {name}:")
                            for i, link in enumerate(disambiguation_list, start=1):
                                result_name = link.get_text(strip=True)
                                tqdm.write(f"{i}: {link['href']}")
                            tqdm.write("Enter the number of the correct match (or 0 to skip): ")

                            try:
                                choice = int(input())
                            except ValueError:
                                tqdm.write("Invalid input. Skipping...")
                                progress_bar.update(1)
                                continue

                            if choice == 0:
                                tqdm.write(f"Skipping {name}.")
                                progress_bar.update(1)
                                continue

                            try:
                                character_url = base_url + disambiguation_list[choice - 1]['href']
                            except IndexError:
                                tqdm.write("Invalid choice. Skipping...")
                                progress_bar.update(1)
                                continue
                        else:
                            tqdm.write(f"No disambiguation links found for {name}. Skipping...")
                            progress_bar.update(1)
                            continue



                # Direct redirect to a character page
                else:
                    character_url = response.url

                # Fetch character page
                try:
                    char_response = requests.get(character_url, timeout=10)
                except requests.exceptions.RequestException as e:
                    tqdm.write(f"Failed to fetch character page for {name}. Error: {e}")
                    progress_bar.update(1)
                    continue

                if char_response.status_code != 200:
                    tqdm.write(f"Failed to fetch character page for {name}. Status code: {char_response.status_code}")
                    progress_bar.update(1)
                    continue

                char_soup = BeautifulSoup(char_response.content, 'html.parser')

                # Extract the info table
                infobox_table = char_soup.select_one('.char-infobox-container table')

                if not infobox_table:
                    tqdm.write(f"No info table found for {name}. Skipping...")
                    progress_bar.update(1)
                    continue


                # Extract required fields
                rows = infobox_table.find_all('tr')
                for row in rows:
                    cells = row.find_all('td')
                    if len(cells) == 2:
                        key = cells[0].get_text(strip=True)
                        value = cells[1].get_text(strip=False).split('\n')[1:]  # Trim at first newline
                        key = cells[0].get_text(strip=True)
                        value = cells[1].get_text(strip=False).split('\n')[1:]  # Trim at first newline
                        value = ' | '.join(value)  # Replace '\n' with '|'
                        value = re.sub(r'(\s*\|\s*){2,}', ' | ', value)  # Remove consecutive pipes
                        value = re.sub(r'\[\d+\]', '', value)  # Remove footnotes [number]
                        value = re.sub(r'\(.*?\)', '', value)
                        # Only apply the '|' transformation to the 'Affiliation' column
                        if key == "Aliases":
                            infobox_title = char_soup.select_one('.infobox-title')
                            if infobox_title:
                                info["Name"] = f"{infobox_title.get_text(strip=True)} | {value}"  # Combine title and aliases
                        if key in info:
                            info[key] = value

                # Write the result to the CSV file periodically
                writer.writerow(info)
                file.flush()  # Flush the file buffer

                # Update progress bar
                progress_bar.update(1)

        print(f"\nResults saved to {output_csv}")

if __name__ == "__main__":
    input_csv = input("Enter the input CSV file name: ").strip()
    output_csv = input("Enter the output CSV file name: ").strip()
    fetch_character_info(input_csv, output_csv)
