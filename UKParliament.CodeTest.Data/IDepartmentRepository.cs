using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data
{
    /// <summary>
    /// Department repository interface.
    /// </summary>
    public interface IDepartmentRepository
    {
        /// <summary>
        /// Gets all departments.
        /// </summary>
        /// <returns>IEnumerable of departments.</returns>
        Task<IEnumerable<Department>> GetAllAsync();
    }
}
