#!/usr/bin/env python3
"""
Fetch metrics from various APIs for @descambiado profile
"""

import json
import os
import requests
from datetime import datetime
from typing import Dict, Any

GITHUB_USERNAME = "descambiado"
GITHUB_API = "https://api.github.com"
OUTPUT_FILE = "metrics.json"


def fetch_github_stats() -> Dict[str, Any]:
    """Fetch GitHub user statistics"""
    try:
        # Fetch user data
        user_response = requests.get(f"{GITHUB_API}/users/{GITHUB_USERNAME}")
        user_response.raise_for_status()
        user_data = user_response.json()
        
        # Fetch repositories
        repos_response = requests.get(
            f"{GITHUB_API}/users/{GITHUB_USERNAME}/repos",
            params={"per_page": 100, "sort": "updated"}
        )
        repos_response.raise_for_status()
        repos_data = repos_response.json()
        
        # Calculate total stars
        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos_data)
        
        # Fetch recent activity
        events_response = requests.get(
            f"{GITHUB_API}/users/{GITHUB_USERNAME}/events/public",
            params={"per_page": 100}
        )
        events_response.raise_for_status()
        events_data = events_response.json()
        
        # Count recent commits
        recent_commits = sum(1 for event in events_data if event.get("type") == "PushEvent")
        
        return {
            "github": {
                "username": GITHUB_USERNAME,
                "repositories": user_data.get("public_repos", 0),
                "stars": total_stars,
                "followers": user_data.get("followers", 0),
                "following": user_data.get("following", 0),
                "recent_commits": recent_commits,
                "updated_at": datetime.now().isoformat()
            }
        }
    except Exception as e:
        print(f"Error fetching GitHub stats: {e}")
        return {"github": {}}


def fetch_wakatime_stats(api_key: str = None) -> Dict[str, Any]:
    """Fetch WakaTime statistics (optional)"""
    if not api_key:
        return {"wakatime": {}}
    
    try:
        # WakaTime API endpoint
        headers = {"Authorization": f"Basic {api_key}"}
        response = requests.get(
            "https://wakatime.com/api/v1/users/current/stats/all_time",
            headers=headers
        )
        response.raise_for_status()
        data = response.json()
        
        return {
            "wakatime": {
                "total_seconds": data.get("data", {}).get("total_seconds", 0),
                "updated_at": datetime.now().isoformat()
            }
        }
    except Exception as e:
        print(f"Error fetching WakaTime stats: {e}")
        return {"wakatime": {}}


def save_metrics(metrics: Dict[str, Any]) -> None:
    """Save metrics to JSON file"""
    os.makedirs(os.path.dirname(OUTPUT_FILE) if os.path.dirname(OUTPUT_FILE) else ".", exist_ok=True)
    
    with open(OUTPUT_FILE, "w") as f:
        json.dump(metrics, f, indent=2)
    
    print(f"Metrics saved to {OUTPUT_FILE}")


def main():
    """Main function"""
    print("Fetching metrics...")
    
    metrics = {}
    
    # Fetch GitHub stats
    github_stats = fetch_github_stats()
    metrics.update(github_stats)
    
    # Fetch WakaTime stats (if API key is provided)
    wakatime_key = os.getenv("WAKATIME_API_KEY")
    if wakatime_key:
        wakatime_stats = fetch_wakatime_stats(wakatime_key)
        metrics.update(wakatime_stats)
    
    # Add timestamp
    metrics["last_updated"] = datetime.now().isoformat()
    
    # Save metrics
    save_metrics(metrics)
    
    print("Metrics fetched successfully!")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
