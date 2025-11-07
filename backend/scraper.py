import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        title_node = soup.find('h1', id='firstHeading')
        if not title_node:
            raise ValueError("Could not find article title")
        title = title_node.text
        
        content_div = soup.find('div', id='mw-content-text')
        
        if not content_div:
            raise ValueError("Could not find main article content")

        paragraphs = content_div.find_all('p', limit=25)
        
        clean_text = ""
        for p in paragraphs:
            for sup in p.find_all('sup'):
                sup.decompose()
            
            clean_text += p.get_text() + "\n"
            
        clean_text = ' '.join(clean_text.split())
        
        if not clean_text:
            raise ValueError("Extracted content is empty")
            
        return title, clean_text

    except requests.exceptions.RequestException as e:
        raise ValueError(f"Error fetching URL: {e}")
    except Exception as e:
        raise ValueError(f"Error scraping content: {e}")