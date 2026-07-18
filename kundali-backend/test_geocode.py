import os
import certifi
from geopy.geocoders import Nominatim, Photon

os.environ['SSL_CERT_FILE'] = certifi.where()
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()

def test():
    try:
        p = Photon(user_agent="kundali_app")
        loc = p.geocode("Delhi")
        print("Photon:", loc.latitude, loc.longitude)
    except Exception as e:
        print("Photon failed:", e)

if __name__ == "__main__":
    test()
