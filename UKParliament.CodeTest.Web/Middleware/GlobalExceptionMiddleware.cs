using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace UKParliament.CodeTest.Web.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
    {
        this._next = next;
        this._logger = logger;
        this._jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        var response = context.Response;
        response.ContentType = "application/json";

        var errorResponse  = exception switch
        {
            KeyNotFoundException => new { status = (int) HttpStatusCode.NotFound, message = "Identifier not found" },
            UnauthorizedAccessException => new { status = (int) HttpStatusCode.Unauthorized, message = "Unauthorized access" },
            ArgumentException or ValidationException => new { status = (int) HttpStatusCode.BadRequest, message = exception.Message },
            InvalidOperationException => new { status = (int) HttpStatusCode.Conflict, message = exception.Message },
            TimeoutException => new { status = (int) HttpStatusCode.RequestTimeout, message = "Request timed out" },
            NotImplementedException => new { status = (int) HttpStatusCode.NotImplemented, message = "This functionality is not implemented" },
            _ => new { status = (int) HttpStatusCode.InternalServerError, message = "An unexpected error occurred" }
        };

        response.StatusCode = errorResponse.status;
        return response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }
}
