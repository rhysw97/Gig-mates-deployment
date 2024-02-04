import React, {useState} from "react";

export default function Password(props) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState([])
    let isValid= {
        eightOrMore: false,
        oneCap: false,
        oneLower: false,
        oneSpecial: false,
        oneNumber: false
    } //to store whether password is valid or not
    
    //state to store message to let user know the passwords don't match
    const [passwordMatchMessage, setPasswordMatchMessage] = useState();

    //regexs to check the 
    const regexs = {
        eightOrMore: /.{8,}/,
        oneCap: /[A-Z]/,
        oneLower: /[a-z]/,
        oneSpecial: /[ `!@#$%^&*()_+\-={};':"\|,.<>\/?~\[\]]/,
        oneNumber: /\d+/,
    }
 
    const passwordMessages = {
        eightOrMore: "eight or more characters",
        oneCap: "One or more capital",
        oneLower: "One or more lowercase",
        oneSpecial: "One or more special character",
        oneNumber: "One or more number"
    }

    //function to take in the requrements the current password and the current value in confirm password
    const checkRequirementsMet = (requirements, currentPassword, currentConfirmPassword) => {
        if(currentPassword === currentConfirmPassword) {
            setPasswordMatchMessage(null)
            const validPassword = Object.values(requirements).every(value => value)
            if (validPassword) {
                props.setIsPasswordValid(true)
                props.setPasswordState(password)
            }
        } else {
            setPasswordMatchMessage(<p className="text-white bg-black rounded-full p-2">Passwords must match</p>)
        } 
    }

    //this function is used to check if the handle password is used each time in the 
    const handlePassword = (event) => {
        setPassword(event.target.value)
        //checks each value at key in is valid against the regex value at same key and returns the result as a new value
        isValid = Object.keys(regexs).reduce((result, key) => {
            result[key] = regexs[key].test(event.target.value)
            return result;
        }, {});
       
        //loops through keys in isValid
        Object.keys(isValid).forEach(key => {
            //checks if value in isValid at current key is false
            if(!isValid[key]) {
                //if the validation message isn't already in passwordRequirements add it by updating state 
                if(!passwordRequirements.includes(passwordMessages[key])) {
                    setPasswordRequirements(requirements => [...requirements, passwordMessages[key]])
                }
            //if the value in isValid is true remove the corresponding message from passwordRequirements state
            } else {
                setPasswordRequirements(requirements => requirements.filter(message => message !== passwordMessages[key]))
            }
        })
        //calls to check if all the password requirements have been met
        checkRequirementsMet(isValid, event.target.value, confirmPassword)
    };

    const handleConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
        checkRequirementsMet(isValid, password, event.target.value)
        
    };

    return (
    <div className="flex flex-col w-full items-center gap-6">
        <div className="flex flex-col items-center w-[100%]">
            <input
            placeholder="password"
                id="password"
                type="password"
                value={password}
                onChange={handlePassword}
                className="input-field"
            />
            <div className="text-white">
              {passwordRequirements.map((requirement, index) => <p className="bg-black rounded-full p-2 text-center mb-2" key={index}>{requirement}</p>)}
            </div>
            
        </div>
        <div className="flex flex-col items-center w-[100%]">
            <input
                placeholder="confirm password"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                className="input-field "
            />
            {passwordMatchMessage}
        </div>
    </div>
    )
}