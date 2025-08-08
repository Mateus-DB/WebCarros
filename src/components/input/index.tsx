import type { UseFormRegister, RegisterOptions } from "react-hook-form"

interface InputProps {
    type: string;
    placeholder: string;
    name: string;
    error?: string;
    register: UseFormRegister<any>;
    rules?: RegisterOptions;
}

export function Input({ type, placeholder, name, error, register, rules }: InputProps) {
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                id={name}

                className="w-full px-2 border-2 rounded-md h-11"
            />
            {error && <p className="my-1 text-red-500">{error}</p>}
        </div>
    )
} 