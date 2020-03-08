import React, { useState, useEffect } from 'react';

type propertyType = "name" | "gender" | "isbn" | "region"; 

const Filters = (props: any) => {

  const [typeResource, setTypeResource] = useState<string>('books');
  const [listOfParameters, setListOfParameters] = useState<Array<propertyType>>(['name']);
  const [parameters, setParameters] = useState<any>({});
  const [showRefine, setShowRefine] = useState<string>('hidden');
  const [freeText, setFreeText] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('')

  useEffect(()=> {
    let arrParameters, type;
    type = (props.typeResource) ? props.typeResource : 'books';
      setTypeResource(type);
      setListOfParameters(props.possibleParameters[type]);
      arrParameters = props.possibleParameters[type];
      setParameters({
        [arrParameters['0']]: '',
        [arrParameters['1']]: ''
      });
  },[props]);


  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target;
    setTypeResource(value);
    props.showSelection(value);
    const arrParameters = props.possibleParameters[value];
    setParameters({
      [arrParameters['0']]: '',
      [arrParameters['1']]: ''
    });
    setListOfParameters(arrParameters);
    setShowRefine('')
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setParameters((prev: any) => {
      return {
        ...prev,
        [name]: value
      }
    })
    setShowRefine('')
  }

  const cleanEmptyParameters = (): void => {
    Object.values(parameters).forEach((element, index) => {
      if (!element || element === null || element === undefined) {
        let property = Object.keys(parameters)[index];
        delete parameters[property]
      }
    })
  }

  const applyFilters = (): void => {
    cleanEmptyParameters();
    props.applyFilters(typeResource, parameters)
    .then (() => {
      setParameters({
        [arrParameters['0']]: '',
        [arrParameters['1']]: ''
      });
    })
    const arrParameters = props.possibleParameters[typeResource];
  }

  const handleFreeTextInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setFreeText(value);
  }

  const refineSearch = (): void => {
    if(freeText.length > 3) props.freeSearch(freeText)
    else setErrorText('4 characters minimum!')
  }

  return (
    <section className="filters">
      
      <div className="inside-filters">
        <select className="type-resource" onChange={handleSelect} value={typeResource}>
          <option disabled value="">Please select a type here</option>
          <option value="books">Books</option>
          <option value="characters">Characters</option>
          <option value="houses">Houses</option>
        </select>
        
        {
          listOfParameters.map( (element: any, index: number): JSX.Element => 
            <input type="text" key={index} value={parameters[element] || ''} name={element} placeholder={element} 
              onChange={handleInput}/>)
        }
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div className={`inside-filters ${showRefine}`}>

        <p>Refine your search</p>
        <input type="text" value={freeText} onChange={handleFreeTextInput} onFocus={() => setErrorText('')}
          placeholder="In the current results, I am looking for..."/>
        <button onClick={refineSearch}>Re-filter your results</button>

        <div className="warning">
          <p className={errorText ? 'is-visible' : 'is-hide'}>{errorText}</p>
        </div>

      </div>
    </section>
  )

}

export default Filters;