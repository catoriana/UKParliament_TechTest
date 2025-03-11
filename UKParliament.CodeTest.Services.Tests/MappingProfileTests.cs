using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using UKParliament.CodeTest.Data.Models;
using UKParliament.CodeTest.Services.Mappings;
using UKParliament.CodeTest.ViewModels;

namespace UKParliament.CodeTest.Services.Tests;

public class MappingProfileTests
{
    private readonly IMapper _mapper;

    public MappingProfileTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public void MappingProfile_ShouldHaveValidConfiguration()
    {
        // Ensures all mappings are correctly configured
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        config.AssertConfigurationIsValid();
    }

    [Fact]
    public void Should_Map_Person_To_PersonViewModel_Correctly()
    {
        // Arrange
        var person = new Person
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = new DateOnly(1990, 5, 20),
            DepartmentId = 2
        };

        // Act
        var personViewModel = _mapper.Map<PersonViewModel>(person);

        // Assert
        Assert.NotNull(personViewModel);
        Assert.Equal(person.Id, personViewModel.Id);
        Assert.Equal(person.FirstName, personViewModel.FirstName);
        Assert.Equal(person.LastName, personViewModel.LastName);
        Assert.Equal(person.DateOfBirth, personViewModel.DateOfBirth);
        Assert.Equal(person.DepartmentId, personViewModel.DepartmentId);
    }

    [Fact]
    public void Should_Map_PersonViewModel_To_Person_Correctly()
    {
        // Arrange
        var personViewModel = new PersonViewModel
        {
            Id = 2,
            FirstName = "Jane",
            LastName = "Doe",
            DateOfBirth = new DateOnly(1995, 10, 15),
            DepartmentId = 5
        };

        // Act
        var person = _mapper.Map<Person>(personViewModel);

        // Assert
        Assert.NotNull(person);
        Assert.Equal(personViewModel.Id, person.Id);
        Assert.Equal(personViewModel.FirstName, person.FirstName);
        Assert.Equal(personViewModel.LastName, person.LastName);
        Assert.Equal(personViewModel.DateOfBirth, person.DateOfBirth);
        Assert.Equal(personViewModel.DepartmentId, person.DepartmentId);
    }

    [Fact]
    public void Should_Map_Department_To_DepartmentViewModel_Correctly()
    {
        // Arrange
        var department = new Department
        {
            Id = 10,
            Name = "Engineering"
        };

        // Act
        var departmentViewModel = _mapper.Map<DepartmentViewModel>(department);

        // Assert
        Assert.NotNull(departmentViewModel);
        Assert.Equal(department.Id, departmentViewModel.Id);
        Assert.Equal(department.Name, departmentViewModel.Name);
    }

    [Fact]
    public void Should_Map_DepartmentViewModel_To_Department_Correctly()
    {
        // Arrange
        var departmentViewModel = new DepartmentViewModel
        {
            Id = 20,
            Name = "HR"
        };

        // Act
        var department = _mapper.Map<Department>(departmentViewModel);

        // Assert
        Assert.NotNull(department);
        Assert.Equal(departmentViewModel.Id, department.Id);
        Assert.Equal(departmentViewModel.Name, department.Name);
    }
}
