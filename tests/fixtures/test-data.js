// tests/fixtures/test-data.js
export const testEmployees = {
  validEmployee: {
    firstName: 'John',
    lastName: 'Doe',
    dependants: 2
  },

  employeeWithNoDependants: {
    firstName: 'Jane',
    lastName: 'Smith',
    dependants: 0
  },

  employeeWithManyDependants: {
    firstName: 'Bob',
    lastName: 'Johnson',
    dependants: 5
  },

  employeeWithInvalidDependants: {
    firstName: 'Bob',
    lastName: 'Johnson',
    dependants: -1
  }
};

export const invalidEmployees = {
  missingFirstName: {
    lastName: 'Test',
    dependants: 1
  },

  missingLastName: {
    firstName: 'Invalid',
    dependants: 5
  },

  extendedEmployee: {
    firstName: 'Extendedmorethanfiftycharacters123456789012345678901234567890',
    lastName: 'Extendedmorethanfiftycharacters123456789012345678901234567890',
    dependants: 33
  }
};



