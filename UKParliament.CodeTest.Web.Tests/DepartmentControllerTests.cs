using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.ViewModels;
using UKParliament.CodeTest.Web.Controllers;

namespace UKParliament.CodeTest.Web.Tests;

public class DepartmentControllerTests
{
    private readonly Mock<IDepartmentService> _mockDepartmentService;
    private readonly DepartmentController _controller;

    public DepartmentControllerTests()
    {
        _mockDepartmentService = new Mock<IDepartmentService>();
        _controller = new DepartmentController(_mockDepartmentService.Object);
    }


    [Fact]
    public async Task GetAllAsync_ShouldReturnOkResult_WithDepartments()
    {
        // Arrange
        var departments = new List<DepartmentViewModel>
            {
                new DepartmentViewModel { Id = 1, Name = "HR" },
                new DepartmentViewModel { Id = 2, Name = "IT" }
            }.AsEnumerable(); // Ensure it's IEnumerable

        _mockDepartmentService.Setup(s => s.GetAllAsync()).ReturnsAsync(departments);

        // Act
        var result = await _controller.GetAllAsync();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedDepartments = Assert.IsAssignableFrom<IEnumerable<DepartmentViewModel>>(okResult.Value);
        Assert.Equal(2, returnedDepartments.Count());
    }


    [Fact]
    public async Task GetAllAsync_NoDepartments_ShouldReturnOk_WithEmptyList()
    {
        // Arrange
        var emptyDepartments = new List<DepartmentViewModel>().AsEnumerable();
        _mockDepartmentService.Setup(s => s.GetAllAsync()).ReturnsAsync(emptyDepartments);

        // Act
        var result = await _controller.GetAllAsync();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedDepartments = Assert.IsAssignableFrom<IEnumerable<DepartmentViewModel>>(okResult.Value);
        Assert.Empty(returnedDepartments);
    }
}
