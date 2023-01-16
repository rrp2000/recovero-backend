const validateString = (input)=>{
    if(!input) return false
    if(input===undefined || input===null) return false
    if(typeof input !== "string") return false
    if(input.trim().length===0) return false
    return true
}
const validateNumber = (input)=>{
    if(!input) return false
    if(input===undefined || input===null) return false
    if(typeof input !== "number") return false
}

const checkOnlyLetters = (input)=>{
    return /^[A-Za-z\s]*$/ .test(input)
}

const checkOnlyNumbers = (input)=>{
    return /^[0-9]+$/.test(input)
}

const validateEmail = (input)=>{
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)
}


module.exports = {validateString, checkOnlyLetters, checkOnlyNumbers, validateEmail, validateNumber} 