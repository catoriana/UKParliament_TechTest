using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data.Models;

namespace UKParliament.CodeTest.Data;

/// <summary>
/// The PersonRepository class.
/// </summary>
/// <seealso cref="IPersonRepository" />
public class PersonRepository: IPersonRepository
{
    private readonly PersonManagerContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="PersonRepository"/> class.
    /// </summary>
    /// <param name="context">The database context.</param>
    public PersonRepository(PersonManagerContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await _context.People
            .AsNoTracking()
            .Include(p => p.Department)
            .ToListAsync();
    }

    /// <inheritdoc/>
    public async Task<Person> AddAsync(Person person)
    {
        await _context.People.AddAsync(person);
        await _context.SaveChangesAsync();
        return person;
    }

    /// <inheritdoc/>
    public async Task UpdateAsync(Person person)
    {
        var entity = await this._context.People.FindAsync(person.Id);
        if (entity == null)
        {
            throw new KeyNotFoundException($"Person with ID {person.Id} not found.");
        }
        entity.DateOfBirth = person.DateOfBirth;
        entity.FirstName = person.FirstName;
        entity.LastName = person.LastName;
        entity.DepartmentId = person.DepartmentId;
        await _context.SaveChangesAsync();
    }

    /// <inheritdoc/>
    public async Task DeleteAsync(int id)
    {
        var person = await this._context.People.FindAsync(id);
        if (person == null)
        {
            throw new KeyNotFoundException($"Person with ID {id} not found.");
        }
        _context.People.Remove(person);
        await _context.SaveChangesAsync();
    }
}
