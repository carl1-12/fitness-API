import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';   // ✅ add Link here
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function Login() {

	const notyf = new Notyf();

	const { user, setUser } = useContext(UserContext);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isActive, setIsActive] = useState(true);

	function authenticate(e) {
		e.preventDefault();

		fetch('http://localhost:4000/users/login',{
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email, password })
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			
			if(data.access !== undefined){
				localStorage.setItem('token', data.access);
				retrieveUserDetails(data.access);
				setEmail("");
				setPassword("");
				notyf.success('Successful Login');
			} else if (data.message === "Incorrect email or password") {
				notyf.error('Incorrect Credentials. Try again.');
			} else {
				notyf.error('User not found. Try again.');
			}
		});
	}

	const retrieveUserDetails = (token) => {
		fetch('http://localhost:4000/users/details', {
			headers: { Authorization: `Bearer ${ token }` }
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			setUser({
				id: data._id,
				isAdmin: data.isAdmin
			});
		});
	};

	useEffect(() => {
		if(email !== '' && password !== ''){
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [email, password]);

	return (
		<Form onSubmit={(e) => authenticate(e)} className="p-4">
			<h1 className="my-4 text-center">Login</h1>

			<Form.Group controlId="userEmail" className="mb-3">
				<Form.Label>Email address</Form.Label>
				<Form.Control 
					type="text"
					placeholder="Enter email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</Form.Group>

			<Form.Group controlId="password" className="mb-3">
				<Form.Label>Password</Form.Label>
				<Form.Control 
					type="password" 
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</Form.Group>

			{isActive ? 
				<Button variant="primary" type="submit" id="submitBtn" className="w-100">
					Login
				</Button>
				: 
				<Button variant="danger" type="submit" id="submitBtn" disabled className="w-100">
					Login
				</Button>
			}

			{/* ✅ Added link to register */}
			<div className="text-center mt-3">
				<small>Don’t have an account? <Link to="/register">Register here</Link></small>
			</div>
		</Form>
	);
}
