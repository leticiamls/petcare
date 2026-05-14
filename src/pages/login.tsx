import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate(); 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const tokenFake = "12345";
        localStorage.setItem('token', 'tokenFake');

        alert("Enviando os dados:" + email + " - " + password);
        
        console.log("Iniciando login para:", { email, password });

        navigate('/dashboard')
    };

    return (
        <div className='flex flex-col gap-4 bg-bege p-6 rounded-lg'>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <CardTitle className='text-ciano text-center'>Petcare</CardTitle>
                
                <div className='flex flex-col gap-2'>
                    <label className="text-ciano text-2xl font-bold ml-1 self-start">
                        Login
                    </label>
                    
                    <input 
                        name='email' 
                        type='email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex.: seuemail@gmail.com" 
                        className="w-full p-3 rounded-xl border-2 border-cianoEscuro shadow-3xl bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                        required
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <input 
                        name='senha' 
                        type='password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua Senha" 
                        className="w-full p-3 rounded-xl border-2 border-cianoEscuro shadow-3xl bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                        required
                    />
                </div>

                <div className='recall-forget text-sm text-right'>
                    <a href="#" className="hover:underline">Esqueceu a senha?</a> 
                </div>

                <Button variant='primary' type='submit' className="mt-2">
                    Logar
                </Button>
            </form>
        </div>
    );
};

export default Login;