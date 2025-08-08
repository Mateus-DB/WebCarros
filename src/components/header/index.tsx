import logoImg from '../../assets/logo/logo.svg'
import { Link } from 'react-router-dom';
import { FiUser, FiLogIn } from 'react-icons/fi';

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function Header() {

    const { loadingAuth, signed } = useContext(AuthContext);


    return (

        <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4'>
            <header className='flex items-center justify-between max-w-7xl px-4 w-full mx-auto'>
                <Link to='/'>
                    <img src={logoImg} alt="logo do site" />
                </Link>

                {!loadingAuth && signed && (

                    <div className=' border-2 rounded-full p-1 border-gray-900'>
                        <Link to='/dashboard'>
                            <FiUser size={22} color='#000' />
                        </Link>
                    </div>

                )}

                {!loadingAuth && !signed && (
                    <div className=' border-2 rounded-full p-1 border-gray-900'>
                        <Link to='/login'>
                            <FiLogIn title='Fazer login' size={22} color='#000' />
                        </Link>
                    </div>
                )}
            </header>
        </div >

    )
}

