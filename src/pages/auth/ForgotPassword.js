import React, { useState } from 'react';
import axios from 'axios';
import { isEmail } from '../../utils/validation/Validation';
import { Alert } from 'react-bootstrap';

const initialState = {
    email: '',
    err: '',
    success: ''
}

function ForgotPassword() {
    const [data, setData] = useState(initialState);

    const { email, err, success } = data;

    const handleChangeInput = e => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value, err: '', success: '' });
    };

    const forgotPassword = async () => {
        if (!isEmail(email))
            return setData({ ...data, err: 'Adresse e-mail invalide.', success: '' });

        try {
            const res = await axios.post('/api/forgot', { email });
            return setData({ ...data, err: '', success: res.data.msg });
        } catch (err) {
            err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' });
        }
    };

    return (
        <div className="container mt-4">
            {err && <Alert variant="danger">{err}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <h2 className="text-center">Mot de passe oublié?</h2>
            <div className="row">
                <label htmlFor="email">Entrez votre adresse e-mail</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="Entrez votre e-mail"
                    value={email}
                    onChange={handleChangeInput}
                />
                <button className="btn btn-primary mt-4" onClick={forgotPassword}>Vérifier votre e-mail</button>
            </div>
        </div>
    );
}

export default ForgotPassword;
