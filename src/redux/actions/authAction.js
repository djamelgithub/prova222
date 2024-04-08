import { GLOBALTYPES } from './globalTypes'
import { postDataAPI } from '../../utils/fetchData'
import valid from '../../utils/valid'


export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('login', data)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}


export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin") // se obtiene el indicador que el el primer login
    if(firstLogin){   //si es el pirùer mpgo,
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        try {
            const res = await postDataAPI('refresh_token')//se envia una solicitud a la tuta refresh_token para pedir un acces tpken el cual se ejecuta el cntroador generateaccetoken 
            //generateaccesstoke controlador que se ejecuta en el sevidor el cual obiene el refresh toke de req.cookie.refrestoken
            dispatch({ 
                type: GLOBALTYPES.AUTH, //se recibe al acces token y user desde res.data
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                } 
            })

            dispatch({ type: GLOBALTYPES.ALERT, payload: {} })

        } catch (err) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.msg
                } 
            })
        }
    }
}

export const register = (data) => async (dispatch) => {
    const check = valid(data)
    if(check.errLength > 0)
    return dispatch({type: GLOBALTYPES.ALERT, payload: check.errMsg})

    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        const res = await postDataAPI('register', data)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}


export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('firstLogin')//primero elimina el elemento "firstLogin" del almacenamiento local del navegador (indicando que el usuario ya no está autenticado).
        await postDataAPI('logout')
        window.location.href = "/"
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

 