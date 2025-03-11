using UKParliament.CodeTest.ViewModels.Validations;

namespace UKParliament.CodeTest.ViewModels.Tests;

public class PersonViewModelValidatorTests
{
    private readonly PersonViewModelValidator _validator;

    public PersonViewModelValidatorTests()
    {
        _validator = new PersonViewModelValidator();
    }

    [Fact]
    public void Validate_ShouldFail_When_Id_Is_Empty()
    {
        // Arrange
        var model = new PersonViewModel { Id = 0, FirstName = "FirstName", LastName = "LastName", DepartmentId = 1, DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddYears(-21)) }; // Assuming 0 is invalid

        // Act
        var result = _validator.Validate(model);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Id" && e.ErrorMessage == "Id is required.");
    }

    [Fact]
    public void Validate_ShouldFail_When_DateOfBirth_Is_Default()
    {
        var model = new PersonViewModel { DateOfBirth = default };

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "DateOfBirth" && e.ErrorMessage == "Please provide a valid date of birth");
    }

    [Fact]
    public void Validate_ShouldFail_When_DateOfBirth_Is_Future()
    {
        var model = new PersonViewModel { DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddDays(1)) };

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "DateOfBirth" && e.ErrorMessage == "Date of birth cannot be in the future");
    }

    [Fact]
    public void Validate_ShouldFail_When_DateOfBirth_Is_Under_18()
    {
        var underageDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-17).AddDays(-364)); // 17 years old
        var model = new PersonViewModel
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = underageDate,
            DepartmentId = 2
        };

        // Act
        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "DateOfBirth" && e.ErrorMessage == "The persons age must be between 18 and 120 years old");
    }

    [Fact]
    public void Validate_ShouldPass_When_DateOfBirth_Is_Exactly_18()
    {
        // Arrange
        var exactly18Date = DateOnly.FromDateTime(DateTime.Today.AddYears(-18)); // 18 years old
        var model = new PersonViewModel
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = exactly18Date,
            DepartmentId = 2
        };

        // Act
        var result = _validator.Validate(model);

        // Assert
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validate_ShouldFail_When_DateOfBirth_Is_Over_100()
    {
        var tooOldDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-101)); //101 years old
        var model = new PersonViewModel
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = tooOldDate,
            DepartmentId = 2
        };

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "DateOfBirth" && e.ErrorMessage == "The persons age must be between 18 and 120 years old");
    }

    [Fact]
    public void Validate_ShouldPass_When_DateOfBirth_Is_Exactly_100()
    {
        // Arrange
        var exactly100Date = DateOnly.FromDateTime(DateTime.Today.AddYears(-100)); // 100 years old
        var model = new PersonViewModel
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = exactly100Date,
            DepartmentId = 2
        };

        // Act
        var result = _validator.Validate(model);

        // Assert
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validate_ShouldFail_When_FirstName_Is_Empty()
    {
        var model = new PersonViewModel { FirstName = string.Empty };

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "FirstName" && e.ErrorMessage == "FirstName is required");
    }

    [Fact]
    public void Validate_ShouldFail_When_LastName_Is_Empty()
    {
        var model = new PersonViewModel { LastName = string.Empty };

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "LastName" && e.ErrorMessage == "LastName is required");
    }

    [Fact]
    public void Validate_ShouldFail_When_DepartmentId_Is_Null()
    {
        var model = new PersonViewModel { DepartmentId = 0 };

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "DepartmentId" && e.ErrorMessage == "Department is required");
    }

    [Fact]
    public void Validate_ShouldPass_When_AllFields_AreValid()
    {
        var model = new PersonViewModel
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = DateOnly.FromDateTime(DateTime.Today.AddYears(-25)),
            DepartmentId = 2
        };

        var result = _validator.Validate(model);

        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }
}
