using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data.Tests;

public class DepartmentRepositoryTests
{
    private PersonManagerContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<PersonManagerContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        // Seed test data

        var context = new PersonManagerContext(options);
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllDepartments()
    {
        var context = GetDbContext();

        var repository = new DepartmentRepository(context);
        var result = await repository.GetAllAsync();

        Assert.Equal(5, result.Count());
    }

    [Fact]
    public void Constructor_ThrowsArgumentNullException_WhenContextIsNull()
    {
        // Arrange, Act & Assert
        Assert.Throws<ArgumentNullException>(() => new DepartmentRepository(null));
    }
}
