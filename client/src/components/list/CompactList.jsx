import CompactCard from "../card/CompactCard";

function CompactList({ posts, showActions = false, onEdit, onDelete, showMessage = false }) {
  return (
    <div className="flex flex-col gap-3">
      {posts.map(item => (
        <CompactCard 
          key={item.id} 
          item={item} 
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
          showMessage={showMessage}
        />
      ))}
    </div>
  );
}

export default CompactList;
