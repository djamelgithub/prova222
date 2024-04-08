import React, { useEffect } from 'react'
 

import LoadIcon from '../../images/loading.gif'
 
 
import Serviciospendientess from '../../components/homeServicio/Serviciospendientess'
import { useSelector  } from 'react-redux';
let scroll = 0;

const Serviciospendientes = () => {
 
  const { servicioaproveReducer  } = useSelector(state => state)
   
  window.addEventListener('scroll', () => {
    if (window.location.pathname === '/') {
      scroll = window.pageYOffset
      return scroll;
    }
  })

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: scroll, behavior: 'smooth' })
    }, 100)
  }, [])
   

  return (
   
 
        <div className="home">






          {
            servicioaproveReducer.loading
              ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
              : (servicioaproveReducer.servicios === 0 && servicioaproveReducer.servicios.length === 0)
                ?    <h2 className="text-center">Aucun résultat trouvé pour cette recherche</h2>
                : <Serviciospendientess/>
          }


 


        </div>

    
  )
}
export default Serviciospendientes

