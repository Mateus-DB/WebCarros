import { useState, useEffect, useContext } from "react"
import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/panelheader"

import { FiTrash2 } from "react-icons/fi"

import { db, storage } from "../../services/firebaseConnection"
import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { AuthContext } from "../../contexts/AuthContext"

import toast from "react-hot-toast"

interface CarsProps {
    id: string;
    name: string;
    year: string;
    price: string | number;
    city: string;
    km: string;
    uid: string
    images: ImagesProps[];
}

interface ImagesProps {
    name: string;
    uid: string;
    url: string
}

export function Dashboard() {

    const [cars, setCars] = useState<CarsProps[]>([]);
    const [loadCars, setLoadCars] = useState<string[]>([])
    const { user } = useContext(AuthContext);

    useEffect(() => {
        function loadCars() {

            if (!user?.uid) {
                return;
            }

            const carsRef = collection(db, "cars");
            const queryRef = query(carsRef, where("uid", "==", user.uid));

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
        loadCars();
    }, [user])

    async function handleDeleteCar(car: CarsProps) {

        const itemCar = car;

        const docRef = doc(db, 'cars', itemCar.id);
        await deleteDoc(docRef);

        itemCar.images.map(async (image) => {

            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath);

            try {
                await deleteObject(imageRef);
                setCars(cars.filter(car => car.id !== itemCar.id));
                toast.success("Carro deletado com sucesso!")
            } catch (error) {
                console.log("Erro ao deletar a imagem", error);
            }
        })


    }

    function handleImageLoad(id: string) {
        setLoadCars((prevloadCars) => [...prevloadCars, id])
    }

    return (
        <Container>
            <DashboardHeader />

            <main className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {cars.map(car => (
                    <section key={car.id} className="w-full bg-white rounded-lg relative">

                        <button className="absolute w-14 h-14 bg-white rounded-full flex items-center justify-center right-2 top-2 cursor-pointer drop-shadow " onClick={() => handleDeleteCar(car)}>
                            <FiTrash2 size={26} color="#000" className="transform scale-100 hover:scale-110 transition " />
                        </button>

                        <div className="w-full rounded-lg h-72 bg-slate-200"
                            style={{ display: loadCars.includes(car.id) ? 'none' : 'block' }}>
                        </div>

                        <img onLoad={() => handleImageLoad(car.id)}
                            className="w-full rounded-lg mb-2 max-h-72"
                            src={car.images[0].url} alt="imagem do carro"
                            style={{ display: loadCars.includes(car.id) ? 'block' : 'none' }}

                        />

                        <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

                        <div className="flex flex-col px-2">

                            <span className="text-zinc-700"> Ano {car.year} | {car.km} KM</span>
                            <strong className="text-black font-bold mt-4"> R$ {car.price}</strong>

                        </div>

                        <div className="w-full bg-slate-200 h-px my-2"></div>

                        <div className="px-2 pb-2">
                            <span className="text-black ">{car.city}</span>
                        </div>

                    </section>
                ))}

            </main>
        </Container>

    )
}