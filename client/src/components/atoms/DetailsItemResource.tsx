import React, { useState, useEffect } from 'react';
import { apiService } from '../../services';
import { withResourcesConsumer } from '../../contexts/ResourcesStore';
import { Redirect } from 'react-router-dom';
import Loading from './Loading';
import UrlPropertyItem from './UrlPropertyItem';
import Characters from '../../data/characters.json';

const DetailsItemResource = (props: any): any => {
  const { typeResource, id } = props.match.params;
    
  const [resource, setResource] = useState<any>({name: ''});
  const [isResource, setIsResource] =useState<any>(null);

  const [photo, setPhoto] = useState<string>('');

  const setAllValues = async () => {
    await getResource()
    .then (res => {
      // console.log('setallvalues')
      setResource(res)
      setIsResource(true)
      return true
    })
    .catch( () => {
      setIsResource(false)
      return false
    })
  }

  useEffect(() => {
    setAllValues();
    // console.log(isResource);
    return () => {
      setIsResource(null);
      setPhoto('');
    };
  }, [props])

  useEffect(() => {
    window.scrollTo(0, 0); 
  })

  const getResource = async () => {
    let tmp = props.resources[typeResource].filter( (element: any) => element.id === id)[0];
    if (tmp) {
      if (typeResource === "characters") checkMedia(tmp.name)
      return tmp;
    } else {
      const tmpApi = await apiService.getResourcesById( typeResource, id )
      if (typeResource === "characters") checkMedia(tmpApi.name)
      return tmpApi
    }
  }

  const checkMedia = (nameToSearch: string) => {
    const foundCharacter = Characters.characters.filter((ch) => ch.characterName.toLowerCase().includes(nameToSearch.toLowerCase()))[0];
    console.log(foundCharacter)
    if (foundCharacter && foundCharacter.characterImageFull) setPhoto(foundCharacter.characterImageFull);
  }

  const addingLinksToUrlProperties = (element:string, index: number) => {
    if (typeof element === 'string' && element.includes('http')) {
      return (
        <UrlPropertyItem element={element}/>
      )
    }
    return element;
  }

  if (isResource === null) return (<Loading type='Rings' classLoader='single-resource-loading'/>)
  if (isResource === false) return (<Redirect to="/all-resources" />)

  return (
    <div className="single-resource-container">
      <div className="resource-card-header">
        <h3>{resource.name}</h3>
      </div>
      <div className="single-resource-inside-container">
        <div className={`resource-card ${typeResource}`}
          style={(photo) ? {backgroundImage: `url("${photo}")`} : {}}>
          {
            Object.keys(resource).map((element, index) => {
              if (element === 'id' || element === 'url') return (<div key={index} style={{display:'none'}}></div>);
              let value: any = Object.values(resource)[index];
              if (element === 'released') value = value.substring(0, 10);
              if (typeof value === 'object') {
                return (
                  <div key={index} >
                  <p className="resource-property">{element}: </p>
                  {
                    value.map((e: any, i: any) => {
                      let arrElement = addingLinksToUrlProperties(e, i)
                      return (
                        <div key={i}>
                          {arrElement}
                        </div>
                      )
                    })
                  }
                </div>
                )
              }              
              value = addingLinksToUrlProperties(value, index);
              return (
                <div key={index} >
                  <p className="resource-property">{element}: </p>
                  <div>{value}</div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default withResourcesConsumer(DetailsItemResource);