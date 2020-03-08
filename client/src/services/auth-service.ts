import axios from 'axios';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const http = axios.create({
  baseURL: 'http://localhost:4000/auth',
  cancelToken: source.token,
  withCredentials: true
})

const signup = async (username: string, password: string): Promise<any> => {
  const response = await http.post('/signup', { username, password })
  console.log(response)
  console.log(response.data)
  return response.data;
}

const loggedin = async (): Promise<any> => {
  const response = await http.get('/loggedin')
  return response.data;
}

const login = async (username: string, password: string): Promise<any> => {
  const response = await http.post('/login', { username, password })
  return response.data;
}

const logout = async (): Promise<any> => {
  const response = await http.post('/logout', {})
  return response.data;
}

const cancelSource = () => source.cancel();

export default {
  signup,
  loggedin,
  login,
  logout,
  cancelSource
};