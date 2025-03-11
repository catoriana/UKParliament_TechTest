using UKParliament.CodeTest.ViewModels.Validations;

namespace UKParliament.CodeTest.ViewModels.Tests;


public class DepartmentViewModelValidatorTests
{
    private readonly DepartmentViewModelValidator _validator;

    public DepartmentViewModelValidatorTests()
    {
        _validator = new DepartmentViewModelValidator();
    }

    [Fact]
    public void Validate_ShouldFail_When_Id_Is_Empty()
    {
        var model = new DepartmentViewModel { Id = 0 }; // Assuming 0 is invalid

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Id" && e.ErrorMessage == "Id is required.");
    }

    [Fact]
    public void Validate_ShouldFail_When_Name_Is_Empty()
    {
        var model = new DepartmentViewModel { Name = String.Empty };

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name" && e.ErrorMessage == "Name is required");
    }

    [Fact]
    public void Validate_ShouldFail_When_Name_Is_Too_Long()
    {
        var model = new DepartmentViewModel { Name = new string('A', 101) }; // 101 characters long

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name" && e.ErrorMessage == "Name is too long.");
    }

    [Fact]
    public void Validate_ShouldFail_When_Name_DoesNot_Match_Pattern()
    {
        var model = new DepartmentViewModel { Name = "Invalid@Name!" }; // Assuming Regex rejects special characters

        var result = _validator.Validate(model);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name" && e.ErrorMessage == "Name is invalid.");
    }

    [Fact]
    public void Validate_ShouldPass_When_AllFields_AreValid()
    {
        var model = new DepartmentViewModel
        {
            Id = 1,
            Name = "Finance"
        };

        var result = _validator.Validate(model);

        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }
}

