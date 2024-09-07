import math
import time
import requests

# Web server uses self-signed certificate
requests.packages.urllib3.disable_warnings() 

def generate_tile_urls(lat, lon, min_zoom, max_zoom, radius_km):
    def deg2tile(lat_deg, lon_deg, zoom):
        n = 2.0 ** zoom
        x_tile = int((lon_deg + 180.0) / 360.0 * n)
        y_tile = int((1.0 - math.log(math.tan(math.radians(lat_deg)) + 1.0 / math.cos(math.radians(lat_deg))) / math.pi) / 2.0 * n)
        return x_tile, y_tile

    def tile_size_km(zoom, lat_deg):
        earth_circumference_km = 40075.017  # Earth's circumference in km
        n = 2 ** zoom
        tile_km = earth_circumference_km / n
        # Adjust for latitude
        tile_km_lat = tile_km * math.cos(math.radians(lat_deg))
        return tile_km_lat

    urls = []

    for zoom in range(min_zoom, max_zoom + 1):
        # Calculate the center tile
        x_center, y_center = deg2tile(lat, lon, zoom)
        
        # Calculate how many tiles are needed to cover the radius
        tile_km = tile_size_km(zoom, lat)
        radius_tiles = math.ceil(radius_km / tile_km)
        
        # Determine the range of tiles to download
        # x_min = x_center - radius_tiles
        # x_max = x_center + radius_tiles
        # y_min = y_center - radius_tiles
        # y_max = y_center + radius_tiles
        x_min = max(0, x_center - radius_tiles)
        x_max = min(2 ** zoom - 1, x_center + radius_tiles)
        y_min = max(0, y_center - radius_tiles)
        y_max = min(2 ** zoom - 1, y_center + radius_tiles)

        
        # Generate the URLs for each tile in the range
        for x in range(x_min, x_max + 1):
            for y in range(y_min, y_max + 1):
                # z, x, y
                # https://localhost:3000/api/tiles/15/16384/16383
                # url = f"http://mt2.google.com/vt/lyrs=s,h&x={x}&y={y}&z={zoom}"
                url = f"https://localhost:3000/api/tiles/{zoom}/{x}/{y}"
                urls.append(url)
    
    return urls

lat = 47.991080
lon = -81.851242
min_zoom = 1
max_zoom = 18
radius_km = 10

urls = generate_tile_urls(lat, lon, min_zoom, max_zoom, radius_km)

print(len(urls))

sleep_t = 0.069




req_times = []

for i, url in enumerate(urls):
    print(f"Downloading tile {i+1}/{len(urls)}")
    req_start = time.time()
    response = requests.get(url, verify=False)
    req_time = time.time() - req_start
    req_times.append(req_time)

    # print avg 

    if len(req_times) > 100:
        req_times.pop(0)
    
    if i % 10 == 0:
        avg_req_time = sum(req_times) / len(req_times)
        time_remaining = (len(urls) - i) * avg_req_time
        # Calculate time remaining in minutes and seconds
        minutes = int(time_remaining // 60)
        seconds = time_remaining % 60


        print()
        print(f"Estimated time remaining: {minutes} minutes {seconds:.2f} seconds")
        print()

    time.sleep(sleep_t)