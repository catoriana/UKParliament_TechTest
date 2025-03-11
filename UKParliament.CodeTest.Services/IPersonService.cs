using UKParliament.CodeTest.ViewModels;

namespace UKParliament.CodeTest.Services;

/// <summary>
/// Person service interface.
/// </summary>
public interface IPersonService
{
    /// <summary>
    /// Gets all persons.
    /// </summary>
    /// <returns>IEnumerable of PersonViewModel.</returns>
    Task<IEnumerable<PersonViewModel>> GetAllAsync();

    /// <summary>
    /// Adds a Person.
    /// </summary>
    /// <param name="model">The person view model.</param>
    /// <returns>ThePersonViewModel.</returns>
    Task<PersonViewModel> CreateAsync(PersonViewModel model);

    /// <summary>
    /// Updates a Person.
    /// </summary>
    /// <param name="model">The person view model.</param>
    /// <returns>Task result.</returns>
    Task UpdateAsync(PersonViewModel model);

    /// <summary>
    /// Deletes a Person.
    /// </summary>
    /// <param name="id">The person identifier.</param>
    /// <returns>Task result.</returns>
    Task DeleteAsync(int id);
}
