using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Services.Mappings;
using UKParliament.CodeTest.Web.Middleware;

namespace UKParliament.CodeTest.Web;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllersWithViews();

        ////// Add Swagger/OpenAPI support (only for Development environment)
        if (builder.Environment.IsDevelopment())
        {
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Person Manager API",
                    Version = "v1",
                    Description = "An API to manage people and departments."
                });
            });
        }

        //Add AutoMapper
        builder.Services.AddAutoMapper(typeof(MappingProfile));

        //Add Rate Limiting
        builder.Services.AddRateLimiter(options =>
        {
            options.AddPolicy("Fixed", httpContext =>

                RateLimitPartition.GetFixedWindowLimiter(
                        httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = builder.Configuration.GetValue<int>("RateLimiting:MaxRequests"),  // Allow max 5 requests
                            Window = TimeSpan.FromMinutes(builder.Configuration.GetValue<int>("RateLimiting:RequestsPerMinute")),  // Per minute
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = builder.Configuration.GetValue<int>("RateLimiting:QueueLimit"), // Allow 2 extra requests to queue
                        }));
        });

        builder.Services.AddDbContext<PersonManagerContext>(op => op.UseInMemoryDatabase("PersonManager"));

        builder.Services.AddScoped<IPersonRepository, PersonRepository>();
        builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IPersonService, PersonService>();
        builder.Services.AddScoped<IDepartmentService, DepartmentService>();

        var app = builder.Build();

        // Create database so the data seeds
        using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            using var context = serviceScope.ServiceProvider.GetRequiredService<PersonManagerContext>();
            context.Database.EnsureCreated();
        }

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        // Enable Swagger middleware (only for Development environment)
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Person Manager API v1");
                options.RoutePrefix = string.Empty; // Makes Swagger UI available at the root (http://localhost:<port>/)
            });
        }

        // Add Global Exception Middleware
        app.UseMiddleware<GlobalExceptionMiddleware>();

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");

        app.MapFallbackToFile("index.html");

        app.Run();
    }
}
