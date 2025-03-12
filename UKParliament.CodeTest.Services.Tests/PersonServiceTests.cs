using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Data.Models;
using UKParliament.CodeTest.ViewModels;

namespace UKParliament.CodeTest.Services.Tests;
public class PersonServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IPersonRepository> _mockPersonRepository;
    private readonly Mock<ILogger<PersonService>> _mockLogger;
    private readonly Mock<IMapper> _mockMapper;
    private readonly PersonService _personService;

    public PersonServiceTests()
    {
        // Initialize mocks
        _mockPersonRepository = new Mock<IPersonRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockLogger = new Mock<ILogger<PersonService>>();
        _mockMapper = new Mock<IMapper>();

        // Setup UnitOfWork to return our mocked repository
        _mockUnitOfWork.Setup(uow => uow.PersonRepository).Returns(_mockPersonRepository.Object);

        // Create instance of the service with mocked dependencies
        _personService = new PersonService(
            _mockUnitOfWork.Object,
            _mockLogger.Object,
            _mockMapper.Object);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddPersonAndSaveChanges()
    {
        // Arrange
        var dob = new DateOnly(1980, 1, 15);

        var personViewModel = new PersonViewModel
        {
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = dob,
            DepartmentId = 5
        };

        var personEntity = new Person
        {
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = dob,
            DepartmentId = 5
        };

        var personEntityAdded = new Person
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = dob,
            DepartmentId = 5
        };

        var personViewModelAdded = new PersonViewModel
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = dob,
            DepartmentId = 5
        };

        _mockMapper.Setup(m => m.Map<Person>(It.IsAny<PersonViewModel>())).Returns(personEntity);
        _mockMapper.Setup(m => m.Map<PersonViewModel>(It.IsAny<Person>())).Returns(personViewModelAdded);


        _mockPersonRepository.Setup(r => r.AddAsync(personEntity)).ReturnsAsync(personEntityAdded);
        _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync()).Returns(Task.CompletedTask);

        // Act
        var result = await _personService.CreateAsync(personViewModel);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(personEntityAdded.Id, result.Id);
        Assert.Equal(personEntityAdded.FirstName, result.FirstName);
        Assert.Equal(personEntityAdded.LastName, result.LastName);
        Assert.Equal(personEntityAdded.DateOfBirth, result.DateOfBirth);
        Assert.Equal(personEntityAdded.DepartmentId, result.DepartmentId);

        _mockPersonRepository.Verify(r => r.AddAsync(personEntity), Times.Once);
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllPeople()
    {
        // Arrange
        var personEntities = new List<Person>
            {
                new Person
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    DateOfBirth = new DateOnly(1980, 1, 15),
                    DepartmentId = 5
                },
                new Person
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    DateOfBirth = new DateOnly(1985, 5, 20),
                    DepartmentId = 3
                }
            };

        var personViewModels = new List<PersonViewModel>
            {
                new PersonViewModel
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    DateOfBirth = new DateOnly(1980, 1, 15),
                    DepartmentId = 5
                },
                new PersonViewModel
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    DateOfBirth = new DateOnly(1985, 5, 20),
                    DepartmentId = 3
                }
            };

        _mockPersonRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(personEntities);

        // Setup mapper to map each entity to its corresponding ViewModel
        _mockMapper.Setup(m => m.Map<PersonViewModel>(personEntities[0])).Returns(personViewModels[0]);
        _mockMapper.Setup(m => m.Map<PersonViewModel>(personEntities[1])).Returns(personViewModels[1]);

        // Act
        var result = await _personService.GetAllAsync();
        var resultList = result.ToList();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, resultList.Count);

        // Verify first person
        Assert.Equal(1, resultList[0].Id);
        Assert.Equal("John", resultList[0].FirstName);
        Assert.Equal("Doe", resultList[0].LastName);
        Assert.Equal(new DateOnly(1980, 1, 15), resultList[0].DateOfBirth);
        Assert.Equal(5, resultList[0].DepartmentId);

        // Verify second person
        Assert.Equal(2, resultList[1].Id);
        Assert.Equal("Jane", resultList[1].FirstName);
        Assert.Equal("Smith", resultList[1].LastName);
        Assert.Equal(new DateOnly(1985, 5, 20), resultList[1].DateOfBirth);
        Assert.Equal(3, resultList[1].DepartmentId);

        _mockPersonRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdatePersonAndSaveChanges()
    {
        // Arrange
        var personViewModel = new PersonViewModel
        {
            Id = 1,
            FirstName = "John",
            LastName = "Updated",
            DateOfBirth = new DateOnly(1980, 1, 15),
            DepartmentId = 7
        };

        var personEntity = new Person
        {
            Id = 1,
            FirstName = "John",
            LastName = "Updated",
            DateOfBirth = new DateOnly(1980, 1, 15),
            DepartmentId = 7
        };

        _mockMapper.Setup(m => m.Map<Person>(personViewModel)).Returns(personEntity);
        _mockPersonRepository.Setup(r => r.UpdateAsync(personEntity)).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync()).Returns(Task.CompletedTask);

        // Act
        await _personService.UpdateAsync(personViewModel);

        // Assert
        _mockPersonRepository.Verify(r => r.UpdateAsync(personEntity), Times.Once);
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ShouldDeletePersonAndSaveChanges()
    {
        // Arrange
        int personId = 1;

        _mockPersonRepository.Setup(r => r.DeleteAsync(personId)).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync()).Returns(Task.CompletedTask);

        // Act
        await _personService.DeleteAsync(personId);

        // Assert
        _mockPersonRepository.Verify(r => r.DeleteAsync(personId), Times.Once);
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithExceptionInRepository_ShouldPropagateException()
    {
        // Arrange
        var personViewModel = new PersonViewModel
        {
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = new DateOnly(1980, 1, 15),
            DepartmentId = 5
        };

        var personEntity = new Person
        {
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = new DateOnly(1980, 1, 15),
            DepartmentId = 5
        };

        _mockMapper.Setup(m => m.Map<Person>(personViewModel)).Returns(personEntity);
        _mockPersonRepository.Setup(r => r.AddAsync(personEntity)).ThrowsAsync(new System.Exception("Database error"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<System.Exception>(() => _personService.CreateAsync(personViewModel));
        Assert.Equal("Database error", exception.Message);
    }

    [Fact]
    public async Task GetAllAsync_WithEmptyRepository_ShouldReturnEmptyCollection()
    {
        // Arrange
        var emptyList = new List<Person>();
        _mockPersonRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(emptyList);

        // Act
        var result = await _personService.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public void Constructor_WithNullDependencies_ShouldThrowArgumentNullException()
    {
        // Arrange, Act & Assert
        Assert.Throws<System.ArgumentNullException>(() => new PersonService(null, _mockLogger.Object, _mockMapper.Object));
        Assert.Throws<System.ArgumentNullException>(() => new PersonService(_mockUnitOfWork.Object, null, _mockMapper.Object));
        Assert.Throws<System.ArgumentNullException>(() => new PersonService(_mockUnitOfWork.Object, _mockLogger.Object, null));
    }
}
