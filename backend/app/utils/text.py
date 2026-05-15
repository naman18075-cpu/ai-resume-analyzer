import re
from collections.abc import Iterable


def normalize_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value or "").strip()
    return value


def normalize_skill(value: str) -> str:
    value = normalize_text(value).lower()
    return re.sub(r"[^a-z0-9+.#/\-\s]", "", value)


def unique_list(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    output: list[str] = []
    for item in values:
        normalized = normalize_text(item)
        key = normalized.lower()
        if not normalized or key in seen:
            continue
        seen.add(key)
        output.append(normalized)
    return output
