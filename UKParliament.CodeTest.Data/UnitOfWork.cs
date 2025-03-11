namespace UKParliament.CodeTest.Data;

/// <summary>
/// The UnitOfWork class.
/// </summary>
/// <seealso cref="IUnitOfWork" />
public class UnitOfWork: IUnitOfWork
{
    private readonly PersonManagerContext _context;

    /// <inheritdoc/>
    public IPersonRepository PersonRepository { get; }

    /// <inheritdoc/>
    public IDepartmentRepository DepartmentRepository { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="UnitOfWork"/> class.
    /// </summary>
    /// <param name="context">The database context.</param>
    public UnitOfWork(PersonManagerContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        PersonRepository = new PersonRepository(_context);
        DepartmentRepository = new DepartmentRepository(_context);
    }

    /// <inheritdoc/>
    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    /// <inheritdoc/>
    public void Dispose()
    {
        _context.Dispose();
    }
}

