import Card from"../card/Card"

function List({posts, showActions = false, onEdit, onDelete}){
  return (
    <div className='flex flex-col gap-12'>
      {posts.map(item=>(
        <Card 
          key={item.id} 
          item={item} 
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default List