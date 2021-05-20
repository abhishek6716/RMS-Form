console.log('app is running!');

const nodeFullName = document.getElementById('fullName'); // input box
const nodeEmail = document.getElementById('email'); // input box
const nodeMobileNo = document.getElementById('mobileNo'); // input box
const overallExperience = document.getElementById('overallExperience'); // toggler
const relaventExperience = document.getElementById('relaventExperience'); // toggler
const department = document.getElementById('department'); // toggler
const role = document.getElementById('role'); // toggler
const zone = document.getElementById('zone'); // toggler
const branch = document.getElementById('branch'); // toggler
const attachFile = document.getElementById('attachFile'); // doc
const uploadBtn = document.getElementById('upload')
const button = document.getElementById('button'); // button


let fullName,
    emailID,
    mobileNo,
    experienceOverallID,
    experienceRelavantID,
    roleID,
    jobLocationID,
    resumeID,
    resumeName,
    resumeNonce;


let IsFullNameValid = false, 
    IsEmailValid = false, 
    IsMobileNoValid = false, 
    IsOverallExpSelected = false, 
    IsRelaventExpSelected = false,
    IsDepSelected = false, 
    IsRoleSelected = false,
    IsZoneSelected = false,
    IsBranchSelected = false,
    IsFileAttached = false;

////////////////////////////////// fullName email mobileno //////////////////////////////////
nodeFullName.addEventListener('blur', () => {
    const regex = /^[a-z]([-']?[a-z]+)( [a-z]([-']?[a-z]+))+$/;
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

nodeMobileNo.addEventListener('blur', () => {
    const regex = /^([0-9]{10}$)/;
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

const clearRoles = () => {
    role.innerHTML = '<option>Select</option>';
    IsRoleSelected = false;
};

const clearBranches = () => {
    branch.innerHTML = '<option>Select</option>';
    IsBranchSelected = false;
};

// OverallExperience and RelevantExperience
let overallExpData, relevantExpData;
const loadOverallExpData = async () => {
    const body = await getExperience('OVERALL');
    overallExpData = body.data;
    // console.log(body.data)
    setOverallEl();
};
loadOverallExpData();

const loadRelevantExpData = async () => {
    const body = await getExperience('RELEVANT');
    relevantExpData = body.data;
    // console.log(body.data)
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
    IsOverallExpSelected = true;
});

relaventExperience.addEventListener('change', (e) => {
    experienceRelavantID = e.target.value;
    IsRelaventExpSelected = true;
});

/////////////////////////////////// Departments and Roles /////////////////////////////////////

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
    IsDepSelected = true;
    setRoleEl(id);
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
        IsRoleSelected = true
    });
}

///////////////////////////// zones and branches /////////////////////////////////

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
        IsBranchSelected = true;
    });
}

zone.addEventListener('change', (e) => {
    clearBranches();
    let selectedZone = e.target.value;
    IsZoneSelected = true
    loadBranchesData(selectedZone);
});

////////////////////////////////////// file validation ///////////////////////////////////
let resume
attachFile.addEventListener('change', function () {
    const size = (this.files[0].size / 1024 / 1024).toFixed(2);
    resume = $(this).val();
    var extension = resume.split('.').pop();

    if (extension == "pdf" || extension == "docx" || extension == "doc"){
        if(size < 5){
            console.log('Attached correct file!')
            attachFile.classList.remove('is-invalid')
            uploadBtn.disabled = false
            IsFileAttached = true;
        } else{
            alert("File must be less then 5 MB");
            uploadBtn.disabled = true
            attachFile.classList.add('is-invalid')
            IsFileAttached = false;
        }
    } else{
        alert('File format must be pdf or docx or doc')
        uploadBtn.disabled = true
        attachFile.classList.add('is-invalid')
        IsFileAttached = false;
    }
});

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

button.addEventListener('click', (e) => {
    e.preventDefault()
    if(!IsFullNameValid){
        $("#fullName").focus();
        alert('Enter valid Full Name!')
    } else if(!IsEmailValid){
        $("#email").focus();
        alert('Enter valid Email!')
    } else if(!IsMobileNoValid){
        $("#mobileNo").focus();
        alert('Enter valid Mobile Number!')
    } else if(!IsOverallExpSelected){
        $("#overallExperience").focus();
        alert('Select Overall Experience!')
    } else if(!IsRelaventExpSelected){
        $("#relaventExperience").focus();
        alert('Select Relavent Experience!')
    } else if(!IsDepSelected){
        $("#department").focus();
        alert('Select Department!')
    } else if(!IsRoleSelected){
        $("#role").focus();
        alert('Select Role!')
    } else if(!IsZoneSelected){
        $("#zone").focus();
        alert('Select Zone')
    } else if(!IsBranchSelected){
        $("#branch").focus();
        alert('select Branch!')
    } else if(!IsFileAttached){
        $("#attachFile").focus()
        alert('Attach File!')
    } else{
        alert('Data submitted successfully!')
        formSubmit();
    }
});


// the coding train


