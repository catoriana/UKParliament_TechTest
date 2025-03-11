namespace UKParliament.CodeTest.ViewModels.Contants;

/// <summary>
/// The RegexContants class.
/// </summary>
public static class RegexContants
{
    /// <summary>
    /// Regex for Name Only letters and spaces are allowed.
    /// </summary>
    public const string StringNamePattern = "^[a-zA-Z\\s]+$";

    /// <summary>
    /// Regex for First and Last Name.
    /// </summary>
    public const string StringFirstLastNamePattern = "^[A-Za-z ,.'-]+$";

}
