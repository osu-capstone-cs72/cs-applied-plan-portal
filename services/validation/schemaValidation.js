// File: schemaValidation.js
// Description: Validates a submitted object against a predefined schema.

const validator = require("validator");
const {Type} = require("../../entities/type");

// Schema of a create Plan request used for the validator and the database.
const postPlanSchema = {
  planName: {
    required: true,
    type: Type.string,
    minLength: 5,
    maxLength: 50,
    getErrorMessage: function() {
      return "Invalid plan name:\n" +
        `The plan name must be a string between ${this.minLength} and ` +
        `${this.maxLength} characters long.`;
    }
  },
  courses: {
    required: true,
    type: Type.courseArray,
    getErrorMessage: function() {
      return "Invalid courses:\n" +
        `Courses must be an array of strings.`;
    }
  }
};
exports.postPlanSchema = postPlanSchema;

// Schema of a patch Plan request used for the validator and the database.
const patchPlanSchema = {
  planId: {
    required: true,
    type: Type.integer,
    minValue: 1,
    maxValue: Infinity,
    getErrorMessage: function() {
      return "Invalid plan ID:\n" +
        "The plan ID associated with this request must be a number greater than zero.";
    }
  },
  planName: {
    required: false,
    type: Type.string,
    minLength: 5,
    maxLength: 50,
    getErrorMessage: function() {
      return "Invalid plan name:\n" +
        `The plan name must be a string between ${this.minLength} and ` +
        `${this.maxLength} characters long.`;
    }
  },
  courses: {
    required: false,
    type: Type.courseArray,
    getErrorMessage: function() {
      return "Invalid courses:\n" +
        `Courses must be an array of strings.`;
    }
  }
};
exports.patchPlanSchema = patchPlanSchema;

// Schema of a search Plan request used for the validator and the database.
const searchPlanSchema = {
  text: {
    required: true,
    type: Type.string,
    getErrorMessage: function() {
      return "Invalid search text:\n" +
        `The search text must be a string.`;
    }
  },
  search: {
    required: true,
    type: Type.integer,
    minValue: 0,
    maxValue: Infinity,
    getErrorMessage: function() {
      return "Invalid search value:\n" +
        "The search value associated with this request must be a number greater than zero.";
    }
  },
  status: {
    required: true,
    type: Type.integer,
    minValue: 0,
    maxValue: Infinity,
    getErrorMessage: function() {
      return "Invalid status value:\n" +
        "The status value associated with this request must be a number greater than zero.";
    }
  },
  sort: {
    required: true,
    type: Type.integer,
    minValue: 0,
    maxValue: Infinity,
    getErrorMessage: function() {
      return "Invalid sort value:\n" +
        "The sort value associated with this request must be a number greater than zero.";
    }
  },
  order: {
    required: true,
    type: Type.integer,
    minValue: 0,
    maxValue: Infinity,
    getErrorMessage: function() {
      return "Invalid order value:\n" +
        "The order value associated with this request must be a number greater than zero.";
    }
  }
};
exports.searchPlanSchema = searchPlanSchema;

// Schema of a user.
const userSchema = {
  firstName: {
    required: true,
    type: Type.string,
    minLength: 1,
    maxLength: 50,
    getErrorMessage: function() {
      return "Invalid user's first name:\n" +
        `The user's first name must be a string between ${this.minLength} ` +
        `and ${this.maxLength} characters long.`;
    }
  },
  lastName: {
    required: true,
    type: Type.string,
    minLength: 1,
    maxLength: 50,
    getErrorMessage: function() {
      return "Invalid user's last name:\n" +
        `The user's last name must be a string between ${this.minLength} ` +
        `and ${this.maxLength} characters long.`;
    }
  },
  email: {
    required: true,
    type: Type.email,
    getErrorMessage: function() {
      return "Invalid user's email:\n" +
        "The user's email must be a string in a valid email format, e.g. " +
        "email@example.com.";
    }
  },
  role: {
    required: true,
    type: Type.integer,
    minValue: 0,
    maxValue: 2,
    getErrorMessage: function() {
      return "Invalid user's role:\n" +
        "User's role must be 0 (Student), 1 (Advisor), or 2 (Head Advisor).";
    }
  }
};
exports.userSchema = userSchema;

// Schema of a comment made on a plan.
const commentSchema = {
  planId: {
    required: true,
    type: Type.integer,
    minValue: 1,
    maxValue: Infinity,
    getErrorMessage: function() {
      return "Invalid plan ID:\n" +
        "Plan ID must be a number greater than zero.";
    }
  },
  text: {
    required: true,
    type: Type.string,
    minLength: 5,
    maxLength: 500,
    getErrorMessage: function() {
      return `Invalid comment:\n` +
        `Comment must be between ${this.minLength} and ${this.maxLength}` +
        ` characters long`;
    }
  }
};
exports.commentSchema = commentSchema;

