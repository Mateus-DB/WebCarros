import { useState, useEffect } from "react";
import { Container } from "../../components/container";
import { Link } from "react-router-dom";

import { db } from "../../services/firebaseConnection";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "firebase/firestore";

interface CarsProps {
    id: string,
    name: string,
    year: string,
    uid: string,
    price: string | number,
    city: string,
    km: string,
    images: CarImageProps[]
}

interface CarImageProps {
    name: string,
    uid: string,
    url: string
}

export function Home() {

    const [cars, setCars] = useState<CarsProps[]>([]);
    const [loadImages, setLoadImages] = useState<string[]>([])
    const [input, setInput] = useState("");

    useEffect(() => {
        loadCars();
    }, [])

    function loadCars() {
        const carsRef = collection(db, "cars");
        const queryRef = query(carsRef, orderBy("created", "desc"));

        getDocs(queryRef)
            .then((snapshot) => {
                let carList = [] as CarsProps[]

                snapshot.forEach(doc => {
                    carList.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        city: doc.data().city,
                        price: doc.data().price,
                        images: doc.data().images,
                        uid: doc.data().uid

                    })
                })

                setCars(carList);
            })
    }

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoad) => [...prevImageLoad, id])
    }

    async function handleSearchCar() {
        if (input === "") {
            loadCars();
            return;
        }

        setCars([]);
        setLoadImages([]);

        const q = query(collection(db, "cars"),
            where("name", ">=", input.toUpperCase()),
            where("name", "<=", input.toUpperCase() + "\uf8ff")
        );

        const querySnapshot = await getDocs(q);
        let carList = [] as CarsProps[]

        querySnapshot.forEach(doc => {
            carList.push({
                id: doc.id,
                name: doc.data().name,
                year: doc.data().year,
                km: doc.data().km,
                city: doc.data().city,
                price: doc.data().price,
                images: doc.data().images,
                uid: doc.data().uid

            })
        })

        setCars(carList);
    }

    return (
        <Container>
            <section className="w-full max-w-3xl mx-auto flex items-center justify-center gap-2 rounded-lg bg-white p-4">
                <input className="w-full rounded-lg h-9 outline-none px-3 border-2" type="text" placeholder="Digite o nome do carro..." value={input} onChange={(e) => setInput(e.target.value)} />

                <button className="bg-red-500 font-medium rounded-lg text-white h-9 px-8 text-lg " onClick={handleSearchCar}>
                    Buscar
                </button>
            </section>

            <h1 className="text-center text-2xl font-bold mt-6 mb-4">Carros novos e usados em todo Brasil</h1>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                {cars.map(car => (
                    <Link key={car.id} to={`/car/${car.id}`}>
                        <section className="bg-white rounded-lg w-full">
                            <div
                                className="w-full rounded-lg h-72 bg-slate-200 "
                                style={{ display: loadImages.includes(car.id) ? "none" : "block" }}
                            ></div>
                            <img
                                className="w-full rounded-lg max-h-72 mb-2 hover:scale-105 transition-all"
                                src={car.images[0].url}
                                alt="imagem do carro"
                                style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
                                onLoad={() => handleImageLoad(car.id)}
                            />
                            <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

                            <div className="flex flex-col px-2">
                                <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km} KM</span>
                                <strong className="text-black font-medium text-xl">R$ {car.price}</strong>
                            </div>

                            <div className="h-px w-full bg-slate-200 my-2"></div>

                            <div className="px-2 pb-2">
                                <span className="text-black">{car.city}</span></div>
                        </section>
                    </Link>
                ))}

            </main>
        </Container >

    )
}