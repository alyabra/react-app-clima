import { useState, createContext } from "react";
import axios from "axios";
const ClimaContext = createContext()

const ClimaProvider = ({children}) => {
    // console.log(import.meta.env.VITE_API_KEY)
    const [busqueda, setBusqueda] = useState({
        ciudad: '',
        pais: ''
    })
    const [resultado, setResultado] = useState({})
    const [cargando, setCargando] = useState(false)
    const [noResultado, setNoResultado] = useState('')

    const datosBusqueda = e => {
        setBusqueda({
            ...busqueda,
            [e.target.name]: e.target.value
        })
    }

    const consultarClima = async datos => {
        setCargando(true)
        setNoResultado('')
        setResultado({})
       try {
        const { ciudad, pais} = datos
        const appID = import.meta.env.VITE_API_KEY
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${appID}`

        const { data } = await axios(url)
        const {lat, lon} = data[0]
        const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appID}`

        const { data: clima } = await axios(urlClima)
        setResultado(clima)
        // console.log(resultado)
       } catch(error) {
            // console.log(error)
            setNoResultado('No hay resultados')
       } finally {
        setCargando(false)

       }
    }
    return (
        <ClimaContext.Provider
            value={{
                busqueda,
                datosBusqueda,
                consultarClima, 
                resultado,
                cargando,
                noResultado
            }}
        >
            {children}
        </ClimaContext.Provider>
    )
}
export {
    ClimaProvider
}
export default ClimaContext