// Schema of a review made on a plan.
const reviewSchema = {
  planId: {
    required: true,
    type: Type.integer,
    minValue: 1,
    maxValue: Infinity,
    getErrorMessage: function() {
      return "Invalid plan ID:\n" +
        "Plan ID must be an integer.";
    }
  },
  status: {
    required: true,
    type: Type.integer,
    minValue: 0,
    maxValue: 4,
    getErrorMessage: function() {
      return "Invalid status:\n" +
        "Status must be a number between 0 and 4";
    }
  }
};
exports.reviewSchema = reviewSchema;

// Validates an object against a provided schema.
//
// Returns an empty string (a falsy value) if the object is valid to the schema.
// Otherwise, returns a non-empty string (a truthy value) specifying the
// validation error message.
//
// Note:
// - An object can have properties that are not in the schema and can still be
//   valid.
//
// - Extra properties not in schema are ignored and are not included in the
//   sanitized object.
//
// - For partial objects (e.g. usually those come from PATCH requests), not all
//   properties are provided. In these cases, this function ignores keys not in
//   the schema and only validates the rest.
function getSchemaViolations(obj, schema, isPartialObj = false) {
  // return an error string if the input is not an object
  if (obj !== Object(obj)) {
    return "Invalid input type\n\n";
  }

  // return an error string if object doesn't have matching keys with schema
  if (Object.keys(obj).every(key => !(key in schema))) {
    return "Input has no matching key with schema\n\n";
  }

  // at this point, it is guaranteed that the object has some matching keys with
  // the schema and possibly some keys that are not in the schema
  let errorMessage = "";

  if (isPartialObj) {
    // partial-object case: for every property in the object
    Object.keys(obj).forEach(key => {
      // validate if property is in schema, otherwise ignore it
      if (hasProperty(schema, key)) {
        // append an error message if any or an empty string if no error
        errorMessage += getPropertyViolation(obj, key, schema);
      }
    });
  } else {
    // strict-object case: for every property in the schema
    Object.keys(schema).forEach(key => {
      // validate if property is required by schema, otherwise ignore it
      if (schema[key].required) {
        errorMessage += getPropertyViolation(obj, key, schema);
      }
    });
  }

  // final result is still an empty string if there's no schema violation,
  // otherwise it contains validation error messages separated by newlines
  return errorMessage;
}
exports.getSchemaViolations = getSchemaViolations;

// Validates a single property of an object against a provided schema.
//
// Returns an empty string (a falsy value) if the property is valid to the
// schema. Otherwise, returns a non-empty string (a truthy value) specifying the
// validation error message.
//
// Preconditions:
// - Requires the property to be already in the schema.
function getPropertyViolation(obj, property, schema) {
  // if property is not in the schema, return an error string
  // (this should never happen)
  if (!hasProperty(schema, property)) {
    return `Property "${property}" not in schema\n\n`;
  }

  // if object does not have the property at all, return an error string
  if (!hasProperty(obj, property)) {
    return `Property "${property}" not in input\n\n`;
  }

  // at this point, it is guaranteed that both object and schema have a matching
  // property
  let isValid;

  // validate the property based on its type
  switch (schema[property].type) {
    case Type.integer:
      isValid = validator.isInt(obj[property] + "", {
        min: schema[property].minValue,
        max: schema[property].maxValue
      });
      break;

    case Type.string:
      isValid = validator.isLength(obj[property] + "", {
        min: schema[property].minLength,
        max: schema[property].maxLength
      });
      break;

    case Type.timestamp:
      // time format must be ISO 8601, e.g. "2020-12-31T23:59:59Z"
      isValid = validator.isISO8601(obj[property] + "", {
        strict: true
      });
      break;

    case Type.courseArray:
      isValid = Array.isArray(obj.courses);
      break;

    case Type.email:
      isValid = validator.isEmail(obj[property] + "");
      break;

    // if property is not of the allowed types, it's not valid
    default:
      isValid = false;
      break;
  }

  // return an empty string if pass the validator or return a non-empty error
  // string otherwise
  return isValid ? "" : (schema[property].getErrorMessage());
}

// Sanitizes an object using a provided schema by extracting valid properties to
// a new object and returns that object.
//
// Note:
// - This function assumes the object has been validated against the schema.
// - This function does not support nested objects or with arrays inside.
function sanitizeUsingSchema(obj, schema) {
  const validObj = {};
  if (obj) {
    // since this function assumes the object has been validated against the
    // schema, a property is valid if it is in the schema
    Object.keys(schema).forEach(key => {
      if (hasProperty(obj, key)) {
        validObj[key] = obj[key];
      }
    });
  }
  return validObj;
}
exports.sanitizeUsingSchema = sanitizeUsingSchema;

// A shorthand to check whether an object has a property that is
// neither `null` nor `undefined`.
function hasProperty(obj, property) {
  return obj && obj[property] !== null && obj[property] !== undefined;
}
