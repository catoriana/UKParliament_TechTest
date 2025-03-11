using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UKParliament.CodeTest.Data.Models;

/// <summary>
/// The Person class.
/// </summary>
public class Person
{
    /// <summary>
    /// Gets or sets the identifier.
    /// </summary>
    /// <value>
    /// The identifier.
    /// </value>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the FirstName.
    /// </summary>
    /// <value>
    /// The FirstName.
    /// </value>
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; }

    /// <summary>
    /// Gets or sets the LastName.
    /// </summary>
    /// <value>
    /// The LastName.
    /// </value>
    [Required, StringLength(100)]
    public string LastName { get; set; }

    /// <summary>
    /// Gets or sets the DateOfBirth.
    /// </summary>
    /// <value>
    /// The DateOfBirth.
    /// </value>
    [Required]
    [DataType(DataType.Date)]
    public DateOnly DateOfBirth { get; set; }

    /// <summary>
    /// Gets or sets the DepartmentId.
    /// </summary>
    /// <value>
    /// The DepartmentId.
    /// </value>
    public int DepartmentId { get; set; }

    /// <summary>
    /// Gets or sets the Department.
    /// </summary>
    /// <value>
    /// The Department.0
    /// </value>
    public Department? Department { get; set; }

}
