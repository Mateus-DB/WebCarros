import { useState, useEffect } from "react";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

import { db } from "../../services/firebaseConnection";
import { getDoc, doc } from "firebase/firestore";

import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps {
    id: string;
    name: string;
    year: string;
    price: string | number;
    city: string;
    description: string;
    km: string;
    model: string;
    created: string;
    owner: string;
    uid: string;
    whatsapp: string
    images: ImagesCarProps[];
}

interface ImagesCarProps {
    name: string;
    uid: string;
    url: string;
}

export function CarDetails() {

    const { id } = useParams();
    const [car, setCar] = useState<CarProps>();
    const [sliderPreview, setSliderPreview] = useState<number>(2);
    const navigate = useNavigate();

    useEffect(() => {
        async function LoadCar() {
            if (!id) { return }

            const docRef = doc(db, "cars", id);
            getDoc(docRef)
                .then((snapshot) => {

                    if (!snapshot.data()) {
                        navigate("/")
                    }

                    setCar({
                        id: snapshot.id,
                        name: snapshot.data()?.name,
                        year: snapshot.data()?.year,
                        city: snapshot.data()?.city,
                        price: snapshot.data()?.price,
                        model: snapshot.data()?.model,
                        description: snapshot.data()?.description,
                        km: snapshot.data()?.km,
                        created: snapshot.data()?.created,
                        owner: snapshot.data()?.owner,
                        uid: snapshot.data()?.uid,
                        whatsapp: snapshot.data()?.whatsapp,
                        images: snapshot.data()?.images
                    })
                })
        }

        LoadCar();
    }, [id])

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 720) {
                setSliderPreview(1)
            } else {
                setSliderPreview(2);
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    return (
        <Container>
            {car && (
                <Swiper slidesPerView={sliderPreview} pagination={{ clickable: true }} navigation>
                    {car?.images.map((image) => (
                        <SwiperSlide key={image.name}>
                            <img src={image.url} alt="imagem do carro" className="w-full h-96 object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {car && (
                <main className="w-full bg-white rounded-lg p-6 my-4">

                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                        <h1 className="font-bold text-3xl text-black ">{car?.name}</h1>
                        <h1 className="font-bold text-3xl text-black ">R$ {car?.price}</h1>
                    </div>

                    <p>{car?.model}</p>

                    <div className="flex w-full gap-6 my-4">

                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Cidade</p>
                                <strong>{car?.city}</strong>
                            </div>
                            <div>
                                <p>Ano</p>
                                <strong>{car?.year}</strong>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Km</p>
                                <strong>{car?.km}</strong>
                            </div>

                        </div>

                    </div>

                    <strong>Descrição:</strong>
                    <p className="mb-4">{car?.description}</p>

                    <strong>Telefone / Whatsapp</strong>
                    <p>{car?.whatsapp}</p>

                    <a className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer"
                        href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi esse ${car?.name} no site WebCarros e fiquei interessado!`}
                        target="_blank" rel="noopener noreferrer"
                    >
                        Conversar com o vendedor
                        <FaWhatsapp size={26} color="#fff" />
                    </a>
                </main>
            )}



        </Container>
    )
}