import requests
import time

BASE_URL = "http://127.0.0.1:8001"

def test_suggestions():
    print("Testing /suggestions...")
    try:
        res = requests.get(f"{BASE_URL}/suggestions")
        print(f"Status: {res.status_code}")
        try:
             print(f"Data: {res.json()}")
        except:
             print(f"Raw Text: {res.text}")
        
        if res.status_code == 200 and isinstance(res.json(), list):
            print("PASS")
        else:
            print("FAIL")
    except Exception as e:
        print(f"Error: {e}")

def test_recommend():
    print("\nTesting /recommend...")
    payload = {
        "location": "Paris",
        "time": "60",
        "preference": "Romantic",
        "budget": "Premium"
    }
    try:
        res = requests.post(f"{BASE_URL}/recommend", json=payload)
        print(f"Status: {res.status_code}")
        try:
            data = res.json()
            print(f"Data: {data.get('name')}, Score: {data.get('score')}")
        except:
            print(f"Raw Text: {res.text}")
            data = {}

        if res.status_code == 200 and "name" in data:
            print("PASS")
        else:
            print("FAIL")
    except Exception as e:
        print(f"Error: {e}")

def test_favorites():
    print("\nTesting /favorites...")
    # Add
    fav = {"name": "Test Place", "location": "Test City", "score": 99}
    try:
        requests.post(f"{BASE_URL}/favorites", json=fav)
        
        # Get
        res = requests.get(f"{BASE_URL}/favorites")
        data = res.json()
        print(f"Favorites Count: {len(data)}")
        if any(f["name"] == "Test Place" for f in data):
            print("PASS")
        else:
            print("FAIL")
    except Exception as e:
         print(f"Error: {e}")

if __name__ == "__main__":
    test_suggestions()
    test_recommend()
    test_favorites()
