import sys
import re
from pathlib import Path

def check_decisions():
    decisions_file = Path("docs/agents/DECISIONS.md")
    if not decisions_file.exists():
        print("❌ docs/agents/DECISIONS.md nu exista!")
        return False

    content = decisions_file.read_text(encoding="utf-8")
    
    # Caută titluri de tip ## D-xxx, ## D-xx sau ## ADR-xxx
    entries = re.findall(r"^##\s+(?:D-\d+|ADR-\d+)", content, re.MULTILINE | re.IGNORECASE)
    if not entries:
        print("⚠️ Nu au fost gasite decizii (D-xxx sau ADR-xxx) in DECISIONS.md.")
        return False

    print(f"✅ Am gasit {len(entries)} decizii valide in DECISIONS.md.")
    return True

if __name__ == "__main__":
    print("🔍 Rulare ledger-lint.py...")
    if check_decisions():
        print("✅ PASSED: Registrul este valid!")
        sys.exit(0)
    else:
        print("❌ FAILED: Exista erori in registru.")
        sys.exit(1)
