using UKParliament.CodeTest.ViewModels;

namespace UKParliament.CodeTest.Services;

/// <summary>
/// Department service interface.
/// </summary>
public interface IDepartmentService
{
    /// <summary>
    /// Gets all departments.
    /// </summary>
    /// <returns>IEnumerable of DepartmentViewModel.</returns>
    Task<IEnumerable<DepartmentViewModel>> GetAllAsync();
}
