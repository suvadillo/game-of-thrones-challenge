import React, { useState, useEffect } from 'react';
import { apiService } from '../../services';
import ItemResource from '../atoms/ItemResource';
import { withResourcesConsumer } from '../../contexts/ResourcesStore';
import Filters from '../organisms/Filters';
import NoResults from '../atoms/NoResults';

type resourceType = "books" | "characters" | "houses";

const possibleParameters: any = {
  books: ['name', 'isbn'],
  characters: ['name', 'gender'],
  houses: ['name', 'region']
}

const AllResources: any = (props: any) => {

  const [ resources, setResources ] = useState<Array<any>>([]);
  const [ typeResource, setTypeResource ] = useState<any>('');
  const [ showAdvancedSearch, setShowAdvancedSearch ] = useState<boolean>(false);
  const [ classInput, setClassInput ] = useState<any>({'books': 'active', 'characters': '', 'houses': ''});

  useEffect(() => {
    if (!typeResource) {
      getResourcesByType(props.typeActive);
      setTypeResource(props.typeActive);
      setActiveInput(props.typeActive);
    }
  }, [props, typeResource])

  useEffect(() => {
    window.scrollTo(0, 0);
  })

  const getResourcesByType = async (type: resourceType): Promise<any> => {
    apiService.getAllResourcesByType(type)
    .then( data => setStateAndProps(data, type, false) );
  }

  const setActiveInput = (field: string) => {
    setClassInput({
      'books': '',
      'characters': '',
      'houses': '',
      [field]: 'active'
    })
  }

  const applyFilters = async (type: resourceType, parameters: any) => {
    const keys = Object.keys(parameters);
    if (keys.length === 1) {
      apiService.oneFilterResource(type, keys[0], parameters[keys[0]])
      .then( data => setStateAndProps(data, type, true) );
    } else if(keys.length === 2) {
      apiService.twoFiltersResource(type, keys[0], parameters[keys[0]], keys[1], parameters[keys[1]])
      .then( data => setStateAndProps(data, type, true) );
    }
  }

  const freeSearch = (str: string): any => {

    let tmpRes = resources.filter( (element: any) : any => 
      Object.values(element).join().toLowerCase().includes(str.toLowerCase())
    )
    setResources(tmpRes)
  }

  const setStateAndProps = (data: any, type: string, filtered: boolean) => {
    if(!filtered) props.handleGetResources(data, type);
    setResources(data);
    setActiveInput(type)
  }

  const handleInputButton = (event: any): void => {
    const { value } = event.target;
    setTypeResource(value);
    props.setTypeActive(value);
    showSelection(value);
    setActiveInput(value);
  }

  const showSelection = (value: any): void => {
    const resourcesTemp = props.resources[value];
    (resourcesTemp.length) ? setStateAndProps(resourcesTemp, value, false) : getResourcesByType(value);
    setTypeResource(value);
  }

  const toogleAdvancedSearch = () => setShowAdvancedSearch(!showAdvancedSearch);

  console.log('resources')
  console.log(resources)
  
  return (
    <section className="section-all-resources">
      <div className="section-search-controls">
        <div className={showAdvancedSearch ? 'hidden' : 'simple-search'}>
          <h3>Show resources by type</h3>
  
          <div className="type-resource">
            <input type='button' className={classInput['books']} onClick={handleInputButton} value="books" placeholder='Books'/>
            <input type='button' className={classInput['characters']} onClick={handleInputButton} value="characters" placeholder='Characters'/>
            <input type='button' className={classInput['houses']} onClick={handleInputButton} value="houses" placeholder='Houses'/>
          </div>
          
        </div>
        <div className={showAdvancedSearch ? 'advanced-search' : 'hidden'}>
          <Filters applyFilters={applyFilters} 
            showSelection={showSelection} 
            typeResource={typeResource}
            possibleParameters={possibleParameters}
            freeSearch={freeSearch}/>
        </div>
        <div className="advanced-search-button">
        	<input type="button" className="toggle-advanced-search"
        	      value={showAdvancedSearch ? "Hide Advanced Search" : "Advanced Search"}
        	      onClick={toogleAdvancedSearch}/>
        </div>
      </div>
      
      <div className="list-all-resources">
      { 
        (resources.length === 0) ? <NoResults /> :
        resources.map(data => <ItemResource key={data.id} resource={data} typeResource={typeResource || 'books'} />)
      }
      </div>
    </section>
  )
}

export default withResourcesConsumer(AllResources);