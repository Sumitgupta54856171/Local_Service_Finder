import requests
import time

BASE_URL = "http://127.0.0.1:8001/api/public"

def test_cache():
    print("Testing cache...")
    # First request
    start = time.time()
    r = requests.get(BASE_URL)
    duration1 = time.time() - start
    print(f"Request 1: {r.status_code}, time: {duration1:.4f}s")
    
    # Second request (should be cached)
    start = time.time()
    r = requests.get(BASE_URL)
    duration2 = time.time() - start
    print(f"Request 2: {r.status_code}, time: {duration2:.4f}s")
    
    if duration2 < duration1 * 0.5:
        print("Caching seems to be working (second request was significantly faster)")
    else:
        print("Caching might not be visible via timing alone on LocMemCache with small data, but check headers if any.")

def test_throttle():
    print("\nTesting throttle (rate limit is 30/minute)...")
    success_count = 0
    throttled_count = 0
    for i in range(35):
        r = requests.get(BASE_URL)
        if r.status_code == 200:
            success_count += 1
        elif r.status_code == 429:
            throttled_count += 1
            print(f"Request {i+1} throttled as expected.")
            break
        else:
            print(f"Unexpected status code: {r.status_code}")
    
    print(f"Successes: {success_count}, Throttled: {throttled_count}")
    if throttled_count > 0:
        print("Throttle is working!")
    else:
        print("Throttle did not trigger. Is it configured correctly?")

if __name__ == "__main__":
    test_cache()
    test_throttle()
