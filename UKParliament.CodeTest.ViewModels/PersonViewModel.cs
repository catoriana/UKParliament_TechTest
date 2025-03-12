namespace UKParliament.CodeTest.ViewModels;

/// <summary>
/// The PersonViewModel class.
/// </summary>
public class PersonViewModel
{
    /// <summary>
    /// Gets or sets the identifier.
    /// </summary>
    /// <value>
    /// The identifier.
    /// </value>
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public DateOnly DateOfBirth { get; set; }

    public int DepartmentId { get; set; }

    public DepartmentViewModel? Department { get; set; }
}
