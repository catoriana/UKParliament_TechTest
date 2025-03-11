using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data.Tests;

public class UnitOfWorkTests
{
    [Fact]
    public void Constructor_InitializesRepositories()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<PersonManagerContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_Constructor")
            .Options;
        var context = new PersonManagerContext(options);

        // Act
        var unitOfWork = new UnitOfWork(context);

        // Assert
        Assert.NotNull(unitOfWork.PersonRepository);
        Assert.NotNull(unitOfWork.DepartmentRepository);
        Assert.IsType<PersonRepository>(unitOfWork.PersonRepository);
        Assert.IsType<DepartmentRepository>(unitOfWork.DepartmentRepository);
    }

    [Fact]
    public void Constructor_ThrowsArgumentNullException_WhenContextIsNull()
    {
        // Arrange, Act & Assert
        Assert.Throws<ArgumentNullException>(() => new UnitOfWork(null));
    }

    [Fact]
    public async Task SaveChangesAsync_CallsContextSaveChangesAsync()
    {
        // Arrange
        var mockContext = new Mock<PersonManagerContext>(new DbContextOptions<PersonManagerContext>());
        mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

        var unitOfWork = new UnitOfWork(mockContext.Object);

        // Act
        await unitOfWork.SaveChangesAsync();

        // Assert
        mockContext.Verify(c => c.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public void Dispose_CallsContextDispose()
    {
        // Arrange
        var mockContext = new Mock<PersonManagerContext>(new DbContextOptions<PersonManagerContext>());
        mockContext.Setup(c => c.Dispose());

        var unitOfWork = new UnitOfWork(mockContext.Object);

        // Act
        unitOfWork.Dispose();

        // Assert
        mockContext.Verify(c => c.Dispose(), Times.Once);
    }

    [Fact]
    public void PersonRepository_ReturnsCorrectRepository()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<PersonManagerContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_PersonRepository")
            .Options;
        var context = new PersonManagerContext(options);

        // Act
        var unitOfWork = new UnitOfWork(context);
        var repository = unitOfWork.PersonRepository;

        // Assert
        Assert.NotNull(repository);
        Assert.IsType<PersonRepository>(repository);
    }

    [Fact]
    public void DepartmentRepository_ReturnsCorrectRepository()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<PersonManagerContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_DepartmentRepository")
            .Options;
        var context = new PersonManagerContext(options);

        // Act
        var unitOfWork = new UnitOfWork(context);
        var repository = unitOfWork.DepartmentRepository;

        // Assert
        Assert.NotNull(repository);
        Assert.IsType<DepartmentRepository>(repository);
    }

    [Fact]
    public void UnitOfWork_ImplementsIUnitOfWorkInterface()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<PersonManagerContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_Interface")
            .Options;
        var context = new PersonManagerContext(options);

        // Act
        var unitOfWork = new UnitOfWork(context);

        // Assert
        Assert.IsAssignableFrom<IUnitOfWork>(unitOfWork);
    }
}
