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

        ////// Add CSP middleware
        ////app.Use(async (context, next) =>
        ////{
        ////    // Define your CSP policy
        ////    context.Response.Headers.Append(
        ////        "Content-Security-Policy",
        ////        "default-src 'self'; " +
        ////        "script-src 'self' https://trusted-scripts.com; " +
        ////        "style-src 'self' https://trusted-styles.com; " +
        ////        "img-src 'self' data: https://trusted-images.com; " +
        ////        "font-src 'self' https://trusted-fonts.com; " +
        ////        "connect-src 'self' https://api.trusted-apis.com; " +
        ////        "frame-src 'self' https://trusted-frames.com; " +
        ////        "object-src 'none'; " +
        ////        "base-uri 'self'; " +
        ////        "form-action 'self'; " +
        ////        "frame-ancestors 'self'; " +
        ////        "upgrade-insecure-requests;"
        ////    );

        ////    await next();
        ////});

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
