import logoImg from '../../assets/logo/logo.svg';
import { Container } from '../../components/container';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import { auth } from '../../services/firebaseConnection';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthContext';

import toast from 'react-hot-toast';



const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório!"),
    email: z.string().email("Digite um email válido!").nonempty("O campo email é obrigatório!"),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres!")
})

type FormData = z.infer<typeof schema>;

export function Registro() {

    const { handleInfoUser } = useContext(AuthContext);

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    useEffect(() => {
        async function handleLogout() {
            await signOut(auth);
        }

        handleLogout();
    }, [])



    async function onSubmit(data: FormData) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (user) => {
                await updateProfile((user.user), {
                    displayName: data.name
                })

                handleInfoUser({
                    name: data.name,
                    email: data.email,
                    uid: user.user.uid
                })

                console.log("Usuário cadastrado com sucesso!")
                toast.success("Bem vindo ao WebCarros!")
                navigate("/dashboard", { replace: true });
            })
            .catch((error) => {
                console.log("Erro ao cadastrar usuário!", error);
            })
    }

    return (
        <Container>
            <div className='w-full min-h-screen flex items-center justify-center flex-col gap-4'>

                <Link to='/' className=' mb-6 max-w-sm w-full'>
                    <img src={logoImg} alt="Logo" className='w-full' />
                </Link>

                <form className='w-full max-w-xl bg-white rounded-lg p-4' onSubmit={handleSubmit(onSubmit)}>

                    <div className='mb-3'>
                        <Input
                            type='text'
                            placeholder='Digite seu nome completo...'
                            name='name'
                            error={errors.name?.message}
                            register={register}
                        />
                    </div>


                    <div className='mb-3'>
                        <Input
                            type='email'
                            placeholder='Digite seu email...'
                            name='email'
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                    <div className='mb-3'>
                        <Input
                            type='password'
                            placeholder='Digite sua senha...'
                            name='password'
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>

                    <button type='submit' className='w-full bg-zinc-900 rounded-md text-white h-10 font-medium'>
                        Cadastrar
                    </button>
                </form>

                <Link to='/login'>
                    Já possui uma conta? Faça o login!
                </Link>



            </div>
        </Container>
    )
}