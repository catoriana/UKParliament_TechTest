using Microsoft.AspNetCore.Mvc;
using UKParliament.CodeTest.Services;

namespace UKParliament.CodeTest.Web.Controllers;

/// <summary>
/// The Department Controller class.
/// </summary>
/// <seealso cref="ControllerBase" />
[ApiController]
[Route("api/[controller]")]
public class DepartmentController: ControllerBase
{
    private readonly IDepartmentService _departmentService;

    /// <summary>
    /// Initializes a new instance of the <see cref="DepartmentController"/> class.
    /// </summary>
    /// <param name="departmentService">The Department Service.</param>
    public DepartmentController(IDepartmentService departmentService)
    {
        _departmentService = departmentService ?? throw new ArgumentNullException(nameof(departmentService));
    }

    /// <summary>
    /// Get All Departments.
    /// </summary>
    /// <returns>The IActionResult async task.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var departments = await this._departmentService.GetAllAsync();
        return Ok(departments);
    }
}
