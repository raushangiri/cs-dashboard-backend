// const mongoose = require("mongoose");
// const auto_loan_schema = new mongoose.Schema(
//   totalAB: {
//     type: Number,
    
//     default: 0,
//   },
//   sixMonthsABB: {
//     type: Number,
    
//     default: 0,
//   },
//   oneYearABB: {
//     type: Number,
    
//     default: 0,
//   },
//   monthlyData: [
//     {
//       month: {
//         type: String,
        
//       },
//       year: {
//         type: Number,
        
//       },
//       dayValues: {
//         type: [Number],
        
//         validate: [arrayLimit, '{PATH} exceeds the limit of 6'], // Ensure there are 6 entries, one for each day (5, 10, 15, 20, 25, 30)
//       },
//       totalAB: {
//         type: Number,
        
//         default: 0,
//       },
//       totalABB: {
//         type: Number,
        
//         default: 0,
//       },
//     },
//   ],

//   // Personal Information
//   name: {
//     type: String,
    
//     trim: true,
//     maxlength: 100,
//   },
//   mobileNumber: {
//     type: String,
    
//     trim: true,
//     validate: {
//       validator: function (v) {
//         return /^\d{10}$/.test(v);
//       },
//       message: props => `${props.value} is not a valid 10-digit mobile number!`,
//     },
//   },
//   alternateNumber: {
//     type: String,
//     validate: {
//       validator: function (v) {
//         return v ? /^\d{10}$/.test(v) : true;
//       },
//       message: props => `${props.value} is not a valid 10-digit alternate number!`,
//     },
//   },
//   dateOfBirth: {
//     type: Date,
    
//     validate: {
//       validator: function (v) {
//         const ageDifMs = Date.now() - v.getTime();
//         const ageDate = new Date(ageDifMs);
//         return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
//       },
//       message: 'Applicant must be at least 18 years old.',
//     },
//   },
//   maritalStatus: {
//     type: String,
//     enum: ['Single', 'Married', 'Other'],
    
//   },
//   spouseName: {
//     type: String,
//     trim: true,
//     maxlength: 100,
//     required: function () {
//       return this.maritalStatus === 'Married';
//     },
//   },
//   fatherName: {
//     type: String,
//     trim: true,
//     maxlength: 100,
    
//   },
//   motherName: {
//     type: String,
//     trim: true,
//     maxlength: 100,
    
//   },

//   // Contact Information
//   permanentAddress: {
//     type: String,
//     trim: true,
    
//     maxlength: 200,
//   },
//   permanentAddressLandmark: {
//     type: String,
//     trim: true,
//     maxlength: 100,
//   },
//   currentAddress: {
//     type: String,
//     trim: true,
    
//     maxlength: 200,
//   },
//   currentAddressLandmark: {
//     type: String,
//     trim: true,
//     maxlength: 100,
//   },
//   typeOfResident: {
//     type: String,
//     enum: ['Rented', 'Owned', 'Other'],
    
//   },
//   officeAddress: {
//     type: String,
//     trim: true,
//     maxlength: 200,
//   },
//   officeAddressLandmark: {
//     type: String,
//     trim: true,
//     maxlength: 100,
//   },

//   // Employment Information
//   occupationType: {
//     type: String,
//     enum: [
//       'Salaried Employee',
//       'Self-Employed',
//       'Business Owner',
//       'Freelancer',
//       'Government Employee',
//       'Retired',
//       'Student',
//       'Housewife/Homemaker',
//       'Agriculture/Farmer',
//       'Consultant',
//       'Other',
//     ],
    
