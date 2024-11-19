import requests
import json

# Replace with your local Flask app URL
URL = "http://127.0.0.1:5000/rankings/download_rankings"

# Sample payload for testing
payload = {
    "startup_feedback": [
        {
            "startup_name": "InnovateX",
            "judges_feedback": [
                {
                    "scores": {
                        "problem": 8,
                        "solution": 7,
                        "innovation": 9,
                        "team": 8,
                        "business_model": 7,
                        "market_opportunity": 6,
                        "technical_feasibility": 8,
                        "execution_strategy": 7,
                        "communication": 7
                    },
                    "feedback": "Strong team but needs better communication of market opportunity."
                },
                {
                    "scores": {
                        "problem": 9,
                        "solution": 8,
                        "innovation": 9,
                        "team": 9,
                        "business_model": 8,
                        "market_opportunity": 7,
                        "technical_feasibility": 8,
                        "execution_strategy": 8,
                        "communication": 8
                    },
                    "feedback": "Excellent problem definition and solution, but refine execution strategy."
                }
            ]
        },
        {
            "startup_name": "TechNova",
            "judges_feedback": [
                {
                    "scores": {
                        "problem": 7,
                        "solution": 6,
                        "innovation": 8,
                        "team": 7,
                        "business_model": 6,
                        "market_opportunity": 7,
                        "technical_feasibility": 6,
                        "execution_strategy": 7,
                        "communication": 6
                    },
                    "feedback": "Solid innovation but weak business model and communication."
                }
            ]
        }
    ]
}

# Send POST request
try:
    response = requests.post(URL, json=payload)
    response.raise_for_status()  # Raise an exception for HTTP errors
    
    # Save the downloaded file
    if response.headers.get('Content-Disposition'):
        filename = response.headers.get('Content-Disposition').split('filename=')[-1].strip()
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"File downloaded successfully: {filename}")
    else:
        print(f"Response received: {response.json()}")

except requests.exceptions.RequestException as e:
    print(f"Error occurred: {e}")
