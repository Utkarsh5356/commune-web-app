from fastapi import Depends, HTTPException, status
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from config import get_settings
from database.database import get_db, Profile

settings = get_settings()

# Setup of clerk auth guard
clerk_config = ClerkConfig(jwks_url=settings.clerk_jwks_url)
clerk_auth_guard = ClerkHTTPBearer(config=clerk_config, add_state=True)

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(clerk_auth_guard)
) -> str:
    user_id = credentials.decoded.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing sub claim"
        )
    
    return user_id    

async def get_current_profile(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
) -> Profile:
    result = await db.execute(select(Profile).where(Profile.userId == user_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile    