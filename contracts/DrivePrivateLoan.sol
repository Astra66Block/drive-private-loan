// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract DrivePrivateLoan is SepoliaConfig {
    using FHE for *;
    
    struct Vehicle {
        euint32 vehicleId;
        euint32 price;
        euint32 tokenValue;
        euint32 loanAmount;
        euint32 apr;
        euint32 termMonths;
        bool isTokenized;
        bool isAvailable;
        string make;
        string model;
        uint256 year;
        address owner;
        uint256 createdAt;
    }
    
    struct LoanApplication {
        euint32 applicationId;
        euint32 vehicleId;
        euint32 requestedAmount;
        euint32 monthlyIncome;
        euint32 creditScore;
        bool isApproved;
        bool isActive;
        address borrower;
        uint256 applicationTime;
        uint256 approvalTime;
    }
    
    struct Loan {
        euint32 loanId;
        euint32 applicationId;
        euint32 principalAmount;
        euint32 monthlyPayment;
        euint32 remainingBalance;
        euint32 apr;
        euint32 termMonths;
        euint32 paymentsMade;
        bool isActive;
        bool isDefaulted;
        address borrower;
        address lender;
        uint256 startTime;
        uint256 nextPaymentDue;
    }
    
    struct Payment {
        euint32 paymentId;
        euint32 loanId;
        euint32 amount;
        euint32 principal;
        euint32 interest;
        address payer;
        uint256 paymentTime;
        bool isLate;
    }
    
    mapping(uint256 => Vehicle) public vehicles;
    mapping(uint256 => LoanApplication) public loanApplications;
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => Payment) public payments;
    mapping(address => euint32) public borrowerReputation;
    mapping(address => euint32) public lenderReputation;
    mapping(address => euint32) public totalBorrowed;
    mapping(address => euint32) public totalLent;
    
    uint256 public vehicleCounter;
    uint256 public applicationCounter;
    uint256 public loanCounter;
    uint256 public paymentCounter;
    
    address public owner;
    address public verifier;
    uint256 public platformFeeRate; // Basis points (e.g., 100 = 1%)
    
    event VehicleAdded(uint256 indexed vehicleId, address indexed owner, string make, string model);
    event VehicleTokenized(uint256 indexed vehicleId, uint32 tokenValue);
    event LoanApplicationSubmitted(uint256 indexed applicationId, uint256 indexed vehicleId, address indexed borrower);
    event LoanApplicationApproved(uint256 indexed applicationId, bool isApproved);
    event LoanCreated(uint256 indexed loanId, uint256 indexed applicationId, address indexed borrower, address indexed lender);
    event PaymentMade(uint256 indexed paymentId, uint256 indexed loanId, address indexed payer, uint32 amount);
    event LoanCompleted(uint256 indexed loanId, address indexed borrower);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
        platformFeeRate = 50; // 0.5% platform fee
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call this function");
        _;
    }
    
    // Add a new vehicle to the platform
    function addVehicle(
        string memory _make,
        string memory _model,
        uint256 _year,
        euint32 _price,
        euint32 _loanAmount,
        euint32 _apr,
        euint32 _termMonths
    ) public returns (uint256) {
        vehicleCounter++;
        uint256 vehicleId = vehicleCounter;
        
        vehicles[vehicleId] = Vehicle({
            vehicleId: FHE.asEuint32(vehicleId),
            price: _price,
            tokenValue: FHE.asEuint32(0),
            loanAmount: _loanAmount,
            apr: _apr,
            termMonths: _termMonths,
            isTokenized: FHE.asEbool(false),
            isAvailable: FHE.asEbool(true),
            make: _make,
            model: _model,
            year: _year,
            owner: msg.sender,
            createdAt: block.timestamp
        });
        
        emit VehicleAdded(vehicleId, msg.sender, _make, _model);
        return vehicleId;
    }
    
    // Tokenize a vehicle
    function tokenizeVehicle(uint256 _vehicleId, euint32 _tokenValue) public {
        require(vehicles[_vehicleId].owner == msg.sender, "Only vehicle owner can tokenize");
        
        vehicles[_vehicleId].tokenValue = _tokenValue;
        vehicles[_vehicleId].isTokenized = FHE.asEbool(true);
        
        emit VehicleTokenized(_vehicleId, FHE.decrypt(_tokenValue));
    }
    
    // Submit a loan application
    function submitLoanApplication(
        uint256 _vehicleId,
        euint32 _requestedAmount,
        euint32 _monthlyIncome,
        euint32 _creditScore
    ) public returns (uint256) {
        require(vehicles[_vehicleId].owner != address(0), "Vehicle does not exist");
        
        applicationCounter++;
        uint256 applicationId = applicationCounter;
        
        loanApplications[applicationId] = LoanApplication({
            applicationId: FHE.asEuint32(applicationId),
            vehicleId: FHE.asEuint32(_vehicleId),
            requestedAmount: _requestedAmount,
            monthlyIncome: _monthlyIncome,
            creditScore: _creditScore,
            isApproved: FHE.asEbool(false),
            isActive: FHE.asEbool(true),
            borrower: msg.sender,
            applicationTime: block.timestamp,
            approvalTime: 0
        });
        
        emit LoanApplicationSubmitted(applicationId, _vehicleId, msg.sender);
        return applicationId;
    }
    
    // Approve or reject a loan application (only verifier)
    function approveLoanApplication(uint256 _applicationId, bool _isApproved) public onlyVerifier {
        require(loanApplications[_applicationId].borrower != address(0), "Application does not exist");
        
        loanApplications[_applicationId].isApproved = FHE.asEbool(_isApproved);
        loanApplications[_applicationId].approvalTime = block.timestamp;
        
        emit LoanApplicationApproved(_applicationId, _isApproved);
    }
    
    // Create a loan after approval
    function createLoan(uint256 _applicationId, address _lender) public onlyVerifier {
        require(loanApplications[_applicationId].borrower != address(0), "Application does not exist");
        require(FHE.decrypt(loanApplications[_applicationId].isApproved), "Application not approved");
        
        loanCounter++;
        uint256 loanId = loanCounter;
        
        uint256 vehicleId = FHE.decrypt(loanApplications[_applicationId].vehicleId);
        euint32 principalAmount = loanApplications[_applicationId].requestedAmount;
        euint32 apr = vehicles[vehicleId].apr;
        euint32 termMonths = vehicles[vehicleId].termMonths;
        
        // Calculate monthly payment using encrypted arithmetic
        euint32 monthlyPayment = calculateMonthlyPayment(principalAmount, apr, termMonths);
        
        loans[loanId] = Loan({
            loanId: FHE.asEuint32(loanId),
            applicationId: FHE.asEuint32(_applicationId),
            principalAmount: principalAmount,
            monthlyPayment: monthlyPayment,
            remainingBalance: principalAmount,
            apr: apr,
            termMonths: termMonths,
            paymentsMade: FHE.asEuint32(0),
            isActive: FHE.asEbool(true),
            isDefaulted: FHE.asEbool(false),
            borrower: loanApplications[_applicationId].borrower,
            lender: _lender,
            startTime: block.timestamp,
            nextPaymentDue: block.timestamp + 30 days
        });
        
        // Update borrower and lender reputation
        updateReputation(loanApplications[_applicationId].borrower, FHE.asEuint32(10));
        updateReputation(_lender, FHE.asEuint32(5));
        
        emit LoanCreated(loanId, _applicationId, loanApplications[_applicationId].borrower, _lender);
    }
    
    // Make a loan payment
    function makePayment(uint256 _loanId, euint32 _amount) public {
        require(loans[_loanId].borrower == msg.sender, "Only borrower can make payments");
        require(FHE.decrypt(loans[_loanId].isActive), "Loan is not active");
        
        paymentCounter++;
        uint256 paymentId = paymentCounter;
        
        euint32 principal = calculatePrincipalPayment(_loanId, _amount);
        euint32 interest = FHE.sub(_amount, principal);
        
        payments[paymentId] = Payment({
            paymentId: FHE.asEuint32(paymentId),
            loanId: FHE.asEuint32(_loanId),
            amount: _amount,
            principal: principal,
            interest: interest,
            payer: msg.sender,
            paymentTime: block.timestamp,
            isLate: FHE.asEbool(block.timestamp > loans[_loanId].nextPaymentDue)
        });
        
        // Update loan balance
        loans[_loanId].remainingBalance = FHE.sub(loans[_loanId].remainingBalance, principal);
        loans[_loanId].paymentsMade = FHE.add(loans[_loanId].paymentsMade, FHE.asEuint32(1));
        loans[_loanId].nextPaymentDue = loans[_loanId].nextPaymentDue + 30 days;
        
        // Check if loan is completed
        if (FHE.decrypt(loans[_loanId].remainingBalance) == 0) {
            loans[_loanId].isActive = FHE.asEbool(false);
            emit LoanCompleted(_loanId, msg.sender);
        }
        
        emit PaymentMade(paymentId, _loanId, msg.sender, FHE.decrypt(_amount));
    }
    
    // Calculate monthly payment using encrypted arithmetic
    function calculateMonthlyPayment(
        euint32 _principal,
        euint32 _apr,
        euint32 _termMonths
    ) internal pure returns (euint32) {
        // Simplified calculation: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
        // For FHE, we'll use a simplified version
        euint32 monthlyRate = FHE.div(_apr, FHE.asEuint32(1200)); // APR to monthly rate
        euint32 numerator = FHE.mul(_principal, monthlyRate);
        euint32 denominator = FHE.sub(FHE.asEuint32(1000), monthlyRate); // Simplified
        
        return FHE.div(numerator, denominator);
    }
    
    // Calculate principal payment
    function calculatePrincipalPayment(uint256 _loanId, euint32 _paymentAmount) internal view returns (euint32) {
        euint32 interestPayment = calculateInterestPayment(_loanId);
        
        if (FHE.decrypt(_paymentAmount) > FHE.decrypt(interestPayment)) {
            return FHE.sub(_paymentAmount, interestPayment);
        } else {
            return FHE.asEuint32(0);
        }
    }
    
    // Calculate interest payment
    function calculateInterestPayment(uint256 _loanId) internal view returns (euint32) {
        euint32 balance = loans[_loanId].remainingBalance;
        euint32 apr = loans[_loanId].apr;
        
        // Monthly interest = (balance * APR) / 1200
        return FHE.div(FHE.mul(balance, apr), FHE.asEuint32(1200));
    }
    
    // Update user reputation
    function updateReputation(address _user, euint32 _reputationIncrease) internal {
        borrowerReputation[_user] = FHE.add(borrowerReputation[_user], _reputationIncrease);
        emit ReputationUpdated(_user, FHE.decrypt(borrowerReputation[_user]));
    }
    
    // Get vehicle information (encrypted)
    function getVehicle(uint256 _vehicleId) public view returns (
        euint32 vehicleId,
        euint32 price,
        euint32 tokenValue,
        euint32 loanAmount,
        euint32 apr,
        euint32 termMonths,
        bool isTokenized,
        bool isAvailable,
        string memory make,
        string memory model,
        uint256 year,
        address owner
    ) {
        Vehicle memory vehicle = vehicles[_vehicleId];
        return (
            vehicle.vehicleId,
            vehicle.price,
            vehicle.tokenValue,
            vehicle.loanAmount,
            vehicle.apr,
            vehicle.termMonths,
            FHE.decrypt(vehicle.isTokenized),
            FHE.decrypt(vehicle.isAvailable),
            vehicle.make,
            vehicle.model,
            vehicle.year,
            vehicle.owner
        );
    }
    
    // Get loan information (encrypted)
    function getLoan(uint256 _loanId) public view returns (
        euint32 loanId,
        euint32 principalAmount,
        euint32 monthlyPayment,
        euint32 remainingBalance,
        euint32 apr,
        euint32 termMonths,
        euint32 paymentsMade,
        bool isActive,
        address borrower,
        address lender,
        uint256 startTime,
        uint256 nextPaymentDue
    ) {
        Loan memory loan = loans[_loanId];
        return (
            loan.loanId,
            loan.principalAmount,
            loan.monthlyPayment,
            loan.remainingBalance,
            loan.apr,
            loan.termMonths,
            loan.paymentsMade,
            FHE.decrypt(loan.isActive),
            loan.borrower,
            loan.lender,
            loan.startTime,
            loan.nextPaymentDue
        );
    }
    
    // Update platform fee rate (only owner)
    function updatePlatformFeeRate(uint256 _newRate) public onlyOwner {
        require(_newRate <= 1000, "Fee rate cannot exceed 10%");
        platformFeeRate = _newRate;
    }
    
    // Emergency pause function (only owner)
    function pauseContract() public onlyOwner {
        // Implementation for emergency pause
    }
    
    // Unpause contract (only owner)
    function unpauseContract() public onlyOwner {
        // Implementation for unpause
    }
}
