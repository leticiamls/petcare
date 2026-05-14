import React from 'react'
import { Button } from '../components/ui/button';
import { CardTitle } from '../components/ui/card';

const Login = () => {
    return(
        <div className="font-texto relative flex flex-col gap-6 p-8 bg-bege border-4 border-cianoEscuro shadow-3xl rounded-[2.5rem] max-w-md">
            <form>
            <CardTitle className='text-ciano'>Petcare</CardTitle>
            <div>
                <label className="text-ciano font-bold ml-1 self-start">Login</label>
                <div className='flex flex-col gap-2'>
        <input name='email' type='email' placeholder="Ex.: seuemail@gmail.com" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none"></input>
        </div>
            </div>
             <div className='flex flex-col gap-2'>
        <input name='senha' type='password' placeholder="Sua Senha" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none"></input>
        </div>
            </form>
            <Button variant='primary' type='submit'>Logar</Button>
        </div>
    );
};

export default Login;