"""Rate limiting configuration."""

from slowapi import Limiter
from slowapi.util import get_remote_address

# Rate limiter instance (uses in-memory storage by default)
limiter = Limiter(key_func=get_remote_address)
