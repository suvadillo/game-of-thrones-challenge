import React from 'react'
import { Link } from 'react-router-dom'

const ItemResource = (props: any) => {
  const { resource } = props;
 
  return (
    <article className="article-home">
      <h3>{resource.name || resource.aliases}</h3>
      <div>
        <Link to={`/details/${props.typeResource}/${resource.id}`}>
          <span className="capitalize">See</span> details
        </Link>
      </div>
    </article>
  )
}

export default ItemResource;