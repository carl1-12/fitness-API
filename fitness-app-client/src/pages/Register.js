import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function Register() {

    const notyf = new Notyf();
    const { setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    function registerUser(e) {
        e.preventDefault();

        fetch('http://localhost:4000/users/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.message === "Registered Successfully") {
                notyf.success('Registration Successful! Please log in.');

                // clear the form
                setEmail('');
                setPassword('');
                setConfirmPassword('');

            } else if (data.error === "Email already registered") {
                notyf.error('Email already exists.');
            } else {
                notyf.error(data.error || 'Something went wrong. Try again.');
            }
        });
    }

    useEffect(() => {
        if (
            email !== '' &&
            password !== '' &&
            confirmPassword !== '' &&
            password === confirmPassword
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password, confirmPassword]);

    return (
        <Form onSubmit={registerUser}>
            <h1 className="my-5 text-center">Register</h1>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />
            </Form.Group>

            {isActive ? 
                <Button variant="primary" type="submit" className="mt-3">
                    Register
                </Button>
                :
                <Button variant="danger" type="submit" className="mt-3" disabled>
                    Register
                </Button>
            }
        </Form>
    );
}
