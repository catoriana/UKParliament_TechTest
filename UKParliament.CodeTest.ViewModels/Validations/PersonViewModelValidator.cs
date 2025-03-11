using FluentValidation;
using UKParliament.CodeTest.ViewModels.Contants;

namespace UKParliament.CodeTest.ViewModels.Validations;

/// <summary>
/// The PersonViewModelValidator class.
/// </summary>
public class PersonViewModelValidator: AbstractValidator<PersonViewModel>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="PersonViewModelValidator"/> class.
    /// </summary>
    public PersonViewModelValidator()
    {
        RuleFor(p => p.Id).NotEmpty().WithMessage("Id is required.");
        RuleFor(p => p.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required")
            .Must(BeAValidDate).WithMessage("Please provide a valid date of birth")
            .LessThan(DateOnly.FromDateTime(DateTime.Now)).WithMessage("Date of birth cannot be in the future")
            .Must(BeWithInAgeRange).WithMessage("The persons age must be between 18 and 120 years old");
            
        RuleFor(p => p.FirstName)
            .NotEmpty().WithMessage("FirstName is required")
            .MaximumLength(100).WithMessage("Firstname is to long.")
            .Matches(RegexContants.StringFirstLastNamePattern).WithMessage("FirstName is invalid.");
        RuleFor(p => p.LastName)
            .NotEmpty().WithMessage("LastName is required")
            .MaximumLength(100).WithMessage("LastName is to long.")
            .Matches(RegexContants.StringFirstLastNamePattern).WithMessage("LastName is invalid.");
        RuleFor(p => p.DepartmentId)
            .NotEmpty().WithMessage("Department is required");
    }

    private bool BeAValidDate(DateOnly date)
    {
        // Basic validation - DateOnly itself helps ensure it's a valid date
        return date != default;
    }

    private bool BeWithInAgeRange(DateOnly dateOfBirth)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = today.Year - dateOfBirth.Year;

        // Adjust age if birthday hasn't occurred yet this year
        if (dateOfBirth.Month > today.Month ||
        (dateOfBirth.Month == today.Month && dateOfBirth.Day > today.Day))
        {
            age--;
        }

        // age range
        return age >= ValidationConstants.MinPersonAgeRange && age <= ValidationConstants.MaxPersonAgeRange;
    }
}
