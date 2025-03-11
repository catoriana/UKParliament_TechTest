using AutoMapper;
using UKParliament.CodeTest.Data.Models;
using UKParliament.CodeTest.ViewModels;

namespace UKParliament.CodeTest.Services.Mappings;

/// <summary>
/// The MappingProfile class.
/// </summary>
/// <seealso cref="Profile" />
public class MappingProfile: Profile
{
    /// <summary>
    /// Initializes a new instance of the <see cref="MappingProfile"/> class.
    /// </summary>
    public MappingProfile()
    {
        // Person Mapping
        CreateMap<Person, PersonViewModel>().ReverseMap();

        // Department Mapping
        CreateMap<Department, DepartmentViewModel>().ReverseMap();
    }
}
