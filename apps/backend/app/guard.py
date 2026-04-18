"""Checks tutor text before it is shown to the student."""

from __future__ import annotations

import re


ANSWER_MARKERS = [
    r"\banswer\s*[:=]",
    r"\bthe\s+answer\s+is\b",
    r"\bfinal\s+answer\b",
    r"\bthe\s+result\s+is\b",
    r"\bthe\s+solution\s+is\b",
    r"\\boxed\s*\{",
    r"\btherefore\s*,?\s*(?:the\s+)?(?:answer|solution|result)\b",
    r"\bso\s+the\s+(?:answer|solution|result)\s+is\b",
    r"\bwhich\s+gives\s+(?:us\s+)?(?:the\s+)?(?:final|answer)\b",
    r"\byou\s+get\b.*\b(?:as\s+the\s+(?:final\s+)?answer)\b",
    r"\bthat(?:'s|\s+is)\s+correct\b",
    r"\byes\s*,?\s*(?:that's|that\s+is)\s+(?:right|correct)\b",
    r"\bfill\s+in\s+the\s+blanks?\s+with\b",
]


def normalize_math_text(value: str) -> str:
    text = value.lower().strip()
    text = text.replace("$", "")
    text = text.replace("\\left", "").replace("\\right", "")
    text = re.sub(r"\\text\{([^}]*)\}", r"\1", text)
    text = re.sub(r"\\mathrm\{([^}]*)\}", r"\1", text)
    text = re.sub(r"(?<=\d),(?=\d{3}(?!\d))", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip(" .,:;")


def extract_boxed_answer(text: str) -> str:
    answers: list[str] = []
    start = 0
    while True:
        marker = text.find(r"\boxed{", start)
        if marker == -1:
            break

        cursor = marker + len(r"\boxed{")
        depth = 1
        value_start = cursor

        while cursor < len(text) and depth > 0:
            if text[cursor] == "{":
                depth += 1
            elif text[cursor] == "}":
                depth -= 1
            cursor += 1

        if depth == 0:
            answers.append(text[value_start: cursor - 1].strip())
        start = cursor

    if answers:
        return answers[-1]

    for line in reversed(text.splitlines()):
        match = re.search(
            r"(?:final\s+)?(?:answer|result|solution)\s*(?:is|[:=])\s*(.+)",
            line,
            re.IGNORECASE,
        )
        if match:
            return match.group(1).strip(" .")

    return ""


def looks_like_answer_giving(text: str) -> bool:
    return any(re.search(pattern, text, re.IGNORECASE) for pattern in ANSWER_MARKERS)


def leaks_answer(text: str, final_answer: str) -> bool:
    if looks_like_answer_giving(text):
        return True

    answer = normalize_math_text(final_answer)
    if not answer or len(answer) < 2:
        return False

    output = normalize_math_text(text)
    if answer == output:
        return True

    escaped = re.escape(answer)
    return bool(re.search(rf"(?<![\w/]){escaped}(?![\w/])", output))


def safe_fallback_hint(step: int) -> str:
    fallbacks = [
        "Start by restating what the problem is asking. Identify the known values before doing any computation.",
        "Look for the main rule, formula, or definition that connects the given information.",
        "Set up the next algebraic or logical step, but leave the arithmetic for yourself to finish.",
        "Check whether each transformation keeps the expression equivalent to the original problem.",
        "Use your setup to decide what the final operation should be, then carry it out on your own paper.",
    ]
    index = min(max(step - 1, 0), len(fallbacks) - 1)
    return fallbacks[index]
