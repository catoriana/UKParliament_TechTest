using Microsoft.AspNetCore.Mvc;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.ViewModels;

namespace UKParliament.CodeTest.Web.Controllers;

/// <summary>
/// The Person Controller class.
/// </summary>
/// <seealso cref="ControllerBase" />
[ApiController]
[Route("api/[controller]")]
public class PersonController : ControllerBase
{
    private readonly IPersonService _personService;

    /// <summary>
    /// Initializes a new instance of the <see cref="PersonController"/> class.
    /// </summary>
    /// <param name="personService">The Person Service.</param>
    public PersonController(IPersonService personService)
    {
        _personService = personService ?? throw new ArgumentNullException(nameof(personService));
    }

    /// <summary>
    /// Get All Persons.
    /// </summary>
    /// <returns>The IActionResult async task.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var persons = await this._personService.GetAllAsync();
        return Ok(persons);
    }

    /// <summary>
    /// Create a Person.
    /// </summary>
    /// <param name="model">The PersonViewModel.</param>
    /// <returns>The IActionResult async task.</returns>
    [HttpPost]
    public async Task<IActionResult> CreatePersonAsync(PersonViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await this._personService.CreateAsync(model);
        return CreatedAtAction(nameof(CreatePersonAsync), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update a Person.
    /// </summary>
    /// <param name="model">The PersonViewModel.</param>
    /// <returns>The IActionResult async task.</returns>
    [HttpPut]
    public async Task<IActionResult> UpdatePersonAsync(PersonViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        try
        {
            await this._personService.UpdateAsync(model);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
            throw;
        }
    }

    /// <summary>
    /// Delete a Person.
    /// </summary>
    /// <param name="id">The Person Identifier.</param>
    /// <returns>The IActionResult async task.</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePersonAsync(int id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await this._personService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
            throw;
        }
    }
}
