from typing import List, Optional
from uuid import UUID
import strawberry
from core.types import BaseResponse
from core.models import Contribution
from strawberry.types import Info
from core.utils.exception import parse_exception


@strawberry.type
class MyContributionsResponse(BaseResponse):
    data: List[UUID]
    pass


def my_contributions(
    self,
    info: Info,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    query: Optional[str] = None,
) -> MyContributionsResponse:
    try:
        limit = limit or 50
        offset = offset or 0
        query = query or ""
        qs = Contribution.objects.filter(
            user__id=info.context.request.user.id
        ).order_by("-created_at")
        if query:
            qs = qs.filter(variant__name__icontains=query)
        if limit:
            qs = qs[:limit]
        if offset:
            qs = qs[offset:]

        return MyContributionsResponse(
            success=True,
            message="Contributions Fetched",
            data=[c.id for c in qs],
            code=200,
        )

    except Exception as e:
        return MyContributionsResponse(
            success=False,
            message=parse_exception(e, "Unable to fetch contributions"),
            data=[],
            code=400,
        )
