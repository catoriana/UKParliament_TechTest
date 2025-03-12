using AutoMapper;
using Microsoft.Extensions.Logging;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Data.Models;
using UKParliament.CodeTest.ViewModels;


namespace UKParliament.CodeTest.Services;

/// <summary>
/// The Person Service class.
/// </summary>
/// <seealso cref="IPersonService" />
public class PersonService : IPersonService
{
    private readonly IUnitOfWork _unitOfWork;

    private readonly ILogger<PersonService> _logger;

    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="PersonService"/> class.
    /// </summary>
    /// <param name="unitOfWork">The database context.</param>
    /// <param name="logger">The logger context.</param>
    /// <param name="mapper">The auto mapper.</param>
    public PersonService(IUnitOfWork unitOfWork, ILogger<PersonService> logger, IMapper mapper)
    {
        this._unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        this._logger = logger ?? throw new ArgumentNullException(nameof(logger));
        this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    /// <inheritdoc/>
    public async Task<PersonViewModel> CreateAsync(PersonViewModel model)
    {
        // Convert ViewModel to Entity using automapper
        var person = _mapper.Map<Person>(model);

        var updatedPerson = await _unitOfWork.PersonRepository.AddAsync(person);
        await _unitOfWork.SaveChangesAsync();

        // Convert back to ViewModel with the generated Id
        return _mapper.Map<PersonViewModel>(updatedPerson); ;
    }

    /// <inheritdoc/>
    public async Task DeleteAsync(int id)
    {
        await _unitOfWork.PersonRepository.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<PersonViewModel>> GetAllAsync()
    {
        var people = await _unitOfWork.PersonRepository.GetAllAsync();
        return people.Select(p => this._mapper.Map<PersonViewModel>(p));
    }

    /// <inheritdoc/>
    public async Task UpdateAsync(PersonViewModel model)
    {
        // Convert ViewModel to Entity using automapper
        var person = _mapper.Map<Person>(model);
        await _unitOfWork.PersonRepository.UpdateAsync(person);
        await _unitOfWork.SaveChangesAsync();
    }
}
