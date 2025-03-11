//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Net;
//using System.Text;
//using System.Text.Json;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Http;
//using Microsoft.Extensions.Logging;
//using Moq;
//using UKParliament.CodeTest.Web.Middleware;

//namespace UKParliament.CodeTest.Web.Tests;

//public class GlobalExceptionMiddlewareTests
//{
//    private readonly Mock<ILogger<GlobalExceptionMiddleware>> _loggerMock;
//    private readonly HttpContext _httpContext;

//    public GlobalExceptionMiddlewareTests()
//    {
//        // Setup logger mock
//        _loggerMock = new Mock<ILogger<GlobalExceptionMiddleware>>();
//    }

//    private async Task<HttpResponse> InvokeMiddlewareWithException(Exception exception)
//    {
//        // Setup HTTP context with a fresh stream for each test
//        var httpContext = new DefaultHttpContext();
//        httpContext.Response.Body = new MemoryStream();
//        httpContext.TraceIdentifier = "test-trace-id";

//        // Create middleware that will throw our test exception
//        var middleware = new GlobalExceptionMiddleware(
//            next: _ => throw exception,
//            logger: _loggerMock.Object
//        );
//        // Execute middleware
//        await middleware.Invoke(httpContext);

//        // Reset stream position to read from the beginning
//        httpContext.Response.Body.Seek(0, SeekOrigin.Begin);

//        // Read response
//        using var streamReader = new StreamReader(httpContext.Response.Body);
//        var responseText = await streamReader.ReadToEndAsync();

//        // Parse JSON response
//        var response = JsonSerializer.Deserialize<ErrorResponse>(responseText, new JsonSerializerOptions
//        {
//            PropertyNameCaseInsensitive = true
//        });

//        return (httpContext, response);
//    }
//    [Theory]
//    [InlineData(typeof(KeyNotFoundException), "Resource not found", HttpStatusCode.NotFound)]
//    [InlineData(typeof(UnauthorizedAccessException), "Unauthorized access", HttpStatusCode.Unauthorized)]
//    [InlineData(typeof(ArgumentException), "Invalid argument", HttpStatusCode.BadRequest)]
//    [InlineData(typeof(ValidationException), "Validation failed", HttpStatusCode.BadRequest)]
//    [InlineData(typeof(InvalidOperationException), "Invalid operation", HttpStatusCode.Conflict)]
//    [InlineData(typeof(TimeoutException), "Request timed out", HttpStatusCode.RequestTimeout)]
//    [InlineData(typeof(NotImplementedException), "This functionality is not implemented", HttpStatusCode.NotImplemented)]
//    [InlineData(typeof(Exception), "Test general exception", HttpStatusCode.InternalServerError)]
//    public async Task Middleware_Should_Return_Correct_StatusCode_And_Message(Type exceptionType, string expectedMessage, HttpStatusCode expectedStatus)
//    {
//        var exception = (Exception) Activator.CreateInstance(exceptionType, expectedMessage);
//        var response = await InvokeMiddlewareWithException(exception);

//        Assert.Equal((int) expectedStatus, response.StatusCode);

//        response.Body.Seek(0, System.IO.SeekOrigin.Begin);
//        using var reader = new System.IO.StreamReader(response.Body);
//        var responseBody = await reader.ReadToEndAsync();
//        var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseBody);

//        Assert.Equal((int) expectedStatus, jsonResponse.GetProperty("status").GetInt32());
//        Assert.Equal(expectedMessage, jsonResponse.GetProperty("message").GetString());
//    }
//}
