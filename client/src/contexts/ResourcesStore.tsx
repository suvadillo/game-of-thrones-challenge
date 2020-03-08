import React, { Component } from 'react'

const CURRENT_USER_KEY = 'current-user';

type ResourcesProps = {
  books: Array<any>,
  houses: Array<any>,
  characters: Array<any>
}

type ResourcesContextProps = {
  resources: ResourcesProps,
  typeActive: string,
  handleGetResources: Function,
  setTypeActive: Function
}

const initialResources: ResourcesProps = {
  books: [],
  houses: [],
  characters: []
}

const ResourcesContext = React.createContext<Partial<ResourcesContextProps>>({});

class ResourcesStore extends Component {

  state = {
    user: JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}'),
    resources: initialResources,
    typeActive: "books"
  }

  handleGetResources = (data:Array<any>, type: string): void => {
    if (this.state.user && this.state.user.username) {
      this.setState((prev: any) => {
        let prevRes = prev.resources;
        let obj = {
          ...prevRes,
          [type]: data
        }
        return {resources : obj}
      });
    } else {
      this.setState({ resources: initialResources })
    }        
  }

  setTypeActive = (type: string) => {  
    this.setState({typeActive: type})
  }

  render() {
    return (
      <ResourcesContext.Provider value={{
        resources: this.state.resources,
        handleGetResources: this.handleGetResources,
        setTypeActive: this.setTypeActive,
        typeActive: this.state.typeActive
      }}>
        {this.props.children}
      </ResourcesContext.Provider>
    )
  }
}

const withResourcesConsumer = (Component: React.ElementType) => {
  console.log('resources context entra');
  
  return (props: Object) => (
    <ResourcesContext.Consumer>
      {(storeProps: Object) => <Component {...props} {...storeProps} />}
    </ResourcesContext.Consumer>
  )
}

export { ResourcesContext, ResourcesStore, withResourcesConsumer }
