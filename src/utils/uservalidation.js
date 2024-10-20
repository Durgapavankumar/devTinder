const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Not a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Not a valid password");
  }
};

const validateEditProfileData = (req) => {
  const editableData = [
    "skills",
    "firstName",
    "lastName",
    "age",
    "about",
    "gender",
    "profileURL",
  ];

  // Use .every() to check if all keys in the request body are allowed to be edited
  const isEditAllowed = Object.keys(req.body).every((key) =>
    editableData.includes(key)
  );

  if (!isEditAllowed) {
    throw new Error("Invalid Edit Request!");
  }

  return true;
};

module.exports = { validateSignUpData, validateEditProfileData };
