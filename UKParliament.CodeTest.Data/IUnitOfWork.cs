using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UKParliament.CodeTest.Data;

/// <summary>
/// Unit of work interface.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    /// Gets the IPersonRepository.
    /// </summary>
    /// <value>
    /// The IPersonRepository.
    /// </value>
    IPersonRepository PersonRepository { get; }

    /// <summary>
    /// Gets the IDepartmentRepository.
    /// </summary>
    /// <value>
    /// The IDepartmentRepository.
    /// </value>
    IDepartmentRepository DepartmentRepository { get; }

    /// <summary>
    /// Saves Changes to the Database repository.
    /// </summary>
    /// <returns>Task result.</returns>
    Task SaveChangesAsync();
}
