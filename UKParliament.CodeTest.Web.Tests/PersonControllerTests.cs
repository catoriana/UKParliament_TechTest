using Microsoft.AspNetCore.Mvc;
using Moq;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.ViewModels;
using UKParliament.CodeTest.Web.Controllers;

namespace UKParliament.CodeTest.Web.Tests;

public class PersonControllerTests
{
    private readonly Mock<IPersonService> _mockPersonService;
    private readonly PersonController _controller;

    public PersonControllerTests()
    {
        _mockPersonService = new Mock<IPersonService>();
        _controller = new PersonController(_mockPersonService.Object);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnOkResult_WithPersons()
    {
        // Arrange
        var persons = new List<PersonViewModel>
            {
                new PersonViewModel { Id = 1, FirstName = "John", LastName = "Doe", DateOfBirth = new DateOnly(1990, 5, 20), DepartmentId = 2 },
                new PersonViewModel { Id = 2, FirstName = "Jane", LastName = "Doe", DateOfBirth = new DateOnly(1995, 10, 15), DepartmentId = 3 }
            };

        _mockPersonService.Setup(s => s.GetAllAsync()).ReturnsAsync(persons);

        // Act
        var result = await _controller.GetAllAsync();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedPersons = Assert.IsAssignableFrom<IEnumerable<PersonViewModel>>(okResult.Value);
        Assert.Equal(2, returnedPersons.Count());
    }


    [Fact]
    public async Task GetAllAsync_NoPersons_ShouldReturnOk_WithEmptyList()
    {
        // Arrange
        var emptyPersons = new List<PersonViewModel>().AsEnumerable();
        _mockPersonService.Setup(s => s.GetAllAsync()).ReturnsAsync(emptyPersons);

        // Act
        var result = await _controller.GetAllAsync();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedPersons = Assert.IsAssignableFrom<IEnumerable<PersonViewModel>>(okResult.Value);
        Assert.Empty(returnedPersons);
    }

    [Fact]
    public async Task CreatePersonAsync_ValidModel_ShouldReturnCreatedAtAction()
    {
        // Arrange
        var newPerson = new PersonViewModel
        {
            Id = 3,
            FirstName = "Alice",
            LastName = "Smith",
            DateOfBirth = new DateOnly(2000, 8, 25),
            DepartmentId = 1
        };

        _mockPersonService.Setup(s => s.CreateAsync(It.IsAny<PersonViewModel>())).ReturnsAsync(newPerson);

        // Act
        var result = await _controller.CreatePersonAsync(newPerson);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        var returnedPerson = Assert.IsType<PersonViewModel>(createdResult.Value);
        Assert.Equal(newPerson.Id, returnedPerson.Id);
        Assert.Equal(newPerson.DateOfBirth, returnedPerson.DateOfBirth);
    }

    [Fact]
    public async Task CreatePersonAsync_InvalidModel_ShouldReturnBadRequest()
    {
        // Arrange
        _controller.ModelState.AddModelError("FirstName", "FirstName is required");

        // Act
        var result = await _controller.CreatePersonAsync(new PersonViewModel());

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UpdatePersonAsync_ValidModel_ShouldReturnNoContent()
    {
        // Arrange
        var updatedPerson = new PersonViewModel
        {
            Id = 1,
            FirstName = "Updated",
            LastName = "Person",
            DateOfBirth = new DateOnly(1985, 2, 12),
            DepartmentId = 2
        };

        _mockPersonService.Setup(s => s.UpdateAsync(updatedPerson)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.UpdatePersonAsync(updatedPerson);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task UpdatePersonAsync_InvalidModel_ShouldReturnBadRequest()
    {
        // Arrange
        _controller.ModelState.AddModelError("LastName", "LastName is required");

        // Act
        var result = await _controller.UpdatePersonAsync(new PersonViewModel());

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UpdatePersonAsync_InvalidModel_ShouldReturnNotFound()
    {
        // Arrange
        var invalidPerson = new PersonViewModel { Id = 999, FirstName = "FirstName", LastName = "LastName", DateOfBirth = new DateOnly(2000, 04, 23), DepartmentId = 1 };
        _mockPersonService
            .Setup(s => s.UpdateAsync(invalidPerson))
            .ThrowsAsync(new KeyNotFoundException());

        // Act
        var result = await _controller.UpdatePersonAsync(invalidPerson);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeletePersonAsync_ValidId_ShouldReturnNoContent()
    {
        // Arrange
        int personId = 1;
        _mockPersonService.Setup(s => s.DeleteAsync(personId)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.DeletePersonAsync(personId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeletePersonAsync_InvalidModel_ShouldReturnNotFound()
    {
        // Arrange
        int invalidPersonId = 999;
        _mockPersonService
            .Setup(s => s.DeleteAsync(invalidPersonId))
            .ThrowsAsync(new KeyNotFoundException());

        // Act
        var result = await _controller.DeletePersonAsync(invalidPersonId);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeletePersonAsync_InvalidModelState_ShouldReturnBadRequest()
    {
        // Arrange
        _controller.ModelState.AddModelError("id", "Invalid ID");

        // Act
        var result = await _controller.DeletePersonAsync(1);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

}