//   },
//   natureOfBusiness: {
//     type: String,
//     enum: [
//       'Manufacturing',
//       'Trading',
//       'Retail',
//       'Wholesale',
//       'Information Technology',
//       'Finance and Banking',
//       'Real Estate and Construction',
//       'Hospitality',
//       'Healthcare',
//       'Education and Training',
//       'Transportation and Logistics',
//       'Agriculture and Farming',
//       'Import/Export',
//       'Media and Entertainment',
//       'Other',
//     ],
//     required: function () {
//       return this.occupationType === 'Self-Employed' || this.occupationType === 'Business Owner';
//     },
//   },
//   serviceType: {
//     type: String,
//     enum: [
//       'IT Services',
//       'Financial Services',
//       'Legal Services',
//       'Healthcare Services',
//       'Educational Services',
//       'Transportation Services',
//       'Hospitality Services',
//       'Consultancy Services',
//       'Retail Services',
//       'Utility Services',
//       'Maintenance and Repair Services',
//       'Marketing and Advertising Services',
//       'Other',
//     ],
//     required: function () {
//       return this.occupationType === 'Self-Employed' || this.occupationType === 'Business Owner';
//     },
//   },
//   officeName: {
//     type: String,
//     trim: true,
//     maxlength: 100,
//     required: function () {
//       return this.occupationType === 'Salaried Employee' || this.occupationType === 'Government Employee';
//     },
//   },
//   noOfYearsAtCurrentOrganization: {
//     type: Number,
//     min: [0, 'Number of years cannot be negative'],
//     max: [50, 'Number of years seems too high'],
    
//   },
//   totalNumberOfYearsAtCurrentResidence: {
//     type: Number,
//     min: [0, 'Number of years cannot be negative'],
//     max: [100, 'Number of years seems too high'],
    
//   },
//   totalTimeInDelhi: {
//     type: Number,
//     min: [0, 'Time cannot be negative'],
//     max: [100, 'Time seems too high'],
    
//   },

//   // Financial Information
//   gstItrFiled: {
//     type: String,
//     enum: ['Yes', 'No'],
    
//   },
//   gstAndItrIncome: {
//     type: Number,
//     min: [0, 'Income cannot be negative'],
//     required: function () {
//       return this.gstItrFiled === 'Yes';
//     },
//   },
//   inHandSalary: {
//     type: Number,
//     min: [0, 'Salary cannot be negative'],
    
//   },
//   otherIncome: {
//     type: Number,
//     min: [0, 'Other income cannot be negative'],
//     default: 0,
//   },

//   // Email Information
//   officialEmailId: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     validate: {
//       validator: function (v) {
//         return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
//       },
//       message: props => `${props.value} is not a valid official email ID!`,
//     },
//     required: function () {
//       return this.occupationType === 'Salaried Employee' || this.occupationType === 'Government Employee';
//     },
//   },
//   personalEmailId: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     validate: {
//       validator: function (v) {
//         return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
//       },
//       message: props => `${props.value} is not a valid personal email ID!`,
//     },
    
//   },

//   // Loan Details
//   selectedLoanType: {
//     type: String,
//     enum: [
//       'Auto Loan',
//       'Personal Loan',
//       'Home Loan',
//       'Business Loan',
//       'Loan Against Property (LAP)',
//       // Add more loan types as needed
//     ],
    
//   },
//   loanCategory: {
//     type: String,
    
//     // Optionally, you can add an enum or reference based on loanMasterData
//   },
//   requiredAmount: {
//     type: Number,
//     min: [1000, 'Minimum required amount is 1,000'],
//     max: [1000000, 'Maximum required amount is 1,000,000'],
    
//   },

//   // Previous Loan Details
//   previousLoanBankName: {
//     type: String,
    
//   },
//   previousLoanType: {
//     type: String,
    
//   },
//   previousProductModel: {
//     type: String,
    
//   },
//   previousLoanAmount: {
//     type: Number,
    
//   },
//   previousLoanSanctionDate: {
//     type: Date,
    
//   },
//   previousLoanInsuranceValue: {
//     type: Number,
    
//   },

//   // Additional Information
//   remarks: {
//     type: String,
//     trim: true,
//     maxlength: 500,
//   },
//   attachments: [
//     {
//       type: String, // Assuming file URLs or paths
//     },
//   ],
//   fileDispositionHistory: [fileDispositionHistorySchema],
//   applicationStatus: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected', 'In Progress'],
//     default: 'Pending',
//   }

//   // Add other fields and validation as necessary,
//   {
//     timestamps: {
//       createdAt: true,
//       updatedAt: true,
//     }
//   }
// );
// function arrayLimit(val) {
//   return val.length === 6;
// }
// const fileDispositionHistorySchema = new Schema({
//   // Define fields for fileDispositionHistorySchema here
// });


// const auto_loan = mongoose.model("auto_loan_application", auto_loan_schema);
// module.exports = auto_loan;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileDispositionHistorySchema = new Schema({
});

