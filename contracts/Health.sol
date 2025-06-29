// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Health {
    enum Role { None, Doctor, Principal, Teacher }

    struct Doctor {
        uint doctorId;
        string name;
        string gender;
        string dob;
        string contact;
        string email;
        string degree;
        string specialization;
        string registrationId;
        address wallet;
        uint registeredAt;
        bool isActive;
    }

    struct Principal {
        uint schoolId;
        string schoolName;
        string schoolAddress;
        string schoolContact;
        string schoolEmail;
        string principalName;
        string principalAge;
        string principalGender;
        address wallet;
        uint registeredAt;
        bool isActive;
    }

    struct Teacher {
        uint teacherId;
        string name;
        string age;
        string gender;
        string schoolName;
        uint schoolId;
        address wallet;
        uint registeredAt;
        bool isActive;
    }

    address public admin;

    uint private doctorCounter = 1;
    uint private schoolCounter = 1;
    uint private teacherCounter = 1;

    mapping(address => Role) public roles;
    mapping(address => Doctor) public doctors;
    mapping(address => Principal) public principals;
    mapping(address => Teacher) public teachers;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyTeacher() {
        require(getUserRole(msg.sender) == Role.Teacher, "Only Teacher allowed");
        _;
    }

    modifier onlyPrincipal() {
        require(getUserRole(msg.sender) == Role.Principal, "Only Principal allowed");
        _;
    }

    modifier onlyDoctor() {
        require(getUserRole(msg.sender) == Role.Doctor, "Only Doctor allowed");
        _;
    }


    // ==================== EVENTS ====================
    
    event DoctorRegistered(
        uint indexed doctorId,
        string name,
        string gender,
        string dob,
        string contact,
        string email,
        string degree,
        string specialization,
        string registrationId,
        address indexed wallet,
        uint registeredAt
    );

    event PrincipalRegistered(
        uint indexed schoolId,
        string schoolName,
        string schoolAddress,
        string schoolContact,
        string schoolEmail,
        string principalName,
        string principalAge,
        string principalGender,
        address indexed wallet,
        uint registeredAt
    );

    event TeacherRegistered(
        uint indexed teacherId,
        string name,
        string age,
        string gender,
        string schoolName,
        uint indexed schoolId,
        address indexed wallet,
        uint registeredAt
    );

    // ==================== REGISTER FUNCTIONS ====================

    function registerDoctor(
        string memory _name,
        string memory _gender,
        string memory _dob,
        string memory _contact,
        string memory _email,
        string memory _degree,
        string memory _specialization,
        string memory _registrationId,
        address _wallet
    ) public onlyAdmin {
        require(roles[_wallet] == Role.None, "User already registered");

        Doctor memory newDoctor = Doctor(
            doctorCounter,
            _name,
            _gender,
            _dob,
            _contact,
            _email,
            _degree,
            _specialization,
            _registrationId,
            _wallet,
            block.timestamp,
            true
        );

        doctors[_wallet] = newDoctor;
        roles[_wallet] = Role.Doctor;

        emit DoctorRegistered(
            doctorCounter++,
            _name,
            _gender,
            _dob,
            _contact,
            _email,
            _degree,
            _specialization,
            _registrationId,
            _wallet,
            block.timestamp
        );
    }

    function registerPrincipal(
        string memory _schoolName,
        string memory _schoolAddress,
        string memory _schoolContact,
        string memory _schoolEmail,
        string memory _principalName,
        string memory _principalAge,
        string memory _principalGender,
        
        address _wallet
    ) public onlyAdmin {
        require(roles[_wallet] == Role.None, "User already registered");

        Principal memory newPrincipal = Principal(
            schoolCounter,
            _schoolName,
            _schoolAddress,
            _schoolContact,
            _schoolEmail,
            _principalName,
            _principalAge,
            _principalGender,
            _wallet,
            block.timestamp,
            true
        );

        principals[_wallet] = newPrincipal;
        roles[_wallet] = Role.Principal;

        emit PrincipalRegistered(
            schoolCounter++,
            _schoolName,
            _schoolAddress,
            _schoolContact,
            _schoolEmail,
            _principalName,
            _principalAge,
            _principalGender,
            _wallet,
            block.timestamp
        );
    }

    function registerTeacher(
        string memory _name,
        string memory _age,
        string memory _gender,
        string memory _schoolName,
        uint _schoolId,
        address _wallet
    ) public onlyAdmin {
        require(roles[_wallet] == Role.None, "User already registered");

        Teacher memory newTeacher = Teacher(
            teacherCounter,
            _name,
            _age,
            _gender,
            _schoolName,
            _schoolId,
            _wallet,
            block.timestamp,
            true
        );

        teachers[_wallet] = newTeacher;
        roles[_wallet] = Role.Teacher;

        emit TeacherRegistered(
            teacherCounter++,
            _name,
            _age,
            _gender,
            _schoolName,
            _schoolId,
            _wallet,
            block.timestamp
        );
    }

    // ============ GETTERS ============

    function getUserRole(address user) public view returns (Role) {
        return roles[user];
    }

    // ============ ADMIN ACTIONS ============

    function deactivateUser(address user) public onlyAdmin {
        require(roles[user] != Role.None, "User not registered");

        if (roles[user] == Role.Doctor) {
            doctors[user].isActive = false;
        } else if (roles[user] == Role.Principal) {
            principals[user].isActive = false;
        } else if (roles[user] == Role.Teacher) {
            teachers[user].isActive = false;
        }

        roles[user] = Role.None;
    }

    function isUserActive(address user) public view returns (bool) {
        if (roles[user] == Role.Doctor) return doctors[user].isActive;
        if (roles[user] == Role.Principal) return principals[user].isActive;
        if (roles[user] == Role.Teacher) return teachers[user].isActive;
        return false;
    }

















    enum Status { Registered, Approved, UnderTreatment, Treated }

    struct Child {
        uint studentCode;
        string name;
        string className;
        uint schoolId;
        string admissionNo;
        string gender;
        uint age;
        uint height;
        uint weight;
        string condition;
        Status status;
        uint registeredAt;
        uint approvedAt;
        bool isActive;
    }

    uint private childCounter = 1;

    mapping(uint => Child) public children;
    mapping(address => uint[]) public childrenByTeacher;



    // 📣 EVENT
    event ChildRegistered(
        uint indexed studentCode,
        string name,
        string className,
        uint indexed schoolId,
        string admissionNo,
        string gender,
        uint age,
        uint height,
        uint weight,
        string condition,
        address indexed registeredBy,
        uint registeredAt
    );

    event ChildStatusUpdated(uint indexed studentCode, Status newStatus, uint timestamp);


    // ====== Teacher: Register a child ======
    function registerChild(
        string memory _name,
        string memory _className,
        uint _schoolId,
        string memory _admissionNo,
        string memory _gender,
        uint _age,
        uint _height,
        uint _weight,
        string memory _condition
    ) public onlyTeacher {
        require(isUserActive(msg.sender), "User not active");
        require(_schoolId == teachers[msg.sender].schoolId, "Invaild registration");
        uint id = childCounter++;

        children[id] = Child(
            id,
            _name,
            _className,
            _schoolId,
            _admissionNo,
            _gender,
            _age,
            _height,
            _weight,
            _condition,
            Status.Registered,
            block.timestamp,
            0,
            true
        );

        childrenByTeacher[msg.sender].push(id);

        emit ChildRegistered(
            id,
            _name,
            _className,
            _schoolId,
            _admissionNo,
            _gender,
            _age,
            _height,
            _weight,
            _condition,
            msg.sender,
            block.timestamp
        );
    }

    // ====== Principal: Approve a child ======
    function approveChild(uint _childId) public onlyPrincipal {
        require(isUserActive(msg.sender), "User not active");
        require(children[_childId].schoolId == principals[msg.sender].schoolId, "Invaild approval");
        require(children[_childId].isActive, "Invalid child");
        require(children[_childId].status == Status.Registered, "Already approved");
        children[_childId].status = Status.Approved;
        children[_childId].approvedAt = block.timestamp;
        emit ChildStatusUpdated(_childId, Status.Approved, block.timestamp);
    }

    // ====== Doctor: Update child status ======
    
    function updateChildStatus(uint _childId, Status _newStatus) internal onlyDoctor {
        require(isUserActive(msg.sender), "User not active");
        require(children[_childId].isActive, "Invalid child");
        require(_newStatus != Status.Registered, "Invalid status transition");
        require(children[_childId].status != Status.Registered, "Child not approved yet");

        if (_newStatus == Status.UnderTreatment) {
            require(children[_childId].status == Status.Approved, "Must be approved first");
        }

        if (_newStatus == Status.Treated) {
            require(children[_childId].status == Status.UnderTreatment, "Must be under treatment first");
        }

        children[_childId].status = _newStatus;
        emit ChildStatusUpdated(_childId, _newStatus, block.timestamp);
    }

    // ====== View Functions ======
    function getChild(uint _childId) public view returns (Child memory) {
        return children[_childId];
    }

    function getChildrenByTeacher(address teacher) public view returns (uint[] memory) {
        return childrenByTeacher[teacher];
    }

    function getChildStatus(uint _childId) public view returns (Status) {
        return children[_childId].status;
    }

    function isChildApproved(uint _childId) public view returns (bool) {
        return children[_childId].status == Status.Approved;
    }

















    // ===================== Structures =====================

    struct Medicine {
        uint code;
        string name;
        string brand;
        string manufacturer;
        uint totalQuantity;
        bool exists;
    }

    struct SchoolInventory {
        uint quantity;
        uint lastAssignedAt;
    }

    uint private medicineCounter = 1;

    mapping(uint => Medicine) public medicines; // code => medicine
    mapping(string => uint) public nameToCode;  // medicine name => code
    mapping(uint => mapping(uint => SchoolInventory)) public schoolStock; // medicineCode => schoolId => quantity

    // ===================== Events =====================

    event MedicineCreated(
        uint indexed code,
        string name,
        string brand,
        string manufacturer,
        uint totalQuantity,
        uint timestamp
    );

    event MedicineAssigned(
        uint indexed schoolId,
        string indexed medicineName,
        uint quantity,
        uint newSchoolStock,
        uint timestamp
    );

    event StockReducedByPrescription(
        string indexed medicineName,
        uint indexed schoolId,
        uint quantityReduced,
        uint remainingStock,
        uint timestamp
    );

    event GlobalStockIncreased(
        string indexed medicineName,
        uint addedQuantity,
        uint newTotalQuantity,
        uint timestamp
    );


    // ===================== Admin Functions =====================

    function createMedicine(
        string memory _name,
        string memory _brand,
        string memory _manufacturer,
        uint _quantity
    ) public onlyAdmin {
        require(nameToCode[_name] == 0, "Medicine already exists");

        uint code = medicineCounter++;
        medicines[code] = Medicine(code, _name, _brand, _manufacturer, _quantity, true);
        nameToCode[_name] = code;

        emit MedicineCreated(code, _name, _brand, _manufacturer, _quantity, block.timestamp);
    }

    function assignMedicineToSchool(
        string memory _medicineName,
        uint _schoolId,
        uint _quantity
    ) public onlyAdmin {
        uint code = nameToCode[_medicineName];
        require(code != 0, "Invalid medicine");
        require(medicines[code].exists, "Medicine not found");
        require(medicines[code].totalQuantity >= _quantity, "Insufficient global stock");

        medicines[code].totalQuantity -= _quantity;
        schoolStock[code][_schoolId].quantity += _quantity;
        schoolStock[code][_schoolId].lastAssignedAt = block.timestamp;

        emit MedicineAssigned(
            _schoolId,
            _medicineName,
            _quantity,
            schoolStock[code][_schoolId].quantity,
            block.timestamp
        );
    }

    // ===================== Reduce Stock =====================

    function reduceSchoolMedicineStock(
        string memory _medicineName,
        uint _schoolId,
        uint _quantity
    ) internal onlyDoctor {
        uint code = nameToCode[_medicineName];
        require(code != 0, "Invalid medicine");
        require(medicines[code].exists, "Medicine not found");
        require(schoolStock[code][_schoolId].quantity >= _quantity, "Not enough stock");

        schoolStock[code][_schoolId].quantity -= _quantity;

        emit StockReducedByPrescription(
            _medicineName,
            _schoolId,
            _quantity,
            schoolStock[code][_schoolId].quantity,
            block.timestamp
        );
    }

    // ===================== medicine increase Functions =====================
    
    function increaseGlobalMedicineStock(
        string memory _medicineName,
        uint _quantity
    ) public onlyAdmin {
        uint code = nameToCode[_medicineName];
        require(code != 0, "Medicine does not exist");
        require(_quantity > 0, "Quantity must be positive");

        medicines[code].totalQuantity += _quantity;

        emit GlobalStockIncreased(
            _medicineName,
            _quantity,
            medicines[code].totalQuantity,
            block.timestamp
        );
}


    // ===================== View Functions =====================

    function getGlobalStock(string memory _medicineName) public view returns (uint) {
        uint code = nameToCode[_medicineName];
        require(code != 0, "Invalid medicine");
        return medicines[code].totalQuantity;
    }

    function getSchoolStock(string memory _medicineName, uint _schoolId) public view returns (uint) {
        uint code = nameToCode[_medicineName];
        require(code != 0, "Invalid medicine");
        return schoolStock[code][_schoolId].quantity;
    }















    struct Prescription {
        uint prescriptionId;
        uint childId;
        string medicineName;
        uint quantity;
        string dosage;
        bool followupReq;
        address prescribedBy;
        uint createdAt;
    }

    uint private prescriptionCounter = 1;
    mapping(uint => Prescription) public prescriptions;
    mapping(uint => uint[]) public prescriptionsByChild; // childId => list of prescriptions

    event PrescriptionCreated(
        uint indexed prescriptionId,
        uint indexed childId,
        string medicineName,
        uint quantity,
        string dosage,
        bool followupReq,
        address prescribedBy,
        uint createdAt);


    // ========== Prescription Logic ==========

    function prescribeMedicine(
        uint _childId,
        string memory _medicineName,
        uint _quantity,
        string memory _dosage,
        bool _followupReq
    ) public onlyDoctor {
        
        require(isUserActive(msg.sender), "User not active");
        require((children[_childId].status == Status.Approved || children[_childId].status == Status.UnderTreatment), "Child not approved");

        if(children[_childId].status == Status.Approved)
            updateChildStatus(_childId, Status.UnderTreatment);


        uint id = prescriptionCounter++;

        // Get school ID of the child
        uint schoolId = getChild(_childId).schoolId;

        reduceSchoolMedicineStock(_medicineName, schoolId, _quantity);



        if(!_followupReq)
            updateChildStatus(_childId, Status.Treated);


        // Store prescription
        
        prescriptions[id] = Prescription(
            id,
            _childId,
            _medicineName,
            _quantity,
            _dosage,
            _followupReq,
            msg.sender,
            block.timestamp
        );

        prescriptionsByChild[_childId].push(id);
        emit PrescriptionCreated(
            id, 
            _childId,
            _medicineName,
            _quantity,
            _dosage,
            _followupReq,
            msg.sender,
            block.timestamp);

    }



    // ========== View Functions ==========

    function getPrescription(uint id) public view returns (Prescription memory) {
        return prescriptions[id];
    }

    function getPrescriptionsByChild(uint childId) public view returns (uint[] memory) {
        return prescriptionsByChild[childId];
    }
}