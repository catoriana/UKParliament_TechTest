using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Data.Models;
using UKParliament.CodeTest.ViewModels;

namespace UKParliament.CodeTest.Services.Tests;
public class DepartmentServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IDepartmentRepository> _mockDepartmentRepository;
    private readonly Mock<ILogger<DepartmentService>> _mockLogger;
    private readonly Mock<IMapper> _mockMapper;
    private readonly DepartmentService _departmentService;

    public DepartmentServiceTests()
    {
        // Initialize mocks
        _mockDepartmentRepository = new Mock<IDepartmentRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockLogger = new Mock<ILogger<DepartmentService>>();
        _mockMapper = new Mock<IMapper>();

        // Setup UnitOfWork to return our mocked repository
        _mockUnitOfWork.Setup(uow => uow.DepartmentRepository).Returns(_mockDepartmentRepository.Object);

        // Create instance of the service with mocked dependencies
        _departmentService = new DepartmentService(
            _mockUnitOfWork.Object,
            _mockLogger.Object,
            _mockMapper.Object);
    }

    [Fact]
    public async Task GetAllAsync_WithEmptyRepository_ShouldReturnEmptyCollection()
    {
        // Arrange
        var emptyList = new List<Department>();
        _mockDepartmentRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(emptyList);

        // Act
        var result = await _departmentService.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public void Constructor_WithNullDependencies_ShouldThrowArgumentNullException()
    {
        // Arrange, Act & Assert
        Assert.Throws<System.ArgumentNullException>(() => new DepartmentService(null, _mockLogger.Object, _mockMapper.Object));
        Assert.Throws<System.ArgumentNullException>(() => new DepartmentService(_mockUnitOfWork.Object, null, _mockMapper.Object));
        Assert.Throws<System.ArgumentNullException>(() => new DepartmentService(_mockUnitOfWork.Object, _mockLogger.Object, null));
    }
}