const auto_loan_schema = new Schema({
  totalAB: {
    type: Number,
    default: 0,
  },
  sixMonthsABB: {
    type: Number,
    default: 0,
  },
  oneYearABB: {
    type: Number,
    default: 0,
  },
  monthlyData: [
    {
      month: {
        type: String,
        default: "",
      },
      year: {
        type: Number,
        default: 0,
      },
      dayValues: {
        type: [Number],
        validate: [arrayLimit, '{PATH} exceeds the limit of 6'],
        default: [0, 0, 0, 0, 0, 0], // Default value for 6 entries
      },
      totalAB: {
        type: Number,
        default: 0,
      },
      totalABB: {
        type: Number,
        default: 0,
      },
    },
  ],

  // Personal Information
  customerName: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  customerNumber: {
    type: String,
    trim: true,
    default: "",
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  alternateNumber: {
    type: String,
    default: "",
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  maritalStatus: {
    type: String,
    default: null,
  },
  spouseName: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  fatherName: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  motherName: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },

  // Contact Information
  permanentAddress: {
    type: String,
    trim: true,
    maxlength: 200,
    default: "",
  },
  permanentAddressLandmark: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  currentAddress: {
    type: String,
    trim: true,
    maxlength: 200,
    default: "",
  },
  currentAddressLandmark: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  typeOfResident: {
    type: String,
    default: null,
  },
  officeAddress: {
    type: String,
    trim: true,
    maxlength: 200,
    default: "",
  },
  officeAddressLandmark: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },

  // Employment Information
  companyName: {
    type: String,
    // trim: true,
    // maxlength: 100,
    default: "",
  },
  salary: {
    type: String,
    trim: true,
    default: "",
  },
  selfEmployee: {
    type: String,
    default: null,
  },
  companyNumber: {
    type: String,
    // trim: true,
    // validate: {
    //   validator: function (v) {
    //     return /^\d{10}$/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid 10-digit company number!`,
    // },
    default: "",
  },
  companyAddress: {
    type: String,
    trim: true,
    maxlength: 200,
    default: "",
  },
  occupationType: {
    type: String,
    default: null,
  },
  natureOfBusiness: {
    type: String,
    default: null,
  },
  serviceType: {
    type: String,
    default: null,
  },
  officeName: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  noOfYearsAtCurrentOrganization: {
    type: Number,
    min: [0, 'Number of years cannot be negative'],
    max: [50, 'Number of years seems too high'],
    default: 0,
  },
  totalNumberOfYearsAtCurrentResidence: {
    type: Number,
    min: [0, 'Number of years cannot be negative'],
    max: [100, 'Number of years seems too high'],
    default: 0,
  },
  totalTimeInDelhi: {
    type: Number,
    min: [0, 'Time cannot be negative'],
    max: [100, 'Time seems too high'],
    default: 0,
  },

  // Financial Information
  gstItrFiled: {
    type: String,
    default: null,
  },
  gstAndItrIncome: {
    type: Number,
    min: [0, 'Income cannot be negative'],
    default: 0,
  },
  inHandSalary: {
    type: Number,
    min: [0, 'Salary cannot be negative'],
    default: 0,
  },
  otherIncome: {
    type: Number,
    min: [0, 'Other income cannot be negative'],
    default: 0,
  },

  // Email Information
  officialEmailId: {
    type: String,
    trim: true,
    lowercase: true,
    default: " ",
  },
  personalEmailId: {
    type: String,
    trim: true,
    lowercase: true,
    default: "",
  },

  // Disposition History
  dispositionHistory: {
    type: [fileDispositionHistorySchema],
    default: [],
  },

  // Additional Information
  productName:{
    type: String,
    default: "",
  },
  bankName: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  tenure: {
    type: Number,
    default: 0,
  },
  loanAmount: {
    type: Number,
    min: [0, 'Loan amount cannot be negative'],
    default: 0,
  },
  carName: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  model: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
  carNumber: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "",
  },
  carDetails:{
    type: String,
    default: ""
  },
  insurance: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
  },
}, { timestamps: true });


// Helper function to limit array size
function arrayLimit(val) {
  return val.length <= 6;
}

 const auto_loan_file= mongoose.model('AutoLoan', auto_loan_schema);

 module.exports= auto_loan_file;