from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework import status
from core.models import Contribution
from django.db.models import F


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def update_contribution_total(request):
    try:
        data = request.data
        new_data = data["event"]["data"]["new"]
        contribution = Contribution.objects.get(id=new_data["id"])
        contribution.update_total()
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(
        {"message": f"Contribution {new_data['id']} with total {contribution.total}"}
    )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def update_votes(request):
    try:
        print(request)
        data = request.data
        op = data["event"]["op"]
        old_data = data["event"]["data"]["old"]
        new_data = data["event"]["data"]["new"]
        contribution_id = old_data and old_data.get("contribution_id", None)
        old_type = old_data and old_data.get("type", None)
        new_type = new_data and new_data.get("type", None)

        if new_data:
            contribution_id = new_data.get("contribution_id", None)
        contribution = Contribution.objects.get(id=contribution_id)
        if op == "DELETE":
            if old_type == "DN":
                contribution.downvotes = F("downvotes") - 1
            elif old_type == "UP":
                contribution.upvotes = F("upvotes") - 1
        elif op == "INSERT" or "UPDATE":
            if new_type == "DN":
                contribution.downvotes = F("downvotes") + 1
            elif new_type == "UP":
                contribution.upvotes = F("upvotes") + 1
            if old_type == "DN":
                contribution.downvotes = F("downvotes") - 1
            elif old_type == "UP":
                contribution.upvotes = F("upvotes") - 1
        contribution.save(update_fields=["upvotes", "downvotes"])
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": f"Votes updated for contribution {contribution_id}"})
