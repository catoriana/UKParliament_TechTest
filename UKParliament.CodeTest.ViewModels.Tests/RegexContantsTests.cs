using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using UKParliament.CodeTest.ViewModels.Contants;

namespace UKParliament.CodeTest.ViewModels.Tests;

public class RegexContantsTests
{
    [Theory]
    [InlineData("Valid Department", true)] // Valid input (letters and spaces)
    [InlineData("Department123", false)]  // Invalid input (numbers are not allowed)
    [InlineData("Dept@Name", false)]      // Invalid input (special characters are not allowed)
    [InlineData("Department Name", true)] // Valid input (letters and space)
    public void StringNamePattern_ShouldMatch_ValidInputs(string input, bool expected)
    {
        var regex = new Regex(RegexContants.StringNamePattern);
        var result = regex.IsMatch(input);

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("John", true)]            // Valid first name
    [InlineData("John Doe", true)]            // Valid first and last name (space allowed)
    [InlineData("John-Doe", true)]            // Valid name with hyphen
    [InlineData("John.O'Doe", true)]         // Valid name with apostrophe
    [InlineData("Jane, Doe", true)]          // Valid name with comma
    [InlineData("Invalid@Name", false)]      // Invalid name (special characters)
    [InlineData("Invalid*Name", false)]      // Invalid name (special characters)
    [InlineData("123456", false)]            // Invalid name (numbers are not allowed)
    public void StringFirstLastNamePattern_ShouldMatch_ValidInputs(string input, bool expected)
    {
        var regex = new Regex(RegexContants.StringFirstLastNamePattern);
        var result = regex.IsMatch(input);

        Assert.Equal(expected, result);
    }
}
