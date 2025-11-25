import sys
import os
import json
# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

def verify_swagger():
    print("Generating OpenAPI schema...")
    schema = app.openapi()
    
    # 1. Check Tags Order
    tags = [t['name'] for t in schema['tags']]
    print(f"Tags found: {tags}")
    
    expected_order_start = [
        "Authentication",
        "Admin - Dashboard",
        "Admin - User Management"
    ]
    
    for i, expected in enumerate(expected_order_start):
        if tags[i] != expected:
            print(f"FAIL: Expected tag '{expected}' at index {i}, found '{tags[i]}'")
            return
            
    print("PASS: Tag order starts correctly.")
    
    # 2. Check Paths and Tags
    paths = schema['paths']
    errors = []
    
    for path, methods in paths.items():
        for method, operation in methods.items():
            op_tags = operation.get('tags', [])
            
            if path.startswith("/auth"):
                if "Authentication" not in op_tags:
                    errors.append(f"Path {path} missing 'Authentication' tag")
            
            elif path.startswith("/customer"):
                if not any(t.startswith("Customer -") for t in op_tags):
                    errors.append(f"Path {path} missing 'Customer - ...' tag. Found: {op_tags}")
            
            elif path.startswith("/admin"):
                if not any(t.startswith("Admin -") for t in op_tags):
                    errors.append(f"Path {path} missing 'Admin - ...' tag. Found: {op_tags}")
    
    if errors:
        print("FAIL: Found errors in path tags:")
        for e in errors:
            print(f"  - {e}")
    else:
        print("PASS: All paths have correct tags based on prefix.")

if __name__ == "__main__":
    verify_swagger()
