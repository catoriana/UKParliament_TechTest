using FluentValidation;
using UKParliament.CodeTest.ViewModels.Contants;

namespace UKParliament.CodeTest.ViewModels.Validations;

/// <summary>
/// The DepartmentViewModelValidator class.
/// </summary>
public class DepartmentViewModelValidator: AbstractValidator<DepartmentViewModel>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DepartmentViewModelValidator"/> class.
    /// </summary>
    public DepartmentViewModelValidator()
    {
        RuleFor(p => p.Id).NotEmpty().WithMessage("Id is required.");
        RuleFor(p => p.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name is too long.")
            .Matches(RegexContants.StringNamePattern).WithMessage("Name is invalid.");
    }
}
