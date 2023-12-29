import React from 'react'
import { useForm } from 'react-hook-form'

export default function Signup() {

    const { handleSubmit, formState:{errors} } = useForm()
    // const handleSignUpForm = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData(e.target)

    //     console.log(formData);

    // }
    return (
        <div>
            <form method="post" onSubmit={ handleSubmit }>
                name
                <br />
                <input type="text" name="name" id="name" />
                <br />
                username
                <br />
                <input type="text" name="username" id="username" />
                <br />
                password
                <br />
                <input type="text" name="password" id="password" />
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}
