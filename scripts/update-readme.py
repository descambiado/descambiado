#!/usr/bin/env python3
"""
Update README.md with dynamic content based on metrics and configuration
"""

import json
import os
import re
from datetime import datetime
from typing import Dict, Any

METRICS_FILE = "metrics.json"
CONFIG_FILE = "config/profile-config.json"
README_FILE = "README.md"


def load_metrics() -> Dict[str, Any]:
    """Load metrics from JSON file"""
    try:
        with open(METRICS_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Metrics file not found: {METRICS_FILE}")
        return {}


def load_config() -> Dict[str, Any]:
    """Load configuration from JSON file"""
    try:
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Config file not found: {CONFIG_FILE}")
        return {}


def generate_badges(metrics: Dict[str, Any]) -> str:
    """Generate dynamic badges based on metrics"""
    github = metrics.get("github", {})
    
    badges = []
    
    if github.get("repositories"):
        badges.append(
            f"![Repositories](https://img.shields.io/badge/repositories-{github['repositories']}-9d4edd?style=flat&logo=github)"
        )
    
    if github.get("stars"):
        badges.append(
            f"![Stars](https://img.shields.io/badge/stars-{github['stars']}-9d4edd?style=flat&logo=github)"
        )
    
    if github.get("followers"):
        badges.append(
            f"![Followers](https://img.shields.io/badge/followers-{github['followers']}-9d4edd?style=flat&logo=github)"
        )
    
    return " ".join(badges)


def update_system_status(readme_content: str, metrics: Dict[str, Any]) -> str:
    """Update status section with current metrics"""
    github = metrics.get("github", {})
    
    status_section = f"""## status

<pre style="background: #0d1117; border: 1px solid #7b2cbf; border-radius: 4px; padding: 15px; color: #c77dff; font-family: monospace; font-size: 13px;">
operator_state  : active
focus           : detection engineering · purple team · automation
workspace       : live
repositories    : {github.get('repositories', '--')}
stars           : {github.get('stars', '--')}
followers       : {github.get('followers', '--')}
</pre>"""
    
    # Replace status section
    pattern = r"## status.*?</pre>"
    replacement = status_section
    readme_content = re.sub(pattern, replacement, readme_content, flags=re.DOTALL)
    
    return readme_content


def update_telemetry_section(readme_content: str, metrics: Dict[str, Any]) -> str:
    """Update telemetry section - stats are already in README, just ensure format is correct"""
    telemetry_section = """<div align="center">

![Stats](https://github-readme-stats.vercel.app/api?username=descambiado&show_icons=true&theme=dark&hide_title=true&bg_color=0d1117&title_color=9d4edd&icon_color=9d4edd&text_color=c77dff&border_color=7b2cbf&hide_border=true)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=descambiado&layout=compact&theme=dark&bg_color=0d1117&title_color=9d4edd&text_color=c77dff&border_color=7b2cbf&hide_border=true)

</div>"""
    
    # Replace stats section if it exists, otherwise do nothing (stats are already in README)
    pattern = r"<div align=\"center\">\s*!\[Stats\].*?</div>"
    if re.search(pattern, readme_content, flags=re.DOTALL):
        readme_content = re.sub(pattern, telemetry_section, readme_content, flags=re.DOTALL)
    
    return readme_content


def add_web_component_section(readme_content: str) -> str:
    """No web component section needed - everything is embedded"""
    return readme_content


def update_gif_references(readme_content: str) -> str:
    """Update GIF references with correct names"""
    # Update any old GIF references to new names
    gif_mappings = {
        "404G _4.gif": "glitch-effect-4.gif",
        "404G_1.gif": "glitch-effect-1.gif",
        "404G_2.gif": "glitch-effect-2.gif",
        "404G_5.gif": "glitch-effect-5.gif"
    }
    
    for old_name, new_name in gif_mappings.items():
        readme_content = readme_content.replace(old_name, new_name)
    
    return readme_content


def add_purple_theme_styling(readme_content: str) -> str:
    """Add purple theme styling hints in HTML comments"""
    style_comment = """
<!-- Purple Theme: #9d4edd, #7b2cbf, #5a189a, #c77dff -->
"""
    
    # Add at the beginning if not present
    if "Purple Theme" not in readme_content:
        readme_content = style_comment + readme_content
    
    return readme_content


def main():
    """Main function"""
    print("Updating README.md...")
    
    # Load data
    metrics = load_metrics()
    config = load_config()
    
    # Read current README
    try:
        with open(README_FILE, "r", encoding="utf-8") as f:
            readme_content = f.read()
    except FileNotFoundError:
        print(f"README file not found: {README_FILE}")
        return
    
    # Update sections
    readme_content = update_gif_references(readme_content)
    readme_content = update_system_status(readme_content, metrics)
    readme_content = update_telemetry_section(readme_content, metrics)
    
    # Add web component section if not present
    if "INTERACTIVE TERMINAL" not in readme_content:
        readme_content = add_web_component_section(readme_content)
    
    # Add purple theme styling
    readme_content = add_purple_theme_styling(readme_content)
    
    # Write updated README
    with open(README_FILE, "w", encoding="utf-8") as f:
        f.write(readme_content)
    
    print(f"README.md updated successfully!")


if __name__ == "__main__":
    main()
