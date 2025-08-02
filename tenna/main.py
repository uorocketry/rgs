"""Main application entry point."""

import uvicorn
from app.core.config import get_config
from app.core.logging import setup_logging

if __name__ == "__main__":
    # Get configuration
    config = get_config()
    
    # Setup logging
    setup_logging()
    
    # Run the application
    uvicorn.run(
        "app.api.main:app", 
        host=config.host, 
        port=config.port, 
        reload=config.reload,
        log_config=None  # Use our custom logging configuration
    ) 