using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data.Tests;

public class PersonRepositoryTests
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
        context.People.RemoveRange(context.People);
        context.SaveChanges();

        context.People.AddRange(
            new Person
            {
                FirstName = "Bob",
                LastName = "Fleet",
                DateOfBirth = new DateOnly(1980, 1, 1),
                DepartmentId = 1,
            },
            new Person
            {
                FirstName = "Mary",
                LastName = "Smith",
                DateOfBirth = new DateOnly(1985, 5, 5),
                DepartmentId = 1,
            }
        );
        context.SaveChanges();
        return context;
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllPeople()
    {
        var context = GetDbContext();

        var repository = new PersonRepository(context);
        var result = await repository.GetAllAsync();

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task AddAsync_AddsPerson()
    {
        // Arrange
        var id = 3;
        var context = GetDbContext();
        var repository = new PersonRepository(context);
        var person = new Person { FirstName = "Izabella", LastName = "Wood", DateOfBirth = new DateOnly(1978, 05, 04), DepartmentId = 1 };

        // Act
        var result = await repository.AddAsync(person);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(person.FirstName, result.FirstName);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesPerson()
    {
        // Arrange
        var id = 1;
        var updatedFirstName = "UpdatedFirstName";
        var context = GetDbContext();
        var repository = new PersonRepository(context);

        var person = await context.People.FindAsync(id);
        if (person != null)
        {
            person.FirstName = updatedFirstName;
        }

        // Act
        await repository.UpdateAsync(person);
        var result = await context.People.FindAsync(id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(updatedFirstName, result.FirstName);
    }

    [Fact]
    public async Task DeleteAsync_RemovesPerson()
    {
        // Arrange
        var id = 1;
        var context = GetDbContext();
        var repository = new PersonRepository(context);

        // Act
        await repository.DeleteAsync(id);
        var result = await context.People.FindAsync(id);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_KeyNotFoundException()
    {
        // Arrange
        var id = 20;
        var context = GetDbContext();
        var repository = new PersonRepository(context);

        // Act & Assert: Ensure that a KeyNotFoundException is thrown
        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.DeleteAsync(id));

        //Assert
        Assert.Equal($"Person with ID {id} not found.", exception.Message);
    }

    [Fact]
    public void Constructor_ThrowsArgumentNullException_WhenContextIsNull()
    {
        // Arrange, Act & Assert
        Assert.Throws<ArgumentNullException>(() => new PersonRepository(null));
    }
}
