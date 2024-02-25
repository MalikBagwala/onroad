from rest_framework.exceptions import ValidationError


def validation_error_serializer(error: ValidationError):
    errors = []
    non_field_errors = error.detail.pop("non_field_errors", [])  # type: ignore
    error.detail.pop("code", None)  # type: ignore
    if len(non_field_errors) > 0:
        for non_field_error in non_field_errors:
            errors.append({"type": "generic", "message": str(non_field_error)})

    for field, field_errors in error.detail.items():  # type: ignore
        for field_error in field_errors:
            errors.append(
                {"type": "field", "field": field, "message": str(field_error)}
            )

    return (errors[-1].get("message"), errors)
