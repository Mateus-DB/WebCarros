import { type ChangeEvent, useState, useContext } from "react"
import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/panelheader"

import { FiUpload, FiTrash } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { Input } from '../../../components/input'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthContext } from "../../../contexts/AuthContext"
import { v4 as uuidv4 } from "uuid"
import toast from "react-hot-toast"
import { storage, db } from "../../../services/firebaseConnection"
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "firebase/storage"

import { addDoc, collection } from "firebase/firestore"


const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório!"),
    model: z.string().nonempty("O campo modelo do carro é obrigatório!"),
    year: z.string().nonempty("O campo ano do carro é obrigatório!"),
    km: z.string().nonempty("O campo km do carro é obrigatório!"),
    price: z.string().nonempty("O campo preço do carro é obrigatório!"),
    city: z.string().nonempty("O campo cidade é obrigatório!"),
    whatsapp: z.string().min(1, "O campo whatsapp é obrigatório!").refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Número de telefone inválido!"
    }),
    description: z.string().nonempty("A descrição é obrigatório!")
})

interface ImageItemProps {
    name: string;
    uid: string;
    previewUrl: string;
    url: string
}

type FormData = z.infer<typeof schema>;

export function New() {

    const { user } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    const [carImage, setCarImage] = useState<ImageItemProps[]>([]);

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === "image/jpeg" || image.type === "image/png") {
                await handleUpload(image)
            } else {
                alert("Envie uma imagem jpeg ou png");
                return;
            }
        }
    }

    async function handleUpload(image: File) {
        if (!user?.uid) {
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidv4();

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadUrl) => {
                    console.log(downloadUrl)
                    const imageItem = {
                        name: uidImage,
                        uid: currentUid,
                        previewUrl: URL.createObjectURL(image),
                        url: downloadUrl
                    }

                    setCarImage((images) => [...images, imageItem])
                    toast.success("Imagem enviada com sucesso!")
                })
            })

    }

    function onSubmit(data: FormData) {

        if (carImage.length === 0) {
            toast.error("Envie pelo menos 1 imagem!")
            return;
        }

        const carListImages = carImage.map(car => {
            return {
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })

        addDoc(collection(db, "cars"), {
            name: data.name.toUpperCase(),
            model: data.model,
            whatsapp: data.whatsapp,
            city: data.city,
            year: data.year,
            km: data.km,
            price: data.price,
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages
        })
            .then(() => {
                reset();
                setCarImage([]);
                console.log('Cadastrado com sucesso!')
                toast.success("Carro cadastrado com sucesso!")
            })
            .catch((erro) => {
                console.log("Error ao cadstrar no banco", erro)
            })
    }

    async function handleDeleteImage(image: ImageItemProps) {
        const imagePath = `images/${image.uid}/${image.name}`;
        const imageRef = ref(storage, imagePath);

        try {
            await deleteObject(imageRef)
            setCarImage(carImage.filter(car => car.url !== image.url

            ))

        } catch (err) {
            console.log('Erro ao deletar')
        }
    }

    return (
        <Container>
            <DashboardHeader />

            <div className="w-full bg-white p-3 rounded lg flex flex-col sm:flex-row items-center gap-2">

                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>

                    <div >
                        <input type="file" accept="image/*" className="opacity-0 cursor-pointer" onChange={handleFile} />
                    </div>

                </button>

                {carImage.map((image) => (
                    <div key={image.name} className="w-full h-32 flex justify-center items-center relative">
                        <button className="absolute cursor-pointer"><FiTrash size={28} color="#fff" onClick={() => handleDeleteImage(image)} /></button>
                        <img src={image.previewUrl} alt="foto da imagem" className="rounded-lg w-full h-32 object-cover" />
                    </div>
                ))}

            </div>

            <div className="w-full bg-white p-2 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2 mb-4">
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Ex: Onix 1.0..."

                        />

                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo do carro</p>
                        <Input
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="Ex: 1.0 Flex PLUS MANUAL..."

                        />

                    </div>

                    <div className="flex flex-row w-full mb-3 items-center gap-4">

                        <div className="w-full">
                            <p className="mb-2 font-medium">Ano</p>
                            <Input
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="Ex: 2016/2016..."

                            />

                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">KM rodados</p>
                            <Input
                                type="text"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="Ex: 23.900..."

                            />

                        </div>

                    </div>

                    <div className="flex flex-row w-full mb-3 items-center gap-4">

                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone / Whatsapp</p>
                            <Input
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="Ex: 11900000000..."

                            />

                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>
                            <Input
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="Ex: São Paulo - SP..."

                            />

                        </div>

                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preço</p>
                        <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: 69.000..."

                        />

                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea
                            className="border-2 w-full rounded-md h-24 px-2"
                            {...register('description')}
                            name="description"
                            id="description"
                            placeholder="Digite a descrição completa sobre o carro..."

                        />
                        {errors.description && <p className="mb-1 text-red-500">{errors.description?.message}</p>}

                    </div>

                    <button type="submit" className="rounded-md text-white bg-zinc-900 font-medium w-full h-10 mb-3">
                        Cadastrar
                    </button>
                </form>
            </div>
        </Container>
    )
}