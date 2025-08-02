"""Result type for consistent error handling throughout the application."""

from __future__ import annotations
from dataclasses import dataclass
from typing import Generic, TypeVar, Optional, Union

T = TypeVar('T')


@dataclass
class Result(Generic[T]):
    """Result type for consistent error handling.
    
    This type represents either a successful result with data or a failure with an error message.
    It replaces the inconsistent pattern of returning booleans or raising exceptions.
    """
    success: bool
    data: Optional[T]
    error: Optional[str]
    
    @classmethod
    def ok(cls, data: T) -> Result[T]:
        """Create a successful result with data.
        
        Args:
            data: The successful result data
            
        Returns:
            Result indicating success with the provided data
        """
        return cls(success=True, data=data, error=None)
    
    @classmethod
    def err(cls, error: str) -> Result[T]:
        """Create a failed result with error message.
        
        Args:
            error: Error message describing the failure
            
        Returns:
            Result indicating failure with the provided error message
        """
        return cls(success=False, data=None, error=error)
    
    def is_ok(self) -> bool:
        """Check if this result represents success."""
        return self.success
    
    def is_err(self) -> bool:
        """Check if this result represents failure."""
        return not self.success
    
    def unwrap(self) -> T:
        """Unwrap the result data.
        
        Returns:
            The data if successful
            
        Raises:
            RuntimeError: If the result is an error
        """
        if self.success:
            return self.data
        else:
            raise RuntimeError(f"Called unwrap() on error result: {self.error}")
    
    def unwrap_or(self, default: T) -> T:
        """Unwrap the result data or return default.
        
        Args:
            default: Default value to return if result is an error
            
        Returns:
            The data if successful, otherwise the default value
        """
        return self.data if self.success else default
    
    def unwrap_or_else(self, func) -> T:
        """Unwrap the result data or call function.
        
        Args:
            func: Function to call if result is an error
            
        Returns:
            The data if successful, otherwise the result of calling func
        """
        return self.data if self.success else func()
    
    def map(self, func) -> Result:
        """Map a function over the result data.
        
        Args:
            func: Function to apply to the data if successful
            
        Returns:
            New Result with transformed data if successful, otherwise the same error
        """
        if self.success:
            try:
                return Result.ok(func(self.data))
            except Exception as e:
                return Result.err(str(e))
        else:
            return Result.err(self.error)
    
    def and_then(self, func) -> Result:
        """Chain operations that return Results.
        
        Args:
            func: Function that takes the data and returns a Result
            
        Returns:
            The result of calling func with the data if successful, otherwise the same error
        """
        if self.success:
            return func(self.data)
        else:
            return Result.err(self.error)
    
    def __bool__(self) -> bool:
        """Boolean conversion returns success status."""
        return self.success
    
    def __str__(self) -> str:
        """String representation of the result."""
        if self.success:
            return f"Ok({self.data})"
        else:
            return f"Err({self.error})"
    
    def __repr__(self) -> str:
        """Detailed string representation."""
        return f"Result(success={self.success}, data={self.data}, error={self.error})"


# Type aliases for common Result types
ResultNone = Result[None]
ResultBool = Result[bool]
ResultStr = Result[str]
ResultInt = Result[int]
ResultFloat = Result[float]