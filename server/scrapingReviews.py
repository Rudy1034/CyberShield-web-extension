import sys
import requests
import re
from bs4 import BeautifulSoup
from textblob import TextBlob
from urllib.parse import urlparse
import json

def extract_domain(url):
    """
    Extracts the domain name from the URL.
    """
    try:
        parsed_url = urlparse(url)
        return parsed_url.netloc.replace("www.", "")
    except Exception as e:
        return None

def fetch_reviews(domain):
    """
    Scrapes reviews for the given domain from Trustpilot.
    """
    search_url = f"https://www.trustpilot.com/review/{domain}"
    try:
        response = requests.get(search_url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract reviews, filtering irrelevant content
        reviews = []
        review_elements = soup.find_all('p')
        for p in review_elements:
            review_text = p.text.strip()
            if not re.match(r'^\d+%|Date of experience:|^\d+-star|Filter|Most relevant', review_text):
                reviews.append(review_text)

        return reviews
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch reviews: {str(e)}"}

def analyze_reviews(reviews):
    """
    Performs sentiment analysis on reviews and calculates positive, negative, and neutral percentages.
    """
    sentiments = {"positive": 0, "negative": 0, "neutral": 0}
    for review in reviews:
        polarity = TextBlob(review).sentiment.polarity
        if polarity > 0.1:
            sentiments["positive"] += 1
        elif polarity < -0.1:
            sentiments["negative"] += 1
        else:
            sentiments["neutral"] += 1

    total = len(reviews)
    return {k: round(v / total * 100, 2) if total else 0 for k, v in sentiments.items()}

if __name__ == "__main__":
    try:
        url = sys.argv[1]
        domain = extract_domain(url)

        if not domain:
            raise ValueError("Invalid URL provided.")

        # Fetch and analyze reviews
        reviews = fetch_reviews(domain)
        if isinstance(reviews, dict) and "error" in reviews:
            raise Exception(reviews["error"])

        sentiments = analyze_reviews(reviews)
        score = (
            1.0 if sentiments["positive"] > 50 else
            0.0 if sentiments["negative"] > 50 else
            0.5
        )

        # Output the result
        result = {
            "score": score,
            "details": {
                "sentiments": sentiments,
                "review_count": len(reviews)
            }
        }
        print(json.dumps(result))

    except Exception as e:
        error_result = {
            "score": 0.0,
            "details": {
                "error": str(e)
            }
        }
        print(json.dumps(error_result))
# import sys
# import requests
# import re
# from bs4 import BeautifulSoup
# from textblob import TextBlob
# from urllib.parse import urlparse
# import json

# def extract_domain(url):
#     """
#     Extracts the domain name from the URL.
#     """
#     try:
#         parsed_url = urlparse(url)
#         return parsed_url.netloc.replace("www.", "")
#     except Exception as e:
#         return None

# def fetch_reviews(domain):
#     """
#     Scrapes reviews for the given domain from Trustpilot.
#     """
#     search_url = f"https://www.trustpilot.com/review/{domain}"
#     try:
#         response = requests.get(search_url, headers={"User-Agent": "Mozilla/5.0"})
#         response.raise_for_status()
#         soup = BeautifulSoup(response.text, 'html.parser')

#         # Extract reviews, filtering irrelevant content
#         reviews = []
#         review_elements = soup.find_all('p')
#         for p in review_elements:
#             review_text = p.text.strip()
#             if not re.match(r'^\d+%|Date of experience:|^\d+-star|Filter|Most relevant', review_text):
#                 reviews.append(review_text)

#         return reviews
#     except requests.exceptions.RequestException as e:
#         return {"error": f"Failed to fetch reviews: {str(e)}"}

# def analyze_reviews(reviews):
#     """
#     Performs sentiment analysis on reviews and calculates positive, negative, and neutral percentages.
#     """
#     sentiments = {"positive": 0, "negative": 0, "neutral": 0}
#     for review in reviews:
#         polarity = TextBlob(review).sentiment.polarity
#         if polarity > 0.1:
#             sentiments["positive"] += 1
#         elif polarity < -0.1:
#             sentiments["negative"] += 1
#         else:
#             sentiments["neutral"] += 1

#     total = len(reviews)
#     return {k: round(v / total * 100, 2) if total else 0 for k, v in sentiments.items()}

# if __name__ == "__main__":
#     try:
#         url = sys.argv[1]
#         domain = extract_domain(url)

#         if not domain:
#             raise ValueError("Invalid URL provided.")

#         # Fetch and analyze reviews
#         reviews = fetch_reviews(domain)
#         if isinstance(reviews, dict) and "error" in reviews:
#             raise Exception(reviews["error"])

#         sentiments = analyze_reviews(reviews)

#         # Combine neutral with the dominant sentiment
#         if sentiments["positive"] >= sentiments["negative"]:
#             adjusted_positive = sentiments["positive"] + sentiments["neutral"]
#             adjusted_negative = sentiments["negative"]
#         else:
#             adjusted_negative = sentiments["negative"] + sentiments["neutral"]
#             adjusted_positive = sentiments["positive"]

#         # Determine the score based on adjusted sentiments
#         score = 1.0 if adjusted_positive > adjusted_negative else 0.0

#         # Output the result
#         result = {
#             "score": score,
#             "details": {
#                 "sentiments": {
#                     "positive": sentiments["positive"],
#                     "negative": sentiments["negative"],
#                     "neutral": sentiments["neutral"],
#                     "adjusted_positive": adjusted_positive,
#                     "adjusted_negative": adjusted_negative
#                 },
#                 "review_count": len(reviews)
#             }
#         }
#         print(json.dumps(result))

#     except Exception as e:
#         error_result = {
#             "score": 0.0,
#             "details": {
#                 "error": str(e)
#             }
#         }
#         print(json.dumps(error_result))

