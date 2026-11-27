"""Authoring records. Each body is trusted Python with optional educational step comments."""
from dataclasses import dataclass, field

@dataclass
class Record:
    slug: str
    title: str
    topic: str
    pattern: str
    description: str
    intuition: str
    analogy: str
    mistake: str
    follow: str
    time: str
    space: str
    cases: list
    body: str
    rules: str = ''
    pointers: str = 'i j left mid right'
    board: str = 'values'
    shape: str = 'array'
    difficulty: str = 'easy'
    alternatives: list = field(default_factory=list)

records = []

def add(*args, **kwargs):
    row = Record(*args, **kwargs)
    records.append(row)
    return row

def case(values, target, result):
    return (values, target, result)

