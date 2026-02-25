from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    import traceback
    print("\n--- Exception Traceback ---")
    traceback.print_exc()
    print("--- End Traceback ---\n")
    response = exception_handler(exc, context)

    if response is not None:
        return Response({
            "error": response.data,
            "status_code": response.status_code
        }, status=response.status_code)

    return Response({
        "error": str(exc),
        "status_code": 500
    }, status=500)