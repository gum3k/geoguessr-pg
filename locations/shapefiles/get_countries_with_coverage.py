import requests
from bs4 import BeautifulSoup
import re

# Function to clean and process country name to match the API format
def clean_country_name(country_name):
    # Remove text in parentheses, square brackets, everything after a comma or 'of', and asterisks
    return re.sub(r'\[.*?\]|\(.*?\)|,.*$|\*', '', country_name).strip()

# Get list of countries with Google Street View coverage from Wikipedia
url = "https://en.wikipedia.org/wiki/Google_Street_View_coverage"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Extract country names from the table
country_names = [
    clean_country_name(row.find_all('td')[0].text.strip())
    for row in soup.find('table', {'class': 'sortable'}).find_all('tr')[1:]
    if len(row.find_all('td')) >= 2
]

# Write the results to a text file
with open('countries_list.txt', 'w', encoding='utf-8') as file:
    file.writelines(f"{country}\n" for country in country_names)

print("Country codes with Street View coverage have been written to 'google_street_view_country_codes.txt'.")
