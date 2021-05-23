console.log('App is running!')

//// Requests ////

let url = 'https://api-hfc.techchefz.com/icicihfc-micro-service'

const getExperience = async (experienceType) => {
    experienceType.toUpperCase()
    const response = await fetch(`${url}/rms/get/experience?experienceType=${experienceType}`)

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to get experience')
    }
}

const getDepAndRole = async () => {
    const response = await fetch(`${url}/rms/get/departments/and/roles`)

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to get DepAndRole')
    }
}

const getZones = async () => {
    const response = await fetch(`${url}/rms/get/job/location/zones`)

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to get zones')
    }
}

const getBranches = async (selectedZone) => {
    const response = await fetch(`${url}/rms/get/job/location/branches/by/zone?zone=${selectedZone}`)

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to get branches')
    }
}

////////////////////////////////////// SELECTORS USED //////////////////////////////////////

const nodeFullName = document.getElementById('fullName');                             // input box
const nodeEmail = document.getElementById('email');                                   // input box
const nodeMobileNo = document.getElementById('mobileNo');                             // input box
const overallExperience = document.getElementById('overallExperience');               // toggler
const relaventExperience = document.getElementById('relaventExperience');             // toggler
const department = document.getElementById('department');                             // toggler
const role = document.getElementById('role');                                         // toggler
const zone = document.getElementById('zone');                                         // toggler
const branch = document.getElementById('branch');                                     // toggler
const attachFile = document.getElementById('attachFile');                             // file
const uploadBtn = document.getElementById('upload')                                   // button
const button = document.getElementById('button');                                     // button

//////////////////////////////////// VARIABLES USED ///////////////////////////////////////////

let fullName,
    emailID,
    mobileNo,
    experienceOverallID = 'selectExpOveID',
    experienceRelavantID = 'selectExpRelID',
    departmentID = 'selectDep',
    roleID = 'selectRole',
    zoneID = 'selectZone',
    jobLocationID = 'selectBranch',
    resumeID = 'notUploaded',
    resumeName,
    resumeNonce;

let IsFullNameValid = false,
    IsEmailValid = false,
    IsMobileNoValid = false,
    IsFileAttached = false;

////////////////////////////////////// FULLNAME VALIDATION ///////////////////////////////////////

nodeFullName.addEventListener('blur', () => {
    const regex = /^[a-zA-Z]([-']?[a-zA-Z]+)( [a-zA-Z]([-']?[a-zA-Z]+))+$/;
    const str = nodeFullName.value;
    if (regex.test(str)) {
        fullName = str;
        IsFullNameValid = true
        nodeFullName.classList.remove('is-invalid')
    } else {
        nodeFullName.classList.add('is-invalid')
        IsFullNameValid = false
    }
});

/////////////////////////////////////// EMAIL VALIDATION ////////////////////////////////////////

nodeEmail.addEventListener('blur', () => {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const str = nodeEmail.value;
    if (regex.test(str)) {
        emailID = str;
        IsEmailValid = true
        nodeEmail.classList.remove('is-invalid')
    } else {
        nodeEmail.classList.add('is-invalid')
        IsEmailValid = false
    }
});


//////////////////////////////// MOBILE NUMBER VALIDATION //////////////////////////////

nodeMobileNo.addEventListener('blur', () => {
    const regex = /^[6-9]\d{9}$/;
    const str = nodeMobileNo.value;
    if (regex.test(str)) {
        mobileNo = str;
        IsMobileNoValid = true
        nodeMobileNo.classList.remove('is-invalid')
    } else {
        IsMobileNoValid = false
        nodeMobileNo.classList.add('is-invalid')
    }
});

////////////////////////////// OVERALL AND RELAVENT EXPERIENCE SETUP //////////////////////////


let overallExpData, relevantExpData;
const loadOverallExpData = async () => {
    const body = await getExperience('OVERALL');
    overallExpData = body.data;
    setOverallEl();
};
loadOverallExpData();

const loadRelevantExpData = async () => {
    const body = await getExperience('RELEVANT');
    relevantExpData = body.data;
    setReleventEl();
};
loadRelevantExpData();

function setOverallEl() {
    for (let i = 0; i < overallExpData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = overallExpData[i].value;
        OptEl.setAttribute('value', overallExpData[i].id);
        overallExperience.append(OptEl);
    }
}

function setReleventEl() {
    for (let i = 0; i < relevantExpData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = relevantExpData[i].value;
        OptEl.setAttribute('value', relevantExpData[i].id);
        relaventExperience.append(OptEl);
    }
}

overallExperience.addEventListener('change', (e) => {
    experienceOverallID = e.target.value;
});

relaventExperience.addEventListener('change', (e) => {
    experienceRelavantID = e.target.value;
});

/////////////////////////////////// DEPARTMENT AND ROLE SETUP /////////////////////////////////////

const clearRoles = () => {
    role.innerHTML = '<option value="selectRole">Select</option>';
    roleID = 'selectRole'
};


let departmentAndRoleData;
const loadDepAndRoleData = async () => {
    const body = await getDepAndRole();
    departmentAndRoleData = body.data;
    // console.log(body.data)
    setDepEl();
};
loadDepAndRoleData();

function setDepEl() {
    role.disabled = true;
    for (let i = 0; i < departmentAndRoleData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = departmentAndRoleData[i].name;
        OptEl.setAttribute('value', departmentAndRoleData[i].id);
        department.append(OptEl);
    }
}

department.addEventListener('change', (e) => {
    clearRoles();
    const id = e.target.value;
    departmentID = id;
    if (departmentID != 'selectDep'){
        setRoleEl(id);
    } else{
        role.disabled = true;
    }
});

