class ValidationError extends Error {
  constructor() {
    super();
    this.name = Object.getPrototypeOf(this).constructor.name;
    this.message = `An unspecified error occurred.`;
    this.status = 400;
  }
}
exports.ValidationError = ValidationError;

class UserError extends ValidationError {
  constructor() {
    super();
    this.message = `The specified ONID credentials are invalid.`;
  }
}
exports.UserError = UserError;

class PrivilegeError extends ValidationError {
  constructor() {
    super();
    this.message = `The user is not permitted to submit a plan.`;
  }
}
exports.PrivilegeError = PrivilegeError;

// Let the validation function set the message, since it can more easily
// specify whether the name is too long, too short, or otherwise invalid.
class PlanNameError extends ValidationError {
  constructor(message) {
    super();
    this.message = message || `The plan's name is invalid.`;
  }
}
exports.PlanNameError = PlanNameError;

class EmptyPlanError extends ValidationError {
  constructor() {
    super();
    this.message = `The plan cannot be empty.`;
  }
}
exports.EmptyPlanError = EmptyPlanError;

class DuplicateCourseError extends ValidationError {
  constructor(course = "a course") {
    super();
    this.message = `The plan may not include ${course} more than once.`;
  }
}
exports.DuplicateCourseError = DuplicateCourseError;

// It looks like the database query is not capable of retrieving the names or
// IDs of invalid courses.
class InvalidCourseError extends ValidationError {
  constructor(course) {
    super();
    let courseName = (typeof course !== "undefined" ? " " + course : "");
    this.message = `The plan contains an invalid course name${courseName}.`;
  }
}
exports.InvalidCourseError = InvalidCourseError;

// It looks like the database query is not capable of retrieving the names or
// IDs of the restricted courses.
class CourseRestrictionError extends ValidationError {
  // constructor(course = "one of the courses listed") {
  constructor(message) {
    super();
    // this.message = `The student is ineligible to register for ${course}.`;
    this.message = message || `The student is ineligible to register for one of the courses listed.`;
  }
}
exports.CourseRestrictionError = CourseRestrictionError;

// Allow the validation function to add a more specific message, e.g., the 
// number of additional credits needed, a specific minimum value, etc.
class PlanCreditsError extends ValidationError {
  constructor(message) {
    super();
    this.message = message || `The plan does not contain enough credits.`;
  }
}
exports.PlanCreditsError = PlanCreditsError;

class InternalValidationError extends ValidationError {
  constructor(message) {
    super();
    this.message = message || `An internal error occurred.`;
    this.status = 500;
  }
}
exports.InternalValidationError = InternalValidationError;
