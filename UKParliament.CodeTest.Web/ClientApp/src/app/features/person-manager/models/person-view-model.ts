import { DepartmentViewModel } from "./department-view-model";

/**
 * The PersonViewModel interface.
 */
export interface PersonViewModel {
  /** Gets or sets the identifier. */
  id: number;

  /** Gets or sets the first name. */
  firstName: string;

  /** Gets or sets the last name. */
  lastName: string;

  /** Gets or sets the date of birth. */
  dateOfBirth: string; // DateOnly maps best to string in TypeScript (ISO 8601 format recommended).

  /** Gets or sets the department identifier. */
  departmentId: number;

  /** Gets or sets the department details. */
  department?: DepartmentViewModel;
}