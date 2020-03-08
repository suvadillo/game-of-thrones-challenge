import axios from 'axios';

const http = axios.create({
  baseURL: 'https://anapioficeandfire.com/api'
})

const http2 = axios.create({});

type resourceType = "books" | "characters" | "houses";
type propertyType = string;
type valuePropertyType = string;

const deleteEmptyFields = (obj: any): void => {
  Object.keys(obj).forEach((element) => {
    if (obj[element].length === 0 || obj[element][0] === "") {
      delete obj[element]
    }
  })
}

const addIndexAndCleanData = (data: Array<any>, resource: resourceType): Array<any> => {
  return data.map(element => {
    deleteEmptyFields(element);
    element.id = element['url'].substr(element['url'].lastIndexOf('/') + 1);
    return element;
  })
}

const getAllResourcesByType = async (resource: resourceType): Promise<any> => {
  const response = await http.get(`/${resource}?pageSize=50`)
  console.log(response)
  addIndexAndCleanData(response.data, resource)
  return response.data;
}

const getResourcesById = async (resource: resourceType, id: string): Promise<any> => {
  const response = await http.get(`/${resource}/${id}`)
  console.log(response)
  deleteEmptyFields(response.data)
  return response.data;
}

const oneFilterResource = 
  async (resourceToFilter: resourceType, proper: propertyType, val: valuePropertyType): Promise<any> => {
    const response = await http.get(`/${resourceToFilter}?${proper}=${val}&pageSize=50`)
    console.log(response)
    addIndexAndCleanData(response.data, resourceToFilter)
    return response.data;
}

const twoFiltersResource = 
  async (resourceToFilter: resourceType, proper1: propertyType, val1: valuePropertyType, proper2: propertyType, val2: valuePropertyType): Promise<any> => {
    const response = await http.get(`/${resourceToFilter}?${proper1}=${val1}&${proper2}=${val2}&pageSize=50`)
    console.log(response)
    addIndexAndCleanData(response.data, resourceToFilter)
    return response.data;
}

const getResourceByUrl = async (url: string): Promise<any> => {
  const response = await http2.get(`${url}`)
  deleteEmptyFields(response.data)
  return response.data;
}

export default {
  getAllResourcesByType,
  getResourcesById,
  oneFilterResource,
  twoFiltersResource,
  getResourceByUrl
};