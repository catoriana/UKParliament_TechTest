using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data;

/// <summary>
/// The PersonManagerContext class.
/// </summary>
/// <seealso cref="DbContext" />
public class PersonManagerContext : DbContext
{
    /// <summary>
    /// Initializes a new instance of the <see cref="PersonManagerContext"/> class.
    /// </summary>
    /// <param name="options">The options.</param>
    public PersonManagerContext(DbContextOptions<PersonManagerContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Gets or sets the People.
    /// </summary>
    /// <value>
    /// The DbSet People.
    /// </value>
    public DbSet<Person> People { get; set; }

    /// <summary>
    /// Gets or sets the Departments.
    /// </summary>
    /// <value>
    /// The DbSet Departments.
    /// </value>
    public DbSet<Department> Departments { get; set; }

    /// <inheritdoc/>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Person entity
        modelBuilder.Entity<Person>(entity =>
        {
            modelBuilder.Entity<Person>()
                        .HasOne(p => p.Department)
                        .WithMany()
                        .HasForeignKey(p => p.DepartmentId)
                        .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Department entity
        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Departments
        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Engineering" },
            new Department { Id = 2, Name = "Human Resources" },
            new Department { Id = 3, Name = "Marketing" },
            new Department { Id = 4, Name = "Sales" },
            new Department { Id = 5, Name = "Finance" }
        );

        // Seed Persons
        modelBuilder.Entity<Person>().HasData(
            new Person { Id = 1, FirstName = "Laura", LastName = "Wilson", DateOfBirth = new DateOnly(1977,02,02), DepartmentId = 1 },
            new Person { Id = 2, FirstName = "Sandra", LastName = "Smith", DateOfBirth = new DateOnly(1987, 03, 08), DepartmentId = 2 },
            new Person { Id = 3, FirstName = "Frank", LastName = "Jones", DateOfBirth = new DateOnly(1997, 04, 15), DepartmentId = 3 },
            new Person { Id = 4, FirstName = "Bob", LastName = "Fleece", DateOfBirth = new DateOnly(2003, 05, 22), DepartmentId = 4 },
            new Person { Id = 5, FirstName = "Vince", LastName = "Wilson", DateOfBirth = new DateOnly(2002, 02, 02), DepartmentId = 5 },
            new Person { Id = 6, FirstName = "Nick", LastName = "Smith", DateOfBirth = new DateOnly(2001, 03, 08), DepartmentId = 2 },
            new Person { Id = 7, FirstName = "Mary", LastName = "Jones", DateOfBirth = new DateOnly(1988, 05, 15), DepartmentId = 3 },
            new Person { Id = 8, FirstName = "Jane", LastName = "Fleece", DateOfBirth = new DateOnly(1975, 09, 04), DepartmentId = 4 });

    }
}
