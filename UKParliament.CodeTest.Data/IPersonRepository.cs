using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data;

/// <summary>
/// Person repository interface.
/// </summary>
public interface IPersonRepository
{
    /// <summary>
    /// Gets all persons.
    /// </summary>
    /// <returns>IEnumerable of persons.</returns>
    Task<IEnumerable<Person>> GetAllAsync();

    /// <summary>
    /// Adds a person.
    /// </summary>
    /// <param name="person">The person model.</param>
    /// <returns>The Person with the given Identifier.</returns>
    Task<Person> AddAsync(Person person);

    /// <summary>
    /// Updates a person.
    /// </summary>
    /// <param name="person">The person model.</param>
    /// <returns>Task result.</returns>
    Task UpdateAsync(Person person);

    /// <summary>
    /// Deletes a person.
    /// </summary>
    /// <param name="id">The person identifier.</param>
    /// <returns>Task result.</returns>
    Task DeleteAsync(int id);
}
