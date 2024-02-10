import './App.css';
import { useState, useRef, useEffect } from "react";

const App = () => {
    const [ otpDigits, setOtpDigits ] = useState( new Array( 6 ).fill( '' ) );
    const [ disabledButton, setDisabledButton ] = useState( true )
    const [ showError, setShowError ] = useState( false )
    const inputRefs = useRef( [] );
    const submitButtonRef = useRef( null );

    useEffect( () => {
        // Check if all input fields are filled with valid numbers
        const isAllDigitsEntered = otpDigits.every( digit => /^\d$/.test( digit ) );
        // If all digits are entered, focus on the submit button
        if (isAllDigitsEntered) {
            setDisabledButton( false )
            setShowError( false )
            setTimeout( () => {
                submitButtonRef.current.focus();
            }, 1 );
        } else {
            setDisabledButton( true )
        }
    }, [ otpDigits ] );

    const handleChange = ( e ) => {
        const index = parseInt( e.target.name );
        const value = e.target.value;

        if (/^\d*$/.test( value )) {
            const newOtpDigits = [ ...otpDigits ];
            newOtpDigits[index] = value;
            setOtpDigits( newOtpDigits );

            if (value !== '' && index < otpDigits.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handlePaste = ( e ) => {
        const pastedData = e.clipboardData.getData( 'text/plain' );

        if (/^\d{6}$/.test( pastedData )) {
            const newOtpDigits = [ ...otpDigits ];
            pastedData.split( '' ).forEach( ( num, idx ) => {
                newOtpDigits[idx] = num;
            } );
            setShowError( false )
            setOtpDigits( newOtpDigits );
        } else {
            setShowError( true )
        }
        e.preventDefault();
    };

    const handleKeyDown = ( e, idx ) => {
        const keyCode = e.keyCode;

        if (keyCode === 8 || keyCode === 46) { // Backspace or Delete
            const newOtpDigits = [ ...otpDigits ];
            newOtpDigits[idx] = '';
            setOtpDigits( newOtpDigits );
        } else if (keyCode === 9 && e.shiftKey && idx > 0) { // Shift + Tab
            e.preventDefault();
            inputRefs.current[idx - 1].focus();
        } else if (keyCode === 37 && idx > 0) { // Left Arrow
            inputRefs.current[idx - 1].focus();
        } else if (keyCode === 39 && idx < otpDigits.length - 1) { // Right Arrow
            inputRefs.current[idx + 1].focus();
        }
    }

    const handleFocus = ( e ) => {
        requestAnimationFrame( () => {
            e.target.setSelectionRange( e.target.value.length, e.target.value.length );
        } );
    };

    const handleSubmit = ( e ) => {
        e.preventDefault()
        console.log( 'button' )
    }

    return (
        <div className="wrapper">
            <div className="heading">
                <h2>OTP Verification</h2>
                <p>Please enter the code we have sent you.</p>
            </div>
            <form onSubmit={ handleSubmit }>
                <div id="otp-container">
                    { otpDigits.map( ( digit, idx ) => (
                        <input
                            ref={ ( el ) => ( inputRefs.current[idx] = el ) }
                            type="text"
                            placeholder="X"
                            className="otp-number"
                            key={ idx }
                            value={ digit }
                            name={ String( idx ) }
                            maxLength={ 1 }
                            onChange={ ( e ) => handleChange( e, idx ) }
                            onKeyDown={ ( e ) => handleKeyDown( e, idx ) }
                            onPaste={ handlePaste }
                            onFocus={ handleFocus }
                            aria-label={ `Digit ${ idx + 1 }` }
                            aria-describedby={ `digit-${ idx + 1 }-desc` }
                        />
                    ) ) }
                </div>
                { showError &&
                    <span id="error-message" style={ {textAlign: 'center', color: 'red', marginTop: '10px'} }
                          aria-live="assertive"
                          aria-atomic="true">Please enter appropriate
                        code</span> }
                <input ref={ submitButtonRef } type="submit" value="Submit"
                       disabled={ disabledButton }
                       className={ `submit-button ${ disabledButton ? "disabled" : "" }` }
                       aria-label="Submit Button"
                />
            </form>
        </div>
    );
}
export default App;