function setRoleEl(selectedDep) {
    let rolesData;
    for (let i = 0; i < departmentAndRoleData.length; i++) {
        if (selectedDep === departmentAndRoleData[i].id) {
            rolesData = departmentAndRoleData[i].roles;
        }
    }
    for (let i = 0; i < rolesData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = rolesData[i].name;
        OptEl.setAttribute('value', rolesData[i].id);
        role.append(OptEl);
    }
    role.disabled = false;
    role.addEventListener('change', (e) => {
        roleID = e.target.value;
    });
}

///////////////////////////// ZONES AND BRANCHES SETUP /////////////////////////////////

const clearBranches = () => {
    branch.innerHTML = '<option value="selectBranch">Select</option>';
    jobLocationID = 'selectBranch'
};

let zoneData;
const loadZonesData = async () => {
    const body = await getZones();
    zoneData = body.data;
    setZonesEl();
};
loadZonesData();

function setZonesEl() {
    branch.disabled = true;
    for (let i = 0; i < zoneData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = zoneData[i];
        OptEl.setAttribute('value', zoneData[i]);
        zone.append(OptEl);
    }
}

let BranchesData;
const loadBranchesData = async (selectedZone) => {
    const body = await getBranches(selectedZone);
    BranchesData = body.data;
    setBranchesEl();
};

function setBranchesEl() {
    for (let i = 0; i < BranchesData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = BranchesData[i].branch;
        OptEl.setAttribute('value', BranchesData[i].id);
        branch.append(OptEl);
    }
    branch.disabled = false;
    branch.addEventListener('change', (e) => {
        jobLocationID = e.target.value;
    });
}

zone.addEventListener('change', (e) => {
    clearBranches();
    let selectedZone = e.target.value;
    zoneID = selectedZone;
    if(zoneID != 'selectZone'){
        loadBranchesData(selectedZone);
    } else{
        branch.disabled = true;
    }
});


////////////////////////////////////// FILE VALIDATION  ////////////////////////////////////

let fileName
attachFile.addEventListener('change', function () {
    const size = (this.files[0].size / 1024 / 1024).toFixed(2);
    fileName = $(this).val();
    var extension = fileName.split('.').pop();
    uploadBtn.disabled = true

    if (extension == "pdf" || extension == "docx" || extension == "doc") {
        if (size < 5) {
            console.log('Attached correct file!')
            attachFile.classList.remove('is-invalid')
            uploadBtn.disabled = false
            IsFileAttached = true;
        } else {
            alert("File must be less then 5 MB");
            uploadBtn.disabled = true
            attachFile.classList.add('is-invalid')
            IsFileAttached = false;
        }
    } else {
        alert('File format must be pdf or docx or doc')
        uploadBtn.disabled = true
        attachFile.classList.add('is-invalid')
        IsFileAttached = false;
    }
});

////////////////////////////////// FILE UPLOADING REQUEST ///////////////////////////////////////


const resume = document.getElementById('attachFile');
const upload = (e) => {
    // e.preventDefault()
    const form = new FormData();
    form.append('file', resume.files[0]);

    var settings = {
        url: 'https://api-hfc.techchefz.com/icicihfc-micro-service/document/reference/upload/v2',
        method: 'POST',
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        data: form,
    };

    $.ajax(settings).done(function (response) {
        const data = JSON.parse(response).data;
        resumeID = data.id;
        resumeName = data.name;
        resumeNonce = data.nonce;
    });
};


///////////////////////////////// FORM SUBMITTING REQUEST ///////////////////////////////////

function formSubmit() {
    const obj = {
        fullName: fullName,
        emailId: emailID,
        mobileNumber: mobileNo,
        experienceOverallId: experienceOverallID,
        experienceRelevantId: experienceRelavantID,
        roleId: roleID,
        jobLocationId: jobLocationID,
        resumeDocRefId: resumeID,
        resumeDocRefFileName: resumeName,
        resumeDocRefNonce: resumeNonce,
        adLoginNonce: '',
    };
    const settings = {
        url: 'https://api-hfc.techchefz.com/icicihfc-micro-service/rms/candidate/submit/form',
        method: 'POST',
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(obj),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    console.log(obj);
}

/////////////////////////// FINAL FORM SUBMISSION /////////////////////////////////

button.addEventListener('click', (e) => {
    e.preventDefault()
    if (!IsFullNameValid) {
        $("#fullName").focus();
        alert('Enter valid Full Name!')
    } else if (!IsEmailValid) {
        $("#email").focus();
        alert('Enter valid Email!')
    } else if (!IsMobileNoValid) {
        $("#mobileNo").focus();
        alert('Enter valid Mobile Number!')
    } else if (experienceOverallID == 'selectExpOveID') {
        $("#overallExperience").focus();
        alert('Select Overall Experience!')
    } else if (experienceRelavantID == 'selectExpRelID') {
        $("#relaventExperience").focus();
        alert('Select Relavent Experience!')
    } else if (departmentID == 'selectDep') {
        $("#department").focus();
        alert('Select Department!')
    } else if (roleID == 'selectRole'){
        $("#role").focus();
        alert('Select Role!')
    } else if(zoneID == 'selectZone'){
        $("#zone").focus();
        alert('Select Zone!')
    } else if(jobLocationID == 'selectBranch'){
        $("#branch").focus();
        alert('Select Branch!')
    } else if (!IsFileAttached) {
        $("#attachFile").focus()
        alert('Attach File!')
    } else if(resumeID == 'notUploaded'){
        alert('Upload file!')
    } else {
        alert('Data submitted successfully!')
        formSubmit();
    }
});