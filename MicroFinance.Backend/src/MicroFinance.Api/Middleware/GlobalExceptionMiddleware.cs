using FluentValidation;
using System.Net;
using System.Text.Json;

namespace MicroFinance.Api.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred processing the request.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/problem+json";

            var response = new
            {
                status = (int)HttpStatusCode.InternalServerError,
                title = "An error occurred while processing your request.",
                detail = exception.Message,
                errors = (object?)null
            };

            if (exception is ValidationException valEx)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    status = context.Response.StatusCode,
                    title = "Validation failed.",
                    detail = "One or more validation errors occurred.",
                    errors = (object?)valEx.Errors.Select(e => new { property = e.PropertyName, message = e.ErrorMessage })
                };
            }
            else if (exception is InvalidOperationException || exception is ArgumentException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    status = context.Response.StatusCode,
                    title = "Bad Request",
                    detail = exception.Message,
                    errors = (object?)null
                };
            }
            else if (exception is UnauthorizedAccessException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                response = new
                {
                    status = context.Response.StatusCode,
                    title = "Unauthorized",
                    detail = exception.Message,
                    errors = (object?)null
                };
            }
            else if (exception is KeyNotFoundException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response = new
                {
                    status = context.Response.StatusCode,
                    title = "Not Found",
                    detail = exception.Message,
                    errors = (object?)null
                };
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}
