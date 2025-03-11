using System.ComponentModel.DataAnnotations;

namespace UKParliament.CodeTest.Data.Models;

/// <summary>
/// The Department class.
/// </summary>
public class Department
{
    /// <summary>
    /// Gets or sets the identifier.
    /// </summary>
    /// <value>
    /// The identifier.
    /// </value>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the Name.
    /// </summary>
    /// <value>
    /// The Name.
    /// </value>
    [Required, MaxLength(100)]
    public string Name { get; set; }
}
