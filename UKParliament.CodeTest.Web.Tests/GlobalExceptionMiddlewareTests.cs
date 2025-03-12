using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using UKParliament.CodeTest.Web.Middleware;

namespace UKParliament.CodeTest.Web.Tests;

public class GlobalExceptionMiddlewareTests
{
    private readonly Mock<ILogger<GlobalExceptionMiddleware>> _loggerMock;
    private readonly HttpContext _httpContext;

    public GlobalExceptionMiddlewareTests()
    {
        // Setup logger mock
        _loggerMock = new Mock<ILogger<GlobalExceptionMiddleware>>();
    }

    private async Task<HttpResponse> InvokeMiddlewareWithException(Exception exception)
    {
        // Setup HTTP context with a fresh stream for each test
        var httpContext = new DefaultHttpContext();
        httpContext.Response.Body = new MemoryStream();
        httpContext.TraceIdentifier = "test-trace-id";

        // Create middleware that will throw our test exception
        var middleware = new GlobalExceptionMiddleware(
            next: _ => throw exception,
            logger: _loggerMock.Object
        );
        // Execute middleware
        await middleware.Invoke(httpContext);

        return httpContext.Response;

    }

    [Theory]
    [InlineData(typeof(KeyNotFoundException), "Resource not found", HttpStatusCode.NotFound)]
    [InlineData(typeof(UnauthorizedAccessException), "Unauthorized access", HttpStatusCode.Unauthorized)]
    [InlineData(typeof(ArgumentException), "Invalid argument", HttpStatusCode.BadRequest)]
    [InlineData(typeof(ValidationException), "Validation failed", HttpStatusCode.BadRequest)]
    [InlineData(typeof(InvalidOperationException), "Invalid operation", HttpStatusCode.Conflict)]
    [InlineData(typeof(TimeoutException), "Request timed out", HttpStatusCode.RequestTimeout)]
    [InlineData(typeof(NotImplementedException), "This functionality is not implemented", HttpStatusCode.NotImplemented)]
    [InlineData(typeof(Exception), "Test general exception", HttpStatusCode.InternalServerError)]
    public async Task Middleware_Should_Return_Correct_StatusCode_And_Message(Type exceptionType, string expectedMessage, HttpStatusCode expectedStatus)
    {
        var exception = (Exception) Activator.CreateInstance(exceptionType, expectedMessage);
        var response = await InvokeMiddlewareWithException(exception);

        Assert.Equal((int) expectedStatus, response.StatusCode);

    }
}
