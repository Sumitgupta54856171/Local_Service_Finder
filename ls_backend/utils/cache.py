import redis
import json
import time

r = redis.Redis(host="localhost", port=6379, db=0)

MAX_CACHE = 150

def save_radius_cache(cache_key, data):

    # Save actual data
    r.set(cache_key, json.dumps(data))

    # Track cache key in sorted set
    r.zadd("radius_cache_keys", {cache_key: time.time()})

    # Remove old entries if more than 150
    total = r.zcard("radius_cache_keys")

    if total > MAX_CACHE:
        # Remove oldest
        keys_to_remove = r.zrange("radius_cache_keys", 0, total - MAX_CACHE - 1)

        for key in keys_to_remove:
            r.delete(key)

        r.zremrangebyrank("radius_cache_keys", 0, total - MAX_CACHE - 1)