using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data;

/// <summary>
/// The DepartmentRepository class.
/// </summary>
/// <seealso cref="IDepartmentRepository" />
public class DepartmentRepository: IDepartmentRepository
{
    private readonly PersonManagerContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="DepartmentRepository"/> class.
    /// </summary>
    /// <param name="context">The database context.</param>
    public DepartmentRepository(PersonManagerContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<Department>> GetAllAsync()
    {
        return await _context.Departments
            .AsNoTracking()
            .ToListAsync();
    }
}
