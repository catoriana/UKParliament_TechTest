using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data.Tests;

public class PersonManagerContextTests
{
    private DbContextOptions<PersonManagerContext> GetInMemoryDbOptions()
    {
        return new DbContextOptionsBuilder<PersonManagerContext>()
            .UseInMemoryDatabase(databaseName: "PersonManagerContextTestDb")
            .Options;
    }

    [Fact]
    public void DbSet_People_ShouldBeInitialized()
    {
        // Arrange
        var options = GetInMemoryDbOptions();
        using var context = new PersonManagerContext(options);

        // Act
        var peopleDbSet = context.People;

        // Assert
        Assert.NotNull(peopleDbSet);
    }

    [Fact]
    public void DbSet_Departments_ShouldBeInitialized()
    {
        // Arrange
        var options = GetInMemoryDbOptions();
        using var context = new PersonManagerContext(options);

        // Act
        var departmentsDbSet = context.Departments;

        // Assert
        Assert.NotNull(departmentsDbSet);
    }

    [Fact]
    public void OnModelCreating_ShouldConfigureRelationships()
    {
        // Arrange
        var options = GetInMemoryDbOptions();
        using var context = new PersonManagerContext(options);

        // Act & Assert: Ensure the foreign key relationship is set up between Person and Department
        var personEntity = context.Model.FindEntityType(typeof(Person));
        var foreignKey = personEntity.GetForeignKeys().FirstOrDefault();

        // Assert that a foreign key is present and the principal entity is Department
        Assert.NotNull(foreignKey);
        Assert.Equal(typeof(Department).FullName, foreignKey.PrincipalEntityType.Name);
        Assert.Equal(DeleteBehavior.Restrict, foreignKey.DeleteBehavior);
    }

    [Fact]
    public void SeedData_ShouldSeedDepartmentsCorrectly()
    {
        // Arrange
        var options = GetInMemoryDbOptions();
        using var context = new PersonManagerContext(options);

        // Act
        context.Database.EnsureCreated(); // Ensure that the database is created and seeded

        // Assert
        var departmentCount = context.Departments.Count();
        Assert.Equal(5, departmentCount); // Ensure the seeded data contains 5 departments

        var departmentNames = context.Departments.Select(d => d.Name).ToList();
        Assert.Contains("Engineering", departmentNames);
        Assert.Contains("Human Resources", departmentNames);
        Assert.Contains("Marketing", departmentNames);
        Assert.Contains("Sales", departmentNames);
        Assert.Contains("Finance", departmentNames);
    }
}
