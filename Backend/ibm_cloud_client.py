import os
import requests
import time
import logging

logger = logging.getLogger("ibm-cloud-client")

class IBMCloudClient:
    def __init__(self, api_key: str, instance_crn: str):
        self.api_key = api_key
        self.instance_crn = instance_crn
        self.access_token = None
        self.token_expiry = 0
        self.base_url = "https://quantum.cloud.ibm.com/api/v1"
        
        # Adjust URL based on region if known (naive check)
        if "eu-de" in instance_crn:
            self.base_url = "https://eu-de.quantum.cloud.ibm.com/api/v1"

    def _refresh_token(self):
        """Exchanges API Key for Bearer Token via IAM"""
        url = "https://iam.cloud.ibm.com/identity/token"
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        data = {
            'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
            'apikey': self.api_key
        }
        
        try:
            response = requests.post(url, headers=headers, data=data)
            response.raise_for_status()
            token_data = response.json()
            self.access_token = token_data['access_token']
            # Set expiry with a small buffer (e.g., 5 mins before actual expiry)
            self.token_expiry = time.time() + token_data.get('expires_in', 3600) - 300
            logger.info("Successfully refreshed IBM Cloud Bearer Token")
        except Exception as e:
            logger.error(f"Failed to refresh token: {e}")
            raise

    def get_token(self):
        """Returns a valid access token, refreshing if necessary"""
        if not self.access_token or time.time() >= self.token_expiry:
            self._refresh_token()
        return self.access_token

    def get_headers(self):
        return {
            'Authorization': f'Bearer {self.get_token()}',
            'Service-CRN': self.instance_crn,
            'IBM-API-Version': '2021-10-01', # Using a recent stable version
            'Accept': 'application/json'
        }

    def get_backends(self):
        url = f"{self.base_url}/backends"
        try:
            response = requests.get(url, headers=self.get_headers())
            response.raise_for_status()
            data = response.json()
            # The API returns {"devices": ["name1", "name2"]}
            return data.get("devices", [])
        except Exception as e:
            logger.error(f"Error fetching backends via REST: {e}")
            raise

if __name__ == "__main__":
    # Test script
    from dotenv import load_dotenv
    logging.basicConfig(level=logging.INFO)
    load_dotenv()
    
    TOKEN = os.getenv("IBM_QUANTUM_TOKEN")
    INSTANCE = os.getenv("IBM_QUANTUM_INSTANCE")
    
    client = IBMCloudClient(TOKEN, INSTANCE)
    
    print("Fetching backends...")
    try:
         backends = client.get_backends()
         print(f"Found {len(backends)} backends via REST API: {backends}")
    except Exception as e:
        print(f"Failed: {e}")
