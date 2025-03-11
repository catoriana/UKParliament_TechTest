using System.ComponentModel.DataAnnotations;

namespace UKParliament.CodeTest.ViewModels;

/// <summary>
/// The DepartmentViewModel class.
/// </summary>
public class DepartmentViewModel
{
    /// <summary>
    /// Gets or sets the identifier.
    /// </summary>
    /// <value>
    /// The identifier.
    /// </value>
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
}
