using AutoMapper;
using Microsoft.Extensions.Logging;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.ViewModels;

namespace UKParliament.CodeTest.Services;

/// <summary>
/// The Department Service class.
/// </summary>
/// <seealso cref="IDepartmentService" />
public class DepartmentService : IDepartmentService
{
    private readonly IUnitOfWork _unitOfWork;

    private readonly ILogger<DepartmentService> _logger;

    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="DepartmentService"/> class.
    /// </summary>
    /// <param name="unitOfWork">The database context.</param>
    /// <param name="logger">The logger context.</param>
    /// <param name="mapper">The auto mapper.</param>
    public DepartmentService(IUnitOfWork unitOfWork, ILogger<DepartmentService> logger, IMapper mapper)
    {
        this._unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        this._logger = logger ?? throw new ArgumentNullException(nameof(logger));
        this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<DepartmentViewModel>> GetAllAsync()
    {
        var departments = await _unitOfWork.DepartmentRepository.GetAllAsync();
        return departments.Select(d => this._mapper.Map<DepartmentViewModel>(d));
    }
}
