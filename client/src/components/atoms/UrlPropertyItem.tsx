import React, { useState, useEffect } from 'react';
import { apiService } from '../../services';
import { Link } from 'react-router-dom';
import Loading from './Loading';

const UrlPropertyItem = (props: any): JSX.Element => {
  const { element } = props;
  const [linkProperties, setLinkProperties] = useState<any>({id: '', type: '', name: ''});
  const [isResource, setIsResource] = useState<any>(null);
  
  const addingLinksToUrlProperties = (): any => {
    apiService.getResourceByUrl(element)
    .then( res => {
      let parts = element.split('/');
      let tmpId = parts[parts.length - 1];
      let tmpType = parts[parts.length - 2];
      let defaultText = tmpType[0].toUpperCase() + tmpType.slice(1, tmpType.length-1) + ' without Name';
      let name = res.name || res.alliases || defaultText;      
      setLinkProperties({
        id: tmpId,
        type: tmpType,
        name
      });
      setIsResource(true);
      
    })
    .catch( () => setIsResource(false) )
  }

  useEffect(addingLinksToUrlProperties, []);

  // return (<Loading size='180' type='ThreeDots' classLoader='link-resource-loading'/>)
  
  if (isResource === null) return (<Loading size='180' type='ThreeDots' classLoader='link-resource-loading'/>)
  if (isResource === false) return (<></>)
  return (
    <Link key={linkProperties.id} to={`/details/${linkProperties.type}/${linkProperties.id}`}>
      <span className="value-type-url">{linkProperties.name}</span>
    </Link>
  )
}

export default UrlPropertyItem;